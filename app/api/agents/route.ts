import { NextResponse } from "next/server";
import { revalidatePath } from "next/cache";
import { z } from "zod";
import { handleApiError } from "@/lib/api-error";
import { agentRepository } from "@/repositories/agent.repository";
import { allToolNames } from "@/lib/agents/tool-registry";
import { resolveModel, ALL_MODEL_POLICIES, type ModelPolicy } from "@/lib/agents/model-policy";
import { isInternalAgent } from "@/lib/agents/agent-visibility";

const CreateAgentSchema = z.object({
  name: z.string().min(1).max(100),
  slug: z
    .string()
    .min(1)
    .max(100)
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Must be kebab-case"),
  description: z.string().max(1000).default(""),
  instructions: z.string().min(1).max(50_000),
  allowedTools: z.array(z.string()).min(0),
  modelPolicy: z.enum(ALL_MODEL_POLICIES as [string, ...string[]]).default("default"),
});

export async function GET() {
  try {
    const agents = (await agentRepository.list()).filter((agent) => !isInternalAgent(agent));
    return NextResponse.json(agents);
  } catch (err) {
    return handleApiError(err);
  }
}

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = CreateAgentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { name, slug, description, instructions, allowedTools, modelPolicy } =
      parsed.data;

    const validTools = allToolNames();
    const invalidTools = allowedTools.filter((t) => !validTools.includes(t));
    if (invalidTools.length > 0) {
      return NextResponse.json(
        { error: `Unknown tools: ${invalidTools.join(", ")}` },
        { status: 400 }
      );
    }

    const existing = await agentRepository.findBySlug(slug);
    if (existing) {
      return NextResponse.json(
        { error: `Agent with slug "${slug}" already exists` },
        { status: 409 }
      );
    }

    const defaultModel = resolveModel(modelPolicy as ModelPolicy);

    const agent = await agentRepository.create({
      name,
      slug,
      description,
      kind: "user_created",
      instructions,
      allowedTools,
      defaultModel,
      meta: { modelPolicy },
    });

    await agentRepository.createVersion(agent.id, {
      version: 1,
      instructions,
      allowedTools,
      defaultModel,
      changelog: "Initial version",
    });

    revalidatePath("/agents");
    revalidatePath(`/agents/${agent.slug}`);

    return NextResponse.json(agent, { status: 201 });
  } catch (err) {
    return handleApiError(err);
  }
}
