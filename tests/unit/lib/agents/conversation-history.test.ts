import { beforeEach, describe, expect, it, vi } from "vitest";
import { buildConversationHistory } from "@/lib/agents/conversation-history";
import { conversationSessionRepository } from "@/repositories/conversation-session.repository";
import type { FlowDefinition } from "@/db/agents/schema";

vi.mock("@/repositories/conversation-session.repository", () => ({
  conversationSessionRepository: {
    getHistory: vi.fn(),
  },
}));

const mockConversationSessionRepository = vi.mocked(conversationSessionRepository);

describe("buildConversationHistory", () => {
  beforeEach(() => {
    vi.clearAllMocks();
  });

  it("uses conversationInput metadata and final output fallback for single-shot runs", async () => {
    mockConversationSessionRepository.getHistory.mockResolvedValue([
      {
        id: "arun_1",
        input: "[REPORT_BUILDER_CONTEXT_JSON] ... [/REPORT_BUILDER_CONTEXT_JSON]\nUser request:\nremember my name",
        status: "completed",
        finalOutput: "Nice to meet you, Daniel.",
        meta: { conversationInput: "Remember my name is Daniel." },
        createdAt: "2026-03-14T10:00:00.000Z",
        steps: [],
        artifacts: [],
      },
    ] as never);

    const messages = await buildConversationHistory("tenant_1", "csess_1", null);

    expect(messages).toEqual([
      { role: "user", content: "Remember my name is Daniel." },
      { role: "assistant", content: "Nice to meet you, Daniel." },
    ]);
  });

  it("adds proposal summaries for conversational follow-up turns", async () => {
    const flowDefinition: FlowDefinition = {
      version: 2,
      nodes: [
        {
          id: "execute",
          type: "agent",
          position: { x: 0, y: 0 },
          data: {
            label: "Project Copilot",
            displayName: "Project Copilot",
          },
        },
      ],
      edges: [],
    };

    mockConversationSessionRepository.getHistory.mockResolvedValue([
      {
        id: "arun_2",
        input: "Add a KPI for activation.",
        status: "completed",
        finalOutput: null,
        meta: {},
        createdAt: "2026-03-14T10:05:00.000Z",
        steps: [
          {
            id: "step_1",
            runId: "arun_2",
            stepIndex: 0,
            kind: "flow_node",
            status: "completed",
            toolName: null,
            nodeId: "execute",
            input: {},
            output: { message: "I proposed a KPI to track activation rate." },
            tokenUsage: null,
            durationMs: 120,
            error: null,
            validationPassed: true,
            createdAt: "2026-03-14T10:05:01.000Z",
          },
        ],
        artifacts: [
          {
            id: "artifact_1",
            runId: "arun_2",
            kind: "proposal",
            targetType: null,
            targetId: null,
            data: {
              op: "create_item",
              description: "Add an activation KPI with a weekly review cadence.",
            },
            previousData: null,
            appliedAt: null,
            appliedBy: null,
            rejected: false,
            rejectedReason: null,
            ignoredAt: null,
            createdAt: "2026-03-14T10:05:02.000Z",
          },
        ],
      },
    ] as never);

    const messages = await buildConversationHistory("tenant_1", "csess_1", flowDefinition);

    expect(messages).toEqual([
      { role: "user", content: "Add a KPI for activation." },
      {
        role: "assistant",
        content: "I proposed a KPI to track activation rate.",
        meta: { nodeId: "execute", label: "Project Copilot" },
      },
      {
        role: "assistant",
        content:
          "Proposal summary:\n- [pending] create_item: Add an activation KPI with a weekly review cadence.",
        meta: { nodeId: "proposal-summary", label: "Proposal Summary" },
      },
    ]);
  });
});
