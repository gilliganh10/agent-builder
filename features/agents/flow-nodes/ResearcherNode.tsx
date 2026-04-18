"use client";

import { type NodeProps } from "@xyflow/react";
import { Search } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { FlowNodeShell } from "./shared";
import type { FlowNodeData } from "@/db/agents/schema";

export function ResearcherFlowNode({ selected, data }: NodeProps & { data: FlowNodeData }) {
  return (
    <FlowNodeShell selected={selected} color="border-[#222E50]/40">
      <div className="flex items-center gap-2">
        <Search className="h-4 w-4 text-[#222E50]" />
        <span className="text-sm font-medium">{data.label ?? "Researcher"}</span>
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
    </FlowNodeShell>
  );
}
