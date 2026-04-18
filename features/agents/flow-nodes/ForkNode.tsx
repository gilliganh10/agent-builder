"use client";

import { type NodeProps } from "@xyflow/react";
import { GitFork } from "lucide-react";
import { FlowNodeShell } from "./shared";
import type { FlowNodeData } from "@/db/agents/schema";

export function ForkFlowNode({ selected, data }: NodeProps & { data: FlowNodeData }) {
  return (
    <FlowNodeShell selected={selected} color="border-amber-500/50">
      <div className="flex items-center gap-2">
        <GitFork className="h-4 w-4 text-amber-600" />
        <span className="text-sm font-medium">{data.label ?? "Fork"}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">Parallel branches</p>
    </FlowNodeShell>
  );
}
