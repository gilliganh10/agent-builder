import type {
  AgentCarouselItem,
  AgentMessageAction,
  AgentStructuredMessageContent,
  JSONValue,
} from "@/db/agents/schema";

function isRecord(value: unknown): value is Record<string, unknown> {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function coerceJsonValue(value: unknown): JSONValue | undefined {
  if (
    value === null ||
    typeof value === "string" ||
    typeof value === "number" ||
    typeof value === "boolean"
  ) {
    return value;
  }

  if (Array.isArray(value)) {
    const coerced = value
      .map((entry) => coerceJsonValue(entry))
      .filter((entry): entry is JSONValue => entry !== undefined);
    return coerced;
  }

  if (isRecord(value)) {
    const record: Record<string, JSONValue> = {};
    for (const [key, entry] of Object.entries(value)) {
      const coerced = coerceJsonValue(entry);
      if (coerced !== undefined) {
        record[key] = coerced;
      }
    }
    return record;
  }

  return undefined;
}

export function coerceAgentMessageAction(
  value: unknown
): AgentMessageAction | undefined {
  if (!isRecord(value)) return undefined;
  if (typeof value.id !== "string" || typeof value.label !== "string") return undefined;

  const variant = value.variant;
  const payload = isRecord(value.payload)
    ? (coerceJsonValue(value.payload) as Record<string, JSONValue> | undefined)
    : undefined;
  const analytics = isRecord(value.analytics)
    ? {
        eventName:
          typeof value.analytics.eventName === "string"
            ? value.analytics.eventName
            : "agent_message_action",
        properties: isRecord(value.analytics.properties)
          ? (coerceJsonValue(value.analytics.properties) as Record<string, JSONValue> | undefined)
          : undefined,
      }
    : undefined;

  return {
    id: value.id,
    label: value.label,
    ...(variant === "primary" || variant === "secondary" || variant === "ghost"
      ? { variant }
      : {}),
    ...(payload ? { payload } : {}),
    ...(analytics ? { analytics } : {}),
  };
}

function coerceCarouselItem(value: unknown): AgentCarouselItem | undefined {
  if (!isRecord(value)) return undefined;
  if (typeof value.id !== "string" || typeof value.title !== "string") return undefined;

  const primaryAction = coerceAgentMessageAction(value.primaryAction);
  const secondaryAction = coerceAgentMessageAction(value.secondaryAction);
  const metadata = isRecord(value.metadata)
    ? (coerceJsonValue(value.metadata) as Record<string, JSONValue> | undefined)
    : undefined;

  return {
    id: value.id,
    title: value.title,
    ...(typeof value.subtitle === "string" ? { subtitle: value.subtitle } : {}),
    ...(typeof value.description === "string" ? { description: value.description } : {}),
    ...(typeof value.badge === "string" ? { badge: value.badge } : {}),
    ...(metadata ? { metadata } : {}),
    ...(typeof value.imageUrl === "string" || value.imageUrl === null
      ? { imageUrl: value.imageUrl }
      : {}),
    ...(primaryAction ? { primaryAction } : {}),
    ...(secondaryAction ? { secondaryAction } : {}),
  };
}

export function coerceStructuredMessageContent(
  value: unknown
): AgentStructuredMessageContent | undefined {
  if (!isRecord(value) || typeof value.type !== "string") return undefined;

  if (value.type === "cta") {
    if (typeof value.title !== "string" || typeof value.body !== "string") {
      return undefined;
    }

    const primaryAction = coerceAgentMessageAction(value.primaryAction);
    const secondaryAction = coerceAgentMessageAction(value.secondaryAction);

    return {
      type: "cta",
      title: value.title,
      body: value.body,
      ...(primaryAction ? { primaryAction } : {}),
      ...(secondaryAction ? { secondaryAction } : {}),
    };
  }

  if (value.type === "carousel") {
    if (typeof value.title !== "string" || !Array.isArray(value.items)) return undefined;

    const items = value.items
      .map((entry) => coerceCarouselItem(entry))
      .filter((entry): entry is AgentCarouselItem => Boolean(entry));

    if (items.length === 0) return undefined;

    return {
      type: "carousel",
      title: value.title,
      ...(typeof value.body === "string" ? { body: value.body } : {}),
      items,
    };
  }

  return undefined;
}

export function summarizeStructuredMessageContent(
  content: AgentStructuredMessageContent | undefined
): string | null {
  if (!content) return null;

  if (content.type === "cta") {
    return `${content.title}: ${content.body}`;
  }

  const firstItem = content.items[0];
  if (!firstItem) return content.title;
  return `${content.title}: ${firstItem.title}`;
}
