"use client";

import { useState, useTransition, useEffect } from "react";
import { useRouter } from "next/navigation";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogFooter,
} from "@/components/ui/dialog";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Checkbox } from "@/components/ui/checkbox";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAgent, updateAgent, type AgentFormValues } from "./actions";
import { useTenant } from "@/lib/tenant-context";
import {
  ALL_MODEL_POLICIES,
  MODEL_POLICIES,
  policyFromModel,
  type ModelPolicy,
} from "@/lib/agents/model-policy";
import { allToolNames } from "@/lib/agents/tool-registry";
import type { AgentDefinition } from "@/db/agents/schema";

interface AgentFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  agent?: AgentDefinition;
}

const EMPTY_FORM: AgentFormValues = {
  name: "",
  slug: "",
  description: "",
  instructions: "",
  allowedTools: [],
  modelPolicy: "default",
  changelog: "",
};

function agentToForm(a: AgentDefinition): AgentFormValues {
  return {
    name: a.name,
    slug: a.slug,
    description: a.description,
    instructions: a.instructions,
    allowedTools: a.allowedTools,
    modelPolicy: policyFromModel(a.defaultModel),
    changelog: "",
  };
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export function AgentFormDialog({
  open,
  onOpenChange,
  agent,
}: AgentFormDialogProps) {
  const { tenantId } = useTenant();
  const isEdit = !!agent;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AgentFormValues>(
    agent ? agentToForm(agent) : EMPTY_FORM
  );

  const availableTools = allToolNames();

  useEffect(() => {
    if (open) {
      setForm(agent ? agentToForm(agent) : EMPTY_FORM);
      setError(null);
    }
  }, [open, agent]);

  function set<K extends keyof AgentFormValues>(
    key: K,
    value: AgentFormValues[K]
  ) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    set("name", name);
    if (!isEdit) {
      set("slug", slugify(name));
    }
  }

  function toggleTool(tool: string) {
    setForm((prev) => {
      const tools = prev.allowedTools.includes(tool)
        ? prev.allowedTools.filter((t) => t !== tool)
        : [...prev.allowedTools, tool];
      return { ...prev, allowedTools: tools };
    });
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    startTransition(async () => {
      try {
        if (isEdit && agent) {
          await updateAgent(tenantId, agent.id, form);
        } else {
          await createAgent(tenantId, form);
        }
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit Agent" : "New Agent"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Code Reviewer"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Slug</label>
            <Input
              placeholder="code-reviewer"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[60px] resize-y"
              placeholder="Brief description of what this agent does..."
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">
              System Instructions <span className="text-destructive">*</span>
            </label>
            <textarea
              required
              className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm font-mono ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 min-h-[160px] resize-y"
              placeholder="You are an AI assistant that..."
              value={form.instructions}
              onChange={(e) => set("instructions", e.target.value)}
            />
          </div>

          <div className="space-y-2">
            <label className="text-sm font-medium">Allowed Tools</label>
            <div className="grid grid-cols-2 gap-2 rounded-md border border-input p-3">
              {availableTools.map((tool) => (
                <div key={tool} className="flex items-center space-x-2">
                  <Checkbox
                    id={`tool-${tool}`}
                    checked={form.allowedTools.includes(tool)}
                    onCheckedChange={() => toggleTool(tool)}
                  />
                  <Label
                    htmlFor={`tool-${tool}`}
                    className="text-sm font-normal cursor-pointer"
                  >
                    {tool}
                  </Label>
                </div>
              ))}
            </div>
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Model Policy</label>
            <Select
              value={form.modelPolicy}
              onValueChange={(v) => set("modelPolicy", v as ModelPolicy)}
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_MODEL_POLICIES.map((policy) => (
                  <SelectItem key={policy} value={policy}>
                    {MODEL_POLICIES[policy].label} &mdash;{" "}
                    {MODEL_POLICIES[policy].description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {isEdit && (
            <div className="space-y-1">
              <label className="text-sm font-medium">
                Changelog <span className="text-destructive">*</span>
              </label>
              <Input
                required={isEdit}
                placeholder="What changed in this version?"
                value={form.changelog ?? ""}
                onChange={(e) => set("changelog", e.target.value)}
              />
            </div>
          )}

          {error && <p className="text-sm text-destructive">{error}</p>}

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => onOpenChange(false)}
              disabled={isPending}
            >
              Cancel
            </Button>
            <Button type="submit" disabled={isPending}>
              {isPending
                ? isEdit
                  ? "Saving\u2026"
                  : "Creating\u2026"
                : isEdit
                  ? "Save & Version"
                  : "Create Agent"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
