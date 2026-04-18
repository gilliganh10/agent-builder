import type { SseEnvelope, SseEventType } from "./types";

export type { SseEnvelope, SseEventType };

// ---------------------------------------------------------------------------
// SSE client parser — fetch + ReadableStream for POST-based SSE
// ---------------------------------------------------------------------------

export interface StreamCallbacks {
  onEvent: (envelope: SseEnvelope) => void;
  onError?: (error: Error) => void;
  onClose?: () => void;
}

/**
 * POST to `url` with `body` and read the response as an SSE stream.
 * Falls back to standard JSON parsing if the response is `application/json`.
 *
 * Returns `{ json }` for JSON responses, or `{ streamed: true }` for SSE.
 */
export async function postAgentRunStream(
  url: string,
  body: Record<string, unknown>,
  callbacks: StreamCallbacks,
  options?: { signal?: AbortSignal }
): Promise<{ json?: unknown; streamed?: boolean }> {
  const res = await fetch(url, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify({ ...body, stream: true }),
    signal: options?.signal,
  });

  if (!res.ok) {
    const err = await res.json().catch(() => ({ error: res.statusText }));
    throw new Error(
      typeof err?.error === "string" ? err.error : JSON.stringify(err?.error ?? res.statusText)
    );
  }

  const contentType = res.headers.get("content-type") ?? "";

  if (contentType.includes("application/json")) {
    const json = await res.json();
    return { json };
  }

  if (!contentType.includes("text/event-stream") || !res.body) {
    const json = await res.json().catch(() => null);
    return { json };
  }

  await readSseStream(res.body, callbacks);
  return { streamed: true };
}

// ---------------------------------------------------------------------------
// Low-level SSE frame parser over a ReadableStream
// ---------------------------------------------------------------------------

async function readSseStream(
  body: ReadableStream<Uint8Array>,
  callbacks: StreamCallbacks
): Promise<void> {
  const decoder = new TextDecoder();
  const reader = body.getReader();
  let buffer = "";
  let terminated = false;

  try {
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;

      buffer += decoder.decode(value, { stream: true });

      // SSE frames are delimited by double newlines
      let boundary: number;
      while ((boundary = buffer.indexOf("\n\n")) !== -1) {
        const frame = buffer.slice(0, boundary);
        buffer = buffer.slice(boundary + 2);

        if (terminated) continue;

        const envelope = parseSseFrame(frame);
        if (!envelope) continue;

        callbacks.onEvent(envelope);

        if (envelope.type === "done" || envelope.type === "error") {
          terminated = true;
        }
      }
    }
  } catch (err) {
    if ((err as Error).name === "AbortError") return;
    callbacks.onError?.(err instanceof Error ? err : new Error(String(err)));
  } finally {
    callbacks.onClose?.();
  }
}

function parseSseFrame(frame: string): SseEnvelope | null {
  let dataLine: string | null = null;

  for (const line of frame.split("\n")) {
    if (line.startsWith("data: ")) {
      dataLine = line.slice(6);
    } else if (line.startsWith("data:")) {
      dataLine = line.slice(5);
    }
    // Skip `event:`, `:` comments, and other fields
  }

  if (!dataLine) return null;

  try {
    const parsed = JSON.parse(dataLine);
    if (typeof parsed === "object" && parsed !== null && "v" in parsed && "type" in parsed) {
      return parsed as SseEnvelope;
    }
  } catch {
    // Malformed JSON — skip frame
  }

  return null;
}

// ---------------------------------------------------------------------------
// Type guard helpers for consumers
// ---------------------------------------------------------------------------

export function isSseEventType<T extends SseEventType>(
  envelope: SseEnvelope,
  type: T
): envelope is SseEnvelope & { type: T } {
  return envelope.type === type;
}
