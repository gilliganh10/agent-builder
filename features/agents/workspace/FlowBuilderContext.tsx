"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useRef,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  addEdge,
  useNodesState,
  useEdgesState,
  type Connection,
  type Node,
  type NodeChange,
  type EdgeChange,
  type Edge,
  MarkerType,
} from "@xyflow/react";
import { useTenant } from "@/lib/tenant-context";
import {
  resolveStateConfig,
  stateConfigToOrchestrator,
} from "@/lib/agents/shared/state-config-utils";
import { useAgentWorkspace } from "./AgentWorkspaceContext";
import { useBuilderDocument } from "./BuilderDocumentContext";
import type {
  AgentDefinition,
  FlowDefinition,
  FlowNodeData,
  FlowNodeType,
  EnvVarDefinition,
  AgentStateConfig,
  VarDefinition,
} from "@/db/agents/schema";
import type { ChatSendResult, ChatActionResult } from "@/components/chat/ChatUI";
import { parseFlowRunOutput, eventsToMessages, extractRewrites } from "@/lib/agents/flow/output";

type FlowNode = Node<FlowNodeData>;

function generateNodeId(type: string): string {
  return `${type}-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

function buildInitialNodes(flow?: FlowDefinition | null): FlowNode[] {
  if (flow?.nodes?.length) {
    return flow.nodes.map((n) => ({
      id: n.id,
      type: n.type,
      position: n.position,
      data: n.data,
    }));
  }
  return [
    { id: generateNodeId("input"), type: "input", position: { x: 50, y: 200 }, data: { label: "Input" } },
    { id: generateNodeId("output"), type: "output", position: { x: 800, y: 200 }, data: { label: "Output" } },
  ];
}

function buildInitialEdges(flow?: FlowDefinition | null) {
  if (flow?.edges?.length) {
    return flow.edges.map((e) => ({
      id: e.id,
      source: e.source,
      target: e.target,
      sourceHandle: e.sourceHandle,
      targetHandle: e.targetHandle,
      label: e.label,
      data: e.data,
    }));
  }
  return [];
}

export const DEFAULT_EDGE_OPTIONS = {
  animated: true,
  markerEnd: { type: MarkerType.ArrowClosed, width: 16, height: 16 },
  style: { strokeWidth: 2 },
};

export interface FlowBuilderContextValue {
  nodes: FlowNode[];
  edges: Edge[];
  selectedNodeId: string | null;
  selectedNode: FlowNode | null;
  validationErrors: string[];
  validationSuccess: boolean;
  saving: boolean;
  envVars: EnvVarDefinition[];
  stateConfig: AgentStateConfig;
  orchestratorConfig: ReturnType<typeof stateConfigToOrchestrator>;
  orchestratorVars: VarDefinition[];
  envOverrides: Record<string, string>;
  agentSlugs: string[];
  primitiveSlugs: string[];
  isV2: boolean;

  // ReactFlow handlers
  onNodesChange: (changes: NodeChange[]) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  onEdgesChange: (changes: EdgeChange<any>[]) => void;
  onConnect: (connection: Connection) => void;
  onNodeClick: (event: React.MouseEvent, node: Node) => void;
  onPaneClick: () => void;

  // Mutation
  setSelectedNodeId: (id: string | null) => void;
  updateNodeData: (nodeId: string, patch: Partial<FlowNodeData>) => void;
  deleteNode: (nodeId: string) => void;
  addNode: (type: FlowNodeType) => void;
  setEnvVars: (vars: EnvVarDefinition[]) => void;
  setStateConfig: (config: AgentStateConfig) => void;
  setEnvOverrides: (overrides: Record<string, string>) => void;

  // Chat test
  handleChatSend: (message: string, sessionId: string | undefined) => Promise<ChatSendResult>;
  handleChatAction: (action: import("@/db/agents/schema").AgentMessageAction, sessionId: string | undefined) => Promise<ChatActionResult>;
}

const FlowBuilderContext = createContext<FlowBuilderContextValue | null>(null);

export function useFlowBuilder(): FlowBuilderContextValue {
  const ctx = useContext(FlowBuilderContext);
  if (!ctx) {
    throw new Error("useFlowBuilder must be used within FlowBuilderProvider");
  }
  return ctx;
}

interface FlowBuilderProviderProps {
  agent: AgentDefinition;
  allAgentSlugs: string[];
  allPrimitiveSlugs: string[];
  children: ReactNode;
}

export function FlowBuilderProvider({
  agent,
  allAgentSlugs,
  allPrimitiveSlugs,
  children,
}: FlowBuilderProviderProps) {
  const router = useRouter();
  const { tenantSlug } = useTenant();
  const {
    setSaving,
    setDirty,
    setValidationResult,
    registerSaveHandler,
    registerValidateHandler,
    setRightPanelOpen,
    setRightPanelMode,
  } = useAgentWorkspace();

  const {
    blocks: builderBlocks,
    envVars,
    stateConfig,
    envOverrides,
    setEnvVars,
    setStateConfig,
    setEnvOverrides,
  } = useBuilderDocument();

  const [nodes, setNodes, onNodesChange] = useNodesState(
    buildInitialNodes(agent.flowDefinition)
  );
  const [edges, setEdges, onEdgesChange] = useEdgesState(
    buildInitialEdges(agent.flowDefinition)
  );
  const [selectedNodeId, setSelectedNodeIdInternal] = useState<string | null>(null);

  const setSelectedNodeId = useCallback(
    (id: string | null) => {
      setSelectedNodeIdInternal(id);
      if (id === null) {
        setRightPanelOpen(false);
      } else {
        setRightPanelMode("inspect");
        setRightPanelOpen(true);
      }
    },
    [setRightPanelOpen, setRightPanelMode]
  );
  const existingLocks = useMemo(
    () => agent.flowDefinition?.orchestrator?.locks ?? [],
    [agent.flowDefinition]
  );

  const isV2 = agent.flowDefinition?.version === 2;

  const orchestratorConfig = useMemo(
    () => stateConfigToOrchestrator(stateConfig, existingLocks),
    [stateConfig, existingLocks]
  );

  const orchestratorVars = useMemo(
    () => orchestratorConfig.vars ?? [],
    [orchestratorConfig]
  );

  const agentSlugs = useMemo(
    () => allAgentSlugs.filter((s) => s !== agent.slug),
    [allAgentSlugs, agent.slug]
  );

  const selectedNode = useMemo(
    () => nodes.find((n) => n.id === selectedNodeId) ?? null,
    [nodes, selectedNodeId]
  );

  const onConnect = useCallback(
    (connection: Connection) => {
      setEdges((eds) => addEdge({ ...connection, id: `e-${Date.now()}` }, eds));
      setDirty(true);
    },
    [setEdges, setDirty]
  );

  const onNodeClick = useCallback(
    (_event: React.MouseEvent, node: Node) => {
      setSelectedNodeId(node.id);
    },
    [setSelectedNodeId]
  );

  const onPaneClick = useCallback(() => {
    setSelectedNodeId(null);
  }, [setSelectedNodeId]);

  const addNode = useCallback(
    (type: FlowNodeType) => {
      const id = generateNodeId(type);
      const newNode: FlowNode = {
        id,
        type,
        position: { x: 300 + Math.random() * 200, y: 100 + Math.random() * 300 },
        data: { label: type.charAt(0).toUpperCase() + type.slice(1) },
      };
      setNodes((nds) => [...nds, newNode]);
      setSelectedNodeId(id);
      setDirty(true);
    },
    [setNodes, setDirty, setSelectedNodeId]
  );

  const updateNodeData = useCallback(
    (nodeId: string, patch: Partial<FlowNodeData>) => {
      setNodes((nds) =>
        nds.map((n) => (n.id === nodeId ? { ...n, data: { ...n.data, ...patch } } : n))
      );
      setDirty(true);
    },
    [setNodes, setDirty]
  );

  const deleteNode = useCallback(
    (nodeId: string) => {
      setNodes((nds) => nds.filter((n) => n.id !== nodeId));
      setEdges((eds) => eds.filter((e) => e.source !== nodeId && e.target !== nodeId));
      setSelectedNodeId(null);
      setDirty(true);
    },
    [setNodes, setEdges, setDirty, setSelectedNodeId]
  );

  // Build and save
  const nodesRef = useRef(nodes);
  const edgesRef = useRef(edges);
  const envVarsRef = useRef(envVars);
  const stateConfigRef = useRef(stateConfig);
  const orchestratorConfigRef = useRef(orchestratorConfig);
  const isV2Ref = useRef(isV2);
  const builderBlocksRef = useRef(builderBlocks);

  // Keep refs up to date
  useLayoutEffect(() => { nodesRef.current = nodes; });
  useLayoutEffect(() => { edgesRef.current = edges; });
  useLayoutEffect(() => { envVarsRef.current = envVars; });
  useLayoutEffect(() => { stateConfigRef.current = stateConfig; });
  useLayoutEffect(() => { orchestratorConfigRef.current = orchestratorConfig; });
  useLayoutEffect(() => { isV2Ref.current = isV2; });
  useLayoutEffect(() => { builderBlocksRef.current = builderBlocks; });

  function buildFlowDefinition(): FlowDefinition {
    const currentNodes = nodesRef.current;
    const currentEdges = edgesRef.current;
    const currentEnvVars = envVarsRef.current;
    const currentStateConfig = stateConfigRef.current;
    const currentOrchestratorConfig = orchestratorConfigRef.current;
    const currentIsV2 = isV2Ref.current;
    const currentBuilderBlocks = builderBlocksRef.current;

    const hasPrimitiveNodes = currentNodes.some((n) =>
      ["researcher", "actor", "rewriter", "responder", "eval", "state_extractor"].includes(n.type ?? "")
    );
    const flowVersion = currentIsV2 || hasPrimitiveNodes ? 2 : undefined;
    const hasChatBuilder = currentBuilderBlocks.length > 0;

    return {
      ...(flowVersion ? { version: flowVersion as 1 | 2 } : {}),
      ...(flowVersion === 2 ? { orchestrator: currentOrchestratorConfig, stateConfig: currentStateConfig } : {}),
      ...(hasChatBuilder ? { chatBuilder: { blocks: currentBuilderBlocks } } : {}),
      nodes: currentNodes.map((n) => ({
        id: n.id,
        type: n.type as FlowNodeType,
        position: n.position,
        data: n.data as FlowNodeData,
      })),
      edges: currentEdges.map((e) => ({
        id: e.id,
        source: e.source,
        target: e.target,
        sourceHandle: e.sourceHandle ?? undefined,
        targetHandle: e.targetHandle ?? undefined,
        label: typeof e.label === "string" ? e.label : undefined,
        data: e.data as { branch?: string } | undefined,
      })),
      ...(currentEnvVars.length > 0 ? { envVars: currentEnvVars } : {}),
    };
  }

  // Register save handler (runs on every render to keep closure fresh)
  useLayoutEffect(() => {
    registerSaveHandler(async () => {
      setSaving(true);
      setValidationResult([], [], false);

      const flow = buildFlowDefinition();
      try {
        const res = await fetch(`/api/agents/${agent.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ flowDefinition: flow, changelog: "Updated flow definition" }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Save failed (${res.status})`);
        }
        setValidationResult([], [], true);
        setDirty(false);
        router.refresh();
      } catch (err) {
        setValidationResult([err instanceof Error ? err.message : "Save failed"], [], false);
      } finally {
        setSaving(false);
      }
    });
  });

  // Register validate handler (client-side structural checks)
  useLayoutEffect(() => {
    registerValidateHandler(() => {
      const flow = buildFlowDefinition();
      const errors: string[] = [];

      const hasInput = flow.nodes.some((n) => n.type === "input");
      const hasOutput = flow.nodes.some((n) => n.type === "output");
      if (!hasInput) errors.push("Flow is missing an Input node.");
      if (!hasOutput) errors.push("Flow is missing an Output node.");
      if (flow.nodes.length < 2) errors.push("Flow must have at least two nodes.");

      const nodeIds = new Set(flow.nodes.map((n) => n.id));
      for (const edge of flow.edges) {
        if (!nodeIds.has(edge.source)) errors.push(`Edge references unknown source node: ${edge.source}`);
        if (!nodeIds.has(edge.target)) errors.push(`Edge references unknown target node: ${edge.target}`);
      }

      setValidationResult(errors, [], errors.length === 0);
    });
  });

  const handleChatSend = useCallback(
    async (message: string, sessionId: string | undefined): Promise<ChatSendResult> => {
      const overrides = envOverrides;
      const res = await fetch(`/api/agents/run`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          agentSlug: agent.slug,
          input: message,
          sessionId,
          envOverrides: Object.keys(overrides).length > 0 ? overrides : undefined,
        }),
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
    [agent.slug, envOverrides, tenantSlug]
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

  const value = useMemo<FlowBuilderContextValue>(
    () => ({
      nodes,
      edges,
      selectedNodeId,
      selectedNode,
      validationErrors: [],
      validationSuccess: false,
      saving: false,
      envVars,
      stateConfig,
      orchestratorConfig,
      orchestratorVars,
      envOverrides,
      agentSlugs,
      primitiveSlugs: allPrimitiveSlugs,
      isV2,
      onNodesChange,
      onEdgesChange,
      onConnect,
      onNodeClick,
      onPaneClick,
      setSelectedNodeId,
      updateNodeData,
      deleteNode,
      addNode,
      setEnvVars,
      setStateConfig,
      setEnvOverrides,
      handleChatSend,
      handleChatAction,
    }),
    [
      nodes, edges, selectedNodeId, selectedNode,
      envVars, stateConfig, orchestratorConfig, orchestratorVars, envOverrides,
      agentSlugs, allPrimitiveSlugs, isV2,
      onNodesChange, onEdgesChange, onConnect, onNodeClick, onPaneClick,
      setSelectedNodeId, updateNodeData, deleteNode, addNode,
      setEnvVars, setStateConfig, setEnvOverrides,
      handleChatSend, handleChatAction,
    ]
  );

  return (
    <FlowBuilderContext.Provider value={value}>
      {children}
    </FlowBuilderContext.Provider>
  );
}
