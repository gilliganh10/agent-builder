"use client";

import { Brain, Target } from "lucide-react";
import type { OrchestratorConfig } from "@/db/agents/schema";
import { StateFieldsEditor } from "../chat-builder/StateFieldsEditor";
import { GoalsEditor } from "../chat-builder/GoalsEditor";
import {
  orchestratorToStateConfig,
  stateConfigToOrchestrator,
} from "@/lib/agents/shared/state-config-utils";

interface OrchestratorConfigEditorProps {
  config: OrchestratorConfig;
  onChange: (config: OrchestratorConfig) => void;
}

/**
 * Wrapper that exposes the OrchestratorConfig interface
 * while delegating to the shared StateFieldsEditor + GoalsEditor.
 */
export function OrchestratorConfigEditor({
  config,
  onChange,
}: OrchestratorConfigEditorProps) {
  const sc = orchestratorToStateConfig(config);

  function handleFieldsChange(fields: typeof sc.fields) {
    const next = { ...sc, fields };
    onChange(stateConfigToOrchestrator(next, config.locks));
  }

  function handleGoalsChange(goals: typeof sc.goals) {
    const next = { ...sc, goals };
    onChange(stateConfigToOrchestrator(next, config.locks));
  }

  return (
    <div className="border-b border-border px-4 py-4 space-y-4 bg-muted/20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Brain className="h-3.5 w-3.5 text-[#222E50]" />
            <span className="text-xs font-medium">Memory</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            What your agent remembers between messages.
          </p>
          <div className="flex items-center gap-1.5 mb-1">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Remembers across
            </span>
            <select
              className="h-6 rounded-md border bg-background px-1.5 text-[10px]"
              value={config.scope}
              onChange={(e) =>
                onChange({ ...config, scope: e.target.value as "run" | "conversation" })
              }
            >
              <option value="conversation">Whole conversation</option>
              <option value="run">Single message only</option>
            </select>
          </div>
          <StateFieldsEditor fields={sc.fields} onChange={handleFieldsChange} />
        </div>

        <div className="space-y-2">
          <div className="flex items-center gap-2">
            <Target className="h-3.5 w-3.5 text-[#946E83]" />
            <span className="text-xs font-medium">Goals</span>
          </div>
          <p className="text-[11px] text-muted-foreground">
            Conditions that mark the conversation as complete.
          </p>
          <GoalsEditor
            goals={sc.goals}
            fields={sc.fields}
            onChange={handleGoalsChange}
          />
        </div>
      </div>
    </div>
  );
}
