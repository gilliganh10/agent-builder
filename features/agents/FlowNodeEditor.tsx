"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { StepInspectorShell } from "@/features/agents/shared/StepInspectorShell";
import type { FlowNodeData, FlowNodeType, ConditionConfig, VarDefinition } from "@/db/agents/schema";
import { ALL_MODEL_POLICIES, MODEL_POLICIES, type ModelPolicy } from "@/lib/agents/model-policy";
import type { Node } from "@xyflow/react";

type FlowNode = Node<FlowNodeData>;

const PRIMITIVE_NODE_TYPES = new Set(["researcher", "actor", "rewriter", "responder", "eval", "state_extractor"]);

interface FlowNodeEditorProps {
  node: FlowNode;
  agentSlugs: string[];
  primitiveSlugs?: string[];
  orchestratorVars?: VarDefinition[];
  onUpdate: (nodeId: string, data: Partial<FlowNodeData>) => void;
  onDelete: (nodeId: string) => void;
  onClose: () => void;
}

const NODE_TITLES: Partial<Record<FlowNodeType, string>> = {
  agent: "Sub-agent step",
  researcher: "Research step",
  actor: "Tool-call step",
  rewriter: "Rewrite step",
  responder: "Reply step",
  eval: "Evaluation step",
  state_extractor: "Extract step",
  condition: "Conditional branch",
  input: "Flow input",
  output: "Flow output",
};

const NODE_BLURBS: Partial<Record<FlowNodeType, string>> = {
  agent: "Calls another agent with the current input.",
  researcher: "Runs a prompt and returns findings.",
  actor: "Runs a prompt that can call tools.",
  rewriter: "Rewrites the message with an LLM.",
  responder: "Drafts the final reply to the user.",
  eval: "Scores the current run against criteria.",
  state_extractor: "Extracts structured fields into memory.",
  condition: "Chooses a branch based on memory or a field.",
  input: "The run's starting data.",
  output: "The run's final result.",
};

const CONDITION_OPERATORS = [
  { value: "eq", label: "equals" },
  { value: "neq", label: "not equals" },
  { value: "contains", label: "contains" },
  { value: "gt", label: "greater than" },
  { value: "gte", label: "greater or equal" },
  { value: "lt", label: "less than" },
  { value: "lte", label: "less or equal" },
  { value: "exists", label: "exists" },
  { value: "not_exists", label: "not exists" },
] as const;

export function FlowNodeEditor({
  node,
  agentSlugs,
  primitiveSlugs = [],
  orchestratorVars = [],
  onUpdate,
  onDelete,
  onClose,
}: FlowNodeEditorProps) {
  const nodeType = node.type as FlowNodeType;
  const data = node.data as FlowNodeData;
  const isPrimitive = PRIMITIVE_NODE_TYPES.has(nodeType);

  const canDelete = nodeType !== "input" && nodeType !== "output";
  const title = NODE_TITLES[nodeType] ?? `${nodeType} node`;
  const blurb = NODE_BLURBS[nodeType];

  return (
    <StepInspectorShell
      title={title}
      kindBadge={nodeType}
      blurb={blurb}
      onClose={onClose}
      onDelete={canDelete ? () => onDelete(node.id) : undefined}
      deleteLabel="Delete step"
    >
        <div className="space-y-1.5">
          <Label htmlFor="node-label">Label</Label>
          <Input
            id="node-label"
            value={data.label ?? ""}
            onChange={(e) => onUpdate(node.id, { label: e.target.value })}
            placeholder={`${nodeType} node`}
          />
        </div>

        {nodeType === "agent" && (
          <AgentNodeFields
            data={data}
            agentSlugs={agentSlugs}
            onUpdate={(patch) => onUpdate(node.id, patch)}
          />
        )}

        {isPrimitive && (
          <PrimitiveNodeFields
            data={data}
            primitiveSlugs={primitiveSlugs}
            onUpdate={(patch) => onUpdate(node.id, patch)}
          />
        )}

        {nodeType === "condition" && (
          <ConditionNodeFields
            data={data}
            onUpdate={(patch) => onUpdate(node.id, patch)}
          />
        )}

        {(nodeType === "agent" || isPrimitive) && (
          <>
            <Separator />
            <div className="space-y-1.5">
              <Label htmlFor="node-timeout">Timeout (ms)</Label>
              <Input
                id="node-timeout"
                type="number"
                value={data.timeout ?? ""}
                onChange={(e) =>
                  onUpdate(node.id, { timeout: e.target.value ? Number(e.target.value) : undefined })
                }
                placeholder="30000"
              />
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="node-retries">Max retries</Label>
              <Input
                id="node-retries"
                type="number"
                value={data.retries ?? ""}
                onChange={(e) =>
                  onUpdate(node.id, { retries: e.target.value ? Number(e.target.value) : undefined })
                }
                placeholder="0"
              />
            </div>
          </>
        )}

        {isPrimitive && orchestratorVars.length > 0 && (
          <VarsPatchFields
            data={data}
            orchestratorVars={orchestratorVars}
            onUpdate={(patch) => onUpdate(node.id, patch)}
          />
        )}

        {(nodeType === "agent" || isPrimitive) && (
          <DisplaySettingsFields
            data={data}
            onUpdate={(patch) => onUpdate(node.id, patch)}
          />
        )}

    </StepInspectorShell>
  );
}

function AgentNodeFields({
  data,
  agentSlugs,
  onUpdate,
}: {
  data: FlowNodeData;
  agentSlugs: string[];
  onUpdate: (patch: Partial<FlowNodeData>) => void;
}) {
  const mode = data.agentSlug ? "existing" : "inline";

  function switchMode(next: string) {
    if (next === "existing") {
      onUpdate({ inlineInstructions: undefined, inlineModel: undefined });
    } else {
      onUpdate({ agentSlug: undefined });
    }
  }

  return (
    <div className="space-y-3">
      <Tabs value={mode} onValueChange={switchMode}>
        <TabsList className="w-full">
          <TabsTrigger value="existing" className="flex-1 text-xs">
            Existing Agent
          </TabsTrigger>
          <TabsTrigger value="inline" className="flex-1 text-xs">
            Inline Agent
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "existing" ? (
        <div className="space-y-1.5">
          <Label>Agent</Label>
          <Select
            value={data.agentSlug ?? "__none__"}
            onValueChange={(v) => onUpdate({ agentSlug: v === "__none__" ? undefined : v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select an agent" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {agentSlugs.map((slug) => (
                <SelectItem key={slug} value={slug}>
                  {slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="inline-instructions">Instructions</Label>
            <Textarea
              id="inline-instructions"
              value={data.inlineInstructions ?? ""}
              onChange={(e) => onUpdate({ inlineInstructions: e.target.value || undefined })}
              placeholder="System instructions for this agent node..."
              className="min-h-[120px] text-xs font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Model</Label>
            <Select
              value={data.inlineModel ?? "default"}
              onValueChange={(v) => onUpdate({ inlineModel: v as ModelPolicy })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_MODEL_POLICIES.map((policy) => (
                  <SelectItem key={policy} value={policy}>
                    {MODEL_POLICIES[policy].label} — {MODEL_POLICIES[policy].description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

const PALETTE_COLORS = [
  { value: "#222E50", label: "Space Indigo" },
  { value: "#946E83", label: "Dusty Mauve" },
  { value: "#F45B69", label: "Bubblegum Pink" },
  { value: "#CDD5D1", label: "Dust Grey" },
] as const;

function DisplaySettingsFields({
  data,
  onUpdate,
}: {
  data: FlowNodeData;
  onUpdate: (patch: Partial<FlowNodeData>) => void;
}) {
  const persistChecked = data.persistOutput !== false;

  return (
    <>
      <Separator />
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Display &amp; Context
      </p>

      <div className="space-y-1.5">
        <Label htmlFor="display-name">Display Name</Label>
        <Input
          id="display-name"
          value={data.displayName ?? ""}
          onChange={(e) => onUpdate({ displayName: e.target.value || undefined })}
          placeholder={data.label ?? "Agent"}
        />
      </div>

      <div className="space-y-1.5">
        <Label>Display Color</Label>
        <Select
          value={data.displayColor ?? "__default__"}
          onValueChange={(v) => onUpdate({ displayColor: v === "__default__" ? undefined : v })}
        >
          <SelectTrigger>
            <SelectValue placeholder="Default (Dust Grey)" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="__default__">Default</SelectItem>
            {PALETTE_COLORS.map((c) => (
              <SelectItem key={c.value} value={c.value}>
                <span className="flex items-center gap-2">
                  <span
                    className="inline-block h-3 w-3 rounded-full border border-border"
                    style={{ backgroundColor: c.value }}
                  />
                  {c.label}
                </span>
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1.5">
        <Label>Message Side</Label>
        <Select
          value={data.displaySide ?? "left"}
          onValueChange={(v) => onUpdate({ displaySide: v as "left" | "right" })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="left">Left</SelectItem>
            <SelectItem value="right">Right</SelectItem>
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="persist-output"
          checked={persistChecked}
          onChange={(e) => onUpdate({ persistOutput: e.target.checked })}
          className="h-4 w-4 rounded border-border"
        />
        <Label htmlFor="persist-output" className="text-xs font-normal cursor-pointer">
          Persist output in conversation context
        </Label>
      </div>

      <div className="flex items-center gap-2">
        <input
          type="checkbox"
          id="can-rewrite"
          checked={data.canRewrite === true}
          onChange={(e) => onUpdate({ canRewrite: e.target.checked || undefined })}
          className="h-4 w-4 rounded border-border"
        />
        <Label htmlFor="can-rewrite" className="text-xs font-normal cursor-pointer">
          Can rewrite user message
        </Label>
      </div>
    </>
  );
}

function ConditionNodeFields({
  data,
  onUpdate,
}: {
  data: FlowNodeData;
  onUpdate: (patch: Partial<FlowNodeData>) => void;
}) {
  const condition = data.condition ?? { field: "", operator: "eq" as const, value: "" };

  function updateCondition(patch: Partial<ConditionConfig>) {
    onUpdate({ condition: { ...condition, ...patch } });
  }

  return (
    <div className="space-y-3">
      <Separator />
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Condition
      </p>
      <div className="space-y-1.5">
        <Label htmlFor="cond-field">Field path</Label>
        <Input
          id="cond-field"
          value={condition.field}
          onChange={(e) => updateCondition({ field: e.target.value })}
          placeholder="e.g. needs_correction"
          className="font-mono text-xs"
        />
      </div>
      <div className="space-y-1.5">
        <Label>Operator</Label>
        <Select
          value={condition.operator}
          onValueChange={(v) => updateCondition({ operator: v as ConditionConfig["operator"] })}
        >
          <SelectTrigger>
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            {CONDITION_OPERATORS.map((op) => (
              <SelectItem key={op.value} value={op.value}>
                {op.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>
      {condition.operator !== "exists" && condition.operator !== "not_exists" && (
        <div className="space-y-1.5">
          <Label htmlFor="cond-value">Value</Label>
          <Input
            id="cond-value"
            value={String(condition.value ?? "")}
            onChange={(e) => {
              const raw = e.target.value;
              let parsed: unknown = raw;
              if (raw === "true") parsed = true;
              else if (raw === "false") parsed = false;
              else if (!isNaN(Number(raw)) && raw.trim() !== "") parsed = Number(raw);
              updateCondition({ value: parsed });
            }}
            placeholder="true / false / value"
            className="font-mono text-xs"
          />
        </div>
      )}
    </div>
  );
}

function PrimitiveNodeFields({
  data,
  primitiveSlugs,
  onUpdate,
}: {
  data: FlowNodeData;
  primitiveSlugs: string[];
  onUpdate: (patch: Partial<FlowNodeData>) => void;
}) {
  const mode = data.primitiveId ? "library" : "inline";

  function switchMode(next: string) {
    if (next === "library") {
      onUpdate({ inlineInstructions: undefined, inlineModel: undefined });
    } else {
      onUpdate({ primitiveId: undefined });
    }
  }

  return (
    <div className="space-y-3">
      <Tabs value={mode} onValueChange={switchMode}>
        <TabsList className="w-full">
          <TabsTrigger value="library" className="flex-1 text-xs">
            From Library
          </TabsTrigger>
          <TabsTrigger value="inline" className="flex-1 text-xs">
            Inline
          </TabsTrigger>
        </TabsList>
      </Tabs>

      {mode === "library" ? (
        <div className="space-y-1.5">
          <Label>Primitive</Label>
          <Select
            value={data.primitiveId ?? "__none__"}
            onValueChange={(v) => onUpdate({ primitiveId: v === "__none__" ? undefined : v })}
          >
            <SelectTrigger>
              <SelectValue placeholder="Select a primitive" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="__none__">None</SelectItem>
              {primitiveSlugs.map((slug) => (
                <SelectItem key={slug} value={slug}>
                  {slug}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      ) : (
        <div className="space-y-3">
          <div className="space-y-1.5">
            <Label htmlFor="prim-instructions">Instructions</Label>
            <Textarea
              id="prim-instructions"
              value={data.inlineInstructions ?? ""}
              onChange={(e) => onUpdate({ inlineInstructions: e.target.value || undefined })}
              placeholder="System instructions for this primitive..."
              className="min-h-[120px] text-xs font-mono"
            />
          </div>
          <div className="space-y-1.5">
            <Label>Model</Label>
            <Select
              value={data.inlineModel ?? "default"}
              onValueChange={(v) => onUpdate({ inlineModel: v as ModelPolicy })}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_MODEL_POLICIES.map((policy) => (
                  <SelectItem key={policy} value={policy}>
                    {MODEL_POLICIES[policy].label} — {MODEL_POLICIES[policy].description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
        </div>
      )}
    </div>
  );
}

function VarsPatchFields({
  data,
  orchestratorVars,
  onUpdate,
}: {
  data: FlowNodeData;
  orchestratorVars: VarDefinition[];
  onUpdate: (patch: Partial<FlowNodeData>) => void;
}) {
  const varsPatch = data.varsPatch ?? {};

  function updatePatch(outputPath: string, varKey: string) {
    const newPatch = { ...varsPatch };
    if (varKey === "__remove__") {
      delete newPatch[outputPath];
    } else {
      newPatch[outputPath] = varKey;
    }
    onUpdate({ varsPatch: Object.keys(newPatch).length > 0 ? newPatch : undefined });
  }

  function addMapping() {
    const newPatch = { ...varsPatch, "": orchestratorVars[0]?.key ?? "" };
    onUpdate({ varsPatch: newPatch });
  }

  return (
    <>
      <Separator />
      <p className="text-xs font-medium text-muted-foreground uppercase tracking-wider">
        Vars Patch
      </p>
      <p className="text-[10px] text-muted-foreground">
        Map output fields to orchestrator vars
      </p>
      {Object.entries(varsPatch).map(([outputPath, varKey], i) => (
        <div key={i} className="flex items-center gap-1">
          <Input
            className="h-6 text-xs font-mono flex-1"
            value={outputPath}
            onChange={(e) => {
              const newPatch = { ...varsPatch };
              delete newPatch[outputPath];
              newPatch[e.target.value] = varKey;
              onUpdate({ varsPatch: newPatch });
            }}
            placeholder="output.path"
          />
          <span className="text-xs text-muted-foreground">&rarr;</span>
          <Select
            value={varKey}
            onValueChange={(v) => updatePatch(outputPath, v)}
          >
            <SelectTrigger className="h-6 text-xs w-24">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {orchestratorVars.map((v) => (
                <SelectItem key={v.key} value={v.key}>
                  {v.key}
                </SelectItem>
              ))}
              <SelectItem value="__remove__">Remove</SelectItem>
            </SelectContent>
          </Select>
        </div>
      ))}
      <Button variant="outline" size="sm" className="h-6 text-[10px] w-full" onClick={addMapping}>
        + Add Mapping
      </Button>
    </>
  );
}
