import type { TokenUsage } from "@/db/agents/schema";
import type { OpenAIUsageRecordV1 } from "@/lib/agents/usage";

// ---------------------------------------------------------------------------
// Cost estimation
// ---------------------------------------------------------------------------

type ModelPricing = {
  inputPer1M: number;
  outputPer1M: number;
};

const MODEL_PRICING: Record<string, ModelPricing> = {
  "gpt-4o": { inputPer1M: 2.5, outputPer1M: 10.0 },
  "gpt-4o-mini": { inputPer1M: 0.15, outputPer1M: 0.6 },
  "gpt-4.1": { inputPer1M: 2.0, outputPer1M: 8.0 },
  "gpt-4.1-mini": { inputPer1M: 0.4, outputPer1M: 1.6 },
  "gpt-4.1-nano": { inputPer1M: 0.1, outputPer1M: 0.4 },
  "gpt-5.4": { inputPer1M: 5.0, outputPer1M: 15.0 },
  "gpt-5.4-mini": { inputPer1M: 0.5, outputPer1M: 2.0 },
  "o3-mini": { inputPer1M: 1.1, outputPer1M: 4.4 },
};

/**
 * Estimate cost in USD for a given model and token usage.
 * Returns null for unknown models.
 */
export function estimateCost(
  model: string,
  usage: TokenUsage
): number | null {
  const pricing = MODEL_PRICING[model];
  if (!pricing) return null;

  const inputCost = (usage.prompt / 1_000_000) * pricing.inputPer1M;
  const outputCost = (usage.completion / 1_000_000) * pricing.outputPer1M;
  return Math.round((inputCost + outputCost) * 1_000_000) / 1_000_000;
}

/** Sum per-record estimates when model is known on each record */
export function estimateCostFromUsageRecords(
  records: OpenAIUsageRecordV1[]
): number | null {
  let sum = 0;
  let any = false;
  for (const r of records) {
    const model = r.modelReported ?? r.modelRequested;
    if (!model) continue;
    const c = estimateCost(model, {
      prompt: r.inputTokens,
      completion: r.outputTokens,
      total: r.totalTokens,
    });
    if (c != null) {
      sum += c;
      any = true;
    }
  }
  return any ? sum : null;
}

// ---------------------------------------------------------------------------
// Duration tracking
// ---------------------------------------------------------------------------

export function createTimer(): { elapsed: () => number } {
  const start = Date.now();
  return {
    elapsed: () => Date.now() - start,
  };
}
