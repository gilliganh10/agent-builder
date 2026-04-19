"use client";

import { useState } from "react";
import {
  Bookmark,
  ChevronDown,
  ChevronUp,
  Loader2,
  Sparkles,
} from "lucide-react";
import type {
  AgentMessageAction,
  AgentStructuredMessageContent,
} from "@/db/agents/schema";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  Carousel,
  CarouselContent,
  CarouselItem,
  CarouselNext,
  CarouselPrevious,
} from "@/components/ui/carousel";

export interface RenderableChatEntry {
  role: "user" | "user_rewritten" | "agent" | "system" | "error";
  content: string;
  secondaryContent?: string;
  structuredContent?: AgentStructuredMessageContent;
  originalContent?: string;
  explanation?: string;
  displayName?: string;
  displayColor?: string;
  displaySide?: "left" | "right";
}

interface ChatBubbleProps {
  entry: RenderableChatEntry;
  compact?: boolean;
  onAction?: (action: AgentMessageAction) => Promise<void>;
}

export function ChatBubble({ entry, compact, onAction }: ChatBubbleProps) {
  const textSize = compact ? "text-xs" : "text-sm";

  if (entry.role === "user") {
    return (
      <div className="flex justify-end">
        <div
          className={cn(
            "max-w-[85%] rounded-[24px] rounded-br-md bg-primary px-4 py-2.5 text-primary-foreground shadow-sm",
            textSize,
          )}
        >
          {entry.content}
        </div>
      </div>
    );
  }

  if (entry.role === "user_rewritten") {
    return <RewrittenBubble entry={entry} textSize={textSize} />;
  }

  if (entry.role === "error") {
    return (
      <div className="text-center">
        <span className="inline-block rounded-full bg-destructive/10 px-3 py-1 text-xs text-destructive shadow-sm">
          {entry.content}
        </span>
      </div>
    );
  }

  if (entry.role === "system") {
    return (
      <div className="text-center">
        <span className="inline-block rounded-full border border-border/70 bg-muted/40 px-3 py-1 text-xs text-muted-foreground">
          {entry.content}
        </span>
      </div>
    );
  }

  const side = entry.displaySide ?? "left";
  const bgColor = entry.displayColor ?? "#CDD5D1";
  const textColor = isLightColor(bgColor) ? "#222E50" : "#ffffff";

  return (
    <div className={`flex ${side === "right" ? "justify-end" : "justify-start"}`}>
      <div className="max-w-[92%]">
        {entry.displayName && (
          <p className="mb-1 px-1.5 text-[10px] font-medium uppercase tracking-[0.16em] text-muted-foreground">
            {entry.displayName}
          </p>
        )}

        {entry.structuredContent ? (
          <StructuredMessageCard
            content={entry.structuredContent}
            accentColor={entry.displayColor ?? "#946E83"}
            compact={compact}
            onAction={onAction}
          />
        ) : (
          <div
            className={cn(
              "rounded-[24px] border border-border/60 px-4 py-3 shadow-sm",
              side === "right" ? "rounded-br-md" : "rounded-bl-md",
              textSize,
            )}
            style={{ backgroundColor: bgColor, color: textColor }}
          >
            <PrimarySecondaryMessageBody
              primary={entry.content}
              secondary={entry.secondaryContent}
              textColor={textColor}
              compact={compact}
            />
          </div>
        )}
      </div>
    </div>
  );
}

/** When the flow emits primary + secondary (e.g. JSON roles), secondary is revealed on click. */
function PrimarySecondaryMessageBody({
  primary,
  secondary,
  textColor,
  compact,
}: {
  primary: string;
  secondary?: string;
  textColor: string;
  compact?: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  if (!secondary?.trim()) {
    return <div>{primary}</div>;
  }

  return (
    <div className="space-y-0">
      <button
        type="button"
        onClick={() => setExpanded((v) => !v)}
        aria-expanded={expanded}
        className={cn(
          "w-full rounded-lg px-1 py-0.5 text-left transition-colors",
          "border border-transparent hover:border-black/15 hover:bg-black/[0.07] dark:hover:border-white/20 dark:hover:bg-white/[0.08]",
          "focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 focus-visible:outline-none",
        )}
        style={{ color: textColor }}
      >
        <span
          className={cn(
            "block underline decoration-dotted decoration-2 underline-offset-4",
            compact ? "text-xs font-medium" : "text-sm font-medium",
          )}
        >
          {primary}
        </span>
        <span className="mt-1 flex items-center gap-1 text-[10px] font-normal no-underline opacity-85">
          <ChevronDown
            className={cn("h-3 w-3 shrink-0 transition-transform", expanded && "rotate-180")}
            aria-hidden
          />
          {expanded ? "Hide additional message" : "More — click to expand"}
        </span>
      </button>
      {expanded ? (
        <p
          className={cn(
            "mt-2 border-t border-black/15 pt-2 leading-snug opacity-95 dark:border-white/15",
            compact ? "text-[10px]" : "text-xs",
          )}
          style={{ color: textColor }}
        >
          {secondary}
        </p>
      ) : null}
    </div>
  );
}

function StructuredMessageCard({
  content,
  accentColor,
  compact,
  onAction,
}: {
  content: AgentStructuredMessageContent;
  accentColor: string;
  compact?: boolean;
  onAction?: (action: AgentMessageAction) => Promise<void>;
}) {
  const [pendingActionId, setPendingActionId] = useState<string | null>(null);
  const [resolvedAction, setResolvedAction] = useState<AgentMessageAction | null>(null);

  const disabled = pendingActionId !== null || resolvedAction !== null || !onAction;

  async function handleAction(action: AgentMessageAction) {
    if (!onAction || disabled) return;
    setPendingActionId(action.id);
    try {
      await onAction(action);
      setResolvedAction(action);
    } catch {
      setResolvedAction(null);
    } finally {
      setPendingActionId(null);
    }
  }

  return (
    <div
      className="overflow-hidden rounded-[24px] border bg-card text-card-foreground shadow-sm"
      style={{ borderColor: `${accentColor}33` }}
    >
      <div
        className="flex items-center gap-2 border-b px-4 py-2"
        style={{ borderColor: `${accentColor}26`, backgroundColor: `${accentColor}12` }}
      >
        <Sparkles className="h-3.5 w-3.5" style={{ color: accentColor }} />
        <span className="text-[10px] font-semibold uppercase tracking-[0.16em]" style={{ color: accentColor }}>
          Learning opportunity
        </span>
      </div>

      {content.type === "cta" ? (
        <div className="space-y-3 p-4">
          <div className="space-y-1">
            <h4 className={compact ? "text-sm font-semibold" : "text-base font-semibold"}>
              {content.title}
            </h4>
            <p className={compact ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground"}>
              {content.body}
            </p>
          </div>
          <div className="flex flex-wrap gap-2">
            <ActionButton
              action={content.primaryAction}
              pendingActionId={pendingActionId}
              disabled={disabled}
              onClick={handleAction}
            />
            {content.secondaryAction && (
              <ActionButton
                action={content.secondaryAction}
                pendingActionId={pendingActionId}
                disabled={disabled}
                onClick={handleAction}
              />
            )}
          </div>
        </div>
      ) : (
        <div className="space-y-3 p-4">
          <div className="space-y-1">
            <h4 className={compact ? "text-sm font-semibold" : "text-base font-semibold"}>
              {content.title}
            </h4>
            {content.body && (
              <p className={compact ? "text-xs text-muted-foreground" : "text-sm text-muted-foreground"}>
                {content.body}
              </p>
            )}
          </div>

          <div className={content.items.length > 1 ? "px-10" : ""}>
            <Carousel
              opts={{ align: "start", loop: false }}
              className="w-full"
            >
              <CarouselContent>
                {content.items.map((item) => (
                  <CarouselItem key={item.id}>
                    <div className="rounded-2xl border border-border/60 bg-background p-4">
                      <div className="space-y-2">
                        <div className="flex flex-wrap items-center gap-2">
                          <h5 className="text-sm font-semibold">{item.title}</h5>
                          {item.badge && (
                            <Badge variant="outline" className="text-[10px]">
                              {item.badge}
                            </Badge>
                          )}
                        </div>
                        {item.subtitle && (
                          <p className="text-xs font-medium uppercase tracking-[0.16em] text-muted-foreground">
                            {item.subtitle}
                          </p>
                        )}
                        {item.description && (
                          <p className="text-sm text-muted-foreground">{item.description}</p>
                        )}
                        {item.metadata && Object.keys(item.metadata).length > 0 && (
                          <div className="flex flex-wrap gap-1.5">
                            {Object.entries(item.metadata).map(([key, value]) => (
                              <Badge key={key} variant="secondary" className="text-[10px]">
                                {key}: {String(value)}
                              </Badge>
                            ))}
                          </div>
                        )}
                      </div>

                      <div className="mt-4 flex flex-wrap gap-2">
                        <ActionButton
                          action={item.primaryAction}
                          pendingActionId={pendingActionId}
                          disabled={disabled}
                          onClick={handleAction}
                        />
                        {item.secondaryAction && (
                          <ActionButton
                            action={item.secondaryAction}
                            pendingActionId={pendingActionId}
                            disabled={disabled}
                            onClick={handleAction}
                          />
                        )}
                      </div>
                    </div>
                  </CarouselItem>
                ))}
              </CarouselContent>
              {content.items.length > 1 && (
                <>
                  <CarouselPrevious className="-left-4 h-8 w-8 border-border/70 bg-background" />
                  <CarouselNext className="-right-4 h-8 w-8 border-border/70 bg-background" />
                </>
              )}
            </Carousel>
          </div>
        </div>
      )}

      {resolvedAction && (
        <div className="border-t bg-muted/40 px-4 py-2 text-[11px] text-muted-foreground">
          Selected: <span className="font-medium text-foreground">{resolvedAction.label}</span>
        </div>
      )}
    </div>
  );
}

function ActionButton({
  action,
  pendingActionId,
  disabled,
  onClick,
}: {
  action: AgentMessageAction;
  pendingActionId: string | null;
  disabled: boolean;
  onClick: (action: AgentMessageAction) => Promise<void>;
}) {
  const variant = action.variant ?? "primary";
  const buttonVariant = variant === "ghost"
    ? "ghost"
    : variant === "secondary"
      ? "outline"
      : "default";

  return (
    <Button
      type="button"
      size="sm"
      variant={buttonVariant}
      className={variant === "primary" ? "bg-primary text-primary-foreground hover:bg-primary/90" : undefined}
      disabled={disabled}
      onClick={() => void onClick(action)}
    >
      {pendingActionId === action.id ? <Loader2 className="mr-1.5 h-3.5 w-3.5 animate-spin" /> : null}
      {action.id.includes("save") ? <Bookmark className="mr-1.5 h-3.5 w-3.5" /> : null}
      {action.label}
    </Button>
  );
}

function RewrittenBubble({
  entry,
  textSize,
}: {
  entry: RenderableChatEntry;
  textSize: string;
}) {
  const [showOriginal, setShowOriginal] = useState(false);

  return (
    <div className="flex justify-end">
      <div className="max-w-[85%]">
        <div
          className={cn(
            "rounded-[24px] rounded-br-md border border-secondary/30 bg-primary px-4 py-2.5 text-primary-foreground shadow-sm",
            textSize,
          )}
        >
          {entry.content}
          <div className="mt-1 flex items-center gap-1">
            <span className="text-[10px] font-medium text-secondary-foreground/90">Corrected</span>
            <button
              onClick={() => setShowOriginal(!showOriginal)}
              className="flex items-center gap-0.5 text-[10px] text-primary-foreground/70 hover:text-primary-foreground"
            >
              {showOriginal ? (
                <>
                  Hide original <ChevronUp className="h-2.5 w-2.5" />
                </>
              ) : (
                <>
                  Show original <ChevronDown className="h-2.5 w-2.5" />
                </>
              )}
            </button>
          </div>
        </div>
        {showOriginal && entry.originalContent && (
          <div className="mt-2 rounded-[20px] border border-border/70 bg-muted/30 px-3 py-2.5 shadow-sm">
            <p className="mb-0.5 text-[10px] text-muted-foreground">Original:</p>
            <p className={`${textSize} text-muted-foreground`}>{entry.originalContent}</p>
            {entry.explanation && (
              <>
                <p className="mb-0.5 mt-1.5 text-[10px] text-muted-foreground">Why:</p>
                <p className="text-[10px] text-muted-foreground">{entry.explanation}</p>
              </>
            )}
          </div>
        )}
      </div>
    </div>
  );
}

function isLightColor(hex: string): boolean {
  const normalized = hex.replace("#", "");
  if (normalized.length < 6) return true;
  const r = parseInt(normalized.substring(0, 2), 16);
  const g = parseInt(normalized.substring(2, 4), 16);
  const b = parseInt(normalized.substring(4, 6), 16);
  const luminance = (0.299 * r + 0.587 * g + 0.114 * b) / 255;
  return luminance > 0.5;
}
