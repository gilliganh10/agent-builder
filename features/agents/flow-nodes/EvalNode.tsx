"use client";

import { type NodeProps } from "@xyflow/react";
import { ClipboardCheck } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FlowNodeShell } from "./shared";
import type { FlowNodeData } from "@/db/agents/schema";

export function EvalFlowNode({ selected, data }: NodeProps & { data: FlowNodeData }) {
  return (
    <FlowNodeShell
      selected={selected}
      color="border-dashed border-[#CDD5D1]"
      hasOutput={false}
    >
      <div className="flex items-center gap-2">
        <ClipboardCheck className="h-4 w-4 text-muted-foreground" />
        <span className="text-sm font-medium text-muted-foreground">{data.label ?? "Eval"}</span>
      </div>
      {data.inlineInstructions ? (
        <Badge className="mt-1 text-xs bg-[#CDD5D1] text-foreground hover:bg-[#CDD5D1]/90">
          Inline
        </Badge>
      ) : (
        <p className="text-xs text-muted-foreground mt-1 italic">
          Add instructions in the inspector
        </p>
      )}
      <p className="text-[10px] text-muted-foreground mt-0.5">out-of-band</p>
    </FlowNodeShell>
  );
}
