import type { InputGuardrail } from "@openai/agents";
import { OpenAI } from "openai";
import {
  runGuardrails,
  type GuardrailBundle,
  type GuardrailResult,
} from "@openai/guardrails";

/** Stable API error code for clients. */
export const GUARDRAILS_BLOCKED_ERROR = "guardrails_blocked" as const;

/**
 * Default bundle for end-user text (aligned with OpenAI Agent Builder patterns).
 * Tune models/thresholds via env or code as needed.
 */
export const DEFAULT_USER_INPUT_GUARDRAIL_BUNDLE: GuardrailBundle = {
  guardrails: [
    {
      name: "Jailbreak",
      config: { model: "gpt-4.1-mini", confidence_threshold: 0.7 },
    },
    {
      name: "NSFW Text",
      config: { model: "gpt-4.1-mini", confidence_threshold: 0.7 },
    },
    {
      name: "Prompt Injection Detection",
      config: {
        model: "gpt-4.1-mini",
        confidence_threshold: 0.7,
        max_turns: 1,
      },
    },
    {
      name: "Contains PII",
      config: {
        block: false,
        detect_encoded_pii: true,
        entities: [
          "CREDIT_CARD",
          "US_BANK_NUMBER",
          "US_PASSPORT",
          "US_SSN",
        ],
      },
    },
  ],
};

let guardrailLlmClient: OpenAI | null = null;

/** Shared OpenAI client for `@openai/guardrails` (Agents SDK guardrail context). */
export function getOpenAiGuardrailsLlmClient(): OpenAI {
  if (!guardrailLlmClient) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    guardrailLlmClient = new OpenAI({ apiKey });
  }
  return guardrailLlmClient;
}

export function isUserInputGuardrailsDisabled(): boolean {
  const v = process.env.INPUT_GUARDRAILS_ENABLED;
  return v === "0" || v === "false";
}

/**
 * Latest user-authored plain text from Agents SDK input (string or message list).
 */
function extractTextForOpenAiGuardrails(
  input: string | Array<Record<string, unknown>>
): string {
  if (typeof input === "string") {
    return input.trim();
  }
  if (!Array.isArray(input)) {
    return "";
  }
  for (let i = input.length - 1; i >= 0; i--) {
    const item = input[i] as {
      role?: string;
      content?: unknown;
    };
    if (item?.role !== "user") continue;
    const c = item.content;
    if (typeof c === "string") {
      return c.trim();
    }
    if (Array.isArray(c)) {
      const parts: string[] = [];
      for (const part of c) {
        if (
          part &&
          typeof part === "object" &&
          "text" in part &&
          typeof (part as { text: unknown }).text === "string"
        ) {
          parts.push((part as { text: string }).text);
        }
      }
      const joined = parts.join(" ").trim();
      if (joined) return joined;
    }
  }
  return "";
}

let openAiBundleAgentsInputGuardrail: InputGuardrail | null = null;

/**
 * Single Agents SDK {@link InputGuardrail} that runs {@link DEFAULT_USER_INPUT_GUARDRAIL_BUNDLE}
 * via `runGuardrails`. Use this with `new Agent({ inputGuardrails: [...] })` from the **same**
 * `@openai/agents` import as `Runner` — do not use `GuardrailAgent.create()` in Next.js, which
 * can load a duplicate Agent class and break `hasExplicitToolConfig` at runtime.
 */
export function getOpenAiBundleAgentsInputGuardrail(): InputGuardrail {
  if (openAiBundleAgentsInputGuardrail) {
    return openAiBundleAgentsInputGuardrail;
  }
  openAiBundleAgentsInputGuardrail = {
    name: "pre_flight:openai_guardrails_bundle",
    runInParallel: false,
    execute: async (args) => {
      if (isUserInputGuardrailsDisabled() || !process.env.OPENAI_API_KEY) {
        return { tripwireTriggered: false, outputInfo: {} };
      }
      const text = extractTextForOpenAiGuardrails(
        args.input as string | Array<Record<string, unknown>>
      );
      if (!text) {
        return { tripwireTriggered: false, outputInfo: {} };
      }
      const runCtx = args.context.context as { guardrailLlm?: OpenAI };
      const guardContext = {
        guardrailLlm: runCtx.guardrailLlm ?? getOpenAiGuardrailsLlmClient(),
      };
      const results = await runGuardrails(
        text,
        DEFAULT_USER_INPUT_GUARDRAIL_BUNDLE,
        guardContext,
        true
      );
      const tripwireTriggered = guardrailsHasTripwire(results);
      return {
        tripwireTriggered,
        outputInfo: tripwireTriggered
          ? buildGuardrailFailOutput(results)
          : {},
      };
    },
  };
  return openAiBundleAgentsInputGuardrail;
}

function guardrailsHasTripwire(results: GuardrailResult[]): boolean {
  return (results ?? []).some((r) => r?.tripwireTriggered === true);
}

function getGuardrailSafeText(
  results: GuardrailResult[],
  fallbackText: string
): string {
  for (const r of results ?? []) {
    const info = r?.info;
    if (info && "checked_text" in info && typeof info.checked_text === "string") {
      return info.checked_text;
    }
  }
  const pii = (results ?? []).find(
    (r) => r?.info && "anonymized_text" in r.info
  );
  const anon = pii?.info?.anonymized_text;
  return typeof anon === "string" ? anon : fallbackText;
}

export type GuardrailFailSummary = {
  pii: {
    failed: boolean;
    detected_counts: string[];
  };
  moderation: {
    failed: boolean;
    flagged_categories: unknown;
  };
  jailbreak: { failed: boolean };
  hallucination: {
    failed: boolean;
    reasoning: unknown;
    hallucination_type: unknown;
    hallucinated_statements: unknown;
    verified_statements: unknown;
  };
  nsfw: { failed: boolean };
  url_filter: { failed: boolean };
  custom_prompt_check: { failed: boolean };
  prompt_injection: { failed: boolean };
};

function getGuardrailByName(
  results: GuardrailResult[],
  name: string
): GuardrailResult | undefined {
  return (results ?? []).find((r) => {
    const info = r?.info as Record<string, unknown> | undefined;
    const n = info?.guardrail_name ?? info?.guardrailName;
    return n === name;
  });
}

export function buildGuardrailFailOutput(
  results: GuardrailResult[]
): GuardrailFailSummary {
  const get = (name: string) => getGuardrailByName(results, name);
  const pii = get("Contains PII");
  const mod = get("Moderation");
  const jb = get("Jailbreak");
  const hal = get("Hallucination Detection");
  const nsfw = get("NSFW Text");
  const url = get("URL Filter");
  const custom = get("Custom Prompt Check");
  const pid = get("Prompt Injection Detection");

  const detected = pii?.info?.detected_entities;
  const piiCounts =
    detected && typeof detected === "object"
      ? Object.entries(detected as Record<string, unknown>)
          .filter(([, v]) => Array.isArray(v))
          .map(([k, v]) => `${k}:${(v as unknown[]).length}`)
      : [];

  return {
    pii: {
      failed:
        piiCounts.length > 0 || pii?.tripwireTriggered === true,
      detected_counts: piiCounts,
    },
    moderation: {
      failed:
        mod?.tripwireTriggered === true ||
        ((mod?.info?.flagged_categories as unknown[] | undefined)?.length ?? 0) >
          0,
      flagged_categories: mod?.info?.flagged_categories,
    },
    jailbreak: { failed: jb?.tripwireTriggered === true },
    hallucination: {
      failed: hal?.tripwireTriggered === true,
      reasoning: hal?.info?.reasoning,
      hallucination_type: hal?.info?.hallucination_type,
      hallucinated_statements: hal?.info?.hallucinated_statements,
      verified_statements: hal?.info?.verified_statements,
    },
    nsfw: { failed: nsfw?.tripwireTriggered === true },
    url_filter: { failed: url?.tripwireTriggered === true },
    custom_prompt_check: { failed: custom?.tripwireTriggered === true },
    prompt_injection: { failed: pid?.tripwireTriggered === true },
  };
}

export type UserInputGuardrailsResult = {
  tripwireTriggered: boolean;
  safeText: string;
  results: GuardrailResult[];
  failSummary: GuardrailFailSummary | null;
};

/**
 * Run configured guardrails on a single user-authored string.
 * When disabled via INPUT_GUARDRAILS_ENABLED=false, returns the original text.
 * When OPENAI_API_KEY is missing, passes through (callers fail later on LLM).
 */
export async function runUserInputGuardrails(
  text: string
): Promise<UserInputGuardrailsResult> {
  if (isUserInputGuardrailsDisabled()) {
    return {
      tripwireTriggered: false,
      safeText: text,
      results: [],
      failSummary: null,
    };
  }

  if (!process.env.OPENAI_API_KEY) {
    return {
      tripwireTriggered: false,
      safeText: text,
      results: [],
      failSummary: null,
    };
  }

  const context = { guardrailLlm: getOpenAiGuardrailsLlmClient() };
  const results = await runGuardrails(
    text,
    DEFAULT_USER_INPUT_GUARDRAIL_BUNDLE,
    context,
    true
  );

  const tripwireTriggered = guardrailsHasTripwire(results);
  const safeText = getGuardrailSafeText(results, text);
  const failSummary = tripwireTriggered
    ? buildGuardrailFailOutput(results)
    : null;

  return {
    tripwireTriggered,
    safeText,
    results,
    failSummary,
  };
}
