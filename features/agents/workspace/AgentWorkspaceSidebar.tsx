"use client";

import { useMemo } from "react";
import {
  Bot,
  GitBranch,
  GitFork,
  GitMerge,
  Search,
  Zap,
  PenLine,
  MessageSquare,
  ClipboardCheck,
  Database,
  ArrowRight,
  ArrowLeft,
  LayoutList,
  Blocks,
  Plus,
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useAgentWorkspace } from "./AgentWorkspaceContext";
import { useFlowBuilder } from "./FlowBuilderContext";
import { useChatBuilder } from "./ChatBuilderContext";
import type { FlowNodeType, MessageBlockType } from "@/db/agents/schema";

// ── Flow outline ──────────────────────────────────────────────────────────────

const NODE_TYPE_META: Record<string, { icon: React.ReactNode; color: string }> = {
  input: { icon: <ArrowRight className="h-3.5 w-3.5" />, color: "text-blue-500" },
  output: { icon: <ArrowLeft className="h-3.5 w-3.5" />, color: "text-blue-500" },
  agent: { icon: <Bot className="h-3.5 w-3.5" />, color: "text-violet-500" },
  condition: { icon: <GitBranch className="h-3.5 w-3.5" />, color: "text-amber-500" },
  fork: { icon: <GitFork className="h-3.5 w-3.5" />, color: "text-orange-500" },
  join: { icon: <GitMerge className="h-3.5 w-3.5" />, color: "text-orange-500" },
  researcher: { icon: <Search className="h-3.5 w-3.5" />, color: "text-emerald-500" },
  actor: { icon: <Zap className="h-3.5 w-3.5" />, color: "text-yellow-600" },
  rewriter: { icon: <PenLine className="h-3.5 w-3.5" />, color: "text-teal-500" },
  responder: { icon: <MessageSquare className="h-3.5 w-3.5" />, color: "text-sky-500" },
  eval: { icon: <ClipboardCheck className="h-3.5 w-3.5" />, color: "text-rose-500" },
  state_extractor: { icon: <Database className="h-3.5 w-3.5" />, color: "text-indigo-500" },
};

const V1_PALETTE: { type: FlowNodeType; label: string }[] = [
  { type: "agent", label: "Agent" },
  { type: "condition", label: "Condition" },
  { type: "fork", label: "Fork" },
  { type: "join", label: "Join" },
];

const V2_PALETTE: { type: FlowNodeType; label: string }[] = [
  { type: "researcher", label: "Researcher" },
  { type: "actor", label: "Actor" },
  { type: "rewriter", label: "Rewriter" },
  { type: "responder", label: "Responder" },
  { type: "eval", label: "Eval" },
  { type: "state_extractor", label: "State Extractor" },
];

const BLOCK_TYPE_META: Record<
  MessageBlockType,
  { icon: React.ReactNode; color: string }
> = {
  user: { icon: <MessageSquare className="h-3.5 w-3.5" />, color: "text-blue-500" },
  assistant: { icon: <Bot className="h-3.5 w-3.5" />, color: "text-violet-500" },
  system: { icon: <Database className="h-3.5 w-3.5" />, color: "text-slate-500" },
  context: { icon: <Search className="h-3.5 w-3.5" />, color: "text-emerald-500" },
  extract: { icon: <ClipboardCheck className="h-3.5 w-3.5" />, color: "text-rose-500" },
  branch: { icon: <GitBranch className="h-3.5 w-3.5" />, color: "text-amber-500" },
  parallel: { icon: <GitFork className="h-3.5 w-3.5" />, color: "text-sky-600" },
  goal: { icon: <Zap className="h-3.5 w-3.5" />, color: "text-yellow-600" },
};

// ── Flow sidebar ──────────────────────────────────────────────────────────────

function FlowSidebar() {
  const { nodes, selectedNodeId, setSelectedNodeId, addNode } = useFlowBuilder();

  const sortedNodes = useMemo(() => {
    const inputNode = nodes.find((n) => n.type === "input");
    const outputNode = nodes.find((n) => n.type === "output");
    const middle = nodes.filter((n) => n.type !== "input" && n.type !== "output");
    return [
      ...(inputNode ? [inputNode] : []),
      ...middle,
      ...(outputNode ? [outputNode] : []),
    ];
  }, [nodes]);

  return (
    <div className="flex h-full flex-col">
      <SidebarSection label="Nodes">
        <ScrollArea className="flex-1">
          <div className="space-y-0.5 py-1">
            {sortedNodes.map((node) => {
              const type = node.type ?? "agent";
              const meta = NODE_TYPE_META[type] ?? NODE_TYPE_META["agent"];
              const isSelected = selectedNodeId === node.id;
              return (
                <button
                  key={node.id}
                  onClick={() => setSelectedNodeId(node.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-primary/10 text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className={cn("shrink-0", meta.color)}>{meta.icon}</span>
                  <span className="truncate">{node.data.label ?? type}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </SidebarSection>

      <div className="border-t border-border">
        <SidebarSection label="Add node">
          <div className="space-y-1 py-1">
            <p className="px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Standard
            </p>
            {V1_PALETTE.map((item) => (
              <AddNodeButton
                key={item.type}
                type={item.type}
                label={item.label}
                onClick={() => addNode(item.type)}
              />
            ))}
            <p className="mt-2 px-2 text-[10px] font-medium uppercase tracking-wider text-muted-foreground">
              Primitives
            </p>
            {V2_PALETTE.map((item) => (
              <AddNodeButton
                key={item.type}
                type={item.type}
                label={item.label}
                onClick={() => addNode(item.type)}
              />
            ))}
          </div>
        </SidebarSection>
      </div>
    </div>
  );
}

function AddNodeButton({
  type,
  label,
  onClick,
}: {
  type: FlowNodeType;
  label: string;
  onClick: () => void;
}) {
  const meta = NODE_TYPE_META[type] ?? NODE_TYPE_META["agent"];
  return (
    <button
      onClick={onClick}
      className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
    >
      <Plus className="h-3 w-3 shrink-0 text-muted-foreground/60" />
      <span className={cn("shrink-0", meta.color)}>{meta.icon}</span>
      <span>{label}</span>
    </button>
  );
}

// ── Chat sidebar ──────────────────────────────────────────────────────────────

const BLOCK_PALETTE: { type: MessageBlockType; label: string }[] = [
  { type: "user", label: "User Message" },
  { type: "assistant", label: "Assistant Reply" },
  { type: "system", label: "System Instruction" },
  { type: "context", label: "Context Retrieval" },
  { type: "extract", label: "Extract / Judge" },
  { type: "branch", label: "Condition Branch" },
  { type: "goal", label: "Goal Checkpoint" },
];

function ChatSidebar() {
  const { blocks, selectedBlockId, setSelectedBlockId, appendBlock } =
    useChatBuilder();

  return (
    <div className="flex h-full flex-col">
      <SidebarSection label="Blocks">
        <ScrollArea className="flex-1">
          <div className="space-y-0.5 py-1">
            {blocks.map((block, i) => {
              const meta = BLOCK_TYPE_META[block.type] ?? BLOCK_TYPE_META["assistant"];
              const isSelected = selectedBlockId === block.id;
              return (
                <button
                  key={block.id}
                  onClick={() => setSelectedBlockId(block.id)}
                  className={cn(
                    "flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-left text-xs transition-colors",
                    isSelected
                      ? "bg-primary/10 text-foreground font-medium"
                      : "text-muted-foreground hover:bg-muted hover:text-foreground"
                  )}
                >
                  <span className="shrink-0 text-muted-foreground/50 text-[10px] font-mono w-4">
                    {i + 1}
                  </span>
                  <span className={cn("shrink-0", meta.color)}>{meta.icon}</span>
                  <span className="truncate">{block.label}</span>
                </button>
              );
            })}
          </div>
        </ScrollArea>
      </SidebarSection>

      <div className="border-t border-border">
        <SidebarSection label="Add block">
          <div className="space-y-0.5 py-1">
            {BLOCK_PALETTE.map((item) => {
              const meta = BLOCK_TYPE_META[item.type];
              return (
                <button
                  key={item.type}
                  onClick={() => appendBlock(item.type)}
                  className="flex w-full items-center gap-2 rounded-md px-2 py-1.5 text-xs text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
                >
                  <Plus className="h-3 w-3 shrink-0 text-muted-foreground/60" />
                  <span className={cn("shrink-0", meta.color)}>{meta.icon}</span>
                  <span>{item.label}</span>
                </button>
              );
            })}
          </div>
        </SidebarSection>
      </div>
    </div>
  );
}

// ── Generic sidebar section ───────────────────────────────────────────────────

function SidebarSection({
  label,
  children,
}: {
  label: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col overflow-hidden">
      <p className="px-3 pt-3 pb-1 text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60">
        {label}
      </p>
      <div className="px-1">{children}</div>
    </div>
  );
}

// ── Overview/generic sidebar ──────────────────────────────────────────────────

function GenericSidebar() {
  const { agent, switchTab } = useAgentWorkspace();

  const quickLinks = [
    { label: "Builder", tab: "builder" as const },
    { label: "Runs", tab: "runs" as const },
    { label: "Dataset", tab: "dataset" as const },
    { label: "Triggers", tab: "triggers" as const },
    { label: "Versions", tab: "versions" as const },
  ];

  return (
    <div className="p-3 space-y-4">
      <div>
        <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-2">
          Navigate
        </p>
        <div className="space-y-0.5">
          {quickLinks.map((link) => (
            <button
              key={link.tab}
              onClick={() => switchTab(link.tab)}
              className="w-full text-left px-2 py-1.5 rounded-md text-xs text-muted-foreground hover:bg-muted hover:text-foreground transition-colors"
            >
              {link.label}
            </button>
          ))}
        </div>
      </div>

      {agent.description && (
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-widest text-muted-foreground/60 mb-1.5">
            About
          </p>
          <p className="text-xs text-muted-foreground leading-relaxed">{agent.description}</p>
        </div>
      )}
    </div>
  );
}

// ── Main export ───────────────────────────────────────────────────────────────

interface AgentWorkspaceSidebarProps {
  showFlowContext: boolean;
  showChatContext: boolean;
}

export function AgentWorkspaceSidebar({
  showFlowContext,
  showChatContext,
}: AgentWorkspaceSidebarProps) {
  return (
    <div className="flex h-full flex-col overflow-hidden">
      {showFlowContext && <FlowSidebar />}
      {showChatContext && <ChatSidebar />}
      {!showFlowContext && !showChatContext && <GenericSidebar />}
    </div>
  );
}
