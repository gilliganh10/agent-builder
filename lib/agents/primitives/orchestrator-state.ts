import { db } from "@/lib/db";
import type { Prisma } from "@/lib/generated/prisma";
import type {
  OrchestratorConfig,
  OrchestratorState,
  GoalState,
  JSONValue,
  VarDefinition,
  AgentStateConfig,
} from "@/db/agents/schema";

/**
 * Create initial orchestrator state from config, optionally overlaying
 * persisted state for conversation-scoped flows.
 */
export function initializeState(
  config: OrchestratorConfig,
  existingState?: OrchestratorState | null
): OrchestratorState {
  const vars: Record<string, JSONValue> = {};
  for (const v of config.vars) {
    vars[v.key] = v.default ?? null;
  }

  if (existingState?.vars) {
    for (const [key, value] of Object.entries(existingState.vars)) {
      if (key in vars) {
        vars[key] = value;
      }
    }
  }

  const goals: GoalState[] = config.goals.map((g) => {
    const existing = existingState?.goals?.find((eg) => eg.id === g.id);
    return {
      ...g,
      status: existing?.status ?? "active",
    };
  });

  return {
    vars,
    goals,
    locks: config.locks,
  };
}

/**
 * Create initial orchestrator state from the new AgentStateConfig format.
 * Maps fields to vars and creates empty goal states. Overlays persisted
 * state for conversation-scoped flows.
 */
export function initializeStateFromConfig(
  config: AgentStateConfig,
  existingState?: OrchestratorState | null
): OrchestratorState {
  const vars: Record<string, JSONValue> = {};
  for (const f of config.fields) {
    vars[f.key] = f.default ?? null;
  }

  if (existingState?.vars) {
    for (const [key, value] of Object.entries(existingState.vars)) {
      if (key in vars) {
        vars[key] = value;
      }
    }
  }

  const goals: GoalState[] = config.goals.map((g) => {
    const existing = existingState?.goals?.find((eg) => eg.id === g.id);
    return {
      id: g.id,
      description: g.description,
      status: existing?.status ?? "active",
    };
  });

  return {
    vars,
    goals,
    locks: [],
  };
}

/**
 * Apply a vars patch to the orchestrator state, skipping locked keys.
 * Returns a new state object (immutable).
 */
export function mergeVarsPatch(
  state: OrchestratorState,
  patch: Record<string, JSONValue>
): OrchestratorState {
  const lockSet = new Set(state.locks);
  const newVars = { ...state.vars };

  for (const [key, value] of Object.entries(patch)) {
    if (lockSet.has(key)) continue;
    if (key in newVars) {
      newVars[key] = value;
    }
  }

  return { ...state, vars: newVars };
}

/**
 * Reset selected orchestrator vars to schema defaults before each run.
 *
 * For flows using {@link OrchestratorConfig} only — not used for
 * `AgentStateConfig` / `stateConfig`-driven agents (v1).
 *
 * For each key in `keysToReset`, if a matching {@link VarDefinition} exists in
 * `config.vars`, sets `vars[key]` to that definition's `default` when defined,
 * otherwise `null` (never `undefined`). Listed keys without a definition are
 * skipped. Does not mutate `state`.
 */
export function resetOrchestratorVarsAtRunStart(
  state: OrchestratorState,
  config: OrchestratorConfig,
  keysToReset: string[]
): OrchestratorState {
  if (keysToReset.length === 0) {
    return state;
  }

  const defByKey = new Map<string, VarDefinition>();
  for (const v of config.vars) {
    defByKey.set(v.key, v);
  }

  const newVars = { ...state.vars };
  for (const key of keysToReset) {
    const def = defByKey.get(key);
    if (!def) continue;
    newVars[key] = def.default !== undefined ? def.default : null;
  }

  return { ...state, vars: newVars };
}

/**
 * Update a goal's status in the orchestrator state.
 */
export function updateGoalStatus(
  state: OrchestratorState,
  goalId: string,
  status: GoalState["status"]
): OrchestratorState {
  return {
    ...state,
    goals: state.goals.map((g) =>
      g.id === goalId ? { ...g, status } : g
    ),
  };
}

/**
 * Extract a vars patch from a node's output using the varsPatch mapping.
 * The mapping is: { "outputFieldPath": "varKey" }
 */
export function extractVarsPatch(
  output: Record<string, unknown>,
  mapping: Record<string, string>
): Record<string, JSONValue> {
  const patch: Record<string, JSONValue> = {};

  for (const [outputPath, varKey] of Object.entries(mapping)) {
    const value = getNestedValue(output, outputPath);
    if (value !== undefined) {
      patch[varKey] = value as JSONValue;
    }
  }

  return patch;
}

/**
 * Persist orchestrator state to either the run or conversation session.
 */
export async function persistState(
  state: OrchestratorState,
  scope: "run" | "conversation",
  targetId: string
): Promise<void> {
  const stateJson = state as unknown as Prisma.InputJsonValue;

  if (scope === "run") {
    const existing = await db.agentRun.findUnique({
      where: { id: targetId },
      select: { meta: true },
    });
    const meta = (existing?.meta ?? {}) as Record<string, unknown>;
    await db.agentRun.update({
      where: { id: targetId },
      data: {
        meta: { ...meta, orchestratorState: stateJson } as Prisma.InputJsonValue,
      },
    });
  } else {
    const existing = await db.conversationSession.findUnique({
      where: { id: targetId },
      select: { meta: true },
    });
    if (!existing) {
      return;
    }
    const meta = (existing.meta ?? {}) as Record<string, unknown>;
    await db.conversationSession.update({
      where: { id: targetId },
      data: {
        meta: { ...meta, orchestratorState: stateJson } as Prisma.InputJsonValue,
      },
    });
  }
}

/**
 * Load orchestrator state from a run or conversation session.
 */
export async function loadState(
  scope: "run" | "conversation",
  targetId: string
): Promise<OrchestratorState | null> {
  if (scope === "run") {
    const row = await db.agentRun.findUnique({
      where: { id: targetId },
      select: { meta: true },
    });
    const meta = (row?.meta ?? {}) as Record<string, unknown>;
    return (meta.orchestratorState as OrchestratorState) ?? null;
  }

  const row = await db.conversationSession.findUnique({
    where: { id: targetId },
    select: { meta: true },
  });
  const meta = (row?.meta ?? {}) as Record<string, unknown>;
  return (meta.orchestratorState as OrchestratorState) ?? null;
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
