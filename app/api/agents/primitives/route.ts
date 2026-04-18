import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError } from "@/lib/api-error";
import { primitiveRepository } from "@/repositories/primitive.repository";
import { PRIMITIVE_KINDS } from "@/db/agents/schema";
import { resolveModel, ALL_MODEL_POLICIES, type ModelPolicy } from "@/lib/agents/model-policy";

const CreatePrimitiveSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be kebab-case"),
  kind: z.enum(PRIMITIVE_KINDS as [string, ...string[]]),
  description: z.string().max(1000).default(""),
  instructions: z.string().min(1).max(50_000),
  config: z.record(z.string(), z.unknown()).default({}),
  allowedTools: z.array(z.string()).default([]),
  modelPolicy: z.enum(ALL_MODEL_POLICIES as [string, ...string[]]).default("default"),
  meta: z.record(z.string(), z.unknown()).default({}),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{}> }
) {
  try {
        const ctx = { tenantId: "" } as const;
    const primitives = await primitiveRepository.list();
    return NextResponse.json(primitives);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(
  request: Request,
  { params }: { params: Promise<{}> }
) {
  try {
        const ctx = { tenantId: "" } as const;
    const body = await request.json();
    const parsed = CreatePrimitiveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, slug, kind, description, instructions, config, allowedTools, modelPolicy, meta } =
      parsed.data;

    const existing = await primitiveRepository.findBySlug(slug);
    if (existing) {
      return NextResponse.json(
        { error: `Primitive with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    const primitive = await primitiveRepository.create({
      name,
      slug,
      kind: kind as typeof PRIMITIVE_KINDS[number],
      description,
      instructions,
      config,
      allowedTools,
      defaultModel: resolveModel(modelPolicy as ModelPolicy),
      meta: { ...meta, modelPolicy },
    });

    return NextResponse.json(primitive, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
