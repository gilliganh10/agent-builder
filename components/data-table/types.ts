import type { ReactNode } from "react";
import type { LucideIcon } from "lucide-react";
import type { ViewerMode } from "@/lib/viewer-mode-context";
import type { Permission } from "@/lib/permissions";

// ---------------------------------------------------------------------------
// Column definitions
// ---------------------------------------------------------------------------

export interface ColumnDef<TRow> {
  /** Unique key used for React reconciliation and sort state. */
  id: string;
  /** Header label displayed in the table. */
  label: string;
  /**
   * How to derive a raw value from the row.
   * Can be a key of TRow or a function returning a ReactNode directly.
   * When a key is provided and no `cell` renderer is specified, the raw value
   * is rendered as a string via String(value).
   */
  accessor: keyof TRow | ((row: TRow) => ReactNode);
  /**
   * Optional custom cell renderer. Receives the raw value (if accessor is a
   * key) or undefined (if accessor is a function, use accessor directly).
   * The row is always provided as the second argument for context.
   */
  cell?: (value: TRow[keyof TRow] | undefined, row: TRow) => ReactNode;
  /** Text alignment for the column. Defaults to "left". */
  align?: "left" | "center" | "right";
  /** Whether the column can be sorted client-side in v1. */
  sortable?: boolean;
  /**
   * When true, this column is hidden when viewerMode === "viewer".
   * NOTE: This is UI-level enforcement only. Server-side enforcement must be
   * implemented separately when real auth is added.
   */
  adminOnly?: boolean;
}

// ---------------------------------------------------------------------------
// Row actions
// ---------------------------------------------------------------------------

export interface ActionDef<TRow> {
  /** Display label in the dropdown. */
  label: string;
  /** Optional icon rendered to the left of the label. */
  icon?: LucideIcon;
  /** Called when the user selects this action. */
  onClick: (row: TRow) => void;
  /**
   * When set, this action is omitted when the current ViewerMode does not hold
   * the specified permission. UI-level enforcement only — server actions must
   * enforce independently via requirePermission().
   */
  requiredPermission?: Permission;
  /** Controls styling of the dropdown item. Defaults to "default". */
  variant?: "default" | "destructive";
}

// ---------------------------------------------------------------------------
// Toolbar
// ---------------------------------------------------------------------------

export interface FilterOption {
  label: string;
  value: string;
}

export interface FilterDef<TRow> {
  /** Unique key for this filter. */
  id: string;
  /** Label shown in the Select trigger. */
  label: string;
  /** The row field being filtered. */
  accessor: keyof TRow;
  /** Available options. An "All" option is always prepended by the toolbar. */
  options: FilterOption[];
}

export interface PrimaryAction {
  label: string;
  icon?: LucideIcon;
  onClick: () => void;
  /**
   * When set, this button is hidden when the current ViewerMode does not hold
   * the specified permission. UI-level enforcement only — server actions must
   * enforce independently via requirePermission().
   */
  requiredPermission?: Permission;
}

export interface ToolbarConfig<TRow> {
  searchable?: boolean;
  searchPlaceholder?: string;
  /** Fields whose string values are searched. Partial, case-insensitive. */
  searchFields?: (keyof TRow)[];
  filters?: FilterDef<TRow>[];
  primaryAction?: PrimaryAction;
}

// ---------------------------------------------------------------------------
// Empty state
// ---------------------------------------------------------------------------

export interface EmptyStateVariant {
  title: string;
  description: string;
  /** Label for the CTA button. Only shown when viewerMode === "admin". */
  ctaLabel?: string;
  onCta?: () => void;
}

export interface EmptyStateConfig {
  icon: LucideIcon;
  /** Shown when data array is empty and no search/filter is active. */
  noData: EmptyStateVariant;
  /** Shown when data exists but the active search/filter returns no rows. */
  noResults: EmptyStateVariant;
}

// ---------------------------------------------------------------------------
// Pagination
// ---------------------------------------------------------------------------

export interface PaginationConfig {
  defaultPageSize: number;
  pageSizeOptions?: number[];
}

// ---------------------------------------------------------------------------
// Row selection
// ---------------------------------------------------------------------------

export interface SelectionConfig {
  enabled: boolean;
  requiredPermission?: Permission;
}

export interface BulkAction {
  label: string;
  icon?: LucideIcon;
  onClick: (selectedIds: (string | number)[]) => void;
  requiredPermission?: Permission;
  variant?: "default" | "secondary";
}

// ---------------------------------------------------------------------------
// Top-level table config
// ---------------------------------------------------------------------------

export interface TableConfig<TRow> {
  columns: ColumnDef<TRow>[];
  toolbar?: ToolbarConfig<TRow>;
  actions?: ActionDef<TRow>[];
  /**
   * When provided, the primary name cell (first column) becomes an anchor and
   * optionally the entire row becomes clickable.
   */
  rowLink?: (row: TRow) => string;
  emptyState: EmptyStateConfig;
  pagination?: PaginationConfig;
  selection?: SelectionConfig;
}

// ---------------------------------------------------------------------------
// DataTable component props
// ---------------------------------------------------------------------------

export interface DataTableProps<TRow extends { id: string | number }> {
  data: TRow[];
  config: TableConfig<TRow>;
  viewerMode?: ViewerMode;
  isLoading?: boolean;
  selection?: {
    selectedIds: Set<string | number>;
    onSelectionChange: (ids: Set<string | number>) => void;
  };
  bulkActions?: BulkAction[];
}
