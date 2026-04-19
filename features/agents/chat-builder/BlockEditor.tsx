"use client";

import { Plus, RefreshCw, Search, MessageSquare, Database, Trash2 } from "lucide-react";
import { cn } from "@/lib/utils";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { StepInspectorShell } from "@/features/agents/shared/StepInspectorShell";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type {
  MessageBlock,
  MessageBlockSettings,
  BlockAttachment,
  VarDefinition,
  ExtractBlockConfig,
  ExtractFieldSchema,
  ConditionConfig,
  GoalBlockConfig,
  GoalCondition,
  GoalCompletionAction,
  JSONValue,
} from "@/db/agents/schema";

const BLOCK_BLURBS: Record<string, string> = {
  user: "What the user just said, plus any pre-processing (rewrite, triage).",
  assistant: "What the agent replies with.",
  system: "Background instructions the agent always follows.",
  context: "Retrieved content to ground the reply.",
  extract: "Pull structured fields out of the conversation into memory.",
  branch: "Take a different path based on memory or an extracted field.",
  parallel: "Run two paths at once, then merge.",
  goal: "Mark a milestone and optionally close the conversation.",
};

const TYPE_BADGE_STYLES: Record<string, string> = {
  user: "bg-green-100 text-green-700",
  assistant: "bg-[#222E50]/10 text-[#222E50]",
  system: "bg-[#CDD5D1]/30 text-muted-foreground",
  context: "bg-[#946E83]/10 text-[#946E83]",
  extract: "bg-amber-100 text-amber-700",
  branch: "bg-[#F45B69]/10 text-[#F45B69]",
  parallel: "bg-sky-100 text-sky-800 dark:bg-sky-950/40 dark:text-sky-200",
  goal: "bg-[#946E83]/10 text-[#946E83]",
};
import { AttachmentEditor } from "./AttachmentEditor";
import { BranchInspectPanel, ParallelInspectPanel } from "./BranchParallelInspect";
import { useChatBuilder } from "@/features/agents/workspace/ChatBuilderContext";
import { useBuilderDocument } from "@/features/agents/workspace/BuilderDocumentContext";
import {
  InstructionTextareaWithVariables,
  type VariableInsertGroups,
} from "@/features/agents/shared/InstructionVariablePicker";

interface BlockEditorProps {
  block: MessageBlock;
  onUpdate: (blockId: string, patch: Partial<MessageBlock>) => void;
  onDelete: (blockId: string) => void;
  onClose: () => void;
  primitiveSlugs: string[];
  orchestratorVars: VarDefinition[];
  selectedAttachmentId: string | null;
}

function generateAttachmentId(): string {
  return `att-${Date.now()}-${Math.random().toString(36).slice(2, 6)}`;
}

interface QuickAddTemplate {
  label: string;
  icon: React.ReactNode;
  create: () => BlockAttachment;
}

function getUserQuickAdds(): QuickAddTemplate[] {
  return [
    {
      label: "Rewrite Rule",
      icon: <RefreshCw className="h-3 w-3" />,
      create: () => ({
        id: generateAttachmentId(),
        mode: "override" as const,
        label: "Rewrite Rule",
        inlinePrimitive: {
          kind: "rewriter" as const,
          instructions: "Rewrite the user's message.",
        },
      }),
    },
    {
      label: "Triage Check",
      icon: <Search className="h-3 w-3" />,
      create: () => ({
        id: generateAttachmentId(),
        mode: "after" as const,
        label: "Triage",
        inlinePrimitive: {
          kind: "researcher" as const,
          instructions: "Analyze the user message.",
        },
        outputSchema: [
          { key: "intent", type: "string", description: "Detected user intent" },
          { key: "confidence", type: "number", description: "0-1 confidence score" },
        ],
      }),
    },
  ];
}

function getAssistantQuickAdds(): QuickAddTemplate[] {
  return [
    {
      label: "Responder",
      icon: <MessageSquare className="h-3 w-3" />,
      create: () => ({
        id: generateAttachmentId(),
        mode: "before" as const,
        label: "Generate Reply",
        inlinePrimitive: {
          kind: "responder" as const,
          instructions: "Respond to the user.",
        },
        outputSchema: [
          { key: "message", type: "string", description: "The reply to show the user" },
        ],
      }),
    },
    {
      label: "State Extractor",
      icon: <Database className="h-3 w-3" />,
      create: () => ({
        id: generateAttachmentId(),
        mode: "after" as const,
        label: "Update State",
        inlinePrimitive: {
          kind: "state_extractor" as const,
          instructions: "",
        },
      }),
    },
  ];
}

export function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onClose,
  primitiveSlugs,
  orchestratorVars,
  selectedAttachmentId,
}: BlockEditorProps) {
  const { canonicalUserBlockId } = useChatBuilder();
  const { stateConfig, envVars } = useBuilderDocument();
  const variableGroups: VariableInsertGroups = {
    inputs: envVars,
    memory: stateConfig.fields,
  };
  const isUserAnchor = canonicalUserBlockId != null && block.id === canonicalUserBlockId;
  const showAttachmentSection =
    block.type !== "branch" && block.type !== "parallel" && block.type !== "goal";

  function updateSettings(patch: Partial<MessageBlockSettings>) {
    onUpdate(block.id, { settings: { ...block.settings, ...patch } });
  }

  function addAttachment() {
    const newAtt: BlockAttachment = {
      id: generateAttachmentId(),
      mode: block.type === "user" ? "after" : "before",
      label: "New Attachment",
    };
    onUpdate(block.id, { attachments: [...block.attachments, newAtt] });
  }

  function addQuickAttachment(template: QuickAddTemplate) {
    const att = template.create();
    onUpdate(block.id, { attachments: [...block.attachments, att] });
  }

  function updateAttachment(attId: string, patch: Partial<BlockAttachment>) {
    const updated = block.attachments.map((a) =>
      a.id === attId ? { ...a, ...patch } : a
    );
    onUpdate(block.id, { attachments: updated });
  }

  function removeAttachment(attId: string) {
    onUpdate(block.id, { attachments: block.attachments.filter((a) => a.id !== attId) });
  }

  const quickAdds = block.type === "user"
    ? getUserQuickAdds()
    : block.type === "assistant"
      ? getAssistantQuickAdds()
      : [];

  const badgeStyle = TYPE_BADGE_STYLES[block.type] ?? TYPE_BADGE_STYLES.system;

  return (
    <StepInspectorShell
      title={block.label || "Edit block"}
      kindBadge={block.type}
      badgeClassName={cn("font-semibold", badgeStyle)}
      blurb={BLOCK_BLURBS[block.type]}
      onClose={onClose}
      onDelete={isUserAnchor ? undefined : () => onDelete(block.id)}
      deleteLabel="Delete block"
      unstyled
    >
        <div>
          <Label className="text-[10px]">Label</Label>
          <Input
            className="h-8 text-sm"
            value={block.label}
            onChange={(e) => onUpdate(block.id, { label: e.target.value })}
          />
        </div>

        {/* Content (system, context, and assistant blocks) */}
        {(block.type === "system" || block.type === "context") && (
          <div>
            <Label className="text-[10px]">
              {block.type === "system" ? "System Instructions" : "Retrieval Description"}
            </Label>
            <InstructionTextareaWithVariables
              value={block.content ?? ""}
              onChange={(v) => onUpdate(block.id, { content: v })}
              groups={variableGroups}
              placeholder={block.type === "system" ? "Enter system prompt..." : "Describe what to retrieve..."}
              minHeightClass="min-h-[80px]"
            />
          </div>
        )}

        {block.type === "assistant" && (
          <div>
            <Label className="text-[10px]">Response Instructions (optional)</Label>
            <InstructionTextareaWithVariables
              value={block.content ?? ""}
              onChange={(v) => onUpdate(block.id, { content: v })}
              groups={variableGroups}
              placeholder="Enter response instructions... Not needed if this block has a responder attachment."
              minHeightClass="min-h-[80px]"
            />
            <p className="text-[9px] text-muted-foreground mt-1">
              Prefer a Responder attachment below for the main reply; use this field only for
              short preamble or legacy flows. Only one responder path should own the final message.
            </p>
          </div>
        )}

        {block.type === "extract" && (
          <ExtractConfigEditor
            config={block.extractConfig ?? { instructions: "", outputSchema: [] }}
            onChange={(cfg) => onUpdate(block.id, { extractConfig: cfg })}
            orchestratorVars={orchestratorVars}
            variableGroups={variableGroups}
          />
        )}

        {block.type === "branch" && (
          <BranchInspectPanel
            branchBlockId={block.id}
            config={
              block.branchConfig ?? {
                condition: { field: "result", operator: "eq", value: true },
                trueBranch: [],
                falseBranch: [],
              }
            }
            onChange={(cfg) => onUpdate(block.id, { branchConfig: cfg })}
          />
        )}

        {block.type === "parallel" && (
          <ParallelInspectPanel
            parallelBlockId={block.id}
            config={block.parallelConfig ?? { laneA: [], laneB: [] }}
          />
        )}

        {block.type === "goal" && (
          <GoalConfigEditor
            config={block.goalConfig ?? {
              goalId: `goal-${block.id}`,
              name: "",
              conditions: [],
              conditionLogic: "all",
              onComplete: { type: "close" },
            }}
            onChange={(cfg) => onUpdate(block.id, { goalConfig: cfg })}
            orchestratorVars={orchestratorVars}
            variableGroups={variableGroups}
          />
        )}

        <Separator />

        {/* Settings */}
        <div className="space-y-3">
          <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Settings</p>

          {block.type === "user" && (
            <div>
              <label className="flex items-center gap-2 text-xs">
                <input
                  type="checkbox"
                  checked={block.settings.canRewrite ?? false}
                  onChange={(e) => updateSettings({ canRewrite: e.target.checked })}
                  className="h-3.5 w-3.5"
                />
                Allow message rewriting (override)
              </label>
              <p className="text-[9px] text-muted-foreground mt-0.5 ml-5">
                Enable this to let override attachments rewrite the user&apos;s message
                before the assistant processes it.
              </p>
            </div>
          )}

          {block.type === "assistant" && (
            <>
              <div>
                <Label className="text-[10px]">Display Name</Label>
                <Input
                  className="h-7 text-xs"
                  value={block.settings.displayName ?? ""}
                  onChange={(e) => updateSettings({ displayName: e.target.value || undefined })}
                  placeholder="Agent name in chat"
                />
              </div>
              <div>
                <Label className="text-[10px]">Display Color</Label>
                <div className="flex items-center gap-2">
                  <Input
                    className="h-7 text-xs flex-1"
                    value={block.settings.displayColor ?? ""}
                    onChange={(e) => updateSettings({ displayColor: e.target.value || undefined })}
                    placeholder="#222E50"
                  />
                  {block.settings.displayColor && (
                    <div
                      className="h-7 w-7 rounded border"
                      style={{ backgroundColor: block.settings.displayColor }}
                    />
                  )}
                </div>
              </div>
              <div>
                <Label className="text-[10px]">Display Side</Label>
                <Select
                  value={block.settings.displaySide ?? "left"}
                  onValueChange={(v) => updateSettings({ displaySide: v as "left" | "right" })}
                >
                  <SelectTrigger className="h-7 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="left">Left</SelectItem>
                    <SelectItem value="right">Right</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </>
          )}

          <label className="flex items-center gap-2 text-xs">
            <input
              type="checkbox"
              checked={block.settings.persistOutput !== false}
              onChange={(e) => updateSettings({ persistOutput: e.target.checked })}
              className="h-3.5 w-3.5"
            />
            Persist output to history
          </label>
        </div>

        <Separator />

        {/* Attachments — not on branch/parallel/goal shells; configure nested steps instead */}
        {showAttachmentSection && (
        <div>
          <div className="flex items-center justify-between mb-2">
            <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Attachments</p>
            <Button variant="outline" size="sm" className="h-6 text-[10px] gap-1" onClick={addAttachment}>
              <Plus className="h-3 w-3" />
              Blank
            </Button>
          </div>

          {/* Quick Add buttons */}
          {quickAdds.length > 0 && (
            <div className="flex flex-wrap gap-1 mb-2">
              {quickAdds.map((qa) => (
                <Button
                  key={qa.label}
                  variant="outline"
                  size="sm"
                  className="h-6 text-[10px] gap-1 border-dashed"
                  onClick={() => addQuickAttachment(qa)}
                >
                  {qa.icon}
                  {qa.label}
                </Button>
              ))}
            </div>
          )}

          {block.attachments.length === 0 && (
            <p className="text-[10px] text-muted-foreground">
              {block.type === "user"
                ? "No attachments. Add a Rewrite Rule to transform the message, or a Triage Check to analyze it."
                : block.type === "assistant"
                  ? "No attachments. Add a Responder to generate the reply."
                  : "No attachments. Add primitives to define behavior."}
            </p>
          )}

          <div className="space-y-2">
            {block.attachments.map((att) => (
              <AttachmentEditor
                key={att.id}
                attachment={att}
                onChange={(patch) => updateAttachment(att.id, patch)}
                onRemove={() => removeAttachment(att.id)}
                primitiveSlugs={primitiveSlugs}
                orchestratorVars={orchestratorVars}
                blockType={block.type}
                variableGroups={variableGroups}
              />
            ))}
          </div>
        </div>
        )}

    </StepInspectorShell>
  );
}

// ---------------------------------------------------------------------------
// Extract Config Editor
// ---------------------------------------------------------------------------

function ExtractConfigEditor({
  config,
  onChange,
  orchestratorVars,
  variableGroups,
}: {
  config: ExtractBlockConfig;
  onChange: (cfg: ExtractBlockConfig) => void;
  orchestratorVars: VarDefinition[];
  variableGroups: VariableInsertGroups;
}) {
  function updateInstructions(instructions: string) {
    onChange({ ...config, instructions });
  }

  function addSchemaField() {
    const newField: ExtractFieldSchema = {
      key: `field_${config.outputSchema.length + 1}`,
      type: "string",
      description: "",
    };
    onChange({ ...config, outputSchema: [...config.outputSchema, newField] });
  }

  function updateSchemaField(index: number, patch: Partial<ExtractFieldSchema>) {
    const updated = config.outputSchema.map((f, i) =>
      i === index ? { ...f, ...patch } : f
    );
    onChange({ ...config, outputSchema: updated });
  }

  function removeSchemaField(index: number) {
    onChange({ ...config, outputSchema: config.outputSchema.filter((_, i) => i !== index) });
  }

  function toggleVarsRead(key: string) {
    const current = config.varsRead ?? [];
    const updated = current.includes(key)
      ? current.filter((k) => k !== key)
      : [...current, key];
    onChange({ ...config, varsRead: updated.length > 0 ? updated : undefined });
  }

  function updateVarsPatch(extractKey: string, stateVar: string) {
    const patch = { ...(config.varsPatch ?? {}) };
    if (stateVar) {
      patch[extractKey] = stateVar;
    } else {
      delete patch[extractKey];
    }
    onChange({ ...config, varsPatch: Object.keys(patch).length > 0 ? patch : undefined });
  }

  return (
    <div className="space-y-3">
      <p className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Extract Configuration</p>

      <div>
        <Label className="text-[10px]">Instructions</Label>
        <InstructionTextareaWithVariables
          value={config.instructions}
          onChange={updateInstructions}
          groups={variableGroups}
          placeholder="Tell the LLM what to extract from the user message..."
          minHeightClass="min-h-[60px]"
        />
      </div>

      <div>
        <div className="flex items-center justify-between mb-1.5">
          <Label className="text-[10px]">Output Schema</Label>
          <Button variant="outline" size="sm" className="h-5 text-[10px] gap-1 px-1.5" onClick={addSchemaField}>
            <Plus className="h-3 w-3" /> Field
          </Button>
        </div>

        <div className="space-y-2">
          {config.outputSchema.map((field, idx) => (
            <div key={idx} className="border rounded p-2 space-y-1.5 bg-muted/20">
              <div className="flex items-center gap-1.5">
                <Input
                  className="h-6 text-[11px] font-mono flex-1"
                  value={field.key}
                  onChange={(e) => updateSchemaField(idx, { key: e.target.value })}
                  placeholder="key"
                />
                <Select
                  value={field.type}
                  onValueChange={(v) => updateSchemaField(idx, { type: v as ExtractFieldSchema["type"] })}
                >
                  <SelectTrigger className="h-6 text-[10px] w-24">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="string">string</SelectItem>
                    <SelectItem value="number">number</SelectItem>
                    <SelectItem value="boolean">boolean</SelectItem>
                  </SelectContent>
                </Select>
                <button
                  onClick={() => removeSchemaField(idx)}
                  className="text-muted-foreground hover:text-destructive shrink-0"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </div>
              <Input
                className="h-6 text-[10px]"
                value={field.description}
                onChange={(e) => updateSchemaField(idx, { description: e.target.value })}
                placeholder="Description (helps the LLM)"
              />
            </div>
          ))}

          {config.outputSchema.length === 0 && (
            <p className="text-[10px] text-muted-foreground">No schema fields defined. Add at least one.</p>
          )}
        </div>
      </div>

      {orchestratorVars.length > 0 && (
        <>
          <div>
            <Label className="text-[10px]">Read State Vars (context for extraction)</Label>
            <div className="flex flex-wrap gap-1 mt-1">
              {orchestratorVars.map((v) => (
                <button
                  key={v.key}
                  onClick={() => toggleVarsRead(v.key)}
                  className={cn(
                    "text-[10px] px-2 py-0.5 rounded border",
                    (config.varsRead ?? []).includes(v.key)
                      ? "bg-[#222E50]/10 text-[#222E50] border-[#222E50]/30"
                      : "bg-muted/30 text-muted-foreground border-border"
                  )}
                >
                  {v.key}
                </button>
              ))}
            </div>
          </div>

          <div>
            <Label className="text-[10px]">Map to State Vars (varsPatch)</Label>
            <div className="space-y-1 mt-1">
              {config.outputSchema.map((field) => (
                <div key={field.key} className="flex items-center gap-1.5 text-[10px]">
                  <span className="font-mono text-muted-foreground w-20 truncate">{field.key}</span>
                  <span className="text-muted-foreground">&rarr;</span>
                  <Select
                    value={config.varsPatch?.[field.key] ?? "__none__"}
                    onValueChange={(v) => updateVarsPatch(field.key, v === "__none__" ? "" : v)}
                  >
                    <SelectTrigger className="h-6 text-[10px] flex-1">
                      <SelectValue placeholder="(none)" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="__none__">(none)</SelectItem>
                      {orchestratorVars.map((ov) => (
                        <SelectItem key={ov.key} value={ov.key}>{ov.key}</SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                </div>
              ))}
            </div>
          </div>
        </>
      )}

      <div>
        <Label className="text-[10px]">Model (optional)</Label>
        <Input
          className="h-7 text-xs"
          value={config.model ?? ""}
          onChange={(e) => onChange({ ...config, model: e.target.value || undefined })}
          placeholder="Default extraction model"
        />
      </div>
    </div>
  );
}

const GOAL_OPERATORS: { value: GoalCondition["operator"]; label: string }[] = [
  { value: "exists", label: "has a value" },
  { value: "not_exists", label: "is empty" },
  { value: "eq", label: "equals" },
  { value: "neq", label: "does not equal" },
  { value: "gt", label: "is greater than" },
  { value: "gte", label: "is at least" },
  { value: "lt", label: "is less than" },
  { value: "lte", label: "is at most" },
  { value: "contains", label: "contains" },
];

const NO_VALUE_OPS = new Set<GoalCondition["operator"]>(["exists", "not_exists"]);

function GoalConfigEditor({
  config,
  onChange,
  orchestratorVars,
  variableGroups,
}: {
  config: GoalBlockConfig;
  onChange: (cfg: GoalBlockConfig) => void;
  orchestratorVars: VarDefinition[];
  variableGroups: VariableInsertGroups;
}) {
  function update(patch: Partial<GoalBlockConfig>) {
    onChange({ ...config, ...patch });
  }

  function addCondition() {
    const newCond: GoalCondition = {
      field: orchestratorVars[0]?.key ?? "",
      operator: "exists",
    };
    update({ conditions: [...config.conditions, newCond] });
  }

  function updateCondition(idx: number, patch: Partial<GoalCondition>) {
    const updated = [...config.conditions];
    updated[idx] = { ...updated[idx], ...patch };
    update({ conditions: updated });
  }

  function removeCondition(idx: number) {
    update({ conditions: config.conditions.filter((_, i) => i !== idx) });
  }

  function updateAction(patch: Partial<GoalCompletionAction>) {
    update({ onComplete: { ...config.onComplete, ...patch } });
  }

  function parseValue(raw: string, fieldKey: string): JSONValue {
    const fieldDef = orchestratorVars.find((f) => f.key === fieldKey);
    if (!fieldDef) return raw;
    if (fieldDef.type === "number") {
      const n = Number(raw);
      return isNaN(n) ? raw : n;
    }
    if (fieldDef.type === "boolean") return raw === "true";
    return raw;
  }

  return (
    <div className="space-y-3">
      <div>
        <Label className="text-[10px]">Goal Name</Label>
        <Input
          className="h-7 text-xs"
          value={config.name}
          onChange={(e) => update({ name: e.target.value })}
          placeholder="e.g. Collect 3 items"
        />
      </div>

      <div>
        <Label className="text-[10px]">Description (optional)</Label>
        <Input
          className="h-7 text-xs"
          value={config.description ?? ""}
          onChange={(e) => update({ description: e.target.value })}
          placeholder="Short description"
        />
      </div>

      <Separator />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-1.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
              Done when
            </span>
            <select
              className="h-5 rounded border bg-background px-1 text-[10px]"
              value={config.conditionLogic}
              onChange={(e) => update({ conditionLogic: e.target.value as "all" | "any" })}
            >
              <option value="all">all are true</option>
              <option value="any">any is true</option>
            </select>
          </div>
          <Button variant="outline" size="sm" className="h-5 text-[10px] px-1.5" onClick={addCondition}>
            + Rule
          </Button>
        </div>

        {config.conditions.length === 0 && (
          <p className="text-[10px] text-muted-foreground italic">
            No rules yet — add one to define when this goal is met.
          </p>
        )}

        {config.conditions.map((cond, ci) => (
          <div key={ci} className="flex items-center gap-1.5">
            <select
              className="h-7 rounded-md border bg-background px-1.5 text-xs flex-1 min-w-0"
              value={cond.field}
              onChange={(e) => updateCondition(ci, { field: e.target.value })}
            >
              {orchestratorVars.length === 0 && <option value="">Add memory first</option>}
              {orchestratorVars.map((f) => (
                <option key={f.key} value={f.key}>{f.key}</option>
              ))}
            </select>

            <select
              className="h-7 rounded-md border bg-background px-1.5 text-xs w-[120px]"
              value={cond.operator}
              onChange={(e) => updateCondition(ci, { operator: e.target.value as GoalCondition["operator"] })}
            >
              {GOAL_OPERATORS.map((op) => (
                <option key={op.value} value={op.value}>{op.label}</option>
              ))}
            </select>

            {!NO_VALUE_OPS.has(cond.operator) && (
              <Input
                className="h-7 text-xs w-16"
                value={cond.value != null ? String(cond.value) : ""}
                onChange={(e) => updateCondition(ci, { value: parseValue(e.target.value, cond.field) })}
                placeholder="value"
              />
            )}

            <button
              className="h-6 w-6 flex items-center justify-center text-muted-foreground hover:text-destructive shrink-0"
              onClick={() => removeCondition(ci)}
            >
              <Trash2 className="h-3 w-3" />
            </button>
          </div>
        ))}
      </div>

      <Separator />

      <div className="space-y-1.5">
        <div className="flex items-center gap-2">
          <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Then</span>
          <select
            className="h-6 rounded-md border bg-background px-1.5 text-xs flex-1"
            value={config.onComplete.type}
            onChange={(e) => updateAction({ type: e.target.value as GoalCompletionAction["type"] })}
          >
            <option value="close">Close conversation</option>
            <option value="handoff">Hand off to another agent</option>
            <option value="message">Send a message</option>
          </select>
        </div>

        {(config.onComplete.type === "close" || config.onComplete.type === "message") && (
          <InstructionTextareaWithVariables
            value={config.onComplete.message ?? ""}
            onChange={(v) => updateAction({ message: v })}
            groups={variableGroups}
            placeholder={config.onComplete.type === "close" ? "Closing message (optional)" : "Message to send"}
            minHeightClass="min-h-[40px]"
          />
        )}

        {config.onComplete.type === "handoff" && (
          <Input
            className="h-7 text-xs font-mono"
            value={config.onComplete.handoffAgentSlug ?? ""}
            onChange={(e) => updateAction({ handoffAgentSlug: e.target.value })}
            placeholder="target-agent-slug"
          />
        )}
      </div>
    </div>
  );
}
