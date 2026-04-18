"use client";

import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Badge } from "@/components/ui/badge";
import { Separator } from "@/components/ui/separator";
import {
  Clock,
  Coins,
  Zap,
  Wrench,
  MessageSquare,
  FileOutput,
  GitBranch,
  Bot,
  GitFork,
  GitMerge,
  ArrowRightCircle,
  ArrowLeftCircle,
  ClipboardCheck,
  Search,
  PenLine,
  CheckCircle2,
  XCircle,
  Target,
  Loader2,
  Minus,
} from "lucide-react";
import type { AgentRun, RunStep, RunArtifact, FlowRunOutput, RunEval, OrchestratorState } from "@/db/agents/schema";
import { OPENAI_USAGE_LEDGER_META_KEY } from "@/lib/agents/usage";
import { ConversationStatePanel } from "@/components/chat/ConversationStatePanel";

interface RunDetailSheetProps {
  run: AgentRun | null;
  open: boolean;
  loading?: boolean;
  onOpenChange: (open: boolean) => void;
}

const statusVariant: Record<string, "default" | "secondary" | "destructive" | "outline"> = {
  completed: "default",
  running: "secondary",
  pending: "outline",
  failed: "destructive",
  skipped: "outline",
};

const stepKindIcon: Record<string, React.ReactNode> = {
  llm_call: <MessageSquare className="h-3.5 w-3.5" />,
  tool_call: <Wrench className="h-3.5 w-3.5" />,
  output: <FileOutput className="h-3.5 w-3.5" />,
  flow_node: <GitBranch className="h-3.5 w-3.5" />,
};

function OpenAIUsageLedgerSection({ meta }: { meta: Record<string, unknown> }) {
  const raw = meta[OPENAI_USAGE_LEDGER_META_KEY];
  if (!Array.isArray(raw) || raw.length === 0) return null;

  return (
    <details className="rounded-md border border-border/60 p-3 text-xs">
      <summary className="cursor-pointer font-medium text-muted-foreground">
        OpenAI usage ({raw.length} vendor records)
      </summary>
      <div className="mt-3 max-h-56 overflow-auto">
        <table className="w-full border-collapse text-left text-[11px]">
          <thead>
            <tr className="border-b text-muted-foreground">
              <th className="py-1 pr-2 font-medium">Phase</th>
              <th className="py-1 pr-2 font-medium">API</th>
              <th className="py-1 pr-2 font-medium">Step</th>
              <th className="py-1 pr-2 font-medium">Model</th>
              <th className="py-1 pr-2 font-medium text-right">In</th>
              <th className="py-1 pr-2 font-medium text-right">Out</th>
              <th className="py-1 pr-2 font-medium text-right">Cached</th>
              <th className="py-1 pr-2 font-medium text-right">Rsn</th>
            </tr>
          </thead>
          <tbody>
            {raw.map((row, i) => {
              const r = row as Record<string, unknown>;
              const model =
                (typeof r.modelReported === "string" && r.modelReported) ||
                (typeof r.modelRequested === "string" && r.modelRequested) ||
                "—";
              return (
                <tr key={typeof r.usageId === "string" ? r.usageId : i} className="border-b border-border/40">
                  <td className="py-1 pr-2 align-top">{String(r.phase ?? "—")}</td>
                  <td className="py-1 pr-2 align-top">{String(r.apiKind ?? "—")}</td>
                  <td className="py-1 pr-2 align-top">
                    {typeof r.stepIndex === "number" ? r.stepIndex : "—"}
                  </td>
                  <td className="py-1 pr-2 align-top break-all max-w-[120px]">{model}</td>
                  <td className="py-1 pr-2 text-right align-top tabular-nums">
                    {typeof r.inputTokens === "number" ? r.inputTokens.toLocaleString() : "—"}
                  </td>
                  <td className="py-1 pr-2 text-right align-top tabular-nums">
                    {typeof r.outputTokens === "number" ? r.outputTokens.toLocaleString() : "—"}
                  </td>
                  <td className="py-1 pr-2 text-right align-top tabular-nums">
                    {typeof r.cachedInputTokens === "number"
                      ? r.cachedInputTokens.toLocaleString()
                      : "—"}
                  </td>
                  <td className="py-1 pr-2 text-right align-top tabular-nums">
                    {typeof r.reasoningOutputTokens === "number"
                      ? r.reasoningOutputTokens.toLocaleString()
                      : "—"}
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>
    </details>
  );
}


const flowNodeIcon: Record<string, React.ReactNode> = {
  input: <ArrowRightCircle className="h-3.5 w-3.5 text-green-600" />,
  output: <ArrowLeftCircle className="h-3.5 w-3.5 text-blue-600" />,
  agent: <Bot className="h-3.5 w-3.5 text-[#222E50]" />,
  condition: <GitBranch className="h-3.5 w-3.5 text-[#946E83]" />,
  fork: <GitFork className="h-3.5 w-3.5 text-amber-600" />,
  join: <GitMerge className="h-3.5 w-3.5 text-amber-600" />,
  researcher: <Search className="h-3.5 w-3.5 text-[#222E50]" />,
  actor: <Zap className="h-3.5 w-3.5 text-[#F45B69]" />,
  rewriter: <PenLine className="h-3.5 w-3.5 text-[#946E83]" />,
  responder: <MessageSquare className="h-3.5 w-3.5 text-[#222E50]" />,
  eval: <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground" />,
};

export function RunDetailSheet({ run, open, loading, onOpenChange }: RunDetailSheetProps) {
  const isFlow = !!(run?.meta as Record<string, unknown> | undefined)?.isFlow;
  const flowSteps = run?.steps?.filter((s) => s.kind === "flow_node") ?? [];
  const nonFlowSteps = run?.steps?.filter((s) => s.kind !== "flow_node") ?? [];

  let parsedFlowOutput: FlowRunOutput | null = null;
  if (run?.finalOutput) {
    try {
      const parsed = JSON.parse(run.finalOutput);
      if (parsed.events) parsedFlowOutput = parsed as FlowRunOutput;
    } catch { /* not JSON flow output */ }
  }

  const evalResults = parsedFlowOutput?.evals ?? run?.evals;
  const orchestratorState = parsedFlowOutput?.orchestratorState;

  return (
    <Sheet open={open} onOpenChange={onOpenChange}>
      <SheetContent className="sm:max-w-xl overflow-y-auto">
        <SheetHeader>
          <SheetTitle className="flex items-center gap-2">
            Run Detail
            {run && isFlow && (
              <Badge variant="secondary" className="text-xs">Flow</Badge>
            )}
          </SheetTitle>
        </SheetHeader>

        {loading && (
          <div className="mt-12 flex justify-center">
            <Loader2 className="h-8 w-8 animate-spin text-muted-foreground" aria-label="Loading run" />
          </div>
        )}

        {!loading && run && (
        <div className="mt-6 space-y-6">
          <div className="flex items-center gap-2">
            <Badge variant={statusVariant[run.status] ?? "outline"}>
              {run.status}
            </Badge>
            <span className="text-xs text-muted-foreground">
              {new Date(run.createdAt).toLocaleString()}
            </span>
          </div>

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
                {run.tokenUsage.prompt.toLocaleString()} in /{" "}
                {run.tokenUsage.completion.toLocaleString()} out (
                {run.tokenUsage.total.toLocaleString()} total)
                {run.tokenUsage.cachedPrompt != null &&
                  run.tokenUsage.cachedPrompt > 0 && (
                    <span className="text-muted-foreground">
                      , {run.tokenUsage.cachedPrompt.toLocaleString()} cached in
                    </span>
                  )}
              </span>
            )}
            {run.costEstimate != null && (
              <span className="flex items-center gap-1">
                <Coins className="h-3 w-3" />
                ${run.costEstimate.toFixed(4)}
              </span>
            )}
          </div>

          <OpenAIUsageLedgerSection meta={run.meta} />

          <div className="space-y-1">
            <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
              Input
            </label>
            <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs max-h-40 overflow-y-auto">
              {run.input}
            </pre>
          </div>

          {run.finalOutput && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Output
              </label>
              <div className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs max-h-60 overflow-y-auto">
                {run.finalOutput}
              </div>
            </div>
          )}

          {run.error && (
            <div className="space-y-1">
              <label className="text-xs font-medium text-destructive uppercase tracking-wider">
                Error
              </label>
              <div className="whitespace-pre-wrap rounded-md bg-destructive/10 p-3 text-xs text-destructive">
                {run.error}
              </div>
            </div>
          )}

          {isFlow && flowSteps.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Flow Nodes ({flowSteps.length})
                </label>
                <div className="space-y-2">
                  {flowSteps.map((step) => (
                    <FlowStepCard key={step.id} step={step} />
                  ))}
                </div>
              </div>
            </>
          )}

          {nonFlowSteps.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Steps ({nonFlowSteps.length})
                </label>
                <div className="space-y-2">
                  {nonFlowSteps.map((step) => (
                    <StepCard key={step.id} step={step} />
                  ))}
                </div>
              </div>
            </>
          )}

          {evalResults && evalResults.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <ClipboardCheck className="h-3.5 w-3.5" />
                  Evals ({evalResults.length})
                </label>
                <div className="space-y-2">
                  {evalResults.map((ev, i) => (
                    <EvalCard key={ev.id ?? i} eval={ev} />
                  ))}
                </div>
              </div>
            </>
          )}

          {orchestratorState && (
            <>
              <Separator />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider flex items-center gap-1">
                  <Target className="h-3.5 w-3.5" />
                  Orchestrator State
                </label>
                <OrchestratorStateCard state={orchestratorState} />
              </div>
            </>
          )}

          {run.artifacts && run.artifacts.length > 0 && (
            <>
              <Separator />
              <div className="space-y-2">
                <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                  Artifacts ({run.artifacts.length})
                </label>
                <div className="space-y-2">
                  {run.artifacts.map((a) => (
                    <ArtifactCard key={a.id} artifact={a} />
                  ))}
                </div>
              </div>
            </>
          )}
        </div>
        )}
      </SheetContent>
    </Sheet>
  );
}

function FlowStepCard({ step }: { step: RunStep }) {
  const nodeId = step.nodeId ?? "unknown";
  const nodeType = nodeId.split("-")[0] ?? "unknown";
  const icon = flowNodeIcon[nodeType] ?? stepKindIcon.flow_node;

  const output = step.output as Record<string, unknown> | null;
  const hasMessage = output && typeof output.message === "string";
  const hasBranch = output && typeof output.branch === "string";

  return (
    <div className="rounded-md border px-3 py-2 text-xs space-y-1.5">
      <div className="flex items-center gap-2">
        {icon}
        <span className="font-mono font-medium">{nodeId}</span>
        <Badge
          variant={statusVariant[step.status] ?? "outline"}
          className="text-[10px] ml-auto"
        >
          {step.status}
        </Badge>
      </div>

      <div className="flex items-center gap-3 text-muted-foreground">
        {step.durationMs != null && step.durationMs > 0 && (
          <span className="flex items-center gap-0.5">
            <Clock className="h-3 w-3" />
            {step.durationMs}ms
          </span>
        )}
        {step.tokenUsage && (
          <span className="flex items-center gap-0.5">
            <Zap className="h-3 w-3" />
            {step.tokenUsage.total.toLocaleString()} tokens
          </span>
        )}
      </div>

      {hasBranch && (
        <div className="text-muted-foreground">
          Branch: <span className="font-mono">{String(output.branch)}</span>
        </div>
      )}

      {hasMessage && (
        <div className="rounded bg-muted p-2 max-h-24 overflow-y-auto whitespace-pre-wrap">
          {String(output.message).slice(0, 500)}
        </div>
      )}

      {step.error && (
        <p className="text-destructive">{step.error}</p>
      )}
    </div>
  );
}

function StepCard({ step }: { step: RunStep }) {
  return (
    <div className="rounded-md border px-3 py-2 text-xs space-y-1">
      <div className="flex items-center gap-2">
        {stepKindIcon[step.kind] ?? null}
        <Badge variant="outline" className="text-xs">
          {step.kind}
        </Badge>
        {step.toolName && (
          <span className="font-mono text-muted-foreground">
            {step.toolName}
          </span>
        )}
        <Badge
          variant={step.status === "completed" ? "default" : "destructive"}
          className="text-xs ml-auto"
        >
          {step.status}
        </Badge>
      </div>
      {step.durationMs != null && (
        <span className="text-muted-foreground">{step.durationMs}ms</span>
      )}
      {step.error && (
        <p className="text-destructive">{step.error}</p>
      )}
    </div>
  );
}

function EvalCard({ eval: ev }: { eval: RunEval }) {
  return (
    <div className="rounded-md border px-3 py-2 text-xs space-y-1.5">
      <div className="flex items-start gap-2">
        <ClipboardCheck className="h-3.5 w-3.5 text-muted-foreground shrink-0 mt-0.5" />
        <div className="min-w-0 flex-1">
          <span className="font-medium">{ev.evalName}</span>
        </div>
        <div className="ml-auto flex items-center gap-1.5">
          {ev.score != null && (
            <Badge variant="outline" className="text-[10px]">
              Score: {ev.score.toFixed(2)}
            </Badge>
          )}
          {ev.pass != null && (
            <Badge
              variant={ev.pass ? "default" : "destructive"}
              className="text-[10px] gap-0.5"
            >
              {ev.pass ? (
                <CheckCircle2 className="h-3 w-3" />
              ) : (
                <XCircle className="h-3 w-3" />
              )}
              {ev.pass ? "Pass" : "Fail"}
            </Badge>
          )}
        </div>
      </div>
      {ev.reasoning && (
        <p className="text-muted-foreground whitespace-pre-wrap">{ev.reasoning}</p>
      )}
    </div>
  );
}


function OrchestratorStateCard({ state }: { state: OrchestratorState }) {
  return (
    <ConversationStatePanel
      state={state.vars}
      goals={state.goals.map((goal) => ({
        id: goal.id,
        description: goal.description,
        status: goal.status,
      }))}
      locks={state.locks}
      compact
      title="Orchestrator state"
      description="Latest persisted vars and goal states for this run."
    />
  );
}

function ArtifactCard({ artifact }: { artifact: RunArtifact }) {
  const data = artifact.data as Record<string, unknown>;
  const outcome = artifact.proposalOutcome as Record<string, unknown> | null | undefined;
  const snapshot = outcome?.snapshot as Record<string, unknown> | undefined;
  const snapData = snapshot?.data as Record<string, unknown> | undefined;
  const desc =
    (typeof data?.description === "string" ? data.description : null) ??
    (typeof snapData?.description === "string" ? snapData.description : null);
  const snapPath =
    typeof snapData?.path === "string"
      ? snapData.path
      : typeof data?.path === "string"
        ? data.path
        : null;

  return (
    <div className="rounded-md border px-3 py-2 text-xs space-y-1">
      <div className="flex items-center gap-2">
        <Badge variant="outline" className="text-xs">
          {artifact.kind}
        </Badge>
        {artifact.targetType && (
          <span className="text-muted-foreground">
            {artifact.targetType}
            {artifact.targetId ? ` #${artifact.targetId.slice(0, 8)}` : ""}
          </span>
        )}
        {artifact.appliedAt && outcome?.disposition !== "partial" && (
          <Badge variant="default" className="text-xs ml-auto">
            Applied
          </Badge>
        )}
        {artifact.appliedAt && outcome?.disposition === "partial" && (
          <Badge variant="secondary" className="text-xs ml-auto">
            Partial
          </Badge>
        )}
        {artifact.rejected && (
          <Badge variant="destructive" className="text-xs ml-auto">
            Rejected
          </Badge>
        )}
      </div>
      {snapPath && artifact.kind === "proposal" && (
        <p className="text-muted-foreground font-mono text-[11px]">{snapPath}</p>
      )}
      {desc && <p className="text-muted-foreground">{desc}</p>}
      {artifact.kind === "proposal" &&
        Array.isArray(outcome?.hunkDecisions) &&
        (outcome.hunkDecisions as { disposition: string }[]).length > 0 && (
          <p className="text-[11px] text-muted-foreground">
            Hunks:{" "}
            {(outcome.hunkDecisions as { disposition: string }[]).filter(
              (h) => h.disposition === "accepted"
            ).length}{" "}
            accepted,{" "}
            {(outcome.hunkDecisions as { disposition: string }[]).filter(
              (h) => h.disposition === "rejected"
            ).length}{" "}
            rejected
          </p>
        )}
      {artifact.rejected && artifact.kind === "proposal" && (
        <div className="space-y-0.5 text-[11px] text-muted-foreground border-t border-border/60 pt-1.5 mt-1">
          {artifact.rejectedAt && (
            <p>
              Rejected {new Date(artifact.rejectedAt).toLocaleString()}
              {artifact.rejectedBy ? ` · ${artifact.rejectedBy}` : ""}
            </p>
          )}
          {artifact.rejectedReason && (
            <p className="text-destructive/90 whitespace-pre-wrap">{artifact.rejectedReason}</p>
          )}
        </div>
      )}
    </div>
  );
}
