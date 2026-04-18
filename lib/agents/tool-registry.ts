import type { Tool } from "@openai/agents";
import type { AgentRunContext } from "@/db/agents/schema";

// ---------------------------------------------------------------------------
// Tool registry — empty by default in the OSS build.
//
// The monolith wires a broad toolpack here (project-copilot, report-builder,
// DJ Percy, etc.). None of those are portable. Add your own tools by
// implementing `Tool<AgentRunContext>` and inserting them into TOOL_MAP.
// ---------------------------------------------------------------------------

const TOOL_MAP: Record<string, Tool<AgentRunContext>> = {};

/**
 * Resolve an array of tool names into their Tool instances.
 * Throws if any name is unrecognised.
 */
export function resolveTools(
  names: string[]
): Tool<AgentRunContext>[] {
  return names.map((name) => {
    const t = TOOL_MAP[name];
    if (!t) {
      throw new Error(`Unknown tool: ${name}`);
    }
    return t;
  });
}

/**
 * Get a single tool by name. Returns undefined if not found.
 * Used by flow tool nodes that run one tool without an LLM.
 */
export function getTool(name: string): Tool<AgentRunContext> | undefined {
  return TOOL_MAP[name];
}

/**
 * Get all registered tool names.
 */
export function allToolNames(): string[] {
  return Object.keys(TOOL_MAP);
}
