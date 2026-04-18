"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import Link from "next/link";
import { Bot, Clock, Coins, RefreshCw } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { DataTable } from "@/components/data-table/DataTable";
import type { TableConfig } from "@/components/data-table/types";
import type {
  AgentRun,
  AgentRunListRow,
  AgentDefinition,
  RunStatus,
} from "@/db/agents/schema";
import { RunDetailSheet } from "./RunDetailSheet";

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  running: "secondary",
  pending: "outline",
  failed: "destructive",
};

export interface AgentRunsHubProps {
  /**
   * Base path for agent detail URLs (no trailing slash), e.g. `/agents`.
   * Must be a plain string so Server Components can pass it into this client component.
   */
  agentDetailBasePath: string;
}

export function AgentRunsHub({ agentDetailBasePath }: AgentRunsHubProps) {
  const agentBase = agentDetailBasePath.replace(/\/$/, "");
  const [runs, setRuns] = useState<AgentRunListRow[]>([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [agents, setAgents] = useState<AgentDefinition[]>([]);

  const [statusFilter, setStatusFilter] = useState<RunStatus | "">("");
  const [agentFilter, setAgentFilter] = useState<string>("");
  const [surfaceFilter, setSurfaceFilter] = useState<string>("");

  const [sheetOpen, setSheetOpen] = useState(false);
  const [detailRun, setDetailRun] = useState<AgentRun | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  const loadAgents = useCallback(async () => {
    try {
      const res = await fetch(`/api/agents`);
      if (!res.ok) return;
      const data = (await res.json()) as AgentDefinition[];
      setAgents(Array.isArray(data) ? data : []);
    } catch {
      /* ignore */
    }
  }, []);

  const loadRuns = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const params = new URLSearchParams();
      params.set("take", "100");
      params.set("skip", "0");
      if (statusFilter) params.set("status", statusFilter);
      if (agentFilter) params.set("agentDefinitionId", agentFilter);
      if (surfaceFilter.trim()) params.set("surface", surfaceFilter.trim());

      const res = await fetch(`/api/agents/runs?${params.toString()}`);
      if (!res.ok) {
        const body = (await res.json().catch(() => ({}))) as { error?: unknown };
        const msg =
          typeof body.error === "string"
            ? body.error
            : `HTTP ${res.status}`;
        throw new Error(msg);
      }
      const json = (await res.json()) as {
        runs: AgentRunListRow[];
        total: number;
      };
      setRuns(json.runs ?? []);
      setTotal(json.total ?? 0);
    } catch (e) {
      setError(e instanceof Error ? e.message : "Failed to load runs");
      setRuns([]);
      setTotal(0);
    } finally {
      setLoading(false);
    }
  }, [statusFilter, agentFilter, surfaceFilter]);

  useEffect(() => {
    void loadAgents();
  }, [loadAgents]);

  useEffect(() => {
    void loadRuns();
  }, [loadRuns]);

  const openRunDetail = useCallback(
    async (row: AgentRunListRow) => {
      setSheetOpen(true);
      setDetailLoading(true);
      setDetailRun(null);
      try {
        const res = await fetch(`/api/agents/runs/${row.id}`);
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

  const agentOptions = useMemo(
    () =>
      agents.map((a) => ({
        label: `${a.name} (${a.slug})`,
        value: a.id,
      })),
    [agents]
  );

  const tableConfig: TableConfig<AgentRunListRow> = useMemo(
    () => ({
      columns: [
        {
          id: "createdAt",
          label: "Created",
          accessor: "createdAt",
          sortable: true,
          cell: (value) => (
            <span className="text-sm text-muted-foreground whitespace-nowrap">
              {value ? new Date(String(value)).toLocaleString() : "—"}
            </span>
          ),
        },
        {
          id: "agentName",
          label: "Agent",
          accessor: "agentName",
          cell: (_v, row) => (
            <Link
              href={`${agentBase}/${row.agentSlug}`}
              className="font-medium text-primary hover:underline"
            >
              {row.agentName}
            </Link>
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
          id: "surface",
          label: "Surface",
          accessor: "surface",
          cell: (value) => (
            <span className="text-sm font-mono text-muted-foreground">
              {value != null && value !== "" ? String(value) : "—"}
            </span>
          ),
        },
        {
          id: "inputPreview",
          label: "Input",
          accessor: "inputPreview",
          cell: (value) => (
            <span className="line-clamp-2 max-w-[min(280px,28vw)] text-sm">
              {String(value ?? "")}
            </span>
          ),
        },
        {
          id: "triggeredBy",
          label: "Triggered by",
          accessor: "triggeredBy",
          cell: (value) => (
            <span className="text-sm text-muted-foreground">{String(value ?? "")}</span>
          ),
        },
        {
          id: "durationMs",
          label: "Duration",
          accessor: "durationMs",
          cell: (value) => (
            <span className="flex items-center gap-1 text-sm text-muted-foreground">
              <Clock className="h-3 w-3" />
              {value != null ? `${(Number(value) / 1000).toFixed(1)}s` : "—"}
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
              {value != null ? `$${Number(value).toFixed(4)}` : "—"}
            </span>
          ),
        },
      ],
      toolbar: {
        searchable: true,
        searchPlaceholder: "Search input or agent…",
        searchFields: ["inputPreview", "agentName", "agentSlug", "triggeredBy"],
      },
      actions: [
        {
          label: "View details",
          onClick: (row) => {
            void openRunDetail(row);
          },
        },
      ],
      emptyState: {
        icon: Bot,
        noData: {
          title: "No runs yet",
          description: "Runs from any agent in this workspace will appear here.",
        },
        noResults: {
          title: "No runs match",
          description: "Try adjusting search or filters.",
        },
      },
      pagination: {
        defaultPageSize: 25,
        pageSizeOptions: [10, 25, 50, 100],
      },
    }),
    [agentBase, openRunDetail]
  );

  return (
    <div className="space-y-4">
      <div className="flex flex-wrap items-end gap-3 rounded-lg border border-border/60 bg-muted/20 p-3 text-sm">
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Status</label>
          <select
            className="h-9 rounded-md border border-input bg-background px-2 text-sm"
            value={statusFilter}
            onChange={(e) => setStatusFilter((e.target.value || "") as RunStatus | "")}
          >
            <option value="">All</option>
            <option value="completed">Completed</option>
            <option value="running">Running</option>
            <option value="failed">Failed</option>
            <option value="pending">Pending</option>
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Agent</label>
          <select
            className="h-9 min-w-[12rem] rounded-md border border-input bg-background px-2 text-sm"
            value={agentFilter}
            onChange={(e) => setAgentFilter(e.target.value)}
          >
            <option value="">All agents</option>
            {agentOptions.map((o) => (
              <option key={o.value} value={o.value}>
                {o.label}
              </option>
            ))}
          </select>
        </div>
        <div className="space-y-1">
          <label className="text-xs font-medium text-muted-foreground">Surface</label>
          <input
            className="h-9 w-40 rounded-md border border-input bg-background px-2 text-sm font-mono"
            placeholder="e.g. public-chat"
            value={surfaceFilter}
            onChange={(e) => setSurfaceFilter(e.target.value)}
          />
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          className="ml-auto"
          onClick={() => void loadRuns()}
          disabled={loading}
        >
          <RefreshCw className={`mr-1.5 h-3.5 w-3.5 ${loading ? "animate-spin" : ""}`} />
          Refresh
        </Button>
      </div>

      {error && (
        <p className="text-sm text-destructive" role="alert">
          {error}
        </p>
      )}

      <p className="text-xs text-muted-foreground">
        Showing {runs.length} of {total} run{total === 1 ? "" : "s"} (most recent 100 after server filters).
      </p>

      {loading && runs.length === 0 ? (
        <p className="text-sm text-muted-foreground">Loading runs…</p>
      ) : (
        <DataTable data={runs} config={tableConfig} />
      )}

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
    </div>
  );
}
