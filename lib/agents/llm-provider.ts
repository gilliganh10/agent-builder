import {
  Agent,
  Runner,
  type Tool,
  setDefaultOpenAIKey,
  setTracingDisabled,
} from "@openai/agents";
import type { AgentSpec, AgentRunContext, ConversationMessage } from "@/db/agents/schema";
import {
  getOpenAiBundleAgentsInputGuardrail,
  getOpenAiGuardrailsLlmClient,
  isUserInputGuardrailsDisabled,
} from "@/lib/agents/input-guardrails";
import {
  fromAgentsRunnerResult,
  newUsageId,
  type OpenAIUsagePhase,
  type OpenAIUsageRecordV1,
} from "@/lib/agents/usage";

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

let configured = false;

function ensureConfigured(): void {
  if (configured) return;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY environment variable is not set");
  }

  setDefaultOpenAIKey(apiKey);

  // Disable the SDK's built-in OpenAI tracing — we handle observability ourselves
  setTracingDisabled(false);

  configured = true;
}

// ---------------------------------------------------------------------------
// Runner singleton
// ---------------------------------------------------------------------------

let runner: Runner | null = null;

function getRunner(): Runner {
  ensureConfigured();
  if (!runner) {
    runner = new Runner();
  }
  return runner;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

export interface RunAgentUsageOptions {
  phase: OpenAIUsagePhase;
  nodeId?: string;
  stepIndex?: number;
  maxTurns?: number;
}

export interface LLMRunResult {
  finalOutput: string;
  usage: { prompt: number; completion: number; total: number };
  newItems: unknown[];
  rawResponses: unknown[];
  usageRecords: OpenAIUsageRecordV1[];
}

/**
 * Build an SDK Agent from an AgentSpec and execute it.
 * Accepts either a plain string input or a conversation history array.
 * Returns a normalised result with output and usage data.
 *
 * When `INPUT_GUARDRAILS_ENABLED` is not false, attaches `@openai/guardrails`
 * as Agents SDK `inputGuardrails` on `new Agent(...)` from this same module.
 * (Avoid `GuardrailAgent.create()` in Next.js — it can instantiate a duplicate
 * `Agent` class and break runtime methods like `hasExplicitToolConfig`.)
 */
export async function runAgent(
  spec: AgentSpec,
  input: string | ConversationMessage[],
  context: AgentRunContext,
  usageOptions?: RunAgentUsageOptions
): Promise<LLMRunResult> {
  const useOpenAiPackageGuardrails =
    !isUserInputGuardrailsDisabled() && !!process.env.OPENAI_API_KEY;

  const agent = new Agent<AgentRunContext>({
    name: spec.name,
    instructions: spec.instructions,
    model: spec.model,
    modelSettings: spec.modelSettings ?? {},
    tools: spec.tools as Tool<AgentRunContext>[],
    ...(useOpenAiPackageGuardrails
      ? { inputGuardrails: [getOpenAiBundleAgentsInputGuardrail()] }
      : {}),
  });

  let runInput: string | Array<Record<string, unknown>>;
  if (Array.isArray(input)) {
    runInput = input.map((m) => {
      if (m.role === "user") {
        return { role: "user" as const, content: m.content };
      }
      return {
        role: "assistant" as const,
        status: "completed" as const,
        content: [{ type: "output_text" as const, text: m.content }],
      };
    });
  } else {
    runInput = input;
  }

  const runContext: AgentRunContext = useOpenAiPackageGuardrails
    ? { ...context, guardrailLlm: getOpenAiGuardrailsLlmClient() }
    : context;

  const result = await getRunner().run(
    agent,
    runInput as Parameters<typeof Runner.prototype.run>[1],
    { context: runContext, maxTurns: usageOptions?.maxTurns ?? 10 },
  );

  const usage = result.state.usage;
  const finalOutput =
    typeof result.finalOutput === "string"
      ? result.finalOutput
      : JSON.stringify(result.finalOutput ?? "");

  const invocationId = newUsageId();
  const phase = usageOptions?.phase ?? "agents_sdk";
  const usageRecords = fromAgentsRunnerResult(
    {
      state: { usage },
      rawResponses: result.rawResponses as Array<{ responseId?: string }>,
    },
    {
      runId: context.runId,
      nodeId: usageOptions?.nodeId,
      stepIndex: usageOptions?.stepIndex,
      phase,
      modelRequested: spec.model,
      invocationId,
    },
    { streamed: false }
  );

  return {
    finalOutput,
    usage: {
      prompt: usage.inputTokens,
      completion: usage.outputTokens,
      total: usage.totalTokens,
    },
    newItems: result.newItems as unknown[],
    rawResponses: result.rawResponses as unknown[],
    usageRecords,
  };
}
