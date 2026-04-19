import { db } from "@/lib/db";
import { generateId } from "@/lib/id";
import { Prisma } from "@/lib/generated/prisma";
import type {
  AgentDefinition,
  AgentKind,
  AgentMode,
  AgentVersion,
  FlowDefinition,
} from "@/db/agents/schema";

// ---------------------------------------------------------------------------
// Single-scope repository. Function signatures still accept `tenantId` so
// existing runtime call sites compile unchanged, but the value is ignored.
// ---------------------------------------------------------------------------

type PrismaAgentDef = Awaited<
  ReturnType<typeof db.agentDefinition.findUniqueOrThrow>
>;

type PrismaAgentVersion = Awaited<
  ReturnType<typeof db.agentVersion.findUniqueOrThrow>
>;

function rowToDefinition(row: PrismaAgentDef): AgentDefinition {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    description: row.description,
    kind: row.kind as AgentKind,
    instructions: row.instructions,
    allowedTools: (row.allowedTools ?? []) as string[],
    defaultModel: row.defaultModel,
    outputSchema: row.outputSchema as Record<string, unknown> | null,
    flowDefinition: row.flowDefinition as FlowDefinition | null,
    mode: (row.mode ?? "stateless") as AgentMode,
    publishToken: row.publishToken ?? null,
    publishedAt: row.publishedAt?.toISOString() ?? null,
    meta: (row.meta ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

function rowToVersion(row: PrismaAgentVersion): AgentVersion {
  return {
    id: row.id,
    agentDefinitionId: row.agentDefinitionId,
    version: row.version,
    instructions: row.instructions,
    allowedTools: (row.allowedTools ?? []) as string[],
    defaultModel: row.defaultModel,
    outputSchema: row.outputSchema as Record<string, unknown> | null,
    flowDefinition: row.flowDefinition as FlowDefinition | null,
    changelog: row.changelog,
    createdAt: row.createdAt.toISOString(),
  };
}

export const agentRepository = {
  list: async (_tenantId: string): Promise<AgentDefinition[]> => {
    const rows = await db.agentDefinition.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(rowToDefinition);
  },

  listSlugs: async (_tenantId: string): Promise<string[]> => {
    const rows = await db.agentDefinition.findMany({
      select: { slug: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => r.slug);
  },

  findById: async (_tenantId: string, id: string): Promise<AgentDefinition | null> => {
    const row = await db.agentDefinition.findFirst({ where: { id } });
    return row ? rowToDefinition(row) : null;
  },

  findBySlug: async (_tenantId: string, slug: string): Promise<AgentDefinition | null> => {
    const row = await db.agentDefinition.findFirst({ where: { slug } });
    return row ? rowToDefinition(row) : null;
  },

  create: async (
    _tenantId: string,
    data: Omit<AgentDefinition, "id" | "createdAt" | "updatedAt" | "mode" | "publishToken" | "publishedAt"> & {
      mode?: AgentMode;
    }
  ): Promise<AgentDefinition> => {
    const row = await db.agentDefinition.create({
      data: {
        id: generateId("agent"),
        name: data.name,
        slug: data.slug,
        description: data.description,
        kind: data.kind,
        instructions: data.instructions,
        allowedTools: data.allowedTools as Prisma.InputJsonValue,
        defaultModel: data.defaultModel,
        outputSchema: data.outputSchema
          ? (data.outputSchema as unknown as Prisma.InputJsonValue)
          : undefined,
        flowDefinition: data.flowDefinition
          ? (data.flowDefinition as unknown as Prisma.InputJsonValue)
          : undefined,
        mode: data.mode ?? "conversational",
        meta: data.meta as Prisma.InputJsonValue,
      },
    });
    return rowToDefinition(row);
  },

  update: async (
    _tenantId: string,
    id: string,
    patch: Partial<Omit<AgentDefinition, "id" | "createdAt" | "updatedAt">>
  ): Promise<AgentDefinition | null> => {
    const existing = await db.agentDefinition.findFirst({ where: { id } });
    if (!existing) return null;

    const newAllowedTools = patch.allowedTools ?? (existing.allowedTools as string[]);
    const newMeta = patch.meta ?? (existing.meta as Record<string, unknown>);
    const newOutputSchema = patch.outputSchema !== undefined
      ? patch.outputSchema
      : existing.outputSchema;
    const newFlowDef = patch.flowDefinition !== undefined
      ? patch.flowDefinition
      : existing.flowDefinition;

    const row = await db.agentDefinition.update({
      where: { id },
      data: {
        name: patch.name ?? existing.name,
        slug: patch.slug ?? existing.slug,
        description: patch.description ?? existing.description,
        kind: patch.kind ?? existing.kind,
        instructions: patch.instructions ?? existing.instructions,
        allowedTools: newAllowedTools as Prisma.InputJsonValue,
        defaultModel: patch.defaultModel ?? existing.defaultModel,
        outputSchema: newOutputSchema
          ? (newOutputSchema as unknown as Prisma.InputJsonValue)
          : undefined,
        flowDefinition: newFlowDef
          ? (newFlowDef as unknown as Prisma.InputJsonValue)
          : Prisma.JsonNull,
        mode: patch.mode ?? existing.mode,
        meta: newMeta as Prisma.InputJsonValue,
      },
    });
    return rowToDefinition(row);
  },

  delete: async (_tenantId: string, id: string): Promise<void> => {
    await db.runArtifact.deleteMany({
      where: { run: { agentDefinitionId: id } },
    });
    await db.runStep.deleteMany({
      where: { run: { agentDefinitionId: id } },
    });
    await db.agentRun.deleteMany({ where: { agentDefinitionId: id } });
    await db.agentVersion.deleteMany({ where: { agentDefinitionId: id } });
    await db.agentDefinition.deleteMany({ where: { id } });
  },

  findByPublishToken: async (token: string): Promise<AgentDefinition | null> => {
    const row = await db.agentDefinition.findUnique({ where: { publishToken: token } });
    return row ? rowToDefinition(row) : null;
  },

  publish: async (_tenantId: string, id: string, token: string): Promise<AgentDefinition> => {
    const row = await db.agentDefinition.update({
      where: { id },
      data: { publishToken: token, publishedAt: new Date() },
    });
    return rowToDefinition(row);
  },

  unpublish: async (_tenantId: string, id: string): Promise<AgentDefinition> => {
    const row = await db.agentDefinition.update({
      where: { id },
      data: { publishToken: null, publishedAt: null },
    });
    return rowToDefinition(row);
  },

  createVersion: async (
    _tenantId: string,
    agentDefinitionId: string,
    data: Omit<AgentVersion, "id" | "agentDefinitionId" | "createdAt">
  ): Promise<AgentVersion> => {
    const row = await db.agentVersion.create({
      data: {
        id: generateId("aver"),
        agentDefinitionId,
        version: data.version,
        instructions: data.instructions,
        allowedTools: data.allowedTools as Prisma.InputJsonValue,
        defaultModel: data.defaultModel,
        outputSchema: data.outputSchema
          ? (data.outputSchema as unknown as Prisma.InputJsonValue)
          : undefined,
        flowDefinition: data.flowDefinition
          ? (data.flowDefinition as unknown as Prisma.InputJsonValue)
          : undefined,
        changelog: data.changelog,
      },
    });
    return rowToVersion(row);
  },

  getLatestVersion: async (
    _tenantId: string,
    agentDefinitionId: string
  ): Promise<AgentVersion | null> => {
    const row = await db.agentVersion.findFirst({
      where: { agentDefinitionId },
      orderBy: { version: "desc" },
    });
    return row ? rowToVersion(row) : null;
  },

  getVersionHistory: async (
    _tenantId: string,
    agentDefinitionId: string
  ): Promise<AgentVersion[]> => {
    const rows = await db.agentVersion.findMany({
      where: { agentDefinitionId },
      orderBy: { version: "desc" },
    });
    return rows.map(rowToVersion);
  },
};
