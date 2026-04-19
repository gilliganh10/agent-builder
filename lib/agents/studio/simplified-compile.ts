import type {
  AgentStateConfig,
  EnvVarDefinition,
  ExtractFieldSchema,
  FlowDefinition,
  FlowEdge,
  FlowNode,
  FlowNodeData,
  FlowNodeType,
  OrchestratorConfig,
} from "@/db/agents/schema";
import { stateConfigToOrchestrator } from "@/lib/agents/shared/state-config-utils";
import type {
  SimplifiedBuilderSpec,
  SimplifiedConditionStep,
  SimplifiedEndStep,
  SimplifiedMessageStep,
  SimplifiedParallelStep,
  SimplifiedStep,
  SimplifiedTransformStep,
  SimplifiedUpdateStateStep,
  SimplifiedVarMapping,
} from "./simplified-types";

// ---------------------------------------------------------------------------
// Compiler context
// ---------------------------------------------------------------------------

interface Ctx {
  nodes: FlowNode[];
  edges: FlowEdge[];
  nodeCounter: number;
  edgeCounter: number;
  lastNodeId: string;
  xPos: number;
  pendingEdgeOpts?: { sourceHandle: string; branch: string };
  byId: Map<string, SimplifiedStep>;
  layoutHints?: Record<string, { x: number; y: number }>;
}

function nextNodeId(ctx: Ctx, prefix: string): string {
  ctx.nodeCounter++;
  return `${prefix}-${ctx.nodeCounter}`;
}

function nextEdgeId(ctx: Ctx): string {
  ctx.edgeCounter++;
  return `e-${ctx.edgeCounter}`;
}

function addNode(
  ctx: Ctx,
  type: FlowNodeType,
  idPrefix: string,
  data: FlowNodeData,
  layoutFor?: string
): string {
  const id = nextNodeId(ctx, idPrefix);
  const hint = layoutFor ? ctx.layoutHints?.[layoutFor] : undefined;
  const position = hint ?? { x: ctx.xPos, y: 200 };
  ctx.nodes.push({ id, type, position, data });
  if (!hint) ctx.xPos += 220;
  return id;
}

function addEdge(
  ctx: Ctx,
  source: string,
  target: string,
  opts?: { sourceHandle?: string; branch?: string }
): void {
  let effective = opts;
  if (!effective && ctx.pendingEdgeOpts) {
    effective = ctx.pendingEdgeOpts;
    ctx.pendingEdgeOpts = undefined;
  }
  ctx.edges.push({
    id: nextEdgeId(ctx),
    source,
    target,
    ...(effective?.sourceHandle ? { sourceHandle: effective.sourceHandle } : {}),
    ...(effective?.branch ? { data: { branch: effective.branch } } : {}),
  });
}

// ---------------------------------------------------------------------------
// Instruction / schema helpers
// ---------------------------------------------------------------------------

function mentionsJsonShape(text: string): boolean {
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

function varsPatchFromMappings(
  mappings?: SimplifiedVarMapping[]
): Record<string, string> | undefined {
  if (!mappings || mappings.length === 0) return undefined;
  const out: Record<string, string> = {};
  for (const m of mappings) {
    if (m.from && m.to) out[m.from] = m.to;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

// ---------------------------------------------------------------------------
// Per-kind emitters
// ---------------------------------------------------------------------------

function emitMessage(ctx: Ctx, step: SimplifiedMessageStep): void {
  const base = step.instructions ?? "";
  const schema =
    step.outputMode === "json_schema" && step.jsonSchema?.length
      ? step.jsonSchema
      : undefined;
  const contract = schema && !mentionsJsonShape(base) ? renderOutputContract(schema) : "";

  const data: FlowNodeData = {
    label: step.label,
    primitiveKind: "responder",
    inlineInstructions: base + contract,
  };
  if (step.model) data.inlineModel = step.model;
  if (step.varsRead?.length) data.varsRead = step.varsRead;
  const varsPatch = varsPatchFromMappings(step.varsFromOutput);
  if (varsPatch) data.varsPatch = varsPatch;
  if (schema) data.responderOutputSchema = schema;

  const id = addNode(ctx, "responder", "responder", data, step.id);
  addEdge(ctx, ctx.lastNodeId, id);
  ctx.lastNodeId = id;
}

function emitTransform(ctx: Ctx, step: SimplifiedTransformStep): void {
  const base = step.instructions ?? "";
  const authoredSchema =
    step.outputMode === "json_schema" && step.jsonSchema?.length
      ? step.jsonSchema
      : undefined;
  const effectiveSchema: ExtractFieldSchema[] | undefined =
    authoredSchema ??
    (mentionsJsonShape(base)
      ? undefined
      : [
          {
            key: "rewrittenMessage",
            type: "string",
            description: "Replacement user message",
          },
        ]);
  const contract =
    effectiveSchema && !mentionsJsonShape(base)
      ? renderOutputContract(effectiveSchema)
      : "";

  const data: FlowNodeData = {
    label: step.label,
    primitiveKind: "rewriter",
    inlineInstructions: base + contract,
    canRewrite: true,
    persistOutput: false,
  };
  if (step.model) data.inlineModel = step.model;
  if (step.varsRead?.length) data.varsRead = step.varsRead;
  const varsPatch = varsPatchFromMappings(step.varsFromOutput);
  if (varsPatch) data.varsPatch = varsPatch;

  const id = addNode(ctx, "rewriter", "rewriter", data, step.id);
  addEdge(ctx, ctx.lastNodeId, id);
  ctx.lastNodeId = id;
}

function emitUpdateState(ctx: Ctx, step: SimplifiedUpdateStateStep): void {
  const data: FlowNodeData = {
    label: step.label,
    primitiveKind: "state_extractor",
    persistOutput: false,
  };
  if (step.instructions) data.inlineInstructions = step.instructions;
  if (step.model) data.inlineModel = step.model;
  if (step.jsonSchema?.length) data.extractOutputSchema = step.jsonSchema;
  if (step.varsRead?.length) data.varsRead = step.varsRead;
  const varsPatch = varsPatchFromMappings(step.varsFromOutput);
  if (varsPatch) data.varsPatch = varsPatch;

  const id = addNode(ctx, "state_extractor", "state_extractor", data, step.id);
  addEdge(ctx, ctx.lastNodeId, id);
  ctx.lastNodeId = id;
}

function emitCondition(ctx: Ctx, step: SimplifiedConditionStep): void {
  const condId = addNode(
    ctx,
    "condition",
    "condition",
    { label: step.label, condition: step.condition },
    step.id
  );
  addEdge(ctx, ctx.lastNodeId, condId);

  let yesEnd = condId;
  if (step.yesSteps.length > 0) {
    ctx.lastNodeId = condId;
    ctx.pendingEdgeOpts = { sourceHandle: "true", branch: "true" };
    compileStepIds(ctx, step.yesSteps);
    yesEnd = ctx.lastNodeId;
  }

  let noEnd = condId;
  if (step.noSteps.length > 0) {
    ctx.lastNodeId = condId;
    ctx.pendingEdgeOpts = { sourceHandle: "false", branch: "false" };
    compileStepIds(ctx, step.noSteps);
    noEnd = ctx.lastNodeId;
  }

  const joinId = addNode(ctx, "join", "join", { label: "Merge" });
  if (yesEnd !== condId) addEdge(ctx, yesEnd, joinId);
  else addEdge(ctx, condId, joinId, { sourceHandle: "true", branch: "true" });
  if (noEnd !== condId) addEdge(ctx, noEnd, joinId);
  else addEdge(ctx, condId, joinId, { sourceHandle: "false", branch: "false" });

  ctx.lastNodeId = joinId;
}

function emitParallel(ctx: Ctx, step: SimplifiedParallelStep): void {
  const forkId = addNode(ctx, "fork", "fork", { label: step.label }, step.id);
  addEdge(ctx, ctx.lastNodeId, forkId);

  let laneAEnd = forkId;
  if (step.laneA.length > 0) {
    ctx.lastNodeId = forkId;
    ctx.pendingEdgeOpts = { sourceHandle: "laneA", branch: "laneA" };
    compileStepIds(ctx, step.laneA);
    laneAEnd = ctx.lastNodeId;
  }

  let laneBEnd = forkId;
  if (step.laneB.length > 0) {
    ctx.lastNodeId = forkId;
    ctx.pendingEdgeOpts = { sourceHandle: "laneB", branch: "laneB" };
    compileStepIds(ctx, step.laneB);
    laneBEnd = ctx.lastNodeId;
  }

  const joinId = addNode(ctx, "join", "join", { label: "Merge parallel" });
  if (laneAEnd !== forkId) addEdge(ctx, laneAEnd, joinId);
  else addEdge(ctx, forkId, joinId, { sourceHandle: "laneA", branch: "laneA" });
  if (laneBEnd !== forkId) addEdge(ctx, laneBEnd, joinId);
  else addEdge(ctx, forkId, joinId, { sourceHandle: "laneB", branch: "laneB" });

  ctx.lastNodeId = joinId;
}

function emitEnd(ctx: Ctx, step: SimplifiedEndStep): void {
  if (step.closeConversation) {
    if (step.closingMessage) {
      const responderId = addNode(
        ctx,
        "responder",
        "responder",
        {
          label: `${step.label} — closing`,
          inlineInstructions: step.closingMessage,
          primitiveKind: "responder",
          displayName: "System",
        },
        step.id
      );
      addEdge(ctx, ctx.lastNodeId, responderId);
      ctx.lastNodeId = responderId;
    }

    const terminusId = addNode(ctx, "terminus", "terminus", {
      label: step.label || "End",
      ...(step.goalId ? { goalId: step.goalId } : {}),
      goalAction: { type: "close" as const, ...(step.closingMessage ? { message: step.closingMessage } : {}) },
    });
    addEdge(ctx, ctx.lastNodeId, terminusId);
    ctx.lastNodeId = terminusId;
  }

  const outputId = addNode(ctx, "output", "output", { label: step.label || "Output" });
  addEdge(ctx, ctx.lastNodeId, outputId);
  ctx.lastNodeId = outputId;
}

// ---------------------------------------------------------------------------
// Step-list compilation (used for main line and for branch/parallel children)
// ---------------------------------------------------------------------------

function compileStep(ctx: Ctx, step: SimplifiedStep): void {
  switch (step.kind) {
    case "input": {
      const id = addNode(ctx, "input", "input", { label: step.label || "User Message" }, step.id);
      ctx.lastNodeId = id;
      return;
    }
    case "message":
      emitMessage(ctx, step);
      return;
    case "transform":
      emitTransform(ctx, step);
      return;
    case "update_state":
      emitUpdateState(ctx, step);
      return;
    case "condition":
      emitCondition(ctx, step);
      return;
    case "parallel":
      emitParallel(ctx, step);
      return;
    case "end":
      emitEnd(ctx, step);
      return;
  }
}

function compileStepIds(ctx: Ctx, ids: string[]): void {
  for (const stepId of ids) {
    const step = ctx.byId.get(stepId);
    if (!step) {
      throw new Error(`Simplified builder references unknown step id: ${stepId}`);
    }
    compileStep(ctx, step);
  }
}

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

export interface SimplifiedValidationError {
  code: string;
  message: string;
  stepId?: string;
}

function collectReferenced(step: SimplifiedStep): string[] {
  if (step.kind === "condition") return [...step.yesSteps, ...step.noSteps];
  if (step.kind === "parallel") return [...step.laneA, ...step.laneB];
  return [];
}

/** Run structural checks on a simplified spec. Throws on the first error. */
export function validateSimplifiedBuilder(spec: SimplifiedBuilderSpec): void {
  if (spec.version !== 1) {
    throw new Error(`Unsupported simplifiedBuilder version: ${String(spec.version)}`);
  }

  const byId = new Map<string, SimplifiedStep>();
  for (const step of spec.steps) {
    if (byId.has(step.id)) {
      throw new Error(`Duplicate step id: ${step.id}`);
    }
    byId.set(step.id, step);
  }

  if (spec.rootOrder.length < 2) {
    throw new Error("rootOrder must contain at least an input and an end step");
  }
  const first = byId.get(spec.rootOrder[0]);
  if (!first || first.kind !== "input") {
    throw new Error("rootOrder must start with an 'input' step");
  }
  const last = byId.get(spec.rootOrder[spec.rootOrder.length - 1]);
  if (!last || last.kind !== "end") {
    throw new Error("rootOrder must end with an 'end' step");
  }

  // Each step should be referenced at most once across rootOrder + child lists.
  const references = new Map<string, number>();
  const bump = (id: string) => references.set(id, (references.get(id) ?? 0) + 1);
  for (const id of spec.rootOrder) bump(id);
  for (const step of spec.steps) {
    for (const child of collectReferenced(step)) bump(child);
  }

  for (const [id, count] of references.entries()) {
    if (!byId.has(id)) {
      throw new Error(`Reference to unknown step id: ${id}`);
    }
    if (count > 1) {
      throw new Error(`Step ${id} is referenced ${count} times; every step must be referenced exactly once`);
    }
  }

  // Every step defined must be reachable from references.
  for (const step of spec.steps) {
    if (!references.has(step.id)) {
      throw new Error(`Step ${step.id} is defined but never referenced`);
    }
  }

  // Kind-specific rules.
  let inputCount = 0;
  let endCount = 0;
  for (const step of spec.steps) {
    if (step.kind === "input") inputCount++;
    if (step.kind === "end") endCount++;
    if (step.kind === "update_state") {
      if (!step.jsonSchema || step.jsonSchema.length === 0) {
        throw new Error(`Update State step '${step.label || step.id}' needs at least one extraction field`);
      }
    }
  }
  if (inputCount !== 1) throw new Error(`Expected exactly 1 input step, got ${inputCount}`);
  if (endCount !== 1) throw new Error(`Expected exactly 1 end step, got ${endCount}`);
}

// ---------------------------------------------------------------------------
// Public entrypoint — compile to a FlowDefinition fragment
// ---------------------------------------------------------------------------

export interface CompiledGraph {
  nodes: FlowNode[];
  edges: FlowEdge[];
}

/**
 * Compile a simplified builder spec into runtime `nodes`/`edges`. The
 * produced graph is compatible with `executeFlow` and mirrors the shape
 * emitted by `compileChatBuilder` so the same handlers apply.
 */
export function compileSimplifiedGraph(spec: SimplifiedBuilderSpec): CompiledGraph {
  validateSimplifiedBuilder(spec);

  const ctx: Ctx = {
    nodes: [],
    edges: [],
    nodeCounter: 0,
    edgeCounter: 0,
    lastNodeId: "",
    xPos: 50,
    byId: new Map(spec.steps.map((s) => [s.id, s])),
    layoutHints: spec.layoutHints,
  };

  compileStepIds(ctx, spec.rootOrder);

  return { nodes: ctx.nodes, edges: ctx.edges };
}

/**
 * Compile a simplified builder spec into a full FlowDefinition, merging
 * in orchestrator / stateConfig / envVars and keeping the source spec
 * around so reloads are lossless.
 */
export function compileSimplifiedToFlowDefinition(
  spec: SimplifiedBuilderSpec,
  opts: {
    stateConfig?: AgentStateConfig;
    orchestrator?: OrchestratorConfig;
    envVars?: EnvVarDefinition[];
    existingLocks?: string[];
  } = {}
): FlowDefinition {
  const { nodes, edges } = compileSimplifiedGraph(spec);

  const effectiveOrchestrator: OrchestratorConfig | undefined = opts.stateConfig
    ? stateConfigToOrchestrator(opts.stateConfig, opts.existingLocks ?? [])
    : opts.orchestrator;

  return {
    version: 2,
    ...(effectiveOrchestrator ? { orchestrator: effectiveOrchestrator } : {}),
    ...(opts.stateConfig ? { stateConfig: opts.stateConfig } : {}),
    simplifiedBuilder: spec,
    nodes,
    edges,
    ...(opts.envVars?.length ? { envVars: opts.envVars } : {}),
  };
}
