import { NextResponse } from "next/server";
import { z } from "zod";
import { handleApiError } from "@/lib/api-error";
import { agentRepository } from "@/repositories/agent.repository";
import { conversationSessionRepository } from "@/repositories/conversation-session.repository";
import { executeAgentRun } from "@/lib/agents/runtime";
import { resolveTools } from "@/lib/agents/tool-registry";
import { filterPublicOverrides } from "@/lib/agents/flow/env";
import { parseFlowRunOutput, eventsToMessages, extractRewrites } from "@/lib/agents/flow/output";
import { publicRateLimitGuard } from "./rate-limit";
import type { AgentSpec, AgentChatMessage, FlowDefinition, FlowRunOutput } from "@/db/agents/schema";
import { buildConversationStatePayload, getPublicChatSettings } from "@/lib/agents/public-chat";
import { createStreamSink, createSseResponse } from "@/lib/agents/streaming";

/** SSE + background run work must not be statically staged or buffered away. */
export const dynamic = "force-dynamic";
export const runtime = "nodejs";

type RouteContext = { params: Promise<{ token: string }> };

const PublicChatSchema = z.object({
  message: z.string().min(1).max(10_000),
  sessionId: z.string().max(100).optional(),
  envOverrides: z.record(z.string(), z.string()).optional(),
  stream: z.boolean().optional(),
});

/**
 * GET -- Load agent metadata for the chat UI (name, description, mode, env vars).
 */
export async function GET(_request: Request, ctx: RouteContext) {
  try {
    const { token } = await ctx.params;
    const agent = await agentRepository.findByPublishToken(token);
    if (!agent) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const publicEnvVars = (agent.flowDefinition?.envVars ?? []).filter((v) => v.publicEditable);
    const publicChatSettings = getPublicChatSettings(agent.meta);

    return NextResponse.json({
      name: agent.name,
      description: agent.description,
      mode: agent.mode,
      envVars: publicEnvVars,
      publicChat: publicChatSettings,
    });
  } catch (err) {
    return handleApiError(err);
  }
}

/**
 * POST -- Public chat endpoint. No auth required, rate-limited by IP.
 */
export async function POST(request: Request, ctx: RouteContext) {
  try {
    const ip = extractIp(request);
    await publicRateLimitGuard(ip);

    const { token } = await ctx.params;
    const agent = await agentRepository.findByPublishToken(token);
    if (!agent) {
      return NextResponse.json({ error: "Not found" }, { status: 404 });
    }

    const publicChatSettings = getPublicChatSettings(agent.meta);

    const body = await request.json();
    const parsed = PublicChatSchema.safeParse(body);
    if (!parsed.success) {
      return NextResponse.json(
        { error: parsed.error.flatten() },
        { status: 400 }
      );
    }

    const { message, sessionId: requestedSessionId, envOverrides: rawEnvOverrides, stream: wantsStream } = parsed.data;

    const agentSpec: AgentSpec = {
      definitionId: agent.id,
      name: agent.name,
      slug: agent.slug,
      instructions: agent.instructions,
      tools: resolveTools(agent.allowedTools),
      model: agent.defaultModel,
      outputSchema: agent.outputSchema,
    };

    const flowDefinition: FlowDefinition | null | undefined = agent.flowDefinition;

    // Filter env overrides to only publicly-editable vars
    let envOverrides: Record<string, string> | undefined;
    if (rawEnvOverrides && flowDefinition) {
      const overridesMap: Record<string, string> = {};
      for (const [k, v] of Object.entries(rawEnvOverrides)) {
        if (typeof v === "string") overridesMap[k] = v;
      }
      envOverrides = filterPublicOverrides(overridesMap, flowDefinition);
    }

    const publishedEnvOverrides = (agent.meta as Record<string, unknown>).publishedEnvOverrides as Record<string, string> | undefined;

    let sessionId: string | undefined;
    let sessionEnvOverrides: Record<string, string> | undefined;
    if (agent.mode === "conversational") {
      const participantId = `public:${hashIp(ip)}`;
      if (requestedSessionId) {
        const existing = await conversationSessionRepository.findById(requestedSessionId);
        if (!existing || existing.agentDefinitionId !== agent.id) {
          return NextResponse.json({ error: "Invalid session" }, { status: 400 });
        }
        if (existing.status === "closed") {
          return NextResponse.json({ error: "Session closed" }, { status: 400 });
        }
        sessionId = existing.id;
        sessionEnvOverrides = (existing.meta as Record<string, unknown>).envOverrides as Record<string, string> | undefined;
      } else {
        const session = await conversationSessionRepository.create({
          agentDefinitionId: agent.id,
          participantId,
          meta: envOverrides ? { envOverrides } : {},
        });
        sessionId = session.id;
        sessionEnvOverrides = envOverrides;
      }
    }

    const triggeredBy = `public:${hashIp(ip)}`;

    // -----------------------------------------------------------------------
    // SSE streaming path
    // -----------------------------------------------------------------------
    if (wantsStream) {
      const { sink, stream, clientAbortSignal } = createStreamSink("", sessionId ?? null);

      const runPromise = (async () => {
        try {
          const agentRun = await executeAgentRun({
            agentSpec,
            input: message,
            triggeredBy,
            sessionId,
            flowDefinition,
            envOverrides,
            publishedEnvOverrides,
            sessionEnvOverrides,
            sink,
            signal: clientAbortSignal,
          });

          if (agentRun.status === "failed") {
            sink.emit("error", {
              message: agentRun.error ?? "Agent run failed",
            });
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

    // -----------------------------------------------------------------------
    // Classic JSON path (default, backward-compatible)
    // -----------------------------------------------------------------------
    const agentRun = await executeAgentRun({
      agentSpec,
      input: message,
      triggeredBy,
      sessionId,
      flowDefinition,
      envOverrides,
      publishedEnvOverrides,
      sessionEnvOverrides,
    });

    const flowOutput: FlowRunOutput | null = parseFlowRunOutput(agentRun.finalOutput);
    let messages: AgentChatMessage[];
    let rewrites: ReturnType<typeof extractRewrites> = [];

    if (flowOutput) {
      messages = eventsToMessages(flowOutput.events);
      rewrites = extractRewrites(flowOutput.events);
    } else {
      messages = agentRun.finalOutput ? [{ content: agentRun.finalOutput }] : [];
    }

    const statePayload = publicChatSettings.showStateSidebar
      ? buildConversationStatePayload(flowOutput?.orchestratorState)
      : undefined;

    return NextResponse.json({
      sessionId,
      runId: agentRun.id,
      status: agentRun.status,
      messages,
      rewrites,
      error: agentRun.error,
      ...(publicChatSettings.showStateSidebar && statePayload ? statePayload : {}),
    });
  } catch (err) {
    return handleApiError(err);
  }
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function extractIp(req: Request): string {
  const forwarded = req.headers.get("x-forwarded-for") ?? "unknown";
  return forwarded.split(",")[0].trim();
}

function hashIp(ip: string): string {
  let hash = 0;
  for (let i = 0; i < ip.length; i++) {
    const char = ip.charCodeAt(i);
    hash = ((hash << 5) - hash) + char;
    hash |= 0;
  }
  return Math.abs(hash).toString(36);
}
