import { describe, expect, it } from "vitest";
import type { ChatBuilderSpec, MessageBlock } from "@/db/agents/schema";
import {
  importSimplifiedFromChatBuilder,
  validateSimplifiedBuilder,
} from "@/lib/agents/studio";

function block(partial: Partial<MessageBlock> & Pick<MessageBlock, "type">): MessageBlock {
  return {
    id: partial.id ?? `b-${Math.random().toString(36).slice(2, 8)}`,
    type: partial.type,
    label: partial.label ?? partial.type,
    position: partial.position ?? 1,
    settings: partial.settings ?? {},
    attachments: partial.attachments ?? [],
    content: partial.content,
    extractConfig: partial.extractConfig,
    branchConfig: partial.branchConfig,
    parallelConfig: partial.parallelConfig,
    goalConfig: partial.goalConfig,
  };
}

describe("importSimplifiedFromChatBuilder", () => {
  it("converts assistant blocks into Message steps and preserves order", () => {
    const chat: ChatBuilderSpec = {
      blocks: [
        block({ type: "assistant", label: "First", content: "Hello", position: 1 }),
        block({ type: "assistant", label: "Second", content: "Again", position: 2 }),
      ],
    };

    const { spec, warnings } = importSimplifiedFromChatBuilder(chat);
    expect(warnings).toHaveLength(0);

    expect(spec.rootOrder).toHaveLength(4); // input + 2 messages + end
    const body = spec.rootOrder.slice(1, -1);
    const bodySteps = body.map((id) => spec.steps.find((s) => s.id === id)!);
    expect(bodySteps.map((s) => s.kind)).toEqual(["message", "message"]);
    expect(bodySteps.map((s) => s.label)).toEqual(["First", "Second"]);
    expect(() => validateSimplifiedBuilder(spec)).not.toThrow();
  });

  it("maps extract blocks to Update State steps and flips varsPatch", () => {
    const chat: ChatBuilderSpec = {
      blocks: [
        block({
          type: "extract",
          label: "Pull intent",
          position: 1,
          extractConfig: {
            instructions: "Classify the intent.",
            outputSchema: [
              { key: "intent", type: "string", description: "" },
            ],
            varsPatch: { intent: "intent" },
          },
        }),
      ],
    };

    const { spec } = importSimplifiedFromChatBuilder(chat);
    const bodyId = spec.rootOrder[1];
    const step = spec.steps.find((s) => s.id === bodyId)!;
    if (step.kind !== "update_state") throw new Error("expected update_state");
    expect(step.varsFromOutput).toEqual([{ from: "intent", to: "intent" }]);
    expect(step.jsonSchema).toHaveLength(1);
  });

  it("maps branch blocks with nested children into Condition steps", () => {
    const chat: ChatBuilderSpec = {
      blocks: [
        block({
          type: "branch",
          label: "Needs greeting?",
          position: 1,
          branchConfig: {
            condition: { field: "greeted", operator: "not_exists" },
            trueBranch: [
              block({ type: "assistant", label: "Greet", content: "Hi!", position: 1 }),
            ],
            falseBranch: [],
          },
        }),
      ],
    };

    const { spec } = importSimplifiedFromChatBuilder(chat);
    const condId = spec.rootOrder[1];
    const cond = spec.steps.find((s) => s.id === condId)!;
    if (cond.kind !== "condition") throw new Error("expected condition");
    expect(cond.yesSteps).toHaveLength(1);
    expect(cond.noSteps).toHaveLength(0);
    expect(cond.condition.operator).toBe("not_exists");
    expect(() => validateSimplifiedBuilder(spec)).not.toThrow();
  });

  it("maps parallel blocks with lanes into Parallel steps", () => {
    const chat: ChatBuilderSpec = {
      blocks: [
        block({
          type: "parallel",
          label: "Fan out",
          position: 1,
          parallelConfig: {
            laneA: [
              block({ type: "assistant", label: "A", content: "a", position: 1 }),
            ],
            laneB: [
              block({ type: "assistant", label: "B", content: "b", position: 1 }),
            ],
          },
        }),
      ],
    };

    const { spec } = importSimplifiedFromChatBuilder(chat);
    const par = spec.steps.find((s) => s.kind === "parallel")!;
    if (par.kind !== "parallel") throw new Error("expected parallel");
    expect(par.laneA).toHaveLength(1);
    expect(par.laneB).toHaveLength(1);
    expect(() => validateSimplifiedBuilder(spec)).not.toThrow();
  });

  it("warns and drops unsupported blocks", () => {
    const chat: ChatBuilderSpec = {
      blocks: [
        block({ type: "system", label: "Preamble", position: 1, content: "hidden" }),
        block({ type: "context", label: "Retrieve docs", position: 2 }),
        block({ type: "assistant", label: "Reply", content: "ok", position: 3 }),
      ],
    };

    const { spec, warnings } = importSimplifiedFromChatBuilder(chat);
    expect(warnings.length).toBeGreaterThanOrEqual(2);
    const kinds = spec.rootOrder
      .slice(1, -1)
      .map((id) => spec.steps.find((s) => s.id === id)!.kind);
    expect(kinds).toEqual(["message"]);
  });

  it("converts inline rewriter/state_extractor attachments into preceding steps", () => {
    const chat: ChatBuilderSpec = {
      blocks: [
        block({
          type: "assistant",
          label: "Reply",
          content: "ok",
          position: 1,
          attachments: [
            {
              id: "a-pre",
              mode: "before",
              label: "Clean input",
              inlinePrimitive: { kind: "rewriter", instructions: "Tidy up." },
            },
            {
              id: "a-post",
              mode: "after",
              label: "Track intent",
              inlinePrimitive: {
                kind: "state_extractor",
                instructions: "Grab the intent.",
              },
              outputSchema: [
                { key: "intent", type: "string", description: "" },
              ],
              varsPatch: { intent: "intent" },
            },
          ],
        }),
      ],
    };

    const { spec } = importSimplifiedFromChatBuilder(chat);
    const bodyKinds = spec.rootOrder
      .slice(1, -1)
      .map((id) => spec.steps.find((s) => s.id === id)!.kind);
    expect(bodyKinds).toEqual(["transform", "message", "update_state"]);
    expect(() => validateSimplifiedBuilder(spec)).not.toThrow();
  });
});
