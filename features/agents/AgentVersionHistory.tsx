"use client";

import { useState } from "react";
import { ChevronDown, ChevronRight, GitBranch } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import type { AgentVersion } from "@/db/agents/schema";

interface AgentVersionHistoryProps {
  versions: AgentVersion[];
}

export function AgentVersionHistory({ versions }: AgentVersionHistoryProps) {
  if (versions.length === 0) {
    return (
      <div className="flex flex-col items-center gap-2 py-12 text-center text-muted-foreground">
        <GitBranch className="h-8 w-8" />
        <p className="text-sm font-medium">No versions yet</p>
        <p className="text-xs">Versions are created automatically when the agent is edited.</p>
      </div>
    );
  }

  return (
    <div className="space-y-3">
      {versions.map((version, i) => (
        <VersionCard key={version.id} version={version} isLatest={i === 0} />
      ))}
    </div>
  );
}

function VersionCard({
  version,
  isLatest,
}: {
  version: AgentVersion;
  isLatest: boolean;
}) {
  const [expanded, setExpanded] = useState(false);

  return (
    <Card>
      <CardContent className="py-3 px-4">
        <button
          onClick={() => setExpanded(!expanded)}
          className="flex w-full items-center gap-3 text-left"
        >
          {expanded ? (
            <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
          ) : (
            <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground" />
          )}

          <div className="flex flex-1 items-center gap-2 min-w-0">
            <Badge variant="outline" className="shrink-0">
              v{version.version}
            </Badge>
            {isLatest && (
              <Badge variant="default" className="shrink-0 text-xs">
                Latest
              </Badge>
            )}
            <span className="text-sm truncate">{version.changelog}</span>
          </div>

          <span className="shrink-0 text-xs text-muted-foreground">
            {new Date(version.createdAt).toLocaleDateString()}
          </span>
        </button>

        {expanded && (
          <div className="mt-3 space-y-3 pl-7">
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Model
              </label>
              <p className="text-sm">{version.defaultModel}</p>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Tools ({version.allowedTools.length})
              </label>
              <div className="flex flex-wrap gap-1">
                {version.allowedTools.map((tool) => (
                  <Badge key={tool} variant="outline" className="text-xs font-mono">
                    {tool}
                  </Badge>
                ))}
              </div>
            </div>
            <div className="space-y-1">
              <label className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
                Instructions
              </label>
              <pre className="whitespace-pre-wrap rounded-md bg-muted p-3 text-xs font-mono leading-relaxed max-h-60 overflow-y-auto">
                {version.instructions}
              </pre>
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
