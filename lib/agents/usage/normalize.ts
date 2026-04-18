import type {
  OpenAIUsageRecordV1,
  TokenUsageRollup,
  UsageAttribution,
} from "./types";

const DEBUG_RAW_MAX_CHARS = 4096;

export function newUsageId(): string {
  return crypto.randomUUID();
}

function capDebugRaw(raw: unknown): unknown {
  try {
    const s = JSON.stringify(raw);
    if (s.length <= DEBUG_RAW_MAX_CHARS) return raw;
    return { truncated: true, preview: s.slice(0, DEBUG_RAW_MAX_CHARS) };
  } catch {
    return { truncated: true, preview: String(raw).slice(0, DEBUG_RAW_MAX_CHARS) };
  }
}

function numDetails(
  details: Record<string, number> | undefined,
  key: string
): number | undefined {
  if (!details || typeof details !== "object") return undefined;
  const v = details[key];
  return typeof v === "number" && !Number.isNaN(v) ? v : undefined;
}

function baseRecord(
  attribution: UsageAttribution,
  partial: Omit<
    OpenAIUsageRecordV1,
    | "v"
    | "usageId"
    | "runId"
    | "nodeId"
    | "stepIndex"
    | "phase"
    | "modelRequested"
    | "invocationId"
    | "attemptIndex"
  >
): OpenAIUsageRecordV1 {
  return {
    v: 1,
    usageId: newUsageId(),
    runId: attribution.runId,
    nodeId: attribution.nodeId,
    stepIndex: attribution.stepIndex,
    phase: attribution.phase,
    modelRequested: attribution.modelRequested,
    invocationId: attribution.invocationId,
    attemptIndex: attribution.attemptIndex,
    ...partial,
  };
}

/** Chat Completions API JSON body (already parsed). */
export function fromChatCompletionResponse(
  body: unknown,
  attribution: UsageAttribution,
  options?: { streamed?: boolean }
): OpenAIUsageRecordV1 {
  const streamed = options?.streamed ?? false;
  const row = body as Record<string, unknown>;
  const usage = row.usage as Record<string, unknown> | undefined;
  const prompt = typeof usage?.prompt_tokens === "number" ? usage.prompt_tokens : 0;
  const completion =
    typeof usage?.completion_tokens === "number" ? usage.completion_tokens : 0;
  const total =
    typeof usage?.total_tokens === "number"
      ? usage.total_tokens
      : prompt + completion;

  const promptDetails = usage?.prompt_tokens_details as
    | Record<string, number>
    | undefined;
  const cached =
    numDetails(promptDetails, "cached_tokens") ??
    (typeof promptDetails?.cached_tokens === "number"
      ? promptDetails.cached_tokens
      : undefined);

  const completionDetails = usage?.completion_tokens_details as
    | Record<string, number>
    | undefined;
  const reasoning = numDetails(completionDetails, "reasoning_tokens");

  const openaiResponseId = typeof row.id === "string" ? row.id : undefined;

  return baseRecord(attribution, {
    apiKind: "chat_completions",
    streamed,
    usageComplete: true,
    modelReported: typeof row.model === "string" ? row.model : undefined,
    inputTokens: prompt,
    outputTokens: completion,
    totalTokens: total,
    cachedInputTokens: cached,
    reasoningOutputTokens: reasoning,
    openaiResponseId,
    debug: { vendorUsageRaw: capDebugRaw(usage) },
  });
}

/** Responses API final usage object + optional response id */
export function fromResponsesFinal(
  usage: unknown,
  attribution: UsageAttribution,
  options: { streamed: boolean; responseId?: string; usageComplete: boolean }
): OpenAIUsageRecordV1 {
  const u = usage as Record<string, unknown> | null | undefined;
  const input =
    typeof u?.input_tokens === "number" ? u.input_tokens : 0;
  const output =
    typeof u?.output_tokens === "number" ? u.output_tokens : 0;
  const total =
    typeof u?.total_tokens === "number" ? u.total_tokens : input + output;

  const inputDetails = u?.input_tokens_details as Record<string, number> | undefined;
  const cached =
    numDetails(inputDetails, "cached_tokens") ??
    (typeof inputDetails?.cached_tokens === "number"
      ? inputDetails.cached_tokens
      : undefined);

  const outputDetails = u?.output_tokens_details as Record<string, number> | undefined;
  const reasoning =
    numDetails(outputDetails, "reasoning_tokens") ??
    (typeof outputDetails?.reasoning_tokens === "number"
      ? outputDetails.reasoning_tokens
      : undefined);

  return baseRecord(attribution, {
    apiKind: "responses",
    streamed: options.streamed,
    usageComplete: options.usageComplete,
    inputTokens: input,
    outputTokens: output,
    totalTokens: total,
    cachedInputTokens: cached,
    reasoningOutputTokens: reasoning,
    openaiResponseId: options.responseId,
    debug: u && options.usageComplete ? { vendorUsageRaw: capDebugRaw(u) } : undefined,
  });
}

type RequestUsageLike = {
  inputTokens: number;
  outputTokens: number;
  totalTokens: number;
  inputTokensDetails: Record<string, number>;
  outputTokensDetails: Record<string, number>;
  endpoint?: string;
};

type AgentsRunResultLike = {
  state: {
    usage: {
      inputTokens: number;
      outputTokens: number;
      totalTokens: number;
      requestUsageEntries?: RequestUsageLike[] | undefined;
    };
  };
  rawResponses: Array<{ responseId?: string }>;
};

export function fromAgentsRunnerResult(
  result: AgentsRunResultLike,
  attribution: UsageAttribution,
  options?: { streamed?: boolean }
): OpenAIUsageRecordV1[] {
  const streamed = options?.streamed ?? false;
  const usage = result.state.usage;
  const entries = usage.requestUsageEntries;
  const raw = result.rawResponses ?? [];
  const notes: string[] = [];

  if (entries && entries.length > 0) {
    const alignIds = raw.length === entries.length;
    if (!alignIds && raw.length > 0) {
      notes.push("rawResponses_length_mismatch");
    }

    return entries.map((entry, i) => {
      const cached = numDetails(entry.inputTokensDetails, "cached_tokens");
      const reasoning = numDetails(entry.outputTokensDetails, "reasoning_tokens");

      return baseRecord(attribution, {
        apiKind: "agents_sdk",
        streamed,
        usageComplete: true,
        inputTokens: entry.inputTokens,
        outputTokens: entry.outputTokens,
        totalTokens: entry.totalTokens,
        cachedInputTokens: cached,
        reasoningOutputTokens: reasoning,
        openaiResponseId: alignIds ? raw[i]?.responseId : undefined,
        sdkRequestIndex: i,
        endpoint: entry.endpoint,
        debug: notes.length > 0 ? { notes: [...notes] } : undefined,
      });
    });
  }

  notes.push("synthetic_aggregate");

  return [
    baseRecord(attribution, {
      apiKind: "agents_sdk",
      streamed,
      usageComplete: true,
      inputTokens: usage.inputTokens,
      outputTokens: usage.outputTokens,
      totalTokens: usage.totalTokens,
      debug: { notes },
    }),
  ];
}

export function rollupRecords(records: OpenAIUsageRecordV1[]): TokenUsageRollup {
  let prompt = 0;
  let completion = 0;
  let cachedInput = 0;
  for (const r of records) {
    prompt += r.inputTokens;
    completion += r.outputTokens;
    if (typeof r.cachedInputTokens === "number") {
      cachedInput += r.cachedInputTokens;
    }
  }
  return {
    prompt,
    completion,
    total: prompt + completion,
    cachedInput: cachedInput > 0 ? cachedInput : undefined,
  };
}

export interface OpenAIUsageSummaryV1 {
  v: 1;
  totalInput: number;
  totalOutput: number;
  totalTokens: number;
  totalCachedInput: number;
  byModel: Record<string, { input: number; output: number; total: number }>;
}

export function summarizeUsageRecords(
  records: OpenAIUsageRecordV1[]
): OpenAIUsageSummaryV1 {
  const byModel: Record<string, { input: number; output: number; total: number }> =
    {};
  let totalInput = 0;
  let totalOutput = 0;
  let totalCachedInput = 0;
  for (const r of records) {
    totalInput += r.inputTokens;
    totalOutput += r.outputTokens;
    totalCachedInput += r.cachedInputTokens ?? 0;
    const m = r.modelReported ?? r.modelRequested ?? "unknown";
    if (!byModel[m]) {
      byModel[m] = { input: 0, output: 0, total: 0 };
    }
    byModel[m].input += r.inputTokens;
    byModel[m].output += r.outputTokens;
    byModel[m].total += r.totalTokens;
  }
  return {
    v: 1,
    totalInput,
    totalOutput,
    totalTokens: totalInput + totalOutput,
    totalCachedInput,
    byModel,
  };
}
