import { notFound } from "next/navigation";
import { agentRepository } from "@/repositories/agent.repository";
import { PublicChatClient } from "./PublicChatClient";
import { getPublicChatSettings } from "@/lib/agents/public-chat";

export const dynamic = "force-dynamic";

interface Props {
  params: Promise<{ token: string }>;
}

export default async function PublicChatPage({ params }: Props) {
  const { token } = await params;

  const agent = await agentRepository.findByPublishToken(token);
  if (!agent) notFound();
  const publicChatSettings = getPublicChatSettings(agent.meta);

  return (
    <div className="flex h-dvh flex-col overflow-hidden bg-background">
      <header className="flex shrink-0 items-center justify-between border-b border-border/80 bg-background/90 px-4 py-3 shadow-[0_1px_0_0_rgba(34,46,80,0.04)] backdrop-blur-sm sm:px-6">
        <div className="min-w-0">
          <div className="flex min-w-0 items-center gap-3">
            <span className="truncate text-sm font-semibold tracking-tight text-foreground">
              {agent.name}
            </span>
            <span className="rounded-full border border-border/70 bg-muted/25 px-2.5 py-1 text-[10px] font-semibold uppercase tracking-[0.18em] text-muted-foreground">
              Published chat
            </span>
          </div>
          {agent.description ? (
            <p className="mt-1 line-clamp-1 text-xs text-muted-foreground">
              {agent.description}
            </p>
          ) : null}
        </div>
        <span className="shrink-0 text-xs text-muted-foreground">Agent Builder</span>
      </header>

      <main className="flex min-h-0 flex-1 flex-col overflow-hidden">
        <PublicChatClient
          token={token}
          agentName={agent.name}
          mode={agent.mode}
          showStateSidebar={publicChatSettings.showStateSidebar}
          envVars={(agent.flowDefinition?.envVars ?? []).filter((v) => v.publicEditable)}
        />
      </main>
    </div>
  );
}
