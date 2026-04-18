import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { agentRepository } from "@/repositories/agent.repository";

export async function GET(
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

    const versions = await agentRepository.getVersionHistory(ctx.tenantId, agent.id);
    return NextResponse.json(versions);
  } catch (err) {
    return handleApiError(err);
  }
}
