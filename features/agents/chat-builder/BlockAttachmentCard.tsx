"use client";

import { X, Search, Zap, PenLine, MessageSquare, ClipboardCheck, Database } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import type { BlockAttachment, PrimitiveKind } from "@/db/agents/schema";

const MODE_COLORS: Record<string, string> = {
  before: "bg-blue-100 text-blue-700",
  after: "bg-amber-100 text-amber-700",
  override: "bg-red-100 text-red-700",
  parallel: "bg-purple-100 text-purple-700",
};

const KIND_ICONS: Record<PrimitiveKind, React.ReactNode> = {
  researcher: <Search className="h-3 w-3" />,
  actor: <Zap className="h-3 w-3" />,
  rewriter: <PenLine className="h-3 w-3" />,
  responder: <MessageSquare className="h-3 w-3" />,
  eval: <ClipboardCheck className="h-3 w-3" />,
  state_extractor: <Database className="h-3 w-3" />,
};

interface BlockAttachmentCardProps {
  attachment: BlockAttachment;
  onClick: () => void;
  onRemove: () => void;
}

export function BlockAttachmentCard({ attachment, onClick, onRemove }: BlockAttachmentCardProps) {
  const kind = attachment.inlinePrimitive?.kind;
  const icon = kind ? KIND_ICONS[kind] : null;

  return (
    <div
      onClick={onClick}
      className="flex items-center gap-1.5 rounded-md border border-border/60 bg-background px-2 py-1 text-[11px] cursor-pointer hover:border-border transition-colors group"
    >
      {icon && <span className="text-muted-foreground">{icon}</span>}
      <Badge variant="outline" className={`h-4 text-[9px] px-1 font-medium uppercase ${MODE_COLORS[attachment.mode] ?? ""}`}>
        {attachment.mode}
      </Badge>
      <span className="truncate font-medium">
        {attachment.label}
      </span>
      {attachment.condition && (
        <span className="text-[9px] text-muted-foreground truncate">
          if {attachment.condition.field}
        </span>
      )}
      <button
        onClick={(e) => { e.stopPropagation(); onRemove(); }}
        className="ml-auto opacity-0 group-hover:opacity-100 text-muted-foreground hover:text-destructive transition-opacity"
      >
        <X className="h-3 w-3" />
      </button>
    </div>
  );
}
