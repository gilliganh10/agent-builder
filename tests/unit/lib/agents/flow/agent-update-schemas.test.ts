import { describe, it, expect } from "vitest";
import {
  ChatBuilderSpecSchema,
  FlowDefinitionSchema,
  UpdateAgentSchema,
} from "@/lib/agents/flow/agent-update-schemas";

describe("ChatBuilderSpecSchema", () => {
  it("accepts a spec with a parallel block and nested lanes", () => {
    const spec = {
      blocks: [
        {
          id: "user-1",
          type: "user",
          label: "User",
          position: 0,
          settings: {},
          attachments: [],
        },
        {
          id: "par-1",
          type: "parallel",
          label: "Parallel",
          position: 1,
          settings: {},
          attachments: [],
          parallelConfig: {
            laneA: [
              {
                id: "asst-a",
                type: "assistant",
                label: "Lane A",
                position: 0,
                settings: {},
                attachments: [],
              },
            ],
            laneB: [
              {
                id: "asst-b",
                type: "assistant",
                label: "Lane B",
                position: 0,
                settings: {},
                attachments: [],
              },
            ],
          },
        },
      ],
    };

    const parsed = ChatBuilderSpecSchema.safeParse(spec);
    expect(parsed.success).toBe(true);
    if (parsed.success) {
      const b1 = parsed.data.blocks[1] as {
        type: string;
        parallelConfig?: { laneA: unknown[]; laneB: unknown[] };
      };
      expect(b1.type).toBe("parallel");
      const pc = b1.parallelConfig;
      expect(pc?.laneA).toHaveLength(1);
      expect(pc?.laneB).toHaveLength(1);
    }
  });

  it("round-trips parallel spec through FlowDefinitionSchema", () => {
    const flow = {
      version: 2 as const,
      nodes: [
        {
          id: "input-1",
          type: "input",
          position: { x: 0, y: 0 },
          data: { label: "Input" },
        },
        {
          id: "output-1",
          type: "output",
          position: { x: 100, y: 0 },
          data: { label: "Output" },
        },
      ],
      edges: [
        { id: "e1", source: "input-1", target: "output-1" },
      ],
      chatBuilder: {
        blocks: [
          {
            id: "u1",
            type: "user",
            label: "User",
            position: 0,
            settings: {},
            attachments: [],
          },
          {
            id: "p1",
            type: "parallel",
            label: "P",
            position: 1,
            settings: {},
            attachments: [],
            parallelConfig: { laneA: [], laneB: [] },
          },
        ],
      },
    };

    const parsed = FlowDefinitionSchema.safeParse(flow);
    expect(parsed.success).toBe(true);
  });
});

describe("UpdateAgentSchema", () => {
  it("parses minimal PUT body", () => {
    const parsed = UpdateAgentSchema.safeParse({
      changelog: "test",
      flowDefinition: null,
    });
    expect(parsed.success).toBe(true);
  });
});
