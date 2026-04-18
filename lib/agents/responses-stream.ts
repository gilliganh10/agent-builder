/**
 * OpenAI Responses API streaming for eligible single-shot LLM flow nodes.
 *
 * This module is intentionally separate from llm-provider.ts (which wraps
 * @openai/agents Runner for buffered multi-step execution). The execution
 * model stays split: buffered Runner.run() for most nodes; single-shot
 * Responses stream only where streamOutput and eligibility allow.
 *
 * Phase 1 constraints:
 * - No tool recursion or multi-step agent behavior.
 * - Plain text or very flat structured output only ({ message: string }).
 * - Complex/nested/union-heavy Zod schemas are not supported in streamed mode.
 */

import OpenAI from "openai";
import type { ConversationMessage } from "@/db/agents/schema";
import type { RunEventSink } from "@/lib/agents/streaming";
import {
  fromResponsesFinal,
  newUsageId,
  type OpenAIUsagePhase,
  type OpenAIUsageRecordV1,
} from "@/lib/agents/usage";

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface StreamedLLMParams {
  model: string;
  instructions: string;
  input: string | ConversationMessage[];
  runId: string;
  nodeId: string;
  lane: "main" | "sidecar";
  display?: {
    nodeId: string;
    name: string;
    color: string | null;
    side: "left" | "right";
  };
  signal?: AbortSignal;
  /** Defaults to `responses_stream` */
  usagePhase?: OpenAIUsagePhase;
  stepIndex?: number;
}

export interface StreamedLLMResult {
  finalOutput: string;
  usage: { prompt: number; completion: number; total: number } | null;
  usageRecords: OpenAIUsageRecordV1[];
}

/**
 * Extract concatenated output_text from `finalResponse().output`.
 * Uses structural checks so we do not depend on OpenAI SDK type predicates:
 * parsed final responses use ParsedResponseOutput* variants that are not
 * assignable to ResponseOutputMessage / ResponseOutputText.
 */
function textFromFinalResponseOutput(output: unknown): string {
  if (!Array.isArray(output)) return "";
  const parts: string[] = [];
  for (const item of output) {
    if (!item || typeof item !== "object") continue;
    const row = item as Record<string, unknown>;
    if (row.type !== "message" || !Array.isArray(row.content)) continue;
    for (const c of row.content) {
      if (!c || typeof c !== "object") continue;
      const chunk = c as Record<string, unknown>;
      if (chunk.type === "output_text" && typeof chunk.text === "string") {
        parts.push(chunk.text);
      }
    }
  }
  return parts.join("");
}

// ---------------------------------------------------------------------------
// Singleton client
// ---------------------------------------------------------------------------

let client: OpenAI | null = null;

function getClient(): OpenAI {
  if (!client) {
    const apiKey = process.env.OPENAI_API_KEY;
    if (!apiKey) {
      throw new Error("OPENAI_API_KEY environment variable is not set");
    }
    client = new OpenAI({ apiKey });
  }
  return client;
}

// ---------------------------------------------------------------------------
// Public API
// ---------------------------------------------------------------------------

/**
 * Execute a single-shot LLM call using OpenAI Responses API with streaming.
 * Emits delta events to the provided sink as tokens arrive, and returns the
 * full final output once the stream completes.
 */
export async function runStreamedResponse(
  params: StreamedLLMParams,
  sink: RunEventSink
): Promise<StreamedLLMResult> {
  const openai = getClient();
  let deltaSequence = 0;
  const usagePhase = params.usagePhase ?? "responses_stream";
  const invocationId = newUsageId();

  const inputMessages: OpenAI.Responses.ResponseInputItem[] = Array.isArray(
    params.input
  )
    ? params.input.map((m) => ({
        role: m.role === "user" ? ("user" as const) : ("assistant" as const),
        content: m.content,
      }))
    : [{ role: "user" as const, content: params.input }];

  sink.emit("progress", {
    nodeId: params.nodeId,
    status: "started",
  });

  let accumulated = "";

  try {
    const stream = openai.responses.stream({
      model: params.model,
      instructions: params.instructions,
      input: inputMessages,
    });

    if (params.signal) {
      const onAbort = () => {
        stream.abort();
      };
      if (params.signal.aborted) {
        stream.abort();
      } else {
        params.signal.addEventListener("abort", onAbort, { once: true });
      }
    }

    stream.on("response.output_text.delta", (event) => {
      accumulated += event.delta;
      sink.emit("delta", {
        runId: params.runId,
        nodeId: params.nodeId,
        lane: params.lane,
        text: event.delta,
        sequence: deltaSequence++,
        display: params.display,
      });
    });

    const finalResponse = await stream.finalResponse();

    // Phase 1 usage policy: attach final usage from finalResponse() when the
    // SDK exposes it. If unavailable, return null — do not block shipping or
    // silently invent zeros. Callers store undefined in NodeResult.tokenUsage.
    let usage: StreamedLLMResult["usage"] = null;
    let usageRecords: OpenAIUsageRecordV1[] = [];
    const responseId =
      typeof (finalResponse as { id?: string }).id === "string"
        ? (finalResponse as { id: string }).id
        : undefined;

    if (finalResponse.usage) {
      const u = finalResponse.usage;
      usage = {
        prompt: u.input_tokens,
        completion: u.output_tokens,
        total:
          typeof u.total_tokens === "number"
            ? u.total_tokens
            : u.input_tokens + u.output_tokens,
      };
      usageRecords = [
        fromResponsesFinal(
          u,
          {
            runId: params.runId,
            nodeId: params.nodeId,
            stepIndex: params.stepIndex,
            phase: usagePhase,
            modelRequested: params.model,
            invocationId,
          },
          {
            streamed: true,
            responseId,
            usageComplete: true,
          }
        ),
      ];
    }

    const finalText =
      accumulated || textFromFinalResponseOutput(finalResponse.output) || "";

    sink.emit("progress", {
      nodeId: params.nodeId,
      status: "completed",
    });

    return { finalOutput: finalText, usage, usageRecords };
  } catch (err) {
    sink.emit("progress", {
      nodeId: params.nodeId,
      status: "failed",
    });
    throw err;
  }
}
