import type { AgentGoal, ChatBuilderSpec, FlowDefinition } from "@/db/agents/schema";
import { compileChatBuilder } from "@/lib/agents/chat-builder/compiler";
import type { AgentTemplate } from "./types";

const DETECT_REACTION_INSTRUCTIONS = `You classify the user's latest message: are they won over by the jokester?
Treat as convinced if they laugh, praise the joke, concede ("ok fine", "that was good"), use positive emoji, or clearly enjoy the bit.
Respond ONLY with valid JSON: { "userConvinced": true/false }`;

const PERSUADER_INSTRUCTIONS = `You are a playful agent whose mission is to tell short jokes and gently persuade the user the joke deserved a smile.
Stay kind and light; don't nag. If they seem unconvinced, try a fresh angle or a new quip rather than repeating yourself.
Respond ONLY with valid JSON: { "message": "<your reply>" }`;

const CHAT_BUILDER: ChatBuilderSpec = {
  blocks: [
    {
      id: "user-1",
      type: "user",
      label: "User",
      position: 0,
      settings: { canRewrite: true },
      attachments: [
        {
          id: "att-detect-win",
          mode: "after",
          label: "Detect reaction",
          inlinePrimitive: {
            kind: "researcher",
            instructions: DETECT_REACTION_INSTRUCTIONS,
          },
          varsPatch: { userConvinced: "userConvinced" },
        },
      ],
    },
    {
      id: "assistant-1",
      type: "assistant",
      label: "Joke persuader",
      position: 1,
      settings: {
        displayName: "Joke persuader",
        displayColor: "#3B656B",
        displaySide: "left",
      },
      attachments: [
        {
          id: "att-reply",
          mode: "before",
          label: "Reply",
          inlinePrimitive: {
            kind: "responder",
            instructions: PERSUADER_INSTRUCTIONS,
          },
        },
      ],
    },
  ],
};

function buildFlow(): FlowDefinition {
  const { nodes, edges } = compileChatBuilder(CHAT_BUILDER);

  const persuadeGoal: AgentGoal = {
    id: "persuade-win-smile",
    name: "Win a smile",
    description:
      "Get the user to signal they enjoyed the joke—laugh, compliment, or concede.",
    conditions: [{ field: "userConvinced", operator: "eq", value: true }],
    conditionLogic: "all",
    onComplete: {
      type: "message",
      message: "They gave in—mission accomplished.",
    },
  };

  return {
    version: 2,
    orchestrator: {
      vars: [
        {
          key: "userConvinced",
          type: "boolean",
          default: false,
          description:
            "True when the user's message shows they liked the joke or were persuaded.",
        },
      ],
      goals: [{ id: persuadeGoal.id, description: persuadeGoal.name }],
      locks: [],
      scope: "conversation",
    },
    stateConfig: {
      scope: "conversation",
      fields: [
        {
          key: "userConvinced",
          type: "boolean",
          default: false,
          description:
            "True when the user's message shows they liked the joke or were persuaded.",
        },
      ],
      goals: [persuadeGoal],
    },
    chatBuilder: CHAT_BUILDER,
    nodes,
    edges,
    envVars: [],
  };
}

export const JOKE_PERSUADER_TEMPLATE: AgentTemplate = {
  id: "joke-persuader",
  name: "Joke persuader",
  description:
    "A tiny demo agent that tells jokes and tries to win you over—wired with a conversation goal that completes when you signal you enjoyed the bit.",
  tagline: "Goals + punchlines — see objectives fire in the test chat.",
  slugSuggestion: "joke-persuader",
  mode: "conversational",
  modelPolicy: "cheap",
  instructions:
    "Playful joke-teller that persuades the user the joke was funny; tracks whether the user concedes with a smile (goal completion).",
  buildFlowDefinition: buildFlow,
};
