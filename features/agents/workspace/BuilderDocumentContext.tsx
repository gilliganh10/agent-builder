"use client";

import {
  createContext,
  useCallback,
  useContext,
  useEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { resolveStateConfig } from "@/lib/agents/shared/state-config-utils";
import { decompileFlow } from "@/lib/agents/chat-builder/decompiler";
import {
  appendChildToBranch,
  appendChildToParallelLane,
  deleteBlockDeep,
  getCanonicalUserBlockId,
  updateBlockDeep,
  type BranchKey,
  type ParallelLane,
} from "@/lib/agents/chat-builder/block-tree";
import { useAgentWorkspace } from "./AgentWorkspaceContext";
import type {
  AgentDefinition,
  MessageBlock,
  MessageBlockType,
  AgentStateConfig,
  EnvVarDefinition,
} from "@/db/agents/schema";

function generateBlockId(): string {
  return `block-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

interface InitBlocksResult {
  blocks: MessageBlock[];
  fromDecompiledGraph: boolean;
}

function buildMessageBlock(
  agentName: string,
  type: MessageBlockType,
  position: number
): MessageBlock {
  const labelMap: Record<MessageBlockType, string> = {
    user: "User Message",
    assistant: "Assistant Reply",
    system: "System Instruction",
    context: "Context Retrieval",
    extract: "Extract / Judge",
    branch: "Condition Branch",
    parallel: "Parallel",
    goal: "Goal Checkpoint",
  };
  return {
    id: generateBlockId(),
    type,
    label: labelMap[type] ?? type,
    position,
    settings:
      type === "assistant"
        ? { displayName: "Assistant", displayColor: "#222E50", displaySide: "left" }
        : {},
    attachments: [],
    ...(type === "extract"
      ? {
          extractConfig: {
            instructions: "",
            outputSchema: [{ key: "result", type: "boolean" as const, description: "" }],
          },
        }
      : {}),
    ...(type === "branch"
      ? {
          branchConfig: {
            condition: { field: "result", operator: "eq" as const, value: true },
            trueBranch: [],
            falseBranch: [],
          },
        }
      : {}),
    ...(type === "parallel"
      ? {
          parallelConfig: {
            laneA: [],
            laneB: [],
          },
        }
      : {}),
    ...(type === "goal"
      ? {
          goalConfig: {
            goalId: `goal-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`,
            name: "",
            conditions: [],
            conditionLogic: "all" as const,
            onComplete: { type: "close" as const },
          },
        }
      : {}),
  };
}

export function initBlocksFromAgent(agent: AgentDefinition): InitBlocksResult {
  if (agent.flowDefinition?.chatBuilder?.blocks?.length) {
    return {
      blocks: agent.flowDefinition.chatBuilder.blocks,
      fromDecompiledGraph: false,
    };
  }
  if (agent.flowDefinition) {
    const decompiled = decompileFlow(agent.flowDefinition);
    if (decompiled) {
      return { blocks: decompiled.blocks, fromDecompiledGraph: true };
    }
  }
  return {
    blocks: [
      {
        id: generateBlockId(),
        type: "user",
        label: "User Message",
        position: 0,
        settings: {},
        attachments: [],
      },
      {
        id: generateBlockId(),
        type: "assistant",
        label: "Assistant Reply",
        position: 1,
        settings: {
          displayName: agent.name,
          displayColor: "#222E50",
          displaySide: "left",
        },
        attachments: [],
      },
    ],
    fromDecompiledGraph: false,
  };
}

export interface BuilderDocumentContextValue {
  agent: AgentDefinition;
  blocks: MessageBlock[];
  fromDecompiledGraph: boolean;
  stateConfig: AgentStateConfig;
  envVars: EnvVarDefinition[];
  envOverrides: Record<string, string>;

  setBlocks: React.Dispatch<React.SetStateAction<MessageBlock[]>>;
  updateBlock: (blockId: string, patch: Partial<MessageBlock>) => void;
  deleteBlock: (blockId: string) => void;
  /** Returns the new block id. */
  insertBlock: (type: MessageBlockType, afterPosition: number) => string;
  appendBlock: (type: MessageBlockType) => string;
  reorderBlock: (blockId: string, direction: "up" | "down") => void;
  addBranchChild: (
    parentBlockId: string,
    branch: BranchKey,
    type: MessageBlockType
  ) => string | null;
  addParallelLaneChild: (
    parentBlockId: string,
    lane: ParallelLane,
    type: MessageBlockType
  ) => string | null;
  setStateConfig: (config: AgentStateConfig) => void;
  setEnvVars: (vars: EnvVarDefinition[]) => void;
  setEnvOverrides: (overrides: Record<string, string>) => void;
}

const BuilderDocumentContext = createContext<BuilderDocumentContextValue | null>(null);

export function useBuilderDocument(): BuilderDocumentContextValue {
  const ctx = useContext(BuilderDocumentContext);
  if (!ctx) {
    throw new Error("useBuilderDocument must be used within BuilderDocumentProvider");
  }
  return ctx;
}

interface BuilderDocumentProviderProps {
  agent: AgentDefinition;
  children: ReactNode;
}

export function BuilderDocumentProvider({ agent, children }: BuilderDocumentProviderProps) {
  const { dirty, setDirty } = useAgentWorkspace();

  const initial = useMemo(() => initBlocksFromAgent(agent), [agent]);

  const [blocks, setBlocks] = useState<MessageBlock[]>(() => initial.blocks);
  const [fromDecompiledGraph, setFromDecompiledGraph] = useState(
    () => initial.fromDecompiledGraph
  );
  const [stateConfig, setStateConfigInternal] = useState<AgentStateConfig>(() =>
    resolveStateConfig(agent.flowDefinition ?? undefined)
  );
  const [envVars, setEnvVarsInternal] = useState<EnvVarDefinition[]>(
    () => agent.flowDefinition?.envVars ?? []
  );
  const [envOverrides, setEnvOverrides] = useState<Record<string, string>>(() => {
    const init: Record<string, string> = {};
    for (const v of agent.flowDefinition?.envVars ?? []) {
      if (v.default != null) init[v.key] = String(v.default);
    }
    return init;
  });

  useEffect(() => {
    if (dirty) return;
    const next = initBlocksFromAgent(agent);
    setBlocks(next.blocks);
    setFromDecompiledGraph(next.fromDecompiledGraph);
    setStateConfigInternal(resolveStateConfig(agent.flowDefinition ?? undefined));
    setEnvVarsInternal(agent.flowDefinition?.envVars ?? []);
    const eo: Record<string, string> = {};
    for (const v of agent.flowDefinition?.envVars ?? []) {
      if (v.default != null) eo[v.key] = String(v.default);
    }
    setEnvOverrides(eo);
  }, [agent.updatedAt, dirty, agent]);

  const insertBlock = useCallback(
    (type: MessageBlockType, afterPosition: number) => {
      const newPos = afterPosition + 0.5;
      const newBlock = buildMessageBlock(agent.name, type, newPos);
      const id = newBlock.id;
      setBlocks((prev) => {
        const allBlocks = [...prev, newBlock].sort((a, b) => a.position - b.position);
        allBlocks.forEach((b, i) => {
          b.position = i;
        });
        return allBlocks;
      });
      setDirty(true);
      return id;
    },
    [agent.name, setDirty]
  );

  const appendBlock = useCallback(
    (type: MessageBlockType) => {
      let newId = "";
      setBlocks((prev) => {
        const maxPos = prev.length > 0 ? Math.max(...prev.map((b) => b.position)) : -1;
        const newPos = maxPos + 0.5;
        const newBlock = buildMessageBlock(agent.name, type, newPos);
        newId = newBlock.id;
        const allBlocks = [...prev, newBlock].sort((a, b) => a.position - b.position);
        allBlocks.forEach((b, i) => {
          b.position = i;
        });
        return allBlocks;
      });
      setDirty(true);
      return newId;
    },
    [agent.name, setDirty]
  );

  const updateBlock = useCallback(
    (blockId: string, patch: Partial<MessageBlock>) => {
      setBlocks((prev) => {
        if (prev.some((b) => b.id === blockId)) {
          return prev.map((b) => (b.id === blockId ? { ...b, ...patch } : b));
        }
        return updateBlockDeep(prev, blockId, patch);
      });
      setDirty(true);
    },
    [setDirty]
  );

  const deleteBlock = useCallback(
    (blockId: string) => {
      setBlocks((prev) => {
        const uid = getCanonicalUserBlockId(prev);
        if (blockId === uid) return prev;
        const next = deleteBlockDeep(prev, blockId);
        const sorted = [...next].sort((a, b) => a.position - b.position);
        sorted.forEach((b, i) => {
          b.position = i;
        });
        return sorted;
      });
      setDirty(true);
    },
    [setDirty]
  );

  const reorderBlock = useCallback(
    (blockId: string, direction: "up" | "down") => {
      setBlocks((prev) => {
        const sorted = [...prev].sort((a, b) => a.position - b.position);
        const idx = sorted.findIndex((b) => b.id === blockId);
        if (idx < 0) return prev;
        const swapIdx = direction === "up" ? idx - 1 : idx + 1;
        if (swapIdx < 0 || swapIdx >= sorted.length) return prev;
        const temp = sorted[idx].position;
        sorted[idx].position = sorted[swapIdx].position;
        sorted[swapIdx].position = temp;
        return [...sorted];
      });
      setDirty(true);
    },
    [setDirty]
  );

  const addBranchChild = useCallback(
    (parentBlockId: string, branch: BranchKey, type: MessageBlockType) => {
      if (type === "user") return null;
      const child = buildMessageBlock(agent.name, type, 0);
      setBlocks((prev) => appendChildToBranch(prev, parentBlockId, branch, child));
      setDirty(true);
      return child.id;
    },
    [agent.name, setDirty]
  );

  const addParallelLaneChild = useCallback(
    (parentBlockId: string, lane: ParallelLane, type: MessageBlockType) => {
      if (type === "user") return null;
      const child = buildMessageBlock(agent.name, type, 0);
      setBlocks((prev) => appendChildToParallelLane(prev, parentBlockId, lane, child));
      setDirty(true);
      return child.id;
    },
    [agent.name, setDirty]
  );

  const setStateConfig = useCallback(
    (config: AgentStateConfig) => {
      setStateConfigInternal(config);
      setDirty(true);
    },
    [setDirty]
  );

  const setEnvVars = useCallback(
    (vars: EnvVarDefinition[]) => {
      setEnvVarsInternal(vars);
      setDirty(true);
    },
    [setDirty]
  );

  const value = useMemo<BuilderDocumentContextValue>(
    () => ({
      agent,
      blocks,
      fromDecompiledGraph,
      stateConfig,
      envVars,
      envOverrides,
      setBlocks,
      updateBlock,
      deleteBlock,
      insertBlock,
      appendBlock,
      reorderBlock,
      addBranchChild,
      addParallelLaneChild,
      setStateConfig,
      setEnvVars,
      setEnvOverrides,
    }),
    [
      agent,
      blocks,
      fromDecompiledGraph,
      stateConfig,
      envVars,
      envOverrides,
      updateBlock,
      deleteBlock,
      insertBlock,
      appendBlock,
      reorderBlock,
      addBranchChild,
      addParallelLaneChild,
      setStateConfig,
      setEnvVars,
    ]
  );

  return (
    <BuilderDocumentContext.Provider value={value}>{children}</BuilderDocumentContext.Provider>
  );
}
