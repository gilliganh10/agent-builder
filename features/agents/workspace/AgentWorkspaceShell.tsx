"use client";

import { type ReactNode } from "react";
import { cn } from "@/lib/utils";
import { TopBarBreadcrumb } from "@/components/shell/TopBarContext";
import { AgentWorkspaceProvider, useAgentWorkspace } from "./AgentWorkspaceContext";
import { BuilderDocumentProvider } from "./BuilderDocumentContext";
import { FlowBuilderProvider } from "./FlowBuilderContext";
import { ChatBuilderProvider } from "./ChatBuilderContext";
import { SimplifiedBuilderProvider } from "@/features/agents/simplified/SimplifiedBuilderContext";
import { AgentWorkspaceHeader } from "./AgentWorkspaceHeader";
import { AgentWorkspaceTopBarSlots } from "./AgentWorkspaceTopBarSlots";
import { AgentWorkspaceSidebar } from "./AgentWorkspaceSidebar";
import { AgentWorkspaceRightPanel } from "./AgentWorkspaceRightPanel";
import {
  resolveAgentDetailTab,
  resolveBuilderSubtab,
} from "@/features/agents/agent-detail-tabs";
import type { AgentDefinition, AgentVersion, AgentRun } from "@/db/agents/schema";
import { AgentOverviewTab } from "@/features/agents/AgentOverviewTab";
import { AgentVersionHistory } from "@/features/agents/AgentVersionHistory";
import { AgentRunsTab } from "@/features/agents/AgentRunsTab";
import { FlowCanvasTab } from "@/features/agents/FlowCanvasTab";
import { PlanBuilderTab } from "@/features/agents/PlanBuilderTab";
import { TestBuilderTab } from "@/features/agents/TestBuilderTab";

interface AgentWorkspaceInnerProps {
  latestVersion?: AgentVersion | null;
  versions?: AgentVersion[];
  runs?: AgentRun[];
  allAgentSlugs?: string[];
}

function AgentWorkspaceInner({
  latestVersion,
  versions = [],
  runs = [],
  allAgentSlugs = [],
}: AgentWorkspaceInnerProps) {
  const {
    agent,
    activeTab,
    builderSubtab,
    leftSidebarOpen,
    rightPanelOpen,
  } = useAgentWorkspace();

  const isBuilderTab = activeTab === "builder";
  const isGraphTab = isBuilderTab && builderSubtab === "graph";
  const isPlanTab = isBuilderTab && builderSubtab === "plan";
  const isTestTab = isBuilderTab && builderSubtab === "test";

  const showLeftRail = isGraphTab && leftSidebarOpen;
  const showRightRail = (isPlanTab || isGraphTab) && rightPanelOpen;

  const body = (
    <div className="flex min-h-0 flex-1 overflow-hidden">
      {isGraphTab && (
        <aside
          className={cn(
            "flex shrink-0 flex-col overflow-hidden border-r border-border bg-sidebar transition-[width] duration-200",
            showLeftRail ? "w-56" : "w-0 border-0"
          )}
        >
          <AgentWorkspaceSidebar showFlowContext showChatContext={false} />
        </aside>
      )}

      <main className="min-h-0 min-w-0 flex-1 overflow-hidden">
        <TabContent
          latestVersion={latestVersion}
          versions={versions}
          runs={runs}
          allAgentSlugs={allAgentSlugs}
        />
      </main>

      {(isPlanTab || isGraphTab) && (
        <aside
          className={cn(
            "flex shrink-0 flex-col overflow-hidden border-l border-border bg-background transition-[width] duration-200",
            showRightRail ? "w-80 xl:w-96" : "w-0 border-0"
          )}
        >
          <AgentWorkspaceRightPanel
            showFlowContext={isGraphTab}
            showChatContext={isPlanTab}
          />
        </aside>
      )}
    </div>
  );

  if (isGraphTab) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AgentWorkspaceHeader />
        <FlowBuilderProvider
          agent={agent}
          allAgentSlugs={allAgentSlugs}
        >
          {body}
        </FlowBuilderProvider>
      </div>
    );
  }

  if (isPlanTab) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AgentWorkspaceHeader />
        <SimplifiedBuilderProvider>{body}</SimplifiedBuilderProvider>
      </div>
    );
  }

  if (isTestTab) {
    return (
      <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <AgentWorkspaceHeader />
        <ChatBuilderProvider>
          {body}
        </ChatBuilderProvider>
      </div>
    );
  }

  return (
    <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
      <AgentWorkspaceHeader />
      {body}
    </div>
  );
}

function TabContent({
  latestVersion,
  versions,
  runs,
  allAgentSlugs: _allAgentSlugs,
}: AgentWorkspaceInnerProps) {
  const { activeTab, builderSubtab, agent } = useAgentWorkspace();

  if (activeTab === "overview") {
    return (
      <ScrollableTab>
        <AgentOverviewTab agent={agent} latestVersion={latestVersion ?? undefined} />
      </ScrollableTab>
    );
  }

  if (activeTab === "builder") {
    if (builderSubtab === "graph") {
      return <FlowCanvasTab />;
    }
    if (builderSubtab === "test") {
      return <TestBuilderTab />;
    }
    return (
      <ScrollableTab>
        <PlanBuilderTab />
      </ScrollableTab>
    );
  }

  if (activeTab === "runs") {
    return (
      <ScrollableTab fullWidth>
        <AgentRunsTab runs={runs ?? []} />
      </ScrollableTab>
    );
  }

  if (activeTab === "versions") {
    return (
      <ScrollableTab>
        <AgentVersionHistory versions={versions ?? []} />
      </ScrollableTab>
    );
  }

  return null;
}

function ScrollableTab({
  children,
  fullWidth,
}: {
  children: ReactNode;
  /** Runs table uses full page width. */
  fullWidth?: boolean;
}) {
  return (
    <div className="h-full overflow-y-auto">
      <div
        className={cn(
          "px-6 py-8",
          fullWidth ? "w-full max-w-none" : "mx-auto max-w-4xl"
        )}
      >
        {children}
      </div>
    </div>
  );
}

interface AgentWorkspaceShellProps extends AgentWorkspaceInnerProps {
  agent: AgentDefinition;
  initialTab: string | undefined;
  initialSubtab: string | undefined;
}

export function AgentWorkspaceShell({
  agent,
  initialTab,
  initialSubtab,
  ...rest
}: AgentWorkspaceShellProps) {
  const resolvedTab = resolveAgentDetailTab(initialTab);
  const resolvedSubtab = resolveBuilderSubtab(initialTab, initialSubtab);

  return (
    <AgentWorkspaceProvider
      agent={agent}
      initialTab={resolvedTab}
      initialSubtab={resolvedSubtab}
    >
      <BuilderDocumentProvider agent={agent}>
        <TopBarBreadcrumb backHref="/agents" backLabel="Agents" title={agent.name} />
        <AgentWorkspaceTopBarSlots />
        <div className="flex min-h-0 flex-1 flex-col overflow-hidden">
          <AgentWorkspaceInner {...rest} />
        </div>
      </BuilderDocumentProvider>
    </AgentWorkspaceProvider>
  );
}
