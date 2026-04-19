"use client";

import { ChatUI } from "@/components/chat/ChatUI";
import { useAgentWorkspace } from "./workspace/AgentWorkspaceContext";
import { useChatBuilder } from "./workspace/ChatBuilderContext";

/**
 * Full-width Test sub-tab — chat is a first-class activity, not a narrow
 * right-rail mode.
 */
export function TestBuilderTab() {
  const { agent, dirty } = useAgentWorkspace();
  const { handleChatSend } = useChatBuilder();

  return (
    <div className="flex h-full min-h-0 flex-col">
      {dirty && (
        <div className="border-b border-amber-300/50 bg-amber-50 px-6 py-2 text-xs text-amber-800 dark:bg-amber-950/40 dark:text-amber-200">
          You have unsaved plan edits. Save to test the updated agent; this chat
          currently runs the last saved version.
        </div>
      )}
      <div className="mx-auto flex min-h-0 w-full max-w-3xl flex-1 flex-col gap-3 px-6 py-4">
        <p className="text-[11px] text-muted-foreground">
          The test chat runs your saved flow in order: the user message is always the
          entry point, then branch and parallel lanes match what you set in Plan.
        </p>
        <ChatUI
          onSend={handleChatSend}
          agentName={agent.name}
          isConversational={agent.mode === "conversational"}
        />
      </div>
    </div>
  );
}
