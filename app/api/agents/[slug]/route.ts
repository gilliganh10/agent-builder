import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { handleApiError } from "@/lib/api-error";
import { agentRepository } from "@/repositories/agent.repository";
import { allToolNames } from "@/lib/agents/tool-registry";
import { resolveModel, type ModelPolicy } from "@/lib/agents/model-policy";
import { canEditAgentDefinition } from "@/lib/agents/agent-visibility";
import { UpdateAgentSchema } from "@/lib/agents/flow/agent-update-schemas";

type RouteContext = { params: Promise<{ slug: string }> };

export async function GET(request: Request, ctx: RouteContext) {
  try {
    const { slug } = await ctx.params;
    const tenantCtx = { tenantId: "" } as const;
    const agent = await agentRepository.findBySlug(tenantCtx.tenantId, slug);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    const latestVersion = await agentRepository.getLatestVersion(tenantCtx.tenantId, agent.id);
    return NextResponse.json({ ...agent, latestVersion });
  } catch (err) {
    return handleApiError(err);
  }
}

export async function PUT(request: Request, ctx: RouteContext) {
  try {
    const { slug } = await ctx.params;
    const tenantCtx = { tenantId: "" } as const;
    const agent = await agentRepository.findBySlug(tenantCtx.tenantId, slug);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (!canEditAgentDefinition(agent)) {
      return NextResponse.json(
        { error: "Built-in agents cannot be edited" },
        { status: 403 }
      );
    }

    const body = await request.json();
    const parsed = UpdateAgentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { changelog, modelPolicy, mode, flowDefinition, ...fields } = parsed.data;

    if (fields.allowedTools) {
      const validTools = allToolNames();
      const invalid = fields.allowedTools.filter((t) => !validTools.includes(t));
      if (invalid.length > 0) {
        return NextResponse.json(
          { error: `Unknown tools: ${invalid.join(", ")}` },
          { status: 400 }
        );
      }
    }

    const defaultModel = modelPolicy
      ? resolveModel(modelPolicy as ModelPolicy)
      : undefined;

    const meta = modelPolicy
      ? { ...agent.meta, modelPolicy }
      : agent.meta;

    const updatePayload: Parameters<typeof agentRepository.update>[2] = {
      ...fields,
      defaultModel,
      mode,
      meta,
    };

    if (flowDefinition !== undefined) {
      updatePayload.flowDefinition = flowDefinition as Parameters<typeof agentRepository.update>[2]["flowDefinition"];
    }

    const updated = await agentRepository.update(tenantCtx.tenantId, agent.id, updatePayload);
    if (!updated) {
      return NextResponse.json({ error: "Update failed" }, { status: 500 });
    }

    const latestVersion = await agentRepository.getLatestVersion(tenantCtx.tenantId, agent.id);
    const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

    await agentRepository.createVersion(tenantCtx.tenantId, agent.id, {
      version: nextVersion,
      instructions: updated.instructions,
      allowedTools: updated.allowedTools,
      defaultModel: updated.defaultModel,
      flowDefinition: updated.flowDefinition,
      changelog,
    });

    revalidatePath("/agents");
    revalidatePath(`/agents/${updated.slug}`);

    return NextResponse.json(updated);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function DELETE(request: Request, ctx: RouteContext) {
  try {
    const { slug } = await ctx.params;
    const tenantCtx = { tenantId: "" } as const;
    const agent = await agentRepository.findBySlug(tenantCtx.tenantId, slug);
    if (!agent) {
      return NextResponse.json({ error: "Agent not found" }, { status: 404 });
    }

    if (agent.kind === "built_in") {
      return NextResponse.json(
        { error: "Built-in agents cannot be deleted" },
        { status: 403 }
      );
    }

    await agentRepository.delete(tenantCtx.tenantId, agent.id);
    revalidatePath("/agents");
    revalidatePath(`/agents/${slug}`);
    return NextResponse.json({ deleted: true });
  } catch (err) {
    return handleApiError(err);
  }
}
