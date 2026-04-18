import { describe, expect, it } from "vitest";
import {
  fromAgentsRunnerResult,
  fromChatCompletionResponse,
  fromResponsesFinal,
  rollupRecords,
  summarizeUsageRecords,
} from "@/lib/agents/usage";

const attr = {
  runId: "run_1",
  nodeId: "n1",
  stepIndex: 0,
  phase: "chat_completions" as const,
  modelRequested: "gpt-4.1-nano",
  invocationId: "inv_1",
};

describe("fromChatCompletionResponse", () => {
  it("maps usage and cached tokens", () => {
    const body = {
      id: "chatcmpl-abc",
      model: "gpt-4.1-nano",
      usage: {
        prompt_tokens: 10,
        completion_tokens: 5,
        total_tokens: 15,
        prompt_tokens_details: { cached_tokens: 3 },
      },
    };
    const r = fromChatCompletionResponse(body, attr);
    expect(r.v).toBe(1);
    expect(r.inputTokens).toBe(10);
    expect(r.outputTokens).toBe(5);
    expect(r.totalTokens).toBe(15);
    expect(r.cachedInputTokens).toBe(3);
    expect(r.openaiResponseId).toBe("chatcmpl-abc");
    expect(r.modelReported).toBe("gpt-4.1-nano");
    expect(r.apiKind).toBe("chat_completions");
    expect(r.usageComplete).toBe(true);
  });
});

describe("fromResponsesFinal", () => {
  it("maps Responses usage shape", () => {
    const usage = {
      input_tokens: 20,
      output_tokens: 8,
      total_tokens: 28,
      input_tokens_details: { cached_tokens: 12 },
      output_tokens_details: { reasoning_tokens: 2 },
    };
    const r = fromResponsesFinal(usage, { ...attr, phase: "responses_stream" }, {
      streamed: true,
      responseId: "resp_123",
      usageComplete: true,
    });
    expect(r.apiKind).toBe("responses");
    expect(r.streamed).toBe(true);
    expect(r.cachedInputTokens).toBe(12);
    expect(r.reasoningOutputTokens).toBe(2);
    expect(r.openaiResponseId).toBe("resp_123");
  });
});

describe("fromAgentsRunnerResult", () => {
  it("emits one record per requestUsageEntries", () => {
    const result: Parameters<typeof fromAgentsRunnerResult>[0] = {
      state: {
        usage: {
          inputTokens: 30,
          outputTokens: 10,
          totalTokens: 40,
          requestUsageEntries: [
            {
              inputTokens: 10,
              outputTokens: 3,
              totalTokens: 13,
              inputTokensDetails: { cached_tokens: 1 },
              outputTokensDetails: {},
              endpoint: "responses.create",
            },
            {
              inputTokens: 20,
              outputTokens: 7,
              totalTokens: 27,
              inputTokensDetails: {},
              outputTokensDetails: { reasoning_tokens: 4 },
              endpoint: "responses.create",
            },
          ],
        },
      },
      rawResponses: [{ responseId: "r1" }, { responseId: "r2" }],
    };
    const records = fromAgentsRunnerResult(result, {
      ...attr,
      phase: "agents_sdk",
    });
    expect(records).toHaveLength(2);
    expect(records[0]!.openaiResponseId).toBe("r1");
    expect(records[1]!.openaiResponseId).toBe("r2");
    expect(records[0]!.sdkRequestIndex).toBe(0);
    expect(records[1]!.sdkRequestIndex).toBe(1);
    expect(records[0]!.cachedInputTokens).toBe(1);
    expect(records[1]!.reasoningOutputTokens).toBe(4);
  });

  it("notes mismatch when rawResponses length differs", () => {
    const result = {
      state: {
        usage: {
          inputTokens: 10,
          outputTokens: 5,
          totalTokens: 15,
          requestUsageEntries: [
            {
              inputTokens: 10,
              outputTokens: 5,
              totalTokens: 15,
              inputTokensDetails: {},
              outputTokensDetails: {},
            },
          ],
        },
      },
      rawResponses: [{ responseId: "only" }, { responseId: "extra" }],
    };
    const records = fromAgentsRunnerResult(result, {
      ...attr,
      phase: "agents_sdk",
    });
    expect(records).toHaveLength(1);
    expect(records[0]!.openaiResponseId).toBeUndefined();
    expect(records[0]!.debug?.notes).toContain("rawResponses_length_mismatch");
  });

  it("synthetic aggregate when entries missing", () => {
    const result = {
      state: {
        usage: {
          inputTokens: 100,
          outputTokens: 50,
          totalTokens: 150,
          requestUsageEntries: undefined,
        },
      },
      rawResponses: [],
    };
    const records = fromAgentsRunnerResult(result, {
      ...attr,
      phase: "agents_sdk",
    });
    expect(records).toHaveLength(1);
    expect(records[0]!.inputTokens).toBe(100);
    expect(records[0]!.debug?.notes).toContain("synthetic_aggregate");
  });
});

describe("rollupRecords and summarizeUsageRecords", () => {
  it("rolls up prompt/completion/total and cached", () => {
    const records = [
      fromChatCompletionResponse(
        {
          usage: {
            prompt_tokens: 1,
            completion_tokens: 2,
            total_tokens: 3,
            prompt_tokens_details: { cached_tokens: 1 },
          },
        },
        attr
      ),
      fromChatCompletionResponse(
        {
          usage: { prompt_tokens: 4, completion_tokens: 5, total_tokens: 9 },
        },
        attr
      ),
    ];
    const roll = rollupRecords(records);
    expect(roll.prompt).toBe(5);
    expect(roll.completion).toBe(7);
    expect(roll.total).toBe(12);
    expect(roll.cachedInput).toBe(1);

    const sum = summarizeUsageRecords(records);
    expect(sum.totalInput).toBe(5);
    expect(sum.totalOutput).toBe(7);
    expect(sum.totalCachedInput).toBe(1);
  });
});
