"use client";

import { type NodeProps } from "@xyflow/react";
import { Zap } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FlowNodeShell } from "./shared";
import type { FlowNodeData } from "@/db/agents/schema";

export function ActorFlowNode({ selected, data }: NodeProps & { data: FlowNodeData }) {
  return (
    <FlowNodeShell selected={selected} color="border-[#F45B69]/40">
      <div className="flex items-center gap-2">
        <Zap className="h-4 w-4 text-[#F45B69]" />
        <span className="text-sm font-medium">{data.label ?? "Actor"}</span>
      </div>
      {data.inlineInstructions ? (
        <Badge className="mt-1 text-xs bg-[#946E83] hover:bg-[#946E83]/90">
          Inline
        </Badge>
      ) : (
        <p className="text-xs text-muted-foreground mt-1 italic">
          Add instructions in the inspector
        </p>
      )}
    </FlowNodeShell>
  );
}
