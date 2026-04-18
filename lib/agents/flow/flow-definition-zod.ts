import { z } from "zod";

/** Matches `FlowNodeType` in `@/db/agents/schema` — keep in sync when adding node kinds. */
export const FlowNodeTypeSchema = z.enum([
  "input",
  "agent",
  "condition",
  "fork",
  "join",
  "output",
  "terminus",
  "researcher",
  "actor",
  "rewriter",
  "responder",
  "eval",
  "state_extractor",
  "tool",
]);

export const FlowNodeSchema = z.object({
  id: z.string(),
  type: FlowNodeTypeSchema,
  position: z.object({ x: z.number(), y: z.number() }),
  data: z.record(z.string(), z.unknown()).default({}),
});
