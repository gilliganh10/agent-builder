import { describe, expect, it } from "vitest";
import {
  buildConversationStatePayload,
  getPublicChatSettings,
  mergePublicChatSettings,
} from "@/lib/agents/public-chat";
import {
  formatStateValue,
  getChangedStateKeys,
  getGoalStatusTone,
} from "@/components/chat/conversation-state-utils";

describe("public chat settings", () => {
  it("defaults the public chat sidebar to disabled", () => {
    expect(getPublicChatSettings(undefined)).toEqual({ showStateSidebar: false });
    expect(getPublicChatSettings({})).toEqual({ showStateSidebar: false });
  });

  it("merges sidebar settings without losing other metadata", () => {
    const merged = mergePublicChatSettings(
      {
        modelPolicy: "default",
        publicChat: { showStateSidebar: false, otherFlag: "kept" },
      },
      { showStateSidebar: true }
    );

    expect(merged).toEqual({
      modelPolicy: "default",
      publicChat: {
        showStateSidebar: true,
        otherFlag: "kept",
      },
    });
  });

  it("builds a state payload with vars, goals, and locks", () => {
    expect(
      buildConversationStatePayload({
        vars: { learningOpportunityStatus: "surfaced" },
        goals: [{ id: "g1", description: "Track status", status: "active" }],
        locks: ["learningOpportunityStatus"],
      })
    ).toEqual({
      state: { learningOpportunityStatus: "surfaced" },
      goals: [{ id: "g1", description: "Track status", status: "active" }],
      locks: ["learningOpportunityStatus"],
    });
  });
});

describe("conversation state utils", () => {
  it("detects changed fields between snapshots", () => {
    const changed = getChangedStateKeys(
      { topic: "SQL joins", confidence: 0.92, metadata: { provider: "LLM" } },
      { topic: "Excel", confidence: 0.92, metadata: { provider: "LLM v1" } }
    );

    expect(changed.has("topic")).toBe(true);
    expect(changed.has("metadata")).toBe(true);
    expect(changed.has("confidence")).toBe(false);
  });

  it("formats objects as pretty JSON instead of generic object strings", () => {
    const formatted = formatStateValue({ provider: "LinkedIn Learning", score: 0.91 });

    expect(formatted.kind).toBe("json");
    expect(formatted.text).toContain("\n");
    expect(formatted.text).toContain("\"provider\": \"LinkedIn Learning\"");
    expect(formatted.text).not.toContain("[object Object]");
  });

  it("maps known goal states to semantic tones", () => {
    expect(getGoalStatusTone("achieved")).toBe("success");
    expect(getGoalStatusTone("active")).toBe("warning");
    expect(getGoalStatusTone("failed")).toBe("danger");
  });
});
