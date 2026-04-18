"use client";

import { type NodeProps } from "@xyflow/react";
import { ArrowLeftCircle } from "lucide-react";
import { FlowNodeShell } from "./shared";
import type { FlowNodeData } from "@/db/agents/schema";

export function OutputFlowNode({ selected, data }: NodeProps & { data: FlowNodeData }) {
  return (
    <FlowNodeShell selected={selected} hasOutput={false} color="border-blue-500/50">
      <div className="flex items-center gap-2">
        <ArrowLeftCircle className="h-4 w-4 text-blue-600" />
        <span className="text-sm font-medium">{data.label ?? "Output"}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">Final result</p>
    </FlowNodeShell>
  );
}
