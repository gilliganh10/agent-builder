"use client";

import { type NodeProps } from "@xyflow/react";
import { GitMerge } from "lucide-react";
import { FlowNodeShell } from "./shared";
import type { FlowNodeData } from "@/db/agents/schema";

export function JoinFlowNode({ selected, data }: NodeProps & { data: FlowNodeData }) {
  return (
    <FlowNodeShell selected={selected} color="border-amber-500/50">
      <div className="flex items-center gap-2">
        <GitMerge className="h-4 w-4 text-amber-600" />
        <span className="text-sm font-medium">{data.label ?? "Join"}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">Merge results</p>
    </FlowNodeShell>
  );
}
