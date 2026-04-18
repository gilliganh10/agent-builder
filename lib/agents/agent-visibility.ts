import type { AgentDefinition } from "@/db/agents/schema";

export function isInternalAgent(agent: AgentDefinition): boolean {
  return agent.meta?.internal === true;
}

export function isEditableBuiltInAgent(agent: AgentDefinition): boolean {
  return agent.kind === "built_in" && agent.meta?.editableBuiltIn === true;
}

export function canEditAgentDefinition(agent: AgentDefinition): boolean {
  return agent.kind === "user_created" || isEditableBuiltInAgent(agent);
}
