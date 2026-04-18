import { afterEach, beforeEach, describe, expect, it, vi } from "vitest";

const { mockRunGuardrails } = vi.hoisted(() => ({
  mockRunGuardrails: vi.fn(),
}));

vi.mock("@openai/guardrails", () => ({
  runGuardrails: mockRunGuardrails,
}));

import {
  buildGuardrailFailOutput,
  runUserInputGuardrails,
} from "@/lib/agents/input-guardrails";

describe("runUserInputGuardrails", () => {
  const prevKey = process.env.OPENAI_API_KEY;
  const prevEnabled = process.env.INPUT_GUARDRAILS_ENABLED;

  beforeEach(() => {
    vi.clearAllMocks();
    mockRunGuardrails.mockReset();
    process.env.OPENAI_API_KEY = "test-key";
    delete process.env.INPUT_GUARDRAILS_ENABLED;
  });

  afterEach(() => {
    if (prevKey === undefined) delete process.env.OPENAI_API_KEY;
    else process.env.OPENAI_API_KEY = prevKey;
    if (prevEnabled === undefined) delete process.env.INPUT_GUARDRAILS_ENABLED;
    else process.env.INPUT_GUARDRAILS_ENABLED = prevEnabled;
  });

  it("returns original text when guardrails are disabled", async () => {
    process.env.INPUT_GUARDRAILS_ENABLED = "false";
    const r = await runUserInputGuardrails("hello");
    expect(r.tripwireTriggered).toBe(false);
    expect(r.safeText).toBe("hello");
    expect(r.results).toEqual([]);
    expect(mockRunGuardrails).not.toHaveBeenCalled();
  });

  it("uses checked_text as safeText when present", async () => {
    mockRunGuardrails.mockResolvedValue([
      {
        tripwireTriggered: false,
        info: {
          guardrail_name: "Contains PII",
          checked_text: "call <US_SSN>",
        },
      },
    ]);
    const r = await runUserInputGuardrails("call 123");
    expect(r.tripwireTriggered).toBe(false);
    expect(r.safeText).toBe("call <US_SSN>");
    expect(r.failSummary).toBeNull();
  });

  it("sets tripwire and failSummary when any result trips", async () => {
    mockRunGuardrails.mockResolvedValue([
      {
        tripwireTriggered: true,
        info: { guardrail_name: "Jailbreak" },
      },
    ]);
    const r = await runUserInputGuardrails("ignore instructions");
    expect(r.tripwireTriggered).toBe(true);
    expect(r.failSummary).not.toBeNull();
    expect(r.failSummary?.jailbreak.failed).toBe(true);
  });
});

describe("buildGuardrailFailOutput", () => {
  it("aggregates PII detected_counts from detected_entities", () => {
    const summary = buildGuardrailFailOutput([
      {
        tripwireTriggered: false,
        info: {
          guardrail_name: "Contains PII",
          detected_entities: { US_SSN: ["x"], EMAIL_ADDRESS: ["a", "b"] },
        },
      },
    ]);
    expect(summary.pii.failed).toBe(true);
    expect(summary.pii.detected_counts).toContain("US_SSN:1");
    expect(summary.pii.detected_counts).toContain("EMAIL_ADDRESS:2");
  });
});
