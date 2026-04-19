import type {
  FlowNode,
  AgentRunContext,
  AgentSpec,
  ConversationMessage,
  ExtractFieldSchema,
  JSONValue,
  OrchestratorState,
  RunEval,
} from "@/db/agents/schema";
import { resolveModel, type ModelPolicy } from "@/lib/agents/model-policy";
import { runAgent } from "@/lib/agents/llm-provider";
import { runStreamedResponse } from "@/lib/agents/responses-stream";
import {
  runStructuredTriage,
  isStructuredOutputSchemaKey,
} from "@/lib/agents/structured-output";
import { createTimer } from "@/lib/agents/observability";
import { interpolateTemplate } from "@/lib/agents/flow/env";
import { extractVarsPatch } from "./orchestrator-state";
import type { NodeExecutionContext, NodeResult } from "@/lib/agents/flow/nodes";
import type { OpenAIUsageRecordV1 } from "@/lib/agents/usage";

export interface PrimitiveNodeResult extends NodeResult {
  varsPatch?: Record<string, JSONValue>;
}

// ---------------------------------------------------------------------------
// Shared: build AgentSpec from a primitive node
// ---------------------------------------------------------------------------

async function buildPrimitiveSpec(
  node: FlowNode,
  ctx: NodeExecutionContext
): Promise<AgentSpec | { error: string }> {
  const env = ctx.resolvedEnv ?? {};
  const vars = ctx.orchestratorState?.vars ?? {};

  if (node.data.inlineInstructions) {
    const modelPolicy = (node.data.inlineModel as ModelPolicy) ?? "default";
    return {
      definitionId: ctx.runId,
      name: node.data.label ?? node.id,
      slug: node.id,
      instructions: interpolateAllTemplates(node.data.inlineInstructions, env, vars),
      tools: [],
      model: resolveModel(modelPolicy),
    };
  }

  return { error: "No inlineInstructions configured for this node" };
}

function interpolateAllTemplates(
  template: string,
  env: Record<string, string>,
  vars: Record<string, JSONValue>
): string {
  return interpolateTemplate(template, env, vars);
}

function buildInput(
  upstreamOutput: Record<string, unknown>,
  inputMapping?: Record<string, string>,
  orchestratorState?: OrchestratorState
): string {
  const withVars =
    orchestratorState?.vars && Object.keys(orchestratorState.vars).length > 0
      ? { ...upstreamOutput, vars: orchestratorState.vars as Record<string, unknown> }
      : upstreamOutput;

  if (inputMapping && Object.keys(inputMapping).length > 0) {
    const mapped: Record<string, unknown> = {};
    for (const [key, path] of Object.entries(inputMapping)) {
      mapped[key] = getNestedValue(withVars, path);
    }
    return JSON.stringify(mapped);
  }

  if (typeof withVars.message === "string") {
    return withVars.message;
  }

  return JSON.stringify(withVars);
}

function getNestedValue(obj: Record<string, unknown>, path: string): unknown {
  const parts = path.split(".");
  let current: unknown = obj;
  for (const part of parts) {
    if (current == null || typeof current !== "object") return undefined;
    current = (current as Record<string, unknown>)[part];
  }
  return current;
}

// ---------------------------------------------------------------------------
// Researcher — retrieves and analyzes information
// ---------------------------------------------------------------------------

export async function executeResearcherNode(
  node: FlowNode,
  upstreamOutput: Record<string, unknown>,
  ctx: NodeExecutionContext
): Promise<PrimitiveNodeResult> {
  const timer = createTimer();
  const inputText = buildInput(upstreamOutput, node.data.inputMapping, ctx.orchestratorState);
  const llmInput = buildLLMInput(ctx.conversationHistory, inputText, node);
  const schemaKey = node.data.structuredOutputSchemaKey as string | undefined;

  if (isStructuredOutputSchemaKey(schemaKey)) {
    try {
      const rawInstructions =
        typeof node.data.inlineInstructions === "string" ? node.data.inlineInstructions : "";
      const trimmed = rawInstructions.trim();
      if (!trimmed) {
        return {
          output: {},
          durationMs: timer.elapsed(),
          status: "failed",
          error:
            "Triage node requires non-empty inlineInstructions (define classification policy on the flow node).",
        };
      }
      const env = ctx.resolvedEnv ?? {};
      const vars = ctx.orchestratorState?.vars ?? {};
      const systemContent = interpolateAllTemplates(trimmed, env, vars);
      const modelPolicy = (node.data.inlineModel as ModelPolicy) ?? "cheap";
      const result = await runStructuredTriage(llmInput, {
        systemContent,
        modelPolicy,
        usageAttribution: {
          runId: ctx.runId,
          nodeId: node.id,
          phase: "chat_completions",
        },
      });
      const triageOutput = result.parsed;
      const parsedOutput =
        triageOutput && typeof triageOutput === "object"
          ? (triageOutput as unknown as Record<string, unknown>)
          : { message: String(triageOutput ?? "") };
      const mergedOutput: Record<string, unknown> = {
        ...upstreamOutput,
        ...parsedOutput,
      };
      if (upstreamOutput.projectContext !== undefined) {
        mergedOutput.projectContext = upstreamOutput.projectContext;
      }
      // Triage schema asks the model to echo userMessage; a bad echo must not replace the real input.
      if (
        typeof upstreamOutput.userMessage === "string" &&
        upstreamOutput.userMessage.length > 0
      ) {
        mergedOutput.userMessage = upstreamOutput.userMessage;
      }
      const varsPatch = node.data.varsPatch
        ? extractVarsPatch(parsedOutput, node.data.varsPatch)
        : undefined;
      return {
        output: mergedOutput,
        durationMs: timer.elapsed(),
        tokenUsage: result.usage,
        usageRecords: result.usageRecords,
        status: "completed",
        varsPatch,
      };
    } catch (err) {
      return {
        output: {},
        durationMs: timer.elapsed(),
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  const specOrErr = await buildPrimitiveSpec(node, ctx);
  if ("error" in specOrErr) {
    return { output: {}, durationMs: 0, status: "failed", error: specOrErr.error };
  }

  const agentCtx = buildAgentContext(ctx);

  try {
    const result = await runAgent(specOrErr, llmInput, agentCtx, {
      phase: "agents_sdk",
      nodeId: node.id,
    });
    const parsedOutput = parseAgentOutput(result.finalOutput, node);
    const varsPatch = node.data.varsPatch
      ? extractVarsPatch(parsedOutput, node.data.varsPatch)
      : undefined;

    return {
      output: parsedOutput,
      durationMs: timer.elapsed(),
      tokenUsage: result.usage,
      usageRecords: result.usageRecords,
      status: "completed",
      varsPatch,
    };
  } catch (err) {
    return {
      output: {},
      durationMs: timer.elapsed(),
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Actor — executes actions via tools
// ---------------------------------------------------------------------------

export async function executeActorNode(
  node: FlowNode,
  upstreamOutput: Record<string, unknown>,
  ctx: NodeExecutionContext
): Promise<PrimitiveNodeResult> {
  const timer = createTimer();
  const specOrErr = await buildPrimitiveSpec(node, ctx);
  if ("error" in specOrErr) {
    return { output: {}, durationMs: 0, status: "failed", error: specOrErr.error };
  }

  const inputText = buildInput(upstreamOutput, node.data.inputMapping, ctx.orchestratorState);
  const llmInput = buildLLMInput(ctx.conversationHistory, inputText, node);
  const agentCtx = buildAgentContext(ctx);

  try {
    const result = await runAgent(specOrErr, llmInput, agentCtx, {
      phase: "agents_sdk",
      nodeId: node.id,
    });
    const parsedOutput = parseAgentOutput(result.finalOutput, node);
    const varsPatch = node.data.varsPatch
      ? extractVarsPatch(parsedOutput, node.data.varsPatch)
      : undefined;

    return {
      output: parsedOutput,
      durationMs: timer.elapsed(),
      tokenUsage: result.usage,
      usageRecords: result.usageRecords,
      status: "completed",
      varsPatch,
    };
  } catch (err) {
    return {
      output: {},
      durationMs: timer.elapsed(),
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Rewriter — transforms input text
// ---------------------------------------------------------------------------

export async function executeRewriterNode(
  node: FlowNode,
  upstreamOutput: Record<string, unknown>,
  ctx: NodeExecutionContext
): Promise<PrimitiveNodeResult> {
  const timer = createTimer();
  const specOrErr = await buildPrimitiveSpec(node, ctx);
  if ("error" in specOrErr) {
    return { output: {}, durationMs: 0, status: "failed", error: specOrErr.error };
  }

  const inputText = buildInput(upstreamOutput, node.data.inputMapping, ctx.orchestratorState);
  const llmInput = buildLLMInput(ctx.conversationHistory, inputText, node);
  const agentCtx = buildAgentContext(ctx);

  try {
    const result = await runAgent(specOrErr, llmInput, agentCtx, {
      phase: "agents_sdk",
      nodeId: node.id,
    });
    const parsedOutput = parseAgentOutput(result.finalOutput, node);

    if (node.data.canRewrite && !parsedOutput.rewrittenMessage && typeof parsedOutput.message === "string") {
      parsedOutput.rewrittenMessage = parsedOutput.message;
    }

    const varsPatch = node.data.varsPatch
      ? extractVarsPatch(parsedOutput, node.data.varsPatch)
      : undefined;

    return {
      output: parsedOutput,
      durationMs: timer.elapsed(),
      tokenUsage: result.usage,
      usageRecords: result.usageRecords,
      status: "completed",
      varsPatch,
    };
  } catch (err) {
    return {
      output: {},
      durationMs: timer.elapsed(),
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Responder — produces user-facing output
// ---------------------------------------------------------------------------

export async function executeResponderNode(
  node: FlowNode,
  upstreamOutput: Record<string, unknown>,
  ctx: NodeExecutionContext
): Promise<PrimitiveNodeResult> {
  const timer = createTimer();
  const specOrErr = await buildPrimitiveSpec(node, ctx);
  if ("error" in specOrErr) {
    return { output: {}, durationMs: 0, status: "failed", error: specOrErr.error };
  }

  const hasExplicitMapping = node.data.inputMapping && Object.keys(node.data.inputMapping).length > 0;
  const inputText = hasExplicitMapping
    ? buildInput(upstreamOutput, node.data.inputMapping, ctx.orchestratorState)
    : (ctx.effectiveUserMessage ?? buildInput(upstreamOutput, undefined, ctx.orchestratorState));
  const llmInput = buildLLMInput(ctx.conversationHistory, inputText, node);
  const agentCtx = buildAgentContext(ctx);

  const streamEligible =
    node.data.streamOutput === true &&
    ctx.sink != null &&
    specOrErr.tools.length === 0;

  if (streamEligible) {
    try {
      const display = {
        nodeId: node.id,
        name: (node.data.displayName ?? node.data.label ?? node.id) as string,
        color: (node.data.displayColor ?? null) as string | null,
        side: (node.data.displaySide ?? "left") as "left" | "right",
      };

      const streamResult = await runStreamedResponse(
        {
          model: specOrErr.model,
          instructions: specOrErr.instructions,
          input: llmInput,
          runId: ctx.runId,
          nodeId: node.id,
          lane: node.data.displaySide === "right" ? "sidecar" : "main",
          display,
          signal: ctx.signal,
        },
        ctx.sink!
      );

      const parsedOutput = parseAgentOutput(streamResult.finalOutput, node);
      const varsPatch = node.data.varsPatch
        ? extractVarsPatch(parsedOutput, node.data.varsPatch)
        : undefined;

      return {
        output: parsedOutput,
        durationMs: timer.elapsed(),
        tokenUsage: streamResult.usage ?? undefined,
        usageRecords: streamResult.usageRecords,
        status: "completed",
        varsPatch,
      };
    } catch (err) {
      return {
        output: {},
        durationMs: timer.elapsed(),
        status: "failed",
        error: err instanceof Error ? err.message : String(err),
      };
    }
  }

  try {
    const result = await runAgent(specOrErr, llmInput, agentCtx, {
      phase: "agents_sdk",
      nodeId: node.id,
    });
    const parsedOutput = parseAgentOutput(result.finalOutput, node);
    const varsPatch = node.data.varsPatch
      ? extractVarsPatch(parsedOutput, node.data.varsPatch)
      : undefined;

    return {
      output: parsedOutput,
      durationMs: timer.elapsed(),
      tokenUsage: result.usage,
      usageRecords: result.usageRecords,
      status: "completed",
      varsPatch,
    };
  } catch (err) {
    return {
      output: {},
      durationMs: timer.elapsed(),
      status: "failed",
      error: err instanceof Error ? err.message : String(err),
    };
  }
}

// ---------------------------------------------------------------------------
// Eval — out-of-band quality assessment (runs after main flow)
// ---------------------------------------------------------------------------

export async function executeEvalNode(
  node: FlowNode,
  runTrace: Record<string, unknown>,
  ctx: NodeExecutionContext
): Promise<{
  evalResult: Omit<RunEval, "id" | "createdAt">;
  tokenUsage?: { prompt: number; completion: number; total: number };
  usageRecords?: OpenAIUsageRecordV1[];
}> {
  const specOrErr = await buildPrimitiveSpec(node, ctx);
  if ("error" in specOrErr) {
    return {
      evalResult: {
        runId: ctx.runId,
        evalName: node.data.label ?? node.id,
        pass: false,
        reasoning: specOrErr.error,
        meta: {},
      },
      usageRecords: [],
    };
  }

  const inputText = JSON.stringify(runTrace);
  const llmInput = buildLLMInput(ctx.conversationHistory, inputText, node);
  const agentCtx = buildAgentContext(ctx);

  try {
    const result = await runAgent(specOrErr, llmInput, agentCtx, {
      phase: "eval",
      nodeId: node.id,
    });
    let parsed: Record<string, unknown>;
    try {
      parsed = JSON.parse(result.finalOutput);
    } catch {
      parsed = { reasoning: result.finalOutput };
    }

    return {
      evalResult: {
        runId: ctx.runId,
        evalName: node.data.label ?? node.id,
        score: typeof parsed.score === "number" ? parsed.score : null,
        pass: typeof parsed.pass === "boolean" ? parsed.pass : null,
        reasoning: typeof parsed.reasoning === "string" ? parsed.reasoning : null,
        meta: parsed,
      },
      tokenUsage: result.usage,
      usageRecords: result.usageRecords,
    };
  } catch (err) {
    return {
      evalResult: {
        runId: ctx.runId,
        evalName: node.data.label ?? node.id,
        pass: false,
        reasoning: err instanceof Error ? err.message : String(err),
        meta: {},
      },
      usageRecords: [],
    };
  }
}

// ---------------------------------------------------------------------------
// Shared helpers
// ---------------------------------------------------------------------------

function buildLLMInput(
  history: ConversationMessage[] | undefined,
  inputText: string,
  node?: FlowNode
): string | ConversationMessage[] {
  if (history && history.length > 0) {
    const preparedHistory = prepareHistoryForNode(history, node);
    return [...preparedHistory, { role: "user" as const, content: inputText }];
  }
  return inputText;
}

function prepareHistoryForNode(
  history: ConversationMessage[],
  node?: FlowNode
): ConversationMessage[] {
  if (!node) return history;

  const mode = node.data.historyMode as string | undefined;
  const maxHistoryMessagesRaw = node.data.maxHistoryMessages;
  const maxHistoryMessages =
    typeof maxHistoryMessagesRaw === "number" && maxHistoryMessagesRaw > 0
      ? Math.floor(maxHistoryMessagesRaw)
      : null;

  if (mode !== "compact_recent") {
    return history;
  }

  const filtered = history.filter((message) => {
    if (message.role !== "assistant") return true;
    return message.meta?.nodeId !== "proposal-summary";
  });

  if (!maxHistoryMessages || filtered.length <= maxHistoryMessages) {
    return filtered;
  }

  return filtered.slice(-maxHistoryMessages);
}

function buildAgentContext(ctx: NodeExecutionContext): AgentRunContext {
  return {
    runId: ctx.runId,
    triggeredBy: ctx.triggeredBy,
  };
}

function applyResponderMessageRoles(
  parsed: Record<string, unknown>,
  schema: ExtractFieldSchema[] | undefined
): void {
  if (!schema?.length) return;
  const primary = schema.find((f) => f.messageRole === "primary");
  const secondary = schema.find((f) => f.messageRole === "secondary");
  if (primary && typeof parsed[primary.key] === "string") {
    parsed.message = parsed[primary.key];
  }
  if (secondary && typeof parsed[secondary.key] === "string") {
    parsed.secondaryMessage = parsed[secondary.key];
  }
}

function parseAgentOutput(
  finalOutput: string,
  node: FlowNode
): Record<string, unknown> {
  let parsed: Record<string, unknown>;
  try {
    parsed = JSON.parse(finalOutput);
  } catch {
    parsed = { message: finalOutput };
  }

  const responderSchema = node.data.responderOutputSchema as
    | ExtractFieldSchema[]
    | undefined;
  applyResponderMessageRoles(parsed, responderSchema);

  parsed._display = {
    nodeId: node.id,
    name: node.data.displayName ?? node.data.label ?? node.id,
    color: node.data.displayColor ?? null,
    side: node.data.displaySide ?? "left",
  };

  return parsed;
}
