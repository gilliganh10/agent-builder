import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { agentRepository } from "@/repositories/agent.repository";
import { agentRunRepository } from "@/repositories/agent-run.repository";

/**
 * GET runs for an agent.
 * Default: summary rows (no steps/artifacts), max 500 — fast for UI lists.
 * `?detail=1`: full runs with steps and artifacts (heavy; use sparingly).
 */
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

    const url = new URL(request.url);
    const wantDetail = url.searchParams.get("detail") === "1";

    const runs = wantDetail
      ? await agentRunRepository.listByAgent(ctx.tenantId, agent.id)
      : await agentRunRepository.listByAgentSummary(ctx.tenantId, agent.id);

    return NextResponse.json(runs);
  } catch (err) {
    return handleApiError(err);
  }
}
