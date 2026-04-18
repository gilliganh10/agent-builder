"use client";

import { User, MessageSquare, FileText, Search, Microscope, GitBranch, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import type { MessageBlockType } from "@/db/agents/schema";

const PALETTE_ITEMS: { type: MessageBlockType; label: string; icon: React.ReactNode }[] = [
  { type: "user", label: "User Message", icon: <User className="h-4 w-4" /> },
  { type: "assistant", label: "Assistant Reply", icon: <MessageSquare className="h-4 w-4" /> },
  { type: "system", label: "System Instruction", icon: <FileText className="h-4 w-4" /> },
  { type: "context", label: "Context Retrieval", icon: <Search className="h-4 w-4" /> },
  { type: "extract", label: "Extract / Judge", icon: <Microscope className="h-4 w-4" /> },
  { type: "branch", label: "Condition Branch", icon: <GitBranch className="h-4 w-4" /> },
  { type: "goal", label: "Goal Checkpoint", icon: <Target className="h-4 w-4" /> },
];

interface BlockPaletteProps {
  onAdd: (type: MessageBlockType) => void;
}

export function BlockPalette({ onAdd }: BlockPaletteProps) {
  return (
    <div className="flex items-center gap-3 px-4 py-3 border border-border rounded-lg bg-muted/20 mb-4">
      <span className="text-xs font-medium text-muted-foreground uppercase tracking-wider shrink-0">
        Add Block
      </span>
      <div className="flex items-center gap-2 flex-wrap">
        {PALETTE_ITEMS.map((item) => (
          <Button
            key={item.type}
            variant="outline"
            size="sm"
            className="h-8 text-xs gap-1.5"
            onClick={() => onAdd(item.type)}
          >
            {item.icon}
            {item.label}
          </Button>
        ))}
      </div>
    </div>
  );
}
