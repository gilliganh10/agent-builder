"use client";

import { AgentWorkspaceShell } from "./workspace/AgentWorkspaceShell";
import type { AgentDefinition, AgentVersion, AgentRun } from "@/db/agents/schema";
import type { Project } from "@/db/projects/schema";

interface AgentDetailViewProps {
  agent: AgentDefinition;
  latestVersion?: AgentVersion | null;
  versions?: AgentVersion[];
  runs?: AgentRun[];
  projects?: Project[];
  allAgentSlugs?: string[];
  allPrimitiveSlugs?: string[];
  initialTab?: string;
  initialSubtab?: string;
}

export function AgentDetailView({
  agent,
  latestVersion,
  versions = [],
  runs = [],
  projects = [],
  allAgentSlugs = [],
  allPrimitiveSlugs = [],
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
      projects={projects}
      allAgentSlugs={allAgentSlugs}
      allPrimitiveSlugs={allPrimitiveSlugs}
    />
  );
}
