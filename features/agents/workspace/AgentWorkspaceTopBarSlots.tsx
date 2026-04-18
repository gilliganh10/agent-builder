"use client";

import { useLayoutEffect } from "react";
import { Globe, Lock, Loader2, MessageSquare } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { useTopBarBreadcrumb } from "@/components/shell/TopBarContext";
import { useAgentWorkspace } from "./AgentWorkspaceContext";

/**
 * Pushes agent status into the global TopBar trailing slot (same pattern as project file chrome).
 * Clears only on unmount so dependency updates do not flash the slot empty.
 */
export function AgentWorkspaceTopBarSlots() {
  const { setProjectHeaderSlot } = useTopBarBreadcrumb();
  const { agent, saving, dirty } = useAgentWorkspace();

  useLayoutEffect(() => {
    setProjectHeaderSlot(
      <div className="flex flex-wrap items-center justify-end gap-1.5">
        {agent.kind === "built_in" && (
          <Badge variant="secondary" className="shrink-0 gap-1 text-[10px]">
            <Lock className="h-3 w-3" />
            Built-in
          </Badge>
        )}
        {agent.publishToken && (
          <Badge
            variant="outline"
            className="shrink-0 gap-1 border-green-300 text-[10px] text-green-700"
          >
            <Globe className="h-3 w-3" />
            Published
          </Badge>
        )}
        {agent.mode === "conversational" && (
          <Badge variant="outline" className="shrink-0 gap-1 text-[10px]">
            <MessageSquare className="h-3 w-3" />
            Conversational
          </Badge>
        )}
        {saving && (
          <span className="flex items-center gap-1 text-xs text-muted-foreground">
            <Loader2 className="h-3.5 w-3.5 animate-spin" aria-hidden />
            Saving
          </span>
        )}
        {!saving && dirty && (
          <span className="text-xs text-muted-foreground">Unsaved</span>
        )}
      </div>
    );
  }, [
    agent.kind,
    agent.publishToken,
    agent.mode,
    saving,
    dirty,
    setProjectHeaderSlot,
  ]);

  useLayoutEffect(() => {
    return () => setProjectHeaderSlot(null);
  }, [setProjectHeaderSlot]);

  return null;
}
