import type {
  AgentConversationGoalState,
  AgentConversationStatePayload,
  AgentPublicChatSettings,
  OrchestratorState,
} from "@/db/agents/schema";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

export function getPublicChatSettings(
  meta: Record<string, unknown> | null | undefined
): Required<AgentPublicChatSettings> {
  const publicChat = isRecord(meta?.publicChat) ? meta.publicChat : undefined;

  return {
    showStateSidebar: publicChat?.showStateSidebar === true,
  };
}

export function mergePublicChatSettings(
  meta: Record<string, unknown> | null | undefined,
  patch: AgentPublicChatSettings
): Record<string, unknown> {
  const currentMeta = meta ?? {};
  const currentPublicChat = isRecord(currentMeta.publicChat) ? currentMeta.publicChat : {};

  return {
    ...currentMeta,
    publicChat: {
      ...currentPublicChat,
      ...patch,
    },
  };
}

export function buildConversationStatePayload(
  orchestratorState: OrchestratorState | null | undefined
): AgentConversationStatePayload {
  const goals: AgentConversationGoalState[] = (orchestratorState?.goals ?? []).map((goal) => ({
    id: goal.id,
    description: goal.description,
    status: goal.status,
  }));

  return {
    state: orchestratorState?.vars ?? {},
    goals,
    locks: orchestratorState?.locks ?? [],
  };
}
