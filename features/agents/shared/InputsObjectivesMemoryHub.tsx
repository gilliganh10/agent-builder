"use client";

import { useMemo, useState } from "react";
import { ChevronDown, ListChecks } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from "@/components/ui/tooltip";
import { EnvVarEditor } from "@/features/agents/shared/EnvVarEditor";
import { StateFieldsEditor } from "@/features/agents/chat-builder/StateFieldsEditor";
import { GoalsEditor } from "@/features/agents/chat-builder/GoalsEditor";
import type {
  AgentStateConfig,
  EnvVarDefinition,
} from "@/db/agents/schema";

type ConversationTab = "constants" | "objectives" | "memory";

/** Summary row merged into the top of the conversation configuration card. */
export interface ConversationPurposeBlockProps {
  name: string;
  description?: string;
  stepCount: number;
  objectiveCount: number;
  memoryFieldCount: number;
  onOpenTest?: () => void;
}

interface InputsObjectivesMemoryHubProps {
  purpose: ConversationPurposeBlockProps;

  envVars: EnvVarDefinition[];
  onEnvVarsChange: (vars: EnvVarDefinition[]) => void;

  envOverrides?: Record<string, string>;
  onEnvOverridesChange?: (overrides: Record<string, string>) => void;

  stateConfig: AgentStateConfig;
  onStateConfigChange: (config: AgentStateConfig) => void;

  showObjectives?: boolean;
  showConstants?: boolean;
  showMemory?: boolean;
}

const TAB_HELP: Record<ConversationTab, string> = {
  constants:
    "Fixed values available during the run. Reference in instructions as {{keyName}} or {{env.keyName}}. Separate from memory, which can change during the conversation.",
  objectives:
    "Used to decide when the conversation is complete. Goals can check memory fields; they are not where you store data.",
  memory:
    "Fields the flow can update across messages. In instructions use {{variableKey}} or {{vars.variableKey}}. Memory scope controls whether values persist for one message or the whole conversation.",
};

const SCOPE_LABEL: Record<"run" | "conversation", string> = {
  conversation: "whole conversation",
  run: "single message",
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
  const [configExpanded, setConfigExpanded] = useState(false);

  const { defaultTab, visible, validTabs } = useMemo(() => {
    const list: ConversationTab[] = [];
    if (showConstants) list.push("constants");
    if (showObjectives) list.push("objectives");
    if (showMemory) list.push("memory");
    return {
      defaultTab: list[0] ?? "constants",
      visible: new Set(list),
      validTabs: list,
    };
  }, [showConstants, showObjectives, showMemory]);

  const [activeTab, setActiveTab] = useState<ConversationTab>(defaultTab);
  const tabValue = validTabs.includes(activeTab) ? activeTab : defaultTab;

  if (visible.size === 0) {
    return null;
  }

  const nInputs = envVars.length;
  const nGoals = stateConfig.goals.length;
  const nMemory = stateConfig.fields.length;

  const inputsRow = summarizeInputs(envVars);
  const goalsRow = summarizeGoals(stateConfig.goals);
  const memoryRow = summarizeMemory(stateConfig.fields, stateConfig.scope);

  return (
    <TooltipProvider delayDuration={200}>
      <div className="overflow-hidden rounded-xl border border-border bg-card shadow-sm">
        {/* Overview — always visible */}
        <div className="border-b border-border bg-muted/50 px-5 py-3 dark:bg-muted/40">
          <div className="flex flex-wrap items-center gap-3">
            <div className="flex min-w-0 items-center gap-2">
              <ListChecks className="h-4 w-4 shrink-0 text-muted-foreground" />
              <h1 className="truncate text-base font-semibold leading-tight text-foreground">
                {purpose.name}
              </h1>
            </div>
            <div className="flex flex-wrap gap-2">
              <CounterPill label="steps" value={purpose.stepCount} />
              <CounterPill label="goals" value={purpose.objectiveCount} />
              <CounterPill label="memory fields" value={purpose.memoryFieldCount} />
            </div>
          </div>
        </div>

        {/* Conversation config — collapsed or expanded */}
        {!configExpanded ? (
          <div className="flex flex-col gap-3 border-b border-border bg-muted/40 px-5 py-3 sm:flex-row sm:items-center sm:justify-between dark:bg-muted/30">
            <div className="min-w-0 flex-1 space-y-2">
              <h2 className="text-sm font-semibold text-foreground">
                Conversation configuration
              </h2>
              <div className="flex flex-wrap gap-1.5">
                <SummaryChip label="input" value={nInputs} pluralLabel="inputs" />
                <SummaryChip label="goal" value={nGoals} pluralLabel="goals" />
                <SummaryChip
                  label="memory field"
                  value={nMemory}
                  pluralLabel="memory fields"
                />
              </div>
              <div className="space-y-0.5 text-[11px] text-muted-foreground">
                <div className="truncate">
                  <span className="font-medium text-foreground/80">Inputs</span> —{" "}
                  {inputsRow}
                </div>
                <div className="truncate">
                  <span className="font-medium text-foreground/80">Goals</span> —{" "}
                  {goalsRow}
                </div>
                <div className="truncate">
                  <span className="font-medium text-foreground/80">Memory</span> —{" "}
                  {memoryRow}
                </div>
              </div>
            </div>
            <Button
              type="button"
              variant="secondary"
              size="sm"
              className="h-8 shrink-0 self-end text-xs sm:self-center"
              onClick={() => setConfigExpanded(true)}
            >
              Configure
            </Button>
          </div>
        ) : (
          <div className="border-b border-border bg-muted/40 dark:bg-muted/30">
            <div className="flex items-center justify-between gap-2 px-5 pt-3">
              <h2 className="text-sm font-semibold text-foreground">
                Conversation configuration
              </h2>
              <Button
                type="button"
                variant="ghost"
                size="sm"
                className="h-7 gap-1 text-xs text-muted-foreground"
                onClick={() => setConfigExpanded(false)}
              >
                <ChevronDown className="h-3.5 w-3.5 rotate-180" />
                Collapse
              </Button>
            </div>

            <Tabs
              value={tabValue}
              onValueChange={(v) => setActiveTab(v as ConversationTab)}
              className="gap-0"
            >
              <div className="px-5 pt-3 pb-0">
                <TabsList className="inline-flex h-8 w-auto gap-0 rounded-md border border-border/80 bg-muted/60 p-0.5 dark:bg-muted/50">
                  {visible.has("constants") && (
                    <TabsTrigger
                      value="constants"
                      className="rounded px-3 py-1 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      Inputs
                    </TabsTrigger>
                  )}
                  {visible.has("objectives") && (
                    <TabsTrigger
                      value="objectives"
                      className="rounded px-3 py-1 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      Goals
                    </TabsTrigger>
                  )}
                  {visible.has("memory") && (
                    <TabsTrigger
                      value="memory"
                      className="rounded px-3 py-1 text-xs font-medium data-[state=active]:bg-card data-[state=active]:text-foreground data-[state=active]:shadow-sm"
                    >
                      Memory
                    </TabsTrigger>
                  )}
                </TabsList>
              </div>

              {visible.has("constants") && (
                <TabsContent value="constants" className="mt-0 px-5 pb-5 pt-3">
                  <div className="max-h-[min(70vh,28rem)] overflow-y-auto">
                    <SectionHeader
                      title="Inputs"
                      line="Fixed values available during the run."
                      tooltip={TAB_HELP.constants}
                    />
                    <EnvVarEditor
                      envVars={envVars}
                      onChange={onEnvVarsChange}
                      overrides={envOverrides}
                      onOverrideChange={onEnvOverridesChange}
                    />
                  </div>
                </TabsContent>
              )}

              {visible.has("objectives") && (
                <TabsContent value="objectives" className="mt-0 px-5 pb-5 pt-3">
                  <div className="max-h-[min(70vh,28rem)] overflow-y-auto">
                    <SectionHeader
                      title="Goals"
                      line="Used to decide when the conversation is complete."
                      tooltip={TAB_HELP.objectives}
                    />
                    <GoalsEditor
                      goals={stateConfig.goals}
                      fields={stateConfig.fields}
                      onChange={(goals) => onStateConfigChange({ ...stateConfig, goals })}
                    />
                  </div>
                </TabsContent>
              )}

              {visible.has("memory") && (
                <TabsContent value="memory" className="mt-0 px-5 pb-5 pt-3">
                  <div className="max-h-[min(70vh,28rem)] overflow-y-auto">
                    <SectionHeader
                      title="Memory"
                      line="Fields the flow can update across messages."
                      tooltip={TAB_HELP.memory}
                    />
                    <div className="mb-3 flex flex-wrap items-center gap-2">
                      <span className="text-xs font-medium text-foreground">Memory scope</span>
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
                        <option value="conversation">Whole conversation</option>
                        <option value="run">Single message</option>
                      </select>
                    </div>
                    <StateFieldsEditor
                      fields={stateConfig.fields}
                      scopeLabel={SCOPE_LABEL[stateConfig.scope]}
                      onChange={(fields) =>
                        onStateConfigChange({ ...stateConfig, fields })
                      }
                    />
                  </div>
                </TabsContent>
              )}
            </Tabs>
          </div>
        )}
      </div>
    </TooltipProvider>
  );
}

function summarizeInputs(envVars: EnvVarDefinition[]): string {
  if (envVars.length === 0) return "None";
  if (envVars.length === 1) {
    const v = envVars[0];
    const val =
      v.default != null && String(v.default) !== ""
        ? String(v.default)
        : "(no default)";
    return `${v.key} = ${val}`;
  }
  return `${envVars.length} inputs`;
}

function summarizeGoals(
  goals: { name: string }[]
): string {
  if (goals.length === 0) return "None";
  if (goals.length === 1) {
    const n = goals[0].name?.trim();
    return n ? n : "1 goal";
  }
  return `${goals.length} goals`;
}

function summarizeMemory(
  fields: { key: string }[],
  scope: "run" | "conversation"
): string {
  if (fields.length === 0) return "None";
  const scopeBit = SCOPE_LABEL[scope];
  if (fields.length === 1) {
    return `${fields[0].key} · ${scopeBit}`;
  }
  return `${fields.length} fields · ${scopeBit}`;
}

function SummaryChip({
  label,
  value,
  pluralLabel,
}: {
  label: string;
  value: number;
  pluralLabel?: string;
}) {
  const unit =
    value === 1 ? label : pluralLabel ?? `${label}s`;
  return (
    <span className="rounded-full bg-card px-2 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border">
      <span className="font-medium text-foreground">{value}</span> {unit}
    </span>
  );
}

function CounterPill({ label, value }: { label: string; value: number }) {
  return (
    <span className="rounded-full bg-card px-2.5 py-0.5 text-[11px] text-muted-foreground ring-1 ring-border">
      <span className="font-medium text-foreground">{value}</span> {label}
    </span>
  );
}

function SectionHeader({
  title,
  line,
  tooltip,
}: {
  title: string;
  line: string;
  tooltip: string;
}) {
  return (
    <div className="mb-3 flex flex-wrap items-baseline gap-1.5 border-b border-border/40 pb-2">
      <span className="text-xs font-medium text-foreground">{title}</span>
      <span className="text-xs text-muted-foreground">{line}</span>
      <Tooltip>
        <TooltipTrigger asChild>
          <button
            type="button"
            className="inline-flex h-5 w-5 shrink-0 items-center justify-center rounded-full text-[10px] font-semibold text-muted-foreground ring-1 ring-border/60 hover:bg-muted"
            aria-label={`More about ${title}`}
          >
            i
          </button>
        </TooltipTrigger>
        <TooltipContent side="top" className="max-w-xs text-balance">
          {tooltip}
        </TooltipContent>
      </Tooltip>
    </div>
  );
}
