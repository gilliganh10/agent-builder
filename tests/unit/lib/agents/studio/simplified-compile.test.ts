import { describe, expect, it } from "vitest";
import type { FlowEdge, FlowNode } from "@/db/agents/schema";
import {
  compileSimplifiedGraph,
  compileSimplifiedToFlowDefinition,
  validateSimplifiedBuilder,
  createEmptySimplifiedBuilder,
} from "@/lib/agents/studio";
import type {
  SimplifiedBuilderSpec,
  SimplifiedStep,
} from "@/lib/agents/studio";

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function makeSpec(steps: SimplifiedStep[], rootOrder: string[]): SimplifiedBuilderSpec {
  return { version: 1, steps, rootOrder };
}

function findType(nodes: FlowNode[], type: string): FlowNode[] {
  return nodes.filter((n) => n.type === type);
}

function edgesFrom(edges: FlowEdge[], source: string): FlowEdge[] {
  return edges.filter((e) => e.source === source);
}

function edgesTo(edges: FlowEdge[], target: string): FlowEdge[] {
  return edges.filter((e) => e.target === target);
}

// ---------------------------------------------------------------------------
// Base cases
// ---------------------------------------------------------------------------

describe("createEmptySimplifiedBuilder", () => {
  it("creates a valid input → end spec", () => {
    const spec = createEmptySimplifiedBuilder();
    expect(() => validateSimplifiedBuilder(spec)).not.toThrow();
    expect(spec.rootOrder).toHaveLength(2);
    expect(spec.steps).toHaveLength(2);
  });

  it("compiles to an input node wired to an output node", () => {
    const spec = createEmptySimplifiedBuilder();
    const { nodes, edges } = compileSimplifiedGraph(spec);

    expect(findType(nodes, "input")).toHaveLength(1);
    expect(findType(nodes, "output")).toHaveLength(1);
    expect(edges).toHaveLength(1);
    expect(edges[0].source).toMatch(/^input-/);
    expect(edges[0].target).toMatch(/^output-/);
  });
});

// ---------------------------------------------------------------------------
// Linear flows
// ---------------------------------------------------------------------------

describe("linear Message / Transform / Update State flow", () => {
  it("compiles to the runtime primitives in order", () => {
    const spec = makeSpec(
      [
        { id: "in", kind: "input", label: "In" },
        {
          id: "tx",
          kind: "transform",
          label: "Correct language",
          instructions: "Rewrite the message in {{env.targetLanguage}}.",
          outputMode: "text",
        },
        {
          id: "us",
          kind: "update_state",
          label: "Track intent",
          instructions: "Infer the user's current intent.",
          jsonSchema: [
            { key: "intent", type: "string", description: "User intent" },
          ],
          varsFromOutput: [{ from: "intent", to: "intent" }],
        },
        {
          id: "msg",
          kind: "message",
          label: "Reply",
          instructions: "Respond naturally.",
          outputMode: "text",
        },
        { id: "end", kind: "end", label: "End" },
      ],
      ["in", "tx", "us", "msg", "end"]
    );

    const { nodes, edges } = compileSimplifiedGraph(spec);

    const types = nodes.map((n) => n.type);
    expect(types).toEqual([
      "input",
      "rewriter",
      "state_extractor",
      "responder",
      "output",
    ]);

    for (let i = 0; i < nodes.length - 1; i++) {
      const next = edgesFrom(edges, nodes[i].id);
      expect(next).toHaveLength(1);
      expect(next[0].target).toBe(nodes[i + 1].id);
    }
  });

  it("Message with json_schema sets responderOutputSchema and embeds JSON contract", () => {
    const spec = makeSpec(
      [
        { id: "in", kind: "input", label: "In" },
        {
          id: "msg",
          kind: "message",
          label: "Reply",
          instructions: "Respond.",
          outputMode: "json_schema",
          jsonSchema: [
            { key: "reply", type: "string", description: "Visible reply", messageRole: "primary" },
            { key: "translation", type: "string", description: "Secondary", messageRole: "secondary" },
          ],
        },
        { id: "end", kind: "end", label: "End" },
      ],
      ["in", "msg", "end"]
    );

    const { nodes } = compileSimplifiedGraph(spec);
    const responder = nodes.find((n) => n.type === "responder")!;
    expect(responder.data.responderOutputSchema).toBeDefined();
    expect(String(responder.data.inlineInstructions)).toContain("Respond ONLY with valid JSON");
    expect(String(responder.data.inlineInstructions)).toContain("reply");
  });

  it("Transform defaults to a rewrittenMessage contract when no schema is authored", () => {
    const spec = makeSpec(
      [
        { id: "in", kind: "input", label: "In" },
        {
          id: "tx",
          kind: "transform",
          label: "Rewrite",
          instructions: "Polish the user's phrasing.",
          outputMode: "text",
        },
        { id: "end", kind: "end", label: "End" },
      ],
      ["in", "tx", "end"]
    );

    const { nodes } = compileSimplifiedGraph(spec);
    const rewriter = nodes.find((n) => n.type === "rewriter")!;
    expect(rewriter.data.canRewrite).toBe(true);
    expect(String(rewriter.data.inlineInstructions)).toContain("rewrittenMessage");
  });

  it("maps varsFromOutput into FlowNodeData.varsPatch", () => {
    const spec = makeSpec(
      [
        { id: "in", kind: "input", label: "In" },
        {
          id: "us",
          kind: "update_state",
          label: "Extract",
          jsonSchema: [{ key: "needs_correction", type: "boolean", description: "" }],
          varsFromOutput: [{ from: "needs_correction", to: "needs_correction" }],
        },
        { id: "end", kind: "end", label: "End" },
      ],
      ["in", "us", "end"]
    );
    const { nodes } = compileSimplifiedGraph(spec);
    const ext = nodes.find((n) => n.type === "state_extractor")!;
    expect(ext.data.varsPatch).toEqual({ needs_correction: "needs_correction" });
    expect(ext.data.extractOutputSchema).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Condition and Parallel
// ---------------------------------------------------------------------------

describe("Condition compilation", () => {
  it("emits condition + yes/no branches + join", () => {
    const spec = makeSpec(
      [
        { id: "in", kind: "input", label: "In" },
        {
          id: "c1",
          kind: "condition",
          label: "Needs help?",
          condition: { field: "needs_help", operator: "eq", value: true },
          yesSteps: ["yes1"],
          noSteps: [],
        },
        {
          id: "yes1",
          kind: "message",
          label: "Offer help",
          instructions: "Offer help.",
          outputMode: "text",
        },
        { id: "end", kind: "end", label: "End" },
      ],
      ["in", "c1", "end"]
    );

    const { nodes, edges } = compileSimplifiedGraph(spec);

    const condition = findType(nodes, "condition");
    const join = findType(nodes, "join");
    const responder = findType(nodes, "responder");

    expect(condition).toHaveLength(1);
    expect(join).toHaveLength(1);
    expect(responder).toHaveLength(1);

    const condEdges = edgesFrom(edges, condition[0].id);
    const trueEdge = condEdges.find((e) => e.sourceHandle === "true");
    const falseEdge = condEdges.find((e) => e.sourceHandle === "false");
    expect(trueEdge?.target).toBe(responder[0].id);
    expect(falseEdge?.target).toBe(join[0].id);

    // True branch merges back
    expect(edgesTo(edges, join[0].id).some((e) => e.source === responder[0].id)).toBe(true);
  });
});

describe("Parallel compilation", () => {
  it("emits fork + two lanes + join", () => {
    const spec = makeSpec(
      [
        { id: "in", kind: "input", label: "In" },
        {
          id: "par",
          kind: "parallel",
          label: "Do two things",
          laneA: ["a1"],
          laneB: ["b1"],
        },
        {
          id: "a1",
          kind: "message",
          label: "Lane A",
          instructions: "A",
          outputMode: "text",
        },
        {
          id: "b1",
          kind: "message",
          label: "Lane B",
          instructions: "B",
          outputMode: "text",
        },
        { id: "end", kind: "end", label: "End" },
      ],
      ["in", "par", "end"]
    );

    const { nodes, edges } = compileSimplifiedGraph(spec);

    const forks = findType(nodes, "fork");
    const joins = findType(nodes, "join");
    const responders = findType(nodes, "responder");
    expect(forks).toHaveLength(1);
    expect(joins).toHaveLength(1);
    expect(responders).toHaveLength(2);

    const forkOut = edgesFrom(edges, forks[0].id);
    expect(forkOut).toHaveLength(2);
    const laneAHandle = forkOut.find((e) => e.sourceHandle === "laneA");
    const laneBHandle = forkOut.find((e) => e.sourceHandle === "laneB");
    expect(laneAHandle).toBeDefined();
    expect(laneBHandle).toBeDefined();

    const joinIncoming = edgesTo(edges, joins[0].id);
    expect(joinIncoming).toHaveLength(2);
  });
});

// ---------------------------------------------------------------------------
// End with close-conversation
// ---------------------------------------------------------------------------

describe("End step", () => {
  it("default End emits only an output node", () => {
    const spec = createEmptySimplifiedBuilder();
    const { nodes } = compileSimplifiedGraph(spec);
    expect(findType(nodes, "terminus")).toHaveLength(0);
    expect(findType(nodes, "output")).toHaveLength(1);
  });

  it("closeConversation End emits terminus and output", () => {
    const spec = makeSpec(
      [
        { id: "in", kind: "input", label: "In" },
        {
          id: "end",
          kind: "end",
          label: "Done",
          closeConversation: true,
          goalId: "g1",
          closingMessage: "Thanks!",
        },
      ],
      ["in", "end"]
    );
    const { nodes } = compileSimplifiedGraph(spec);
    const terminus = findType(nodes, "terminus");
    expect(terminus).toHaveLength(1);
    expect(terminus[0].data.goalId).toBe("g1");
    expect(findType(nodes, "output")).toHaveLength(1);
    expect(findType(nodes, "responder")).toHaveLength(1);
  });
});

// ---------------------------------------------------------------------------
// Validation
// ---------------------------------------------------------------------------

describe("validateSimplifiedBuilder", () => {
  it("requires an input at the head of rootOrder", () => {
    const spec: SimplifiedBuilderSpec = {
      version: 1,
      steps: [
        { id: "a", kind: "message", label: "A", instructions: "x", outputMode: "text" },
        { id: "end", kind: "end", label: "End" },
      ],
      rootOrder: ["a", "end"],
    };
    expect(() => validateSimplifiedBuilder(spec)).toThrow(/input/);
  });

  it("requires an end at the tail of rootOrder", () => {
    const spec: SimplifiedBuilderSpec = {
      version: 1,
      steps: [
        { id: "in", kind: "input", label: "In" },
        { id: "a", kind: "message", label: "A", instructions: "x", outputMode: "text" },
      ],
      rootOrder: ["in", "a"],
    };
    expect(() => validateSimplifiedBuilder(spec)).toThrow(/end/);
  });

  it("rejects references to unknown step ids", () => {
    const spec: SimplifiedBuilderSpec = {
      version: 1,
      steps: [
        { id: "in", kind: "input", label: "In" },
        {
          id: "c",
          kind: "condition",
          label: "C",
          condition: { field: "x", operator: "exists" },
          yesSteps: ["missing"],
          noSteps: [],
        },
        { id: "end", kind: "end", label: "End" },
      ],
      rootOrder: ["in", "c", "end"],
    };
    expect(() => validateSimplifiedBuilder(spec)).toThrow(/unknown step id/);
  });

  it("rejects duplicate ids", () => {
    const spec: SimplifiedBuilderSpec = {
      version: 1,
      steps: [
        { id: "in", kind: "input", label: "In" },
        { id: "in", kind: "end", label: "End" },
      ],
      rootOrder: ["in", "in"],
    };
    expect(() => validateSimplifiedBuilder(spec)).toThrow(/Duplicate step id/);
  });

  it("rejects orphan steps not referenced anywhere", () => {
    const spec: SimplifiedBuilderSpec = {
      version: 1,
      steps: [
        { id: "in", kind: "input", label: "In" },
        { id: "orphan", kind: "message", label: "X", instructions: "x", outputMode: "text" },
        { id: "end", kind: "end", label: "End" },
      ],
      rootOrder: ["in", "end"],
    };
    expect(() => validateSimplifiedBuilder(spec)).toThrow(/never referenced/);
  });

  it("rejects steps referenced more than once", () => {
    const spec: SimplifiedBuilderSpec = {
      version: 1,
      steps: [
        { id: "in", kind: "input", label: "In" },
        {
          id: "c",
          kind: "condition",
          label: "C",
          condition: { field: "x", operator: "exists" },
          yesSteps: ["shared"],
          noSteps: ["shared"],
        },
        { id: "shared", kind: "message", label: "X", instructions: "x", outputMode: "text" },
        { id: "end", kind: "end", label: "End" },
      ],
      rootOrder: ["in", "c", "end"],
    };
    expect(() => validateSimplifiedBuilder(spec)).toThrow(/referenced 2 times/);
  });
});

// ---------------------------------------------------------------------------
// Save-path integration (UpdateAgentSchema round-trip)
// ---------------------------------------------------------------------------

describe("save path Zod schema", () => {
  it("accepts a FlowDefinition carrying simplifiedBuilder", async () => {
    const { UpdateAgentSchema } = await import(
      "@/lib/agents/flow/agent-update-schemas"
    );
    const spec = makeSpec(
      [
        { id: "in", kind: "input", label: "In" },
        {
          id: "us",
          kind: "update_state",
          label: "Track",
          jsonSchema: [{ key: "intent", type: "string", description: "" }],
          varsFromOutput: [{ from: "intent", to: "intent" }],
        },
        {
          id: "c",
          kind: "condition",
          label: "Needs help?",
          condition: { field: "intent", operator: "eq", value: "help" },
          yesSteps: ["helpMsg"],
          noSteps: [],
        },
        {
          id: "helpMsg",
          kind: "message",
          label: "Help",
          instructions: "Offer help.",
          outputMode: "text",
        },
        { id: "end", kind: "end", label: "End" },
      ],
      ["in", "us", "c", "end"]
    );
    const flowDefinition = compileSimplifiedToFlowDefinition(spec);
    const parsed = UpdateAgentSchema.safeParse({
      flowDefinition,
      changelog: "test",
    });
    if (!parsed.success) {
      throw new Error(JSON.stringify(parsed.error.issues, null, 2));
    }
    expect(parsed.success).toBe(true);
    expect(parsed.data.flowDefinition?.simplifiedBuilder).toBeDefined();
  });
});

// ---------------------------------------------------------------------------
// Full FlowDefinition output
// ---------------------------------------------------------------------------

describe("compileSimplifiedToFlowDefinition", () => {
  it("returns a version 2 FlowDefinition with simplifiedBuilder preserved", () => {
    const spec = createEmptySimplifiedBuilder();
    const def = compileSimplifiedToFlowDefinition(spec, {
      stateConfig: {
        fields: [{ key: "intent", type: "string", description: "", default: "" }],
        goals: [],
        scope: "conversation",
      },
    });
    expect(def.version).toBe(2);
    expect(def.simplifiedBuilder).toBe(spec);
    expect(def.stateConfig?.fields).toHaveLength(1);
    expect(def.orchestrator?.vars).toHaveLength(1);
    expect(def.nodes.length).toBeGreaterThanOrEqual(2);
  });
});
