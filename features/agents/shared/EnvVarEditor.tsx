"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { cn, formControlSurface } from "@/lib/utils";
import { ChevronDown, Plus, Trash2 } from "lucide-react";
import type { EnvVarDefinition } from "@/db/agents/schema";

interface EnvVarEditorProps {
  envVars: EnvVarDefinition[];
  onChange: (vars: EnvVarDefinition[]) => void;
  overrides?: Record<string, string>;
  onOverrideChange?: (overrides: Record<string, string>) => void;
}

const selectSurface = cn(
  formControlSurface,
  "rounded-md border border-input px-1.5"
);

function suggestNewEnvKey(existing: EnvVarDefinition[]): string {
  const keys = new Set(existing.map((e) => e.key));
  const candidates = ["targetLanguage", "sessionMode", "featureFlag"];
  for (const c of candidates) {
    if (!keys.has(c)) return c;
  }
  let n = existing.length + 1;
  while (keys.has(`sessionInput${n}`)) n += 1;
  return `sessionInput${n}`;
}

function displayValue(
  v: EnvVarDefinition,
  overrides?: Record<string, string>
): string {
  if (overrides && v.key in overrides) return String(overrides[v.key]);
  if (v.default != null && String(v.default) !== "") return String(v.default);
  return "—";
}

export function EnvVarEditor({
  envVars,
  onChange,
  overrides,
  onOverrideChange,
}: EnvVarEditorProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function addVar() {
    const key = suggestNewEnvKey(envVars);
    const next: EnvVarDefinition[] = [
      ...envVars,
      { key, label: key, type: "string", required: false, publicEditable: false },
    ];
    onChange(next);
    setOpenIndex(next.length - 1);
  }

  function updateVar(index: number, patch: Partial<EnvVarDefinition>) {
    const updated = [...envVars];
    updated[index] = { ...updated[index], ...patch };
    onChange(updated);
  }

  function removeVar(index: number) {
    onChange(envVars.filter((_, i) => i !== index));
    setOpenIndex(null);
  }

  const editing = openIndex != null ? envVars[openIndex] : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addVar}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {envVars.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-muted/50 px-3 py-4 text-center text-xs text-muted-foreground dark:bg-muted/40">
          No inputs yet. Add one to set fixed values for each run.
        </p>
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <div className="grid grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_72px_56px_52px] gap-2 border-b border-border bg-muted/50 px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground dark:bg-muted/40">
            <span>Name</span>
            <span>Value</span>
            <span>Type</span>
            <span>Required</span>
            <span>Visible</span>
          </div>
          {envVars.map((v, i) => (
            <button
              key={`${v.key}-${i}`}
              type="button"
              className="grid w-full grid-cols-[minmax(0,1.2fr)_minmax(0,1fr)_72px_56px_52px] gap-2 border-b border-border px-2 py-2 text-left text-xs last:border-b-0 hover:bg-muted/50 dark:hover:bg-muted/30"
              onClick={() => setOpenIndex(i)}
            >
              <span className="truncate font-mono text-[11px]">{v.key || "(unnamed)"}</span>
              <span className="truncate text-muted-foreground">{displayValue(v, overrides)}</span>
              <span className="text-[11px]">{v.type}</span>
              <span className="text-[11px]">{v.required ? "yes" : "no"}</span>
              <span className="text-[11px]">{v.publicEditable ? "visitor" : "fixed"}</span>
            </button>
          ))}
        </div>
      )}

      <Sheet open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
          {editing && openIndex != null && (
            <>
              <SheetHeader>
                <SheetTitle>Edit input</SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
                <div className="space-y-1">
                  <Label className="text-xs">Key</Label>
                  <Input
                    className={cn("h-8 text-xs font-mono", formControlSurface)}
                    value={editing.key}
                    onChange={(e) => updateVar(openIndex, { key: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Label</Label>
                  <Input
                    className={cn("h-8 text-xs", formControlSurface)}
                    value={editing.label}
                    onChange={(e) => updateVar(openIndex, { label: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Default value</Label>
                  <Input
                    className={cn("h-8 text-xs", formControlSurface)}
                    value={editing.default ?? ""}
                    onChange={(e) =>
                      updateVar(openIndex, { default: e.target.value || undefined })
                    }
                  />
                  {onOverrideChange && overrides && (
                    <div className="space-y-1 pt-1">
                      <Label className="text-[10px] text-muted-foreground">
                        Override for this test run
                      </Label>
                      <Input
                        className={cn("h-8 text-xs", formControlSurface)}
                        value={overrides[editing.key] ?? ""}
                        placeholder="(use default)"
                        onChange={(e) => {
                          const next = { ...overrides };
                          if (e.target.value) next[editing.key] = e.target.value;
                          else delete next[editing.key];
                          onOverrideChange(next);
                        }}
                      />
                    </div>
                  )}
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <select
                    className={cn("h-8 w-full text-xs", selectSurface)}
                    value={editing.type}
                    onChange={(e) =>
                      updateVar(openIndex, {
                        type: e.target.value as EnvVarDefinition["type"],
                      })
                    }
                  >
                    <option value="string">string</option>
                    <option value="number">number</option>
                    <option value="boolean">boolean</option>
                    <option value="enum">enum</option>
                  </select>
                </div>
                {editing.type === "enum" && (
                  <div className="space-y-1">
                    <Label className="text-xs">Enum values (comma-separated)</Label>
                    <Input
                      className={cn("h-8 text-xs", formControlSurface)}
                      value={(editing.enumValues ?? []).join(", ")}
                      onChange={(e) =>
                        updateVar(openIndex, {
                          enumValues: e.target.value
                            .split(",")
                            .map((s) => s.trim())
                            .filter(Boolean),
                        })
                      }
                    />
                  </div>
                )}
                <div className="space-y-1">
                  <Label className="text-xs">Description (optional)</Label>
                  <Input
                    className={cn("h-8 text-xs", formControlSurface)}
                    value={editing.description ?? ""}
                    onChange={(e) =>
                      updateVar(openIndex, { description: e.target.value || undefined })
                    }
                  />
                </div>

                <Collapsible className="rounded-md border border-border/60">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium hover:bg-muted/50">
                    Advanced
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="space-y-3 border-t border-border/50 px-3 py-3">
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={editing.required}
                        onChange={(e) => updateVar(openIndex, { required: e.target.checked })}
                        className="h-3.5 w-3.5"
                      />
                      Required at runtime
                    </label>
                    <label className="flex items-center gap-2 text-xs">
                      <input
                        type="checkbox"
                        checked={editing.publicEditable}
                        onChange={(e) =>
                          updateVar(openIndex, { publicEditable: e.target.checked })
                        }
                        className="h-3.5 w-3.5"
                      />
                      Visitor can edit in public chat
                    </label>
                  </CollapsibleContent>
                </Collapsible>
              </div>
              <SheetFooter className="border-t border-border">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => removeVar(openIndex)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
