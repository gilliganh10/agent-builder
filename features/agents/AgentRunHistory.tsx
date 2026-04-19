"use client";

import { useState, useCallback } from "react";
import { Bot, Clock, Coins } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/DataTable";
import type { TableConfig } from "@/components/data-table/types";
import type { AgentRun } from "@/db/agents/schema";
import { RunDetailSheet } from "./RunDetailSheet";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  running: "secondary",
  pending: "outline",
  failed: "destructive",
};

interface AgentRunHistoryProps {
  runs: AgentRun[];
}

export function AgentRunHistory({ runs }: AgentRunHistoryProps) {
  const [sheetOpen, setSheetOpen] = useState(false);
  const [detailRun, setDetailRun] = useState<AgentRun | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const openRunDetail = useCallback(
    async (run: AgentRun) => {
      setSheetOpen(true);
      setDetailLoading(true);
      setDetailRun(null);
      try {
        const res = await fetch(`/api/agents/runs/${run.id}`);
        if (!res.ok) {
          setSheetOpen(false);
          return;
        }
        const full = (await res.json()) as AgentRun;
        setDetailRun(full);
      } finally {
        setDetailLoading(false);
      }
    },
    []
  );

  const tableConfig: TableConfig<AgentRun> = {
    columns: [
      {
        id: "input",
        label: "Input",
        accessor: "input",
        cell: (value) => (
          <span className="line-clamp-1 max-w-xs text-sm">
            {String(value ?? "").replace(/^\[Context:.*?\]\n\n/, "")}
          </span>
        ),
      },
      {
        id: "status",
        label: "Status",
        accessor: "status",
        cell: (value) => {
          const status = String(value);
          return (
            <Badge variant={statusVariant[status] ?? "outline"}>{status}</Badge>
          );
        },
      },
      {
        id: "triggeredBy",
        label: "Triggered By",
        accessor: "triggeredBy",
        cell: (value) => (
          <span className="text-sm text-muted-foreground">
            {String(value ?? "")}
          </span>
        ),
      },
      {
        id: "durationMs",
        label: "Duration",
        accessor: "durationMs",
        cell: (value) => (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Clock className="h-3 w-3" />
            {value != null ? `${(Number(value) / 1000).toFixed(1)}s` : "\u2014"}
          </span>
        ),
      },
      {
        id: "costEstimate",
        label: "Cost",
        accessor: "costEstimate",
        cell: (value) => (
          <span className="flex items-center gap-1 text-sm text-muted-foreground">
            <Coins className="h-3 w-3" />
            {value != null ? `$${Number(value).toFixed(4)}` : "\u2014"}
          </span>
        ),
      },
      {
        id: "createdAt",
        label: "Created",
        accessor: "createdAt",
        cell: (value) => (
          <span className="text-sm text-muted-foreground">
            {value ? new Date(String(value)).toLocaleString() : ""}
          </span>
        ),
      },
    ],

    toolbar: {
      searchable: true,
      searchPlaceholder: "Search runs\u2026",
      searchFields: ["input", "triggeredBy"],
      filters: [
        {
          id: "status",
          label: "Status",
          accessor: "status",
          options: [
            { label: "Completed", value: "completed" },
            { label: "Running", value: "running" },
            { label: "Failed", value: "failed" },
            { label: "Pending", value: "pending" },
          ],
        },
      ],
    },

    actions: [
      {
        label: "View Details",
        onClick: (run) => {
          void openRunDetail(run);
        },
      },
    ],

    emptyState: {
      icon: Bot,
      noData: {
        title: "No runs yet",
        description: "Run this agent to see its history here.",
      },
      noResults: {
        title: "No runs match your filters",
        description: "Try adjusting your search or filter.",
      },
    },

    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 25, 50],
    },
  };

  return (
    <>
      <DataTable data={runs} config={tableConfig} />
      <RunDetailSheet
        run={detailRun}
        open={sheetOpen}
        loading={detailLoading}
        onOpenChange={(open) => {
          if (!open) {
            setSheetOpen(false);
            setDetailRun(null);
          }
        }}
      />
    </>
  );
}
