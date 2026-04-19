import type {
  FlowNode,
  ConditionConfig,
  GoalCondition,
  AgentRunContext,
  AgentSpec,
  ConversationMessage,
  OrchestratorState,
  AgentStateConfig,
  JSONValue,
} from "@/db/agents/schema";
import { RunContext, invokeFunctionTool, type FunctionTool } from "@openai/agents";
import { agentRepository } from "@/repositories/agent.repository";
import { resolveTools, getTool } from "@/lib/agents/tool-registry";
import { resolveModel, type ModelPolicy } from "@/lib/agents/model-policy";
import { runAgent } from "@/lib/agents/llm-provider";
import { runStreamedResponse } from "@/lib/agents/responses-stream";
import { createTimer } from "@/lib/agents/observability";
import type { OpenAIUsageRecordV1 } from "@/lib/agents/usage";
import { interpolateTemplate } from "./env";

// ---------------------------------------------------------------------------
// Node execution context — passed through the DAG
// ---------------------------------------------------------------------------

export interface NodeExecutionContext {
  runId: string;
  triggeredBy: string;
  conversationHistory?: ConversationMessage[];
  resolvedEnv?: Record<string, string>;
  orchestratorState?: OrchestratorState;
  effectiveUserMessage?: string;
  stateConfig?: AgentStateConfig;
  sink?: import("@/lib/agents/streaming").RunEventSink;
  signal?: AbortSignal;
  /** In-memory OpenAI usage ledger; executor appends per step */
  usageLedger?: OpenAIUsageRecordV1[];
}

export interface NodeResult {
  output: Record<string, unknown>;
  durationMs: number;
  tokenUsage?: { prompt: number; completion: number; total: number };
  usageRecords?: OpenAIUsageRecordV1[];
  varsPatch?: Record<string, JSONValue>;
  status: "completed" | "failed" | "skipped";
  error?: string;
}

// ---------------------------------------------------------------------------
// Node handlers
// ---------------------------------------------------------------------------

export async function executeInputNode(
  _node: FlowNode,
  userInput: string
): Promise<NodeResult> {
  return {
    output: { message: userInput },
    durationMs: 0,
    status: "completed",
  };
}

// ---------------------------------------------------------------------------
// Tool node — run a single tool without an LLM
// ---------------------------------------------------------------------------

export async function executeToolNode(
  node: FlowNode,
  upstreamOutput: Record<string, unknown>,
  ctx: NodeExecutionContext
): Promise<NodeResult> {
  const timer = createTimer();
  const toolName = node.data.toolName as string | undefined;
  if (!toolName) {
    return { output: {}, durationMs: 0, status: "failed", error: "Tool node missing toolName" };
  }

  const tool = getTool(toolName);
  if (!tool) {
    return { output: {}, durationMs: 0, status: "failed", error: `Unknown tool: ${toolName}` };
  }

  const agentRunContext: AgentRunContext = {
    runId: ctx.runId,
    triggeredBy: ctx.triggeredBy,
  };

  const runCtx = new RunContext<AgentRunContext>(agentRunContext);

  // OSS build: no built-in tools have special "wrap upstream output" behavior.
  const specialToolBehavior: Record<
    string,
    { defaultParams: Record<string, unknown>; wrappedOutputKey: string }
  > = {};
  const specialBehavior: (typeof specialToolBehavior)[string] | undefined =
    specialToolBehavior[toolName];

  let params: Record<string, unknown>;
  if (specialBehavior) {
    params = specialBehavior.defaultParams;
  } else if (node.data.inputMapping && Object.keys(node.data.inputMapping).length > 0) {
    const mapped: Record<string, unknown> = {};
    for (const [key, path] of Object.entries(node.data.inputMapping)) {
      mapped[key] = getNestedValue(upstreamOutput, path);
    }
    params = mapped;
  } else {
    params = {};
  }

  try {
    const rawResult = await invokeFunctionTool({
      tool: tool as FunctionTool<AgentRunContext>,
      runContext: runCtx,
      input: JSON.stringify(params),
    });
    const parsed = JSON.parse(rawResult as string) as Record<string, unknown>;

    if (parsed.error) {
      return {
        output: {},
        durationMs: timer.elapsed(),
        status: "failed",
        error: String(parsed.error),
      };
    }

    const shape = (node.data.toolOutputShape as "wrap" | "passthrough") ?? "wrap";
    let output: Record<string, unknown>;
    if (shape === "wrap" && specialBehavior) {
      const userMessage =
        typeof upstreamOutput.message === "string" ? upstreamOutput.message : JSON.stringify(upstreamOutput);
      output = { ...upstreamOutput, userMessage, [specialBehavior.wrappedOutputKey]: parsed };
    } else {
      output = parsed;
    }

    return {
      output,
      durationMs: timer.elapsed(),
      status: "completed",
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

export async function executeAgentNode(
  node: FlowNode,
  upstreamOutput: Record<string, unknown>,
  ctx: NodeExecutionContext
): Promise<NodeResult> {
  const timer = createTimer();

  let agentSpec: AgentSpec;

  const env = ctx.resolvedEnv ?? {};
  const vars = ctx.orchestratorState?.vars;

  if (node.data.inlineInstructions) {
    const modelPolicy = (node.data.inlineModel as ModelPolicy) ?? "default";
    agentSpec = {
      definitionId: ctx.runId,
      name: node.data.label ?? node.id,
      slug: node.id,
      instructions: interpolateTemplate(node.data.inlineInstructions, env, vars),
      tools: [],
      model: resolveModel(modelPolicy),
    };
  } else if (node.data.agentSlug) {
    const definition = await agentRepository.findBySlug(node.data.agentSlug);
    if (!definition) {
      return { output: {}, durationMs: 0, status: "failed", error: `Agent not found: ${node.data.agentSlug}` };
    }
    agentSpec = {
      definitionId: definition.id,
      name: definition.name,
      slug: definition.slug,
      instructions: interpolateTemplate(definition.instructions, env, vars),
      tools: resolveTools(definition.allowedTools),
      model: definition.defaultModel,
      outputSchema: definition.outputSchema,
    };
  } else {
    return { output: {}, durationMs: 0, status: "failed", error: "No agent configured (select an existing agent or provide inline instructions)" };
  }

  const inputText = buildAgentInput(upstreamOutput, node.data.inputMapping, ctx.orchestratorState);

  const agentRunContext: AgentRunContext = {
    runId: ctx.runId,
    triggeredBy: ctx.triggeredBy,
  };

  // When conversation history is available, pass it as a message array
  const llmInput: string | ConversationMessage[] =
    ctx.conversationHistory && ctx.conversationHistory.length > 0
      ? [...ctx.conversationHistory, { role: "user" as const, content: inputText }]
      : inputText;

  const display = {
    nodeId: node.id,
    name: (node.data.displayName ?? node.data.label ?? node.id) as string,
    color: (node.data.displayColor ?? null) as string | null,
    side: (node.data.displaySide ?? "left") as "left" | "right",
  };

  // Phase 1 streaming: eligible single-shot nodes only (inline instructions,
  // no tools, no external agent slug with tool recursion).
  const streamEligible =
    node.data.streamOutput === true &&
    ctx.sink != null &&
    agentSpec.tools.length === 0;

  if (streamEligible) {
    try {
      const streamResult = await runStreamedResponse(
        {
          model: agentSpec.model,
          instructions: agentSpec.instructions,
          input: llmInput,
          runId: ctx.runId,
          nodeId: node.id,
          lane: node.data.displaySide === "right" ? "sidecar" : "main",
          display,
          signal: ctx.signal,
        },
        ctx.sink!
      );

      let parsedOutput: Record<string, unknown>;
      try {
        parsedOutput = JSON.parse(streamResult.finalOutput);
      } catch {
        parsedOutput = { message: streamResult.finalOutput };
      }
      parsedOutput._display = display;

      return {
        output: parsedOutput,
        durationMs: timer.elapsed(),
        tokenUsage: streamResult.usage ?? undefined,
        usageRecords: streamResult.usageRecords,
        status: "completed",
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
    const result = await runAgent(agentSpec, llmInput, agentRunContext, {
      phase: "agents_sdk",
      nodeId: node.id,
    });

    let parsedOutput: Record<string, unknown>;
    try {
      parsedOutput = JSON.parse(result.finalOutput);
    } catch {
      parsedOutput = { message: result.finalOutput };
    }

    parsedOutput._display = display;

    const varsPatchMapping = node.data.varsPatch;
    let varsPatch: Record<string, JSONValue> | undefined;
    if (varsPatchMapping && ctx.orchestratorState) {
      varsPatch = {};
      for (const [extractKey, stateVarKey] of Object.entries(varsPatchMapping)) {
        if (extractKey in parsedOutput) {
          varsPatch[stateVarKey] = parsedOutput[extractKey] as JSONValue;
        }
      }
      if (Object.keys(varsPatch).length === 0) varsPatch = undefined;
    }

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

export function executeConditionNode(
  node: FlowNode,
  upstreamOutput: Record<string, unknown>,
  orchestratorState?: OrchestratorState
): { branch: "true" | "false" } {
  if (node.data.goalCheck && node.data.goalConditions) {
    return executeGoalCheckCondition(node, orchestratorState);
  }

  const condition = node.data.condition;
  if (!condition) return { branch: "false" };

  let value: unknown;
  if (condition.field.startsWith("vars.") && orchestratorState) {
    const varKey = condition.field.slice(5);
    value = orchestratorState.vars[varKey];
  } else {
    value = getNestedValue(upstreamOutput, condition.field);
  }
  const result = evaluateCondition(condition, value);
  return { branch: result ? "true" : "false" };
}

function executeGoalCheckCondition(
  node: FlowNode,
  orchestratorState?: OrchestratorState
): { branch: "true" | "false" } {
  const conditions = node.data.goalConditions as GoalCondition[] | undefined;
  const logic = (node.data.goalConditionLogic as "all" | "any") ?? "all";
  if (!conditions || conditions.length === 0) return { branch: "false" };

  const vars: Record<string, JSONValue> = orchestratorState?.vars ?? {};
  const evaluate = (cond: GoalCondition): boolean => {
    const value = vars[cond.field];
    return evaluateCondition(cond as ConditionConfig, value);
  };

  const met = logic === "all"
    ? conditions.every(evaluate)
    : conditions.some(evaluate);
  return { branch: met ? "true" : "false" };
}

export function executeForkNode(
  _node: FlowNode,
  upstreamOutput: Record<string, unknown>
): Record<string, unknown> {
  return upstreamOutput;
}

export function executeJoinNode(
  _node: FlowNode,
  branchOutputs: Record<string, Record<string, unknown>>
): Record<string, unknown> {
  const messages: unknown[] = [];
  const merged: Record<string, unknown> = {};

  for (const [branchNodeId, output] of Object.entries(branchOutputs)) {
    merged[branchNodeId] = output;

    if (typeof output.rewrittenMessage === "string") {
      merged.message = output.rewrittenMessage;
    }

    const text = deriveMessageText(output);
    if (text) {
      messages.push(text);
    }
  }

  return { ...merged, messages };
}

/**
 * Extract a readable text message from an agent node output.
 * Prefers `message`, then falls back to serialising all non-meta fields.
 */
function deriveMessageText(output: Record<string, unknown>): string | null {
  if (typeof output.message === "string" && output.message.length > 0) {
    return output.message;
  }
  const payload = { ...output };
  delete payload._display;
  delete payload._branch;
  if (Object.keys(payload).length === 0) return null;
  return JSON.stringify(payload);
}

export function executeOutputNode(
  _node: FlowNode,
  upstreamOutput: Record<string, unknown>
): Record<string, unknown> {
  return upstreamOutput;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function buildAgentInput(
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

function evaluateCondition(config: ConditionConfig, value: unknown): boolean {
  switch (config.operator) {
    case "eq":
      return value === config.value;
    case "neq":
      return value !== config.value;
    case "contains":
      return typeof value === "string" && typeof config.value === "string"
        ? value.includes(config.value)
        : false;
    case "gt":
      return typeof value === "number" && typeof config.value === "number"
        ? value > config.value
        : false;
    case "lt":
      return typeof value === "number" && typeof config.value === "number"
        ? value < config.value
        : false;
    case "gte":
      return typeof value === "number" && typeof config.value === "number"
        ? value >= config.value
        : false;
    case "lte":
      return typeof value === "number" && typeof config.value === "number"
        ? value <= config.value
        : false;
    case "exists":
      return value !== undefined && value !== null;
    case "not_exists":
      return value === undefined || value === null;
    default:
      return false;
  }
}
