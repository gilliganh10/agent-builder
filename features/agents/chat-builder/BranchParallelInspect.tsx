"use client";

import { Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { useChatBuilder } from "@/features/agents/workspace/ChatBuilderContext";
import type {
  BranchBlockConfig,
  ConditionConfig,
  MessageBlockType,
  ParallelBlockConfig,
} from "@/db/agents/schema";
import type { ParallelLane } from "@/lib/agents/chat-builder/block-tree";
import { cn } from "@/lib/utils";

const NESTABLE_TYPES: MessageBlockType[] = [
  "assistant",
  "extract",
  "branch",
  "parallel",
  "goal",
  "system",
  "context",
];

const TYPE_LABEL: Record<MessageBlockType, string> = {
  user: "User",
  assistant: "Assistant",
  system: "System",
  context: "Context",
  extract: "Extract",
  branch: "Condition",
  parallel: "Parallel",
  goal: "Goal",
};

export function BranchInspectPanel({
  branchBlockId,
  config,
  onChange,
}: {
  branchBlockId: string;
  config: BranchBlockConfig;
  onChange: (cfg: BranchBlockConfig) => void;
}) {
  const { addBranchChild, deleteBlock, setSelectedBlockId } = useChatBuilder();

  function updateCondition(patch: Partial<ConditionConfig>) {
    onChange({ ...config, condition: { ...config.condition, ...patch } });
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Condition
      </p>
      <p className="text-[11px] text-muted-foreground">
        Choose which memory field to test. Add steps to each path from the menus
        below, then click a step label to edit it in this panel.
      </p>

      <div>
        <Label className="text-[10px]">Field</Label>
        <Input
          className="h-7 text-xs font-mono"
          value={config.condition.field}
          onChange={(e) => updateCondition({ field: e.target.value })}
          placeholder="e.g. hasItems or vars.count"
        />
      </div>

      <div>
        <Label className="text-[10px]">Operator</Label>
        <Select
          value={config.condition.operator}
          onValueChange={(v) => updateCondition({ operator: v as ConditionConfig["operator"] })}
        >
          <SelectTrigger className="h-7 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eq">equals (==)</SelectItem>
            <SelectItem value="neq">not equals (!=)</SelectItem>
            <SelectItem value="gt">greater than (&gt;)</SelectItem>
            <SelectItem value="gte">greater or equal (&gt;=)</SelectItem>
            <SelectItem value="lt">less than (&lt;)</SelectItem>
            <SelectItem value="lte">less or equal (&lt;=)</SelectItem>
            <SelectItem value="contains">contains</SelectItem>
            <SelectItem value="exists">exists</SelectItem>
            <SelectItem value="not_exists">not exists</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {!["exists", "not_exists"].includes(config.condition.operator) && (
        <div>
          <Label className="text-[10px]">Value</Label>
          <Input
            className="h-7 text-xs font-mono"
            value={String(config.condition.value ?? "")}
            onChange={(e) => {
              const raw = e.target.value;
              let parsed: unknown = raw;
              if (raw === "true") parsed = true;
              else if (raw === "false") parsed = false;
              else if (raw !== "" && !isNaN(Number(raw))) parsed = Number(raw);
              updateCondition({ value: parsed });
            }}
            placeholder="true, false, 0, ..."
          />
        </div>
      )}

      <Separator />

      <BranchLane
        title="Yes path"
        variant="yes"
        blocks={config.trueBranch}
        onSelectChild={(id) => setSelectedBlockId(id)}
        onRemoveChild={(id) => deleteBlock(id)}
        onAdd={(type) => addBranchChild(branchBlockId, "trueBranch", type)}
      />

      <BranchLane
        title="No path"
        variant="no"
        blocks={config.falseBranch}
        onSelectChild={(id) => setSelectedBlockId(id)}
        onRemoveChild={(id) => deleteBlock(id)}
        onAdd={(type) => addBranchChild(branchBlockId, "falseBranch", type)}
      />
    </div>
  );
}

function BranchLane({
  title,
  variant,
  blocks,
  onSelectChild,
  onRemoveChild,
  onAdd,
}: {
  title: string;
  variant: "yes" | "no";
  blocks: { id: string; label: string; type: string }[];
  onSelectChild: (id: string) => void;
  onRemoveChild: (id: string) => void;
  onAdd: (type: MessageBlockType) => void;
}) {
  const border = variant === "yes" ? "border-green-500/50" : "border-red-500/50";
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p
          className={
            variant === "yes"
              ? "text-[10px] font-semibold uppercase tracking-wider text-green-700"
              : "text-[10px] font-semibold uppercase tracking-wider text-red-600"
          }
        >
          {title}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-6 gap-1 text-[10px]">
              <Plus className="h-3 w-3" />
              Add step
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {NESTABLE_TYPES.map((t) => (
              <DropdownMenuItem key={t} className="text-xs" onClick={() => onAdd(t)}>
                {TYPE_LABEL[t]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className={cn("space-y-1.5 rounded-md border-l-2 pl-2", border)}>
        {blocks.length === 0 ? (
          <p className="text-[10px] italic text-muted-foreground">No steps — pass-through</p>
        ) : (
          blocks.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-1 rounded border border-border/60 bg-muted/20 px-2 py-1"
            >
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left text-[11px] font-medium hover:underline"
                onClick={() => onSelectChild(b.id)}
              >
                <span className="text-muted-foreground">{b.type}</span> · {b.label || b.id}
              </button>
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onRemoveChild(b.id)}
                aria-label="Remove step"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}

export function ParallelInspectPanel({
  parallelBlockId,
  config,
}: {
  parallelBlockId: string;
  config: ParallelBlockConfig;
}) {
  const { addParallelLaneChild, deleteBlock, setSelectedBlockId } = useChatBuilder();

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
        Parallel lanes
      </p>
      <p className="text-[11px] text-muted-foreground">
        Both lanes run at the same time, then merge. Add steps per lane, then
        click a label to configure it here.
      </p>

      <ParallelLane
        title="Lane A"
        lane="laneA"
        blocks={config.laneA}
        onSelectChild={(id) => setSelectedBlockId(id)}
        onRemoveChild={(id) => deleteBlock(id)}
        onAdd={(type) => addParallelLaneChild(parallelBlockId, "laneA", type)}
      />

      <ParallelLane
        title="Lane B"
        lane="laneB"
        blocks={config.laneB}
        onSelectChild={(id) => setSelectedBlockId(id)}
        onRemoveChild={(id) => deleteBlock(id)}
        onAdd={(type) => addParallelLaneChild(parallelBlockId, "laneB", type)}
      />
    </div>
  );
}

function ParallelLane({
  title,
  lane,
  blocks,
  onSelectChild,
  onRemoveChild,
  onAdd,
}: {
  title: string;
  lane: ParallelLane;
  blocks: { id: string; label: string; type: string }[];
  onSelectChild: (id: string) => void;
  onRemoveChild: (id: string) => void;
  onAdd: (type: MessageBlockType) => void;
}) {
  void lane;
  return (
    <div>
      <div className="mb-1.5 flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-foreground">
          {title}
        </p>
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="outline" size="sm" className="h-6 gap-1 text-[10px]">
              <Plus className="h-3 w-3" />
              Add step
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-44">
            {NESTABLE_TYPES.map((t) => (
              <DropdownMenuItem key={t} className="text-xs" onClick={() => onAdd(t)}>
                {TYPE_LABEL[t]}
              </DropdownMenuItem>
            ))}
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
      <div className="space-y-1.5 rounded-md border border-border/60 border-l-4 border-l-primary/40 pl-2">
        {blocks.length === 0 ? (
          <p className="text-[10px] italic text-muted-foreground">Empty lane</p>
        ) : (
          blocks.map((b) => (
            <div
              key={b.id}
              className="flex items-center gap-1 rounded border border-border/60 bg-muted/20 px-2 py-1"
            >
              <button
                type="button"
                className="min-w-0 flex-1 truncate text-left text-[11px] font-medium hover:underline"
                onClick={() => onSelectChild(b.id)}
              >
                <span className="text-muted-foreground">{b.type}</span> · {b.label || b.id}
              </button>
              <button
                type="button"
                className="text-muted-foreground hover:text-destructive"
                onClick={() => onRemoveChild(b.id)}
                aria-label="Remove step"
              >
                <Trash2 className="h-3 w-3" />
              </button>
            </div>
          ))
        )}
      </div>
    </div>
  );
}
