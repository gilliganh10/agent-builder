import type {
  RuntimeEvent,
  FlowRunOutput,
  AgentChatMessage,
} from "@/db/agents/schema";
import {
  coerceStructuredMessageContent,
  summarizeStructuredMessageContent,
} from "@/lib/agents/chat-message-content";

// ---------------------------------------------------------------------------
// Parse the JSON finalOutput of a flow run into a typed FlowRunOutput.
// Falls back gracefully for legacy (pre-structured) outputs.
// ---------------------------------------------------------------------------

export function parseFlowRunOutput(finalOutput: string | null | undefined): FlowRunOutput | null {
  if (!finalOutput) return null;

  try {
    const parsed = JSON.parse(finalOutput);

    if (Array.isArray(parsed.events)) {
      return parsed as FlowRunOutput;
    }

    return legacyToFlowRunOutput(parsed);
  } catch {
    return null;
  }
}

// ---------------------------------------------------------------------------
// Convert legacy merged-object format into FlowRunOutput with events
// ---------------------------------------------------------------------------

function legacyToFlowRunOutput(obj: Record<string, unknown>): FlowRunOutput {
  const events: RuntimeEvent[] = [];

  const messages = obj.messages as unknown[] | undefined;
  if (Array.isArray(messages)) {
    for (const entry of messages) {
      if (typeof entry === "string") {
        events.push({ type: "message", nodeId: "unknown", content: entry, display: { nodeId: "unknown", name: "Agent", color: null, side: "left" } });
      } else if (entry && typeof entry === "object" && "content" in entry) {
        const m = entry as Record<string, unknown>;
        const secondaryRaw = m.secondaryMessage ?? m.secondaryContent;
        const secondaryContent =
          typeof secondaryRaw === "string" ? secondaryRaw : undefined;
        events.push({
          type: "message",
          nodeId: (m.nodeId as string) ?? "unknown",
          content:
            typeof m.content === "string"
              ? m.content
              : summarizeStructuredMessageContent(
                coerceStructuredMessageContent(m.structuredContent)
              ) ?? "",
          ...(secondaryContent ? { secondaryContent } : {}),
          ...(coerceStructuredMessageContent(m.structuredContent)
            ? { structuredContent: coerceStructuredMessageContent(m.structuredContent) }
            : {}),
          display: {
            nodeId: (m.nodeId as string) ?? "unknown",
            name: (m.displayName as string) ?? "Agent",
            color: (m.displayColor as string) ?? null,
            side: (m.displaySide as "left" | "right") ?? "left",
          },
        });
      }
    }
  }

  for (const [key, value] of Object.entries(obj)) {
    if (key === "messages") continue;
    if (value && typeof value === "object" && "_display" in (value as Record<string, unknown>)) {
      const node = value as Record<string, unknown>;
      const display = node._display as Record<string, unknown>;
      const structuredContent = coerceStructuredMessageContent(node.structuredContent);
      const content = typeof node.message === "string"
        ? node.message
        : summarizeStructuredMessageContent(structuredContent) ?? JSON.stringify(node);
      events.push({
        type: "message",
        nodeId: (display.nodeId as string) ?? key,
        content,
        ...(structuredContent ? { structuredContent } : {}),
        display: {
          nodeId: (display.nodeId as string) ?? key,
          name: (display.name as string) ?? "Agent",
          color: (display.color as string) ?? null,
          side: (display.side as "left" | "right") ?? "left",
        },
      });
    }
  }

  return { events };
}

// ---------------------------------------------------------------------------
// Convert runtime events to AgentChatMessage[] for the UI
// ---------------------------------------------------------------------------

export function eventsToMessages(events: RuntimeEvent[]): AgentChatMessage[] {
  const messages: AgentChatMessage[] = [];

  for (const event of events) {
    if (event.type === "message") {
      messages.push({
        content: event.content,
        ...(event.secondaryContent ? { secondaryContent: event.secondaryContent } : {}),
        ...(event.structuredContent ? { structuredContent: event.structuredContent } : {}),
        nodeId: event.nodeId,
        displayName: event.display.name,
        displayColor: event.display.color ?? undefined,
        displaySide: event.display.side,
      });
    } else if (event.type === "goal_achieved") {
      messages.push({
        content: `Goal achieved: ${event.goalName}`,
        nodeId: "goal-achieved",
        displayName: "System",
        displaySide: "left",
      });
    } else if (event.type === "conversation_closed") {
      messages.push({
        content: event.message ?? "Conversation complete.",
        nodeId: "conversation-closed",
        displayName: "System",
        displaySide: "left",
      });
    }
  }

  return messages;
}

// ---------------------------------------------------------------------------
// Extract rewrite events for UI rendering
// ---------------------------------------------------------------------------

export interface RewriteInfo {
  original: string;
  rewritten: string;
  explanation?: string;
  nodeId: string;
}

export function extractRewrites(events: RuntimeEvent[]): RewriteInfo[] {
  return events
    .filter((e): e is Extract<RuntimeEvent, { type: "rewrite_user_message" }> => e.type === "rewrite_user_message")
    .map((e) => ({ original: e.original, rewritten: e.rewritten, explanation: e.explanation, nodeId: e.nodeId }));
}
