import { describe, expect, it, vi, beforeEach, afterEach } from "vitest";
import {
  SSE_SCHEMA_VERSION,
  sseEnvelopeSchema,
  readyPayloadSchema,
  donePayloadSchema,
  errorPayloadSchema,
  messagePayloadSchema,
  deltaPayloadSchema,
  proposalCreatedPayloadSchema,
  proposalStatusUpdatedPayloadSchema,
} from "@/lib/agents/streaming/types";
import { createStreamSink, noopSink } from "@/lib/agents/streaming/sink";
import { createSseResponse } from "@/lib/agents/streaming/sse-response";

// ---------------------------------------------------------------------------
// Zod schemas
// ---------------------------------------------------------------------------

describe("SSE envelope schema validation", () => {
  it("accepts a valid ready envelope", () => {
    const envelope = {
      v: 1,
      type: "ready",
      runId: "arun_1",
      sessionId: null,
      sequence: 0,
      payload: { runId: "arun_1" },
    };
    expect(sseEnvelopeSchema.parse(envelope)).toEqual(envelope);
  });

  it("accepts a valid done envelope", () => {
    const envelope = {
      v: 1,
      type: "done",
      runId: "arun_1",
      sessionId: "sess_1",
      sequence: 5,
      payload: {
        runId: "arun_1",
        sessionId: "sess_1",
        finalOutput: '{"events":[]}',
      },
    };
    expect(sseEnvelopeSchema.parse(envelope)).toEqual(envelope);
  });

  it("rejects missing runId", () => {
    const envelope = {
      v: 1,
      type: "ready",
      sessionId: null,
      sequence: 0,
      payload: {},
    };
    expect(() => sseEnvelopeSchema.parse(envelope)).toThrow();
  });

  it("accepts a valid delta envelope", () => {
    const envelope = {
      v: 1,
      type: "delta",
      runId: "arun_1",
      sessionId: "sess_1",
      sequence: 3,
      payload: {
        runId: "arun_1",
        nodeId: "n1",
        lane: "main",
        text: "Hello",
        sequence: 0,
      },
    };
    expect(sseEnvelopeSchema.parse(envelope)).toEqual(envelope);
  });

  it("rejects unknown event type", () => {
    const envelope = {
      v: 1,
      type: "banana",
      runId: "arun_1",
      sessionId: null,
      sequence: 0,
      payload: {},
    };
    expect(() => sseEnvelopeSchema.parse(envelope)).toThrow();
  });
});

describe("payload schemas", () => {
  it("validates ready payload", () => {
    expect(readyPayloadSchema.parse({ runId: "arun_1" })).toEqual({
      runId: "arun_1",
    });
  });

  it("validates message payload with display", () => {
    const payload = {
      nodeId: "n1",
      content: "Hello",
      lane: "main",
      display: {
        nodeId: "n1",
        name: "Assistant",
        color: null,
        side: "left" as const,
      },
    };
    expect(messagePayloadSchema.parse(payload)).toEqual(payload);
  });

  it("validates done payload", () => {
    const payload = {
      runId: "arun_1",
      sessionId: null,
      finalOutput: "output",
    };
    expect(donePayloadSchema.parse(payload)).toEqual(payload);
  });

  it("validates delta payload", () => {
    const payload = {
      runId: "arun_1",
      nodeId: "n1",
      lane: "main" as const,
      text: "chunk",
      sequence: 0,
      display: {
        nodeId: "n1",
        name: "Assistant",
        color: null,
        side: "left" as const,
      },
    };
    expect(deltaPayloadSchema.parse(payload)).toEqual(payload);
  });

  it("validates delta payload without optional fields", () => {
    const payload = {
      runId: "arun_1",
      nodeId: "n1",
      text: "word",
      sequence: 5,
    };
    expect(deltaPayloadSchema.parse(payload)).toEqual(payload);
  });

  it("validates error payload", () => {
    expect(errorPayloadSchema.parse({ message: "boom" })).toEqual({
      message: "boom",
    });
    expect(
      errorPayloadSchema.parse({ code: "TIMEOUT", message: "timed out" })
    ).toEqual({ code: "TIMEOUT", message: "timed out" });
  });

  it("validates proposal lifecycle payloads", () => {
    const created = {
      runId: "arun_1",
      proposalId: "artf_1",
      artifactId: "artf_1",
      fileId: "pf_1",
      path: "features/a.feature.md",
      kind: "proposal",
      op: "append_under_heading",
      content: "## New\n",
      heading: null,
      sectionPath: ["Outcomes"],
      status: "created" as const,
      baseRevision: 3,
      summary: "Add outcomes",
    };
    const updated = {
      runId: "arun_1",
      proposalId: "artf_1",
      artifactId: "artf_1",
      status: "applied" as const,
    };
    expect(proposalCreatedPayloadSchema.parse(created)).toEqual(created);
    expect(proposalStatusUpdatedPayloadSchema.parse(updated)).toEqual(updated);
  });
});

// ---------------------------------------------------------------------------
// createStreamSink — framing + ordering
// ---------------------------------------------------------------------------

describe("createStreamSink", () => {
  beforeEach(() => {
    vi.useFakeTimers();
  });
  afterEach(() => {
    vi.useRealTimers();
  });

  it("produces valid SSE frames with monotonic sequence numbers", async () => {
    const { sink, stream } = createStreamSink("arun_test", "sess_1", {
      heartbeatIntervalMs: 60_000,
    });

    sink.emit("ready", { runId: "arun_test" });
    sink.emit("message", { nodeId: "n1", content: "Hi" });
    sink.emit("done", {
      runId: "arun_test",
      sessionId: "sess_1",
      finalOutput: null,
    });
    sink.close();

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let raw = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }

    const frames = raw.split("\n\n").filter((f) => f.trim().length > 0);
    const envelopes = frames
      .map((f) => {
        const dataLine = f.split("\n").find((l) => l.startsWith("data: "));
        return dataLine ? JSON.parse(dataLine.slice(6)) : null;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);
    expect(frames.some((f) => f.startsWith(": connected"))).toBe(true);
    expect(envelopes).toHaveLength(3);

    expect(envelopes[0].type).toBe("ready");
    expect(envelopes[0].sequence).toBe(0);
    expect(envelopes[0].v).toBe(SSE_SCHEMA_VERSION);

    expect(envelopes[1].type).toBe("message");
    expect(envelopes[1].sequence).toBe(1);

    expect(envelopes[2].type).toBe("done");
    expect(envelopes[2].sequence).toBe(2);

    // All envelopes share runId and sessionId
    for (const e of envelopes) {
      expect(e.runId).toBe("arun_test");
      expect(e.sessionId).toBe("sess_1");
    }
  });

  it("produces valid delta SSE frames", async () => {
    const { sink, stream } = createStreamSink("arun_test", "sess_1", {
      heartbeatIntervalMs: 60_000,
    });

    sink.emit("delta", {
      runId: "arun_test",
      nodeId: "n1",
      lane: "main",
      text: "He",
      sequence: 0,
    });
    sink.emit("delta", {
      runId: "arun_test",
      nodeId: "n1",
      lane: "main",
      text: "llo",
      sequence: 1,
    });
    sink.close();

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let raw = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }

    const frames = raw.split("\n\n").filter((f) => f.trim().length > 0);
    const envelopes = frames
      .map((f) => {
        const dataLine = f.split("\n").find((l) => l.startsWith("data: "));
        return dataLine ? JSON.parse(dataLine.slice(6)) : null;
      })
      .filter((e): e is NonNullable<typeof e> => e !== null);
    expect(envelopes).toHaveLength(2);

    expect(envelopes[0].type).toBe("delta");
    expect(envelopes[0].payload.text).toBe("He");
    expect(envelopes[0].payload.sequence).toBe(0);
    expect(envelopes[0].sequence).toBe(0);

    expect(envelopes[1].type).toBe("delta");
    expect(envelopes[1].payload.text).toBe("llo");
    expect(envelopes[1].payload.sequence).toBe(1);
    expect(envelopes[1].sequence).toBe(1);
  });

  it("includes event: field matching type", async () => {
    const { sink, stream } = createStreamSink("r", null, {
      heartbeatIntervalMs: 60_000,
    });
    sink.emit("error", { message: "fail" });
    sink.close();

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let text = "";
    while (!text.includes("event: error")) {
      const { value, done } = await reader.read();
      if (done) break;
      text += decoder.decode(value, { stream: true });
    }

    expect(text).toContain(": connected");
    expect(text).toContain("event: error");
    expect(text).toContain('"type":"error"');
  });

  it("emits heartbeat comments on interval", async () => {
    const { sink, stream } = createStreamSink("r", null, {
      heartbeatIntervalMs: 100,
    });

    // Advance past two heartbeat intervals
    vi.advanceTimersByTime(250);
    sink.close();

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let raw = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }

    const pings = raw.split("\n").filter((l) => l === ": ping");
    expect(pings.length).toBeGreaterThanOrEqual(2);
  });

  it("swallows writes after close", () => {
    const { sink } = createStreamSink("r", null, {
      heartbeatIntervalMs: 60_000,
    });
    sink.close();
    // Should not throw
    sink.emit("ready", { runId: "r" });
    sink.close(); // double-close
  });

  it("updates run context for later envelopes", async () => {
    const { sink, stream } = createStreamSink("", null, {
      heartbeatIntervalMs: 60_000,
    });
    sink.setContext?.({ runId: "arun_ctx", sessionId: "sess_ctx" });
    sink.emit("ready", { runId: "arun_ctx" });
    sink.close();

    const reader = stream.getReader();
    const decoder = new TextDecoder();
    let raw = "";
    while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      raw += decoder.decode(value, { stream: true });
    }

    const dataLine = raw
      .split("\n")
      .find((line) => line.startsWith("data: "));
    expect(dataLine).toBeTruthy();
    const envelope = JSON.parse((dataLine ?? "").slice(6));
    expect(envelope.runId).toBe("arun_ctx");
    expect(envelope.sessionId).toBe("sess_ctx");
  });
});

// ---------------------------------------------------------------------------
// noopSink
// ---------------------------------------------------------------------------

describe("noopSink", () => {
  it("emit and close are callable without side effects", () => {
    noopSink.emit("ready", { runId: "x" });
    noopSink.emit("error", { message: "boom" });
    noopSink.close();
  });
});

// ---------------------------------------------------------------------------
// createSseResponse
// ---------------------------------------------------------------------------

describe("createSseResponse", () => {
  it("sets correct headers", () => {
    const stream = new ReadableStream();
    const response = createSseResponse(stream);

    expect(response.headers.get("content-type")).toBe("text/event-stream");
    expect(response.headers.get("cache-control")).toBe(
      "no-cache, no-transform"
    );
    expect(response.headers.get("connection")).toBe("keep-alive");
    expect(response.headers.get("x-accel-buffering")).toBe("no");
  });
});
