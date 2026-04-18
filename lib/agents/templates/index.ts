import { GLOTTR_V3_TEMPLATE } from "./glottr-v3";
import type { AgentTemplate } from "./types";

/**
 * Registry of agent templates available via "New from template" in Agents and
 * Plan. Keep this list short — templates should be canonical, well-known
 * agents worth being the first example a new user sees.
 */
export const AGENT_TEMPLATES: AgentTemplate[] = [GLOTTR_V3_TEMPLATE];

export function findAgentTemplate(id: string): AgentTemplate | undefined {
  return AGENT_TEMPLATES.find((t) => t.id === id);
}

export type { AgentTemplate } from "./types";
export { GLOTTR_V3_TEMPLATE } from "./glottr-v3";
