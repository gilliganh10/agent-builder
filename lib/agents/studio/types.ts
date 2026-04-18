import type {
  AgentMode,
  AgentStateConfig,
  ConditionConfig,
  EnvVarDefinition,
  ExtractFieldSchema,
  JSONValue,
  StateFieldDefinition,
} from "@/db/agents/schema";

/**
 * Studio model — the canonical view-model the authoring UI talks to.
 *
 * This is *not* persisted. It is derived from `AgentDefinition` +
 * `FlowDefinition` and mapped back on save. Persistence stays on existing
 * fields (`flowDefinition.chatBuilder`, `flowDefinition.nodes/edges`,
 * `envVars`, orchestrator/stateConfig, `meta`, `outputSchema`,
 * `instructions`).
 *
 * Strict separation (matches the UX plan):
 *   - `purpose`          → why the agent exists
 *   - `objectives`       → what we are trying to achieve
 *   - `memory`           → named data we store + update
 *   - `inputs`           → settings operators / public visitors can change
 *   - `steps`            → ordered Plan v1 steps
 *   - `outputs.reply`    → final reply shape
 *
 * When `sourceOfTruth === "chatBuilder"` the Plan tab may author `steps`.
 * When it is `"graph"` (no chatBuilder present) Plan is read-only.
 */
export interface StudioModel {
  /** Plan v1 source-of-truth decision for this agent. */
  sourceOfTruth: StudioSourceOfTruth;
  /** Meta flags (compile/round-trip warnings, graph-only constructs, ...). */
  flags: StudioFlags;

  purpose: StudioPurpose;
  objectives: StudioObjective[];
  memory: StudioMemory;
  inputs: EnvVarDefinition[];
  outputs: StudioOutputs;

  /** Plan v1 steps. Empty when sourceOfTruth is "graph". */
  steps: StudioStep[];

  /**
   * Copy of the source chatBuilder blocks (if any) so `applyStudioModel`
   * can write back without the UI having to keep its own copy. The UI
   * SHOULD NOT mutate this directly — use the adapter helpers.
   */
  rawChatBuilder?: import("@/db/agents/schema").ChatBuilderSpec;
}

export type StudioSourceOfTruth = "chatBuilder" | "graph";

export interface StudioFlags {
  /** Agent has a `chatBuilder` in `flowDefinition`. */
  hasChatBuilder: boolean;
  /** Agent has compiled graph nodes that Plan v1 cannot author. */
  hasGraphOnlyConstructs: boolean;
  /** FlowDefinition.version === 2 or primitive nodes present. */
  isV2: boolean;
  /** Names of block types Plan v1 does not surface (system, goal, …). */
  unsurfacedBlockTypes: string[];
}

export interface StudioPurpose {
  /** User-visible name. Maps to `AgentDefinition.name`. */
  name: string;
  /** One-line description. Maps to `AgentDefinition.description`. */
  description: string;
  /** Long-form charter/instructions. Maps to `AgentDefinition.instructions`. */
  charter: string;
  /** Conversation vs. one-shot. Maps to `AgentDefinition.mode`. */
  mode: AgentMode;
}

/**
 * Objective = outcome the agent tries to achieve. Deliberately separate from
 * memory: no variable keys, no storage. Maps to `AgentStateConfig.goals` /
 * `OrchestratorConfig.goals`. Rule-driven completion (AgentGoal.conditions)
 * stays on `AgentStateConfig`; Plan v1 shows it as "Completion rules"
 * but does not expand it as first-class objective data.
 */
export interface StudioObjective {
  id: string;
  name: string;
  description: string;
  hasCompletionRules: boolean;
}

/**
 * Memory = data the agent stores/updates while pursuing objectives.
 * Strictly variables. Goals live on `objectives` only.
 */
export interface StudioMemory {
  scope: "run" | "conversation";
  fields: StateFieldDefinition[];
  /** Keys locked after first write. */
  locks: string[];
}

export interface StudioOutputs {
  /** Final reply shape. Maps to `AgentDefinition.outputSchema`. */
  reply: Record<string, unknown> | null;
}

// ---------------------------------------------------------------------------
// Plan v1 steps — opinionated, exactly five kinds.
// ---------------------------------------------------------------------------

export type StudioStepKind =
  | "understand"
  | "extract"
  | "transform"
  | "respond"
  | "branch"
  | "parallel";

/** When a step runs, in Plan-native language. */
export type StudioStepTrigger =
  | "before_user"    // before the user message is processed (context)
  | "after_user"     // after user message arrives (researcher/understand)
  | "replace_user"   // override the user message (rewriter/transform)
  | "before_reply"   // immediately before the assistant reply
  | "after_reply"    // after the assistant reply (state_extractor, eval)
  | "standalone";    // extract / branch — not tied to user/assistant

export interface StudioOutputShape {
  kind: "free_text" | "fields" | "json";
  fields?: ExtractFieldSchema[];
  jsonNote?: string;
}

export interface StudioMemoryWrite {
  /** JSON-path into the step output (e.g. "needs_correction"). */
  from: string;
  /** Memory field key to write to. */
  to: string;
}

export interface StudioStepBase {
  id: string;
  kind: StudioStepKind;
  label: string;
  instructions: string;
  model?: string;
  trigger: StudioStepTrigger;
  condition?: ConditionConfig;
  memoryReads: string[];
  memoryWrites: StudioMemoryWrite[];
  output: StudioOutputShape;
  /** Which chatBuilder artefact this step was derived from. */
  origin: StudioStepOrigin;
}

export interface StudioStepOrigin {
  blockId: string;
  /** When the step is an attachment on a user/assistant block. */
  attachmentId?: string;
  /** When the step IS the block itself (extract, branch). */
  kind: "attachment" | "block";
}

export interface UnderstandStep extends StudioStepBase {
  kind: "understand";
}

export interface ExtractStep extends StudioStepBase {
  kind: "extract";
}

export interface TransformStep extends StudioStepBase {
  kind: "transform";
}

export interface RespondStep extends StudioStepBase {
  kind: "respond";
}

export interface BranchStep extends StudioStepBase {
  kind: "branch";
  /** Nested step labels (read-only hint for Plan v1). */
  yesBranchLabels: string[];
  noBranchLabels: string[];
}

export interface ParallelStep extends StudioStepBase {
  kind: "parallel";
  laneALabels: string[];
  laneBLabels: string[];
}

export type StudioStep =
  | UnderstandStep
  | ExtractStep
  | TransformStep
  | RespondStep
  | BranchStep
  | ParallelStep;

// ---------------------------------------------------------------------------
// Apply — partial patches the UI hands back to the adapter.
// ---------------------------------------------------------------------------

/**
 * Partial patch emitted by the Plan UI. Only fields the user actually
 * edited need to be present. `steps` is a full replacement when provided.
 */
export interface StudioModelPatch {
  purpose?: Partial<StudioPurpose>;
  objectives?: StudioObjective[];
  memory?: Partial<StudioMemory>;
  inputs?: EnvVarDefinition[];
  outputs?: Partial<StudioOutputs>;
  /** Full replacement of the step list (authoring in Plan v1). */
  steps?: StudioStep[];
}

/**
 * Shape returned from `applyStudioModel`. Callers persist these fields on
 * the `AgentDefinition` (`PUT /api/agents/[slug]`).
 */
export interface StudioApplyResult {
  /** New `AgentDefinition.instructions` (charter). */
  instructions: string;
  /** New `AgentDefinition.description`. */
  description: string;
  /** New `AgentDefinition.outputSchema`. */
  outputSchema: Record<string, unknown> | null;
  /** New `flowDefinition` (chatBuilder recompiled, memory/inputs merged). */
  flowDefinition: import("@/db/agents/schema").FlowDefinition;
  /** Mode — not changed by Plan v1, passed through. */
  mode: AgentMode;
}

// ---------------------------------------------------------------------------
// Internal helper types — exported for unit tests only.
// ---------------------------------------------------------------------------

/** @internal */
export type StateConfigForStudio = AgentStateConfig;

/** @internal — default memory field value helper. */
export function defaultJsonValue(type: StateFieldDefinition["type"]): JSONValue {
  switch (type) {
    case "string":
      return "";
    case "number":
      return 0;
    case "boolean":
      return false;
    case "json":
      return null;
  }
}
