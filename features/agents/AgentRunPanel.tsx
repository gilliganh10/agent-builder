"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import {
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
import type { AgentDefinition, AgentRun } from "@/db/agents/schema";
import type { Project } from "@/db/projects/schema";
import { useTenant } from "@/lib/tenant-context";

interface AgentRunPanelProps {
  agent: AgentDefinition;
  projects: Project[];
}

export function AgentRunPanel({ agent, projects }: AgentRunPanelProps) {
  const router = useRouter();
  const { tenantSlug } = useTenant();
  const [isPending, startTransition] = useTransition();
  const [input, setInput] = useState("");
  const [projectSlug, setProjectSlug] = useState<string>("__none__");
  const [result, setResult] = useState<AgentRun | null>(null);
  const [error, setError] = useState<string | null>(null);

  function handleRun() {
    if (!input.trim()) return;
    setError(null);
    setResult(null);

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
        setResult(run);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <div className="space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="text-sm font-medium">Run Agent</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-1">
            <label className="text-sm font-medium">Input</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[120px] resize-y"
              placeholder="Enter your prompt for the agent..."
              value={input}
              onChange={(e) => setInput(e.target.value)}
              disabled={isPending}
            />
          </div>

          {projects.length > 0 && (
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Project Binding{" "}
                <span className="text-muted-foreground font-normal">
                  (optional)
                </span>
              </label>
              <Select value={projectSlug} onValueChange={setProjectSlug}>
                <SelectTrigger>
                  <SelectValue placeholder="No project binding" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="__none__">None</SelectItem>
                  {projects.map((p) => (
                    <SelectItem key={p.id} value={p.slug}>
                      {p.name}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <Button
            onClick={handleRun}
            disabled={isPending || !input.trim()}
          >
            {isPending ? (
              <>
                <Loader2 className="mr-1.5 h-4 w-4 animate-spin" />
                Running...
              </>
            ) : (
              <>
                <Play className="mr-1.5 h-4 w-4" />
                Run Agent
              </>
            )}
          </Button>

          {error && (
            <div className="flex items-center gap-2 text-sm text-destructive">
              <XCircle className="h-4 w-4 shrink-0" />
              {error}
            </div>
          )}
        </CardContent>
      </Card>

      {result && <RunResult run={result} />}
    </div>
  );
}

function RunResult({ run }: { run: AgentRun }) {
  const statusIcon =
    run.status === "completed" ? (
      <CheckCircle2 className="h-4 w-4 text-green-600" />
    ) : (
      <XCircle className="h-4 w-4 text-destructive" />
    );

  const statusVariant =
    run.status === "completed" ? "default" : "destructive";

  return (
    <Card>
      <CardHeader>
        <div className="flex items-center justify-between">
          <CardTitle className="text-sm font-medium">Result</CardTitle>
          <div className="flex items-center gap-2">
            {statusIcon}
            <Badge variant={statusVariant as "default" | "destructive"}>
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
            <div className="whitespace-pre-wrap rounded-md bg-muted p-4 text-sm leading-relaxed max-h-96 overflow-y-auto">
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

        {run.artifacts && run.artifacts.length > 0 && (
          <div className="space-y-2">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Artifacts ({run.artifacts.length})
            </label>
            <div className="space-y-1.5">
              {run.artifacts.map((a) => (
                <div
                  key={a.id}
                  className="flex items-center gap-2 rounded-md border px-3 py-2 text-sm"
                >
                  <Badge variant="outline" className="text-xs">
                    {a.kind}
                  </Badge>
                  {a.targetType && (
                    <span className="text-muted-foreground">
                      {a.targetType}
                      {a.targetId ? ` #${a.targetId.slice(0, 8)}` : ""}
                    </span>
                  )}
                  {typeof (a.data as Record<string, unknown>)?.description === "string" && (
                    <span className="text-muted-foreground">
                      {(a.data as Record<string, string>).description}
                    </span>
                  )}
                </div>
              ))}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
