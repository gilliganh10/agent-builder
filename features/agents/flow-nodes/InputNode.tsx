"use client";

import { type NodeProps } from "@xyflow/react";
import { ArrowRightCircle } from "lucide-react";
import { FlowNodeShell } from "./shared";
import type { FlowNodeData } from "@/db/agents/schema";

export function InputFlowNode({ selected, data }: NodeProps & { data: FlowNodeData }) {
  return (
    <FlowNodeShell selected={selected} hasInput={false} color="border-green-500/50">
      <div className="flex items-center gap-2">
        <ArrowRightCircle className="h-4 w-4 text-green-600" />
        <span className="text-sm font-medium">{data.label ?? "Input"}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1">User message</p>
    </FlowNodeShell>
  );
}
