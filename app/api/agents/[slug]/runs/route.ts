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
    const agent = await agentRepository.findBySlug(slug);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const url = new URL(request.url);
    const wantDetail = url.searchParams.get("detail") === "1";

    const runs = wantDetail
      ? await agentRunRepository.listByAgent(agent.id)
      : await agentRunRepository.listByAgentSummary(agent.id);

    return NextResponse.json(runs);
  } catch (err) {
    return handleApiError(err);
  }
}
