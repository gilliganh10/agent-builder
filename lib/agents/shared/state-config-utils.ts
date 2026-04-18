import type {
  AgentStateConfig,
  OrchestratorConfig,
} from "@/db/agents/schema";

/**
 * Convert an OrchestratorConfig (runtime format) into the richer
 * AgentStateConfig used by the shared state/goal editors.
 */
export function orchestratorToStateConfig(
  orch: OrchestratorConfig
): AgentStateConfig {
  return {
    fields: orch.vars.map((v) => ({
      key: v.key,
      type: v.type,
      default: v.default,
      description: v.description ?? "",
    })),
    goals: orch.goals.map((g) => ({
      id: g.id,
      name: g.description,
      description: g.successCriteria ?? "",
      conditions: [],
      conditionLogic: "all" as const,
      onComplete: { type: "close" as const },
    })),
    scope: orch.scope,
  };
}

/**
 * Convert an AgentStateConfig back into the leaner OrchestratorConfig
 * used by the flow runtime. Locks are preserved via an optional param.
 */
export function stateConfigToOrchestrator(
  sc: AgentStateConfig,
  existingLocks: string[] = []
): OrchestratorConfig {
  return {
    vars: sc.fields.map((f) => ({
      key: f.key,
      type: f.type,
      default: f.default,
      description: f.description,
    })),
    goals: sc.goals.map((g) => ({
      id: g.id,
      description: g.name || g.description,
    })),
    locks: existingLocks.filter((l) =>
      sc.fields.some((f) => f.key === l)
    ),
    scope: sc.scope,
  };
}

const EMPTY_STATE_CONFIG: AgentStateConfig = {
  fields: [],
  goals: [],
  scope: "conversation",
};

/**
 * Resolve the AgentStateConfig from a flow definition, preferring
 * the rich stateConfig if present, falling back to orchestrator conversion.
 */
export function resolveStateConfig(flow?: {
  stateConfig?: AgentStateConfig;
  orchestrator?: OrchestratorConfig;
}): AgentStateConfig {
  if (flow?.stateConfig) return flow.stateConfig;
  if (flow?.orchestrator) return orchestratorToStateConfig(flow.orchestrator);
  return { ...EMPTY_STATE_CONFIG };
}
