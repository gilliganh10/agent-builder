"use client";

import { X, Plus, Trash2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Separator } from "@/components/ui/separator";
import { Switch } from "@/components/ui/switch";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { OutputEditor, type OutputMode } from "@/features/agents/chat-builder/OutputEditor";
import type {
  ConditionConfig,
  ExtractFieldSchema,
  StateFieldDefinition,
} from "@/db/agents/schema";
import type {
  SimplifiedConditionStep,
  SimplifiedEndStep,
  SimplifiedMessageStep,
  SimplifiedParallelStep,
  SimplifiedStep,
  SimplifiedTransformStep,
  SimplifiedUpdateStateStep,
  SimplifiedVarMapping,
} from "@/lib/agents/studio";
import { useSimplifiedBuilder } from "./SimplifiedBuilderContext";
import { useBuilderDocument } from "@/features/agents/workspace/BuilderDocumentContext";

// ---------------------------------------------------------------------------
// Main inspector
// ---------------------------------------------------------------------------

export function SimplifiedStepInspector() {
  const { selectedStep, setSelectedStepId } = useSimplifiedBuilder();
  if (!selectedStep) return null;

  return (
    <div className="flex h-full flex-col overflow-hidden">
      <div className="flex shrink-0 items-center justify-between border-b border-border px-4 py-2">
        <div>
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            {kindTitle(selectedStep.kind)}
          </p>
          <p className="text-sm font-medium">
            {selectedStep.label || kindTitle(selectedStep.kind)}
          </p>
        </div>
        <Button
          variant="ghost"
          size="icon"
          className="h-7 w-7"
          onClick={() => setSelectedStepId(null)}
          aria-label="Close inspector"
        >
          <X className="h-4 w-4" />
        </Button>
      </div>

      <div className="flex-1 overflow-y-auto">
        <div className="space-y-4 p-4">
          <StepEditor step={selectedStep} />
        </div>
      </div>
    </div>
  );
}

function kindTitle(kind: SimplifiedStep["kind"]): string {
  switch (kind) {
    case "input":
      return "Input";
    case "message":
      return "Message";
    case "transform":
      return "Transform";
    case "update_state":
      return "Update State";
    case "condition":
      return "Condition";
    case "parallel":
      return "Parallel";
    case "end":
      return "End";
  }
}

// ---------------------------------------------------------------------------
// Dispatcher
// ---------------------------------------------------------------------------

function StepEditor({ step }: { step: SimplifiedStep }) {
  switch (step.kind) {
    case "input":
      return <InputEditor step={step} />;
    case "message":
      return <MessageTransformEditor step={step} />;
    case "transform":
      return <MessageTransformEditor step={step} />;
    case "update_state":
      return <UpdateStateEditor step={step} />;
    case "condition":
      return <ConditionEditor step={step} />;
    case "parallel":
      return <ParallelEditor step={step} />;
    case "end":
      return <EndEditor step={step} />;
  }
}

// ---------------------------------------------------------------------------
// Shared: label + instructions
// ---------------------------------------------------------------------------

function LabelField({
  value,
  onChange,
}: {
  value: string;
  onChange: (v: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Label
      </Label>
      <Input
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="h-8 text-xs"
      />
    </div>
  );
}

function InstructionsField({
  value,
  onChange,
  placeholder,
  hint,
}: {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  hint?: string;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Instructions
      </Label>
      <Textarea
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder={placeholder}
        className="min-h-[140px] text-xs"
      />
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Vars I/O editor (reads + mapping from output)
// ---------------------------------------------------------------------------

function VarsIOEditor({
  varsRead,
  varsFromOutput,
  onVarsReadChange,
  onVarsFromOutputChange,
  availableFields,
  outputKeys,
}: {
  varsRead?: string[];
  varsFromOutput?: SimplifiedVarMapping[];
  onVarsReadChange: (next: string[] | undefined) => void;
  onVarsFromOutputChange: (next: SimplifiedVarMapping[] | undefined) => void;
  availableFields: StateFieldDefinition[];
  outputKeys: string[];
}) {
  const reads = varsRead ?? [];
  const mappings = varsFromOutput ?? [];

  function toggleRead(key: string) {
    const isOn = reads.includes(key);
    const next = isOn ? reads.filter((k) => k !== key) : [...reads, key];
    onVarsReadChange(next.length > 0 ? next : undefined);
  }

  function addMapping() {
    onVarsFromOutputChange([
      ...mappings,
      { from: outputKeys[0] ?? "", to: availableFields[0]?.key ?? "" },
    ]);
  }

  function updateMapping(idx: number, patch: Partial<SimplifiedVarMapping>) {
    const next = mappings.map((m, i) => (i === idx ? { ...m, ...patch } : m));
    onVarsFromOutputChange(next);
  }

  function removeMapping(idx: number) {
    const next = mappings.filter((_, i) => i !== idx);
    onVarsFromOutputChange(next.length > 0 ? next : undefined);
  }

  return (
    <div className="space-y-3 rounded-md border border-border/60 bg-muted/20 p-3">
      <div className="space-y-1.5">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Reads memory
        </p>
        {availableFields.length === 0 ? (
          <p className="text-[10px] italic text-muted-foreground">
            Define memory fields in the overview card to reference them here.
          </p>
        ) : (
          <div className="flex flex-wrap gap-1.5">
            {availableFields.map((f) => {
              const on = reads.includes(f.key);
              return (
                <button
                  key={f.key}
                  type="button"
                  onClick={() => toggleRead(f.key)}
                  className={
                    on
                      ? "rounded-full border border-primary/40 bg-primary/10 px-2 py-0.5 text-[10px] font-medium text-primary"
                      : "rounded-full border border-border bg-background px-2 py-0.5 text-[10px] text-muted-foreground hover:text-foreground"
                  }
                >
                  {f.key}
                </button>
              );
            })}
          </div>
        )}
      </div>

      <Separator />

      <div className="space-y-1.5">
        <div className="flex items-center justify-between">
          <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Writes memory from output
          </p>
          <Button
            variant="outline"
            size="sm"
            className="h-6 gap-1 text-[10px]"
            onClick={addMapping}
            disabled={availableFields.length === 0}
          >
            <Plus className="h-3 w-3" /> Add
          </Button>
        </div>
        {mappings.length === 0 ? (
          <p className="text-[10px] italic text-muted-foreground">
            No memory writes yet.
          </p>
        ) : (
          <ul className="space-y-1.5">
            {mappings.map((m, i) => (
              <li
                key={i}
                className="flex items-center gap-1.5 rounded border bg-background p-1.5"
              >
                <Input
                  className="h-6 flex-1 font-mono text-[10px]"
                  value={m.from}
                  onChange={(e) => updateMapping(i, { from: e.target.value })}
                  placeholder="output key"
                />
                <span className="text-[10px] text-muted-foreground">→</span>
                <Select
                  value={m.to}
                  onValueChange={(v) => updateMapping(i, { to: v })}
                >
                  <SelectTrigger className="h-6 w-32 text-[10px]">
                    <SelectValue placeholder="memory field" />
                  </SelectTrigger>
                  <SelectContent>
                    {availableFields.map((f) => (
                      <SelectItem key={f.key} value={f.key}>
                        {f.key}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
                <button
                  type="button"
                  onClick={() => removeMapping(i)}
                  className="shrink-0 text-muted-foreground hover:text-destructive"
                  aria-label="Remove mapping"
                >
                  <Trash2 className="h-3 w-3" />
                </button>
              </li>
            ))}
          </ul>
        )}
      </div>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Editors
// ---------------------------------------------------------------------------

function InputEditor({ step }: { step: Extract<SimplifiedStep, { kind: "input" }> }) {
  const { updateStep } = useSimplifiedBuilder();
  return (
    <div className="space-y-4">
      <LabelField
        value={step.label}
        onChange={(v) => updateStep(step.id, { label: v })}
      />
      <p className="rounded-md bg-muted/30 p-3 text-[11px] text-muted-foreground">
        Input is always the first step — it receives the user message and
        hands it to the next step. There is nothing to configure.
      </p>
    </div>
  );
}

function MessageTransformEditor({
  step,
}: {
  step: SimplifiedMessageStep | SimplifiedTransformStep;
}) {
  const { updateStep } = useSimplifiedBuilder();
  const { stateConfig } = useBuilderDocument();

  const isTransform = step.kind === "transform";
  const outputMode: OutputMode =
    step.outputMode === "json_schema" ? "fields" : "text";

  function setOutputMode(mode: OutputMode) {
    updateStep(step.id, {
      outputMode: mode === "fields" ? "json_schema" : "text",
      ...(mode === "fields" && !step.jsonSchema?.length
        ? {
            jsonSchema: [
              { key: "reply", type: "string", description: "" },
            ],
          }
        : {}),
    });
  }

  function setJsonSchema(fields: ExtractFieldSchema[]) {
    updateStep(step.id, { jsonSchema: fields });
  }

  const outputKeys = (step.jsonSchema ?? []).map((f) => f.key);

  return (
    <div className="space-y-4">
      <LabelField
        value={step.label}
        onChange={(v) => updateStep(step.id, { label: v })}
      />

      <InstructionsField
        value={step.instructions}
        onChange={(v) => updateStep(step.id, { instructions: v })}
        placeholder={
          isTransform
            ? "Rewrite the user's message so downstream steps have a cleaner input. Use {{variableKey}} to inject working memory."
            : "Tell the model how to respond. Use {{variableKey}} or {{env.keyName}} to inject values."
        }
        hint={
          isTransform
            ? "Transform replaces the user message for every step that comes after it."
            : "Message is what the user will see in chat."
        }
      />

      <OutputEditor
        mode={outputMode}
        onModeChange={setOutputMode}
        fields={step.jsonSchema ?? []}
        onFieldsChange={setJsonSchema}
        subjectLabel={isTransform ? "transform" : "message"}
        persistenceHint={
          isTransform
            ? "Rewrittenmessage fields become the new user message downstream."
            : "Fields marked 'Primary' become the visible assistant reply."
        }
      />

      <VarsIOEditor
        varsRead={step.varsRead}
        varsFromOutput={step.varsFromOutput}
        onVarsReadChange={(v) => updateStep(step.id, { varsRead: v })}
        onVarsFromOutputChange={(v) =>
          updateStep(step.id, { varsFromOutput: v })
        }
        availableFields={stateConfig.fields}
        outputKeys={outputKeys}
      />

      <ModelField
        value={step.model}
        onChange={(v) => updateStep(step.id, { model: v })}
      />
    </div>
  );
}

function UpdateStateEditor({ step }: { step: SimplifiedUpdateStateStep }) {
  const { updateStep } = useSimplifiedBuilder();
  const { stateConfig } = useBuilderDocument();

  function setSchema(fields: ExtractFieldSchema[]) {
    updateStep(step.id, { jsonSchema: fields });
  }

  return (
    <div className="space-y-4">
      <LabelField
        value={step.label}
        onChange={(v) => updateStep(step.id, { label: v })}
      />

      <InstructionsField
        value={step.instructions ?? ""}
        onChange={(v) => updateStep(step.id, { instructions: v })}
        placeholder="Extract these fields from the conversation + latest user message."
        hint="The model looks at the full conversation and latest message, then returns JSON matching the fields below."
      />

      <OutputEditor
        mode="fields"
        modeLocked
        onModeChange={() => {}}
        fields={step.jsonSchema}
        onFieldsChange={setSchema}
        subjectLabel="extraction"
        persistenceHint="Map extracted fields into memory in the section below."
      />

      <VarsIOEditor
        varsRead={step.varsRead}
        varsFromOutput={step.varsFromOutput}
        onVarsReadChange={(v) => updateStep(step.id, { varsRead: v })}
        onVarsFromOutputChange={(v) =>
          updateStep(step.id, { varsFromOutput: v })
        }
        availableFields={stateConfig.fields}
        outputKeys={step.jsonSchema.map((f) => f.key)}
      />

      <ModelField
        value={step.model}
        onChange={(v) => updateStep(step.id, { model: v })}
      />
    </div>
  );
}

function ConditionEditor({ step }: { step: SimplifiedConditionStep }) {
  const { updateStep } = useSimplifiedBuilder();
  const { stateConfig } = useBuilderDocument();

  function patchCondition(patch: Partial<ConditionConfig>) {
    updateStep(step.id, { condition: { ...step.condition, ...patch } });
  }

  return (
    <div className="space-y-4">
      <LabelField
        value={step.label}
        onChange={(v) => updateStep(step.id, { label: v })}
      />

      <div className="space-y-1">
        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Check a memory field
        </Label>
        <Select
          value={step.condition.field}
          onValueChange={(v) => patchCondition({ field: v })}
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue placeholder="Pick a field" />
          </SelectTrigger>
          <SelectContent>
            {stateConfig.fields.length === 0 ? (
              <SelectItem disabled value="__empty">
                Define fields in the overview card first
              </SelectItem>
            ) : (
              stateConfig.fields.map((f) => (
                <SelectItem key={f.key} value={f.key}>
                  {f.key}
                </SelectItem>
              ))
            )}
          </SelectContent>
        </Select>
      </div>

      <div className="space-y-1">
        <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Operator
        </Label>
        <Select
          value={step.condition.operator}
          onValueChange={(v) =>
            patchCondition({ operator: v as ConditionConfig["operator"] })
          }
        >
          <SelectTrigger className="h-8 text-xs">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="eq">equals</SelectItem>
            <SelectItem value="neq">does not equal</SelectItem>
            <SelectItem value="contains">contains</SelectItem>
            <SelectItem value="gt">greater than</SelectItem>
            <SelectItem value="lt">less than</SelectItem>
            <SelectItem value="gte">greater than or equal</SelectItem>
            <SelectItem value="lte">less than or equal</SelectItem>
            <SelectItem value="exists">is set</SelectItem>
            <SelectItem value="not_exists">is not set</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {step.condition.operator !== "exists" &&
        step.condition.operator !== "not_exists" && (
          <div className="space-y-1">
            <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
              Value
            </Label>
            <Input
              value={valueToString(step.condition.value)}
              onChange={(e) =>
                patchCondition({ value: parseValue(e.target.value) })
              }
              className="h-8 text-xs"
              placeholder='true / false / "text" / 42'
            />
          </div>
        )}

      <p className="rounded-md bg-muted/30 p-3 text-[11px] text-muted-foreground">
        Build the Yes and No paths from the outline on the left. Each path
        runs in order and merges back after the condition.
      </p>
    </div>
  );
}

function ParallelEditor({ step }: { step: SimplifiedParallelStep }) {
  const { updateStep } = useSimplifiedBuilder();
  return (
    <div className="space-y-4">
      <LabelField
        value={step.label}
        onChange={(v) => updateStep(step.id, { label: v })}
      />
      <div className="grid grid-cols-2 gap-2">
        <div className="space-y-1">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Lane A label
          </Label>
          <Input
            value={step.laneALabel ?? ""}
            onChange={(e) =>
              updateStep(step.id, { laneALabel: e.target.value })
            }
            className="h-8 text-xs"
          />
        </div>
        <div className="space-y-1">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Lane B label
          </Label>
          <Input
            value={step.laneBLabel ?? ""}
            onChange={(e) =>
              updateStep(step.id, { laneBLabel: e.target.value })
            }
            className="h-8 text-xs"
          />
        </div>
      </div>
      <p className="rounded-md bg-muted/30 p-3 text-[11px] text-muted-foreground">
        Build each lane from the outline on the left. Both lanes run at the
        same time and merge before the next step.
      </p>
    </div>
  );
}

function EndEditor({ step }: { step: SimplifiedEndStep }) {
  const { updateStep } = useSimplifiedBuilder();
  return (
    <div className="space-y-4">
      <LabelField
        value={step.label}
        onChange={(v) => updateStep(step.id, { label: v })}
      />

      <div className="flex items-start justify-between gap-3 rounded-md border border-border/60 bg-muted/20 p-3">
        <div className="min-w-0">
          <p className="text-xs font-medium">Close the conversation</p>
          <p className="text-[10px] text-muted-foreground">
            Mark the session as done when this end is reached.
          </p>
        </div>
        <Switch
          checked={!!step.closeConversation}
          onCheckedChange={(checked) =>
            updateStep(step.id, { closeConversation: checked })
          }
        />
      </div>

      {step.closeConversation && (
        <div className="space-y-1">
          <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
            Closing message (optional)
          </Label>
          <Textarea
            value={step.closingMessage ?? ""}
            onChange={(e) =>
              updateStep(step.id, { closingMessage: e.target.value })
            }
            className="min-h-[80px] text-xs"
            placeholder="A final message to send before closing."
          />
        </div>
      )}
    </div>
  );
}

// ---------------------------------------------------------------------------
// Model picker (optional override)
// ---------------------------------------------------------------------------

function ModelField({
  value,
  onChange,
}: {
  value?: string;
  onChange: (v?: string) => void;
}) {
  return (
    <div className="space-y-1">
      <Label className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
        Model override (optional)
      </Label>
      <Input
        value={value ?? ""}
        onChange={(e) => onChange(e.target.value || undefined)}
        placeholder="e.g. gpt-4.1-mini"
        className="h-8 text-xs"
      />
      <p className="text-[10px] text-muted-foreground">
        Leave blank to use the default model for this agent.
      </p>
    </div>
  );
}

// ---------------------------------------------------------------------------
// Value helpers for Condition
// ---------------------------------------------------------------------------

function valueToString(v: unknown): string {
  if (v === undefined || v === null) return "";
  if (typeof v === "string") return v;
  return JSON.stringify(v);
}

function parseValue(raw: string): unknown {
  if (raw === "") return undefined;
  if (raw === "true") return true;
  if (raw === "false") return false;
  const n = Number(raw);
  if (!Number.isNaN(n) && raw.trim() !== "") return n;
  if (
    (raw.startsWith("\"") && raw.endsWith("\"")) ||
    raw.startsWith("{") ||
    raw.startsWith("[")
  ) {
    try {
      return JSON.parse(raw);
    } catch {
      return raw;
    }
  }
  return raw;
}
