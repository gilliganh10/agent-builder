"use client";

import { useMemo } from "react";
import {
  Database,
  ListChecks,
  Play,
  SlidersHorizontal,
  Target,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { EnvVarEditor } from "@/features/agents/shared/EnvVarEditor";
import { StateFieldsEditor } from "@/features/agents/chat-builder/StateFieldsEditor";
import { GoalsEditor } from "@/features/agents/chat-builder/GoalsEditor";
import { cn } from "@/lib/utils";
import type {
  AgentStateConfig,
  EnvVarDefinition,
} from "@/db/agents/schema";

type ConversationTab = "constants" | "objectives" | "memory";

/** Summary row merged into the top of the conversation configuration card. */
export interface ConversationPurposeBlockProps {
  name: string;
  description: string;
  stepCount: number;
  objectiveCount: number;
  memoryFieldCount: number;
  onOpenTest: () => void;
}

/**
 * Agent overview + conversation configuration: constants, objectives, and
 * working memory in one always-visible card. Tab panels use a fixed height so
 * switching tabs does not resize the layout.
 */
interface InputsObjectivesMemoryHubProps {
  purpose: ConversationPurposeBlockProps;

  envVars: EnvVarDefinition[];
  onEnvVarsChange: (vars: EnvVarDefinition[]) => void;

  /**
   * Optional runtime-override editing UI (e.g. "values for this test run").
   * When provided, `overrides` + `onOverrideChange` flow into `EnvVarEditor`.
   */
  envOverrides?: Record<string, string>;
  onEnvOverridesChange?: (overrides: Record<string, string>) => void;

  stateConfig: AgentStateConfig;
  onStateConfigChange: (config: AgentStateConfig) => void;

  showObjectives?: boolean;
  showConstants?: boolean;
  showMemory?: boolean;
}

const TAB_INTRO: Record<ConversationTab, { title: string; body: string }> = {
  constants: {
    title: "Session inputs",
    body: "Fixed values for a run (e.g. target language). Reference them in instructions as {{keyName}} or {{env.keyName}}. They are separate from working memory, which can change during the conversation.",
  },
  objectives: {
    title: "Success criteria",
    body: "Define what “done” looks like. Objectives can check fields in working memory; they are not where you store data.",
  },
  memory: {
    title: "Working memory",
    body: "Named slots the flow reads and updates (often via extract steps). In instructions use {{variableKey}} or {{vars.variableKey}}. Set scope to one message vs whole conversation below.",
  },
};

export function InputsObjectivesMemoryHub({
  purpose,
  envVars,
  onEnvVarsChange,
  envOverrides,
  onEnvOverridesChange,
  stateConfig,
  onStateConfigChange,
  showObjectives = true,
  showConstants = true,
  showMemory = true,
}: InputsObjectivesMemoryHubProps) {
  const { defaultTab, gridCols, visible } = useMemo(() => {
    const list: ConversationTab[] = [];
    if (showConstants) list.push("constants");
    if (showObjectives) list.push("objectives");
    if (showMemory) list.push("memory");
    const n = list.length;
    const gridCols =
      n <= 1 ? "grid-cols-1" : n === 2 ? "grid-cols-2" : "grid-cols-3";
    return {
      defaultTab: list[0] ?? "constants",
      gridCols,
      visible: new Set(list),
    };
  }, [showConstants, showObjectives, showMemory]);

  if (visible.size === 0) {
    return null;
  }

  return (
    <div className="overflow-hidden rounded-xl border border-border/60 bg-background shadow-sm">
      {/* Overview — always visible */}
      <div className="border-b border-border/60 bg-muted/25 px-5 py-4">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-start sm:justify-between">
          <div className="min-w-0 space-y-2">
            <div className="flex items-center gap-2">
              <ListChecks className="h-4 w-4 shrink-0 text-muted-foreground" />
              <h1 className="truncate text-base font-semibold leading-tight">
                {purpose.name}
              </h1>
            </div>
            {purpose.description ? (
              <p className="text-sm text-muted-foreground">{purpose.description}</p>
            ) : (
              <p className="text-sm italic text-muted-foreground">
                Add a short description so others know what this agent is for.
              </p>
            )}
            <div className="flex flex-wrap gap-2 pt-0.5">
              <CounterPill label="steps" value={purpose.stepCount} />
              <CounterPill label="objectives" value={purpose.objectiveCount} />
              <CounterPill label="memory fields" value={purpose.memoryFieldCount} />
            </div>
          </div>
          <Button
            size="sm"
            className="h-9 shrink-0 self-start text-xs sm:self-auto"
            onClick={purpose.onOpenTest}
          >
            <Play className="mr-1.5 h-3.5 w-3.5" />
            Test
          </Button>
        </div>
      </div>

      {/* Configuration tabs */}
      <div className="border-b border-border/50 bg-muted/10 px-5 pt-4 pb-2">
        <h2 className="text-sm font-semibold text-foreground">
          Conversation configuration
        </h2>
        <p className="mt-1 max-w-2xl text-xs leading-relaxed text-muted-foreground">
          Session inputs (fixed per run), objectives (success), and working memory
          (updated by the flow). Use the tabs below—each panel is the same height
          so the layout does not jump when you switch.
        </p>
      </div>

      <Tabs defaultValue={defaultTab} className="gap-0">
        <div className="border-b border-border/60 bg-muted/20 px-3 pt-3">
          <TabsList
            className={cn(
              "grid h-auto w-full gap-1 rounded-lg bg-muted p-1",
              gridCols
            )}
          >
            {visible.has("constants") && (
              <TabsTrigger
                value="constants"
                className="gap-1.5 text-xs font-medium data-[state=active]:shadow-sm"
              >
                <SlidersHorizontal className="h-3.5 w-3.5 shrink-0 opacity-70" />
                Session inputs
              </TabsTrigger>
            )}
            {visible.has("objectives") && (
              <TabsTrigger
                value="objectives"
                className="gap-1.5 text-xs font-medium data-[state=active]:shadow-sm"
              >
                <Target className="h-3.5 w-3.5 shrink-0 opacity-70" />
                Objectives
              </TabsTrigger>
            )}
            {visible.has("memory") && (
              <TabsTrigger
                value="memory"
                className="gap-1.5 text-xs font-medium data-[state=active]:shadow-sm"
              >
                <Database className="h-3.5 w-3.5 shrink-0 opacity-70" />
                Working memory
              </TabsTrigger>
            )}
          </TabsList>
        </div>

        {visible.has("constants") && (
          <TabsContent value="constants" className="mt-0 px-5 pb-5 pt-4">
            <TabPanel>
              <TabIntro {...TAB_INTRO.constants} />
              <EnvVarEditor
                envVars={envVars}
                onChange={onEnvVarsChange}
                overrides={envOverrides}
                onOverrideChange={onEnvOverridesChange}
              />
            </TabPanel>
          </TabsContent>
        )}

        {visible.has("objectives") && (
          <TabsContent value="objectives" className="mt-0 px-5 pb-5 pt-4">
            <TabPanel>
              <TabIntro {...TAB_INTRO.objectives} />
              <GoalsEditor
                goals={stateConfig.goals}
                fields={stateConfig.fields}
                onChange={(goals) => onStateConfigChange({ ...stateConfig, goals })}
              />
            </TabPanel>
          </TabsContent>
        )}

        {visible.has("memory") && (
          <TabsContent value="memory" className="mt-0 px-5 pb-5 pt-4">
            <TabPanel>
              <TabIntro {...TAB_INTRO.memory} />
              <div className="mb-3 flex flex-wrap items-center gap-2">
                <span className="text-xs text-muted-foreground">Persist fields</span>
                <select
                  className="h-8 rounded-md border border-input bg-white px-2 text-xs shadow-sm dark:bg-zinc-950"
                  value={stateConfig.scope}
                  onChange={(e) =>
                    onStateConfigChange({
                      ...stateConfig,
                      scope: e.target.value as "run" | "conversation",
                    })
                  }
                >
                  <option value="conversation">Across the whole conversation</option>
                  <option value="run">For a single message only</option>
                </select>
              </div>
              <StateFieldsEditor
                fields={stateConfig.fields}
                onChange={(fields) =>
                  onStateConfigChange({ ...stateConfig, fields })
                }
              />
            </TabPanel>
          </TabsContent>
        )}
      </Tabs>
    </div>
  );
}

function CounterPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full bg-background px-2.5 py-0.5 text-[11px] text-muted-foreground shadow-sm ring-1 ring-border/60">
      <span className="font-medium text-foreground">{value}</span> {label}
    </span>
  );
}

/** Fixed height scroll area so tab switches do not resize the card. */
function TabPanel({ children }: { children: React.ReactNode }) {
  return (
    <div className="flex h-96 flex-col overflow-hidden rounded-lg border border-border/50 bg-muted/20 shadow-inner">
      <div className="min-h-0 flex-1 overflow-y-auto p-4">{children}</div>
    </div>
  );
}

function TabIntro({ title, body }: { title: string; body: string }) {
  return (
    <div className="mb-4 space-y-1 border-b border-border/40 pb-3">
      <p className="text-xs font-medium text-foreground">{title}</p>
      <p className="text-xs leading-relaxed text-muted-foreground">{body}</p>
    </div>
  );
}
