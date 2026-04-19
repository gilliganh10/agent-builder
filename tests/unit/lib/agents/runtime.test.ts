import { beforeEach, describe, expect, it, vi } from "vitest";
import { executeAgentRun } from "@/lib/agents/runtime";
import { agentRunRepository } from "@/repositories/agent-run.repository";
import { buildConversationHistory } from "@/lib/agents/conversation-history";
import { runAgent } from "@/lib/agents/llm-provider";

vi.mock("@/repositories/agent-run.repository", () => ({
  agentRunRepository: {
    create: vi.fn(),
    complete: vi.fn(),
    fail: vi.fn(),
  },
}));

vi.mock("@/lib/agents/conversation-history", () => ({
  buildConversationHistory: vi.fn(),
}));

vi.mock("@/lib/agents/llm-provider", () => ({
  runAgent: vi.fn(),
}));

const mockAgentRunRepository = vi.mocked(agentRunRepository);
const mockBuildConversationHistory = vi.mocked(buildConversationHistory);
const mockRunAgent = vi.mocked(runAgent);

describe("executeAgentRun", () => {
  beforeEach(() => {
    vi.clearAllMocks();

    mockAgentRunRepository.create.mockResolvedValue({
      id: "arun_1",
      agentDefinitionId: "agent_1",
      sessionId: "csess_1",
      status: "running",
      input: "Current message with context",
      triggeredBy: "daniel@example.com",
      meta: {},
      createdAt: "2026-03-14T10:00:00.000Z",
      updatedAt: "2026-03-14T10:00:00.000Z",
    } as never);

    mockAgentRunRepository.complete.mockResolvedValue({
      id: "arun_1",
      agentDefinitionId: "agent_1",
      sessionId: "csess_1",
      status: "completed",
      input: "Current message with context",
      finalOutput: "Done",
      triggeredBy: "daniel@example.com",
      meta: {},
      createdAt: "2026-03-14T10:00:00.000Z",
      updatedAt: "2026-03-14T10:00:01.000Z",
    } as never);
  });

  it("reuses session history for non-flow conversational runs", async () => {
    mockBuildConversationHistory.mockResolvedValue([
      { role: "user", content: "My name is Daniel." },
      { role: "assistant", content: "Nice to meet you, Daniel." },
    ]);

    mockRunAgent.mockResolvedValue({
      finalOutput: "I still remember your name.",
      usage: { prompt: 10, completion: 5, total: 15 },
      newItems: [],
      rawResponses: [],
      usageRecords: [],
    });

    await executeAgentRun({
      agentSpec: {
        definitionId: "agent_1",
        name: "Report Copilot",
        slug: "report-copilot",
        instructions: "Help with reports.",
        tools: [],
        model: "gpt-4.1",
      },
      input: "Current message with context",
      triggeredBy: "daniel@example.com",
      sessionId: "csess_1",
      meta: { conversationInput: "Do you still remember my name?" },
    });

    expect(mockAgentRunRepository.create).toHaveBeenCalledWith(expect.objectContaining({
      agentDefinitionId: "agent_1",
      sessionId: "csess_1",
    }));

    expect(mockBuildConversationHistory).toHaveBeenCalledWith("csess_1", null);

    expect(mockRunAgent).toHaveBeenCalledWith(
      expect.objectContaining({ slug: "report-copilot" }),
      [
        { role: "user", content: "My name is Daniel." },
        { role: "assistant", content: "Nice to meet you, Daniel." },
        { role: "user", content: "Current message with context" },
      ],
      expect.objectContaining({
        runId: "arun_1",
        triggeredBy: "daniel@example.com",
      }),
      { phase: "single_agent_run" },
    );
  });
});
