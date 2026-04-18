import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { agentRepository } from "@/repositories/agent.repository";
import { generateId } from "@/lib/id";

/**
 * POST — Publish an agent: generates a unique publish token and public URL.
 */
export async function POST(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ctx = { tenantId: "" } as const;
    const agent = await agentRepository.findBySlug(ctx.tenantId, slug);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (agent.publishToken) {
      return NextResponse.json({
        token: agent.publishToken,
        url: `/chat/${agent.publishToken}`,
        publishedAt: agent.publishedAt,
      });
    }

    const token = generateId("pub").replace(/^pub_/, "");
    const updated = await agentRepository.publish(ctx.tenantId, agent.id, token);

    return NextResponse.json(
      {
        token: updated.publishToken,
        url: `/chat/${updated.publishToken}`,
        publishedAt: updated.publishedAt,
      },
      { status: 201 }
    );
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * DELETE — Unpublish an agent: removes the token and public URL.
 */
export async function DELETE(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const ctx = { tenantId: "" } as const;
    const agent = await agentRepository.findBySlug(ctx.tenantId, slug);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (!agent.publishToken) {
      return NextResponse.json({ unpublished: true });
    }

    await agentRepository.unpublish(ctx.tenantId, agent.id);
    return NextResponse.json({ unpublished: true });
  } catch (err) {
    return handleApiError(err);
  }
}
