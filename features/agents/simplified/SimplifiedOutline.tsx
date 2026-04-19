"use client";

import {
  ArrowDown,
  ArrowUp,
  Brain,
  Database,
  GitBranch,
  MessageSquare,
  MessageSquareMore,
  Plus,
  Replace,
  Split,
  Trash2,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import type {
  SimplifiedStep,
  SimplifiedStepKind,
} from "@/lib/agents/studio";
import {
  useSimplifiedBuilder,
  type SimplifiedLocation,
} from "./SimplifiedBuilderContext";

// ---------------------------------------------------------------------------
// Kind metadata
// ---------------------------------------------------------------------------

const KIND_ICON: Record<SimplifiedStepKind, React.ReactNode> = {
  input: <MessageSquare className="h-3.5 w-3.5" />,
  message: <MessageSquareMore className="h-3.5 w-3.5" />,
  transform: <Replace className="h-3.5 w-3.5" />,
  update_state: <Database className="h-3.5 w-3.5" />,
  condition: <Split className="h-3.5 w-3.5" />,
  parallel: <GitBranch className="h-3.5 w-3.5" />,
  end: <Brain className="h-3.5 w-3.5" />,
};

const KIND_BADGE_CLASS: Record<SimplifiedStepKind, string> = {
  input: "bg-primary/10 text-primary border-primary/30",
  message: "bg-[#E6EAF3] text-[#222E50]",
  transform: "bg-[#F4E6EB] text-[#946E83]",
  update_state: "bg-amber-50 text-amber-800",
  condition: "bg-[#FCE4E7] text-[#F45B69]",
  parallel: "bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
  end: "bg-muted text-muted-foreground",
};

const KIND_LABEL: Record<SimplifiedStepKind, string> = {
  input: "Input",
  message: "Message",
  transform: "Transform",
  update_state: "Update State",
  condition: "Condition",
  parallel: "Parallel",
  end: "End",
};

interface AddOption {
  kind: SimplifiedStepKind;
  blurb: string;
}

const ADDABLE: AddOption[] = [
  { kind: "message", blurb: "Draft the reply the user will see." },
  { kind: "transform", blurb: "Rewrite the user message for downstream steps." },
  { kind: "update_state", blurb: "Extract fields into working memory." },
  { kind: "condition", blurb: "Take a different path based on memory." },
  { kind: "parallel", blurb: "Run two paths at the same time, then merge." },
];

// ---------------------------------------------------------------------------
// Outline
// ---------------------------------------------------------------------------

export function SimplifiedOutline() {
  const {
    rootOrder,
    stepsById,
    insertStep,
    deleteStep,
    reorderStep,
    selectedStepId,
    setSelectedStepId,
  } = useSimplifiedBuilder();

  // Root sequence: always [input, ..., end]. The "body" is everything
  // between them; adding a step appends before end.
  const bodyIds = rootOrder.slice(1, -1);
  const endId = rootOrder[rootOrder.length - 1];
  const inputId = rootOrder[0];

  function handleAdd(kind: SimplifiedStepKind, insertAt: number) {
    const location: SimplifiedLocation = { kind: "root", index: insertAt };
    const id = insertStep(kind, location);
    setSelectedStepId(id);
  }

  return (
    <section className="space-y-3">
      <header className="flex items-end justify-between gap-4">
        <div>
          <h2 className="text-sm font-semibold">Steps</h2>
          <p className="text-[11px] text-muted-foreground">
            What this agent does, in order. Click a step to edit it.
          </p>
        </div>
        <AddStepMenu
          onAdd={(kind) => handleAdd(kind, 1 + bodyIds.length)}
        />
      </header>

      <ol className="space-y-2">
        <li>
          <StepRow
            stepId={inputId}
            index={0}
            isSelected={selectedStepId === inputId}
            onSelect={() => setSelectedStepId(inputId)}
          />
        </li>

        {bodyIds.length === 0 ? (
          <li>
            <EmptyState onAdd={(kind) => handleAdd(kind, 1)} />
          </li>
        ) : (
          bodyIds.map((id, i) => {
            const step = stepsById.get(id);
            if (!step) return null;
            return (
              <li key={id}>
                <StepRow
                  stepId={id}
                  index={i + 1}
                  isSelected={selectedStepId === id}
                  onSelect={() => setSelectedStepId(id)}
                  onDelete={() => deleteStep(id)}
                  onMoveUp={
                    i > 0 ? () => reorderStep(id, "up") : undefined
                  }
                  onMoveDown={
                    i < bodyIds.length - 1
                      ? () => reorderStep(id, "down")
                      : undefined
                  }
                />
                {step.kind === "condition" && (
                  <ConditionChildren parentId={id} />
                )}
                {step.kind === "parallel" && (
                  <ParallelChildren parentId={id} />
                )}
              </li>
            );
          })
        )}

        <li>
          <StepRow
            stepId={endId}
            index={bodyIds.length + 1}
            isSelected={selectedStepId === endId}
            onSelect={() => setSelectedStepId(endId)}
          />
        </li>
      </ol>
    </section>
  );
}

// ---------------------------------------------------------------------------
// Nested children (conditions + parallels)
// ---------------------------------------------------------------------------

function ConditionChildren({ parentId }: { parentId: string }) {
  const { stepsById } = useSimplifiedBuilder();
  const parent = stepsById.get(parentId);
  if (parent?.kind !== "condition") return null;
  return (
    <div className="ml-10 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
      <BranchColumn
        label="Yes"
        parentId={parentId}
        location="yes"
        ids={parent.yesSteps}
      />
      <BranchColumn
        label="No"
        parentId={parentId}
        location="no"
        ids={parent.noSteps}
      />
    </div>
  );
}

function ParallelChildren({ parentId }: { parentId: string }) {
  const { stepsById } = useSimplifiedBuilder();
  const parent = stepsById.get(parentId);
  if (parent?.kind !== "parallel") return null;
  return (
    <div className="ml-10 mt-2 grid grid-cols-1 gap-2 sm:grid-cols-2">
      <BranchColumn
        label={parent.laneALabel ?? "Lane A"}
        parentId={parentId}
        location="laneA"
        ids={parent.laneA}
      />
      <BranchColumn
        label={parent.laneBLabel ?? "Lane B"}
        parentId={parentId}
        location="laneB"
        ids={parent.laneB}
      />
    </div>
  );
}

function BranchColumn({
  label,
  parentId,
  location,
  ids,
}: {
  label: string;
  parentId: string;
  location: "yes" | "no" | "laneA" | "laneB";
  ids: string[];
}) {
  const {
    stepsById,
    insertStep,
    deleteStep,
    reorderStep,
    selectedStepId,
    setSelectedStepId,
  } = useSimplifiedBuilder();

  function addChild(kind: SimplifiedStepKind) {
    const id = insertStep(kind, {
      kind: location,
      parentId,
      index: ids.length,
    });
    setSelectedStepId(id);
  }

  return (
    <div className="rounded-md border border-border/60 bg-muted/10 p-2">
      <div className="mb-2 flex items-center justify-between">
        <span className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          {label}
        </span>
        <AddStepMenu onAdd={addChild} compact />
      </div>
      {ids.length === 0 ? (
        <p className="text-[10px] italic text-muted-foreground">Empty</p>
      ) : (
        <ol className="space-y-1.5">
          {ids.map((id, i) => {
            const step = stepsById.get(id);
            if (!step) return null;
            return (
              <li key={id}>
                <StepRow
                  stepId={id}
                  index={i + 1}
                  compact
                  isSelected={selectedStepId === id}
                  onSelect={() => setSelectedStepId(id)}
                  onDelete={() => deleteStep(id)}
                  onMoveUp={
                    i > 0 ? () => reorderStep(id, "up") : undefined
                  }
                  onMoveDown={
                    i < ids.length - 1
                      ? () => reorderStep(id, "down")
                      : undefined
                  }
                />
              </li>
            );
          })}
        </ol>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Step row
// ---------------------------------------------------------------------------

function StepRow({
  stepId,
  index,
  isSelected,
  onSelect,
  onDelete,
  onMoveUp,
  onMoveDown,
  compact,
}: {
  stepId: string;
  index: number;
  isSelected: boolean;
  onSelect: () => void;
  onDelete?: () => void;
  onMoveUp?: () => void;
  onMoveDown?: () => void;
  compact?: boolean;
}) {
  const { stepsById } = useSimplifiedBuilder();
  const step = stepsById.get(stepId);
  if (!step) return null;

  const preview = stepPreview(step);
  const truncated = preview.length > 140 ? `${preview.slice(0, 140)}…` : preview;
  const isFixed = step.kind === "input" || step.kind === "end";

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onSelect}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onSelect();
        }
      }}
      className={cn(
        "group flex w-full cursor-pointer items-start gap-3 rounded-lg border bg-background p-3 text-left transition-colors",
        compact ? "p-2" : "p-3",
        isSelected
          ? "border-primary/60 bg-muted/40"
          : "border-border/60 hover:border-border hover:bg-muted/40"
      )}
    >
      <span
        className={cn(
          "flex shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold",
          compact ? "h-5 w-5 text-[10px]" : "h-7 w-7"
        )}
      >
        {index}
      </span>

      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn("gap-1 capitalize", KIND_BADGE_CLASS[step.kind])}
          >
            {KIND_ICON[step.kind]}
            {KIND_LABEL[step.kind]}
          </Badge>
          <span className={cn("font-medium", compact ? "text-xs" : "text-sm")}>
            {step.label || KIND_LABEL[step.kind]}
          </span>
        </div>
        {!compact && truncated && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {truncated}
          </p>
        )}
      </div>

      {!isFixed && (onMoveUp || onMoveDown || onDelete) && (
        <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={!onMoveUp}
            onClick={(e) => {
              e.stopPropagation();
              onMoveUp?.();
            }}
            aria-label="Move up"
          >
            <ArrowUp className="h-3.5 w-3.5" />
          </Button>
          <Button
            variant="ghost"
            size="icon"
            className="h-7 w-7"
            disabled={!onMoveDown}
            onClick={(e) => {
              e.stopPropagation();
              onMoveDown?.();
            }}
            aria-label="Move down"
          >
            <ArrowDown className="h-3.5 w-3.5" />
          </Button>
          {onDelete && (
            <Button
              variant="ghost"
              size="icon"
              className="h-7 w-7 text-muted-foreground hover:text-destructive"
              onClick={(e) => {
                e.stopPropagation();
                onDelete();
              }}
              aria-label="Remove step"
            >
              <Trash2 className="h-3.5 w-3.5" />
            </Button>
          )}
        </div>
      )}
    </div>
  );
}

function stepPreview(step: SimplifiedStep): string {
  switch (step.kind) {
    case "message":
    case "transform":
      return step.instructions ?? "";
    case "update_state":
      return (
        step.instructions ??
        `Extracts ${step.jsonSchema.length} field${step.jsonSchema.length === 1 ? "" : "s"}.`
      );
    case "condition":
      return `${step.condition.field || "(unset)"} ${step.condition.operator}`;
    case "parallel":
      return `${step.laneALabel ?? "Lane A"} · ${step.laneBLabel ?? "Lane B"}`;
    case "input":
      return "Conversation entry point.";
    case "end":
      return step.closeConversation ? "Closes the conversation." : "Flow completes.";
  }
}

// ---------------------------------------------------------------------------
// Add menu / empty state
// ---------------------------------------------------------------------------

function AddStepMenu({
  onAdd,
  compact,
}: {
  onAdd: (kind: SimplifiedStepKind) => void;
  compact?: boolean;
}) {
  return (
    <details className="group relative">
      <summary
        className={cn(
          "inline-flex cursor-pointer list-none items-center gap-1 rounded-md border border-border bg-background font-medium shadow-sm hover:bg-muted",
          compact ? "px-2 py-0.5 text-[10px]" : "px-3 py-1.5 text-xs"
        )}
      >
        <Plus className={compact ? "h-3 w-3" : "h-3.5 w-3.5"} />
        Add step
      </summary>
      <div className="absolute right-0 z-10 mt-1 w-72 rounded-md border border-border bg-popover p-1.5 shadow-md">
        {ADDABLE.map((opt) => (
          <button
            key={opt.kind}
            type="button"
            onClick={(e) => {
              (
                e.currentTarget.closest("details") as HTMLDetailsElement | null
              )?.removeAttribute("open");
              onAdd(opt.kind);
            }}
            className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          >
            <span className="mt-0.5 text-muted-foreground">
              {KIND_ICON[opt.kind]}
            </span>
            <span className="flex-1">
              <span className="font-medium">{KIND_LABEL[opt.kind]}</span>
              <span className="block text-[10px] text-muted-foreground">
                {opt.blurb}
              </span>
            </span>
          </button>
        ))}
      </div>
    </details>
  );
}

function EmptyState({
  onAdd,
}: {
  onAdd: (kind: SimplifiedStepKind) => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-6 text-center">
      <h3 className="text-sm font-semibold">Start with a step</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
        Add a Message to draft a reply, or a Transform to rewrite the user
        message first.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {ADDABLE.map((opt) => (
          <Button
            key={opt.kind}
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onAdd(opt.kind)}
          >
            <span className="mr-1">{KIND_ICON[opt.kind]}</span>
            {KIND_LABEL[opt.kind]}
          </Button>
        ))}
      </div>
    </div>
  );
}
