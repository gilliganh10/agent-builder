import type { Permission } from "@/lib/permissions";
import type {
  AgentRun,
  FlowDefinition,
  FlowNode,
  ConversationMessage,
  RuntimeEvent,
  FlowRunOutput,
  OrchestratorState,
  JSONValue,
  GoalCompletionAction,
} from "@/db/agents/schema";
import { agentRunRepository } from "@/repositories/agent-run.repository";
import {
  createTimer,
  estimateCost,
  estimateCostFromUsageRecords,
} from "@/lib/agents/observability";
import { buildConversationHistory } from "@/lib/agents/conversation-history";
import { resolveEnvVars } from "./env";
import { topologicalSort } from "./validator";
import {
  executeInputNode,
  executeAgentNode,
  executeToolNode,
  executeConditionNode,
  executeForkNode,
  executeJoinNode,
  type NodeExecutionContext,
  type NodeResult,
} from "./nodes";
import {
  initializeState,
  initializeStateFromConfig,
  mergeVarsPatch,
  persistState,
  loadState,
  resetOrchestratorVarsAtRunStart,
} from "@/lib/agents/primitives/orchestrator-state";
import {
  executeResearcherNode,
  executeActorNode,
  executeRewriterNode,
  executeResponderNode,
  executeEvalNode,
  type PrimitiveNodeResult,
} from "@/lib/agents/primitives/handlers";
import { extractStateUpdates, extractStructured } from "./state-extraction";
import { evaluateGoals } from "./goal-evaluation";
import { db } from "@/lib/db";
import { generateId } from "@/lib/id";
import type { Prisma } from "@/lib/generated/prisma";
import {
  coerceStructuredMessageContent,
  summarizeStructuredMessageContent,
} from "@/lib/agents/chat-message-content";
import { noopSink, type RunEventSink } from "@/lib/agents/streaming";
import { registerProposalLifecycleSink } from "@/lib/agents/streaming/proposal-lifecycle-bus";
import type { OpenAIUsageRecordV1 } from "@/lib/agents/usage";
import {
  OPENAI_USAGE_LEDGER_META_KEY,
  OPENAI_USAGE_SUMMARY_META_KEY,
  rollupRecords,
  summarizeUsageRecords,
} from "@/lib/agents/usage";

const V2_PRIMITIVE_TYPES = new Set(["researcher", "actor", "rewriter", "responder", "state_extractor"]);

function appendUsageToLedger(
  ledger: OpenAIUsageRecordV1[] | undefined,
  records: OpenAIUsageRecordV1[] | undefined,
  stepIndex?: number
): void {
  if (!ledger || !records?.length) return;
  for (const r of records) {
    if (typeof stepIndex === "number" && stepIndex >= 0) {
      ledger.push({ ...r, stepIndex });
    } else {
      ledger.push({ ...r });
    }
  }
}


export interface ExecuteFlowParams {
  tenantId: string;
  flowDefinition: FlowDefinition;
  agentDefinitionId: string;
  input: string;
  triggeredBy: string;
  permissions: Permission[];
  projectId?: string;
  sessionId?: string;
  runModel?: string;
  meta?: Record<string, unknown>;
  envOverrides?: Record<string, string>;
  publishedEnvOverrides?: Record<string, string>;
  sessionEnvOverrides?: Record<string, string>;
  sink?: import("@/lib/agents/streaming").RunEventSink;
  signal?: AbortSignal;
}

/**
 * Execute a flow (DAG) end-to-end:
 * 1. Create a parent run record
 * 2. Resolve env vars from all layers
 * 3. Topologically traverse nodes, handling fork/join parallelism
 * 4. Log each node as a RunStep
 * 5. Complete the run with structured FlowRunOutput
 */
export async function executeFlow(params: ExecuteFlowParams): Promise<AgentRun> {
  const {
    tenantId, flowDefinition, agentDefinitionId, input, triggeredBy,
    permissions, projectId, sessionId, runModel, meta,
    envOverrides, publishedEnvOverrides, sessionEnvOverrides,
    sink: paramSink,
  } = params;
  const sink: RunEventSink = paramSink ?? noopSink;

  const run = await agentRunRepository.create(tenantId, {
    agentDefinitionId,
    sessionId,
    input,
    triggeredBy,
    meta: { ...meta, isFlow: true, ...(runModel ? { model: runModel } : {}) },
  });

  sink.setContext?.({ runId: run.id, sessionId: sessionId ?? null });
  sink.emit("ready", { runId: run.id });
  const unregisterProposalSink = registerProposalLifecycleSink(run.id, sink);

  const timer = createTimer();

  let conversationHistory: ConversationMessage[] | undefined;
  if (sessionId) {
    conversationHistory = await buildConversationHistory(tenantId, sessionId, flowDefinition);
  }

  const resolvedEnv = resolveEnvVars({
    flowDefinition,
    publishedOverrides: publishedEnvOverrides,
    sessionOverrides: sessionEnvOverrides,
    runOverrides: envOverrides,
  });

  // v2 orchestrator / state config initialization
  const stateConfig = flowDefinition.stateConfig;
  const isV2 = flowDefinition.version === 2 && (flowDefinition.orchestrator || stateConfig);
  let orchestratorState: OrchestratorState | undefined;

  if (stateConfig) {
    let existingState: OrchestratorState | null = null;
    if (stateConfig.scope === "conversation" && sessionId) {
      existingState = await loadState("conversation", sessionId);
    }
    orchestratorState = initializeStateFromConfig(stateConfig, existingState);
  } else if (isV2 && flowDefinition.orchestrator) {
    const orch = flowDefinition.orchestrator;
    let existingState: OrchestratorState | null = null;
    if (orch.scope === "conversation" && sessionId) {
      existingState = await loadState("conversation", sessionId);
    }
    orchestratorState = initializeState(orch, existingState);
  }

  // Orchestrator bootstrap ordering (do not reorder without updating tests/docs):
  // 1) Load persisted conversation state (inside initializeState / initializeStateFromConfig above).
  // 2) Merge persisted vars with schema defaults.
  // 3) Reset triage-facing transient vars (orchestrator.resetVarsAtRunStart only — not stateConfig).
  // 4) mergeVarsPatch request meta (e.g. pendingProposals) — must run after reset.
  // 5) Execute DAG.
  if (
    orchestratorState &&
    flowDefinition.orchestrator?.resetVarsAtRunStart &&
    flowDefinition.orchestrator.resetVarsAtRunStart.length > 0
  ) {
    orchestratorState = resetOrchestratorVarsAtRunStart(
      orchestratorState,
      flowDefinition.orchestrator,
      flowDefinition.orchestrator.resetVarsAtRunStart
    );
  }

  if (orchestratorState && meta?.pendingProposals !== undefined && Array.isArray(meta.pendingProposals)) {
    orchestratorState = mergeVarsPatch(orchestratorState, {
      pending_proposals: meta.pendingProposals as JSONValue,
    });
  }

  const ctx: NodeExecutionContext = {
    runId: run.id,
    tenantId,
    triggeredBy,
    permissions,
    projectId,
    conversationHistory,
    resolvedEnv,
    orchestratorState,
    stateConfig,
    sink,
    signal: params.signal,
    usageLedger: [],
  };

  try {
    const result = await executeDAG(flowDefinition, input, ctx);

    let finalOrchestratorState = result.orchestratorState;

    // Goal evaluation for stateConfig-driven agents (state extraction now
    // happens via the state_extractor primitive during DAG execution)
    const terminusGoalIds = new Set(
      result.events
        .filter((e) => e.type === "goal_achieved" && e.goalId)
        .map((e) => (e as { goalId: string }).goalId)
    );

    if (stateConfig && finalOrchestratorState && stateConfig.goals.length > 0) {
      const achievedIds = new Set([
        ...finalOrchestratorState.goals
          .filter((g) => g.status === "achieved")
          .map((g) => g.id),
        ...terminusGoalIds,
      ]);

      const achieved = evaluateGoals(stateConfig.goals, finalOrchestratorState.vars, achievedIds);

      for (const goalResult of achieved) {
        finalOrchestratorState = {
          ...finalOrchestratorState,
          goals: finalOrchestratorState.goals.map((g) =>
            g.id === goalResult.goalId ? { ...g, status: "achieved" as const } : g
          ),
        };

        const goalEvent: RuntimeEvent = {
          type: "goal_achieved",
          goalId: goalResult.goalId,
          goalName: goalResult.goalName,
          action: goalResult.action!,
        };
        result.events.push(goalEvent);
        emitRuntimeEvent(sink, goalEvent);

        if (goalResult.action) {
          handleGoalAction(goalResult.action, finalOrchestratorState, result.events, sink);
        }
      }
    }

    // Merge latest proposal artifacts from this run into conversation vars (pointers for apply path)
    if (
      finalOrchestratorState &&
      sessionId &&
      flowDefinition.orchestrator?.scope === "conversation"
    ) {
      const runWithArt = await agentRunRepository.findById(tenantId, run.id);
      const proposals =
        runWithArt?.artifacts?.filter(
          (a) =>
            a.kind === "proposal" &&
            !a.appliedAt &&
            !a.rejected &&
            !a.ignoredAt
        ) ?? [];
      if (proposals.length > 0) {
        const pending = proposals.map((a) => ({ runId: run.id, artifactId: a.id }));
        finalOrchestratorState = mergeVarsPatch(finalOrchestratorState, {
          pending_proposals: pending as unknown as JSONValue,
        });
      } else {
        finalOrchestratorState = mergeVarsPatch(finalOrchestratorState, {
          pending_proposals: [] as unknown as JSONValue,
        });
      }
    }

    // Persist orchestrator state (only use conversation scope when a session row exists)
    const configuredScope = stateConfig?.scope ?? flowDefinition.orchestrator?.scope;
    if (isV2 && finalOrchestratorState && configuredScope) {
      const useConversation =
        configuredScope === "conversation" && Boolean(sessionId);
      const persistScope: "run" | "conversation" = useConversation
        ? "conversation"
        : "run";
      const targetId = useConversation ? sessionId! : run.id;
      await persistState(finalOrchestratorState, persistScope, targetId);
    }

    // Close the session if a goal triggered a close action
    if (sessionId && result.events.some((e) => e.type === "conversation_closed")) {
      await db.conversationSession.update({
        where: { id: sessionId },
        data: { status: "closed" },
      });
    }

    // Run eval nodes out-of-band
    let evalResults: FlowRunOutput["evals"];
    if (isV2) {
      evalResults = await runEvalNodes(flowDefinition, result, ctx);
    }

    const ledger = ctx.usageLedger ?? [];
    const nodeRollup = aggregateTokens(result.nodeResults);
    const ledgerRollup =
      ledger.length > 0 ? rollupRecords(ledger) : null;
    const totalTokens =
      ledgerRollup && ledgerRollup.total > 0
        ? {
            prompt: ledgerRollup.prompt,
            completion: ledgerRollup.completion,
            total: ledgerRollup.total,
            ...(ledgerRollup.cachedInput != null
              ? { cachedPrompt: ledgerRollup.cachedInput }
              : {}),
          }
        : nodeRollup.total > 0
          ? nodeRollup
          : undefined;

    const costEstimate =
      ledger.length > 0
        ? estimateCostFromUsageRecords(ledger) ?? undefined
        : totalTokens
          ? estimateCost("gpt-4.1", totalTokens) ?? undefined
          : undefined;

    const lastMessageEvent = [...result.events]
      .reverse()
      .find((e) => e.type === "message");
    const userFacingMessage =
      lastMessageEvent && lastMessageEvent.type === "message"
        ? lastMessageEvent.content
        : undefined;

    const flowRunOutput: FlowRunOutput = {
      events: result.events,
      ...(result.effectiveUserMessage !== input ? { effectiveUserMessage: result.effectiveUserMessage } : {}),
      ...(finalOrchestratorState ? { orchestratorState: finalOrchestratorState } : {}),
      ...(evalResults && evalResults.length > 0 ? { evals: evalResults } : {}),
      ...(userFacingMessage ? { userFacingMessage } : {}),
    };

    const metaMerge: Record<string, unknown> = {};
    if (ledger.length > 0) {
      metaMerge[OPENAI_USAGE_LEDGER_META_KEY] = ledger;
      metaMerge[OPENAI_USAGE_SUMMARY_META_KEY] = summarizeUsageRecords(ledger);
    }

    return await agentRunRepository.complete(tenantId, run.id, {
      finalOutput: JSON.stringify(flowRunOutput),
      tokenUsage: totalTokens,
      costEstimate,
      durationMs: timer.elapsed(),
      metaMerge:
        Object.keys(metaMerge).length > 0 ? metaMerge : undefined,
    });
  } catch (err) {
    const errorMsg = err instanceof Error ? err.message : String(err);
    return agentRunRepository.fail(tenantId, run.id, errorMsg);
  } finally {
    unregisterProposalSink();
  }
}

// ---------------------------------------------------------------------------
// DAG execution engine
// ---------------------------------------------------------------------------

interface DAGResult {
  output: Record<string, unknown>;
  nodeResults: Map<string, NodeResult>;
  events: RuntimeEvent[];
  effectiveUserMessage: string;
  orchestratorState?: OrchestratorState;
}

async function executeDAG(
  flow: FlowDefinition,
  userInput: string,
  ctx: NodeExecutionContext
): Promise<DAGResult> {
  const nodeMap = new Map<string, FlowNode>();
  for (const node of flow.nodes) {
    nodeMap.set(node.id, node);
  }

  const adj = buildAdjacency(flow);
  const reverseAdj = buildReverseAdjacency(flow);

  const nodeOutputs = new Map<string, Record<string, unknown>>();
  const nodeResults = new Map<string, NodeResult>();
  const completed = new Set<string>();
  const skipped = new Set<string>();
  const events: RuntimeEvent[] = [];
  const sink = ctx.sink ?? noopSink;

  function pushEvent(event: RuntimeEvent): void {
    events.push(event);
    emitRuntimeEvent(sink, event);
  }

  let effectiveUserMessage = userInput;
  ctx.effectiveUserMessage = userInput;
  let stepIndex = 0;

  topologicalSort(flow);

  const inDegree = new Map<string, number>();
  for (const node of flow.nodes) {
    inDegree.set(node.id, 0);
  }
  for (const edge of flow.edges) {
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const ready = new Set<string>();
  for (const [id, deg] of inDegree) {
    if (deg === 0) ready.add(id);
  }

  const remaining = new Map<string, number>();
  for (const [id, deg] of inDegree) {
    remaining.set(id, deg);
  }

  let terminated = false;

  while (ready.size > 0 && !terminated) {
    const forkNodes = [...ready].filter((id) => nodeMap.get(id)?.type === "fork");
    const joinNodes = [...ready].filter((id) => nodeMap.get(id)?.type === "join");
    const otherNodes = [...ready].filter(
      (id) => nodeMap.get(id)?.type !== "fork" && nodeMap.get(id)?.type !== "join"
    );

    for (const nodeId of otherNodes) {
      ready.delete(nodeId);
      if (completed.has(nodeId)) continue;
      const node = nodeMap.get(nodeId)!;
      const upstreamOutput = gatherUpstreamOutput(nodeId, reverseAdj, nodeOutputs);

      if (node.type === "condition") {
        const condResult = executeConditionNode(node, upstreamOutput, ctx.orchestratorState);

        await agentRunRepository.addStep(ctx.tenantId, {
          runId: ctx.runId,
          stepIndex: stepIndex++,
          kind: "flow_node",
          nodeId: node.id,
          status: "completed",
          input: upstreamOutput,
          output: { branch: condResult.branch },
          durationMs: 0,
        });

        nodeOutputs.set(nodeId, { ...upstreamOutput, _branch: condResult.branch });
        nodeResults.set(nodeId, { output: { branch: condResult.branch }, durationMs: 0, status: "completed" });
        completed.add(nodeId);

        const prevSkipped = new Set(skipped);
        const outEdges = flow.edges.filter((e) => e.source === nodeId);
        for (const edge of outEdges) {
          const edgeBranch = edge.data?.branch ?? edge.sourceHandle;
          if (edgeBranch && edgeBranch !== condResult.branch) {
            markSubtreeSkipped(
              edge.target,
              adj,
              reverseAdj,
              nodeMap,
              completed,
              skipped
            );
          }
        }

        for (const sid of skipped) {
          if (!prevSkipped.has(sid)) {
            pushEvent({ type: "node_skipped", nodeId: sid });
            propagateReady(sid, adj, remaining, ready, skipped);
          }
        }

        propagateReady(nodeId, adj, remaining, ready, skipped);
        continue;
      }

      let result: NodeResult;
      let primitiveVarsPatch: Record<string, JSONValue> | undefined;

      if (node.type === "input") {
        result = await executeInputNode(node, effectiveUserMessage);
      } else if (node.type === "tool") {
        result = await executeToolNode(node, upstreamOutput, ctx);
      } else if (node.type === "agent") {
        result = await executeAgentNode(node, upstreamOutput, ctx);
      } else if (V2_PRIMITIVE_TYPES.has(node.type)) {
        const primResult = await dispatchPrimitiveNode(node, upstreamOutput, ctx);
        result = primResult;
        primitiveVarsPatch = primResult.varsPatch;
      } else if (node.type === "terminus") {
        const goalAction = node.data.goalAction as GoalCompletionAction | undefined;
        const goalId = node.data.goalId as string | undefined;

        pushEvent({
          type: "conversation_closed",
          reason: "goal_achieved",
          message: goalAction?.message,
          goalId,
        });

        if (goalId) {
          pushEvent({
            type: "goal_achieved",
            goalId,
            goalName: (node.data.label as string) ?? goalId,
            action: goalAction,
          });
        }

        result = { output: upstreamOutput, durationMs: 0, status: "completed" };

        await agentRunRepository.addStep(ctx.tenantId, {
          runId: ctx.runId,
          stepIndex: stepIndex++,
          kind: "flow_node",
          nodeId: node.id,
          status: "completed",
          input: upstreamOutput,
          output: result.output,
          durationMs: 0,
        });

        nodeOutputs.set(nodeId, result.output);
        nodeResults.set(nodeId, result);
        completed.add(nodeId);
        terminated = true;
        break;
      } else if (node.type === "output") {
        result = { output: upstreamOutput, durationMs: 0, status: "completed" };
      } else {
        result = { output: upstreamOutput, durationMs: 0, status: "completed" };
      }

      const recordStepIndex = stepIndex;
      await agentRunRepository.addStep(ctx.tenantId, {
        runId: ctx.runId,
        stepIndex: stepIndex++,
        kind: "flow_node",
        nodeId: node.id,
        status: result.status,
        input: upstreamOutput,
        output: result.output,
        tokenUsage: result.tokenUsage,
        durationMs: result.durationMs,
        error: result.error,
      });
      appendUsageToLedger(ctx.usageLedger, result.usageRecords, recordStepIndex);

      nodeOutputs.set(nodeId, result.output);
      nodeResults.set(nodeId, result);
      completed.add(nodeId);

      // Merge vars patch for v2 primitives
      const stateVarsPatch = result.varsPatch ?? primitiveVarsPatch;
      if (stateVarsPatch && ctx.orchestratorState) {
        const previousVars = { ...ctx.orchestratorState.vars };
        ctx.orchestratorState = mergeVarsPatch(ctx.orchestratorState, stateVarsPatch);
        if (Object.keys(stateVarsPatch).length > 0) {
          pushEvent({ type: "state_updated", fields: stateVarsPatch, previous: previousVars });
        }
      }

      const isAgentLike = node.type === "agent" || V2_PRIMITIVE_TYPES.has(node.type);

      if (result.status === "completed" && isAgentLike) {
        if (node.data.canRewrite && !result.output.rewrittenMessage && typeof result.output.message === "string") {
          result.output.rewrittenMessage = result.output.message;
        }

        const isVisible = node.data.persistOutput !== false && !node.data.canRewrite;

        if (node.data.canRewrite && typeof result.output.rewrittenMessage === "string") {
          const rewritten = result.output.rewrittenMessage;
          pushEvent({
            type: "rewrite_user_message",
            nodeId: node.id,
            original: effectiveUserMessage,
            rewritten,
            explanation: typeof result.output.explanation === "string" ? result.output.explanation : undefined,
          });

          if (node.data.persistOutput === false) {
            nodeOutputs.set(nodeId, upstreamOutput);
          } else {
            effectiveUserMessage = rewritten;
            ctx.effectiveUserMessage = rewritten;
            const inputNode = flow.nodes.find((n) => n.type === "input");
            if (inputNode) {
              nodeOutputs.set(inputNode.id, { message: rewritten });
            }
            nodeOutputs.set(nodeId, { ...result.output, message: rewritten });
          }
        }

        if (isVisible) {
          const display = result.output._display as Record<string, unknown> | undefined;
          const structuredContent = coerceStructuredMessageContent(result.output.structuredContent);
          const messageText = typeof result.output.message === "string"
            ? result.output.message
            : summarizeStructuredMessageContent(structuredContent);
          const secondaryContent =
            typeof result.output.secondaryMessage === "string"
              ? result.output.secondaryMessage
              : undefined;
          if (messageText && display) {
            pushEvent({
              type: "message",
              nodeId: node.id,
              content: messageText,
              ...(secondaryContent ? { secondaryContent } : {}),
              ...(structuredContent ? { structuredContent } : {}),
              display: {
                nodeId: (display.nodeId as string) ?? node.id,
                name: (display.name as string) ?? node.data.label ?? node.id,
                color: (display.color as string) ?? null,
                side: (display.side as "left" | "right") ?? "left",
              },
            });
          }
        }

        pushEvent({ type: "node_completed", nodeId: node.id, durationMs: result.durationMs });
      }

      if (result.status === "failed") {
        pushEvent({ type: "error", nodeId: node.id, message: result.error ?? "Unknown error" });
        throw new Error(`Node "${node.data.label ?? nodeId}" failed: ${result.error}`);
      }

      propagateReady(nodeId, adj, remaining, ready, skipped);
    }

    for (const nodeId of forkNodes) {
      ready.delete(nodeId);
      const node = nodeMap.get(nodeId)!;
      const upstreamOutput = gatherUpstreamOutput(nodeId, reverseAdj, nodeOutputs);
      const forkOutput = executeForkNode(node, upstreamOutput);

      await agentRunRepository.addStep(ctx.tenantId, {
        runId: ctx.runId,
        stepIndex: stepIndex++,
        kind: "flow_node",
        nodeId: node.id,
        status: "completed",
        input: upstreamOutput,
        output: forkOutput,
        durationMs: 0,
      });

      nodeOutputs.set(nodeId, forkOutput);
      nodeResults.set(nodeId, { output: forkOutput, durationMs: 0, status: "completed" });
      completed.add(nodeId);

      const outEdges = flow.edges.filter((e) => e.source === nodeId);
      const branches = outEdges.map((e) => e.target);

      const branchPromises = branches.map(async (branchTargetId) => {
        const branchNodes = collectBranchNodes(branchTargetId, nodeId, adj, nodeMap);
        await executeBranch(
          branchNodes, nodeMap, flow, adj, reverseAdj,
          nodeOutputs, nodeResults, completed, skipped, remaining, ready,
          ctx, effectiveUserMessage, events, () => stepIndex++
        );
      });

      await Promise.all(branchPromises);

      propagateReady(nodeId, adj, remaining, ready, skipped);
      for (const branchTarget of branches) {
        const branchNodes = collectBranchNodes(branchTarget, nodeId, adj, nodeMap);
        for (const bn of branchNodes) {
          propagateReady(bn, adj, remaining, ready, skipped);
        }
      }
    }

    for (const nodeId of joinNodes) {
      ready.delete(nodeId);
      const node = nodeMap.get(nodeId)!;
      const incomingEdges = flow.edges.filter((e) => e.target === nodeId);
      const branchOutputs: Record<string, Record<string, unknown>> = {};

      for (const edge of incomingEdges) {
        if (skipped.has(edge.source)) continue;
        const output = nodeOutputs.get(edge.source);
        if (output) {
          branchOutputs[edge.source] = output;
        }
      }

      const joinOutput = executeJoinNode(node, branchOutputs);

      await agentRunRepository.addStep(ctx.tenantId, {
        runId: ctx.runId,
        stepIndex: stepIndex++,
        kind: "flow_node",
        nodeId: node.id,
        status: "completed",
        input: branchOutputs as Record<string, unknown>,
        output: joinOutput,
        durationMs: 0,
      });

      nodeOutputs.set(nodeId, joinOutput);
      nodeResults.set(nodeId, { output: joinOutput, durationMs: 0, status: "completed" });
      completed.add(nodeId);

      propagateReady(nodeId, adj, remaining, ready, skipped);
    }
  }

  const outputNode = flow.nodes.find((n) => n.type === "output");
  const finalOutput = outputNode ? (nodeOutputs.get(outputNode.id) ?? {}) : {};

  return { output: finalOutput, nodeResults, events, effectiveUserMessage, orchestratorState: ctx.orchestratorState };
}

// ---------------------------------------------------------------------------
// Execute a branch of nodes sequentially (used within fork parallelism)
// ---------------------------------------------------------------------------

async function executeBranch(
  branchNodeIds: string[],
  nodeMap: Map<string, FlowNode>,
  flow: FlowDefinition,
  adj: Map<string, string[]>,
  reverseAdj: Map<string, string[]>,
  nodeOutputs: Map<string, Record<string, unknown>>,
  nodeResults: Map<string, NodeResult>,
  completed: Set<string>,
  skipped: Set<string>,
  remaining: Map<string, number>,
  ready: Set<string>,
  ctx: NodeExecutionContext,
  effectiveUserMessage: string,
  events: RuntimeEvent[],
  nextStepIndex: () => number
): Promise<void> {
  const branchSink = ctx.sink ?? noopSink;

  function pushEvent(event: RuntimeEvent): void {
    events.push(event);
    emitRuntimeEvent(branchSink, event);
  }

  for (const nodeId of branchNodeIds) {
    if (completed.has(nodeId) || skipped.has(nodeId)) continue;

    const node = nodeMap.get(nodeId);
    if (!node) continue;
    if (node.type === "join" || node.type === "output") continue;

    const upstreamOutput = gatherUpstreamOutput(nodeId, reverseAdj, nodeOutputs);

    if (node.type === "condition") {
      const condResult = executeConditionNode(node, upstreamOutput, ctx.orchestratorState);

      await agentRunRepository.addStep(ctx.tenantId, {
        runId: ctx.runId,
        stepIndex: nextStepIndex(),
        kind: "flow_node",
        nodeId: node.id,
        status: "completed",
        input: upstreamOutput,
        output: { branch: condResult.branch },
        durationMs: 0,
      });

      nodeOutputs.set(nodeId, { ...upstreamOutput, _branch: condResult.branch });
      nodeResults.set(nodeId, { output: { branch: condResult.branch }, durationMs: 0, status: "completed" });
      completed.add(nodeId);

      const prevSkipped = new Set(skipped);
      const outEdges = flow.edges.filter((e) => e.source === nodeId);
      for (const edge of outEdges) {
        const edgeBranch = edge.data?.branch ?? edge.sourceHandle;
        if (edgeBranch && edgeBranch !== condResult.branch) {
          markSubtreeSkipped(
            edge.target,
            adj,
            reverseAdj,
            nodeMap,
            completed,
            skipped
          );
        }
      }

      for (const sid of skipped) {
        if (!prevSkipped.has(sid)) {
          pushEvent({ type: "node_skipped", nodeId: sid });
          propagateReady(sid, adj, remaining, ready, skipped);
        }
      }
      continue;
    }

    let result: NodeResult;
    let branchVarsPatch: Record<string, JSONValue> | undefined;

    if (node.type === "tool") {
      result = await executeToolNode(node, upstreamOutput, ctx);
    } else if (node.type === "agent") {
      result = await executeAgentNode(node, upstreamOutput, ctx);
    } else if (V2_PRIMITIVE_TYPES.has(node.type)) {
      const primResult = await dispatchPrimitiveNode(node, upstreamOutput, ctx);
      result = primResult;
      branchVarsPatch = primResult.varsPatch;
    } else if (node.type === "fork") {
      result = { output: executeForkNode(node, upstreamOutput), durationMs: 0, status: "completed" };
    } else {
      result = { output: upstreamOutput, durationMs: 0, status: "completed" };
    }

    const branchRecordStepIndex = nextStepIndex();
    await agentRunRepository.addStep(ctx.tenantId, {
      runId: ctx.runId,
      stepIndex: branchRecordStepIndex,
      kind: "flow_node",
      nodeId: node.id,
      status: result.status,
      input: upstreamOutput,
      output: result.output,
      tokenUsage: result.tokenUsage,
      durationMs: result.durationMs,
      error: result.error,
    });
    appendUsageToLedger(ctx.usageLedger, result.usageRecords, branchRecordStepIndex);

    nodeOutputs.set(nodeId, result.output);
    nodeResults.set(nodeId, result);
    completed.add(nodeId);

    if (branchVarsPatch && ctx.orchestratorState) {
      const previousVars = { ...ctx.orchestratorState.vars };
      ctx.orchestratorState = mergeVarsPatch(ctx.orchestratorState, branchVarsPatch);
      if (node.type === "state_extractor" && Object.keys(branchVarsPatch).length > 0) {
        pushEvent({ type: "state_updated", fields: branchVarsPatch, previous: previousVars });
      }
    }

    const isAgentLikeBranch = node.type === "agent" || V2_PRIMITIVE_TYPES.has(node.type);

    if (result.status === "completed" && isAgentLikeBranch) {
      if (node.data.canRewrite && !result.output.rewrittenMessage && typeof result.output.message === "string") {
        result.output.rewrittenMessage = result.output.message;
      }

      const isVisible = node.data.persistOutput !== false && !node.data.canRewrite;

      if (node.data.canRewrite && typeof result.output.rewrittenMessage === "string") {
        const rewritten = result.output.rewrittenMessage;
        pushEvent({
          type: "rewrite_user_message",
          nodeId: node.id,
          original: effectiveUserMessage,
          rewritten,
          explanation: typeof result.output.explanation === "string" ? result.output.explanation : undefined,
        });

        if (node.data.persistOutput === false) {
          nodeOutputs.set(nodeId, upstreamOutput);
        } else {
          effectiveUserMessage = rewritten;
          ctx.effectiveUserMessage = rewritten;
          const inputNode = flow.nodes.find((n) => n.type === "input");
          if (inputNode) {
            nodeOutputs.set(inputNode.id, { message: rewritten });
          }
          nodeOutputs.set(nodeId, { ...result.output, message: rewritten });
        }
      }

      if (isVisible) {
        const display = result.output._display as Record<string, unknown> | undefined;
        const messageText = typeof result.output.message === "string" ? result.output.message : null;
        const secondaryContent =
          typeof result.output.secondaryMessage === "string"
            ? result.output.secondaryMessage
            : undefined;
        if (messageText && display) {
          pushEvent({
            type: "message",
            nodeId: node.id,
            content: messageText,
            ...(secondaryContent ? { secondaryContent } : {}),
            display: {
              nodeId: (display.nodeId as string) ?? node.id,
              name: (display.name as string) ?? node.data.label ?? node.id,
              color: (display.color as string) ?? null,
              side: (display.side as "left" | "right") ?? "left",
            },
          });
        }
      }

      pushEvent({ type: "node_completed", nodeId: node.id, durationMs: result.durationMs });
    }

    if (result.status === "failed") {
      pushEvent({ type: "error", nodeId: node.id, message: result.error ?? "Unknown error" });
      throw new Error(`Node "${node.data.label ?? nodeId}" failed: ${result.error}`);
    }
  }
}

// ---------------------------------------------------------------------------
// v2 primitive dispatch
// ---------------------------------------------------------------------------

async function dispatchPrimitiveNode(
  node: FlowNode,
  upstreamOutput: Record<string, unknown>,
  ctx: NodeExecutionContext
): Promise<PrimitiveNodeResult> {
  switch (node.type) {
    case "researcher":
      return executeResearcherNode(node, upstreamOutput, ctx);
    case "actor":
      return executeActorNode(node, upstreamOutput, ctx);
    case "rewriter":
      return executeRewriterNode(node, upstreamOutput, ctx);
    case "responder":
      return executeResponderNode(node, upstreamOutput, ctx);
    case "state_extractor":
      return executeStateExtractorNode(node, upstreamOutput, ctx);
    default:
      return { output: upstreamOutput, durationMs: 0, status: "completed" };
  }
}

async function executeStateExtractorNode(
  node: FlowNode,
  upstreamOutput: Record<string, unknown>,
  ctx: NodeExecutionContext
): Promise<PrimitiveNodeResult> {
  const structuredSchema = node.data.extractOutputSchema as import("@/db/agents/schema").ExtractFieldSchema[] | undefined;

  if (structuredSchema && structuredSchema.length > 0) {
    return executeStructuredExtraction(node, upstreamOutput, ctx, structuredSchema);
  }

  const fields = ctx.stateConfig?.fields;
  if (!fields || fields.length === 0 || !ctx.orchestratorState) {
    return { output: upstreamOutput, durationMs: 0, status: "completed" };
  }

  const timer = createTimer();

  const lastAssistantMessage =
    typeof upstreamOutput.message === "string"
      ? upstreamOutput.message
      : JSON.stringify(upstreamOutput);

  const historyWithCurrentTurn: ConversationMessage[] = [
    ...(ctx.conversationHistory ?? []),
    ...(ctx.effectiveUserMessage
      ? [{ role: "user" as const, content: ctx.effectiveUserMessage }]
      : []),
  ];

  const agentCtx = {
    runId: ctx.runId,
    tenantId: ctx.tenantId,
    triggeredBy: ctx.triggeredBy,
    permissions: ctx.permissions,
    projectId: ctx.projectId,
  };

  const model =
    node.data.inlineModel ??
    ctx.stateConfig?.extractionModel ??
    undefined;

  const { updates, usageRecords, tokenUsage } = await extractStateUpdates(
    historyWithCurrentTurn,
    lastAssistantMessage,
    ctx.orchestratorState.vars,
    fields,
    agentCtx,
    model,
    node.id
  );

  return {
    output: { ...upstreamOutput, _stateUpdates: updates },
    durationMs: timer.elapsed(),
    status: "completed",
    varsPatch: Object.keys(updates).length > 0 ? updates : undefined,
    tokenUsage,
    usageRecords,
  };
}

async function executeStructuredExtraction(
  node: FlowNode,
  upstreamOutput: Record<string, unknown>,
  ctx: NodeExecutionContext,
  schema: import("@/db/agents/schema").ExtractFieldSchema[]
): Promise<PrimitiveNodeResult> {
  const timer = createTimer();

  const userMessage = ctx.effectiveUserMessage
    ?? (typeof upstreamOutput.message === "string" ? upstreamOutput.message : undefined);

  const historyWithCurrentTurn: ConversationMessage[] = [
    ...(ctx.conversationHistory ?? []),
    ...(userMessage
      ? [{ role: "user" as const, content: userMessage }]
      : []),
  ];

  const agentCtx = {
    runId: ctx.runId,
    tenantId: ctx.tenantId,
    triggeredBy: ctx.triggeredBy,
    permissions: ctx.permissions,
    projectId: ctx.projectId,
  };

  const model =
    node.data.inlineModel ??
    ctx.stateConfig?.extractionModel ??
    undefined;

  const instructions = node.data.inlineInstructions ?? "";
  const varsRead = node.data.varsRead as string[] | undefined;

  const { extracted, usageRecords, tokenUsage } = await extractStructured(
    historyWithCurrentTurn,
    schema,
    instructions,
    agentCtx,
    {
      currentVars: ctx.orchestratorState?.vars,
      varsRead,
      model,
      nodeId: node.id,
    }
  );

  const varsPatchMapping = node.data.varsPatch;
  let varsPatch: Record<string, import("@/db/agents/schema").JSONValue> | undefined;

  if (varsPatchMapping && ctx.orchestratorState) {
    varsPatch = {};
    for (const [extractKey, stateVarKey] of Object.entries(varsPatchMapping)) {
      if (extractKey in extracted) {
        varsPatch[stateVarKey] = extracted[extractKey];
      }
    }
    if (Object.keys(varsPatch).length === 0) varsPatch = undefined;
  }

  return {
    output: { ...upstreamOutput, ...extracted, _stateUpdates: extracted },
    durationMs: timer.elapsed(),
    status: "completed",
    varsPatch,
    tokenUsage,
    usageRecords,
  };
}

// ---------------------------------------------------------------------------
// Out-of-band eval execution (runs after the main DAG completes)
// ---------------------------------------------------------------------------

async function runEvalNodes(
  flow: FlowDefinition,
  dagResult: DAGResult,
  ctx: NodeExecutionContext
): Promise<FlowRunOutput["evals"]> {
  const evalNodes = flow.nodes.filter((n) => n.type === "eval");
  if (evalNodes.length === 0) return undefined;

  const runTrace: Record<string, unknown> = {
    output: dagResult.output,
    events: dagResult.events,
    orchestratorState: dagResult.orchestratorState,
  };

  const results: NonNullable<FlowRunOutput["evals"]> = [];

  for (const evalNode of evalNodes) {
    const { evalResult, tokenUsage: evalTokenUsage, usageRecords: evalUsageRecords } =
      await executeEvalNode(evalNode, runTrace, ctx);

    const evalMeta: Record<string, unknown> = {
      ...(evalResult.meta ?? {}),
    };
    if (evalTokenUsage) {
      evalMeta.tokenUsage = evalTokenUsage;
    }
    if (evalUsageRecords?.length) {
      evalMeta.usageRecords = evalUsageRecords;
    }

    await db.runEval.create({
      data: {
        id: generateId("eval"),
        runId: evalResult.runId,
        evalName: evalResult.evalName,
        score: evalResult.score ?? null,
        pass: evalResult.pass ?? null,
        reasoning: evalResult.reasoning ?? null,
        meta: evalMeta as Prisma.InputJsonValue,
      },
    });

    appendUsageToLedger(ctx.usageLedger, evalUsageRecords);

    results.push({
      id: generateId("eval"),
      runId: evalResult.runId,
      evalName: evalResult.evalName,
      score: evalResult.score,
      pass: evalResult.pass,
      reasoning: evalResult.reasoning,
      meta: evalResult.meta ?? {},
      createdAt: new Date().toISOString(),
    });
  }

  return results;
}

// ---------------------------------------------------------------------------
// RuntimeEvent → SSE sink mapping
// ---------------------------------------------------------------------------

function emitRuntimeEvent(sink: RunEventSink, event: RuntimeEvent): void {
  switch (event.type) {
    case "message":
      sink.emit("message", {
        nodeId: event.nodeId,
        content: event.content,
        ...(event.secondaryContent ? { secondaryContent: event.secondaryContent } : {}),
        lane: event.display?.side === "right" ? "sidecar" : "main",
        display: event.display,
      });
      break;
    case "node_completed":
      sink.emit("progress", {
        nodeId: event.nodeId,
        status: "completed",
        durationMs: event.durationMs,
      });
      break;
    case "node_skipped":
      sink.emit("progress", { nodeId: event.nodeId, status: "skipped" });
      break;
    case "error":
      sink.emit("progress", {
        nodeId: event.nodeId ?? "unknown",
        status: "failed",
      });
      break;
    case "state_updated":
      sink.emit("stage", { name: "state_updated", detail: JSON.stringify(event.fields) });
      break;
    case "goal_achieved":
      sink.emit("stage", { name: "goal_achieved", detail: event.goalName });
      break;
    case "conversation_closed":
      sink.emit("stage", { name: "conversation_closed", detail: event.reason });
      break;
    case "handoff":
      sink.emit("stage", { name: "handoff", detail: event.targetAgentSlug });
      break;
    case "rewrite_user_message":
      sink.emit("stage", { name: "rewrite", nodeId: event.nodeId, detail: event.rewritten });
      break;
  }
}

// ---------------------------------------------------------------------------
// Graph utilities
// ---------------------------------------------------------------------------

function buildAdjacency(flow: FlowDefinition): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const node of flow.nodes) {
    adj.set(node.id, []);
  }
  for (const edge of flow.edges) {
    adj.get(edge.source)?.push(edge.target);
  }
  return adj;
}

function buildReverseAdjacency(flow: FlowDefinition): Map<string, string[]> {
  const adj = new Map<string, string[]>();
  for (const node of flow.nodes) {
    adj.set(node.id, []);
  }
  for (const edge of flow.edges) {
    adj.get(edge.target)?.push(edge.source);
  }
  return adj;
}

function gatherUpstreamOutput(
  nodeId: string,
  reverseAdj: Map<string, string[]>,
  nodeOutputs: Map<string, Record<string, unknown>>
): Record<string, unknown> {
  const parents = reverseAdj.get(nodeId) ?? [];
  if (parents.length === 0) return {};
  if (parents.length === 1) return nodeOutputs.get(parents[0]) ?? {};

  const merged: Record<string, unknown> = {};
  for (const parentId of parents) {
    const output = nodeOutputs.get(parentId);
    if (output) {
      Object.assign(merged, output);
    }
  }
  return merged;
}

function propagateReady(
  completedNodeId: string,
  adj: Map<string, string[]>,
  remaining: Map<string, number>,
  ready: Set<string>,
  skipped: Set<string>
): void {
  for (const neighbor of adj.get(completedNodeId) ?? []) {
    const newDeg = (remaining.get(neighbor) ?? 1) - 1;
    remaining.set(neighbor, newDeg);
    if (newDeg <= 0 && !skipped.has(neighbor)) {
      ready.add(neighbor);
    }
  }
}

function collectBranchNodes(
  startId: string,
  forkId: string,
  adj: Map<string, string[]>,
  nodeMap: Map<string, FlowNode>
): string[] {
  void forkId;
  const result: string[] = [];
  const visited = new Set<string>();
  const queue = [startId];

  while (queue.length > 0) {
    const current = queue.shift()!;
    if (visited.has(current)) continue;
    const node = nodeMap.get(current);
    if (!node) continue;
    if (node.type === "join") continue;

    visited.add(current);
    result.push(current);

    for (const neighbor of adj.get(current) ?? []) {
      const neighborNode = nodeMap.get(neighbor);
      if (neighborNode?.type !== "join") {
        queue.push(neighbor);
      }
    }
  }

  return result;
}

/**
 * Mark nodes unreachable on the non-taken condition branch.
 * Stops at merge points: do not skip a node that still has a completed predecessor
 * outside the skipped subtree (e.g. project copilot: false branch from
 * condition-action-propose must not mark `propose` skipped when it is also
 * reachable from the true branch).
 */
export function markSubtreeSkipped(
  startId: string,
  adj: Map<string, string[]>,
  reverseAdj: Map<string, string[]>,
  nodeMap: Map<string, FlowNode>,
  completed: Set<string>,
  skipped: Set<string>
): void {
  const queue = [startId];
  while (queue.length > 0) {
    const current = queue.shift()!;
    if (skipped.has(current)) continue;
    const node = nodeMap.get(current);
    if (!node) continue;
    if (node.type === "join" || node.type === "output") continue;

    if (current !== startId) {
      const parents = reverseAdj.get(current) ?? [];
      const hasActiveOtherPath = parents.some(
        (p) => completed.has(p) && !skipped.has(p)
      );
      if (hasActiveOtherPath) continue;
    }

    skipped.add(current);
    for (const neighbor of adj.get(current) ?? []) {
      queue.push(neighbor);
    }
  }
}

function aggregateTokens(
  results: Map<string, NodeResult>
): { prompt: number; completion: number; total: number } {
  let prompt = 0;
  let completion = 0;

  for (const result of results.values()) {
    if (result.tokenUsage) {
      prompt += result.tokenUsage.prompt;
      completion += result.tokenUsage.completion;
    }
  }

  return { prompt, completion, total: prompt + completion };
}

// ---------------------------------------------------------------------------
// State extraction + goal action helpers
// ---------------------------------------------------------------------------

function handleGoalAction(
  action: GoalCompletionAction,
  state: OrchestratorState,
  events: RuntimeEvent[],
  actionSink?: RunEventSink
): void {
  const s = actionSink ?? noopSink;
  void state;

  function push(event: RuntimeEvent): void {
    events.push(event);
    emitRuntimeEvent(s, event);
  }

  switch (action.type) {
    case "close":
      push({
        type: "conversation_closed",
        reason: "goal_achieved",
        message: action.message,
      });
      break;

    case "handoff":
      if (action.handoffAgentSlug) {
        const payload: Record<string, unknown> = {};
        if (action.handoffPayloadMapping) {
          for (const [stateKey, payloadKey] of Object.entries(action.handoffPayloadMapping)) {
            payload[payloadKey] = state.vars[stateKey] ?? null;
          }
        }
        push({
          type: "handoff",
          targetAgentSlug: action.handoffAgentSlug,
          payload,
        });
      }
      break;

    case "message":
      if (action.message) {
        push({
          type: "message",
          nodeId: "goal-completion",
          content: action.message,
          display: {
            nodeId: "goal-completion",
            name: "System",
            color: null,
            side: "left",
          },
        });
      }
      break;
  }
}
