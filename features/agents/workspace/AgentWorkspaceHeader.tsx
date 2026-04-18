"use client";

import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Save,
  Play,
  GitBranch,
  PanelRight,
  PanelLeft,
  ListChecks,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import {
  AGENT_DETAIL_TABS,
  type BuilderSubtab,
} from "@/features/agents/agent-detail-tabs";
import { useAgentWorkspace } from "./AgentWorkspaceContext";
import { canEditAgentDefinition } from "@/lib/agents/agent-visibility";

interface SubtabDescriptor {
  id: BuilderSubtab;
  label: string;
  icon: React.ReactNode;
}

const BUILDER_SUBTABS: SubtabDescriptor[] = [
  { id: "plan", label: "Plan", icon: <ListChecks className="h-3.5 w-3.5" /> },
  { id: "graph", label: "Graph", icon: <GitBranch className="h-3.5 w-3.5" /> },
  { id: "test", label: "Test", icon: <Play className="h-3.5 w-3.5" /> },
];

export function AgentWorkspaceHeader() {
  const {
    agent,
    activeTab,
    switchTab,
    builderSubtab,
    switchBuilderSubtab,
    rightPanelOpen,
    setRightPanelOpen,
    leftSidebarOpen,
    setLeftSidebarOpen,
    saving,
    validationErrors,
    validationWarnings,
    validationSuccess,
    triggerSave,
    triggerValidate,
  } = useAgentWorkspace();

  const isBuilderTab = activeTab === "builder";
  const isGraphSubtab = isBuilderTab && builderSubtab === "graph";
  const isTestSubtab = isBuilderTab && builderSubtab === "test";
  const canEditDefinition = canEditAgentDefinition(agent);

  const showLeftRailToggle = isGraphSubtab;
  const showRightRailToggle = isBuilderTab && !isTestSubtab;

  const validationStatus =
    validationErrors.length > 0
      ? "error"
      : validationWarnings.length > 0
        ? "warning"
        : validationSuccess
          ? "valid"
          : "idle";

  return (
    <div className="shrink-0 border-b border-border bg-background">
      <div className="flex min-h-10 items-center gap-2 px-4 py-1">
        {showLeftRailToggle ? (
          <Button
            variant="ghost"
            size="icon"
            className="h-8 w-8 shrink-0 text-muted-foreground"
            onClick={() => setLeftSidebarOpen(!leftSidebarOpen)}
            aria-label={leftSidebarOpen ? "Collapse left panel" : "Expand left panel"}
          >
            <PanelLeft className="h-4 w-4" />
          </Button>
        ) : (
          <div className="h-8 w-8 shrink-0" aria-hidden />
        )}

        <nav
          className="flex min-w-0 flex-1 items-end gap-0 overflow-x-auto"
          aria-label="Agent workspace"
        >
          {AGENT_DETAIL_TABS.map((tab) => (
            <TabButton
              key={tab.id}
              label={tab.label}
              active={activeTab === tab.id}
              onClick={() => switchTab(tab.id)}
            />
          ))}
        </nav>

        <div className="flex shrink-0 items-center gap-1">
          {isBuilderTab && canEditDefinition && (
            <>
              {validationStatus !== "idle" && (
                <div className="mr-1 hidden items-center gap-1 sm:flex">
                  {validationStatus === "valid" && (
                    <CheckCircle2 className="h-3.5 w-3.5 text-green-600" aria-label="Valid" />
                  )}
                  {validationStatus === "error" && (
                    <span className="flex items-center gap-1 text-xs text-destructive">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {validationErrors.length}
                    </span>
                  )}
                  {validationStatus === "warning" && (
                    <span className="flex items-center gap-1 text-xs text-amber-600">
                      <AlertCircle className="h-3.5 w-3.5 shrink-0" />
                      {validationWarnings.length}
                    </span>
                  )}
                </div>
              )}

              <Button variant="ghost" size="sm" className="h-8 text-xs" onClick={triggerValidate}>
                <CheckCircle2 className="mr-1 h-3.5 w-3.5" />
                Validate
              </Button>

              {!isTestSubtab && (
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-8 text-xs"
                  onClick={() => switchBuilderSubtab("test")}
                >
                  <Play className="mr-1 h-3.5 w-3.5" />
                  Test
                </Button>
              )}

              <Button
                variant="default"
                size="sm"
                className="h-8 text-xs"
                onClick={() => void triggerSave()}
                disabled={saving}
              >
                {saving ? (
                  <Loader2 className="mr-1 h-3.5 w-3.5 animate-spin" />
                ) : (
                  <Save className="mr-1 h-3.5 w-3.5" />
                )}
                Save
              </Button>
            </>
          )}

          {showRightRailToggle ? (
            <Button
              variant="ghost"
              size="icon"
              className="h-8 w-8 shrink-0 text-muted-foreground"
              onClick={() => setRightPanelOpen(!rightPanelOpen)}
              aria-label={rightPanelOpen ? "Collapse right panel" : "Expand right panel"}
            >
              <PanelRight className="h-4 w-4" />
            </Button>
          ) : (
            <div className="h-8 w-8 shrink-0" aria-hidden />
          )}
        </div>
      </div>

      {isBuilderTab && (
        <div className="flex items-center gap-1 border-t border-border/40 bg-muted/30 px-4 py-1">
          {BUILDER_SUBTABS.map((sub) => (
            <button
              key={sub.id}
              type="button"
              onClick={() => switchBuilderSubtab(sub.id)}
              className={cn(
                "flex items-center gap-1.5 rounded-md px-2.5 py-1 text-xs font-medium transition-colors",
                builderSubtab === sub.id
                  ? "bg-background text-foreground shadow-sm"
                  : "text-muted-foreground hover:text-foreground"
              )}
            >
              {sub.icon}
              {sub.label}
            </button>
          ))}
        </div>
      )}
    </div>
  );
}

function TabButton({
  label,
  active,
  onClick,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "shrink-0 border-b-2 px-3 py-2 text-sm font-medium transition-colors sm:px-4",
        active
          ? "border-primary text-foreground"
          : "border-transparent text-muted-foreground hover:border-border hover:text-foreground"
      )}
    >
      {label}
    </button>
  );
}
