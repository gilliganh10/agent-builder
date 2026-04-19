import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { agentRepository } from "@/repositories/agent.repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ slug: string }> }
) {
  try {
    const { slug } = await params;
    const agent = await agentRepository.findBySlug(slug);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const versions = await agentRepository.getVersionHistory(agent.id);
    return NextResponse.json(versions);
  } catch (err) {
    return handleApiError(err);
  }
}
