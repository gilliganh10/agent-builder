import { db } from "@/lib/db";
import { generateId } from "@/lib/id";
import type { Prisma } from "@/lib/generated/prisma";
import type {
  ConversationSession,
  SessionStatus,
  RunStatus,
  RunStep,
  RunArtifact,
  TokenUsage,
  StepKind,
  StepStatus,
  ArtifactKind,
} from "@/db/agents/schema";

type PrismaSessionRow = Awaited<
  ReturnType<typeof db.conversationSession.findUniqueOrThrow>
>;

function rowToSession(row: PrismaSessionRow): ConversationSession {
  return {
    id: row.id,
    agentDefinitionId: row.agentDefinitionId,
    status: row.status as SessionStatus,
    participantId: row.participantId,
    meta: (row.meta ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

interface RunWithSteps {
  id: string;
  input: string;
  status: RunStatus;
  finalOutput: string | null;
  meta: Record<string, unknown>;
  createdAt: string;
  steps: RunStep[];
  artifacts: RunArtifact[];
}

export const conversationSessionRepository = {
  create: async (_tenantId: string, data: {
    agentDefinitionId: string;
    participantId?: string;
    meta?: Record<string, unknown>;
  }): Promise<ConversationSession> => {
    const row = await db.conversationSession.create({
      data: {
        id: generateId("csess"),
        agentDefinitionId: data.agentDefinitionId,
        participantId: data.participantId ?? null,
        meta: (data.meta ?? {}) as Prisma.InputJsonValue,
      },
    });
    return rowToSession(row);
  },

  findById: async (_tenantId: string, id: string): Promise<ConversationSession | null> => {
    const row = await db.conversationSession.findFirst({ where: { id } });
    return row ? rowToSession(row) : null;
  },

  close: async (_tenantId: string, id: string): Promise<ConversationSession> => {
    await db.conversationSession.updateMany({
      where: { id },
      data: { status: "closed" },
    });
    const row = await db.conversationSession.findFirstOrThrow({ where: { id } });
    return rowToSession(row);
  },

  getHistory: async (_tenantId: string, sessionId: string): Promise<RunWithSteps[]> => {
    const rows = await db.agentRun.findMany({
      where: { sessionId, status: "completed" },
      orderBy: { createdAt: "asc" },
      include: {
        steps: {
          where: { kind: "flow_node", status: "completed" },
          orderBy: { stepIndex: "asc" },
        },
        artifacts: {
          where: { kind: "proposal" },
          orderBy: { createdAt: "asc" },
        },
      },
    });

    return rows.map((row) => ({
      id: row.id,
      input: row.input,
      status: row.status as RunStatus,
      finalOutput: row.finalOutput,
      meta: (row.meta ?? {}) as Record<string, unknown>,
      createdAt: row.createdAt.toISOString(),
      steps: row.steps.map((s) => ({
        id: s.id,
        runId: s.runId,
        stepIndex: s.stepIndex,
        kind: s.kind as StepKind,
        status: s.status as StepStatus,
        toolName: s.toolName,
        nodeId: s.nodeId,
        input: (s.input ?? {}) as Record<string, unknown>,
        output: s.output as Record<string, unknown> | null,
        tokenUsage: s.tokenUsage as TokenUsage | null,
        durationMs: s.durationMs,
        error: s.error,
        validationPassed: s.validationPassed,
        createdAt: s.createdAt.toISOString(),
      })),
      artifacts: row.artifacts.map((artifact) => ({
        id: artifact.id,
        runId: artifact.runId,
        kind: artifact.kind as ArtifactKind,
        targetType: artifact.targetType,
        targetId: artifact.targetId,
        data: (artifact.data ?? {}) as Record<string, unknown>,
        previousData: artifact.previousData as Record<string, unknown> | null,
        appliedAt: artifact.appliedAt?.toISOString() ?? null,
        appliedBy: artifact.appliedBy ?? null,
        rejected: artifact.rejected,
        rejectedReason: artifact.rejectedReason ?? null,
        rejectedAt: artifact.rejectedAt?.toISOString() ?? null,
        rejectedBy: artifact.rejectedBy ?? null,
        proposalOutcome: (artifact.proposalOutcome ?? null) as Record<string, unknown> | null,
        ignoredAt: artifact.ignoredAt?.toISOString() ?? null,
        createdAt: artifact.createdAt.toISOString(),
      })),
    }));
  },
};
