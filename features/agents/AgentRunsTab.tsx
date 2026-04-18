"use client";

import { useState, useCallback, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
  Bot,
  Play,
  Loader2,
  CheckCircle2,
  XCircle,
  Clock,
  Coins,
  Zap,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { DataTable } from "@/components/data-table/DataTable";
import type { TableConfig } from "@/components/data-table/types";
import { RunDetailSheet } from "./RunDetailSheet";
import { useTenant } from "@/lib/tenant-context";
import type { AgentDefinition, AgentRun } from "@/db/agents/schema";
import type { Project } from "@/db/projects/schema";

const statusVariant: Record<
  string,
  "default" | "secondary" | "destructive" | "outline"
> = {
  completed: "default",
  running: "secondary",
  pending: "outline",
  failed: "destructive",
};

interface AgentRunsTabProps {
  agent: AgentDefinition;
  runs: AgentRun[];
  projects: Project[];
}

export function AgentRunsTab({ agent, runs, projects }: AgentRunsTabProps) {
  const { tenantSlug } = useTenant();
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [projectSlug, setProjectSlug] = useState<string>("__none__");
  const [runResult, setRunResult] = useState<AgentRun | null>(null);
  const [runError, setRunError] = useState<string | null>(null);

  const [sheetOpen, setSheetOpen] = useState(false);
  const [detailRun, setDetailRun] = useState<AgentRun | null>(null);
  const [detailLoading, setDetailLoading] = useState(false);

  function handleRun() {
    if (!input.trim()) return;
    setRunError(null);
    setRunResult(null);
    startTransition(async () => {
      try {
        const body: Record<string, unknown> = {
          agentSlug: agent.slug,
          input: input.trim(),
        };
        if (projectSlug && projectSlug !== "__none__") {
          body.context = { projectSlug };
        }
        const res = await fetch(`/api/agents/run`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(body),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Request failed (${res.status})`);
        }
        const run: AgentRun = await res.json();
        setRunResult(run);
        router.refresh();
      } catch (err) {
        setRunError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  const openRunDetail = useCallback(
    async (run: AgentRun) => {
      setSheetOpen(true);
      setDetailLoading(true);
      setDetailRun(null);
      try {
        const res = await fetch(`/api/agents/runs/${run.id}`);
        if (!res.ok) { setSheetOpen(false); return; }
        const full = (await res.json()) as AgentRun;
        setDetailRun(full);
      } finally {
        setDetailLoading(false);
      }
    },
    [tenantSlug]
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
          return <Badge variant={statusVariant[status] ?? "outline"}>{status}</Badge>;
        },
      },
      {
        id: "triggeredBy",
        label: "Triggered By",
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
      searchPlaceholder: "Search runs…",
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
    actions: [{ label: "View Details", onClick: (run) => { void openRunDetail(run); } }],
    emptyState: {
      icon: Bot,
      noData: { title: "No runs yet", description: "Run the agent to see its history here." },
      noResults: { title: "No runs match your filters", description: "Try adjusting your search or filter." },
    },
    pagination: { defaultPageSize: 10, pageSizeOptions: [10, 25, 50] },
  };

  return (
    <div className="space-y-8">
      {/* Quick Run */}
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Run Agent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Input</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[100px] resize-y"
              placeholder="Enter your prompt for the agent…"
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending}
            />
          </div>

          {projects.length > 0 && (
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Project Binding{" "}
                <span className="text-muted-foreground font-normal">(optional)</span>
              </label>
              <Select value={projectSlug} onValueChange={setProjectSlug}>
                <SelectTrigger className="max-w-xs">
                  <SelectValue placeholder="No project binding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.slug}>{p.name}</SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button onClick={handleRun} disabled={isPending || !input.trim()}>
            {isPending ? (
              <><Loader2 className="mr-1.5 h-4 w-4 animate-spin" />Running…</>
            ) : (
              <><Play className="mr-1.5 h-4 w-4" />Run Agent</>
            )}
          </Button>

          {runError && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <XCircle className="h-4 w-4 shrink-0" />
              {runError}
            </div>
          )}
        </CardContent>
      </Card>

      {runResult && <InlineRunResult run={runResult} />}

      <Separator />

      {/* Run history */}
      <div className="space-y-3">
        <h2 className="text-sm font-semibold">Run History</h2>
        <DataTable data={runs} config={tableConfig} />
      </div>

      <RunDetailSheet
        run={detailRun}
        open={sheetOpen}
        loading={detailLoading}
        onOpenChange={(open) => {
          if (!open) { setSheetOpen(false); setDetailRun(null); }
        }}
      />
    </div>
  );
}

function InlineRunResult({ run }: { run: AgentRun }) {
  const statusIcon =
    run.status === "completed" ? (
      <CheckCircle2 className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-destructive" />
    );

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Result</CardTitle>
          <div className="flex items-center gap-2">
            {statusIcon}
            <Badge variant={run.status === "completed" ? "default" : "destructive"}>
              {run.status}
            </Badge>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        {run.finalOutput && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Output
            </label>
            <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm leading-relaxed max-h-80 overflow-y-auto">
              {run.finalOutput}
            </div>
          </div>
        )}
        {run.error && (
          <div className="space-y-1">
            <label className="text-xs font-medium text-destructive uppercase tracking-wider">
              Error
            </label>
            <div className="whitespace-pre-wrap rounded-md bg-destructive/10 p-4 text-sm text-destructive">
              {run.error}
            </div>
          </div>
        )}
        <div className="flex flex-wrap gap-4 text-xs text-muted-foreground">
          {run.durationMs != null && (
            <span className="flex items-center gap-1">
              <Clock className="h-3 w-3" />
              {(run.durationMs / 1000).toFixed(1)}s
            </span>
          )}
          {run.tokenUsage && (
            <span className="flex items-center gap-1">
              <Zap className="h-3 w-3" />
              {run.tokenUsage.total.toLocaleString()} tokens
            </span>
          )}
          {run.costEstimate != null && (
            <span className="flex items-center gap-1">
              <Coins className="h-3 w-3" />
              ${run.costEstimate.toFixed(4)}
            </span>
          )}
        </div>
      </CardContent>
    </Card>
  );
}
