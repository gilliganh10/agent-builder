"use client";

import { AlertTriangle } from "lucide-react";
import { useAgentWorkspace } from "./workspace/AgentWorkspaceContext";
import { useBuilderDocument } from "./workspace/BuilderDocumentContext";
import { useSimplifiedBuilder } from "./simplified/SimplifiedBuilderContext";
import { SimplifiedOutline } from "./simplified/SimplifiedOutline";
import { InputsObjectivesMemoryHub } from "@/features/agents/shared/InputsObjectivesMemoryHub";

/**
 * Plan builder — the primary authoring surface. Renders the simplified
 * step outline and defers inspection to the right panel. Every edit flows
 * through `SimplifiedBuilderContext`, which compiles to `FlowDefinition`
 * on save.
 */
export function PlanBuilderTab() {
  const { agent, switchBuilderSubtab } = useAgentWorkspace();
  const {
    stateConfig,
    setStateConfig,
    envVars,
    setEnvVars,
    envOverrides,
    setEnvOverrides,
  } = useBuilderDocument();
  const { importWarnings, rootOrder } = useSimplifiedBuilder();
  const bodyStepCount = Math.max(0, rootOrder.length - 2);

  return (
    <div className="space-y-6">
      {importWarnings.length > 0 && <ImportWarningsBanner warnings={importWarnings} />}

      <InputsObjectivesMemoryHub
        purpose={{
          name: agent.name,
          memoryFieldCount: stateConfig.fields.length,
          objectiveCount: stateConfig.goals.length,
          stepCount: bodyStepCount,
        }}
        envVars={envVars}
        onEnvVarsChange={setEnvVars}
        envOverrides={envOverrides}
        onEnvOverridesChange={setEnvOverrides}
        stateConfig={stateConfig}
        onStateConfigChange={setStateConfig}
      />

      <SimplifiedOutline />

      {bodyStepCount > 0 && (
        <div className="rounded-lg border border-dashed border-border/70 p-4 text-xs text-muted-foreground">
          Finished wiring this up?{" "}
          <button
            type="button"
            className="font-medium text-foreground underline-offset-2 hover:underline"
            onClick={() => switchBuilderSubtab("test")}
          >
            Run a test conversation
          </button>{" "}
          to see it in action.
        </div>
      )}
    </div>
  );
}

function ImportWarningsBanner({ warnings }: { warnings: string[] }) {
  return (
    <div className="flex items-start gap-3 rounded-lg border border-amber-300/60 bg-amber-50 px-4 py-3 text-amber-900 dark:border-amber-500/40 dark:bg-amber-950/30 dark:text-amber-200">
      <AlertTriangle className="mt-0.5 h-4 w-4 shrink-0" />
      <div className="space-y-1 text-sm">
        <p className="font-medium">Heads up</p>
        <ul className="list-disc space-y-0.5 pl-4 text-xs opacity-90">
          {warnings.map((w, i) => (
            <li key={i}>{w}</li>
          ))}
        </ul>
      </div>
    </div>
  );
}
