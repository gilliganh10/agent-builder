import { describe, expect, it } from "vitest";
import type {
  AgentDefinition,
  ChatBuilderSpec,
  FlowDefinition,
} from "@/db/agents/schema";
import {
  applyStudioModel,
  getStudioModel,
} from "@/lib/agents/studio";
import type { StudioStep } from "@/lib/agents/studio";

// ---------------------------------------------------------------------------
// Fixture — a Glottr-like chatBuilder agent used across tests.
// ---------------------------------------------------------------------------

function glottrChatBuilder(): ChatBuilderSpec {
  return {
    blocks: [
      {
        id: "user-1",
        type: "user",
        label: "User Message",
        position: 0,
        settings: { canRewrite: true },
        attachments: [
          {
            id: "att-triage",
            mode: "after",
            label: "Triage",
            inlinePrimitive: {
              kind: "researcher",
              instructions:
                'Analyse the message. Respond ONLY with valid JSON: { "needs_correction": true/false }',
            },
            varsPatch: { needs_correction: "needs_correction" },
          },
          {
            id: "att-correction",
            mode: "override",
            label: "Correction",
            inlinePrimitive: {
              kind: "rewriter",
              instructions: "Rewrite the message in correct {{env.targetLanguage}}.",
            },
            condition: { field: "needs_correction", operator: "eq", value: true },
          },
        ],
      },
      {
        id: "assistant-1",
        type: "assistant",
        label: "Reply",
        position: 1,
        settings: { displayName: "Glottr" },
        attachments: [
          {
            id: "att-reply",
            mode: "before",
            label: "Generate Reply",
            inlinePrimitive: {
              kind: "responder",
              instructions: "Continue the conversation naturally.",
            },
          },
        ],
      },
    ],
  };
}

function glottrFlow(): FlowDefinition {
  return {
    version: 2,
    orchestrator: {
      vars: [
        {
          key: "needs_correction",
          type: "boolean",
          default: false,
          description: "",
        },
      ],
      goals: [
        {
          id: "practice",
          description: "Help user practice",
        },
      ],
      locks: [],
      scope: "conversation",
    },
    stateConfig: {
      fields: [
        {
          key: "needs_correction",
          type: "boolean",
          default: false,
          description: "",
        },
      ],
      goals: [
        {
          id: "practice",
          name: "Practice",
          description: "Help user practice",
          conditions: [],
          conditionLogic: "all",
          onComplete: { type: "close" },
        },
      ],
      scope: "conversation",
    },
    chatBuilder: glottrChatBuilder(),
    nodes: [
      { id: "input", type: "input", position: { x: 0, y: 0 }, data: { label: "Input" } },
      { id: "output", type: "output", position: { x: 800, y: 0 }, data: { label: "Output" } },
    ],
    edges: [],
    envVars: [
      {
        key: "targetLanguage",
        label: "Target Language",
        type: "string",
        default: "French",
        required: true,
        publicEditable: true,
      },
    ],
  };
}

function makeAgent(overrides: Partial<AgentDefinition> = {}): AgentDefinition {
  return {
    id: "agent-1",
    name: "Glottr",
    slug: "glottr",
    description: "Language learning bot",
    kind: "user_created",
    instructions: "Help the user practise a language.",
    allowedTools: [],
    defaultModel: "gpt-5-mini",
    outputSchema: null,
    flowDefinition: glottrFlow(),
    mode: "conversational",
    meta: {},
    createdAt: "",
    updatedAt: "",
    ...overrides,
  };
}

// ---------------------------------------------------------------------------
// getStudioModel
// ---------------------------------------------------------------------------

describe("getStudioModel", () => {
  it("derives purpose, objectives, memory, and inputs with strict separation", () => {
    const m = getStudioModel(makeAgent());

    expect(m.purpose).toEqual({
      name: "Glottr",
      description: "Language learning bot",
      charter: "Help the user practise a language.",
      mode: "conversational",
    });

    expect(m.objectives).toHaveLength(1);
    expect(m.objectives[0]).toMatchObject({
      id: "practice",
      name: "Practice",
      description: "Help user practice",
      hasCompletionRules: false,
    });

    expect(m.memory.scope).toBe("conversation");
    expect(m.memory.fields).toHaveLength(1);
    expect(m.memory.fields[0].key).toBe("needs_correction");
    // Memory MUST NOT carry goals/objectives data.
    expect((m.memory as unknown as { goals?: unknown }).goals).toBeUndefined();

    expect(m.inputs).toHaveLength(1);
    expect(m.inputs[0].key).toBe("targetLanguage");
  });

  it("projects chatBuilder blocks into the five Plan v1 step kinds", () => {
    const m = getStudioModel(makeAgent());

    expect(m.sourceOfTruth).toBe("chatBuilder");
    expect(m.flags.hasChatBuilder).toBe(true);

    const kinds = m.steps.map((s) => s.kind);
    expect(kinds).toEqual(["understand", "transform", "respond"]);

    const understand = m.steps[0];
    expect(understand.label).toBe("Triage");
    expect(understand.trigger).toBe("after_user");
    expect(understand.memoryWrites).toEqual([
      { from: "needs_correction", to: "needs_correction" },
    ]);
    // Plan v1 infers the JSON contract from the prompt so the UI can show a
    // distinct "json" output shape rather than leaving users guessing.
    expect(understand.output.kind).toBe("json");

    const transform = m.steps[1];
    expect(transform.kind).toBe("transform");
    expect(transform.trigger).toBe("replace_user");
    expect(transform.condition).toEqual({
      field: "needs_correction",
      operator: "eq",
      value: true,
    });

    const respond = m.steps[2];
    expect(respond.kind).toBe("respond");
    expect(respond.trigger).toBe("before_reply");
  });

  it("falls back to sourceOfTruth graph when no chatBuilder is present", () => {
    const agent = makeAgent({
      flowDefinition: {
        version: 2,
        nodes: [{ id: "n1", type: "responder", position: { x: 0, y: 0 }, data: {} }],
        edges: [],
      },
    });
    const m = getStudioModel(agent);
    expect(m.sourceOfTruth).toBe("graph");
    expect(m.steps).toEqual([]);
    expect(m.flags.hasGraphOnlyConstructs).toBe(true);
  });

  it("flags unsurfaced block types without dropping them from rawChatBuilder", () => {
    const spec = glottrChatBuilder();
    spec.blocks.push({
      id: "sys-1",
      type: "system",
      label: "System",
      position: 2,
      settings: {},
      attachments: [],
      content: "Be concise.",
    });
    const agent = makeAgent({
      flowDefinition: { ...glottrFlow(), chatBuilder: spec },
    });
    const m = getStudioModel(agent);
    expect(m.flags.unsurfacedBlockTypes).toContain("system");
    expect(m.rawChatBuilder?.blocks.some((b) => b.type === "system")).toBe(true);
  });
});

// ---------------------------------------------------------------------------
// applyStudioModel
// ---------------------------------------------------------------------------

describe("applyStudioModel", () => {
  it("writes step edits back onto chatBuilder attachments and recompiles", () => {
    const agent = makeAgent();
    const model = getStudioModel(agent);

    const editedRespond = model.steps[2];
    const patchedSteps: StudioStep[] = [
      model.steps[0],
      model.steps[1],
      { ...editedRespond, instructions: "Answer in a warm tone." },
    ];

    const result = applyStudioModel(agent, { steps: patchedSteps });
    const blocks = result.flowDefinition.chatBuilder?.blocks ?? [];
    const assistant = blocks.find((b) => b.id === "assistant-1");
    expect(
      assistant?.attachments.find((a) => a.id === "att-reply")?.inlinePrimitive
        ?.instructions
    ).toBe("Answer in a warm tone.");

    // Recompiled nodes reflect the chatBuilder.
    const responders = result.flowDefinition.nodes.filter(
      (n) => n.type === "responder"
    );
    expect(responders.length).toBeGreaterThan(0);
  });

  it("preserves unsurfaced blocks (system) through a step-only save", () => {
    const spec = glottrChatBuilder();
    spec.blocks.push({
      id: "sys-1",
      type: "system",
      label: "System",
      position: 2,
      settings: {},
      attachments: [],
      content: "Be concise.",
    });
    const agent = makeAgent({
      flowDefinition: { ...glottrFlow(), chatBuilder: spec },
    });
    const model = getStudioModel(agent);
    const result = applyStudioModel(agent, { steps: model.steps });
    const preserved = result.flowDefinition.chatBuilder?.blocks.find(
      (b) => b.id === "sys-1"
    );
    expect(preserved?.content).toBe("Be concise.");
  });

  it("applies memory edits without mutating objectives", () => {
    const agent = makeAgent();
    const model = getStudioModel(agent);

    const result = applyStudioModel(agent, {
      memory: {
        ...model.memory,
        fields: [
          ...model.memory.fields,
          {
            key: "correctionCount",
            type: "number",
            default: 0,
            description: "Running count",
          },
        ],
      },
    });

    expect(result.flowDefinition.stateConfig?.fields.map((f) => f.key)).toEqual([
      "needs_correction",
      "correctionCount",
    ]);
    // Objectives untouched.
    expect(result.flowDefinition.stateConfig?.goals).toHaveLength(1);
    expect(result.flowDefinition.stateConfig?.goals[0].name).toBe("Practice");
    expect(result.flowDefinition.orchestrator?.goals[0].description).toBe(
      "Practice"
    );
  });

  it("preserves completion rules on objectives edited by label only", () => {
    const spec = glottrChatBuilder();
    const flow = glottrFlow();
    flow.stateConfig!.goals[0] = {
      ...flow.stateConfig!.goals[0],
      conditions: [
        { field: "correctionCount", operator: "gte", value: 3 },
      ],
      conditionLogic: "all",
    };
    flow.chatBuilder = spec;
    const agent = makeAgent({ flowDefinition: flow });

    const model = getStudioModel(agent);
    expect(model.objectives[0].hasCompletionRules).toBe(true);

    const result = applyStudioModel(agent, {
      objectives: [{ ...model.objectives[0], name: "Practise daily" }],
    });

    const savedGoal = result.flowDefinition.stateConfig?.goals[0];
    expect(savedGoal?.name).toBe("Practise daily");
    expect(savedGoal?.conditions).toHaveLength(1);
    expect(savedGoal?.conditions[0].field).toBe("correctionCount");
  });

  it("ignores step edits when sourceOfTruth is graph but still applies memory/inputs", () => {
    const agent = makeAgent({
      flowDefinition: {
        version: 2,
        nodes: [
          { id: "input", type: "input", position: { x: 0, y: 0 }, data: {} },
          {
            id: "r1",
            type: "responder",
            position: { x: 100, y: 0 },
            data: { label: "Reply" },
          },
          { id: "output", type: "output", position: { x: 200, y: 0 }, data: {} },
        ],
        edges: [],
      },
    });

    const fakeStep: StudioStep = {
      id: "made-up",
      kind: "respond",
      label: "Reply",
      instructions: "Ignored because SoT is graph.",
      trigger: "before_reply",
      memoryReads: [],
      memoryWrites: [],
      output: { kind: "free_text" },
      origin: { blockId: "nowhere", kind: "block" },
    };

    const result = applyStudioModel(agent, {
      steps: [fakeStep],
      inputs: [
        {
          key: "greeting",
          label: "Greeting",
          type: "string",
          default: "Hi",
          required: false,
          publicEditable: true,
        },
      ],
    });

    // Graph untouched.
    expect(result.flowDefinition.nodes.map((n) => n.id)).toEqual([
      "input",
      "r1",
      "output",
    ]);
    // But inputs merged.
    expect(result.flowDefinition.envVars?.[0].key).toBe("greeting");
  });

  it("drops locks for removed memory fields", () => {
    const flow = glottrFlow();
    flow.orchestrator!.locks = ["needs_correction", "stale_key"];
    const agent = makeAgent({ flowDefinition: flow });
    const model = getStudioModel(agent);

    const result = applyStudioModel(agent, {
      memory: { ...model.memory, fields: [], locks: ["needs_correction", "stale_key"] },
    });

    expect(result.flowDefinition.orchestrator?.locks).toEqual([]);
  });

  it("round-trips an unchanged model to an equivalent chatBuilder", () => {
    const agent = makeAgent();
    const model = getStudioModel(agent);
    const result = applyStudioModel(agent, { steps: model.steps });

    const before = agent.flowDefinition!.chatBuilder!.blocks;
    const after = result.flowDefinition.chatBuilder?.blocks ?? [];

    expect(after.map((b) => b.id)).toEqual(before.map((b) => b.id));
    for (let i = 0; i < before.length; i++) {
      expect(after[i].attachments.map((a) => a.id)).toEqual(
        before[i].attachments.map((a) => a.id)
      );
    }
  });
});
