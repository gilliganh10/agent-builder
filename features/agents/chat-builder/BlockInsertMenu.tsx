"use client";

import { Plus, User, MessageSquare, FileText, Search, Microscope, GitBranch, Target } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import type { MessageBlockType } from "@/db/agents/schema";

const BLOCK_OPTIONS: { type: MessageBlockType; label: string; icon: React.ReactNode; description: string }[] = [
  { type: "user", label: "User Message", icon: <User className="h-3.5 w-3.5" />, description: "Represents the user's input" },
  { type: "assistant", label: "Assistant Message", icon: <MessageSquare className="h-3.5 w-3.5" />, description: "The agent's response" },
  { type: "system", label: "System Instruction", icon: <FileText className="h-3.5 w-3.5" />, description: "Hidden instructions or context" },
  { type: "context", label: "Context Retrieval", icon: <Search className="h-3.5 w-3.5" />, description: "Fetch data before responding" },
  { type: "extract", label: "Extract / Judge", icon: <Microscope className="h-3.5 w-3.5" />, description: "Structured extraction from user input" },
  { type: "branch", label: "Condition Branch", icon: <GitBranch className="h-3.5 w-3.5" />, description: "If/then branching with YES/NO paths" },
  { type: "goal", label: "Goal Checkpoint", icon: <Target className="h-3.5 w-3.5" />, description: "Check if goal is met and end conversation" },
];

interface BlockInsertMenuProps {
  onInsert: (type: MessageBlockType) => void;
  compact?: boolean;
}

export function BlockInsertMenu({ onInsert, compact }: BlockInsertMenuProps) {
  return (
    <DropdownMenu>
      <DropdownMenuTrigger asChild>
        {compact ? (
          <button className="flex items-center justify-center h-6 w-6 rounded-full border border-dashed border-border text-muted-foreground/50 hover:text-muted-foreground hover:border-muted-foreground transition-colors mx-auto">
            <Plus className="h-3 w-3" />
          </button>
        ) : (
          <Button variant="ghost" size="sm" className="h-7 text-xs gap-1.5">
            <Plus className="h-3.5 w-3.5" />
            Add Block
          </Button>
        )}
      </DropdownMenuTrigger>
      <DropdownMenuContent align="center" className="w-56">
        {BLOCK_OPTIONS.map((opt) => (
          <DropdownMenuItem
            key={opt.type}
            onClick={() => onInsert(opt.type)}
            className="flex items-start gap-2 py-2"
          >
            <span className="mt-0.5 text-muted-foreground">{opt.icon}</span>
            <div>
              <p className="text-sm font-medium">{opt.label}</p>
              <p className="text-[10px] text-muted-foreground">{opt.description}</p>
            </div>
          </DropdownMenuItem>
        ))}
      </DropdownMenuContent>
    </DropdownMenu>
  );
}
