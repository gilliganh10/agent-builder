"use client";

import { type NodeProps } from "@xyflow/react";
import { GitBranch } from "lucide-react";
import { FlowNodeShell } from "./shared";
import type { FlowNodeData } from "@/db/agents/schema";

export function ConditionFlowNode({ selected, data }: NodeProps & { data: FlowNodeData }) {
  const cond = data.condition;
  const summary = cond ? `${cond.field} ${cond.operator} ${cond.value ?? ""}` : "Not configured";

  return (
    <FlowNodeShell
      selected={selected}
      color="border-[#946E83]/50"
      outputHandles={[
        { id: "true", label: "Yes" },
        { id: "false", label: "No" },
      ]}
    >
      <div className="flex items-center gap-2">
        <GitBranch className="h-4 w-4 text-[#946E83]" />
        <span className="text-sm font-medium">{data.label ?? "Condition"}</span>
      </div>
      <p className="text-xs text-muted-foreground mt-1 font-mono truncate max-w-[160px]">
        {summary}
      </p>
      <div className="flex items-center gap-2 mt-1.5 text-[10px] text-muted-foreground">
        <span className="text-green-600">Yes ↗</span>
        <span className="text-red-500">No ↘</span>
      </div>
    </FlowNodeShell>
  );
}
