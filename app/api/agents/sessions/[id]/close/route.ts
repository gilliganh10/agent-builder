import { NextResponse } from "next/server";
import { handleApiError } from "@/lib/api-error";
import { conversationSessionRepository } from "@/repositories/conversation-session.repository";

export async function POST(
  request: Request,
  { params }: { params: Promise<{ id: string }> }
) {
  try {
    const { id } = await params;
    const existing = await conversationSessionRepository.findById(id);
    if (!existing) {
      return NextResponse.json({ error: "Invalid session ID" }, { status: 404 });
    }

    const closed = await conversationSessionRepository.close(id);
    return NextResponse.json({ ok: true, session: closed });
  } catch (err) {
    return handleApiError(err);
  }
}
