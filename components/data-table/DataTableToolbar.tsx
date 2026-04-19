"use client";

import { Search } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ToolbarConfig, FilterDef } from "./types";

interface DataTableToolbarProps<TRow> {
  config: ToolbarConfig<TRow>;
  searchValue: string;
  onSearchChange: (value: string) => void;
  filterValues: Record<string, string>;
  onFilterChange: (filterId: string, value: string) => void;
}

const ALL_VALUE = "__all__";

export function DataTableToolbar<TRow>({
  config,
  searchValue,
  onSearchChange,
  filterValues,
  onFilterChange,
}: DataTableToolbarProps<TRow>) {
  const primaryAction = config.primaryAction;
  const showPrimaryAction = Boolean(primaryAction);

  const PrimaryIcon = primaryAction?.icon;

  return (
    <div className="rounded-2xl border border-border/60 bg-card p-3 shadow-sm">
      <div className="flex flex-col gap-3 xl:flex-row xl:items-center xl:justify-between">
        <div className="flex flex-1 flex-wrap items-center gap-3">
          {config.searchable && (
            <div className="relative min-w-[240px] flex-1 xl:max-w-md">
              <Search className="absolute left-3.5 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                placeholder={config.searchPlaceholder ?? "Search…"}
                value={searchValue}
                onChange={(e) => onSearchChange(e.target.value)}
                className="h-11 rounded-xl border-border/70 bg-background pl-10 shadow-none"
              />
            </div>
          )}

          {config.filters?.map((filter: FilterDef<TRow>) => (
            <Select
              key={filter.id}
              value={filterValues[filter.id] ?? ALL_VALUE}
              onValueChange={(value) => onFilterChange(filter.id, value)}
            >
              <SelectTrigger className="h-11 min-w-[170px] rounded-xl border-border/70 bg-background shadow-none">
                <SelectValue placeholder={filter.label} />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value={ALL_VALUE}>All {filter.label}s</SelectItem>
                {filter.options.map((opt) => (
                  <SelectItem key={opt.value} value={opt.value}>
                    {opt.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          ))}
        </div>

        {showPrimaryAction && primaryAction && (
          <div className="flex shrink-0 items-center justify-end xl:pl-4">
            <Button className="h-11 rounded-xl px-4" onClick={primaryAction.onClick}>
              {PrimaryIcon && <PrimaryIcon className="mr-2 h-4 w-4" />}
              {primaryAction.label}
            </Button>
          </div>
        )}
      </div>
    </div>
  );
}
