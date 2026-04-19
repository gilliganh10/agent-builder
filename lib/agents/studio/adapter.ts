import type {
  AgentDefinition,
  AgentStateConfig,
  AgentGoal,
  BlockAttachment,
  ChatBuilderSpec,
  EnvVarDefinition,
  FlowDefinition,
  MessageBlock,
  StateFieldDefinition,
} from "@/db/agents/schema";
import { V2_NODE_TYPES } from "@/db/agents/schema";
import {
  resolveStateConfig,
  stateConfigToOrchestrator,
} from "@/lib/agents/shared/state-config-utils";
import { compileToFlowDefinition } from "@/lib/agents/chat-builder/compiler";
import type {
  StudioApplyResult,
  StudioFlags,
  StudioMemoryWrite,
  StudioModel,
  StudioModelPatch,
  StudioObjective,
  StudioOutputShape,
  StudioStep,
  StudioStepBase,
  StudioStepKind,
  StudioStepTrigger,
  ParallelStep,
} from "./types";

// ---------------------------------------------------------------------------
// READ — getStudioModel
// ---------------------------------------------------------------------------

/**
 * Build a canonical studio view-model from an agent. Never mutates `agent`.
 * Plan v1 steps are derived from `flowDefinition.chatBuilder` when present;
 * otherwise `steps` is empty and `sourceOfTruth === "graph"`.
 */
export function getStudioModel(agent: AgentDefinition): StudioModel {
  const flow = agent.flowDefinition ?? null;
  const stateConfig = resolveStateConfig(flow ?? undefined);
  const hasChatBuilder = Boolean(flow?.chatBuilder?.blocks?.length);

  const hasPrimitiveNodes = Boolean(
    flow?.nodes?.some((n) => V2_NODE_TYPES.includes(n.type))
  );
  const isV2 = flow?.version === 2 || hasPrimitiveNodes;

  const { steps, unsurfacedBlockTypes, hasGraphOnlyConstructs } = hasChatBuilder
    ? extractStudioSteps(flow!.chatBuilder!)
    : { steps: [], unsurfacedBlockTypes: [], hasGraphOnlyConstructs: Boolean(flow?.nodes?.length) };

  const flags: StudioFlags = {
    hasChatBuilder,
    hasGraphOnlyConstructs,
    isV2,
    unsurfacedBlockTypes,
  };

  const objectives = stateConfig.goals.map(goalToObjective);

  return {
    sourceOfTruth: hasChatBuilder ? "chatBuilder" : "graph",
    flags,
    purpose: {
      name: agent.name,
      description: agent.description,
      charter: agent.instructions,
      mode: agent.mode,
    },
    objectives,
    memory: {
      scope: stateConfig.scope,
      fields: stateConfig.fields,
      locks: flow?.orchestrator?.locks ?? [],
    },
    inputs: flow?.envVars ?? [],
    outputs: {
      reply: agent.outputSchema ?? null,
    },
    steps,
    rawChatBuilder: hasChatBuilder ? flow!.chatBuilder : undefined,
  };
}

function goalToObjective(goal: AgentGoal): StudioObjective {
  return {
    id: goal.id,
    name: goal.name,
    description: goal.description,
    hasCompletionRules: goal.conditions.length > 0,
  };
}

function objectiveToGoal(obj: StudioObjective, existing?: AgentGoal): AgentGoal {
  return existing
    ? { ...existing, name: obj.name, description: obj.description }
    : {
        id: obj.id,
        name: obj.name,
        description: obj.description,
        conditions: [],
        conditionLogic: "all",
        onComplete: { type: "close" },
      };
}

// ---------------------------------------------------------------------------
// Plan v1 step extraction
// ---------------------------------------------------------------------------

const PLAN_V1_BLOCK_TYPES = new Set(["user", "assistant", "extract", "branch", "parallel"]);

interface ExtractStepsResult {
  steps: StudioStep[];
  unsurfacedBlockTypes: string[];
  hasGraphOnlyConstructs: boolean;
}

/**
 * Walk the chatBuilder and project its blocks + attachments into the
 * opinionated Plan v1 step list.
 *
 *   user block       → each attachment becomes an understand/transform/extract
 *                      step (the block itself is not a step)
 *   assistant block  → responder attachment (or block.content) → respond step;
 *                      other attachments become understand/transform/extract
 *   extract block    → one extract step
 *   branch block     → one branch step (with nested labels)
 *   system/context/goal → currently not Plan-surfaced; flagged
 */
/**
 * Public helper for UIs that edit the chat builder in-memory (e.g. Plan tab):
 * project a `ChatBuilderSpec` into ordered Plan v1 steps without needing a
 * persisted `AgentDefinition`.
 */
export function getStudioStepsFromSpec(spec: ChatBuilderSpec): StudioStep[] {
  return extractStudioSteps(spec).steps;
}

function extractStudioSteps(spec: ChatBuilderSpec): ExtractStepsResult {
  const sorted = [...spec.blocks].sort((a, b) => a.position - b.position);
  const steps: StudioStep[] = [];
  const unsurfaced = new Set<string>();

  for (const block of sorted) {
    if (!PLAN_V1_BLOCK_TYPES.has(block.type)) {
      unsurfaced.add(block.type);
      continue;
    }

    if (block.type === "user") {
      for (const att of block.attachments) {
        const step = attachmentToStep(block, att, "user");
        if (step) steps.push(step);
      }
      continue;
    }

    if (block.type === "assistant") {
      let emittedRespond = false;
      for (const att of block.attachments) {
        const step = attachmentToStep(block, att, "assistant");
        if (!step) continue;
        if (step.kind === "respond") emittedRespond = true;
        steps.push(step);
      }
      if (!emittedRespond && block.content) {
        steps.push(responderFromBlockContent(block));
      }
      continue;
    }

    if (block.type === "extract") {
      steps.push(extractBlockToStep(block));
      continue;
    }

    if (block.type === "branch") {
      steps.push(branchBlockToStep(block));
      continue;
    }

    if (block.type === "parallel") {
      steps.push(parallelBlockToStep(block));
      continue;
    }
  }

  return {
    steps,
    unsurfacedBlockTypes: [...unsurfaced],
    hasGraphOnlyConstructs: false,
  };
}

function attachmentToStep(
  block: MessageBlock,
  att: BlockAttachment,
  blockKind: "user" | "assistant"
): StudioStep | null {
  const kindFromAttachment = resolveStepKind(att, blockKind);
  if (!kindFromAttachment) return null;

  const trigger = resolveTrigger(blockKind, att.mode);
  const base: StudioStepBase = {
    id: att.id,
    kind: kindFromAttachment,
    label: att.label || labelForKind(kindFromAttachment),
    instructions: att.inlinePrimitive?.instructions ?? "",
    model: att.inlinePrimitive?.model,
    trigger,
    condition: att.condition,
    memoryReads: att.varsRead ?? [],
    memoryWrites: mapToMemoryWrites(att.varsPatch),
    output: inferOutputShapeFromInstructions(att.inlinePrimitive?.instructions),
    origin: {
      blockId: block.id,
      attachmentId: att.id,
      kind: "attachment",
    },
  };

  return base as StudioStep;
}

function resolveStepKind(
  att: BlockAttachment,
  blockKind: "user" | "assistant"
): StudioStepKind | null {
  const primKind = att.inlinePrimitive?.kind;
  if (primKind === "responder") return "respond";
  if (primKind === "rewriter" || att.mode === "override") return "transform";
  if (primKind === "state_extractor") return "extract";
  if (primKind === "researcher") return "understand";
  if (primKind === "eval") return null; // Plan v1 does not surface eval
  if (primKind === "actor") return null; // actors are graph-only in v1
  return "understand";
}

function resolveTrigger(
  blockKind: "user" | "assistant",
  mode: BlockAttachment["mode"]
): StudioStepTrigger {
  if (blockKind === "user") {
    if (mode === "before") return "before_user";
    if (mode === "override") return "replace_user";
    return "after_user";
  }
  if (mode === "before") return "before_reply";
  if (mode === "after") return "after_reply";
  return "before_reply";
}

function responderFromBlockContent(block: MessageBlock): StudioStep {
  return {
    id: `${block.id}:content`,
    kind: "respond",
    label: block.label || "Reply",
    instructions: block.content ?? "",
    trigger: "before_reply",
    memoryReads: [],
    memoryWrites: [],
    output: inferOutputShapeFromInstructions(block.content),
    origin: { blockId: block.id, kind: "block" },
  };
}

function extractBlockToStep(block: MessageBlock): StudioStep {
  const cfg = block.extractConfig;
  return {
    id: block.id,
    kind: "extract",
    label: block.label || "Extract",
    instructions: cfg?.instructions ?? "",
    model: cfg?.model,
    trigger: "standalone",
    memoryReads: cfg?.varsRead ?? [],
    memoryWrites: mapToMemoryWrites(cfg?.varsPatch),
    output: cfg && cfg.outputSchema.length > 0
      ? { kind: "fields", fields: cfg.outputSchema }
      : { kind: "free_text" },
    origin: { blockId: block.id, kind: "block" },
  };
}

function branchBlockToStep(block: MessageBlock): StudioStep {
  const cfg = block.branchConfig;
  return {
    id: block.id,
    kind: "branch",
    label: block.label || "Branch",
    instructions: "",
    trigger: "standalone",
    condition: cfg?.condition,
    memoryReads: cfg?.condition?.field ? [cfg.condition.field] : [],
    memoryWrites: [],
    output: { kind: "free_text" },
    origin: { blockId: block.id, kind: "block" },
    yesBranchLabels: (cfg?.trueBranch ?? []).map((b) => b.label),
    noBranchLabels: (cfg?.falseBranch ?? []).map((b) => b.label),
  };
}

function parallelBlockToStep(block: MessageBlock): ParallelStep {
  const cfg = block.parallelConfig;
  return {
    id: block.id,
    kind: "parallel",
    label: block.label || "Parallel",
    instructions: "",
    trigger: "standalone",
    memoryReads: [],
    memoryWrites: [],
    output: { kind: "free_text" },
    origin: { blockId: block.id, kind: "block" },
    laneALabels: (cfg?.laneA ?? []).map((b) => b.label),
    laneBLabels: (cfg?.laneB ?? []).map((b) => b.label),
  };
}

function mapToMemoryWrites(
  patch: Record<string, string> | undefined
): StudioMemoryWrite[] {
  if (!patch) return [];
  return Object.entries(patch).map(([from, to]) => ({ from, to }));
}

function memoryWritesToPatch(
  writes: StudioMemoryWrite[]
): Record<string, string> | undefined {
  if (writes.length === 0) return undefined;
  const out: Record<string, string> = {};
  for (const w of writes) {
    if (w.from && w.to) out[w.from] = w.to;
  }
  return Object.keys(out).length > 0 ? out : undefined;
}

/**
 * Best-effort inference of output shape when the author writes a JSON
 * contract inline (e.g. `Respond ONLY with valid JSON: { "x": ... }`).
 * Returns `free_text` when no such hint is present.
 */
function inferOutputShapeFromInstructions(
  instructions: string | undefined
): StudioOutputShape {
  if (!instructions) return { kind: "free_text" };
  const hasJsonContract = /respond\s+only\s+with\s+valid\s+json/i.test(
    instructions
  );
  if (!hasJsonContract) return { kind: "free_text" };
  return { kind: "json", jsonNote: "JSON contract described in instructions." };
}

function labelForKind(kind: StudioStepKind): string {
  switch (kind) {
    case "understand":
      return "Understand";
    case "extract":
      return "Extract";
    case "transform":
      return "Rewrite";
    case "respond":
      return "Reply";
    case "branch":
      return "Branch";
    case "parallel":
      return "Parallel";
  }
}

// ---------------------------------------------------------------------------
// WRITE — applyStudioModel
// ---------------------------------------------------------------------------

/**
 * Apply a Plan-authored patch to the current model and produce the
 * persistence-ready fields. Pure: no Prisma / fetch calls.
 *
 *   - `purpose` → AgentDefinition { name (noop here), description, charter, mode }
 *   - `objectives` → AgentStateConfig.goals (preserving completion rules
 *     by id when possible)
 *   - `memory` → AgentStateConfig.{fields,scope,locks}
 *   - `inputs` → FlowDefinition.envVars
 *   - `outputs.reply` → AgentDefinition.outputSchema
 *   - `steps` → writes back to `chatBuilder` (if SoT), then recompiles
 *
 * Rules:
 *   - When `sourceOfTruth === "graph"`, step edits are ignored (logged in
 *     `flags`). Memory / inputs / objectives still apply.
 *   - `chatBuilder` preserves unsurfaced blocks (system, context, goal)
 *     so Plan v1 edits never silently drop them.
 */
export function applyStudioModel(
  agent: AgentDefinition,
  patch: StudioModelPatch
): StudioApplyResult {
  const current = getStudioModel(agent);
  const flow = agent.flowDefinition ?? null;

  // Purpose — description + instructions + mode flow onto AgentDefinition.
  const nextPurpose = { ...current.purpose, ...(patch.purpose ?? {}) };

  // Memory — merged.
  const nextMemory = { ...current.memory, ...(patch.memory ?? {}) };
  const fields: StateFieldDefinition[] = nextMemory.fields;
  const locks = nextMemory.locks.filter((k) => fields.some((f) => f.key === k));

  // Objectives — preserve rule-driven completion on AgentGoal by id when
  // the user only edited the label/description.
  const existingGoalsById = new Map<string, AgentGoal>(
    (resolveStateConfig(flow ?? undefined).goals ?? []).map((g) => [g.id, g])
  );
  const nextObjectives = patch.objectives ?? current.objectives;
  const nextGoals: AgentGoal[] = nextObjectives.map((o) =>
    objectiveToGoal(o, existingGoalsById.get(o.id))
  );

  const nextStateConfig: AgentStateConfig = {
    fields,
    goals: nextGoals,
    scope: nextMemory.scope,
  };

  const envVars = patch.inputs ?? current.inputs;

  // Steps — write back through chatBuilder when SoT.
  const nextChatBuilder = applyStepsToChatBuilder(
    current.rawChatBuilder,
    patch.steps,
    current.sourceOfTruth
  );

  // Recompile when we own chatBuilder; otherwise preserve existing nodes/edges.
  const compiled = nextChatBuilder
    ? compileToFlowDefinition(nextChatBuilder, nextStateConfig)
    : null;

  const flowVersion: 1 | 2 | undefined = current.flags.isV2 || compiled ? 2 : flow?.version;

  const nextFlow: FlowDefinition = compiled
    ? {
        ...compiled,
        ...(flowVersion ? { version: flowVersion } : {}),
        orchestrator: stateConfigToOrchestrator(nextStateConfig, locks),
        stateConfig: nextStateConfig,
        chatBuilder: nextChatBuilder,
        envVars: envVars.length > 0 ? envVars : undefined,
      }
    : {
        ...(flow ?? { nodes: [], edges: [] }),
        ...(flowVersion ? { version: flowVersion } : {}),
        orchestrator: stateConfigToOrchestrator(nextStateConfig, locks),
        stateConfig: nextStateConfig,
        ...(nextChatBuilder ? { chatBuilder: nextChatBuilder } : {}),
        envVars: envVars.length > 0 ? envVars : undefined,
      };

  const nextOutputs = { ...current.outputs, ...(patch.outputs ?? {}) };

  return {
    instructions: nextPurpose.charter,
    description: nextPurpose.description,
    outputSchema: nextOutputs.reply ?? null,
    flowDefinition: nextFlow,
    mode: nextPurpose.mode,
  };
}

// ---------------------------------------------------------------------------
// Step write-back
// ---------------------------------------------------------------------------

function applyStepsToChatBuilder(
  current: ChatBuilderSpec | undefined,
  steps: StudioStep[] | undefined,
  sot: StudioModel["sourceOfTruth"]
): ChatBuilderSpec | undefined {
  if (!current) return undefined;
  if (sot !== "chatBuilder") return current;
  if (!steps) return current;

  const byOrigin = indexStepsByOrigin(steps);
  const nextBlocks: MessageBlock[] = current.blocks.map((block) => {
    if (block.type === "user" || block.type === "assistant") {
      return applyStepsToMessageBlock(block, byOrigin);
    }
    if (block.type === "extract") {
      return applyStepToExtractBlock(block, byOrigin);
    }
    if (block.type === "branch") {
      return applyStepToBranchBlock(block, byOrigin);
    }
    return block;
  });

  return { blocks: nextBlocks };
}

interface StepIndex {
  byAttachment: Map<string, StudioStep>;
  byBlock: Map<string, StudioStep>;
}

function indexStepsByOrigin(steps: StudioStep[]): StepIndex {
  const byAttachment = new Map<string, StudioStep>();
  const byBlock = new Map<string, StudioStep>();
  for (const s of steps) {
    if (s.origin.kind === "attachment" && s.origin.attachmentId) {
      byAttachment.set(s.origin.attachmentId, s);
    } else if (s.origin.kind === "block") {
      byBlock.set(s.origin.blockId, s);
    }
  }
  return { byAttachment, byBlock };
}

function applyStepsToMessageBlock(
  block: MessageBlock,
  idx: StepIndex
): MessageBlock {
  const nextAttachments = block.attachments.map((att) => {
    const step = idx.byAttachment.get(att.id);
    if (!step) return att;
    return mergeStepIntoAttachment(att, step);
  });

  // `respond` step authored from block.content (origin.kind === "block")
  const blockStep = idx.byBlock.get(block.id);
  if (blockStep && blockStep.kind === "respond" && block.type === "assistant") {
    return { ...block, attachments: nextAttachments, content: blockStep.instructions };
  }

  return { ...block, attachments: nextAttachments };
}

function mergeStepIntoAttachment(
  att: BlockAttachment,
  step: StudioStep
): BlockAttachment {
  const next: BlockAttachment = {
    ...att,
    label: step.label || att.label,
    condition: step.condition ?? att.condition,
    varsRead: step.memoryReads.length > 0 ? step.memoryReads : undefined,
    varsPatch: memoryWritesToPatch(step.memoryWrites),
  };
  if (next.inlinePrimitive) {
    next.inlinePrimitive = {
      ...next.inlinePrimitive,
      instructions: step.instructions,
      ...(step.model ? { model: step.model } : {}),
    };
  }
  return next;
}

function applyStepToExtractBlock(
  block: MessageBlock,
  idx: StepIndex
): MessageBlock {
  const step = idx.byBlock.get(block.id);
  if (!step || step.kind !== "extract") return block;
  const currentCfg = block.extractConfig ?? { instructions: "", outputSchema: [] };
  return {
    ...block,
    label: step.label || block.label,
    extractConfig: {
      ...currentCfg,
      instructions: step.instructions,
      ...(step.model ? { model: step.model } : {}),
      outputSchema:
        step.output.kind === "fields" && step.output.fields
          ? step.output.fields
          : currentCfg.outputSchema,
      varsRead: step.memoryReads.length > 0 ? step.memoryReads : undefined,
      varsPatch: memoryWritesToPatch(step.memoryWrites),
    },
  };
}

function applyStepToBranchBlock(
  block: MessageBlock,
  idx: StepIndex
): MessageBlock {
  const step = idx.byBlock.get(block.id);
  if (!step || step.kind !== "branch") return block;
  if (!block.branchConfig || !step.condition) {
    return { ...block, label: step.label || block.label };
  }
  return {
    ...block,
    label: step.label || block.label,
    branchConfig: { ...block.branchConfig, condition: step.condition },
  };
}

// ---------------------------------------------------------------------------
// Re-exports kept light.
// ---------------------------------------------------------------------------

export type {
  EnvVarDefinition,
  StateFieldDefinition,
};
