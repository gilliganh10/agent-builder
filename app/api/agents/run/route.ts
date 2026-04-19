import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError } from "@/lib/api-error";
import { agentRepository } from "@/repositories/agent.repository";
import { conversationSessionRepository } from "@/repositories/conversation-session.repository";
import { executeAgentRun } from "@/lib/agents/runtime";
import { resolveTools } from "@/lib/agents/tool-registry";
import type { AgentSpec } from "@/db/agents/schema";
import { createStreamSink, createSseResponse } from "@/lib/agents/streaming";

export const dynamic = "force-dynamic";
export const runtime = "nodejs";

const RunAgentSchema = z.object({
  agentSlug: z.string().min(1).max(100),
  input: z.string().min(1).max(50_000),
  conversationInput: z.string().min(1).max(50_000).optional(),
  sessionId: z.string().max(100).optional(),
  envOverrides: z.record(z.string(), z.string()).optional(),
  stream: z.boolean().optional(),
});

export async function POST(request: Request) {
  try {
    const body = await request.json();
    const parsed = RunAgentSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json({ error: parsed.error.flatten() }, { status: 400 });
    }

    const {
      agentSlug,
      input,
      conversationInput: requestedConversationInput,
      sessionId: requestedSessionId,
      envOverrides,
      stream: wantsStream,
    } = parsed.data;
    const conversationInput = requestedConversationInput ?? input;

    // Single-scope OSS build: no auth, so we attribute runs to a local user.
    const triggeredBy = "local@agent-builder";

    const definition = await agentRepository.findBySlug(agentSlug);
    if (!definition) {
      return NextResponse.json({ error: `Agent not found: ${agentSlug}` }, { status: 404 });
    }

    const agentSpec: AgentSpec = {
      definitionId: definition.id,
      name: definition.name,
      slug: definition.slug,
      instructions: definition.instructions,
      tools: resolveTools(definition.allowedTools),
      model: definition.defaultModel,
      outputSchema: definition.outputSchema,
    };
    const flowDefinition = definition.flowDefinition;
    const agentMode = definition.mode;

    let sessionId: string | undefined;
    if (agentMode === "conversational") {
      if (requestedSessionId) {
        const existing = await conversationSessionRepository.findById(requestedSessionId);
        if (!existing || existing.agentDefinitionId !== agentSpec.definitionId) {
          return NextResponse.json({ error: "Invalid session ID" }, { status: 400 });
        }
        if (existing.status === "closed") {
          return NextResponse.json({ error: "Session is closed" }, { status: 400 });
        }
        sessionId = existing.id;
      } else {
        const newSession = await conversationSessionRepository.create({
          agentDefinitionId: agentSpec.definitionId,
          participantId: triggeredBy,
        });
        sessionId = newSession.id;
      }
    }

    const runMeta = { conversationInput };

    if (wantsStream) {
      const { sink, stream, clientAbortSignal } = createStreamSink("", sessionId ?? null);

      const runPromise = (async () => {
        try {
          const agentRun = await executeAgentRun({
            agentSpec,
            input,
            triggeredBy,
            sessionId,
            flowDefinition,
            envOverrides,
            meta: runMeta,
            sink,
            signal: clientAbortSignal,
          });

          if (agentRun.status === "failed") {
            sink.emit("error", { message: agentRun.error ?? "Agent run failed" });
            return;
          }

          sink.emit("done", {
            runId: agentRun.id,
            sessionId: sessionId ?? null,
            finalOutput: agentRun.finalOutput ?? null,
            artifacts: agentRun.artifacts,
            meta: agentRun.meta,
          });
        } catch (err) {
          const message = err instanceof Error ? err.message : String(err);
          sink.emit("error", { message });
        } finally {
          sink.close();
        }
      })();

      runPromise.catch(() => {});

      return createSseResponse(stream);
    }

    const agentRun = await executeAgentRun({
      agentSpec,
      input,
      triggeredBy,
      sessionId,
      flowDefinition,
      envOverrides,
      meta: runMeta,
    });

    return NextResponse.json({ ...agentRun, sessionId });
  } catch (err) {
    return handleApiError(err);
  }
}
