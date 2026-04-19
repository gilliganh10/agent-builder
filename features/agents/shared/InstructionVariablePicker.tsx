"use client";

import { useCallback, useRef, useState } from "react";
import { Button } from "@/components/ui/button";
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from "@/components/ui/popover";
import type { EnvVarDefinition, StateFieldDefinition } from "@/db/agents/schema";
import { insertTextAtSelection } from "@/features/agents/shared/insert-text-utils";
import { cn } from "@/lib/utils";

export type VariableInsertGroups = {
  inputs: EnvVarDefinition[];
  memory: StateFieldDefinition[];
};

/** Short `{{key}}` form; session inputs win over memory when names collide at runtime. */
export function tokenForInput(key: string): string {
  return `{{${key}}}`;
}

export function tokenForMemory(key: string): string {
  return `{{${key}}}`;
}

function GroupPopover({
  label,
  items,
  onPick,
}: {
  label: string;
  items: { key: string; token: string }[];
  onPick: (token: string) => void;
}) {
  return (
    <Popover>
      <PopoverTrigger asChild>
        <Button type="button" variant="outline" size="sm" className="h-7 px-2 text-[11px]">
          + {label}
        </Button>
      </PopoverTrigger>
      <PopoverContent className="w-56 p-2" align="start">
        {items.length === 0 ? (
          <p className="px-1 py-2 text-[11px] text-muted-foreground">None defined yet.</p>
        ) : (
          <ul className="max-h-48 space-y-0.5 overflow-y-auto">
            {items.map((it) => (
              <li key={it.key}>
                <button
                  type="button"
                  className="w-full rounded px-2 py-1.5 text-left font-mono text-xs hover:bg-muted"
                  onClick={() => onPick(it.token)}
                >
                  {it.key}
                </button>
              </li>
            ))}
          </ul>
        )}
      </PopoverContent>
    </Popover>
  );
}

interface InstructionTextareaWithVariablesProps {
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
  groups: VariableInsertGroups;
  hint?: string;
  minHeightClass?: string;
}

/**
 * Textarea with insert toolbar (+ Input / + Memory) and chip row for quick inserts.
 */
export function InstructionTextareaWithVariables({
  value,
  onChange,
  placeholder,
  groups,
  hint,
  minHeightClass = "min-h-[120px]",
}: InstructionTextareaWithVariablesProps) {
  const taRef = useRef<HTMLTextAreaElement | null>(null);
  const [sel, setSel] = useState({ start: 0, end: 0 });

  const captureSel = useCallback(() => {
    const el = taRef.current;
    if (!el) return;
    setSel({ start: el.selectionStart, end: el.selectionEnd });
  }, []);

  const insert = useCallback(
    (text: string) => {
      const el = taRef.current;
      const start = el ? el.selectionStart : sel.start;
      const end = el ? el.selectionEnd : sel.end;
      const { nextValue, caret } = insertTextAtSelection(value, start, end, text);
      onChange(nextValue);
      requestAnimationFrame(() => {
        if (taRef.current) {
          taRef.current.focus();
          taRef.current.setSelectionRange(caret, caret);
          setSel({ start: caret, end: caret });
        }
      });
    },
    [onChange, sel.end, sel.start, value]
  );

  const allChips = [
    ...groups.inputs.map((v) => ({ kind: "Input" as const, key: v.key, token: tokenForInput(v.key) })),
    ...groups.memory.map((f) => ({ kind: "Memory" as const, key: f.key, token: tokenForMemory(f.key) })),
  ];

  return (
    <div className="space-y-1.5">
      <div className="flex flex-wrap items-center gap-1.5">
        <span className="text-[10px] font-medium uppercase tracking-wide text-muted-foreground">
          Insert
        </span>
        <GroupPopover
          label="Input"
          items={groups.inputs.map((v) => ({ key: v.key, token: tokenForInput(v.key) }))}
          onPick={insert}
        />
        <GroupPopover
          label="Memory"
          items={groups.memory.map((f) => ({ key: f.key, token: tokenForMemory(f.key) }))}
          onPick={insert}
        />
      </div>
      <textarea
        ref={taRef}
        value={value}
        onChange={(e) => onChange(e.target.value)}
        onSelect={captureSel}
        onKeyUp={captureSel}
        onMouseUp={captureSel}
        placeholder={placeholder}
        className={cn(
          "border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring flex w-full rounded-md border px-3 py-2 text-xs focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none disabled:cursor-not-allowed disabled:opacity-50",
          minHeightClass
        )}
      />
      {allChips.length > 0 && (
        <div className="space-y-1">
          <p className="text-[10px] font-medium text-muted-foreground">Available in instructions</p>
          <div className="flex flex-wrap gap-1">
            {allChips.map((c) => (
              <button
                key={`${c.kind}-${c.key}`}
                type="button"
                title={`${c.kind}: ${c.token}`}
                className="rounded-md bg-muted/80 px-2 py-0.5 font-mono text-[10px] text-foreground hover:bg-muted"
                onClick={() => insert(c.token)}
              >
                {c.key}
              </button>
            ))}
          </div>
        </div>
      )}
      {hint && <p className="text-[10px] text-muted-foreground">{hint}</p>}
    </div>
  );
}
