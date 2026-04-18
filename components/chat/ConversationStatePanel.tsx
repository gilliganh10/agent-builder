"use client";

import type { ReactNode } from "react";
import { Badge } from "@/components/ui/badge";
import { cn } from "@/lib/utils";
import type { AgentConversationGoalState } from "@/db/agents/schema";
import { Database, Lock, Sparkles, Target } from "lucide-react";
import {
  formatStateValue,
  getChangedStateKeys,
  getGoalStatusTone,
  type StateDisplayTone,
} from "./conversation-state-utils";

interface ConversationStatePanelProps {
  state?: Record<string, unknown> | null;
  previousState?: Record<string, unknown> | null;
  goals?: AgentConversationGoalState[];
  locks?: string[];
  title?: string;
  description?: string;
  emptyTitle?: string;
  emptyBody?: string;
  compact?: boolean;
  className?: string;
}

export function ConversationStatePanel({
  state,
  previousState,
  goals = [],
  locks = [],
  title = "State & goals",
  description = "Live variables and goal status for this conversation.",
  emptyTitle = "No state yet",
  emptyBody = "State will appear here once this conversation starts updating variables or goals.",
  compact = false,
  className,
}: ConversationStatePanelProps) {
  const stateEntries = Object.entries(state ?? {});
  const changedKeys = getChangedStateKeys(state, previousState);
  const hasState = stateEntries.length > 0;
  const hasGoals = goals.length > 0;
  const hasContent = hasState || hasGoals;

  return (
    <div className={cn("flex h-full flex-col gap-4", className)}>
      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/8 text-primary">
            <Database className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
          </div>
          <div className="min-w-0">
            <h3 className={cn("font-semibold tracking-tight text-foreground", compact ? "text-xs" : "text-sm")}>
              {title}
            </h3>
            <p className={cn("text-muted-foreground", compact ? "text-[11px]" : "text-xs")}>
              {description}
            </p>
          </div>
        </div>
      </div>

      {!hasContent ? (
        <div className="rounded-[22px] border border-dashed border-border/80 bg-muted/20 px-4 py-5 text-center">
          <p className={cn("font-medium text-foreground", compact ? "text-xs" : "text-sm")}>
            {emptyTitle}
          </p>
          <p className={cn("mt-1 text-muted-foreground", compact ? "text-[11px]" : "text-xs")}>
            {emptyBody}
          </p>
        </div>
      ) : null}

      {hasState ? (
        <section className="space-y-2.5">
          <div className="flex items-center justify-between">
            <p
              className={cn(
                "font-medium uppercase tracking-[0.16em] text-muted-foreground",
                compact ? "text-[10px]" : "text-[11px]",
              )}
            >
              Variables
            </p>
            <Badge variant="outline" className="rounded-full text-[10px]">
              {stateEntries.length}
            </Badge>
          </div>
          <div className="space-y-2.5">
            {stateEntries.map(([key, value]) => {
              const display = formatStateValue(value);
              const previousValue = previousState?.[key];
              const previousDisplay = changedKeys.has(key)
                ? formatStateValue(previousValue)
                : null;

              return (
                <div
                  key={key}
                  className={cn(
                    "rounded-[22px] border bg-card px-3.5 py-3.5 shadow-sm",
                    changedKeys.has(key)
                      ? "border-primary/25 ring-1 ring-primary/10"
                      : "border-border/70",
                  )}
                >
                  <div className="flex items-center gap-2">
                    <span className={cn("font-mono text-foreground", compact ? "text-[11px]" : "text-xs")}>
                      {key}
                    </span>
                    {locks.includes(key) ? (
                      <Lock className="h-3 w-3 text-muted-foreground" />
                    ) : null}
                    {changedKeys.has(key) ? (
                      <Badge className="rounded-full bg-primary text-primary-foreground text-[10px]">
                        <Sparkles className="mr-1 h-2.5 w-2.5" />
                        Updated
                      </Badge>
                    ) : null}
                  </div>
                  <StateValueBlock display={display} compact={compact} className="mt-2.5" />
                  {previousDisplay ? (
                    <div className="mt-2.5 rounded-2xl bg-muted/30 px-3 py-2.5">
                      <p className="text-[10px] uppercase tracking-[0.14em] text-muted-foreground">
                        Previous value
                      </p>
                      <StateValueBlock display={previousDisplay} compact className="mt-1.5" />
                    </div>
                  ) : null}
                </div>
              );
            })}
          </div>
        </section>
      ) : null}

      {hasGoals ? (
        <section className="space-y-2.5">
          <div className="flex items-center gap-2">
            <div className="flex h-8 w-8 items-center justify-center rounded-2xl bg-primary/8 text-primary">
              <Target className={compact ? "h-3.5 w-3.5" : "h-4 w-4"} />
            </div>
            <p
              className={cn(
                "font-medium uppercase tracking-[0.16em] text-muted-foreground",
                compact ? "text-[10px]" : "text-[11px]",
              )}
            >
              Goals
            </p>
          </div>
          <div className="space-y-2.5">
            {goals.map((goal) => (
              <div key={goal.id} className="rounded-[22px] border border-border/70 bg-card px-3.5 py-3.5 shadow-sm">
                <div className="flex items-start gap-2">
                  <StatusBadge tone={getGoalStatusTone(goal.status)}>{goal.status}</StatusBadge>
                  <div className="min-w-0">
                    <p className={cn("font-medium text-foreground", compact ? "text-[11px]" : "text-xs")}>
                      {goal.description}
                    </p>
                    <p className="mt-1 font-mono text-[10px] text-muted-foreground">{goal.id}</p>
                  </div>
                </div>
              </div>
            ))}
          </div>
        </section>
      ) : null}
    </div>
  );
}

function StateValueBlock({
  display,
  compact,
  className,
}: {
  display: ReturnType<typeof formatStateValue>;
  compact: boolean;
  className?: string;
}) {
  if (display.kind === "status") {
    return (
      <div className={className}>
        <StatusBadge tone={display.tone}>{display.text}</StatusBadge>
      </div>
    );
  }

  if (display.kind === "json" || display.multiline) {
    return (
      <pre
        className={cn(
          "overflow-x-auto rounded-2xl bg-primary px-3 py-2.5 font-mono text-primary-foreground",
          compact ? "text-[10px]" : "text-[11px]",
          className,
        )}
      >
        {display.text}
      </pre>
    );
  }

  return (
    <p className={cn("text-foreground", compact ? "text-[11px]" : "text-xs", className)}>
      {display.text}
    </p>
  );
}

function StatusBadge({
  tone,
  children,
}: {
  tone: StateDisplayTone;
  children: ReactNode;
}) {
  const toneClass =
    tone === "success"
      ? "border-emerald-200 bg-emerald-50 text-emerald-700"
      : tone === "warning"
        ? "border-amber-200 bg-amber-50 text-amber-700"
        : tone === "danger"
          ? "border-rose-200 bg-rose-50 text-rose-700"
          : tone === "info"
            ? "border-sky-200 bg-sky-50 text-sky-700"
            : "border-border bg-muted/40 text-muted-foreground";

  return (
    <span
      className={cn(
        "inline-flex items-center rounded-full border px-2 py-0.5 text-[10px] font-medium capitalize",
        toneClass,
      )}
    >
      {children}
    </span>
  );
}
