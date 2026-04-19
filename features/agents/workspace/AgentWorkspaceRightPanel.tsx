"use client";

import {
  MousePointerSquareDashed,
  AlertTriangle,
  CheckCircle2,
  AlertCircle,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { ScrollArea } from "@/components/ui/scroll-area";
import { Badge } from "@/components/ui/badge";
import { FlowNodeEditor } from "@/features/agents/FlowNodeEditor";
import { SimplifiedStepInspector } from "@/features/agents/simplified/SimplifiedStepInspector";
import { useAgentWorkspace } from "./AgentWorkspaceContext";
import { useFlowBuilder } from "./FlowBuilderContext";
import { useSimplifiedBuilder } from "@/features/agents/simplified/SimplifiedBuilderContext";

type RightPanelMode = "inspect" | "issues";

const PANEL_MODES: { id: RightPanelMode; label: string }[] = [
  { id: "inspect", label: "Inspect" },
  { id: "issues", label: "Issues" },
];

function GraphRightPanel({ mode }: { mode: RightPanelMode }) {
  const {
    validationErrors,
    validationWarnings,
    validationSuccess,
  } = useAgentWorkspace();
  const {
    selectedNode,
    setSelectedNodeId,
    updateNodeData,
    deleteNode,
    agentSlugs,
    primitiveSlugs,
    orchestratorVars,
  } = useFlowBuilder();

  if (mode === "inspect") {
    return (
      <ScrollArea className="h-full">
        {selectedNode ? (
          <FlowNodeEditor
            node={selectedNode}
            agentSlugs={agentSlugs}
            primitiveSlugs={primitiveSlugs}
            orchestratorVars={orchestratorVars}
            onUpdate={updateNodeData}
            onDelete={deleteNode}
            onClose={() => setSelectedNodeId(null)}
          />
        ) : (
          <EmptyInspector description="Select a node on the canvas to inspect and edit its configuration." />
        )}
      </ScrollArea>
    );
  }

  return (
    <IssuesPanel
      errors={validationErrors}
      warnings={validationWarnings}
      success={validationSuccess}
    />
  );
}

function PlanRightPanel({ mode }: { mode: RightPanelMode }) {
  const {
    validationErrors,
    validationWarnings,
    validationSuccess,
  } = useAgentWorkspace();
  const { selectedStep } = useSimplifiedBuilder();

  if (mode === "inspect") {
    if (!selectedStep) {
      return (
        <EmptyInspector description="Select a step on the left to inspect and edit it." />
      );
    }
    return <SimplifiedStepInspector />;
  }

  return (
    <IssuesPanel
      errors={validationErrors}
      warnings={validationWarnings}
      success={validationSuccess}
    />
  );
}

function EmptyInspector({ description }: { description: string }) {
  return (
    <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
      <MousePointerSquareDashed className="h-8 w-8 text-muted-foreground/40" />
      <p className="text-sm text-muted-foreground">{description}</p>
    </div>
  );
}

function IssuesPanel({
  errors,
  warnings,
  success,
}: {
  errors: string[];
  warnings: string[];
  success: boolean;
}) {
  if (errors.length === 0 && warnings.length === 0 && !success) {
    return (
      <div className="flex flex-col items-center justify-center gap-3 px-4 py-16 text-center">
        <AlertTriangle className="h-8 w-8 text-muted-foreground/40" />
        <p className="text-sm text-muted-foreground">Run Validate to check for issues.</p>
      </div>
    );
  }

  return (
    <ScrollArea className="h-full">
      <div className="space-y-3 p-4">
        {success && errors.length === 0 && (
          <div className="flex items-center gap-2 rounded-md bg-green-50 px-3 py-2.5 text-sm text-green-700 dark:bg-green-950 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4 shrink-0" />
            All checks passed
          </div>
        )}
        {errors.map((err, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-md border border-destructive/30 bg-destructive/5 px-3 py-2.5 text-xs text-destructive"
          >
            <AlertCircle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {err}
          </div>
        ))}
        {warnings.map((warn, i) => (
          <div
            key={i}
            className="flex items-start gap-2 rounded-md border border-amber-300/50 bg-amber-50 px-3 py-2.5 text-xs text-amber-700 dark:bg-amber-950 dark:text-amber-400"
          >
            <AlertTriangle className="mt-0.5 h-3.5 w-3.5 shrink-0" />
            {warn}
          </div>
        ))}
      </div>
    </ScrollArea>
  );
}

interface AgentWorkspaceRightPanelProps {
  showFlowContext: boolean;
  showChatContext: boolean;
}

export function AgentWorkspaceRightPanel({
  showFlowContext,
  showChatContext,
}: AgentWorkspaceRightPanelProps) {
  const {
    rightPanelMode,
    setRightPanelMode,
    validationErrors,
    validationWarnings,
  } = useAgentWorkspace();

  const effectiveMode: RightPanelMode =
    rightPanelMode === "issues" ? "issues" : "inspect";
  const issueCount = validationErrors.length + validationWarnings.length;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center gap-0 border-b border-border px-2">
        {PANEL_MODES.map((m) => (
          <button
            key={m.id}
            type="button"
            onClick={() => setRightPanelMode(m.id)}
            className={cn(
              "flex items-center gap-1.5 border-b-2 px-3 py-2 text-xs font-medium transition-colors",
              effectiveMode === m.id
                ? "border-primary text-foreground"
                : "border-transparent text-muted-foreground hover:text-foreground"
            )}
          >
            {m.label}
            {m.id === "issues" && issueCount > 0 && (
              <Badge
                variant={validationErrors.length > 0 ? "destructive" : "outline"}
                className="h-4 min-w-4 px-1 text-[10px]"
              >
                {issueCount}
              </Badge>
            )}
          </button>
        ))}
      </div>

      <div className="min-h-0 flex-1 overflow-hidden">
        {showFlowContext && <GraphRightPanel mode={effectiveMode} />}
        {showChatContext && !showFlowContext && (
          <PlanRightPanel mode={effectiveMode} />
        )}
        {!showFlowContext && !showChatContext && (
          <EmptyInspector description="Open Plan or Graph to inspect a step." />
        )}
      </div>
    </div>
  );
}
