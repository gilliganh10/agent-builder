import { PageHeader } from "@/components/layout/PageHeader";
import { TopBarBreadcrumb } from "@/components/shell/TopBarContext";
import { AgentRunsHub } from "@/features/agents/AgentRunsHub";

export const metadata = { title: "Agent runs" };

export default function AgentRunsPage() {
  return (
    <div className="space-y-8">
      <TopBarBreadcrumb
        backHref="/agents"
        backLabel="Agents"
        title="All runs"
      />
      <PageHeader description="Every agent run, with structure / tool evals when present. Open a row for full RunEval detail." />
      <AgentRunsHub agentDetailBasePath="/agents" />
    </div>
  );
}
