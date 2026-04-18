"use client";

import { useCallback } from "react";
import { cn } from "@/lib/utils";
import type { MessageBlock, MessageBlockType } from "@/db/agents/schema";
import { MessageBlockCard } from "./MessageBlockCard";
import { BlockInsertMenu } from "./BlockInsertMenu";

const CHAT_TYPES = new Set<MessageBlockType>(["user", "assistant"]);

function getBlockAlignment(type: MessageBlockType): string {
  if (type === "user") return "justify-end";
  if (type === "assistant") return "justify-start";
  return "justify-center";
}

interface ChatTimelineProps {
  blocks: MessageBlock[];
  selectedBlockId: string | null;
  onSelectBlock: (blockId: string) => void;
  onInsertBlock: (type: MessageBlockType, afterPosition: number) => void;
  onAttachmentClick: (blockId: string, attachmentId: string) => void;
  onAttachmentRemove: (blockId: string, attachmentId: string) => void;
  onReorderBlock: (blockId: string, direction: "up" | "down") => void;
}

export function ChatTimeline({
  blocks,
  selectedBlockId,
  onSelectBlock,
  onInsertBlock,
  onAttachmentClick,
  onAttachmentRemove,
  onReorderBlock,
}: ChatTimelineProps) {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);

  const handleInsert = useCallback(
    (type: MessageBlockType, afterIndex: number) => {
      const afterPos = afterIndex >= 0 && afterIndex < sorted.length
        ? sorted[afterIndex].position
        : -1;
      onInsertBlock(type, afterPos);
    },
    [sorted, onInsertBlock]
  );

  return (
    <div className="flex flex-col gap-0">
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider mb-3">
        Conversation Flow
      </p>

      <BlockInsertMenu onInsert={(type) => handleInsert(type, -1)} compact />

      {sorted.map((block, idx) => {
        const isChatBlock = CHAT_TYPES.has(block.type);

        return (
          <div key={block.id} className="flex flex-col items-center w-full">
            {idx > 0 && (
              <div className="w-px h-3 bg-border/70" />
            )}

            <div className={cn(
              "flex w-full",
              getBlockAlignment(block.type),
            )}>
              <div className={isChatBlock ? "max-w-[80%]" : "w-full"}>
                <MessageBlockCard
                  block={block}
                  selected={selectedBlockId === block.id}
                  onClick={() => onSelectBlock(block.id)}
                  onAttachmentClick={(attId) => onAttachmentClick(block.id, attId)}
                  onAttachmentRemove={(attId) => onAttachmentRemove(block.id, attId)}
                  stepNumber={idx + 1}
                  onMoveUp={idx > 0 ? () => onReorderBlock(block.id, "up") : undefined}
                  onMoveDown={idx < sorted.length - 1 ? () => onReorderBlock(block.id, "down") : undefined}
                />
              </div>
            </div>

            <div className="w-px h-2 bg-border/70" />
            <BlockInsertMenu onInsert={(type) => handleInsert(type, idx)} compact />
          </div>
        );
      })}

      {sorted.length === 0 && (
        <div className="text-center py-16 text-muted-foreground">
          <p className="text-sm font-medium mb-1">No message blocks yet</p>
          <p className="text-xs">Use the palette above to add your first block</p>
        </div>
      )}
    </div>
  );
}
