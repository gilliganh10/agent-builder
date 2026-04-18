import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError } from "@/lib/api-error";
import { primitiveRepository } from "@/repositories/primitive.repository";
import { PRIMITIVE_KINDS } from "@/db/agents/schema";
import { resolveModel, ALL_MODEL_POLICIES, type ModelPolicy } from "@/lib/agents/model-policy";

const UpdatePrimitiveSchema = z.object({
  name: z.string().min(1).max(100).optional(),
  description: z.string().max(1000).optional(),
  instructions: z.string().min(1).max(50_000).optional(),
  config: z.record(z.string(), z.unknown()).optional(),
  allowedTools: z.array(z.string()).optional(),
  modelPolicy: z.enum(ALL_MODEL_POLICIES as [string, ...string[]]).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ctx = { tenantId: "" } as const;
    const primitive = await primitiveRepository.findBySlug(slug);
    if (!primitive) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    return NextResponse.json(primitive);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ctx = { tenantId: "" } as const;
    const existing = await primitiveRepository.findBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const body = await request.json();
    const parsed = UpdatePrimitiveSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const patch: Record<string, unknown> = { ...parsed.data };
    if (parsed.data.modelPolicy) {
      patch.defaultModel = resolveModel(parsed.data.modelPolicy as ModelPolicy);
      patch.meta = { ...(existing.meta ?? {}), modelPolicy: parsed.data.modelPolicy };
      delete patch.modelPolicy;
    }

    const updated = await primitiveRepository.update(existing.id, patch);
    return NextResponse.json(updated);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ctx = { tenantId: "" } as const;
    const existing = await primitiveRepository.findBySlug(slug);
    if (!existing) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    await primitiveRepository.delete(existing.id);
    return NextResponse.json({ ok: true });
  } catch (err) {
    return handleApiError(err);
  }
}
