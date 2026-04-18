"use client";

import { useRef } from "react";
import {
  ReactFlow,
  Controls,
  Background,
  MiniMap,
  BackgroundVariant,
  type NodeTypes,
} from "@xyflow/react";
import "@xyflow/react/dist/style.css";

import {
  InputFlowNode,
  OutputFlowNode,
  AgentFlowNode,
  ConditionFlowNode,
  ForkFlowNode,
  JoinFlowNode,
  ResearcherFlowNode,
  ActorFlowNode,
  RewriterFlowNode,
  ResponderFlowNode,
  EvalFlowNode,
} from "./flow-nodes";
import { useFlowBuilder, DEFAULT_EDGE_OPTIONS } from "./workspace/FlowBuilderContext";

const NODE_TYPES: NodeTypes = {
  input: InputFlowNode,
  output: OutputFlowNode,
  agent: AgentFlowNode,
  condition: ConditionFlowNode,
  fork: ForkFlowNode,
  join: JoinFlowNode,
  researcher: ResearcherFlowNode,
  actor: ActorFlowNode,
  rewriter: RewriterFlowNode,
  responder: ResponderFlowNode,
  eval: EvalFlowNode,
};

export function FlowCanvasTab() {
  const reactFlowWrapper = useRef<HTMLDivElement>(null);
  const {
    nodes,
    edges,
    onNodesChange,
    onEdgesChange,
    onConnect,
    onNodeClick,
    onPaneClick,
  } = useFlowBuilder();

  return (
    <div ref={reactFlowWrapper} className="h-full w-full">
      <ReactFlow
        nodes={nodes}
        edges={edges}
        onNodesChange={onNodesChange}
        onEdgesChange={onEdgesChange}
        onConnect={onConnect}
        onNodeClick={onNodeClick}
        onPaneClick={onPaneClick}
        nodeTypes={NODE_TYPES}
        defaultEdgeOptions={DEFAULT_EDGE_OPTIONS}
        fitView
        fitViewOptions={{ padding: 0.3 }}
        deleteKeyCode={["Backspace", "Delete"]}
      >
        <Controls position="bottom-left" />
        <MiniMap
          position="bottom-right"
          className="!bg-background border border-border rounded-md"
          maskColor="rgba(0,0,0,0.05)"
          nodeColor={(node) => {
            const typeColorMap: Record<string, string> = {
              input: "hsl(221 83% 53%)",
              output: "hsl(221 83% 53%)",
              agent: "hsl(263 70% 50%)",
              condition: "hsl(43 96% 56%)",
              fork: "hsl(25 95% 53%)",
              join: "hsl(25 95% 53%)",
              researcher: "hsl(142 71% 45%)",
              actor: "hsl(48 96% 53%)",
              rewriter: "hsl(173 58% 39%)",
              responder: "hsl(199 89% 48%)",
              eval: "hsl(346 77% 49%)",
              state_extractor: "hsl(239 68% 61%)",
            };
            return typeColorMap[node.type ?? "agent"] ?? "hsl(var(--muted-foreground))";
          }}
        />
        <Background variant={BackgroundVariant.Dots} gap={20} size={1} />
      </ReactFlow>
    </div>
  );
}
