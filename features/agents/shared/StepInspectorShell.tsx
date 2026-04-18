"use client";

import type { ReactNode } from "react";
import { Trash2, X } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";

/**
 * Unified chrome for the right-panel Inspector: shared by FlowNodeEditor,
 * BlockEditor, and AttachmentEditor so every step surface looks/behaves the same.
 *
 * Internals (inputs, editors, etc.) remain per-surface; this only owns the
 * outer shell and the section layout primitives.
 */
interface StepInspectorShellProps {
  title: string;
  /** Short label shown next to the title, e.g. "Assistant reply" or "Extract". */
  kindBadge?: ReactNode;
  badgeClassName?: string;
  /** One-line plain-language description of what this step does. */
  blurb?: string;
  onClose?: () => void;
  onDelete?: () => void;
  deleteLabel?: string;
  children: ReactNode;
  /** When true, render without the fixed 20rem width / left border. */
  unstyled?: boolean;
}

export function StepInspectorShell({
  title,
  kindBadge,
  badgeClassName,
  blurb,
  onClose,
  onDelete,
  deleteLabel = "Delete",
  children,
  unstyled = false,
}: StepInspectorShellProps) {
  return (
    <div
      className={cn(
        !unstyled && "w-80 border-l border-border bg-background h-full overflow-y-auto"
      )}
    >
      <header className="flex items-start justify-between gap-2 px-4 py-3 border-b border-border">
        <div className="min-w-0 flex-1 space-y-1">
          <div className="flex items-center gap-2 min-w-0">
            {kindBadge && (
              <Badge
                variant="outline"
                className={cn("text-[10px] capitalize shrink-0", badgeClassName)}
              >
                {kindBadge}
              </Badge>
            )}
            <h3 className="truncate text-sm font-semibold">{title}</h3>
          </div>
          {blurb && <p className="text-[11px] text-muted-foreground">{blurb}</p>}
        </div>
        <div className="flex items-center gap-0.5 shrink-0">
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={onDelete}
              aria-label={deleteLabel}
              title={deleteLabel}
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
          {onClose && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7"
              onClick={onClose}
              aria-label="Close inspector"
            >
              <X className="h-4 w-4" />
            </Button>
          )}
        </div>
      </header>
      <div className="p-4 space-y-4">{children}</div>
    </div>
  );
}

interface InspectorSectionProps {
  label: string;
  /** Optional user-facing helper text shown below the label. */
  hint?: string;
  /** Optional right-aligned adornment in the section header (e.g. a button). */
  action?: ReactNode;
  children: ReactNode;
  className?: string;
}

/**
 * Standardised labelled region inside the inspector. Typography and spacing
 * match the Conversation configuration hub so the right panel reads as one surface.
 */
export function InspectorSection({
  label,
  hint,
  action,
  children,
  className,
}: InspectorSectionProps) {
  return (
    <section className={cn("space-y-2", className)}>
      <div className="flex items-start justify-between gap-2">
        <div className="space-y-0.5">
          <p className="text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
            {label}
          </p>
          {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
        </div>
        {action}
      </div>
      {children}
    </section>
  );
}

/**
 * Light divider used between sections inside the inspector.
 */
export function InspectorDivider() {
  return <div className="border-t border-border" />;
}
