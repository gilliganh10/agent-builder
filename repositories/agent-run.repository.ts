import { db } from "@/lib/db";
import { generateId } from "@/lib/id";
import type { Prisma } from "@/lib/generated/prisma";
import type {
  AgentRun,
  AgentRunListRow,
  RunStatus,
  RunStep,
  RunArtifact,
  RunEval,
  TokenUsage,
  StepKind,
  StepStatus,
  ArtifactKind,
} from "@/db/agents/schema";
import {
  emitProposalCreated,
  emitProposalStatusUpdated,
} from "@/lib/agents/streaming/proposal-lifecycle-bus";

type PrismaRunRow = Awaited<ReturnType<typeof db.agentRun.findUniqueOrThrow>>;
type PrismaStepRow = Awaited<ReturnType<typeof db.runStep.findUniqueOrThrow>>;
type PrismaArtifactRow = Awaited<
  ReturnType<typeof db.runArtifact.findUniqueOrThrow>
>;
type PrismaEvalRow = Awaited<ReturnType<typeof db.runEval.findUniqueOrThrow>>;

function rowToRun(
  row: PrismaRunRow & {
    steps?: PrismaStepRow[];
    artifacts?: PrismaArtifactRow[];
    evals?: PrismaEvalRow[];
  }
): AgentRun {
  return {
    id: row.id,
    agentDefinitionId: row.agentDefinitionId,
    agentVersionId: row.agentVersionId,
    sessionId: row.sessionId,
    status: row.status as RunStatus,
    input: row.input,
    finalOutput: row.finalOutput,
    tokenUsage: row.tokenUsage as TokenUsage | null,
    costEstimate: row.costEstimate,
    durationMs: row.durationMs,
    error: row.error,
    triggeredBy: row.triggeredBy,
    meta: (row.meta ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
    steps: row.steps?.map(rowToStep),
    artifacts: row.artifacts?.map(rowToArtifact),
    evals: row.evals?.map(rowToEval),
  };
}

function rowToStep(row: PrismaStepRow): RunStep {
  return {
    id: row.id,
    runId: row.runId,
    stepIndex: row.stepIndex,
    kind: row.kind as StepKind,
    status: row.status as StepStatus,
    toolName: row.toolName,
    nodeId: row.nodeId,
    input: (row.input ?? {}) as Record<string, unknown>,
    output: row.output as Record<string, unknown> | null,
    tokenUsage: row.tokenUsage as TokenUsage | null,
    durationMs: row.durationMs,
    error: row.error,
    validationPassed: row.validationPassed,
    createdAt: row.createdAt.toISOString(),
  };
}

function rowToArtifact(row: PrismaArtifactRow): RunArtifact {
  return {
    id: row.id,
    runId: row.runId,
    kind: row.kind as ArtifactKind,
    targetType: row.targetType,
    targetId: row.targetId,
    data: (row.data ?? {}) as Record<string, unknown>,
    previousData: row.previousData as Record<string, unknown> | null,
    appliedAt: row.appliedAt?.toISOString() ?? null,
    appliedBy: row.appliedBy ?? null,
    rejected: row.rejected,
    rejectedReason: row.rejectedReason ?? null,
    rejectedAt: row.rejectedAt?.toISOString() ?? null,
    rejectedBy: row.rejectedBy ?? null,
    proposalOutcome: (row.proposalOutcome ?? null) as Record<string, unknown> | null,
    ignoredAt: row.ignoredAt?.toISOString() ?? null,
    createdAt: row.createdAt.toISOString(),
  };
}

function rowToEval(row: PrismaEvalRow): RunEval {
  return {
    id: row.id,
    runId: row.runId,
    evalName: row.evalName,
    score: row.score ?? null,
    pass: row.pass ?? null,
    reasoning: row.reasoning ?? null,
    meta: (row.meta ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt.toISOString(),
  };
}

const RUN_INCLUDE = {
  steps: { orderBy: { stepIndex: "asc" as const } },
  artifacts: { orderBy: { createdAt: "asc" as const } },
  evals: { orderBy: { createdAt: "asc" as const } },
} as const;

export const agentRunRepository = {
  create: async (data: {
    agentDefinitionId: string;
    agentVersionId?: string;
    sessionId?: string;
    input: string;
    triggeredBy: string;
    meta?: Record<string, unknown>;
  }): Promise<AgentRun> => {
    const row = await db.agentRun.create({
      data: {
        id: generateId("arun"),
        agentDefinitionId: data.agentDefinitionId,
        agentVersionId: data.agentVersionId ?? null,
        sessionId: data.sessionId ?? null,
        status: "running",
        input: data.input,
        triggeredBy: data.triggeredBy,
        meta: (data.meta ?? {}) as Prisma.InputJsonValue,
      },
      include: RUN_INCLUDE,
    });
    return rowToRun(row);
  },

  updateStatus: async (id: string, status: RunStatus): Promise<void> => {
    await db.agentRun.updateMany({
      where: { id },
      data: { status },
    });
  },

  complete: async (
    id: string,
    result: {
      finalOutput: string;
      tokenUsage?: TokenUsage;
      costEstimate?: number;
      durationMs?: number;
      metaMerge?: Record<string, unknown>;
    }
  ): Promise<AgentRun> => {
    let mergedMeta: Prisma.InputJsonValue | undefined;
    if (result.metaMerge && Object.keys(result.metaMerge).length > 0) {
      const existing = await db.agentRun.findFirst({
        where: { id },
        select: { meta: true },
      });
      const prev = (existing?.meta ?? {}) as Record<string, unknown>;
      mergedMeta = { ...prev, ...result.metaMerge } as Prisma.InputJsonValue;
    }

    await db.agentRun.updateMany({
      where: { id },
      data: {
        status: "completed",
        finalOutput: result.finalOutput,
        tokenUsage: result.tokenUsage
          ? (result.tokenUsage as unknown as Prisma.InputJsonValue)
          : undefined,
        costEstimate: result.costEstimate ?? null,
        durationMs: result.durationMs ?? null,
        ...(mergedMeta !== undefined ? { meta: mergedMeta } : {}),
      },
    });
    const row = await db.agentRun.findFirstOrThrow({
      where: { id },
      include: RUN_INCLUDE,
    });
    return rowToRun(row);
  },

  fail: async (id: string, error: string): Promise<AgentRun> => {
    await db.agentRun.updateMany({
      where: { id },
      data: { status: "failed", error },
    });
    const row = await db.agentRun.findFirstOrThrow({
      where: { id },
      include: RUN_INCLUDE,
    });
    return rowToRun(row);
  },

  addStep: async (data: {
    runId: string;
    stepIndex: number;
    kind: StepKind;
    status: StepStatus;
    toolName?: string;
    nodeId?: string;
    input: Record<string, unknown>;
    output?: Record<string, unknown>;
    tokenUsage?: TokenUsage;
    durationMs?: number;
    error?: string;
    validationPassed?: boolean;
  }): Promise<RunStep> => {
    const row = await db.runStep.create({
      data: {
        id: generateId("step"),
        runId: data.runId,
        stepIndex: data.stepIndex,
        kind: data.kind,
        status: data.status,
        toolName: data.toolName ?? null,
        nodeId: data.nodeId ?? null,
        input: data.input as Prisma.InputJsonValue,
        output: data.output
          ? (data.output as Prisma.InputJsonValue)
          : undefined,
        tokenUsage: data.tokenUsage
          ? (data.tokenUsage as unknown as Prisma.InputJsonValue)
          : undefined,
        durationMs: data.durationMs ?? null,
        error: data.error ?? null,
        validationPassed: data.validationPassed ?? null,
      },
    });
    return rowToStep(row);
  },

  addArtifact: async (data: {
    id?: string;
    runId: string;
    kind: ArtifactKind;
    targetType?: string;
    targetId?: string;
    data: Record<string, unknown>;
    previousData?: Record<string, unknown>;
  }): Promise<RunArtifact> => {
    const row = await db.runArtifact.create({
      data: {
        id: data.id ?? generateId("artf"),
        runId: data.runId,
        kind: data.kind,
        targetType: data.targetType ?? null,
        targetId: data.targetId ?? null,
        data: data.data as Prisma.InputJsonValue,
        previousData: data.previousData
          ? (data.previousData as Prisma.InputJsonValue)
          : undefined,
      },
    });
    const artifact = rowToArtifact(row);
    emitProposalCreated(artifact);
    return artifact;
  },

  applyArtifact: async (
    id: string,
    appliedBy: string,
    previousData?: Record<string, unknown>,
    proposalOutcome?: Record<string, unknown>
  ): Promise<RunArtifact> => {
    await db.runArtifact.updateMany({
      where: { id },
      data: {
        appliedAt: new Date(),
        appliedBy,
        previousData: previousData
          ? (previousData as Prisma.InputJsonValue)
          : undefined,
        proposalOutcome: proposalOutcome
          ? (proposalOutcome as Prisma.InputJsonValue)
          : undefined,
      },
    });
    const row = await db.runArtifact.findFirstOrThrow({ where: { id } });
    const artifact = rowToArtifact(row);
    emitProposalStatusUpdated(artifact, "applied");
    return artifact;
  },

  rejectArtifact: async (
    id: string,
    reason?: string,
    rejectedBy?: string,
    proposalOutcome?: Record<string, unknown>
  ): Promise<RunArtifact> => {
    await db.runArtifact.updateMany({
      where: { id },
      data: {
        rejected: true,
        rejectedReason: reason ?? null,
        rejectedAt: new Date(),
        rejectedBy: rejectedBy ?? null,
        proposalOutcome: proposalOutcome
          ? (proposalOutcome as Prisma.InputJsonValue)
          : undefined,
      },
    });
    const row = await db.runArtifact.findFirstOrThrow({ where: { id } });
    const artifact = rowToArtifact(row);
    emitProposalStatusUpdated(artifact, "rejected");
    return artifact;
  },

  ignoreArtifacts: async (ids: string[]): Promise<void> => {
    await db.runArtifact.updateMany({
      where: {
        id: { in: ids },
        appliedAt: null,
        rejected: false,
        ignoredAt: null,
      },
      data: { ignoredAt: new Date() },
    });
    const rows = await db.runArtifact.findMany({
      where: { id: { in: ids } },
    });
    for (const row of rows) {
      emitProposalStatusUpdated(rowToArtifact(row), "ignored");
    }
  },

  findArtifactsByIds: async (ids: string[]): Promise<RunArtifact[]> => {
    const rows = await db.runArtifact.findMany({ where: { id: { in: ids } } });
    return rows.map(rowToArtifact);
  },

  findArtifactById: async (id: string): Promise<RunArtifact | null> => {
    const row = await db.runArtifact.findFirst({ where: { id } });
    return row ? rowToArtifact(row) : null;
  },

  mergeArtifactProposalOutcome: async (
    id: string,
    merger: (prev: Record<string, unknown> | null) => Record<string, unknown>
  ): Promise<RunArtifact> => {
    const row = await db.runArtifact.findFirst({ where: { id } });
    if (!row) {
      throw new Error(`RunArtifact not found: ${id}`);
    }
    const prev = (row.proposalOutcome ?? null) as Record<string, unknown> | null;
    const next = merger(prev);
    await db.runArtifact.updateMany({
      where: { id },
      data: { proposalOutcome: next as Prisma.InputJsonValue },
    });
    const updated = await db.runArtifact.findFirstOrThrow({ where: { id } });
    return rowToArtifact(updated);
  },

  findById: async (id: string): Promise<AgentRun | null> => {
    const row = await db.agentRun.findFirst({
      where: { id },
      include: RUN_INCLUDE,
    });
    return row ? rowToRun(row) : null;
  },

  listByAgent: async (agentDefinitionId: string): Promise<AgentRun[]> => {
    const rows = await db.agentRun.findMany({
      where: { agentDefinitionId },
      orderBy: { createdAt: "desc" },
      include: RUN_INCLUDE,
    });
    return rows.map(rowToRun);
  },

  listByAgentSummary: async (
    agentDefinitionId: string,
    opts?: { take?: number }
  ): Promise<AgentRun[]> => {
    const take = opts?.take ?? 500;
    const rows = await db.agentRun.findMany({
      where: { agentDefinitionId },
      orderBy: { createdAt: "desc" },
      take,
    });
    return rows.map((row) => rowToRun(row));
  },

  listByUser: async (triggeredBy: string): Promise<AgentRun[]> => {
    const rows = await db.agentRun.findMany({
      where: { triggeredBy },
      orderBy: { createdAt: "desc" },
      include: RUN_INCLUDE,
    });
    return rows.map(rowToRun);
  },

  /**
   * Workspace-wide run list for the agents hub (paginated).
   */
  listRunsSummary: async (
    opts: {
      take?: number;
      skip?: number;
      agentDefinitionId?: string;
      status?: RunStatus;
      since?: Date;
      until?: Date;
    } = {}
  ): Promise<{ rows: AgentRunListRow[]; total: number }> => {
    const take = Math.min(Math.max(opts.take ?? 50, 1), 200);
    const skip = Math.max(opts.skip ?? 0, 0);

    const where: Prisma.AgentRunWhereInput = {};

    if (opts.agentDefinitionId) {
      where.agentDefinitionId = opts.agentDefinitionId;
    }
    if (opts.status) {
      where.status = opts.status;
    }
    const createdAt: Prisma.DateTimeFilter = {};
    if (opts.since) createdAt.gte = opts.since;
    if (opts.until) createdAt.lte = opts.until;
    if (Object.keys(createdAt).length > 0) {
      where.createdAt = createdAt;
    }

    const [rows, total] = await Promise.all([
      db.agentRun.findMany({
        where,
        orderBy: { createdAt: "desc" },
        skip,
        take,
        include: {
          agentDefinition: { select: { id: true, slug: true, name: true } },
        },
      }),
      db.agentRun.count({ where }),
    ]);

    const mapped: AgentRunListRow[] = rows.map((row) => {
      const meta = (row.meta ?? {}) as Record<string, unknown>;
      const surface = typeof meta.surface === "string" ? meta.surface : null;
      const input = row.input;
      const inputPreview =
        input.length > 200 ? `${input.slice(0, 200)}…` : input;

      return {
        id: row.id,
        agentDefinitionId: row.agentDefinitionId,
        agentSlug: row.agentDefinition.slug,
        agentName: row.agentDefinition.name,
        status: row.status as RunStatus,
        triggeredBy: row.triggeredBy,
        inputPreview,
        durationMs: row.durationMs,
        costEstimate: row.costEstimate,
        tokenUsage: row.tokenUsage as TokenUsage | null,
        meta,
        surface,
        createdAt: row.createdAt.toISOString(),
      };
    });

    return { rows: mapped, total };
  },
};
