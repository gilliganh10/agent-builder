import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { conversationSessionRepository } from "@/repositories/conversation-session.repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const ctx = { tenantId: "" } as const;
    const existing = await conversationSessionRepository.findById(ctx.tenantId, id);
    if (!existing) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 404 });
    }

    const closed = await conversationSessionRepository.close(ctx.tenantId, id);
    return NextResponse.json({ ok: true, session: closed });
  } catch (err) {
    return handleApiError(err);
  }
}
