"use client";

import { useMemo } from "react";
import {
  ArrowDown,
  ArrowUp,
  Brain,
  CornerDownRight,
  Database,
  MessageSquare,
  MessageSquareMore,
  Plus,
  Replace,
  Split,
  Trash2,
  AlertTriangle,
  GitBranch,
} from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { cn } from "@/lib/utils";
import { getStudioStepsFromSpec } from "@/lib/agents/studio";
import type {
  StudioStep,
  StudioStepKind,
  StudioStepTrigger,
} from "@/lib/agents/studio/types";
import type { BlockAttachment, MessageBlock } from "@/db/agents/schema";
import { NewFromTemplateButton } from "./NewFromTemplateButton";
import { useAgentWorkspace } from "./workspace/AgentWorkspaceContext";
import { useChatBuilder } from "./workspace/ChatBuilderContext";
import { InputsObjectivesMemoryHub } from "@/features/agents/shared/InputsObjectivesMemoryHub";

// ---------------------------------------------------------------------------
// Add Step kind → chatBuilder edits
// ---------------------------------------------------------------------------

interface AddStepOption {
  kind: StudioStepKind;
  label: string;
  blurb: string;
  icon: React.ReactNode;
}

const ADD_STEP_OPTIONS: AddStepOption[] = [
  {
    kind: "understand",
    label: "Understand",
    blurb: "Read the user's message and classify or summarise it.",
    icon: <Brain className="h-3.5 w-3.5" />,
  },
  {
    kind: "extract",
    label: "Extract",
    blurb: "Pull structured fields out of the conversation into memory.",
    icon: <Database className="h-3.5 w-3.5" />,
  },
  {
    kind: "transform",
    label: "Transform",
    blurb: "Rewrite the user's message before the agent replies.",
    icon: <Replace className="h-3.5 w-3.5" />,
  },
  {
    kind: "respond",
    label: "Respond",
    blurb: "Draft the reply the user will see.",
    icon: <MessageSquareMore className="h-3.5 w-3.5" />,
  },
  {
    kind: "branch",
    label: "Branch",
    blurb: "Take a different path based on memory.",
    icon: <Split className="h-3.5 w-3.5" />,
  },
  {
    kind: "parallel",
    label: "Parallel",
    blurb: "Run two paths at the same time, then merge.",
    icon: <GitBranch className="h-3.5 w-3.5" />,
  },
];

const KIND_ICON: Record<StudioStepKind, React.ReactNode> = {
  understand: <Brain className="h-3.5 w-3.5" />,
  extract: <Database className="h-3.5 w-3.5" />,
  transform: <Replace className="h-3.5 w-3.5" />,
  respond: <MessageSquareMore className="h-3.5 w-3.5" />,
  branch: <Split className="h-3.5 w-3.5" />,
  parallel: <GitBranch className="h-3.5 w-3.5" />,
};

const TRIGGER_LABEL: Record<StudioStepTrigger, string> = {
  before_user: "Before user message",
  after_user: "After user message",
  replace_user: "Replaces user message",
  before_reply: "Before reply",
  after_reply: "After reply",
  standalone: "Standalone",
};

// ---------------------------------------------------------------------------

export function PlanBuilderTab() {
  const { agent, setRightPanelMode, setRightPanelOpen, switchBuilderSubtab } =
    useAgentWorkspace();
  const {
    blocks,
    stateConfig,
    setStateConfig,
    envVars,
    setEnvVars,
    envOverrides,
    setEnvOverrides,
    updateBlock,
    insertBlock,
    setSelectedBlockId,
    setSelectedAttachmentId,
    fromDecompiledGraph,
  } = useChatBuilder();

  const steps = useMemo(
    () => getStudioStepsFromSpec({ blocks }),
    [blocks]
  );

  const userBlock = useMemo(() => {
    const sorted = [...blocks].sort((a, b) => a.position - b.position);
    return sorted.find((b) => b.type === "user") ?? null;
  }, [blocks]);

  function openUserMessageInspect() {
    if (!userBlock) return;
    setSelectedBlockId(userBlock.id);
    setSelectedAttachmentId(null);
    setRightPanelMode("inspect");
    setRightPanelOpen(true);
  }

  function openInspectorForStep(step: StudioStep) {
    setSelectedBlockId(step.origin.blockId);
    setSelectedAttachmentId(step.origin.attachmentId ?? null);
    setRightPanelMode("inspect");
    setRightPanelOpen(true);
  }

  function removeStep(step: StudioStep) {
    if (step.origin.kind === "attachment" && step.origin.attachmentId) {
      const block = blocks.find((b) => b.id === step.origin.blockId);
      if (!block) return;
      updateBlock(block.id, {
        attachments: block.attachments.filter(
          (a) => a.id !== step.origin.attachmentId
        ),
      });
      return;
    }
    // Block-origin steps (extract, branch, responder-from-content) cannot be
    // cleanly removed from Plan v1 without dropping other data. For v1 we
    // only support removing attachment-based steps; point the user to Chat.
    // eslint-disable-next-line no-alert
    alert(
      "This step is part of a block. Open Inspect (select the block) to remove it so Plan edits stay predictable."
    );
  }

  function addStep(kind: StudioStepKind) {
    switch (kind) {
      case "understand":
      case "transform":
      case "extract":
        appendAttachmentToUserBlock(kind);
        return;
      case "respond":
        appendResponderToAssistantBlock();
        return;
      case "branch":
        insertBlock("branch", Math.max(-1, ...blocks.map((b) => b.position)));
        return;
      case "parallel":
        insertBlock("parallel", Math.max(-1, ...blocks.map((b) => b.position)));
        return;
    }
  }

  function appendAttachmentToUserBlock(
    kind: "understand" | "transform" | "extract"
  ) {
    const userBlock = blocks.find((b) => b.type === "user");
    if (!userBlock) {
      insertBlock("user", Math.max(-1, ...blocks.map((b) => b.position)));
      return;
    }
    const att = attachmentForKind(kind);
    updateBlock(userBlock.id, {
      attachments: [...userBlock.attachments, att],
    });
    setSelectedBlockId(userBlock.id);
    setSelectedAttachmentId(att.id);
    setRightPanelMode("inspect");
    setRightPanelOpen(true);
  }

  function appendResponderToAssistantBlock() {
    let assistant = blocks.find((b) => b.type === "assistant");
    if (!assistant) {
      insertBlock("assistant", Math.max(-1, ...blocks.map((b) => b.position)));
      return;
    }
    const att: BlockAttachment = {
      id: generateAttachmentId(),
      mode: "before",
      label: "Reply",
      inlinePrimitive: { kind: "responder", instructions: "" },
    };
    updateBlock(assistant.id, {
      attachments: [...assistant.attachments, att],
    });
    setSelectedBlockId(assistant.id);
    setSelectedAttachmentId(att.id);
    setRightPanelMode("inspect");
    setRightPanelOpen(true);
  }

  return (
    <div className="space-y-6">
      {fromDecompiledGraph && <GraphConflictBanner />}

      <InputsObjectivesMemoryHub
        purpose={{
          name: agent.name,
          description: agent.description,
          memoryFieldCount: stateConfig.fields.length,
          objectiveCount: stateConfig.goals.length,
          stepCount: steps.length,
          onOpenTest: () => switchBuilderSubtab("test"),
        }}
        envVars={envVars}
        onEnvVarsChange={setEnvVars}
        envOverrides={envOverrides}
        onEnvOverridesChange={setEnvOverrides}
        stateConfig={stateConfig}
        onStateConfigChange={setStateConfig}
      />

      <section className="space-y-3">
        <header className="flex items-end justify-between gap-4">
          <div>
            <h2 className="text-sm font-semibold">Steps</h2>
            <p className="text-[11px] text-muted-foreground">
              What this agent does, in order. Click a step to edit details.
            </p>
          </div>
          <AddStepMenu onAdd={addStep} />
        </header>

        <ol className="space-y-2">
          {userBlock && (
            <li key={`user-anchor-${userBlock.id}`}>
              <UserMessagePipelineRow
                userBlock={userBlock}
                onClick={openUserMessageInspect}
              />
            </li>
          )}
          {steps.length === 0 ? (
            <li>
              <EmptyStepsState onAdd={addStep} />
            </li>
          ) : (
            steps.map((step, i) => (
              <li key={step.id}>
                <StepRow
                  step={step}
                  blocks={blocks}
                  index={i + 1}
                  onClick={() => openInspectorForStep(step)}
                  onSelectNested={(id) => {
                    setSelectedBlockId(id);
                    setSelectedAttachmentId(null);
                    setRightPanelMode("inspect");
                    setRightPanelOpen(true);
                  }}
                  onRemove={() => removeStep(step)}
                  canMoveUp={i > 0}
                  canMoveDown={i < steps.length - 1}
                />
              </li>
            ))
          )}
        </ol>
      </section>

      {steps.length > 0 && (
        <div className="rounded-lg border border-dashed border-border/70 p-4 text-xs text-muted-foreground">
          Finished wiring this up?{" "}
          <button
            type="button"
            className="font-medium text-foreground underline-offset-2 hover:underline"
            onClick={() => switchBuilderSubtab("test")}
          >
            Run a test conversation
          </button>{" "}
          to see it in action.
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Subcomponents
// ---------------------------------------------------------------------------

function GraphConflictBanner() {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1 text-sm">
        <p className="font-medium">This agent was last edited in the graph.</p>
        <p className="text-xs opacity-90">
          Plan shows a best-effort approximation. Saving from Plan rewrites the
          graph from what you see here.
        </p>
      </div>
    </div>
  );
}

function UserMessagePipelineRow({
  userBlock,
  onClick,
}: {
  userBlock: MessageBlock;
  onClick: () => void;
}) {
  const n = userBlock.attachments.length;
  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group flex w-full cursor-pointer items-start gap-3 rounded-lg border border-dashed border-primary/30 bg-muted/15 p-3 text-left transition-colors hover:border-primary/50 hover:bg-muted/30"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-primary/10 text-xs font-semibold text-primary">
        <MessageSquare className="h-3.5 w-3.5" />
      </span>
      <div className="min-w-0 flex-1 space-y-1">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge variant="outline" className="gap-1 border-primary/30 bg-background">
            Entry
          </Badge>
          <span className="text-sm font-medium">User message</span>
          <Badge variant="secondary" className="text-[10px]">
            Pipeline start
          </Badge>
        </div>
        <p className="text-[11px] text-muted-foreground">
          {n === 0
            ? "Incoming user text. Add Understand / Extract / Transform steps here from Add step."
            : `${n} pre-processing step${n === 1 ? "" : "s"} before the rest of the flow.`}
        </p>
      </div>
    </div>
  );
}

function StepRow({
  step,
  blocks,
  index,
  onClick,
  onSelectNested,
  onRemove,
  canMoveUp,
  canMoveDown,
}: {
  step: StudioStep;
  blocks: MessageBlock[];
  index: number;
  onClick: () => void;
  onSelectNested: (blockId: string) => void;
  onRemove: () => void;
  canMoveUp: boolean;
  canMoveDown: boolean;
}) {
  const preview = step.instructions.trim().split("\n")[0] ?? "";
  const truncated = preview.length > 140 ? `${preview.slice(0, 140)}…` : preview;

  const branchBlock =
    step.kind === "branch" && step.origin.kind === "block"
      ? blocks.find((b) => b.id === step.origin.blockId)
      : undefined;
  const parallelBlock =
    step.kind === "parallel" && step.origin.kind === "block"
      ? blocks.find((b) => b.id === step.origin.blockId)
      : undefined;

  return (
    <div
      role="button"
      tabIndex={0}
      onClick={onClick}
      onKeyDown={(e) => {
        if (e.key === "Enter" || e.key === " ") {
          e.preventDefault();
          onClick();
        }
      }}
      className="group flex w-full cursor-pointer items-start gap-3 rounded-lg border border-border/60 bg-background p-3 text-left transition-colors hover:border-border hover:bg-muted/40"
    >
      <span className="flex h-7 w-7 shrink-0 items-center justify-center rounded-full bg-muted text-xs font-semibold">
        {index}
      </span>

      <div className="min-w-0 flex-1 space-y-1.5">
        <div className="flex flex-wrap items-center gap-1.5">
          <Badge
            variant="outline"
            className={cn("capitalize gap-1", KIND_BADGE_CLASS[step.kind])}
          >
            {KIND_ICON[step.kind]}
            {step.kind}
          </Badge>
          <span className="text-sm font-medium">{step.label}</span>
          <Badge variant="secondary" className="text-[10px]">
            {TRIGGER_LABEL[step.trigger]}
          </Badge>
        </div>

        {truncated && (
          <p className="line-clamp-2 text-xs text-muted-foreground">
            {truncated}
          </p>
        )}

        <div className="flex flex-wrap gap-x-3 gap-y-1 pt-0.5 text-[10px] text-muted-foreground">
          {step.memoryReads.length > 0 && (
            <IoChip label="reads" items={step.memoryReads} />
          )}
          {step.memoryWrites.length > 0 && (
            <IoChip
              label="writes"
              items={step.memoryWrites.map((w) =>
                w.from === w.to ? w.to : `${w.from} \u2192 ${w.to}`
              )}
            />
          )}
          {step.output.kind !== "free_text" && (
            <IoChip
              label="outputs"
              items={[
                step.output.kind === "fields"
                  ? `${step.output.fields?.length ?? 0} fields`
                  : "JSON",
              ]}
            />
          )}
        </div>

        {step.kind === "branch" && branchBlock?.branchConfig && (
          <div
            className="mt-2 space-y-2 border-t border-border/50 pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <NestedLaneButtons
              label="Yes"
              variant="yes"
              childrenBlocks={branchBlock.branchConfig.trueBranch}
              onSelectChild={onSelectNested}
            />
            <NestedLaneButtons
              label="No"
              variant="no"
              childrenBlocks={branchBlock.branchConfig.falseBranch}
              onSelectChild={onSelectNested}
            />
          </div>
        )}

        {step.kind === "parallel" && parallelBlock?.parallelConfig && (
          <div
            className="mt-2 space-y-2 border-t border-border/50 pt-2"
            onClick={(e) => e.stopPropagation()}
          >
            <NestedLaneButtons
              label="Lane A"
              variant="lane"
              childrenBlocks={parallelBlock.parallelConfig.laneA}
              onSelectChild={onSelectNested}
            />
            <NestedLaneButtons
              label="Lane B"
              variant="lane"
              childrenBlocks={parallelBlock.parallelConfig.laneB}
              onSelectChild={onSelectNested}
            />
          </div>
        )}
      </div>

      <div className="flex shrink-0 items-center gap-0.5 opacity-0 transition-opacity group-hover:opacity-100 focus-within:opacity-100">
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={!canMoveUp}
          onClick={(e) => {
            e.stopPropagation();
          }}
          aria-label="Move up"
          title="Reorder from the Chat tab"
        >
          <ArrowUp className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          disabled={!canMoveDown}
          onClick={(e) => {
            e.stopPropagation();
          }}
          aria-label="Move down"
          title="Reorder from the Chat tab"
        >
          <ArrowDown className="h-3.5 w-3.5" />
        </Button>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7 text-muted-foreground hover:text-destructive"
          onClick={(e) => {
            e.stopPropagation();
            onRemove();
          }}
          aria-label="Remove step"
        >
          <Trash2 className="h-3.5 w-3.5" />
        </Button>
      </div>
    </div>
  );
}

const KIND_BADGE_CLASS: Record<StudioStepKind, string> = {
  understand: "bg-[#F5EFE6] text-[#6B5338]",
  extract: "bg-amber-50 text-amber-800",
  transform: "bg-[#F4E6EB] text-[#946E83]",
  respond: "bg-[#E6EAF3] text-[#222E50]",
  branch: "bg-[#FCE4E7] text-[#F45B69]",
  parallel: "bg-sky-50 text-sky-900 dark:bg-sky-950/40 dark:text-sky-100",
};

function NestedLaneButtons({
  label,
  variant,
  childrenBlocks,
  onSelectChild,
}: {
  label: string;
  variant: "yes" | "no" | "lane";
  childrenBlocks: MessageBlock[];
  onSelectChild: (id: string) => void;
}) {
  const color =
    variant === "yes"
      ? "text-green-700"
      : variant === "no"
        ? "text-red-600"
        : "text-muted-foreground";
  return (
    <div className="space-y-1">
      <p className={cn("text-[10px] font-semibold uppercase tracking-wider", color)}>
        {label} path
      </p>
      <div className="flex flex-wrap gap-1">
        {childrenBlocks.length === 0 ? (
          <span className="text-[10px] italic text-muted-foreground">Empty</span>
        ) : (
          childrenBlocks.map((c) => (
            <button
              key={c.id}
              type="button"
              className="rounded-md border border-border/70 bg-background px-2 py-0.5 text-[10px] font-medium hover:bg-muted"
              onClick={() => onSelectChild(c.id)}
            >
              {c.type} · {c.label || c.id.slice(0, 8)}
            </button>
          ))
        )}
      </div>
    </div>
  );
}

function IoChip({ label, items }: { label: string; items: string[] }) {
  return (
    <span className="flex items-center gap-1">
      <CornerDownRight className="h-3 w-3" />
      <span className="uppercase tracking-wider">{label}</span>
      <span className="font-mono text-foreground/80">{items.join(", ")}</span>
    </span>
  );
}

function AddStepMenu({ onAdd }: { onAdd: (kind: StudioStepKind) => void }) {
  return (
    <details className="group relative">
      <summary className="inline-flex cursor-pointer list-none items-center gap-1 rounded-md border border-border bg-background px-3 py-1.5 text-xs font-medium shadow-sm hover:bg-muted">
        <Plus className="h-3.5 w-3.5" />
        Add step
      </summary>
      <div className="absolute right-0 z-10 mt-1 w-72 rounded-md border border-border bg-popover p-1.5 shadow-md">
        {ADD_STEP_OPTIONS.map((opt) => (
          <button
            key={opt.kind}
            type="button"
            onClick={(e) => {
              (e.currentTarget.closest("details") as HTMLDetailsElement | null)?.removeAttribute(
                "open"
              );
              onAdd(opt.kind);
            }}
            className="flex w-full items-start gap-2 rounded-md px-2 py-1.5 text-left text-xs hover:bg-muted"
          >
            <span className="mt-0.5 text-muted-foreground">{opt.icon}</span>
            <span className="flex-1">
              <span className="font-medium">{opt.label}</span>
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

function EmptyStepsState({
  onAdd,
}: {
  onAdd: (kind: StudioStepKind) => void;
}) {
  return (
    <div className="rounded-lg border border-dashed border-border/70 bg-muted/20 p-6 text-center">
      <h3 className="text-sm font-semibold">Start with a step</h3>
      <p className="mx-auto mt-1 max-w-sm text-xs text-muted-foreground">
        Most agents begin by replying to the user. Add a Respond step, then add
        Understand/Extract steps if you want to read or remember things first.
      </p>
      <div className="mt-4 flex flex-wrap justify-center gap-2">
        {ADD_STEP_OPTIONS.map((opt) => (
          <Button
            key={opt.kind}
            variant="outline"
            size="sm"
            className="h-8 text-xs"
            onClick={() => onAdd(opt.kind)}
          >
            <span className="mr-1">{opt.icon}</span>
            {opt.label}
          </Button>
        ))}
      </div>
      <p className="mt-4 text-[11px] text-muted-foreground">
        Or spin up a ready-made agent —
      </p>
      <div className="mt-2 flex justify-center">
        <NewFromTemplateButton
          variant="outline"
          size="sm"
          label="Browse templates"
        />
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function generateAttachmentId(): string {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function attachmentForKind(
  kind: "understand" | "transform" | "extract"
): BlockAttachment {
  if (kind === "transform") {
    return {
      id: generateAttachmentId(),
      mode: "override",
      label: "Rewrite user message",
      inlinePrimitive: {
        kind: "rewriter",
        instructions:
          'Rewrite the user\'s message to be clearer.\nRespond ONLY with valid JSON: { "rewrittenMessage": "<rewritten>" }',
      },
    };
  }
  if (kind === "extract") {
    return {
      id: generateAttachmentId(),
      mode: "after",
      label: "Extract",
      inlinePrimitive: {
        kind: "state_extractor",
        instructions:
          'Extract any structured fields from the user\'s message.\nRespond ONLY with valid JSON describing the fields to update.',
      },
    };
  }
  return {
    id: generateAttachmentId(),
    mode: "after",
    label: "Understand",
    inlinePrimitive: {
      kind: "researcher",
      instructions: "Read the user's message and summarise the intent.",
    },
  };
}

