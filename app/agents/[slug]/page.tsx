import { notFound } from "next/navigation";
import { agentRepository } from "@/repositories/agent.repository";
import { agentRunRepository } from "@/repositories/agent-run.repository";
import { AgentDetailView } from "@/features/agents/AgentDetailView";
import {
  resolveAgentDetailTab,
  resolveBuilderSubtab,
} from "@/features/agents/agent-detail-tabs";
import type { AgentVersion, AgentRun } from "@/db/agents/schema";

export const dynamic = "force-dynamic";

export async function generateMetadata({
  params,
}: {
  params: Promise<{ slug: string }>;
}) {
  const { slug } = await params;
  const agent = await agentRepository.findBySlug(slug);
  return { title: agent?.name ?? "Agent" };
}

interface Props {
  params: Promise<{ slug: string }>;
  searchParams: Promise<{ tab?: string; subtab?: string }>;
}

export default async function AgentDetailPage({ params, searchParams }: Props) {
  const { slug } = await params;
  const { tab, subtab } = await searchParams;

  const agent = await agentRepository.findBySlug(slug);
  if (!agent) notFound();

  const activeTab = resolveAgentDetailTab(tab);
  const activeSubtab = resolveBuilderSubtab(tab, subtab);

  let latestVersion: AgentVersion | null = null;
  let versions: AgentVersion[] = [];
  let runs: AgentRun[] = [];
  let allAgentSlugs: string[] = [];

  if (activeTab === "overview") {
    latestVersion = await agentRepository.getLatestVersion(agent.id);
  } else if (activeTab === "versions") {
    versions = await agentRepository.getVersionHistory(agent.id);
  } else if (activeTab === "runs") {
    runs = await agentRunRepository.listByAgentSummary(agent.id);
  } else if (activeTab === "builder") {
    if (activeSubtab === "graph") {
      allAgentSlugs = await agentRepository.listSlugs();
    }
  }

  return (
    <AgentDetailView
      agent={agent}
      latestVersion={latestVersion}
      versions={versions}
      runs={runs}
      allAgentSlugs={allAgentSlugs}
      initialTab={tab}
      initialSubtab={subtab}
    />
  );
}
