"use client";

import { Handle, Position } from "@xyflow/react";
import { cn } from "@/lib/utils";

interface FlowNodeShellProps {
  children: React.ReactNode;
  selected?: boolean;
  className?: string;
  color?: string;
  hasInput?: boolean;
  hasOutput?: boolean;
  outputHandles?: { id: string; label?: string }[];
}

export function FlowNodeShell({
  children,
  selected,
  className,
  color = "border-border",
  hasInput = true,
  hasOutput = true,
  outputHandles,
}: FlowNodeShellProps) {
  return (
    <div
      className={cn(
        "rounded-lg border-2 bg-background px-3 py-2 shadow-sm transition-shadow min-w-[140px]",
        selected ? "ring-2 ring-primary shadow-md" : "",
        color,
        className
      )}
    >
      {hasInput && (
        <Handle
          type="target"
          position={Position.Left}
          className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
        />
      )}
      {children}
      {outputHandles
        ? outputHandles.map((h, i) => (
            <Handle
              key={h.id}
              type="source"
              position={Position.Right}
              id={h.id}
              className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
              style={{ top: `${30 + i * 24}%` }}
            />
          ))
        : hasOutput && (
            <Handle
              type="source"
              position={Position.Right}
              className="!w-3 !h-3 !bg-muted-foreground !border-2 !border-background"
            />
          )}
    </div>
  );
}
