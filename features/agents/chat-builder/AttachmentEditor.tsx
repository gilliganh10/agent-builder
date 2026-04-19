"use client";

import { useState } from "react";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  InstructionTextareaWithVariables,
  type VariableInsertGroups,
} from "@/features/agents/shared/InstructionVariablePicker";
import { Button } from "@/components/ui/button";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import type {
  BlockAttachment,
  AttachmentMode,
  PrimitiveKind,
  VarDefinition,
  ConditionConfig,
  ExtractFieldSchema,
} from "@/db/agents/schema";
import { OutputEditor, type OutputMode } from "./OutputEditor";

interface AttachmentEditorProps {
  attachment: BlockAttachment;
  onChange: (patch: Partial<BlockAttachment>) => void;
  onRemove: () => void;
  orchestratorVars: VarDefinition[];
  blockType: string;
  variableGroups?: VariableInsertGroups;
}

const MODES: { value: AttachmentMode; label: string; hint: string }[] = [
  { value: "before", label: "Before", hint: "Runs before this block" },
  { value: "after", label: "After", hint: "Runs after this block" },
  { value: "override", label: "Override", hint: "Rewrites the user message" },
  { value: "parallel", label: "Parallel", hint: "Runs alongside other attachments" },
];

const PRIMITIVE_KINDS: { value: PrimitiveKind; label: string }[] = [
  { value: "researcher", label: "Researcher" },
  { value: "actor", label: "Actor" },
  { value: "rewriter", label: "Rewriter" },
  { value: "responder", label: "Responder" },
  { value: "eval", label: "Eval" },
  { value: "state_extractor", label: "State Extractor" },
];

function buildFieldSuggestions(orchestratorVars: VarDefinition[]): string[] {
  const suggestions: string[] = [];
  for (const v of orchestratorVars) {
    suggestions.push(`vars.${v.key}`);
  }
  suggestions.push("needs_correction", "message", "score");
  return suggestions;
}

function shouldShowOutputEditor(kind: PrimitiveKind): boolean {
  return kind !== "state_extractor" && kind !== "rewriter";
}

function suggestDefaultOutput(kind: PrimitiveKind): ExtractFieldSchema[] {
  switch (kind) {
    case "responder":
      return [{ key: "message", type: "string", description: "The reply to show to the user" }];
    case "researcher":
      return [{ key: "result", type: "string", description: "The research finding" }];
    case "eval":
      return [
        { key: "score", type: "number", description: "Numeric score (0-1)" },
        { key: "reason", type: "string", description: "Why this score" },
      ];
    case "actor":
      return [{ key: "action", type: "string", description: "What action to take" }];
    default:
      return [{ key: "value", type: "string", description: "" }];
  }
}

export function AttachmentEditor({
  attachment,
  onChange,
  onRemove,
  orchestratorVars,
  blockType,
  variableGroups,
}: AttachmentEditorProps) {
  const allowedModes = blockType === "user"
    ? MODES
    : MODES.filter((m) => m.value !== "override");

  const hasCondition = !!attachment.condition?.field;
  const [showCondition, setShowCondition] = useState(hasCondition);
  const fieldSuggestions = buildFieldSuggestions(orchestratorVars);

  return (
    <div className="space-y-3 rounded-md border border-border/60 p-3 bg-muted/20">
      <div className="flex items-center justify-between">
        <p className="text-xs font-semibold">{attachment.label || "Attachment"}</p>
        <Button variant="ghost" size="sm" className="h-6 text-[10px] text-destructive" onClick={onRemove}>
          Remove
        </Button>
      </div>

      {attachment.mode === "override" && (
        <p className="text-[9px] text-muted-foreground bg-[#222E50]/5 rounded px-2 py-1">
          Override rewrites the user&apos;s message before the assistant sees it.
          The assistant reply is not affected by the rewrite details.
        </p>
      )}

      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px]">Label</Label>
          <Input
            className="h-7 text-xs"
            value={attachment.label}
            onChange={(e) => onChange({ label: e.target.value })}
          />
        </div>
        <div>
          <Label className="text-[10px]">Mode</Label>
          <Select
            value={attachment.mode}
            onValueChange={(v) => onChange({ mode: v as AttachmentMode })}
          >
            <SelectTrigger className="h-7 text-xs">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              {allowedModes.map((m) => (
                <SelectItem key={m.value} value={m.value}>
                  <span>{m.label}</span>
                  <span className="ml-1.5 text-muted-foreground">&mdash; {m.hint}</span>
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
      </div>

      <Separator />

      {!attachment.inlinePrimitive && (
        <Button
          type="button"
          variant="secondary"
          size="sm"
          className="h-7 w-full text-[10px]"
          onClick={() =>
            onChange({
              inlinePrimitive: {
                kind: attachment.mode === "override" ? "rewriter" : "researcher",
                instructions: "",
              },
            })
          }
        >
          Configure inline step
        </Button>
      )}

      {attachment.inlinePrimitive && (
        <div className="space-y-2">
          <div>
            <Label className="text-[10px]">Kind</Label>
            <Select
              value={attachment.inlinePrimitive.kind}
              onValueChange={(v) =>
                onChange({ inlinePrimitive: { ...attachment.inlinePrimitive!, kind: v as PrimitiveKind } })
              }
            >
              <SelectTrigger className="h-7 text-xs">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {PRIMITIVE_KINDS.map((k) => (
                  <SelectItem key={k.value} value={k.value}>
                    {k.label}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {attachment.inlinePrimitive.kind === "state_extractor" ? (
            <div className="space-y-2">
              <div className="rounded-md bg-[#222E50]/5 px-2.5 py-2 text-[10px] text-muted-foreground space-y-1">
                <p className="font-medium text-foreground">Reads conversation and updates state fields</p>
                {orchestratorVars.length > 0 ? (
                  <p>
                    Tracking: {orchestratorVars.map((v) => v.key).join(", ")}
                  </p>
                ) : (
                  <p>No state fields defined. Add fields in the State Fields section above.</p>
                )}
              </div>
              <div>
                <Label className="text-[10px]">Additional Guidance (optional)</Label>
                {variableGroups ? (
                  <InstructionTextareaWithVariables
                    value={attachment.inlinePrimitive.instructions}
                    onChange={(v) =>
                      onChange({ inlinePrimitive: { ...attachment.inlinePrimitive!, instructions: v } })
                    }
                    groups={variableGroups}
                    placeholder="Extra instructions for the extraction LLM (optional)"
                    minHeightClass="min-h-[40px]"
                  />
                ) : (
                  <textarea
                    className="border-input bg-background min-h-[40px] w-full rounded-md border px-3 py-2 text-xs"
                    value={attachment.inlinePrimitive.instructions}
                    onChange={(e) =>
                      onChange({ inlinePrimitive: { ...attachment.inlinePrimitive!, instructions: e.target.value } })
                    }
                    placeholder="Extra instructions for the extraction LLM (optional)"
                  />
                )}
              </div>
              <div>
                <Label className="text-[10px]">Model (optional)</Label>
                <Input
                  className="h-7 text-xs"
                  value={attachment.inlinePrimitive.model ?? ""}
                  onChange={(e) =>
                    onChange({ inlinePrimitive: { ...attachment.inlinePrimitive!, model: e.target.value || undefined } })
                  }
                  placeholder="gpt-4.1-mini (default)"
                />
              </div>
            </div>
          ) : (
            <>
              <div>
                <Label className="text-[10px]">Instructions</Label>
                {variableGroups ? (
                  <InstructionTextareaWithVariables
                    value={attachment.inlinePrimitive.instructions}
                    onChange={(v) =>
                      onChange({ inlinePrimitive: { ...attachment.inlinePrimitive!, instructions: v } })
                    }
                    groups={variableGroups}
                    placeholder={
                      attachment.mode === "override"
                        ? "Rewrite the user message as a pirate."
                        : "Enter instructions for this primitive..."
                    }
                    minHeightClass="min-h-[60px]"
                  />
                ) : (
                  <textarea
                    className="border-input bg-background min-h-[60px] w-full rounded-md border px-3 py-2 text-xs"
                    value={attachment.inlinePrimitive.instructions}
                    onChange={(e) =>
                      onChange({ inlinePrimitive: { ...attachment.inlinePrimitive!, instructions: e.target.value } })
                    }
                    placeholder={
                      attachment.mode === "override"
                        ? "Rewrite the user message as a pirate."
                        : "Enter instructions for this primitive..."
                    }
                  />
                )}
              </div>

              {shouldShowOutputEditor(attachment.inlinePrimitive.kind) && (
                <OutputEditor
                  mode={
                    attachment.outputSchema && attachment.outputSchema.length > 0
                      ? "fields"
                      : "text"
                  }
                  onModeChange={(mode: OutputMode) => {
                    if (mode === "text") {
                      onChange({ outputSchema: undefined });
                    } else if (!attachment.outputSchema || attachment.outputSchema.length === 0) {
                      const seed = suggestDefaultOutput(attachment.inlinePrimitive!.kind);
                      onChange({ outputSchema: seed });
                    }
                  }}
                  fields={attachment.outputSchema ?? []}
                  onFieldsChange={(fields) =>
                    onChange({ outputSchema: fields.length > 0 ? fields : undefined })
                  }
                  subjectLabel="step"
                  persistenceHint={
                    orchestratorVars.length > 0
                      ? "Use Vars Patch below to persist any field to working memory."
                      : undefined
                  }
                />
              )}

              <div>
                <Label className="text-[10px]">Model (optional)</Label>
                <Input
                  className="h-7 text-xs"
                  value={attachment.inlinePrimitive.model ?? ""}
                  onChange={(e) =>
                    onChange({ inlinePrimitive: { ...attachment.inlinePrimitive!, model: e.target.value || undefined } })
                  }
                  placeholder="Default"
                />
              </div>
            </>
          )}
        </div>
      )}

      {/* Condition (for override mode) */}
      {attachment.mode === "override" && (
        <>
          <Separator />
          <div>
            <div className="flex items-center justify-between mb-1">
              <Label className="text-[10px]">When to apply</Label>
            </div>
            <div className="flex gap-1 mb-2">
              <Button
                variant={!showCondition ? "default" : "outline"}
                size="sm"
                className="h-6 text-[10px] flex-1"
                onClick={() => {
                  setShowCondition(false);
                  onChange({ condition: undefined });
                }}
              >
                Always
              </Button>
              <Button
                variant={showCondition ? "default" : "outline"}
                size="sm"
                className="h-6 text-[10px] flex-1"
                onClick={() => {
                  setShowCondition(true);
                  if (!attachment.condition) {
                    onChange({
                      condition: { field: "", operator: "eq", value: true },
                    });
                  }
                }}
              >
                Conditional
              </Button>
            </div>

            {showCondition && (
              <div className="space-y-1.5">
                <div>
                  <Label className="text-[9px] text-muted-foreground">Field</Label>
                  <div className="relative">
                    <Input
                      className="h-7 text-xs font-mono"
                      value={attachment.condition?.field ?? ""}
                      onChange={(e) =>
                        onChange({
                          condition: {
                            field: e.target.value,
                            operator: attachment.condition?.operator ?? "eq",
                            value: attachment.condition?.value,
                          },
                        })
                      }
                      placeholder="e.g. vars.style or needs_correction"
                      list="condition-field-suggestions"
                    />
                    <datalist id="condition-field-suggestions">
                      {fieldSuggestions.map((s) => (
                        <option key={s} value={s} />
                      ))}
                    </datalist>
                  </div>
                  {orchestratorVars.length > 0 && (
                    <div className="flex flex-wrap gap-1 mt-1">
                      {orchestratorVars.map((v) => (
                        <button
                          key={v.key}
                          className="text-[9px] px-1.5 py-0.5 rounded bg-[#222E50]/10 text-[#222E50] hover:bg-[#222E50]/20"
                          onClick={() =>
                            onChange({
                              condition: {
                                field: `vars.${v.key}`,
                                operator: attachment.condition?.operator ?? "eq",
                                value: attachment.condition?.value,
                              },
                            })
                          }
                        >
                          vars.{v.key}
                        </button>
                      ))}
                    </div>
                  )}
                </div>
                <div className="grid grid-cols-2 gap-1">
                  <div>
                    <Label className="text-[9px] text-muted-foreground">Operator</Label>
                    <Select
                      value={attachment.condition?.operator ?? "eq"}
                      onValueChange={(v) =>
                        onChange({
                          condition: {
                            field: attachment.condition?.field ?? "",
                            operator: v as ConditionConfig["operator"],
                            value: attachment.condition?.value,
                          },
                        })
                      }
                    >
                      <SelectTrigger className="h-7 text-xs">
                        <SelectValue />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="eq">equals</SelectItem>
                        <SelectItem value="neq">not equals</SelectItem>
                        <SelectItem value="exists">exists</SelectItem>
                        <SelectItem value="not_exists">not exists</SelectItem>
                        <SelectItem value="contains">contains</SelectItem>
                      </SelectContent>
                    </Select>
                  </div>
                  <div>
                    <Label className="text-[9px] text-muted-foreground">Value</Label>
                    <Input
                      className="h-7 text-xs"
                      value={attachment.condition?.value != null ? String(attachment.condition.value) : ""}
                      onChange={(e) => {
                        let val: unknown = e.target.value;
                        if (val === "true") val = true;
                        else if (val === "false") val = false;
                        else if (!isNaN(Number(val)) && val !== "") val = Number(val);
                        onChange({
                          condition: {
                            field: attachment.condition?.field ?? "",
                            operator: attachment.condition?.operator ?? "eq",
                            value: val,
                          },
                        });
                      }}
                      placeholder="value"
                    />
                  </div>
                </div>
              </div>
            )}
          </div>
        </>
      )}

      {/* Vars Patch */}
      {orchestratorVars.length > 0 && (
        <>
          <Separator />
          <div>
            <Label className="text-[10px]">Vars Patch (output field &rarr; var key)</Label>
            <div className="space-y-1 mt-1">
              {Object.entries(attachment.varsPatch ?? {}).map(([outputField, varKey], i) => (
                <div key={i} className="grid grid-cols-[1fr_1fr_24px] gap-1 items-center">
                  <Input
                    className="h-6 text-[10px] font-mono"
                    value={outputField}
                    onChange={(e) => {
                      const patch = { ...(attachment.varsPatch ?? {}) };
                      const val = patch[outputField];
                      delete patch[outputField];
                      patch[e.target.value] = val;
                      onChange({ varsPatch: patch });
                    }}
                    placeholder="output field"
                  />
                  <Select
                    value={varKey}
                    onValueChange={(v) => {
                      onChange({ varsPatch: { ...(attachment.varsPatch ?? {}), [outputField]: v } });
                    }}
                  >
                    <SelectTrigger className="h-6 text-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      {orchestratorVars.map((vd) => (
                        <SelectItem key={vd.key} value={vd.key}>
                          {vd.key}
                        </SelectItem>
                      ))}
                    </SelectContent>
                  </Select>
                  <button
                    onClick={() => {
                      const patch = { ...(attachment.varsPatch ?? {}) };
                      delete patch[outputField];
                      onChange({ varsPatch: patch });
                    }}
                    className="text-destructive text-xs"
                  >
                    x
                  </button>
                </div>
              ))}
              <Button
                variant="outline"
                size="sm"
                className="h-5 text-[10px]"
                onClick={() => {
                  const firstVar = orchestratorVars[0]?.key ?? "var";
                  onChange({ varsPatch: { ...(attachment.varsPatch ?? {}), "": firstVar } });
                }}
              >
                + Add Mapping
              </Button>
            </div>
          </div>
        </>
      )}

      {/* Display overrides */}
      <Separator />
      <div className="grid grid-cols-2 gap-2">
        <div>
          <Label className="text-[10px]">Display Name</Label>
          <Input
            className="h-7 text-xs"
            value={attachment.displayName ?? ""}
            onChange={(e) => onChange({ displayName: e.target.value || undefined })}
            placeholder="Optional"
          />
        </div>
        <div>
          <Label className="text-[10px]">Display Color</Label>
          <Input
            className="h-7 text-xs"
            value={attachment.displayColor ?? ""}
            onChange={(e) => onChange({ displayColor: e.target.value || undefined })}
            placeholder="#222E50"
          />
        </div>
      </div>
    </div>
  );
}
