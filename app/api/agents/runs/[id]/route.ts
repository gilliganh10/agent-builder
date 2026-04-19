import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { agentRunRepository } from "@/repositories/agent-run.repository";

export async function GET(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const run = await agentRunRepository.findById(id);
    if (!run) {
      return NextResponse.json({ error: "Run not found" }, { status: 404 });
    }

    return NextResponse.json(run);
  } catch (err) {
    return handleApiError(err);
  }
}
