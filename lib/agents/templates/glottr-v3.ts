import type { ChatBuilderSpec, FlowDefinition } from "@/db/agents/schema";
import { compileChatBuilder } from "@/lib/agents/chat-builder/compiler";
import type { AgentTemplate } from "./types";

const TRIAGE_INSTRUCTIONS = `You are a language triage agent for a language-learning chatbot.
Given a user message in {{env.targetLanguage}}, determine if it contains grammatical errors or unnatural phrasing.
The user's proficiency level is {{vars.proficiencyLevel}}.
Respond ONLY with valid JSON: { "needs_correction": true/false, "message": "<original user message>" }
If the message is correct and natural, set needs_correction to false.
If it has errors, set needs_correction to true.
Always include the original message in the "message" field.`;

const CORRECTION_INSTRUCTIONS = `You are a language correction agent for a language-learning chatbot.
You receive a JSON object with { "needs_correction": true, "message": "<user message>" }.
The user is learning {{env.targetLanguage}} at a {{vars.proficiencyLevel}} level.
Provide a corrected version of the message and a brief, encouraging explanation of the errors.
Respond ONLY with valid JSON: { "rewrittenMessage": "<corrected message in {{env.targetLanguage}}>", "explanation": "<friendly explanation of corrections>" }
The rewrittenMessage should be the grammatically correct version of the user's message.
The explanation should be encouraging and educational.`;

const REPLY_INSTRUCTIONS = `You are a conversational partner in a language-learning chatbot.
You receive a user message and continue the conversation naturally in {{env.targetLanguage}}.
The user is at a {{vars.proficiencyLevel}} level, so adjust your vocabulary and sentence complexity accordingly.
Be engaging, ask follow-up questions, and keep the conversation flowing at an appropriate level.
Respond ONLY with valid JSON: { "message": "<your conversational reply>" }`;

const CHAT_BUILDER: ChatBuilderSpec = {
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
          inlinePrimitive: { kind: "researcher", instructions: TRIAGE_INSTRUCTIONS },
          varsPatch: { needs_correction: "needs_correction" },
        },
        {
          id: "att-correction",
          mode: "override",
          label: "Correction",
          inlinePrimitive: { kind: "rewriter", instructions: CORRECTION_INSTRUCTIONS },
          condition: { field: "needs_correction", operator: "eq", value: true },
          displayColor: "#946E83",
          displayName: "Correction",
        },
      ],
    },
    {
      id: "assistant-1",
      type: "assistant",
      label: "Reply",
      position: 1,
      settings: { displayName: "Glottr", displayColor: "#222E50", displaySide: "left" },
      attachments: [
        {
          id: "att-reply",
          mode: "before",
          label: "Generate Reply",
          inlinePrimitive: { kind: "responder", instructions: REPLY_INSTRUCTIONS },
        },
      ],
    },
  ],
};

function buildFlow(): FlowDefinition {
  const { nodes, edges } = compileChatBuilder(CHAT_BUILDER);
  return {
    version: 2,
    orchestrator: {
      vars: [
        { key: "needs_correction", type: "boolean", default: false, description: "Whether the user's message needs grammatical correction" },
        { key: "correctionCount", type: "number", default: 0, description: "Running count of corrections made this session" },
        { key: "proficiencyLevel", type: "string", default: "intermediate", description: "Synced from env — user's current level" },
      ],
      goals: [],
      locks: [],
      scope: "conversation",
    },
    stateConfig: {
      scope: "conversation",
      fields: [
        { key: "needs_correction", type: "boolean", default: false, description: "Whether the user's message needs grammatical correction" },
        { key: "correctionCount", type: "number", default: 0, description: "Running count of corrections made this session" },
        { key: "proficiencyLevel", type: "string", default: "intermediate", description: "Synced from env — user's current level" },
      ],
      goals: [],
    },
    chatBuilder: CHAT_BUILDER,
    nodes,
    edges,
    envVars: [
      {
        key: "targetLanguage",
        label: "Target Language",
        type: "string",
        default: "French",
        description: "The language the user is learning",
        required: true,
        publicEditable: true,
      },
      {
        key: "proficiencyLevel",
        label: "Proficiency Level",
        type: "enum",
        default: "intermediate",
        enumValues: ["beginner", "intermediate", "advanced"],
        description: "User's current level in the target language",
        required: false,
        publicEditable: true,
      },
    ],
  };
}

export const GLOTTR_V3_TEMPLATE: AgentTemplate = {
  id: "glottr-v3",
  name: "Glottr — language learning chatbot",
  description:
    "Conversational language-learning agent: triages the user's message, gently corrects grammar when needed, and replies in the target language at the right level.",
  tagline: "Triage → correct → reply. Great starting point for conversational agents.",
  slugSuggestion: "glottr",
  mode: "conversational",
  modelPolicy: "cheap",
  instructions:
    "Conversational language-learning partner. Triage each user message; if it contains errors, rewrite it clearly with a short encouraging explanation; then reply in the target language at the user's level.",
  buildFlowDefinition: buildFlow,
};
