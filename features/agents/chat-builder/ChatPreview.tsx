"use client";

import { cn } from "@/lib/utils";
import type { MessageBlock } from "@/db/agents/schema";

interface ChatPreviewProps {
  blocks: MessageBlock[];
}

export function ChatPreview({ blocks }: ChatPreviewProps) {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  if (sorted.length === 0) {
    return (
      <div className="flex items-center justify-center h-full text-xs text-muted-foreground">
        Add message blocks to preview the conversation
      </div>
    );
  }

  return (
    <div className="flex flex-col gap-2 p-3 overflow-y-auto">
      <p className="text-[10px] text-muted-foreground uppercase tracking-wider font-medium mb-1">
        Conversation Preview
      </p>
      {sorted.map((block) => {
        if (block.type === "system") return null;

        const isUser = block.type === "user";
        const isContext = block.type === "context";
        const displayName = block.type === "assistant"
          ? (block.settings.displayName ?? "Assistant")
          : isUser
            ? "User"
            : "Context";
        const color = block.type === "assistant"
          ? (block.settings.displayColor ?? "#222E50")
          : isUser
            ? "#4ade80"
            : "#946E83";

        const hasOverride = block.attachments.some((a) => a.mode === "override");

        return (
          <div
            key={block.id}
            className={cn(
              "flex flex-col max-w-[85%] gap-0.5",
              isUser ? "self-end items-end" : "self-start items-start"
            )}
          >
            <span className="text-[9px] text-muted-foreground font-medium">{displayName}</span>
            <div
              className={cn(
                "rounded-lg px-3 py-1.5 text-xs",
                isUser ? "bg-green-100 text-green-900" : "text-white"
              )}
              style={!isUser ? { backgroundColor: color } : undefined}
            >
              {isUser && "User message..."}
              {isContext && (block.content ?? "Retrieved context")}
              {block.type === "assistant" && (
                <span className="opacity-90">Assistant response...</span>
              )}
            </div>
            {hasOverride && isUser && (
              <div className="rounded-lg px-3 py-1 text-[10px] bg-[#946E83]/10 text-[#946E83] border border-[#946E83]/20 mt-0.5">
                Corrected: revised message...
              </div>
            )}
          </div>
        );
      })}
    </div>
  );
}
