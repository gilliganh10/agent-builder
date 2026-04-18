"use client";

import { type NodeProps } from "@xyflow/react";
import { PenLine } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FlowNodeShell } from "./shared";
import type { FlowNodeData } from "@/db/agents/schema";

export function RewriterFlowNode({ selected, data }: NodeProps & { data: FlowNodeData }) {
  return (
    <FlowNodeShell selected={selected} color="border-[#946E83]/40">
      <div className="flex items-center gap-2">
        <PenLine className="h-4 w-4 text-[#946E83]" />
        <span className="text-sm font-medium">{data.label ?? "Rewriter"}</span>
      </div>
      {data.primitiveId ? (
        <Badge variant="outline" className="mt-1 text-xs">
          {data.primitiveId}
        </Badge>
      ) : data.inlineInstructions ? (
        <Badge className="mt-1 text-xs bg-[#946E83] hover:bg-[#946E83]/90">
          Inline
        </Badge>
      ) : (
        <p className="text-xs text-muted-foreground mt-1 italic">
          No primitive selected
        </p>
      )}
      {data.canRewrite && (
        <p className="text-[10px] text-[#946E83] mt-0.5">rewrites user msg</p>
      )}
    </FlowNodeShell>
  );
}
