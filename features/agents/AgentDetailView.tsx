"use client";

import { AgentWorkspaceShell } from "./workspace/AgentWorkspaceShell";
import type { AgentDefinition, AgentVersion, AgentRun } from "@/db/agents/schema";

interface AgentDetailViewProps {
  agent: AgentDefinition;
  latestVersion?: AgentVersion | null;
  versions?: AgentVersion[];
  runs?: AgentRun[];
  allAgentSlugs?: string[];
  initialTab?: string;
  initialSubtab?: string;
}

export function AgentDetailView({
  agent,
  latestVersion,
  versions = [],
  runs = [],
  allAgentSlugs = [],
  initialTab,
  initialSubtab,
}: AgentDetailViewProps) {
  return (
    <AgentWorkspaceShell
      agent={agent}
      initialTab={initialTab}
      initialSubtab={initialSubtab}
      latestVersion={latestVersion}
      versions={versions}
      runs={runs}
      allAgentSlugs={allAgentSlugs}
    />
  );
}
