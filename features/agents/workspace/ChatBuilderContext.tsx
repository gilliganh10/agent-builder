"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useTenant } from "@/lib/tenant-context";
import {
  extractGoalsFromBlocks,
  mergeGoalsFromHubAndBlocks,
} from "@/lib/agents/chat-builder/compiler";
import { validateChatBuilder } from "@/lib/agents/chat-builder/validation";
import { parseFlowRunOutput, eventsToMessages, extractRewrites } from "@/lib/agents/flow/output";
import {
  findBlockById,
  getCanonicalUserBlockId,
  type BranchKey,
  type ParallelLane,
} from "@/lib/agents/chat-builder/block-tree";
import { useAgentWorkspace } from "./AgentWorkspaceContext";
import { useBuilderDocument } from "./BuilderDocumentContext";
import type {
  MessageBlock,
  MessageBlockType,
  VarDefinition,
} from "@/db/agents/schema";
import type { ChatSendResult, ChatActionResult } from "@/components/chat/ChatUI";

export interface ChatBuilderContextValue {
  blocks: MessageBlock[];
  canonicalUserBlockId: string | null;
  selectedBlockId: string | null;
  selectedAttachmentId: string | null;
  selectedBlock: MessageBlock | null;
  stateConfig: import("@/db/agents/schema").AgentStateConfig;
  orchestratorVars: VarDefinition[];
  primitiveSlugs: string[];
  envVars: import("@/db/agents/schema").EnvVarDefinition[];
  envOverrides: Record<string, string>;

  setSelectedBlockId: (id: string | null) => void;
  setSelectedAttachmentId: (id: string | null) => void;
  updateBlock: (blockId: string, patch: Partial<MessageBlock>) => void;
  deleteBlock: (blockId: string) => void;
  insertBlock: (type: MessageBlockType, afterPosition: number) => void;
  appendBlock: (type: MessageBlockType) => void;
  reorderBlock: (blockId: string, direction: "up" | "down") => void;
  addBranchChild: (parentBlockId: string, branch: BranchKey, type: MessageBlockType) => void;
  addParallelLaneChild: (parentBlockId: string, lane: ParallelLane, type: MessageBlockType) => void;
  setStateConfig: (config: import("@/db/agents/schema").AgentStateConfig) => void;
  setEnvVars: (vars: import("@/db/agents/schema").EnvVarDefinition[]) => void;
  setEnvOverrides: (overrides: Record<string, string>) => void;

  handleChatSend: (message: string, sessionId: string | undefined) => Promise<ChatSendResult>;
  handleChatAction: (
    action: import("@/db/agents/schema").AgentMessageAction,
    sessionId: string | undefined
  ) => Promise<ChatActionResult>;
  fromDecompiledGraph: boolean;
}

const ChatBuilderContext = createContext<ChatBuilderContextValue | null>(null);

export function useChatBuilder(): ChatBuilderContextValue {
  const ctx = useContext(ChatBuilderContext);
  if (!ctx) {
    throw new Error("useChatBuilder must be used within ChatBuilderProvider");
  }
  return ctx;
}

interface ChatBuilderProviderProps {
  allPrimitiveSlugs: string[];
  children: ReactNode;
}

export function ChatBuilderProvider({
  allPrimitiveSlugs,
  children,
}: ChatBuilderProviderProps) {
  const { tenantSlug } = useTenant();
  const {
    agent,
    setValidationResult,
    registerSaveHandler,
    registerValidateHandler,
    setRightPanelOpen,
    setRightPanelMode,
  } = useAgentWorkspace();

  const doc = useBuilderDocument();
  const {
    blocks,
    fromDecompiledGraph,
    stateConfig,
    envVars,
    envOverrides,
    updateBlock: docUpdateBlock,
    deleteBlock: docDeleteBlock,
    insertBlock: docInsertBlock,
    appendBlock: docAppendBlock,
    reorderBlock: docReorderBlock,
    addBranchChild: docAddBranchChild,
    addParallelLaneChild: docAddParallelLaneChild,
    setStateConfig: docSetStateConfig,
    setEnvVars: docSetEnvVars,
    setEnvOverrides,
  } = doc;

  const [selectedBlockId, setSelectedBlockIdInternal] = useState<string | null>(null);
  const [selectedAttachmentId, setSelectedAttachmentId] = useState<string | null>(null);

  const setSelectedBlockId = useCallback(
    (id: string | null) => {
      setSelectedBlockIdInternal(id);
      if (id === null) {
        setRightPanelOpen(false);
      } else {
        setRightPanelMode("inspect");
        setRightPanelOpen(true);
      }
    },
    [setRightPanelOpen, setRightPanelMode]
  );

  const primitiveSlugs = useMemo(() => allPrimitiveSlugs ?? [], [allPrimitiveSlugs]);

  const canonicalUserBlockId = useMemo(
    () => getCanonicalUserBlockId(blocks),
    [blocks]
  );

  const selectedBlock = useMemo(() => {
    if (!selectedBlockId) return null;
    return findBlockById(blocks, selectedBlockId);
  }, [blocks, selectedBlockId]);

  const orchestratorVars = useMemo(
    () =>
      stateConfig.fields.map((f) => ({
        key: f.key,
        type: f.type,
        default: f.default,
        description: f.description,
      })),
    [stateConfig.fields]
  );

  const insertBlock = useCallback(
    (type: MessageBlockType, afterPosition: number) => {
      const id = docInsertBlock(type, afterPosition);
      setSelectedBlockId(id);
      setSelectedAttachmentId(null);
    },
    [docInsertBlock, setSelectedBlockId]
  );

  const appendBlock = useCallback(
    (type: MessageBlockType) => {
      const id = docAppendBlock(type);
      setSelectedBlockId(id);
      setSelectedAttachmentId(null);
    },
    [docAppendBlock, setSelectedBlockId]
  );

  const addBranchChild = useCallback(
    (parentBlockId: string, branch: BranchKey, type: MessageBlockType) => {
      const id = docAddBranchChild(parentBlockId, branch, type);
      if (id) {
        setSelectedBlockId(id);
        setSelectedAttachmentId(null);
      }
    },
    [docAddBranchChild, setSelectedBlockId]
  );

  const addParallelLaneChild = useCallback(
    (parentBlockId: string, lane: ParallelLane, type: MessageBlockType) => {
      const id = docAddParallelLaneChild(parentBlockId, lane, type);
      if (id) {
        setSelectedBlockId(id);
        setSelectedAttachmentId(null);
      }
    },
    [docAddParallelLaneChild, setSelectedBlockId]
  );

  const deleteBlock = useCallback(
    (blockId: string) => {
      docDeleteBlock(blockId);
      setSelectedBlockIdInternal((cur) => {
        if (cur === blockId) {
          setRightPanelOpen(false);
          return null;
        }
        return cur;
      });
      setSelectedAttachmentId(null);
    },
    [docDeleteBlock, setRightPanelOpen]
  );

  const updateBlock = useCallback(
    (blockId: string, patch: Partial<MessageBlock>) => {
      docUpdateBlock(blockId, patch);
    },
    [docUpdateBlock]
  );

  const setEnvVarsDirty = useCallback(
    (vars: import("@/db/agents/schema").EnvVarDefinition[]) => {
      docSetEnvVars(vars);
    },
    [docSetEnvVars]
  );
  const setStateConfigDirty = useCallback(
    (config: import("@/db/agents/schema").AgentStateConfig) => {
      docSetStateConfig(config);
    },
    [docSetStateConfig]
  );

  // Test tab is a read-only chat runner — saving happens from the Plan/Graph
  // tabs. Register a no-op so stale save handlers from a previous tab don't
  // accidentally write through the legacy chat-builder compile path.
  useLayoutEffect(() => {
    registerSaveHandler(async () => {});
  });

  useLayoutEffect(() => {
    registerValidateHandler(() => {
      const spec = { blocks };
      const mergedGoals = mergeGoalsFromHubAndBlocks(
        stateConfig.goals ?? [],
        extractGoalsFromBlocks(spec.blocks)
      );
      const result = validateChatBuilder(spec, undefined, primitiveSlugs, {
        ...stateConfig,
        goals: mergedGoals,
      });
      setValidationResult(
        result.errors.map((e) => `${e.path}: ${e.message}`),
        result.warnings.map((w) => `${w.path}: ${w.message}`),
        result.valid
      );
    });
  });

  const handleChatSend = useCallback(
    async (message: string, sessionId: string | undefined): Promise<ChatSendResult> => {
      const res = await fetch(`/api/agents/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentSlug: agent.slug, input: message, sessionId }),
      });
      const data = await res.json();
      if (!res.ok) return { messages: [], error: data.error ?? `Error ${res.status}` };
      const flowOutput = parseFlowRunOutput(data.finalOutput as string | null);
      if (flowOutput) {
        return {
          sessionId: data.sessionId as string | undefined,
          messages: eventsToMessages(flowOutput.events),
          rewrites: extractRewrites(flowOutput.events),
          error: data.error as string | undefined,
          state: flowOutput.orchestratorState?.vars,
          goals: flowOutput.orchestratorState?.goals?.map((g) => ({
            id: g.id,
            description: g.description,
            status: g.status,
          })),
          locks: flowOutput.orchestratorState?.locks,
        };
      }
      const finalOutput = data.finalOutput as string | null;
      return {
        sessionId: data.sessionId as string | undefined,
        messages: finalOutput ? [{ content: finalOutput }] : [],
        error: data.error as string | undefined,
      };
    },
    [agent.slug, tenantSlug]
  );

  const handleChatAction = useCallback(
    async (
      action: import("@/db/agents/schema").AgentMessageAction,
      sessionId: string | undefined
    ): Promise<ChatActionResult> => {
      if (!sessionId) return { error: "Session required for message actions." };
      const res = await fetch(`/api/agents/actions`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ agentSlug: agent.slug, sessionId, action }),
      });
      const data = await res.json();
      if (!res.ok) return { error: data.error ?? `Error ${res.status}` };
      return { messages: data.messages ?? [], state: data.state, goals: data.goals, locks: data.locks };
    },
    [agent.slug, tenantSlug]
  );

  const value = useMemo<ChatBuilderContextValue>(
    () => ({
      blocks,
      canonicalUserBlockId,
      selectedBlockId,
      selectedAttachmentId,
      selectedBlock,
      stateConfig,
      orchestratorVars,
      primitiveSlugs,
      envVars,
      envOverrides,
      setSelectedBlockId,
      setSelectedAttachmentId,
      updateBlock,
      deleteBlock,
      insertBlock,
      appendBlock,
      reorderBlock: docReorderBlock,
      addBranchChild,
      addParallelLaneChild,
      setStateConfig: setStateConfigDirty,
      setEnvVars: setEnvVarsDirty,
      setEnvOverrides,
      handleChatSend,
      handleChatAction,
      fromDecompiledGraph,
    }),
    [
      blocks,
      canonicalUserBlockId,
      selectedBlockId,
      selectedAttachmentId,
      selectedBlock,
      stateConfig,
      orchestratorVars,
      primitiveSlugs,
      envVars,
      envOverrides,
      setSelectedBlockId,
      updateBlock,
      deleteBlock,
      insertBlock,
      appendBlock,
      docReorderBlock,
      addBranchChild,
      addParallelLaneChild,
      setStateConfigDirty,
      setEnvVarsDirty,
      handleChatSend,
      handleChatAction,
      fromDecompiledGraph,
    ]
  );

  return (
    <ChatBuilderContext.Provider value={value}>{children}</ChatBuilderContext.Provider>
  );
}
