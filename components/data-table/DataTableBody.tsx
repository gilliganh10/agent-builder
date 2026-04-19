"use client";

import { useRouter } from "next/navigation";
import { MoreHorizontal } from "lucide-react";
import type { ReactNode } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Button } from "@/components/ui/button";
import { Checkbox } from "@/components/ui/checkbox";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { ColumnDef, ActionDef, TableConfig } from "./types";

interface DataTableBodyProps<TRow extends { id: string | number }> {
  rows: TRow[];
  config: TableConfig<TRow>;
  selectionEnabled?: boolean;
  selectedIds?: Set<string | number>;
  onSelectionChange?: (ids: Set<string | number>) => void;
}

function getCellContent<TRow>(
  col: ColumnDef<TRow>,
  row: TRow
): ReactNode {
  if (typeof col.accessor === "function") {
    return col.accessor(row);
  }
  const rawValue = row[col.accessor];
  if (col.cell) {
    return col.cell(rawValue, row);
  }
  if (rawValue === null || rawValue === undefined) return "\u2014";
  return String(rawValue);
}

function getAlignClass(align: ColumnDef<unknown>["align"]): string {
  if (align === "center") return "text-center";
  if (align === "right") return "text-right";
  return "text-left";
}

export function DataTableBody<TRow extends { id: string | number }>({
  rows,
  config,
  selectionEnabled = false,
  selectedIds,
  onSelectionChange,
}: DataTableBodyProps<TRow>) {
  const router = useRouter();

  const visibleColumns = config.columns;

  const effectiveActions = config.actions ?? [];

  const hasActions = effectiveActions.length > 0;

  const allOnPageSelected =
    selectionEnabled &&
    selectedIds != null &&
    rows.length > 0 &&
    rows.every((r) => selectedIds.has(r.id));

  const someOnPageSelected =
    selectionEnabled &&
    selectedIds != null &&
    !allOnPageSelected &&
    rows.some((r) => selectedIds.has(r.id));

  function toggleAll() {
    if (!onSelectionChange || !selectedIds) return;
    if (allOnPageSelected) {
      const next = new Set(selectedIds);
      for (const r of rows) next.delete(r.id);
      onSelectionChange(next);
    } else {
      const next = new Set(selectedIds);
      for (const r of rows) next.add(r.id);
      onSelectionChange(next);
    }
  }

  function toggleRow(id: string | number) {
    if (!onSelectionChange || !selectedIds) return;
    const next = new Set(selectedIds);
    if (next.has(id)) {
      next.delete(id);
    } else {
      next.add(id);
    }
    onSelectionChange(next);
  }

  function getCellClass(align: ColumnDef<unknown>["align"], index: number): string {
    return [
      getAlignClass(align),
      index === 0 ? "font-medium text-foreground" : "",
    ]
      .filter(Boolean)
      .join(" ");
  }

  return (
    <div className="overflow-hidden rounded-2xl border border-border/60 bg-card shadow-sm ring-1 ring-black/[0.03]">
      <Table>
        <TableHeader>
          <TableRow>
            {selectionEnabled && (
              <TableHead className="w-[44px] pl-5">
                <Checkbox
                  checked={allOnPageSelected ? true : someOnPageSelected ? "indeterminate" : false}
                  onCheckedChange={toggleAll}
                  aria-label="Select all on page"
                />
              </TableHead>
            )}
            {visibleColumns.map((col) => (
              <TableHead key={col.id} className={getAlignClass(col.align)}>
                {col.label}
              </TableHead>
            ))}
            {hasActions && (
              <TableHead className="w-[60px] pr-5">
                <span className="sr-only">Actions</span>
              </TableHead>
            )}
          </TableRow>
        </TableHeader>
        <TableBody>
          {rows.map((row) => {
            const isSelected = selectionEnabled && selectedIds?.has(row.id);
            return (
              <TableRow
                key={row.id}
                className={config.rowLink ? "cursor-pointer" : undefined}
                data-state={isSelected ? "selected" : undefined}
                onClick={
                  config.rowLink
                    ? () => router.push(config.rowLink!(row))
                    : undefined
                }
              >
                {selectionEnabled && (
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    className="w-[44px] pl-5"
                  >
                    <Checkbox
                      checked={!!isSelected}
                      onCheckedChange={() => toggleRow(row.id)}
                      aria-label={`Select row ${row.id}`}
                    />
                  </TableCell>
                )}
                {visibleColumns.map((col, index) => (
                  <TableCell
                    key={col.id}
                    className={getCellClass(col.align, index)}
                  >
                    {getCellContent(col, row)}
                  </TableCell>
                ))}
                {hasActions && (
                  <TableCell
                    onClick={(e) => e.stopPropagation()}
                    className="pr-5 text-right"
                  >
                    <RowActionsMenu actions={effectiveActions} row={row} />
                  </TableCell>
                )}
              </TableRow>
            );
          })}
        </TableBody>
      </Table>
    </div>
  );
}

function RowActionsMenu<TRow>({
  actions,
  row,
}: {
  actions: ActionDef<TRow>[];
  row: TRow;
}) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        <Button
          variant="ghost"
          size="icon"
          className="h-8 w-8 rounded-lg text-muted-foreground hover:bg-muted hover:text-foreground"
          aria-label="Open actions menu"
        >
          <MoreHorizontal className="h-4 w-4" />
        </Button>
      </DropdownMenuTrigger>
      <DropdownMenuContent align="end">
        {actions.map((action) => {
          const ActionIcon = action.icon;
          return (
            <DropdownMenuItem
              key={action.label}
              onClick={() => action.onClick(row)}
              className={
                action.variant === "destructive"
                  ? "text-destructive focus:text-destructive"
                  : undefined
              }
            >
              {ActionIcon && <ActionIcon className="mr-2 h-4 w-4" />}
              {action.label}
            </DropdownMenuItem>
          );
        })}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
