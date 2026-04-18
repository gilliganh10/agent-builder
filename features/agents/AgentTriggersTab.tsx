"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Zap,
  Plus,
  Trash2,
  Globe,
  Clock,
  Webhook,
  MessageCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTenant } from "@/lib/tenant-context";
import type { AgentDefinition } from "@/db/agents/schema";

type TriggerKind = "webhook" | "schedule" | "chat" | "api";

interface TriggerEntry {
  id: string;
  name: string;
  kind: TriggerKind;
  description: string;
  active: boolean;
  createdAt: string;
}

function getTriggers(agent: AgentDefinition): TriggerEntry[] {
  const raw = (agent.meta as Record<string, unknown>)?.triggers;
  if (!Array.isArray(raw)) return [];
  return raw as TriggerEntry[];
}

const TRIGGER_KINDS: { id: TriggerKind; label: string; icon: React.ReactNode; description: string }[] = [
  {
    id: "webhook",
    label: "Webhook",
    icon: <Webhook className="h-4 w-4" />,
    description: "Trigger via HTTP POST to a unique URL",
  },
  {
    id: "schedule",
    label: "Schedule",
    icon: <Clock className="h-4 w-4" />,
    description: "Run on a cron schedule",
  },
  {
    id: "chat",
    label: "Public Chat",
    icon: <MessageCircle className="h-4 w-4" />,
    description: "Trigger from the public chat interface",
  },
  {
    id: "api",
    label: "API",
    icon: <Globe className="h-4 w-4" />,
    description: "Trigger via the internal agent run API",
  },
];

interface AgentTriggersTabProps {
  agent: AgentDefinition;
}

export function AgentTriggersTab({ agent }: AgentTriggersTabProps) {
  const router = useRouter();
  const { tenantSlug } = useTenant();
  const [triggers, setTriggers] = useState<TriggerEntry[]>(() => getTriggers(agent));
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [newKind, setNewKind] = useState<TriggerKind>("webhook");
  const [newDescription, setNewDescription] = useState("");

  async function persistTriggers(updated: TriggerEntry[]) {
    setSaving(true);
    try {
      const res = await fetch(`/api/agents/${agent.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meta: { ...(agent.meta as Record<string, unknown>), triggers: updated },
          changelog: "Updated triggers",
        }),
      });
      if (res.ok) router.refresh();
    } finally {
      setSaving(false);
    }
  }

  function handleAdd() {
    if (!newName.trim()) return;
    const entry: TriggerEntry = {
      id: `tr-${Date.now()}`,
      name: newName.trim(),
      kind: newKind,
      description: newDescription.trim(),
      active: true,
      createdAt: new Date().toISOString(),
    };
    const updated = [...triggers, entry];
    setTriggers(updated);
    void persistTriggers(updated);
    setNewName("");
    setNewDescription("");
    setAdding(false);
  }

  function handleDelete(id: string) {
    const updated = triggers.filter((t) => t.id !== id);
    setTriggers(updated);
    void persistTriggers(updated);
  }

  function toggleActive(id: string) {
    const updated = triggers.map((t) =>
      t.id === id ? { ...t, active: !t.active } : t
    );
    setTriggers(updated);
    void persistTriggers(updated);
  }

  const kindMeta = Object.fromEntries(
    TRIGGER_KINDS.map((k) => [k.id, k])
  ) as Record<TriggerKind, (typeof TRIGGER_KINDS)[number]>;

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Triggers</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Configure how and when this agent is activated.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Trigger
        </Button>
      </div>

      {/* Trigger kind picker */}
      {adding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">New Trigger</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid grid-cols-2 gap-2 sm:grid-cols-4">
              {TRIGGER_KINDS.map((k) => (
                <button
                  key={k.id}
                  onClick={() => setNewKind(k.id)}
                  className={`flex flex-col items-center gap-2 rounded-lg border p-3 text-xs transition-colors ${
                    newKind === k.id
                      ? "border-primary bg-primary/5 text-foreground"
                      : "border-border text-muted-foreground hover:border-border/80 hover:text-foreground"
                  }`}
                >
                  {k.icon}
                  <span className="font-medium">{k.label}</span>
                </button>
              ))}
            </div>

            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="tr-name">Name</Label>
                <Input
                  id="tr-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder={`e.g. ${kindMeta[newKind]?.label ?? "Trigger"} #1`}
                />
              </div>
            </div>

            <div className="space-y-1.5">
              <Label htmlFor="tr-description">Description (optional)</Label>
              <Textarea
                id="tr-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What does this trigger do?"
                className="min-h-[70px]"
              />
            </div>

            <div className="flex gap-2">
              <Button size="sm" onClick={handleAdd} disabled={!newName.trim() || saving}>
                Add
              </Button>
              <Button variant="ghost" size="sm" onClick={() => setAdding(false)}>
                Cancel
              </Button>
            </div>
          </CardContent>
        </Card>
      )}

      {/* Trigger list */}
      {triggers.length === 0 && !adding ? (
        <EmptyTriggers onAdd={() => setAdding(true)} />
      ) : (
        <div className="space-y-3">
          {triggers.map((tr) => {
            const meta = kindMeta[tr.kind];
            return (
              <Card key={tr.id}>
                <CardContent className="flex items-start gap-4 py-4">
                  <div className="rounded-md border border-border bg-muted/50 p-2 text-muted-foreground">
                    {meta?.icon ?? <Zap className="h-4 w-4" />}
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{tr.name}</p>
                      <Badge variant="outline" className="text-[10px]">
                        {meta?.label ?? tr.kind}
                      </Badge>
                      <Badge
                        variant={tr.active ? "default" : "secondary"}
                        className="text-[10px]"
                      >
                        {tr.active ? "Active" : "Inactive"}
                      </Badge>
                    </div>
                    {tr.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">{tr.description}</p>
                    )}
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Added {new Date(tr.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <div className="flex shrink-0 items-center gap-1">
                    <Button
                      variant="ghost"
                      size="sm"
                      className="h-7 text-xs"
                      onClick={() => toggleActive(tr.id)}
                    >
                      {tr.active ? "Disable" : "Enable"}
                    </Button>
                    <Button
                      variant="ghost"
                      size="icon"
                      className="h-7 w-7 text-muted-foreground hover:text-destructive"
                      onClick={() => handleDelete(tr.id)}
                    >
                      <Trash2 className="h-3.5 w-3.5" />
                    </Button>
                  </div>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}
    </div>
  );
}

function EmptyTriggers({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
        <Zap className="h-10 w-10 text-muted-foreground/30" />
        <div>
          <p className="text-sm font-medium">No triggers configured</p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            Define how this agent is activated — via webhook, schedule, or the public chat interface.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Trigger
        </Button>
      </CardContent>
    </Card>
  );
}
