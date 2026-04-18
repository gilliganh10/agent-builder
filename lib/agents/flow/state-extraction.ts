import type {
  StateFieldDefinition,
  ExtractFieldSchema,
  ConversationMessage,
  JSONValue,
  AgentRunContext,
} from "@/db/agents/schema";
import { runAgent } from "@/lib/agents/llm-provider";
import type { OpenAIUsageRecordV1 } from "@/lib/agents/usage";

const DEFAULT_EXTRACTION_MODEL = "gpt-5-mini";

function buildExtractionPrompt(
  fieldDefinitions: StateFieldDefinition[],
  currentState: Record<string, JSONValue>
): string {
  const fieldDescriptions = fieldDefinitions
    .map((f) => {
      const currentVal = currentState[f.key];
      const currentStr =
        currentVal === null || currentVal === undefined
          ? "null"
          : JSON.stringify(currentVal);
      return `- "${f.key}" (${f.type}): ${f.description}. Current value: ${currentStr}`;
    })
    .join("\n");

  return [
    "You are a state extraction agent. Your job is to analyze a conversation and extract updated values for tracked state fields.",
    "",
    "STATE FIELDS:",
    fieldDescriptions,
    "",
    "RULES:",
    "1. Analyze the ENTIRE conversation, paying special attention to the most recent exchange.",
    "2. Return a JSON object with ONLY the fields whose values should change based on the conversation.",
    "3. If a field has not changed or there is no evidence for a new value, do NOT include it.",
    "4. Return an empty object {} if nothing has changed.",
    "5. Values must match the declared type for each field.",
    "6. For string fields, extract the relevant text content.",
    '7. For number fields, return a number (not a string). If counting, count accurately from the full conversation.',
    "8. For boolean fields, return true or false.",
    "9. For json fields, return valid JSON.",
    "",
    "Return ONLY valid JSON. No explanation, no markdown, no wrapper.",
  ].join("\n");
}

/**
 * Use a lightweight LLM call to extract state field updates from the
 * conversation. Returns a partial map of field key -> new value containing
 * only fields that changed.
 */
export interface StateExtractionUsage {
  usageRecords: OpenAIUsageRecordV1[];
  tokenUsage?: { prompt: number; completion: number; total: number };
}

export async function extractStateUpdates(
  conversationHistory: ConversationMessage[],
  latestAssistantMessage: string,
  currentState: Record<string, JSONValue>,
  fieldDefinitions: StateFieldDefinition[],
  ctx: AgentRunContext,
  model?: string,
  nodeId?: string
): Promise<{ updates: Record<string, JSONValue> } & StateExtractionUsage> {
  if (fieldDefinitions.length === 0) {
    return { updates: {}, usageRecords: [] };
  }

  const systemPrompt = buildExtractionPrompt(fieldDefinitions, currentState);

  const messages: ConversationMessage[] = [
    ...conversationHistory,
    { role: "assistant", content: latestAssistantMessage },
  ];

  const result = await runAgent(
    {
      definitionId: "state-extraction",
      name: "State Extractor",
      slug: "state-extractor",
      instructions: systemPrompt,
      tools: [],
      model: model ?? DEFAULT_EXTRACTION_MODEL,
    },
    messages,
    ctx,
    { phase: "state_extraction", nodeId }
  );

  return {
    updates: parseExtractionResult(result.finalOutput, fieldDefinitions),
    usageRecords: result.usageRecords,
    tokenUsage: result.usage,
  };
}

function parseExtractionResult(
  raw: string,
  fieldDefinitions: StateFieldDefinition[]
): Record<string, JSONValue> {
  const validKeys = new Set(fieldDefinitions.map((f) => f.key));
  const typeMap = new Map(fieldDefinitions.map((f) => [f.key, f.type]));

  let parsed: Record<string, unknown>;
  try {
    const trimmed = raw.trim();
    const jsonStr = trimmed.startsWith("```")
      ? trimmed.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
      : trimmed;
    parsed = JSON.parse(jsonStr);
  } catch {
    return {};
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return {};
  }

  const result: Record<string, JSONValue> = {};

  for (const [key, value] of Object.entries(parsed)) {
    if (!validKeys.has(key)) continue;

    const expectedType = typeMap.get(key)!;
    const coerced = coerceValue(value, expectedType);
    if (coerced !== undefined) {
      result[key] = coerced;
    }
  }

  return result;
}

function coerceValue(
  value: unknown,
  expectedType: StateFieldDefinition["type"] | ExtractFieldSchema["type"]
): JSONValue | undefined {
  if (value === null) return null;

  switch (expectedType) {
    case "string":
      return typeof value === "string" ? value : String(value);
    case "number": {
      const n = typeof value === "number" ? value : Number(value);
      return isNaN(n) ? undefined : n;
    }
    case "boolean":
      if (typeof value === "boolean") return value;
      if (value === "true") return true;
      if (value === "false") return false;
      return undefined;
    case "json":
      return value as JSONValue;
    default:
      return undefined;
  }
}

// ---------------------------------------------------------------------------
// Structured extraction — schema-driven, validated output
// ---------------------------------------------------------------------------

function buildStructuredExtractionPrompt(
  schema: ExtractFieldSchema[],
  instructions: string,
  currentVars?: Record<string, JSONValue>,
  varsRead?: string[]
): string {
  const fieldDescriptions = schema
    .map((f) => {
      const opt = f.optional ? " (optional)" : "";
      return `- "${f.key}" (${f.type}${opt}): ${f.description}`;
    })
    .join("\n");

  const sections: string[] = [
    "You are a structured extraction agent. Analyze the conversation and return a JSON object matching the schema below.",
    "",
    "OUTPUT SCHEMA (all fields are required unless marked optional):",
    fieldDescriptions,
  ];

  if (varsRead?.length && currentVars) {
    const varLines = varsRead
      .map((k) => {
        const val = currentVars[k];
        return `- "${k}": ${val === null || val === undefined ? "null" : JSON.stringify(val)}`;
      })
      .join("\n");
    sections.push("", "CURRENT STATE VARIABLES:", varLines);
  }

  if (instructions.trim()) {
    sections.push("", "INSTRUCTIONS:", instructions);
  }

  sections.push(
    "",
    "RULES:",
    "1. Return ONLY valid JSON. No explanation, no markdown, no wrapper.",
    "2. Every required field MUST be present in the output.",
    "3. Values must match the declared type for each field.",
    "4. For number fields, return a number (not a string).",
    "5. For boolean fields, return true or false.",
    "6. For json fields, return valid JSON objects or arrays.",
    "7. Analyze the most recent user message carefully.",
  );

  return sections.join("\n");
}

/**
 * Schema-driven structured extraction. Returns validated key/value pairs
 * matching the provided `ExtractFieldSchema[]`. Used by extract blocks
 * in the Chat Builder.
 */
export async function extractStructured(
  conversationHistory: ConversationMessage[],
  schema: ExtractFieldSchema[],
  instructions: string,
  ctx: AgentRunContext,
  options?: {
    currentVars?: Record<string, JSONValue>;
    varsRead?: string[];
    model?: string;
    nodeId?: string;
  }
): Promise<{ extracted: Record<string, JSONValue> } & StateExtractionUsage> {
  if (schema.length === 0) {
    return { extracted: {}, usageRecords: [] };
  }

  const systemPrompt = buildStructuredExtractionPrompt(
    schema,
    instructions,
    options?.currentVars,
    options?.varsRead
  );

  const result = await runAgent(
    {
      definitionId: "structured-extraction",
      name: "Structured Extractor",
      slug: "structured-extractor",
      instructions: systemPrompt,
      tools: [],
      model: options?.model ?? DEFAULT_EXTRACTION_MODEL,
    },
    conversationHistory,
    ctx,
    { phase: "state_extraction", nodeId: options?.nodeId }
  );

  return {
    extracted: parseStructuredResult(result.finalOutput, schema),
    usageRecords: result.usageRecords,
    tokenUsage: result.usage,
  };
}

function parseStructuredResult(
  raw: string,
  schema: ExtractFieldSchema[]
): Record<string, JSONValue> {
  let parsed: Record<string, unknown>;
  try {
    const trimmed = raw.trim();
    const jsonStr = trimmed.startsWith("```")
      ? trimmed.replace(/^```(?:json)?\n?/, "").replace(/\n?```$/, "")
      : trimmed;
    parsed = JSON.parse(jsonStr);
  } catch {
    return buildDefaults(schema);
  }

  if (typeof parsed !== "object" || parsed === null || Array.isArray(parsed)) {
    return buildDefaults(schema);
  }

  const result: Record<string, JSONValue> = {};

  for (const field of schema) {
    const value = parsed[field.key];

    if (value === undefined || value === null) {
      if (!field.optional) {
        result[field.key] = getDefaultForType(field.type);
      }
      continue;
    }

    const coerced = coerceValue(value, field.type);
    if (coerced !== undefined) {
      result[field.key] = coerced;
    } else if (!field.optional) {
      result[field.key] = getDefaultForType(field.type);
    }
  }

  return result;
}

function buildDefaults(schema: ExtractFieldSchema[]): Record<string, JSONValue> {
  const result: Record<string, JSONValue> = {};
  for (const field of schema) {
    if (!field.optional) {
      result[field.key] = getDefaultForType(field.type);
    }
  }
  return result;
}

function getDefaultForType(type: ExtractFieldSchema["type"]): JSONValue {
  switch (type) {
    case "string": return "";
    case "number": return 0;
    case "boolean": return false;
    default: return null;
  }
}
