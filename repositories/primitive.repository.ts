import { db } from "@/lib/db";
import { generateId } from "@/lib/id";
import type { Prisma } from "@/lib/generated/prisma";
import type { PrimitiveDefinition, PrimitiveKind } from "@/db/agents/schema";

// ---------------------------------------------------------------------------
// Mapper
// ---------------------------------------------------------------------------

type PrismaRow = Awaited<
  ReturnType<typeof db.primitiveDefinition.findUniqueOrThrow>
>;

function rowToDefinition(row: PrismaRow): PrimitiveDefinition {
  return {
    id: row.id,
    name: row.name,
    slug: row.slug,
    kind: row.kind as PrimitiveKind,
    description: row.description,
    instructions: row.instructions,
    config: (row.config ?? {}) as Record<string, unknown>,
    allowedTools: (row.allowedTools ?? []) as string[],
    defaultModel: row.defaultModel,
    meta: (row.meta ?? {}) as Record<string, unknown>,
    createdAt: row.createdAt.toISOString(),
    updatedAt: row.updatedAt.toISOString(),
  };
}

// ---------------------------------------------------------------------------
// Repository
// ---------------------------------------------------------------------------

export const primitiveRepository = {
  list: async (): Promise<PrimitiveDefinition[]> => {
    const rows = await db.primitiveDefinition.findMany({
      orderBy: { createdAt: "desc" },
    });
    return rows.map(rowToDefinition);
  },

  listSlugs: async (): Promise<string[]> => {
    const rows = await db.primitiveDefinition.findMany({
      select: { slug: true },
      orderBy: { createdAt: "desc" },
    });
    return rows.map((r) => r.slug);
  },

  findById: async (id: string): Promise<PrimitiveDefinition | null> => {
    const row = await db.primitiveDefinition.findUnique({ where: { id } });
    return row ? rowToDefinition(row) : null;
  },

  findBySlug: async (slug: string): Promise<PrimitiveDefinition | null> => {
    const row = await db.primitiveDefinition.findUnique({ where: { slug } });
    return row ? rowToDefinition(row) : null;
  },

  create: async (
    data: Omit<PrimitiveDefinition, "id" | "createdAt" | "updatedAt">
  ): Promise<PrimitiveDefinition> => {
    const row = await db.primitiveDefinition.create({
      data: {
        id: generateId("prim"),
        name: data.name,
        slug: data.slug,
        kind: data.kind,
        description: data.description,
        instructions: data.instructions,
        config: data.config as Prisma.InputJsonValue,
        allowedTools: data.allowedTools as Prisma.InputJsonValue,
        defaultModel: data.defaultModel,
        meta: data.meta as Prisma.InputJsonValue,
      },
    });
    return rowToDefinition(row);
  },

  update: async (
    id: string,
    patch: Partial<Omit<PrimitiveDefinition, "id" | "createdAt" | "updatedAt">>
  ): Promise<PrimitiveDefinition | null> => {
    const existing = await db.primitiveDefinition.findUnique({ where: { id } });
    if (!existing) return null;

    const row = await db.primitiveDefinition.update({
      where: { id },
      data: {
        name: patch.name ?? existing.name,
        slug: patch.slug ?? existing.slug,
        kind: patch.kind ?? existing.kind,
        description: patch.description ?? existing.description,
        instructions: patch.instructions ?? existing.instructions,
        config: patch.config
          ? (patch.config as unknown as Prisma.InputJsonValue)
          : undefined,
        allowedTools: patch.allowedTools
          ? (patch.allowedTools as unknown as Prisma.InputJsonValue)
          : undefined,
        defaultModel: patch.defaultModel ?? existing.defaultModel,
        meta: patch.meta
          ? (patch.meta as unknown as Prisma.InputJsonValue)
          : undefined,
      },
    });
    return rowToDefinition(row);
  },

  delete: async (id: string): Promise<void> => {
    await db.primitiveDefinition.delete({ where: { id } });
  },
};
