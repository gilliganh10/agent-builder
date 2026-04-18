import type { JSONValue } from "@/db/agents/schema";

export type StateDisplayTone = "default" | "success" | "warning" | "danger" | "info";

export interface StateValueDisplay {
  kind: "empty" | "status" | "json" | "text";
  text: string;
  multiline: boolean;
  tone: StateDisplayTone;
}

export function getChangedStateKeys(
  currentState: Record<string, unknown> | null | undefined,
  previousState: Record<string, unknown> | null | undefined
): Set<string> {
  if (!currentState || !previousState) {
    return new Set();
  }

  const changed = new Set<string>();
  const keys = new Set([...Object.keys(currentState), ...Object.keys(previousState)]);

  for (const key of keys) {
    if (stableStringify(currentState[key]) !== stableStringify(previousState[key])) {
      changed.add(key);
    }
  }

  return changed;
}

export function formatStateValue(value: unknown): StateValueDisplay {
  if (value === null || value === undefined) {
    return {
      kind: "empty",
      text: "—",
      multiline: false,
      tone: "default",
    };
  }

  if (typeof value === "boolean") {
    return {
      kind: "status",
      text: value ? "true" : "false",
      multiline: false,
      tone: value ? "success" : "default",
    };
  }

  if (typeof value === "number") {
    return {
      kind: "text",
      text: Number.isInteger(value) ? value.toString() : value.toFixed(2).replace(/\.?0+$/, ""),
      multiline: false,
      tone: "default",
    };
  }

  if (typeof value === "string") {
    const normalized = value.trim().toLowerCase();
    const tone = getSemanticTone(normalized);

    if (tone !== "default") {
      return {
        kind: "status",
        text: value,
        multiline: false,
        tone,
      };
    }

    return {
      kind: "text",
      text: value || '""',
      multiline: value.includes("\n") || value.length > 80,
      tone: "default",
    };
  }

  return {
    kind: "json",
    text: JSON.stringify(value as JSONValue, null, 2),
    multiline: true,
    tone: "default",
  };
}

export function getGoalStatusTone(status: string): StateDisplayTone {
  return getSemanticTone(status.trim().toLowerCase());
}

function getSemanticTone(value: string): StateDisplayTone {
  if (["achieved", "accepted", "completed", "course_saved", "saved_for_later", "success", "surfaced", "qualified", "true"].includes(value)) {
    return "success";
  }

  if (["candidate", "running", "active", "pending", "save_course", "save_preference", "course_now", "in_progress"].includes(value)) {
    return "warning";
  }

  if (["failed", "dismissed", "error", "closed", "rejected", "false"].includes(value)) {
    return "danger";
  }

  if (["identified", "none"].includes(value)) {
    return "info";
  }

  return "default";
}

function stableStringify(value: unknown): string {
  if (value === undefined) {
    return "undefined";
  }

  return JSON.stringify(value, replacer);
}

function replacer(_key: string, value: unknown): unknown {
  if (!value || typeof value !== "object" || Array.isArray(value)) {
    return value;
  }

  return Object.keys(value as Record<string, unknown>)
    .sort()
    .reduce<Record<string, unknown>>((acc, key) => {
      acc[key] = (value as Record<string, unknown>)[key];
      return acc;
    }, {});
}
