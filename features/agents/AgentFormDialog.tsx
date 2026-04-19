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
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { createAgent, updateAgent, type AgentFormValues } from "./actions";
import {
  ALL_MODEL_POLICIES,
  MODEL_POLICIES,
  policyFromModel,
  type ModelPolicy,
} from "@/lib/agents/model-policy";
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
    instructions: a.instructions ?? "",
    allowedTools: Array.isArray(a.allowedTools) ? a.allowedTools : [],
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

/** Create: empty instructions/tools. Edit: preserve existing server fields. */
function toServerPayload(
  form: AgentFormValues,
  existing?: AgentDefinition
): AgentFormValues {
  if (existing) {
    return {
      ...form,
      instructions: existing.instructions ?? "",
      allowedTools: Array.isArray(existing.allowedTools) ? existing.allowedTools : [],
    };
  }
  return {
    ...form,
    instructions: "",
    allowedTools: [],
  };
}

export function AgentFormDialog({
  open,
  onOpenChange,
  agent,
}: AgentFormDialogProps) {
  const isEdit = !!agent;
  const router = useRouter();
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [form, setForm] = useState<AgentFormValues>(
    agent ? agentToForm(agent) : EMPTY_FORM
  );

  useEffect(() => {
    if (open) {
      setForm(agent ? agentToForm(agent) : EMPTY_FORM);
      setError(null);
    }
  }, [open, agent]);

  function set<K extends keyof AgentFormValues>(key: K, value: AgentFormValues[K]) {
    setForm((prev) => ({ ...prev, [key]: value }));
  }

  function handleNameChange(name: string) {
    set("name", name);
    if (!isEdit) {
      set("slug", slugify(name));
    }
  }

  function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    setError(null);

    const payload = toServerPayload(form, agent);
    if (isEdit && agent) {
      payload.changelog = form.changelog?.trim() || "Updated agent details";
    }

    startTransition(async () => {
      try {
        if (isEdit && agent) {
          await updateAgent(agent.id, payload);
          onOpenChange(false);
          router.refresh();
        } else {
          const created = await createAgent(payload);
          onOpenChange(false);
          router.push(`/agents/${created.slug}?tab=builder&subtab=plan`);
        }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Something went wrong.");
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-h-[90vh] max-w-lg overflow-y-auto">
        <DialogHeader>
          <DialogTitle>{isEdit ? "Edit agent" : "New agent"}</DialogTitle>
        </DialogHeader>

        <form onSubmit={handleSubmit} className="space-y-4 py-2">
          <div className="space-y-1">
            <label className="text-sm font-medium">
              Name <span className="text-destructive">*</span>
            </label>
            <Input
              required
              placeholder="e.g. Support assistant"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Slug</label>
            <Input
              placeholder="support-assistant"
              value={form.slug}
              onChange={(e) => set("slug", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Description</label>
            <textarea
              className="border-input bg-background ring-offset-background placeholder:text-muted-foreground focus-visible:ring-ring min-h-[72px] w-full rounded-md border px-3 py-2 text-sm focus-visible:ring-2 focus-visible:ring-offset-2 focus-visible:outline-none"
              placeholder="What this agent is for…"
              value={form.description}
              onChange={(e) => set("description", e.target.value)}
            />
          </div>

          <div className="space-y-1">
            <label className="text-sm font-medium">Model policy</label>
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
              <label className="text-sm font-medium">Changelog (optional)</label>
              <Input
                placeholder="What changed (defaults to a short message if empty)"
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
                  ? "Saving…"
                  : "Creating…"
                : isEdit
                  ? "Save"
                  : "Create"}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
