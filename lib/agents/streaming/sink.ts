import type {
  SseEnvelope,
  SseEventType,
  ReadyPayload,
  MessagePayload,
  DeltaPayload,
  StagePayload,
  ProgressPayload,
  RunStepPayload,
  ProposalCreatedPayload,
  ProposalStatusUpdatedPayload,
  DonePayload,
  ErrorPayload,
} from "./types";
import { SSE_SCHEMA_VERSION } from "./types";

/**
 * Default ReadableStream count queue is highWaterMark=1. A second `enqueue`
 * before the client reads throws; we were catching and dropping events, so
 * only the first SSE frame could be delivered (or bursts silently lost).
 */
const SSE_STREAM_HIGH_WATER_MARK = 256;

// ---------------------------------------------------------------------------
// RunEventSink — executor-level callback for streaming events
// ---------------------------------------------------------------------------

type PayloadForType<T extends SseEventType> = T extends "ready"
  ? ReadyPayload
  : T extends "message"
    ? MessagePayload
    : T extends "delta"
      ? DeltaPayload
      : T extends "stage"
        ? StagePayload
        : T extends "progress"
          ? ProgressPayload
          : T extends "run_step"
            ? RunStepPayload
            : T extends "proposal_created"
              ? ProposalCreatedPayload
              : T extends "proposal_status_updated"
                ? ProposalStatusUpdatedPayload
            : T extends "done"
              ? DonePayload
              : T extends "error"
                ? ErrorPayload
                : unknown;

export interface RunEventSink {
  emit<T extends SseEventType>(type: T, payload: PayloadForType<T>): void;
  setContext?(context: { runId?: string; sessionId?: string | null }): void;
  close(): void;
}

// ---------------------------------------------------------------------------
// Factory: creates a sink backed by a ReadableStream controller
// ---------------------------------------------------------------------------

export interface SinkHandle {
  sink: RunEventSink;
  stream: ReadableStream<Uint8Array>;
  /**
   * Aborts when the client stops reading the SSE body (disconnect, tab close).
   * Do **not** pass `Request`’s signal here for long-running work: in some
   * runtimes it can fire as soon as the streaming `Response` is returned,
   * cancelling OpenAI streams before any tokens are emitted.
   */
  clientAbortSignal: AbortSignal;
}

export function createStreamSink(
  runId: string,
  sessionId: string | null,
  options?: { heartbeatIntervalMs?: number }
): SinkHandle {
  const encoder = new TextEncoder();
  let sequence = 0;
  let currentRunId = runId;
  let currentSessionId = sessionId;
  let heartbeatTimer: ReturnType<typeof setInterval> | undefined;
  const clientAbort = new AbortController();

  let controller: ReadableStreamDefaultController<Uint8Array> | undefined;
  let closed = false;

  const stream = new ReadableStream<Uint8Array>(
    {
      start(ctrl) {
        controller = ctrl;
        // Flush first bytes immediately so proxies/clients see a live stream
        // before DB + run setup (and so backpressure does not block later frames).
        try {
          ctrl.enqueue(encoder.encode(": connected\n\n"));
        } catch {
          // stream torn down before attach
        }
        const intervalMs = options?.heartbeatIntervalMs ?? 15_000;
        heartbeatTimer = setInterval(() => {
          if (!closed && controller) {
            try {
              controller.enqueue(encoder.encode(": ping\n\n"));
            } catch {
              // stream may have been closed by client disconnect
            }
          }
        }, intervalMs);
      },
      cancel() {
        closed = true;
        if (heartbeatTimer) clearInterval(heartbeatTimer);
        clientAbort.abort();
      },
    },
    new CountQueuingStrategy({ highWaterMark: SSE_STREAM_HIGH_WATER_MARK })
  );

  function enqueue(envelope: SseEnvelope): void {
    if (closed || !controller) return;
    const line = `event: ${envelope.type}\ndata: ${JSON.stringify(envelope)}\n\n`;
    try {
      controller.enqueue(encoder.encode(line));
    } catch {
      // client disconnected
    }
  }

  const sink: RunEventSink = {
    emit(type, payload) {
      if (closed) return;
      const envelope: SseEnvelope = {
        v: SSE_SCHEMA_VERSION,
        type,
        runId: currentRunId,
        sessionId: currentSessionId,
        sequence: sequence++,
        payload,
      };
      enqueue(envelope);
    },
    setContext(context) {
      if (context.runId !== undefined) currentRunId = context.runId;
      if (context.sessionId !== undefined) currentSessionId = context.sessionId;
    },

    close() {
      if (closed) return;
      closed = true;
      if (heartbeatTimer) clearInterval(heartbeatTimer);
      try {
        controller?.close();
      } catch {
        // already closed
      }
    },
  };

  return { sink, stream, clientAbortSignal: clientAbort.signal };
}

// ---------------------------------------------------------------------------
// Noop sink — used when streaming is not requested (JSON path)
// ---------------------------------------------------------------------------

export const noopSink: RunEventSink = {
  emit() {},
  close() {},
};
