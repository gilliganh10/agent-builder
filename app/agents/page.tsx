import Link from "next/link";
import { History } from "lucide-react";
import { Button } from "@/components/ui/button";
import { PageHeader } from "@/components/layout/PageHeader";
import { AgentListView } from "@/features/agents/AgentListView";
import { NewFromTemplateButton } from "@/features/agents/NewFromTemplateButton";
import { agentRepository } from "@/repositories/agent.repository";
import { isInternalAgent } from "@/lib/agents/agent-visibility";

/** Must read SQLite on every request — static prerender would freeze the list at build time. */
export const dynamic = "force-dynamic";

export const metadata = { title: "Agents" };

export default async function AgentsPage() {
  const agents = (await agentRepository.list()).filter((agent) => !isInternalAgent(agent));

  return (
    <div className="space-y-8">
      <PageHeader description="Create, manage, and run AI agents.">
        <NewFromTemplateButton />
        <Button variant="outline" size="sm" asChild>
          <Link href="/agents/runs" className="gap-1.5">
            <History className="h-4 w-4" />
            All runs
          </Link>
        </Button>
      </PageHeader>
      <AgentListView agents={agents} />
    </div>
  );
}
