"use client";

import { useState, useMemo } from "react";
import { useViewerMode } from "@/lib/viewer-mode-context";
import { hasPermission } from "@/lib/permissions";
import type { Permission } from "@/lib/permissions";
import type { DataTableProps } from "./types";
import { DataTableToolbar } from "./DataTableToolbar";
import { DataTableBody } from "./DataTableBody";
import { DataTablePagination } from "./DataTablePagination";
import { DataTableSkeleton } from "./DataTableSkeleton";
import { DataTableEmpty } from "./DataTableEmpty";
import { DataTableBulkBar } from "./DataTableBulkBar";

const DEFAULT_PAGE_SIZE_OPTIONS = [10, 25, 50];

export function DataTable<TRow extends { id: string | number }>({
  data,
  config,
  viewerMode: viewerModeProp,
  isLoading = false,
  selection,
  bulkActions,
}: DataTableProps<TRow>) {
  const { mode: contextMode, permissions: contextPermissions } = useViewerMode();
  const viewerMode = viewerModeProp ?? contextMode;
  const permissions: Permission[] = contextPermissions;

  // ---------------------------------------------------------------------------
  // Search state
  // ---------------------------------------------------------------------------
  const [search, setSearch] = useState("");

  // ---------------------------------------------------------------------------
  // Filter state — keyed by FilterDef.id
  // ---------------------------------------------------------------------------
  const [filterValues, setFilterValues] = useState<Record<string, string>>({});

  const handleFilterChange = (filterId: string, value: string) => {
    setFilterValues((prev) => ({ ...prev, [filterId]: value }));
    setPage(1);
  };

  const handleSearchChange = (value: string) => {
    setSearch(value);
    setPage(1);
  };

  // ---------------------------------------------------------------------------
  // Sort state
  // ---------------------------------------------------------------------------
  // (Reserved for v1 — columns are not sortable yet by default, but the state
  // slot is here so adding it later doesn't require restructuring this file.)

  // ---------------------------------------------------------------------------
  // Filtered rows (client-side)
  // ---------------------------------------------------------------------------
  const filteredRows = useMemo(() => {
    let rows = data;

    // Text search
    const trimmed = search.trim().toLowerCase();
    if (trimmed && config.toolbar?.searchFields?.length) {
      rows = rows.filter((row) =>
        config.toolbar!.searchFields!.some((field) => {
          const val = row[field];
          return val != null && String(val).toLowerCase().includes(trimmed);
        })
      );
    }

    // Discrete filters
    if (config.toolbar?.filters) {
      for (const filterDef of config.toolbar.filters) {
        const selected = filterValues[filterDef.id];
        if (selected && selected !== "__all__") {
          rows = rows.filter((row) => {
            const val = row[filterDef.accessor];
            return val != null && String(val) === selected;
          });
        }
      }
    }

    return rows;
  }, [data, search, filterValues, config.toolbar]);

  // ---------------------------------------------------------------------------
  // Pagination state
  // ---------------------------------------------------------------------------
  const defaultPageSize =
    config.pagination?.defaultPageSize ?? DEFAULT_PAGE_SIZE_OPTIONS[0];
  const pageSizeOptions =
    config.pagination?.pageSizeOptions ?? DEFAULT_PAGE_SIZE_OPTIONS;

  const [page, setPage] = useState(1);
  const [pageSize, setPageSize] = useState(defaultPageSize);

  const handlePageSizeChange = (size: number) => {
    setPageSize(size);
    setPage(1);
  };

  const paginatedRows = useMemo(() => {
    const start = (page - 1) * pageSize;
    return filteredRows.slice(start, start + pageSize);
  }, [filteredRows, page, pageSize]);

  // ---------------------------------------------------------------------------
  // Selection — whether row checkboxes are shown
  // ---------------------------------------------------------------------------
  const selectionEnabled =
    !!config.selection?.enabled &&
    (!config.selection.requiredPermission ||
      hasPermission(permissions, config.selection.requiredPermission));

  // ---------------------------------------------------------------------------
  // Derived empty state variant
  // ---------------------------------------------------------------------------
  const isFiltering =
    search.trim().length > 0 ||
    Object.values(filterValues).some((v) => v && v !== "__all__");

  const showToolbar = !!config.toolbar;
  const columnCount =
    config.columns.filter(
      (col) => !(col.adminOnly && viewerMode === "viewer")
    ).length +
    (config.actions?.some(
      (a) =>
        !a.requiredPermission || hasPermission(permissions, a.requiredPermission)
    )
      ? 1
      : 0) +
    (selectionEnabled ? 1 : 0);

  // ---------------------------------------------------------------------------
  // Render
  // ---------------------------------------------------------------------------
  if (isLoading) {
    return (
      <div className="space-y-4">
        {showToolbar && (
          <div className="h-14 w-full animate-pulse rounded-2xl border border-border/60 bg-card" />
        )}
        <DataTableSkeleton columnCount={columnCount} rowCount={5} />
      </div>
    );
  }

  const noData = data.length === 0 && !isFiltering;
  const noResults = filteredRows.length === 0 && !noData;

  if (noData) {
    const { noData: variant } = config.emptyState;
    // CTA is shown when the toolbar's primaryAction permission is held
    const primaryPermission = config.toolbar?.primaryAction?.requiredPermission;
    const canCta = !primaryPermission || hasPermission(permissions, primaryPermission);
    return (
      <DataTableEmpty
        icon={config.emptyState.icon}
        title={variant.title}
        description={variant.description}
        ctaLabel={variant.ctaLabel}
        onCta={variant.onCta}
        canCta={canCta}
      />
    );
  }

  return (
    <div className="space-y-4">
      {showToolbar && config.toolbar && (
        <DataTableToolbar
          config={config.toolbar}
          searchValue={search}
          onSearchChange={handleSearchChange}
          filterValues={filterValues}
          onFilterChange={handleFilterChange}
          viewerMode={viewerMode}
          permissions={permissions}
        />
      )}

      {selectionEnabled && selection && selection.selectedIds.size > 0 && (
        <DataTableBulkBar
          selectedCount={selection.selectedIds.size}
          totalFilteredCount={filteredRows.length}
          onSelectAll={() => {
            const allIds = new Set<string | number>(filteredRows.map((r) => r.id));
            selection.onSelectionChange(allIds);
          }}
          onClearSelection={() => selection.onSelectionChange(new Set())}
          bulkActions={bulkActions}
          permissions={permissions}
        />
      )}

      {noResults ? (
        <DataTableEmpty
          icon={config.emptyState.icon}
          title={config.emptyState.noResults.title}
          description={config.emptyState.noResults.description}
        />
      ) : (
        <>
          <DataTableBody
            rows={paginatedRows}
            config={config}
            viewerMode={viewerMode}
            permissions={permissions}
            selectionEnabled={selectionEnabled}
            selectedIds={selection?.selectedIds}
            onSelectionChange={selection?.onSelectionChange}
          />
          <DataTablePagination
            page={page}
            pageSize={pageSize}
            total={filteredRows.length}
            pageSizeOptions={pageSizeOptions}
            onPageChange={setPage}
            onPageSizeChange={handlePageSizeChange}
          />
        </>
      )}
    </div>
  );
}
