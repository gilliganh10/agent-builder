"use client";

import { User, MessageSquare, FileText, Search, ChevronUp, ChevronDown, Microscope, GitBranch, Target } from "lucide-react";
import { cn } from "@/lib/utils";
import { Badge } from "@/components/ui/badge";
import type {
  MessageBlock,
  BlockAttachment,
  AttachmentMode,
} from "@/db/agents/schema";
import { BlockAttachmentCard } from "./BlockAttachmentCard";

const BLOCK_STYLES: Record<string, { accentColor: string; badgeClass: string; icon: React.ReactNode; roleLabel: string }> = {
  user: {
    accentColor: "border-l-green-500",
    badgeClass: "bg-white/20 text-white/90 hover:bg-white/20 border-white/20",
    icon: <User className="h-3.5 w-3.5" />,
    roleLabel: "USER",
  },
  assistant: {
    accentColor: "border-l-[#222E50]",
    badgeClass: "bg-[#222E50]/10 text-[#222E50] hover:bg-[#222E50]/10 border-[#222E50]/20",
    icon: <MessageSquare className="h-3.5 w-3.5 text-[#222E50]" />,
    roleLabel: "ASSISTANT",
  },
  system: {
    accentColor: "border-l-slate-400",
    badgeClass: "bg-slate-100 text-slate-600 hover:bg-slate-100 border-slate-200",
    icon: <FileText className="h-3.5 w-3.5 text-slate-500" />,
    roleLabel: "SYSTEM",
  },
  context: {
    accentColor: "border-l-[#946E83]",
    badgeClass: "bg-[#946E83]/10 text-[#946E83] hover:bg-[#946E83]/10 border-[#946E83]/20",
    icon: <Search className="h-3.5 w-3.5 text-[#946E83]" />,
    roleLabel: "CONTEXT",
  },
  extract: {
    accentColor: "border-l-amber-500",
    badgeClass: "bg-amber-100 text-amber-700 hover:bg-amber-100 border-amber-200",
    icon: <Microscope className="h-3.5 w-3.5 text-amber-600" />,
    roleLabel: "EXTRACT",
  },
  branch: {
    accentColor: "border-l-[#F45B69]",
    badgeClass: "bg-[#F45B69]/10 text-[#F45B69] hover:bg-[#F45B69]/10 border-[#F45B69]/20",
    icon: <GitBranch className="h-3.5 w-3.5 text-[#F45B69]" />,
    roleLabel: "BRANCH",
  },
  goal: {
    accentColor: "border-l-[#946E83]",
    badgeClass: "bg-[#946E83]/10 text-[#946E83] hover:bg-[#946E83]/10 border-[#946E83]/20",
    icon: <Target className="h-3.5 w-3.5 text-[#946E83]" />,
    roleLabel: "GOAL",
  },
};

const CHAT_TYPES = new Set(["user", "assistant"]);

interface MessageBlockCardProps {
  block: MessageBlock;
  selected: boolean;
  onClick: () => void;
  onAttachmentClick: (attachmentId: string) => void;
  onAttachmentRemove: (attachmentId: string) => void;
  stepNumber?: number;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
}

export function MessageBlockCard({
  block,
  selected,
  onClick,
  onAttachmentClick,
  onAttachmentRemove,
  stepNumber,
  onMoveUp,
  onMoveDown,
}: MessageBlockCardProps) {
  const style = BLOCK_STYLES[block.type] ?? BLOCK_STYLES.system;
  const isChatBubble = CHAT_TYPES.has(block.type);
  const isUser = block.type === "user";

  if (isChatBubble) {
    return (
      <div
        onClick={onClick}
        className={cn(
          "relative shadow-sm px-4 py-3 cursor-pointer transition-all",
          isUser
            ? "rounded-2xl rounded-br-sm bg-[#222E50] text-white"
            : "rounded-2xl rounded-bl-sm bg-white border border-border",
          selected && "ring-2 ring-[#222E50]/40 shadow-md"
        )}
      >
        <div className="flex items-center gap-2">
          <div
            className="flex flex-col gap-0.5 shrink-0 opacity-0 hover:opacity-100 transition-opacity"
            onClick={(e) => e.stopPropagation()}
          >
            <button
              onClick={onMoveUp}
              disabled={!onMoveUp}
              className={cn(
                "h-4 w-4 flex items-center justify-center rounded disabled:opacity-0 disabled:pointer-events-none transition-all",
                isUser ? "text-white/40 hover:text-white hover:bg-white/10" : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted"
              )}
              aria-label="Move block up"
            >
              <ChevronUp className="h-3 w-3" />
            </button>
            <button
              onClick={onMoveDown}
              disabled={!onMoveDown}
              className={cn(
                "h-4 w-4 flex items-center justify-center rounded disabled:opacity-0 disabled:pointer-events-none transition-all",
                isUser ? "text-white/40 hover:text-white hover:bg-white/10" : "text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted"
              )}
              aria-label="Move block down"
            >
              <ChevronDown className="h-3 w-3" />
            </button>
          </div>

          {stepNumber !== undefined && (
            <span className={cn(
              "text-[10px] font-mono tabular-nums w-4 text-center shrink-0",
              isUser ? "text-white/40" : "text-muted-foreground/50"
            )}>
              {stepNumber}
            </span>
          )}

          <Badge variant="outline" className={cn("text-[10px] font-semibold px-1.5 py-0 shrink-0", style.badgeClass)}>
            {style.icon}
            <span className="ml-1">{style.roleLabel}</span>
          </Badge>

          <span className={cn("text-sm font-medium truncate", isUser ? "text-white" : "text-foreground")}>
            {block.label}
          </span>
        </div>

        {/* User content */}
        {isUser && !block.content && (
          <p className="text-xs text-white/50 mt-1.5 italic">
            User sends a message...
          </p>
        )}
        {isUser && block.content && (
          <p className="text-xs text-white/70 mt-1.5 line-clamp-2">
            {block.content}
          </p>
        )}

        {/* Assistant content */}
        {block.type === "assistant" && block.settings.displayName && (
          <p className="text-xs text-muted-foreground mt-1.5">
            Responds as <span className="font-medium">{block.settings.displayName}</span>
          </p>
        )}
        {block.type === "assistant" && block.content && (
          <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
            {block.content}
          </p>
        )}

        {block.attachments.length > 0 && (
          <AttachmentGroups
            attachments={block.attachments}
            onClick={onAttachmentClick}
            onRemove={onAttachmentRemove}
            tone="dark"
          />
        )}
      </div>
    );
  }

  return (
    <div
      onClick={onClick}
      className={cn(
        "relative rounded-lg border-l-[3px] border border-border bg-white shadow-sm px-4 py-3.5 cursor-pointer transition-all w-full",
        style.accentColor,
        selected && "ring-2 ring-[#222E50]/30 border-[#222E50]/30 shadow-md"
      )}
    >
      <div className="flex items-center gap-2.5">
        <div
          className="flex flex-col gap-0.5 shrink-0"
          onClick={(e) => e.stopPropagation()}
        >
          <button
            onClick={onMoveUp}
            disabled={!onMoveUp}
            className="h-4 w-4 flex items-center justify-center rounded text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted disabled:opacity-0 disabled:pointer-events-none transition-all"
            aria-label="Move block up"
          >
            <ChevronUp className="h-3 w-3" />
          </button>
          <button
            onClick={onMoveDown}
            disabled={!onMoveDown}
            className="h-4 w-4 flex items-center justify-center rounded text-muted-foreground/40 hover:text-muted-foreground hover:bg-muted disabled:opacity-0 disabled:pointer-events-none transition-all"
            aria-label="Move block down"
          >
            <ChevronDown className="h-3 w-3" />
          </button>
        </div>

        {stepNumber !== undefined && (
          <span className="text-[10px] font-mono text-muted-foreground/50 tabular-nums w-4 text-center shrink-0">
            {stepNumber}
          </span>
        )}

        <Badge variant="outline" className={cn("text-[10px] font-semibold px-1.5 py-0 shrink-0", style.badgeClass)}>
          {style.icon}
          <span className="ml-1">{style.roleLabel}</span>
        </Badge>

        <span className="text-sm font-medium truncate">{block.label}</span>
      </div>

      {block.content && (
        <p className="text-xs text-muted-foreground mt-1.5 pl-[3.75rem] line-clamp-2">
          {block.content}
        </p>
      )}

      {block.type === "extract" && block.extractConfig && (
        <div className="pl-[3.75rem] mt-1.5 space-y-1">
          <div className="flex flex-wrap gap-1">
            {block.extractConfig.outputSchema.map((f) => (
              <Badge key={f.key} variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                {f.key}: {f.type}
              </Badge>
            ))}
          </div>
          {block.extractConfig.varsPatch && Object.keys(block.extractConfig.varsPatch).length > 0 && (
            <p className="text-[10px] text-muted-foreground">
              Updates: {Object.entries(block.extractConfig.varsPatch).map(([from, to]) => `${to} \u2190 ${from}`).join(", ")}
            </p>
          )}
        </div>
      )}

      {block.type === "branch" && block.branchConfig && (
        <div className="pl-[3.75rem] mt-2 space-y-2">
          <div className="inline-flex items-center gap-1.5 rounded-md bg-muted/60 px-2 py-1 text-[10px] font-mono text-muted-foreground">
            <span className="font-semibold text-foreground">if</span>
            <span>{block.branchConfig.condition.field || "\u2014"}</span>
            <span className="text-muted-foreground/70">
              {block.branchConfig.condition.operator}
            </span>
            <span>{JSON.stringify(block.branchConfig.condition.value)}</span>
          </div>
          <div className="grid grid-cols-2 gap-2">
            <BranchLane variant="yes" label="Yes" children={block.branchConfig.trueBranch} />
            <BranchLane variant="no" label="No" children={block.branchConfig.falseBranch} />
          </div>
        </div>
      )}

      {block.type === "goal" && block.goalConfig && (
        <div className="pl-[3.75rem] mt-1.5 space-y-1">
          <p className="text-xs font-medium">{block.goalConfig.name || "Unnamed goal"}</p>
          {block.goalConfig.conditions.length > 0 && (
            <div className="flex flex-wrap gap-1">
              {block.goalConfig.conditions.map((c, i) => (
                <Badge key={i} variant="secondary" className="text-[10px] font-mono px-1.5 py-0">
                  {c.field} {c.operator} {c.value != null ? String(c.value) : ""}
                </Badge>
              ))}
            </div>
          )}
          <p className="text-[10px] text-muted-foreground">
            Then: {block.goalConfig.onComplete.type === "close" ? "End conversation" : block.goalConfig.onComplete.type}
          </p>
        </div>
      )}

      {block.attachments.length > 0 && (
        <div className="pl-[3.75rem] mt-2.5">
          <AttachmentGroups
            attachments={block.attachments}
            onClick={onAttachmentClick}
            onRemove={onAttachmentRemove}
            tone="light"
          />
        </div>
      )}
    </div>
  );
}

const MODE_ORDER: AttachmentMode[] = ["before", "override", "parallel", "after"];

const MODE_LABEL: Record<AttachmentMode, string> = {
  before: "Before",
  after: "After",
  override: "Override user message",
  parallel: "In parallel",
};

function AttachmentGroups({
  attachments,
  onClick,
  onRemove,
  tone,
}: {
  attachments: BlockAttachment[];
  onClick: (id: string) => void;
  onRemove: (id: string) => void;
  tone: "light" | "dark";
}) {
  const grouped = new Map<AttachmentMode, BlockAttachment[]>();
  for (const att of attachments) {
    const list = grouped.get(att.mode) ?? [];
    list.push(att);
    grouped.set(att.mode, list);
  }

  const present = MODE_ORDER.filter((m) => grouped.has(m));
  if (present.length === 0) return null;

  const headerClass = tone === "dark" ? "text-white/50" : "text-muted-foreground";

  return (
    <div className="space-y-2">
      {present.map((mode) => {
        const items = grouped.get(mode)!;
        const isParallel = mode === "parallel" && items.length > 1;
        return (
          <div key={mode} className="space-y-1">
            {(mode !== "before" || items.length > 1) && (
              <p
                className={cn(
                  "text-[9px] font-semibold uppercase tracking-wider",
                  headerClass
                )}
              >
                {MODE_LABEL[mode]}
                {isParallel && (
                  <span className="ml-1 font-normal normal-case opacity-70">
                    ({items.length} concurrent)
                  </span>
                )}
              </p>
            )}
            <div
              className={cn(
                isParallel
                  ? "grid grid-cols-2 gap-1 rounded-md border border-dashed border-purple-400/50 bg-purple-50/40 p-1 dark:bg-purple-950/20"
                  : "space-y-1"
              )}
            >
              {items.map((att) => (
                <BlockAttachmentCard
                  key={att.id}
                  attachment={att}
                  onClick={() => onClick(att.id)}
                  onRemove={() => onRemove(att.id)}
                />
              ))}
            </div>
          </div>
        );
      })}
    </div>
  );
}

function BranchLane({
  variant,
  label,
  children,
}: {
  variant: "yes" | "no";
  label: string;
  children: MessageBlock[];
}) {
  const accent =
    variant === "yes"
      ? "border-green-400/70 bg-green-50/60 text-green-700 dark:bg-green-950/20"
      : "border-red-400/70 bg-red-50/60 text-red-600 dark:bg-red-950/20";
  return (
    <div className={cn("rounded-md border px-2 py-1.5", accent)}>
      <p className="mb-1 text-[10px] font-semibold uppercase tracking-wider">{label}</p>
      {children.length === 0 ? (
        <p className="text-[10px] italic opacity-60">Pass through</p>
      ) : (
        <div className="space-y-0.5">
          {children.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-1 rounded bg-background/60 px-1.5 py-0.5 text-[10px]"
            >
              <span className="font-mono uppercase opacity-60">{b.type}</span>
              <span className="truncate text-foreground">{b.label}</span>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
