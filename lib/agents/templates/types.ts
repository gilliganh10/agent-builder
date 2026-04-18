import type { AgentMode, FlowDefinition } from "@/db/agents/schema";
import type { ModelPolicy } from "@/lib/agents/model-policy";

/**
 * Author-time template for creating a fully-wired agent from a single click.
 * Kept pure (no Prisma / fetch calls) so it can be imported from both client
 * components (for previews) and server actions (for provisioning).
 */
export interface AgentTemplate {
  id: string;
  name: string;
  description: string;
  tagline: string;
  slugSuggestion: string;
  mode: AgentMode;
  modelPolicy: ModelPolicy;
  instructions: string;
  /**
   * Called lazily so callers pay the compile cost only when instantiating.
   * Returns a fresh `FlowDefinition` each call.
   */
  buildFlowDefinition: () => FlowDefinition;
}
