/**
 * Structured outputs via OpenAI Chat Completions API with response_format.
 * Ensures model responses adhere to a JSON schema (no ad-hoc "return JSON" prompting).
 * Used for triage and other classification/extraction steps.
 */

import { resolveModel, type ModelPolicy } from "@/lib/agents/model-policy";
import type { ConversationMessage } from "@/db/agents/schema";
import {
  fromChatCompletionResponse,
  newUsageId,
  type OpenAIUsagePhase,
  type OpenAIUsageRecordV1,
} from "@/lib/agents/usage";

// ---------------------------------------------------------------------------
// Triage output contract (project copilot and reusable for other flows)
// ---------------------------------------------------------------------------

export const TRIAGE_INTENT_VALUES = [
  "suggest_outcomes",
  "suggest_key_results",
  "suggest_objectives",
  "update_plan",
  "add_risk",
  "add_decision",
  "add_kpi",
  "add_experiment",
  "add_hypothesis",
  "add_result",
  "add_action_item",
  "update_project",
  "update_item",
  "general_question",
] as const;

export type TriageIntent = (typeof TRIAGE_INTENT_VALUES)[number];

export const TRIAGE_ACTION_MODE_VALUES = ["answer", "propose"] as const;
export type TriageActionMode = (typeof TRIAGE_ACTION_MODE_VALUES)[number];

export const TRIAGE_TARGET_KIND_VALUES = [
  "project",
  "outcome",
  "key_result",
  "objective",
  "plan",
  "risk",
  "decision",
  "kpi",
  "experiment",
  "hypothesis",
  "result",
  "action_item",
  "feature",
  "unknown",
] as const;
export type TriageTargetKind = (typeof TRIAGE_TARGET_KIND_VALUES)[number];

export interface TriageOutput {
  userMessage: string;
  intent: TriageIntent;
  target_kind: TriageTargetKind;
  action_mode: TriageActionMode;
  needs_clarification: boolean;
  clarification_reason: string | null;
  context_summary: string;
}

/** JSON Schema for triage output (OpenAI strict mode). */
const TRIAGE_JSON_SCHEMA = {
  type: "object" as const,
  properties: {
    userMessage: { type: "string" as const, description: "Exact copy of the user message from input" },
    intent: {
      type: "string" as const,
      enum: [...TRIAGE_INTENT_VALUES],
      description: "Classified intent of the user request",
    },
    target_kind: {
      type: "string" as const,
      enum: [...TRIAGE_TARGET_KIND_VALUES],
      description: "What project entity the request targets",
    },
    action_mode: {
      type: "string" as const,
      enum: [...TRIAGE_ACTION_MODE_VALUES],
      description:
        "answer = read-only reply; propose = draft markdown patches for in-editor review (users accept/reject in the document — there is no server-side apply step)",
    },
    needs_clarification: {
      type: "boolean" as const,
      description:
        "For action_mode answer only: true if the question cannot be resolved from context. For action_mode propose must always be false — do not gate document edits on clarification.",
    },
    clarification_reason: {
      type: ["string", "null"] as const,
      description: "Short reason if needs_clarification is true, else null",
    },
    context_summary: {
      type: "string" as const,
      description: "1-2 sentence summary of relevant project state",
    },
  },
  required: [
    "userMessage",
    "intent",
    "target_kind",
    "action_mode",
    "needs_clarification",
    "clarification_reason",
    "context_summary",
  ],
  additionalProperties: false,
};

// ---------------------------------------------------------------------------
// API call with response_format
// ---------------------------------------------------------------------------

export interface StructuredUsageAttribution {
  runId: string;
  phase: OpenAIUsagePhase;
  nodeId?: string;
  stepIndex?: number;
}

export interface RunStructuredOptions {
  model: string;
  systemContent: string;
  input: string | ConversationMessage[];
  schemaName: string;
  schema: typeof TRIAGE_JSON_SCHEMA;
  /** When set, builds `usageRecords` for the OpenAI usage ledger */
  usageAttribution?: StructuredUsageAttribution;
  /** GPT-5 family: forwarded as `reasoning_effort` on Chat Completions (omit for non-reasoning models). */
  reasoningEffort?: string | null;
}

/**
 * Call OpenAI Chat Completions with response_format (json_schema, strict).
 * Returns parsed object and optional token usage. Throws on API or parse errors.
 */
export async function runStructuredCompletion<T>(
  options: RunStructuredOptions
): Promise<StructuredCompletionResult<T>> {
  const { model, systemContent, input, schemaName, schema, usageAttribution } =
    options;
  const reasoningEffort = options.reasoningEffort;

  const apiKey = process.env.OPENAI_API_KEY;
  if (!apiKey) {
    throw new Error("OPENAI_API_KEY is not set");
  }

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      Authorization: `Bearer ${apiKey}`,
    },
    body: JSON.stringify({
      model,
      messages: buildMessages(systemContent, input),
      response_format: {
        type: "json_schema",
        json_schema: {
          name: schemaName,
          strict: true,
          schema,
        },
      },
      max_tokens: 1024,
      ...(reasoningEffort != null && reasoningEffort !== ""
        ? { reasoning_effort: reasoningEffort }
        : {}),
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error ${response.status}: ${errText}`);
  }

  const data = (await response.json()) as Record<string, unknown>;
  const choices = data.choices as
    | Array<{
        message?: { content?: string | null; refusal?: string };
        finish_reason?: string;
      }>
    | undefined;

  const choice = choices?.[0];
  if (!choice?.message) {
    throw new Error("OpenAI API returned no message");
  }

  if (choice.message.refusal) {
    throw new Error(`Model refused: ${choice.message.refusal}`);
  }

  const content = choice.message.content;
  if (content == null || content === "") {
    throw new Error("OpenAI API returned empty content");
  }

  const parsed = JSON.parse(content) as T;
  const usageObj = data.usage as
    | { prompt_tokens?: number; completion_tokens?: number; total_tokens?: number }
    | undefined;
  const usage = usageObj
    ? {
        prompt: usageObj.prompt_tokens ?? 0,
        completion: usageObj.completion_tokens ?? 0,
        total: usageObj.total_tokens ?? 0,
      }
    : undefined;

  const usageRecords: OpenAIUsageRecordV1[] = usageAttribution
    ? [
        fromChatCompletionResponse(data, {
          runId: usageAttribution.runId,
          nodeId: usageAttribution.nodeId,
          stepIndex: usageAttribution.stepIndex,
          phase: usageAttribution.phase,
          modelRequested: model,
          invocationId: newUsageId(),
        }),
      ]
    : [];

  return { parsed, usage, usageRecords };
}

export interface StructuredCompletionResult<T> {
  parsed: T;
  usage?: { prompt: number; completion: number; total: number };
  usageRecords: OpenAIUsageRecordV1[];
}

// ---------------------------------------------------------------------------
// Triage-specific runner
// ---------------------------------------------------------------------------

/**
 * Non-product reminder appended after flow-defined triage policy (inlineInstructions).
 * Classification rules live on the researcher node in the agent flow, not here.
 */
const TRIAGE_STRUCTURED_OUTPUT_REMINDER = `Output contract: reply with a single JSON object only, matching the API json_schema. Required fields: userMessage (echo the current user request from the payload), intent, target_kind, action_mode (answer or propose only), needs_clarification, clarification_reason (null when not clarifying), context_summary. User content is JSON with userMessage, projectContext, and vars when provided; conversation history may precede the latest user message.`;

export interface RunStructuredTriageOptions {
  /** Interpolated flow policy from the triage researcher node's inlineInstructions. */
  systemContent: string;
  modelPolicy?: ModelPolicy;
  usageAttribution?: StructuredUsageAttribution;
}

/**
 * Run triage with structured output. `systemContent` comes from the flow node (DB), not hardcoded product policy.
 */
export async function runStructuredTriage(
  input: string | ConversationMessage[],
  options: RunStructuredTriageOptions
): Promise<StructuredCompletionResult<TriageOutput>> {
  const model = resolveModel(options.modelPolicy ?? "cheap");
  const policy = options.systemContent.trim();
  const systemContent = `${policy}\n\n${TRIAGE_STRUCTURED_OUTPUT_REMINDER}`;
  return runStructuredCompletion<TriageOutput>({
    model,
    systemContent,
    input,
    schemaName: "triage",
    schema: TRIAGE_JSON_SCHEMA,
    usageAttribution: options.usageAttribution,
  });
}

/** Schema key used in flow node data to select structured output path. */
export const STRUCTURED_OUTPUT_SCHEMA_KEYS = ["triage"] as const;
export type StructuredOutputSchemaKey = (typeof STRUCTURED_OUTPUT_SCHEMA_KEYS)[number];

export function isStructuredOutputSchemaKey(
  key: unknown
): key is StructuredOutputSchemaKey {
  return typeof key === "string" && STRUCTURED_OUTPUT_SCHEMA_KEYS.includes(key as StructuredOutputSchemaKey);
}

function buildMessages(
  systemContent: string,
  input: string | ConversationMessage[]
): Array<{ role: "system" | "user" | "assistant"; content: string }> {
  if (Array.isArray(input)) {
    return [
      { role: "system", content: systemContent },
      ...input.map((message) => ({
        role: message.role,
        content: message.content,
      })),
    ];
  }

  return [
    { role: "system", content: systemContent },
    { role: "user", content: input },
  ];
}
