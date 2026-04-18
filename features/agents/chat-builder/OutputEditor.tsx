"use client";

import { Plus, Trash2, FileText, Braces, ListTree } from "lucide-react";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import type { ExtractFieldSchema } from "@/db/agents/schema";

export type OutputMode = "text" | "fields";

interface OutputEditorProps {
  mode: OutputMode;
  onModeChange: (mode: OutputMode) => void;
  fields: ExtractFieldSchema[];
  onFieldsChange: (fields: ExtractFieldSchema[]) => void;
  subjectLabel?: string;
  modeLocked?: boolean;
  persistenceHint?: string;
}

export function OutputEditor({
  mode,
  onModeChange,
  fields,
  onFieldsChange,
  subjectLabel = "step",
  modeLocked = false,
  persistenceHint,
}: OutputEditorProps) {
  function addField() {
    const newField: ExtractFieldSchema = {
      key: `field_${fields.length + 1}`,
      type: "string",
      description: "",
      messageRole: "none",
    };
    onFieldsChange([...fields, newField]);
  }

  function updateField(index: number, patch: Partial<ExtractFieldSchema>) {
    onFieldsChange(fields.map((f, i) => (i === index ? { ...f, ...patch } : f)));
  }

  function removeField(index: number) {
    onFieldsChange(fields.filter((_, i) => i !== index));
  }

  return (
    <div className="space-y-2 rounded-md border border-border/60 bg-muted/20 p-3">
      <div className="flex items-center justify-between gap-2">
        <p className="text-[10px] font-semibold uppercase tracking-wider text-muted-foreground">
          Output
        </p>
        {!modeLocked && (
          <div className="flex items-center gap-0.5 rounded-md border bg-background p-0.5">
            <ModeButton
              active={mode === "text"}
              icon={<FileText className="h-3 w-3" />}
              label="Text"
              onClick={() => onModeChange("text")}
            />
            <ModeButton
              active={mode === "fields"}
              icon={<ListTree className="h-3 w-3" />}
              label="Fields"
              onClick={() => onModeChange("fields")}
            />
          </div>
        )}
      </div>

      {mode === "text" && (
        <p className="text-[10px] text-muted-foreground">
          This {subjectLabel} returns free text. Switch to{" "}
          <span className="font-medium">Fields</span> to define a structured JSON
          shape.
        </p>
      )}

      {mode === "fields" && (
        <>
          <div className="space-y-1.5">
            {fields.map((field, idx) => (
              <div key={idx} className="space-y-1.5 rounded border bg-background p-2">
                <div className="flex items-center gap-1.5">
                  <Input
                    className="h-6 flex-1 font-mono text-[11px]"
                    value={field.key}
                    onChange={(e) => updateField(idx, { key: e.target.value })}
                    placeholder="key"
                  />
                  <Select
                    value={field.type}
                    onValueChange={(v) =>
                      updateField(idx, { type: v as ExtractFieldSchema["type"] })
                    }
                  >
                    <SelectTrigger className="h-6 w-24 text-[10px]">
                      <SelectValue />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="string">string</SelectItem>
                      <SelectItem value="number">number</SelectItem>
                      <SelectItem value="boolean">boolean</SelectItem>
                      <SelectItem value="json">json</SelectItem>
                    </SelectContent>
                  </Select>
                  <button
                    type="button"
                    onClick={() => removeField(idx)}
                    className="shrink-0 text-muted-foreground hover:text-destructive"
                    aria-label="Remove field"
                  >
                    <Trash2 className="h-3 w-3" />
                  </button>
                </div>
                <Input
                  className="h-6 text-[10px]"
                  value={field.description}
                  onChange={(e) =>
                    updateField(idx, { description: e.target.value })
                  }
                  placeholder="What this field means (helps the model)"
                />
                <Select
                  value={field.messageRole ?? "none"}
                  onValueChange={(v) =>
                    updateField(idx, {
                      messageRole:
                        v === "none" ? "none" : (v as "primary" | "secondary"),
                    })
                  }
                >
                  <SelectTrigger className="h-6 w-[100px] text-[9px]">
                    <SelectValue placeholder="Chat" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="none">Not in chat</SelectItem>
                    <SelectItem value="primary">Primary message</SelectItem>
                    <SelectItem value="secondary">Secondary line</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            ))}
            {fields.length === 0 && (
              <p className="text-[10px] italic text-muted-foreground">
                No fields defined yet.
              </p>
            )}
          </div>

          <Button
            variant="outline"
            size="sm"
            className="h-6 w-full gap-1 text-[10px]"
            onClick={addField}
          >
            <Plus className="h-3 w-3" /> Add field
          </Button>

          {fields.length > 0 && (
            <div className="rounded border border-dashed bg-background/50 px-2 py-1.5">
              <div className="flex items-center gap-1 text-[10px] text-muted-foreground">
                <Braces className="h-3 w-3 shrink-0" />
                <span className="font-medium text-foreground">Model returns</span>
                <code className="font-mono text-[10px]">
                  {buildJsonPreview(fields)}
                </code>
              </div>
              {persistenceHint && (
                <p className="mt-1 text-[9px] text-muted-foreground">{persistenceHint}</p>
              )}
            </div>
          )}
        </>
      )}

      <Label className="block pt-1 text-[9px] italic text-muted-foreground/70">
        Runtime validation is best-effort today. Fields shape the prompt and
        document intent.
      </Label>
    </div>
  );
}

function ModeButton({
  active,
  icon,
  label,
  onClick,
}: {
  active: boolean;
  icon: React.ReactNode;
  label: string;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      onClick={onClick}
      className={cn(
        "flex items-center gap-1 rounded px-1.5 py-0.5 text-[10px] transition-colors",
        active
          ? "bg-primary/10 font-medium text-foreground"
          : "text-muted-foreground hover:text-foreground"
      )}
    >
      {icon}
      {label}
    </button>
  );
}

function buildJsonPreview(fields: ExtractFieldSchema[]): string {
  if (fields.length === 0) return "{}";
  const parts = fields.map((f) => `${f.key}: ${f.type}`);
  return `{ ${parts.join(", ")} }`;
}
