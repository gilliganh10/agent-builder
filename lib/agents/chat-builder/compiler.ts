import type {
  ChatBuilderSpec,
  MessageBlock,
  BlockAttachment,
  FlowNode,
  FlowEdge,
  FlowNodeType,
  FlowNodeData,
  OrchestratorConfig,
  EnvVarDefinition,
  FlowDefinition,
  AgentStateConfig,
  AgentGoal,
  ExtractFieldSchema,
} from "@/db/agents/schema";
import { stateConfigToOrchestrator } from "@/lib/agents/shared/state-config-utils";

interface CompilerContext {
  nodes: FlowNode[];
  edges: FlowEdge[];
  nodeCounter: number;
  edgeCounter: number;
  lastNodeId: string;
  xPos: number;
  systemPreamble: string[];
  pendingEdgeOpts?: { sourceHandle: string; branch: string };
}

function nodeId(ctx: CompilerContext, prefix: string): string {
  ctx.nodeCounter++;
  return `${prefix}-${ctx.nodeCounter}`;
}

function edgeId(ctx: CompilerContext): string {
  ctx.edgeCounter++;
  return `e-${ctx.edgeCounter}`;
}

function addNode(
  ctx: CompilerContext,
  type: FlowNodeType,
  idPrefix: string,
  data: FlowNodeData
): string {
  const id = nodeId(ctx, idPrefix);
  ctx.nodes.push({
    id,
    type,
    position: { x: ctx.xPos, y: 200 },
    data,
  });
  ctx.xPos += 220;
  return id;
}

function addEdge(
  ctx: CompilerContext,
  source: string,
  target: string,
  opts?: { sourceHandle?: string; branch?: string }
): void {
  let effectiveOpts = opts;
  if (!effectiveOpts && ctx.pendingEdgeOpts) {
    effectiveOpts = ctx.pendingEdgeOpts;
    ctx.pendingEdgeOpts = undefined;
  }

  const id = edgeId(ctx);
  ctx.edges.push({
    id,
    source,
    target,
    ...(effectiveOpts?.sourceHandle ? { sourceHandle: effectiveOpts.sourceHandle } : {}),
    ...(effectiveOpts?.branch ? { data: { branch: effectiveOpts.branch } } : {}),
  });
}

function resolveAttachmentNodeType(att: BlockAttachment): FlowNodeType {
  if (att.inlinePrimitive?.kind) return att.inlinePrimitive.kind;
  return "researcher";
}

function isResponderAttachment(att: BlockAttachment): boolean {
  return att.inlinePrimitive?.kind === "responder";
}

function mentionsOutputShape(text: string): boolean {
  return /respond\s+(with|only)\s+.*json|\{[^}]*:[^}]*\}/i.test(text);
}

function renderOutputContract(schema: ExtractFieldSchema[]): string {
  if (schema.length === 0) return "";
  const shape = schema
    .map((f) => {
      const desc = f.description ? ` // ${f.description}` : "";
      const role =
        f.messageRole === "primary"
          ? " // PRIMARY message shown in chat"
          : f.messageRole === "secondary"
            ? " // SECONDARY line (e.g. translation)"
            : "";
      return `  "${f.key}": <${f.type}>${desc}${role}`;
    })
    .join(",\n");
  return `\n\nRespond ONLY with valid JSON matching:\n{\n${shape}\n}`;
}

function buildAttachmentNodeData(att: BlockAttachment): FlowNodeData {
  const data: FlowNodeData = { label: att.label };

  if (att.inlinePrimitive) {
    const baseInstructions = att.inlinePrimitive.instructions;
    const effectiveSchema = att.outputSchema
      ?? (att.inlinePrimitive.kind === "rewriter" && !mentionsOutputShape(baseInstructions)
        ? [{ key: "rewrittenMessage", type: "string" as const, description: "Replacement user message" }]
        : undefined);
    const contract = effectiveSchema && !mentionsOutputShape(baseInstructions)
      ? renderOutputContract(effectiveSchema)
      : "";
    data.inlineInstructions = baseInstructions + contract;
    if (att.inlinePrimitive.model) data.inlineModel = att.inlinePrimitive.model;
    data.primitiveKind = att.inlinePrimitive.kind;
    if (
      att.inlinePrimitive.kind === "responder" &&
      effectiveSchema?.length
    ) {
      data.responderOutputSchema = effectiveSchema;
    }
  }
  if (att.varsRead?.length) data.varsRead = att.varsRead;
  if (att.varsPatch && Object.keys(att.varsPatch).length > 0) data.varsPatch = att.varsPatch;
  if (att.displayName) data.displayName = att.displayName;
  if (att.displayColor) data.displayColor = att.displayColor;

  if (att.mode === "override") {
    data.canRewrite = true;
    data.persistOutput = false;
  }

  return data;
}

function applyBlockDisplaySettings(data: FlowNodeData, block: MessageBlock): void {
  if (block.settings.displayName) data.displayName = block.settings.displayName;
  if (block.settings.displayColor) data.displayColor = block.settings.displayColor;
  if (block.settings.displaySide) data.displaySide = block.settings.displaySide;
  if (block.settings.persistOutput !== undefined) data.persistOutput = block.settings.persistOutput;
}

function emitBeforeAttachments(ctx: CompilerContext, attachments: BlockAttachment[]): void {
  const befores = attachments.filter((a) => a.mode === "before");
  for (const att of befores) {
    const type = resolveAttachmentNodeType(att);
    const id = addNode(ctx, type, type, buildAttachmentNodeData(att));
    addEdge(ctx, ctx.lastNodeId, id);
    ctx.lastNodeId = id;
  }
}

function emitAfterAttachments(ctx: CompilerContext, attachments: BlockAttachment[]): void {
  const afters = attachments.filter((a) => a.mode === "after");
  for (const att of afters) {
    const type = resolveAttachmentNodeType(att);
    const data = buildAttachmentNodeData(att);
    data.persistOutput = false;
    const id = addNode(ctx, type, type, data);
    addEdge(ctx, ctx.lastNodeId, id);
    ctx.lastNodeId = id;
  }
}

function emitOverrideAttachments(ctx: CompilerContext, attachments: BlockAttachment[]): void {
  const overrides = attachments.filter((a) => a.mode === "override");
  if (overrides.length === 0) return;

  for (const att of overrides) {
    const rewriterType = resolveAttachmentNodeType(att);
    const rewriterData = buildAttachmentNodeData(att);

    if (!att.condition) {
      const rewriterId = addNode(ctx, rewriterType, "rewriter", rewriterData);
      addEdge(ctx, ctx.lastNodeId, rewriterId);
      ctx.lastNodeId = rewriterId;
      continue;
    }

    const condId = addNode(ctx, "condition", "condition", {
      label: `${att.label}?`,
      condition: att.condition,
    });
    addEdge(ctx, ctx.lastNodeId, condId);

    const rewriterId = addNode(ctx, rewriterType, "rewriter", rewriterData);
    addEdge(ctx, condId, rewriterId, { sourceHandle: "true", branch: "true" });

    const joinId = addNode(ctx, "join", "join", { label: "Merge" });
    addEdge(ctx, condId, joinId, { sourceHandle: "false", branch: "false" });
    addEdge(ctx, rewriterId, joinId);

    ctx.lastNodeId = joinId;
  }
}

function emitParallelAttachments(
  ctx: CompilerContext,
  attachments: BlockAttachment[],
  block: MessageBlock
): void {
  const parallels = attachments.filter((a) => a.mode === "parallel");
  if (parallels.length === 0) return;

  const forkId = addNode(ctx, "fork", "fork", { label: "Parallel" });
  addEdge(ctx, ctx.lastNodeId, forkId);

  const parallelNodeIds: string[] = [];
  for (const att of parallels) {
    const type = resolveAttachmentNodeType(att);
    const data = buildAttachmentNodeData(att);
    applyBlockDisplaySettings(data, block);
    const id = addNode(ctx, type, type, data);
    addEdge(ctx, forkId, id);
    parallelNodeIds.push(id);
  }

  const joinId = addNode(ctx, "join", "join", { label: "Merge" });
  for (const pid of parallelNodeIds) {
    addEdge(ctx, pid, joinId);
  }

  ctx.lastNodeId = joinId;
}

function emitEvalAttachments(ctx: CompilerContext, attachments: BlockAttachment[]): void {
  const evals = attachments.filter(
    (a) => a.mode === "after" && a.inlinePrimitive?.kind === "eval"
  );
  for (const att of evals) {
    const data = buildAttachmentNodeData(att);
    addNode(ctx, "eval", "eval", data);
  }
}

function compileUserBlock(ctx: CompilerContext, block: MessageBlock): void {
  emitAfterAttachments(ctx, block.attachments);
  emitOverrideAttachments(ctx, block.attachments);
}

function compileSystemBlock(ctx: CompilerContext, block: MessageBlock): void {
  if (block.content) {
    ctx.systemPreamble.push(block.content);
  }
}

function compileContextBlock(ctx: CompilerContext, block: MessageBlock): void {
  emitBeforeAttachments(ctx, block.attachments);

  const data: FlowNodeData = {
    label: block.label,
    persistOutput: false,
  };
  if (block.content) data.inlineInstructions = block.content;

  const id = addNode(ctx, "researcher", "researcher", data);
  addEdge(ctx, ctx.lastNodeId, id);
  ctx.lastNodeId = id;

  emitAfterAttachments(ctx, block.attachments);
}

function compileAssistantBlock(ctx: CompilerContext, block: MessageBlock): void {
  const parallels = block.attachments.filter((a) => a.mode === "parallel");
  const befores = block.attachments.filter((a) => a.mode === "before");
  const nonEvalAfters = block.attachments.filter(
    (a) => a.mode === "after" && a.inlinePrimitive?.kind !== "eval"
  );

  // Path 1: PARALLEL attachments -- emit fork/join, skip separate responder
  if (parallels.length > 0) {
    emitBeforeAttachments(ctx, block.attachments);
    emitParallelAttachments(ctx, block.attachments, block);
    emitAfterAttachments(ctx, nonEvalAfters);
    emitEvalAttachments(ctx, block.attachments);
    return;
  }

  // Path 2: BEFORE attachments -- check if last one is a responder
  if (befores.length > 0) {
    const lastBefore = befores[befores.length - 1];
    const lastIsResponder = isResponderAttachment(lastBefore);

    if (lastIsResponder) {
      // Emit all BEFOREs except the last
      const allButLast = befores.slice(0, -1);
      for (const att of allButLast) {
        const type = resolveAttachmentNodeType(att);
        const id = addNode(ctx, type, type, buildAttachmentNodeData(att));
        addEdge(ctx, ctx.lastNodeId, id);
        ctx.lastNodeId = id;
      }

      // Emit the last BEFORE as a responder with block display settings merged
      const data = buildAttachmentNodeData(lastBefore);
      applyBlockDisplaySettings(data, block);
      const nodeType = isResponderAttachment(lastBefore) ? "responder" : resolveAttachmentNodeType(lastBefore);
      const id = addNode(ctx, nodeType, nodeType, data);
      addEdge(ctx, ctx.lastNodeId, id);
      ctx.lastNodeId = id;

      emitAfterAttachments(ctx, nonEvalAfters);
      emitEvalAttachments(ctx, block.attachments);
      return;
    }

    // BEFORE attachments exist but none is a responder -- chain them, then add responder from block.content
    emitBeforeAttachments(ctx, block.attachments);
  }

  // Path 3: Emit a responder node from the block itself
  const data: FlowNodeData = { label: block.label };
  applyBlockDisplaySettings(data, block);
  if (block.content) {
    data.inlineInstructions = block.content;
    data.primitiveKind = "responder";
  }

  const id = addNode(ctx, "responder", "responder", data);
  addEdge(ctx, ctx.lastNodeId, id);
  ctx.lastNodeId = id;

  emitAfterAttachments(ctx, nonEvalAfters);
  emitEvalAttachments(ctx, block.attachments);
}

function compileExtractBlock(ctx: CompilerContext, block: MessageBlock): void {
  const cfg = block.extractConfig;
  if (!cfg) return;

  const data: FlowNodeData = {
    label: block.label,
    persistOutput: false,
    primitiveKind: "state_extractor",
  };

  if (cfg.instructions) data.inlineInstructions = cfg.instructions;
  if (cfg.model) data.inlineModel = cfg.model;
  if (cfg.outputSchema.length > 0) data.extractOutputSchema = cfg.outputSchema;
  if (cfg.varsRead?.length) data.varsRead = cfg.varsRead;
  if (cfg.varsPatch && Object.keys(cfg.varsPatch).length > 0) data.varsPatch = cfg.varsPatch;

  const id = addNode(ctx, "state_extractor", "state_extractor", data);
  addEdge(ctx, ctx.lastNodeId, id);
  ctx.lastNodeId = id;
}

function compileBlockChain(ctx: CompilerContext, blocks: MessageBlock[]): void {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);
  for (const block of sorted) {
    compileBlock(ctx, block);
  }
}

function compileBranchBlock(ctx: CompilerContext, block: MessageBlock): void {
  const cfg = block.branchConfig;
  if (!cfg) return;

  const condId = addNode(ctx, "condition", "condition", {
    label: block.label,
    condition: cfg.condition,
  });
  addEdge(ctx, ctx.lastNodeId, condId);

  // Compile true branch
  let trueEndId: string;
  if (cfg.trueBranch.length > 0) {
    ctx.lastNodeId = condId;
    ctx.pendingEdgeOpts = { sourceHandle: "true", branch: "true" };
    compileBlockChain(ctx, cfg.trueBranch);
    trueEndId = ctx.lastNodeId;
  } else {
    trueEndId = condId;
  }

  // Compile false branch
  let falseEndId: string;
  if (cfg.falseBranch.length > 0) {
    ctx.lastNodeId = condId;
    ctx.pendingEdgeOpts = { sourceHandle: "false", branch: "false" };
    compileBlockChain(ctx, cfg.falseBranch);
    falseEndId = ctx.lastNodeId;
  } else {
    falseEndId = condId;
  }

  // Join
  const joinId = addNode(ctx, "join", "join", { label: "Merge" });

  if (trueEndId !== condId) {
    addEdge(ctx, trueEndId, joinId);
  } else {
    addEdge(ctx, condId, joinId, { sourceHandle: "true", branch: "true" });
  }

  if (falseEndId !== condId) {
    addEdge(ctx, falseEndId, joinId);
  } else {
    addEdge(ctx, condId, joinId, { sourceHandle: "false", branch: "false" });
  }

  ctx.lastNodeId = joinId;
}

function compileGoalBlock(ctx: CompilerContext, block: MessageBlock): void {
  const cfg = block.goalConfig;
  if (!cfg) return;

  const condId = addNode(ctx, "condition", "condition", {
    label: block.label,
    goalCheck: true,
    goalConditions: cfg.conditions,
    goalConditionLogic: cfg.conditionLogic,
    goalId: cfg.goalId,
  });
  addEdge(ctx, ctx.lastNodeId, condId);

  // TRUE path: optional responder with closing message, then terminus
  let trueEndId: string;
  if (cfg.onComplete.message) {
    const responderId = addNode(ctx, "responder", "responder", {
      label: `${cfg.name} — closing`,
      inlineInstructions: cfg.onComplete.message,
      primitiveKind: "responder",
      displayName: "System",
    });
    addEdge(ctx, condId, responderId, { sourceHandle: "true", branch: "true" });

    const terminusId = addNode(ctx, "terminus", "terminus", {
      label: "End",
      goalId: cfg.goalId,
      goalAction: cfg.onComplete,
    });
    addEdge(ctx, responderId, terminusId);
    trueEndId = terminusId;
  } else {
    const terminusId = addNode(ctx, "terminus", "terminus", {
      label: "End",
      goalId: cfg.goalId,
      goalAction: cfg.onComplete,
    });
    addEdge(ctx, condId, terminusId, { sourceHandle: "true", branch: "true" });
    trueEndId = terminusId;
  }

  // FALSE path: pass-through to join
  const joinId = addNode(ctx, "join", "join", { label: "Merge" });
  addEdge(ctx, condId, joinId, { sourceHandle: "false", branch: "false" });

  // Terminus is a dead-end — no edge to join from true path
  void trueEndId;

  ctx.lastNodeId = joinId;
}

function compileParallelBlock(ctx: CompilerContext, block: MessageBlock): void {
  const cfg = block.parallelConfig;
  if (!cfg) return;

  const forkId = addNode(ctx, "fork", "fork", { label: block.label });
  addEdge(ctx, ctx.lastNodeId, forkId);

  let laneAEnd = forkId;
  if (cfg.laneA.length > 0) {
    ctx.lastNodeId = forkId;
    ctx.pendingEdgeOpts = { sourceHandle: "laneA", branch: "laneA" };
    compileBlockChain(ctx, cfg.laneA);
    laneAEnd = ctx.lastNodeId;
  }

  let laneBEnd = forkId;
  if (cfg.laneB.length > 0) {
    ctx.lastNodeId = forkId;
    ctx.pendingEdgeOpts = { sourceHandle: "laneB", branch: "laneB" };
    compileBlockChain(ctx, cfg.laneB);
    laneBEnd = ctx.lastNodeId;
  }

  const joinId = addNode(ctx, "join", "join", { label: "Merge parallel" });

  if (laneAEnd !== forkId) {
    addEdge(ctx, laneAEnd, joinId);
  } else {
    addEdge(ctx, forkId, joinId, { sourceHandle: "laneA", branch: "laneA" });
  }

  if (laneBEnd !== forkId) {
    addEdge(ctx, laneBEnd, joinId);
  } else {
    addEdge(ctx, forkId, joinId, { sourceHandle: "laneB", branch: "laneB" });
  }

  ctx.lastNodeId = joinId;
}

function compileBlock(ctx: CompilerContext, block: MessageBlock): void {
  switch (block.type) {
    case "user":
      compileUserBlock(ctx, block);
      break;
    case "system":
      compileSystemBlock(ctx, block);
      break;
    case "context":
      compileContextBlock(ctx, block);
      break;
    case "assistant":
      compileAssistantBlock(ctx, block);
      break;
    case "extract":
      compileExtractBlock(ctx, block);
      break;
    case "branch":
      compileBranchBlock(ctx, block);
      break;
    case "parallel":
      compileParallelBlock(ctx, block);
      break;
    case "goal":
      compileGoalBlock(ctx, block);
      break;
  }
}

export interface CompileResult {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

export function compileChatBuilder(spec: ChatBuilderSpec): CompileResult {
  const sorted = [...spec.blocks].sort((a, b) => a.position - b.position);

  const ctx: CompilerContext = {
    nodes: [],
    edges: [],
    nodeCounter: 0,
    edgeCounter: 0,
    lastNodeId: "",
    xPos: 50,
    systemPreamble: [],
  };

  const inputId = addNode(ctx, "input", "input", { label: "User Message" });
  ctx.lastNodeId = inputId;

  for (const block of sorted) {
    compileBlock(ctx, block);
  }

  const outputId = addNode(ctx, "output", "output", { label: "Output" });
  addEdge(ctx, ctx.lastNodeId, outputId);

  return { nodes: ctx.nodes, edges: ctx.edges };
}

export function extractGoalsFromBlocks(blocks: MessageBlock[]): AgentGoal[] {
  return blocks
    .filter((b) => b.type === "goal" && b.goalConfig)
    .map((b) => {
      const cfg = b.goalConfig!;
      return {
        id: cfg.goalId,
        name: cfg.name,
        description: cfg.description ?? "",
        conditions: cfg.conditions,
        conditionLogic: cfg.conditionLogic,
        onComplete: cfg.onComplete,
      };
    });
}

/**
 * Combine hub-authored goals (Plan objectives) with goal blocks. Block order
 * wins for shared ids; hub-only goals are appended after.
 */
export function mergeGoalsFromHubAndBlocks(
  hubGoals: AgentGoal[],
  blockGoals: AgentGoal[]
): AgentGoal[] {
  if (blockGoals.length === 0) {
    return hubGoals;
  }
  const byId = new Map<string, AgentGoal>();
  for (const g of hubGoals) {
    byId.set(g.id, g);
  }
  for (const g of blockGoals) {
    byId.set(g.id, g);
  }
  const ordered: AgentGoal[] = [];
  const seen = new Set<string>();
  for (const g of blockGoals) {
    ordered.push(byId.get(g.id)!);
    seen.add(g.id);
  }
  for (const g of hubGoals) {
    if (!seen.has(g.id)) {
      ordered.push(byId.get(g.id)!);
      seen.add(g.id);
    }
  }
  return ordered;
}

export function compileToFlowDefinition(
  spec: ChatBuilderSpec,
  stateConfig?: AgentStateConfig,
  orchestrator?: OrchestratorConfig,
  envVars?: EnvVarDefinition[]
): FlowDefinition {
  const { nodes, edges } = compileChatBuilder(spec);

  const blockGoals = extractGoalsFromBlocks(spec.blocks);
  const effectiveStateConfig: AgentStateConfig | undefined = stateConfig
    ? {
        ...stateConfig,
        goals: mergeGoalsFromHubAndBlocks(stateConfig.goals ?? [], blockGoals),
      }
    : undefined;

  const effectiveOrchestrator: OrchestratorConfig | undefined = effectiveStateConfig
    ? stateConfigToOrchestrator(effectiveStateConfig)
    : orchestrator;

  return {
    version: 2,
    ...(effectiveOrchestrator ? { orchestrator: effectiveOrchestrator } : {}),
    ...(effectiveStateConfig ? { stateConfig: effectiveStateConfig } : {}),
    chatBuilder: spec,
    nodes,
    edges,
    ...(envVars?.length ? { envVars } : {}),
  };
}
