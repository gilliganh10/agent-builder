"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formControlSurface } from "@/lib/utils";
import { Plus, Trash2 } from "lucide-react";
import type { StateFieldDefinition, JSONValue } from "@/db/agents/schema";

interface StateFieldsEditorProps {
  fields: StateFieldDefinition[];
  onChange: (fields: StateFieldDefinition[]) => void;
}

const TYPE_LABELS: Record<StateFieldDefinition["type"], string> = {
  string: "Text",
  number: "Number",
  boolean: "Yes / No",
  json: "Complex",
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

export function StateFieldsEditor({ fields, onChange }: StateFieldsEditorProps) {
  function addField() {
    const key = suggestNewMemoryKey(fields);
    onChange([...fields, { key, type: "string", description: "" }]);
  }

  function updateField(index: number, patch: Partial<StateFieldDefinition>) {
    const updated = [...fields];
    updated[index] = { ...updated[index], ...patch };
    onChange(updated);
  }

  function removeField(index: number) {
    onChange(fields.filter((_, i) => i !== index));
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
        try { return JSON.parse(raw); } catch { return undefined; }
      default:
        return raw;
    }
  }

  return (
    <div className="space-y-2">
      <p className="text-[11px] text-muted-foreground leading-snug">
        In responder and extract instructions, reference a field as{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
          {`{{proficiencyLevel}}`}
        </code>{" "}
        or{" "}
        <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
          {`{{vars.proficiencyLevel}}`}
        </code>
        . If a session input uses the same name, the input value wins.
      </p>
      {fields.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">
          No memory yet. Add a variable to let your agent remember things across messages.
        </p>
      ) : (
        <>
          <div className="grid grid-cols-[1fr_90px_80px_1.5fr_28px] gap-1.5 items-center px-0.5">
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Variable</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Kind</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">Starts as</span>
            <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">What it tracks</span>
            <span />
          </div>

          {fields.map((f, i) => (
            <div key={i} className="grid grid-cols-[1fr_90px_80px_1.5fr_28px] gap-1.5 items-center">
              <Input
                className={cn("h-8 text-xs font-mono", formControlSurface)}
                value={f.key}
                onChange={(e) => updateField(i, { key: e.target.value })}
                placeholder="item_count"
              />
              <select
                className={cn(
                  "h-8 rounded-md border border-input px-1.5 text-xs",
                  formControlSurface
                )}
                value={f.type}
                onChange={(e) => updateField(i, { type: e.target.value as StateFieldDefinition["type"] })}
              >
                {(Object.entries(TYPE_LABELS) as [StateFieldDefinition["type"], string][]).map(
                  ([value, label]) => (
                    <option key={value} value={value}>
                      {label}
                    </option>
                  )
                )}
              </select>
              <Input
                className={cn("h-8 text-xs", formControlSurface)}
                value={f.default != null ? String(f.default) : ""}
                onChange={(e) => updateField(i, { default: parseDefault(e.target.value, f.type) })}
                placeholder="0"
              />
              <Input
                className={cn("h-8 text-xs", formControlSurface)}
                value={f.description}
                onChange={(e) => updateField(i, { description: e.target.value })}
                placeholder="e.g. how many items the user listed"
              />
              <Button
                variant="ghost"
                size="icon"
                className="h-7 w-7 text-muted-foreground hover:text-destructive"
                onClick={() => removeField(i)}
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </>
      )}

      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addField}>
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Variable
      </Button>
    </div>
  );
}
