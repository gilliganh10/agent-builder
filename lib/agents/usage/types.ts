/**
 * OpenAI usage ledger v1 — one record per vendor-reported usage entry.
 * Core fields are accounting-only; vendor blobs live under debug.
 */

export const OPENAI_USAGE_LEDGER_META_KEY = "openaiUsageLedgerV1" as const;
export const OPENAI_USAGE_SUMMARY_META_KEY = "openaiUsageSummaryV1" as const;

export type OpenAIUsagePhase =
  | "agents_sdk"
  | "responses_stream"
  | "chat_completions"
  | "state_extraction"
  | "eval"
  | "single_agent_run";

export type OpenAIUsageApiKind = "agents_sdk" | "responses" | "chat_completions";

export interface OpenAIUsageDebugV1 {
  vendorUsageRaw?: unknown;
  notes?: string[];
}

export interface OpenAIUsageRecordV1 {
  v: 1;
  usageId: string;
  runId: string;
  nodeId?: string;
  stepIndex?: number;
  phase: OpenAIUsagePhase;
  apiKind: OpenAIUsageApiKind;
  streamed: boolean;
  usageComplete: boolean;
  modelRequested?: string;
  modelReported?: string;
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  cachedInputTokens?: number;
  reasoningOutputTokens?: number;
  openaiResponseId?: string;
  sdkRequestIndex?: number;
  endpoint?: string;
  invocationId?: string;
  attemptIndex?: number;
  debug?: OpenAIUsageDebugV1;
}

/** Context applied to every record from a normalization path */
export interface UsageAttribution {
  runId: string;
  nodeId?: string;
  stepIndex?: number;
  phase: OpenAIUsagePhase;
  modelRequested?: string;
  /** One id per wrapper invocation (e.g. single runAgent call); shared across N vendor entries */
  invocationId?: string;
  attemptIndex?: number;
}

export interface TokenUsageRollup {
  prompt: number;
  completion: number;
  total: number;
  cachedInput?: number;
}
