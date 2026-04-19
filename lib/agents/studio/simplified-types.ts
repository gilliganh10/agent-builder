import type {
  ConditionConfig,
  ExtractFieldSchema,
} from "@/db/agents/schema";

/**
 * Canonical, persisted, user-facing builder spec for the AI Agent Studio.
 *
 * This is the single source of truth authored by Plan / Graph in the
 * simplified studio. On save it is stored under
 * `flowDefinition.simplifiedBuilder` and compiled into the existing
 * `FlowDefinition` `nodes`/`edges` DAG for the runtime.
 *
 * Seven user-facing step kinds only:
 *   Input · Message · Transform · Update State · Condition · Parallel · End
 *
 * Shape notes:
 *   - `steps` is a flat list keyed by id. Branch/parallel children are
 *     referenced by id from within their owning step, never inlined.
 *   - `rootOrder` is the main-line sequence, beginning with an `input`
 *     step and ending with an `end` step.
 *   - Every step id must be reachable exactly once: either it appears in
 *     `rootOrder` or it is referenced from one (and only one) branch or
 *     parallel lane.
 */
export interface SimplifiedBuilderSpec {
  version: 1;
  steps: SimplifiedStep[];
  rootOrder: string[];
  layoutHints?: Record<string, { x: number; y: number }>;
}

export type SimplifiedStepKind =
  | "input"
  | "message"
  | "transform"
  | "update_state"
  | "condition"
  | "parallel"
  | "end";

export type SimplifiedOutputMode = "text" | "json_schema";

/** Field mapping from a structured output key to an orchestrator variable. */
export interface SimplifiedVarMapping {
  /** JSON key from the step's structured output. */
  from: string;
  /** Orchestrator variable key to write. */
  to: string;
}

export interface SimplifiedStepBase {
  id: string;
  kind: SimplifiedStepKind;
  label: string;
}

export interface SimplifiedInputStep extends SimplifiedStepBase {
  kind: "input";
}

export interface SimplifiedMessageStep extends SimplifiedStepBase {
  kind: "message";
  instructions: string;
  model?: string;
  outputMode: SimplifiedOutputMode;
  jsonSchema?: ExtractFieldSchema[];
  varsRead?: string[];
  varsFromOutput?: SimplifiedVarMapping[];
}

export interface SimplifiedTransformStep extends SimplifiedStepBase {
  kind: "transform";
  instructions: string;
  model?: string;
  outputMode: SimplifiedOutputMode;
  jsonSchema?: ExtractFieldSchema[];
  varsRead?: string[];
  varsFromOutput?: SimplifiedVarMapping[];
}

/**
 * Updates orchestrator variables from the conversation + latest message.
 * v1 = LLM extraction only (matches `state_extractor` runtime semantics).
 */
export interface SimplifiedUpdateStateStep extends SimplifiedStepBase {
  kind: "update_state";
  instructions?: string;
  model?: string;
  jsonSchema: ExtractFieldSchema[];
  varsRead?: string[];
  varsFromOutput?: SimplifiedVarMapping[];
}

export interface SimplifiedConditionStep extends SimplifiedStepBase {
  kind: "condition";
  condition: ConditionConfig;
  yesSteps: string[];
  noSteps: string[];
}

export interface SimplifiedParallelStep extends SimplifiedStepBase {
  kind: "parallel";
  laneALabel?: string;
  laneBLabel?: string;
  laneA: string[];
  laneB: string[];
}

export interface SimplifiedEndStep extends SimplifiedStepBase {
  kind: "end";
  closeConversation?: boolean;
  closingMessage?: string;
  goalId?: string;
}

export type SimplifiedStep =
  | SimplifiedInputStep
  | SimplifiedMessageStep
  | SimplifiedTransformStep
  | SimplifiedUpdateStateStep
  | SimplifiedConditionStep
  | SimplifiedParallelStep
  | SimplifiedEndStep;

// ---------------------------------------------------------------------------
// Construction helpers
// ---------------------------------------------------------------------------

/**
 * Build an empty simplified spec with just Input → End. Callers can
 * populate `steps` and `rootOrder` after construction.
 */
export function createEmptySimplifiedBuilder(): SimplifiedBuilderSpec {
  const inputId = "step-input";
  const endId = "step-end";
  return {
    version: 1,
    steps: [
      { id: inputId, kind: "input", label: "User Message" },
      { id: endId, kind: "end", label: "End" },
    ],
    rootOrder: [inputId, endId],
  };
}
