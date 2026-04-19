import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { agentRunRepository } from "@/repositories/agent-run.repository";
import type { RunStatus } from "@/db/agents/schema";

const STATUSES: RunStatus[] = ["pending", "running", "completed", "failed"];

function parseStatus(raw: string | null): RunStatus | undefined {
  if (!raw) return undefined;
  return STATUSES.includes(raw as RunStatus) ? (raw as RunStatus) : undefined;
}

export async function GET(request: Request) {
  try {
    const url = new URL(request.url);
    const takeRaw = url.searchParams.get("take");
    const skipRaw = url.searchParams.get("skip");
    const take = takeRaw ? Number.parseInt(takeRaw, 10) : undefined;
    const skip = skipRaw ? Number.parseInt(skipRaw, 10) : undefined;
    const agentDefinitionId = url.searchParams.get("agentDefinitionId") ?? undefined;
    const status = parseStatus(url.searchParams.get("status"));
    const sinceRaw = url.searchParams.get("since");
    const untilRaw = url.searchParams.get("until");
    const since = sinceRaw ? new Date(sinceRaw) : undefined;
    const until = untilRaw ? new Date(untilRaw) : undefined;
    if (since && Number.isNaN(since.getTime())) {
      return NextResponse.json({ error: "Invalid since date" }, { status: 400 });
    }
    if (until && Number.isNaN(until.getTime())) {
      return NextResponse.json({ error: "Invalid until date" }, { status: 400 });
    }

    const { rows, total } = await agentRunRepository.listRunsSummary({
      take: Number.isFinite(take as number) ? take : undefined,
      skip: Number.isFinite(skip as number) ? skip : undefined,
      agentDefinitionId,
      status,
      since,
      until,
    });

    return NextResponse.json({
      runs: rows,
      total,
      skip: Number.isFinite(skip as number) ? skip : 0,
      take: rows.length,
    });
  } catch (err) {
    return handleApiError(err);
  }
}
