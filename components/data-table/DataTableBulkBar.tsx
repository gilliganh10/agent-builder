"use client";

import { X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { hasPermission, type Permission } from "@/lib/permissions";
import type { BulkAction } from "./types";

interface DataTableBulkBarProps {
  selectedCount: number;
  totalFilteredCount: number;
  onSelectAll: () => void;
  onClearSelection: () => void;
  bulkActions?: BulkAction[];
  permissions: Permission[];
}

export function DataTableBulkBar({
  selectedCount,
  totalFilteredCount,
  onSelectAll,
  onClearSelection,
  bulkActions,
  permissions,
}: DataTableBulkBarProps) {
  const effectiveActions = (bulkActions ?? []).filter(
    (a) => !a.requiredPermission || hasPermission(permissions, a.requiredPermission),
  );

  return (
    <div className="flex items-center gap-3 rounded-lg border border-[#222E50]/20 bg-[#222E50]/5 px-4 py-2 text-sm">
      <span className="font-medium text-[#222E50]">
        {selectedCount} selected
      </span>

      {selectedCount < totalFilteredCount && (
        <button
          type="button"
          onClick={onSelectAll}
          className="text-[#222E50] underline underline-offset-2 hover:text-[#222E50]/80"
        >
          Select all {totalFilteredCount}
        </button>
      )}

      <button
        type="button"
        onClick={onClearSelection}
        className="inline-flex items-center gap-1 text-muted-foreground hover:text-foreground"
      >
        <X className="h-3 w-3" />
        Clear
      </button>

      {effectiveActions.length > 0 && (
        <div className="ml-auto flex items-center gap-2">
          {effectiveActions.map((action) => {
            const ActionIcon = action.icon;
            return (
              <Button
                key={action.label}
                size="sm"
                variant={action.variant === "secondary" ? "outline" : "default"}
                onClick={() => action.onClick([])}
              >
                {ActionIcon && <ActionIcon className="mr-1.5 h-3.5 w-3.5" />}
                {action.label}
              </Button>
            );
          })}
        </div>
      )}
    </div>
  );
}
