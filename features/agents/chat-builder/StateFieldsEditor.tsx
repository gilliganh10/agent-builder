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
import type { JSONValue, StateFieldDefinition } from "@/db/agents/schema";
import { tokenForMemory } from "@/features/agents/shared/InstructionVariablePicker";

interface StateFieldsEditorProps {
  fields: StateFieldDefinition[];
  onChange: (fields: StateFieldDefinition[]) => void;
  /** Shown on each row; memory scope is configured in parent. */
  scopeLabel?: string;
}

const TYPE_LABELS: Record<StateFieldDefinition["type"], string> = {
  string: "text",
  number: "number",
  boolean: "yes/no",
  json: "json",
};

function suggestNewMemoryKey(existing: StateFieldDefinition[]): string {
  const keys = new Set(existing.map((f) => f.key));
  const candidates = ["proficiencyLevel", "topic", "itemCount"];
  for (const c of candidates) {
    if (!keys.has(c)) return c;
  }
  let n = existing.length + 1;
  while (keys.has(`memoryField${n}`)) n += 1;
  return `memoryField${n}`;
}

export function StateFieldsEditor({
  fields,
  onChange,
  scopeLabel = "conversation",
}: StateFieldsEditorProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);

  function addField() {
    const key = suggestNewMemoryKey(fields);
    const next = [...fields, { key, type: "string" as const, description: "" }];
    onChange(next);
    setOpenIndex(next.length - 1);
  }

  function updateField(index: number, patch: Partial<StateFieldDefinition>) {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...patch };
    onChange(updated);
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index));
    setOpenIndex(null);
  }

  function parseDefault(raw: string, type: StateFieldDefinition["type"]): JSONValue | undefined {
    if (raw === "") return undefined;
    switch (type) {
      case "number": {
        const n = Number(raw);
        return isNaN(n) ? undefined : n;
      }
      case "boolean":
        return raw === "true";
      case "json":
        try {
          return JSON.parse(raw);
        } catch {
          return undefined;
        }
      default:
        return raw;
    }
  }

  const editing = openIndex != null ? fields[openIndex] : null;

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addField}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add
        </Button>
      </div>

      {fields.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-muted/50 px-3 py-4 text-center text-xs text-muted-foreground dark:bg-muted/40">
          No memory fields yet. Add fields the flow can read and update.
        </p>
      ) : (
        <div className="overflow-hidden rounded-md border border-border bg-card">
          <div className="grid grid-cols-[minmax(0,1.2fr)_80px_minmax(0,1fr)] gap-2 border-b border-border bg-muted/50 px-2 py-1.5 text-[10px] font-medium uppercase tracking-wide text-muted-foreground dark:bg-muted/40">
            <span>Name</span>
            <span>Type</span>
            <span>Scope</span>
          </div>
          {fields.map((f, i) => (
            <button
              key={`${f.key}-${i}`}
              type="button"
              className="grid w-full grid-cols-[minmax(0,1.2fr)_80px_minmax(0,1fr)] gap-2 border-b border-border px-2 py-2 text-left text-xs last:border-b-0 hover:bg-muted/50 dark:hover:bg-muted/30"
              onClick={() => setOpenIndex(i)}
            >
              <span className="truncate font-mono text-[11px]">{f.key || "(unnamed)"}</span>
              <span className="text-[11px]">{TYPE_LABELS[f.type]}</span>
              <span className="truncate text-[11px] text-muted-foreground">{scopeLabel}</span>
            </button>
          ))}
        </div>
      )}

      {fields.length > 0 && (
        <div className="space-y-1 rounded-md border border-border bg-muted/40 px-2 py-2 dark:bg-muted/30">
          <p className="text-[10px] font-medium text-muted-foreground">Available in instructions</p>
          <div className="flex flex-wrap gap-1">
            {fields.map((f) => (
              <code
                key={f.key}
                className="rounded bg-muted/80 px-1.5 py-0.5 font-mono text-[10px]"
                title={tokenForMemory(f.key)}
              >
                {f.key}
              </code>
            ))}
          </div>
        </div>
      )}

      <Sheet open={openIndex !== null} onOpenChange={(o) => !o && setOpenIndex(null)}>
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
          {editing && openIndex != null && (
            <>
              <SheetHeader>
                <SheetTitle>Edit memory field</SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    className={cn("h-8 text-xs font-mono", formControlSurface)}
                    value={editing.key}
                    onChange={(e) => updateField(openIndex, { key: e.target.value })}
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Type</Label>
                  <select
                    className={cn("h-8 w-full text-xs", formControlSurface, "rounded-md border border-input px-1.5")}
                    value={editing.type}
                    onChange={(e) =>
                      updateField(openIndex, {
                        type: e.target.value as StateFieldDefinition["type"],
                      })
                    }
                  >
                    {(Object.entries(TYPE_LABELS) as [StateFieldDefinition["type"], string][]).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Initial value (optional)</Label>
                  <Input
                    className={cn("h-8 text-xs", formControlSurface)}
                    value={editing.default != null ? String(editing.default) : ""}
                    onChange={(e) =>
                      updateField(openIndex, { default: parseDefault(e.target.value, editing.type) })
                    }
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">What it tracks</Label>
                  <Input
                    className={cn("h-8 text-xs", formControlSurface)}
                    value={editing.description}
                    onChange={(e) => updateField(openIndex, { description: e.target.value })}
                  />
                </div>

                <Collapsible className="rounded-md border border-border/60">
                  <CollapsibleTrigger className="flex w-full items-center justify-between px-3 py-2 text-xs font-medium hover:bg-muted/50">
                    Advanced
                    <ChevronDown className="h-4 w-4 shrink-0 opacity-70" />
                  </CollapsibleTrigger>
                  <CollapsibleContent className="border-t border-border/50 px-3 py-3 text-[11px] text-muted-foreground">
                    Memory scope for all fields is set above (Memory scope). In instructions use{" "}
                    <code className="rounded bg-muted px-1 font-mono text-[10px]">{`{{key}}`}</code>{" "}
                    or{" "}
                    <code className="rounded bg-muted px-1 font-mono text-[10px]">{`{{vars.key}}`}</code>
                    .
                  </CollapsibleContent>
                </Collapsible>
              </div>
              <SheetFooter className="border-t border-border">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => removeField(openIndex)}
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
