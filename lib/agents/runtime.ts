import type {
  AgentRun,
  AgentRunContext,
  AgentSpec,
  ConversationMessage,
  FlowDefinition,
} from "@/db/agents/schema";
import { agentRunRepository } from "@/repositories/agent-run.repository";
import { runAgent, type LLMRunResult } from "./llm-provider";
import {
  estimateCost,
  estimateCostFromUsageRecords,
  createTimer,
} from "./observability";
import {
  OPENAI_USAGE_LEDGER_META_KEY,
  OPENAI_USAGE_SUMMARY_META_KEY,
  rollupRecords,
  summarizeUsageRecords,
} from "@/lib/agents/usage";
import { executeFlow } from "./flow/executor";
import { buildConversationHistory } from "./conversation-history";
import { noopSink, type RunEventSink } from "@/lib/agents/streaming";
import { registerProposalLifecycleSink } from "@/lib/agents/streaming/proposal-lifecycle-bus";

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface ExecuteAgentRunParams {
  agentSpec: AgentSpec;
  input: string;
  triggeredBy: string;
  sessionId?: string;
  meta?: Record<string, unknown>;
  flowDefinition?: FlowDefinition | null;
  envOverrides?: Record<string, string>;
  publishedEnvOverrides?: Record<string, string>;
  sessionEnvOverrides?: Record<string, string>;
  sink?: RunEventSink;
  signal?: AbortSignal;
}

/**
 * Execute an agent run end-to-end:
 * 1. If flowDefinition is present, delegate to the flow executor
 * 2. Otherwise run a single agent via the LLM provider
 * 3. Record observability data (tokens, cost, duration)
 * 4. Mark the run completed or failed
 */
export async function executeAgentRun(
  params: ExecuteAgentRunParams
): Promise<AgentRun> {
  const {
    agentSpec, input, triggeredBy, sessionId,
    meta, flowDefinition, envOverrides, publishedEnvOverrides, sessionEnvOverrides,
    sink: paramSink, signal,
  } = params;
  const sink: RunEventSink = paramSink ?? noopSink;

  if (flowDefinition) {
    return executeFlow({
      flowDefinition,
      agentDefinitionId: agentSpec.definitionId,
      input,
      triggeredBy,
      sessionId,
      runModel: agentSpec.model,
      meta,
      envOverrides,
      publishedEnvOverrides,
      sessionEnvOverrides,
      sink,
      signal,
    });
  }

  const agentRun = await agentRunRepository.create({
    agentDefinitionId: agentSpec.definitionId,
    sessionId,
    input,
    triggeredBy,
    meta: { ...(meta ?? {}), model: agentSpec.model },
  });

  sink.setContext?.({ runId: agentRun.id, sessionId: sessionId ?? null });
  sink.emit("ready", { runId: agentRun.id });
  const unregisterProposalSink = registerProposalLifecycleSink(agentRun.id, sink);

  const timer = createTimer();

  const context: AgentRunContext = {
    runId: agentRun.id,
    triggeredBy,
  };

  let result: LLMRunResult;

  try {
    let llmInput: string | ConversationMessage[] = input;
    if (sessionId) {
      const conversationHistory = await buildConversationHistory(sessionId, null);
      if (conversationHistory.length > 0) {
        llmInput = [...conversationHistory, { role: "user", content: input }];
      }
    }

    result = await runAgent(agentSpec, llmInput, context, {
      phase: "single_agent_run",
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    sink.emit("error", { message: errorMsg });
    return agentRunRepository.fail(agentRun.id, errorMsg);
  } finally {
    unregisterProposalSink();
  }

  const durationMs = timer.elapsed();
  const records = result.usageRecords;
  const roll = rollupRecords(records);
  const tokenUsage =
    roll.total > 0
      ? {
          prompt: roll.prompt,
          completion: roll.completion,
          total: roll.total,
          ...(roll.cachedInput != null ? { cachedPrompt: roll.cachedInput } : {}),
        }
      : result.usage;

  const costFromRecords = estimateCostFromUsageRecords(records);
  const costEstimate =
    costFromRecords ?? estimateCost(agentSpec.model, tokenUsage);

  const metaMerge: Record<string, unknown> = {};
  if (records.length > 0) {
    metaMerge[OPENAI_USAGE_LEDGER_META_KEY] = records;
    metaMerge[OPENAI_USAGE_SUMMARY_META_KEY] = summarizeUsageRecords(records);
  }

  const completedRun = await agentRunRepository.complete(agentRun.id, {
    finalOutput: result.finalOutput,
    tokenUsage,
    costEstimate: costEstimate ?? undefined,
    durationMs,
    metaMerge:
      Object.keys(metaMerge).length > 0 ? metaMerge : undefined,
  });

  return completedRun;
}
