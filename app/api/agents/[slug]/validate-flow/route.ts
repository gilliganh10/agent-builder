import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError } from "@/lib/api-error";
import { agentRepository } from "@/repositories/agent.repository";
import { validateFlow } from "@/lib/agents/flow/validator";
import { FlowNodeSchema } from "@/lib/agents/flow/flow-definition-zod";
import type { FlowDefinition } from "@/db/agents/schema";

const ValidateFlowSchema = z.object({
  flowDefinition: z.object({
    version: z.union([z.literal(1), z.literal(2)]).optional(),
    orchestrator: z.record(z.string(), z.unknown()).optional(),
    nodes: z.array(FlowNodeSchema),
    edges: z.array(z.object({
      id: z.string(),
      source: z.string(),
      target: z.string(),
      sourceHandle: z.string().optional(),
      targetHandle: z.string().optional(),
      label: z.string().optional(),
      data: z.record(z.string(), z.unknown()).optional(),
    })),
    envVars: z.array(z.record(z.string(), z.unknown())).optional(),
  }),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = ValidateFlowSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        {
          valid: false,
          errors: [{ message: "Invalid flow definition format" }],
          error: parsed.error.flatten(),
        },
        { status: 400 }
      );
    }

    const allAgents = await agentRepository.list();
    const allSlugs = allAgents.map((a) => a.slug);

    const result = validateFlow(
      parsed.data.flowDefinition as FlowDefinition,
      allSlugs
    );

    return NextResponse.json(result);
  } catch (err) {
    return handleApiError(err);
  }
}
