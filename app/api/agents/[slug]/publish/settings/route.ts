import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError } from "@/lib/api-error";
import { agentRepository } from "@/repositories/agent.repository";
import { getPublicChatSettings, mergePublicChatSettings } from "@/lib/agents/public-chat";

const PublishSettingsSchema = z.object({
  showStateSidebar: z.boolean(),
});

export async function PATCH(
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

    const body = await request.json();
    const parsed = PublishSettingsSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const nextMeta = mergePublicChatSettings(agent.meta, {
      showStateSidebar: parsed.data.showStateSidebar,
    });

    const updated = await agentRepository.update(ctx.tenantId, agent.id, {
      meta: nextMeta,
    });

    if (!updated) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    return NextResponse.json({
      publicChat: getPublicChatSettings(updated.meta),
    });
  } catch (err) {
    return handleApiError(err);
  }
}
