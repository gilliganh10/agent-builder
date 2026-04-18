"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { cn, formControlSurface } from "@/lib/utils";
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

export function EnvVarEditor({
  envVars,
  onChange,
}: EnvVarEditorProps) {
  function addVar() {
    const key = suggestNewEnvKey(envVars);
    onChange([
      ...envVars,
      { key, label: key, type: "string", required: false, publicEditable: false },
    ]);
  }

  function updateVar(index: number, patch: Partial<EnvVarDefinition>) {
    const updated = [...envVars];
    updated[index] = { ...updated[index], ...patch };
    onChange(updated);
  }

  function removeVar(index: number) {
    onChange(envVars.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <p className="text-xs text-muted-foreground">
          Fixed inputs (e.g. language) for a run. In step instructions use{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
            {`{{targetLanguage}}`}
          </code>{" "}
          or{" "}
          <code className="rounded bg-muted px-1 py-0.5 font-mono text-[10px]">
            {`{{env.targetLanguage}}`}
          </code>{" "}
          after renaming the key. If the same name exists in memory, the value
          here wins.
        </p>
        <Button variant="default" size="sm" className="h-8 shrink-0 text-xs" onClick={addVar}>
          Add constant
        </Button>
      </div>

      {envVars.length === 0 && (
        <p className="rounded-md border border-dashed border-border/80 bg-white/80 px-3 py-3 text-xs text-muted-foreground dark:bg-zinc-950/50">
          No constants yet. Add one to expose settings your host or chat UI can
          set before each run.
        </p>
      )}

      {envVars.map((v, i) => (
        <div
          key={i}
          className="grid grid-cols-[1fr_1fr_80px_80px_60px_24px] gap-1.5 items-center"
        >
          <Input
            className={cn("h-8 text-xs", formControlSurface)}
            value={v.key}
            onChange={(e) => updateVar(i, { key: e.target.value })}
            placeholder="e.g. targetLanguage"
          />
          <Input
            className={cn("h-8 text-xs", formControlSurface)}
            value={v.default ?? ""}
            onChange={(e) => updateVar(i, { default: e.target.value || undefined })}
            placeholder="default"
          />
          <select
            className={cn("h-8 text-[10px]", selectSurface)}
            value={v.type}
            onChange={(e) =>
              updateVar(i, { type: e.target.value as EnvVarDefinition["type"] })
            }
          >
            <option value="string">string</option>
            <option value="number">number</option>
            <option value="boolean">bool</option>
            <option value="enum">enum</option>
          </select>
          <label
            className="flex items-center gap-1 text-[10px] text-muted-foreground"
            title="Allow visitors to change this value in public chat"
          >
            <input
              type="checkbox"
              checked={v.publicEditable}
              onChange={(e) => updateVar(i, { publicEditable: e.target.checked })}
              className="h-3 w-3"
            />
            Visitor
          </label>
          <label
            className="flex items-center gap-1 text-[10px] text-muted-foreground"
            title="When set, empty values are rejected at runtime"
          >
            <input
              type="checkbox"
              checked={v.required}
              onChange={(e) => updateVar(i, { required: e.target.checked })}
              className="h-3 w-3"
            />
            Required
          </label>
          <button
            type="button"
            onClick={() => removeVar(i)}
            className="text-destructive hover:text-destructive/80 text-xs"
          >
            ×
          </button>
        </div>
      ))}
    </div>
  );
}
