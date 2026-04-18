"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import {
  Database,
  Plus,
  Trash2,
  FileText,
  UploadCloud,
  Search,
  AlertCircle,
} from "lucide-react";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { useTenant } from "@/lib/tenant-context";
import type { AgentDefinition } from "@/db/agents/schema";

interface DatasetEntry {
  id: string;
  name: string;
  description: string;
  kind: "knowledge" | "eval" | "example";
  createdAt: string;
}

function getDatasets(agent: AgentDefinition): DatasetEntry[] {
  const raw = (agent.meta as Record<string, unknown>)?.datasets;
  if (!Array.isArray(raw)) return [];
  return raw as DatasetEntry[];
}

interface AgentDatasetTabProps {
  agent: AgentDefinition;
}

export function AgentDatasetTab({ agent }: AgentDatasetTabProps) {
  const router = useRouter();
  const { tenantSlug } = useTenant();
  const [datasets, setDatasets] = useState<DatasetEntry[]>(() => getDatasets(agent));
  const [adding, setAdding] = useState(false);
  const [saving, setSaving] = useState(false);
  const [newName, setNewName] = useState("");
  const [newDescription, setNewDescription] = useState("");
  const [newKind, setNewKind] = useState<DatasetEntry["kind"]>("knowledge");

  async function persistDatasets(updated: DatasetEntry[]) {
    setSaving(true);
    try {
      const res = await fetch(`/api/agents/${agent.slug}`, {
        method: "PUT",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          meta: { ...(agent.meta as Record<string, unknown>), datasets: updated },
          changelog: "Updated datasets",
        }),
      });
      if (res.ok) {
        router.refresh();
      }
    } finally {
      setSaving(false);
    }
  }

  function handleAdd() {
    if (!newName.trim()) return;
    const entry: DatasetEntry = {
      id: `ds-${Date.now()}`,
      name: newName.trim(),
      description: newDescription.trim(),
      kind: newKind,
      createdAt: new Date().toISOString(),
    };
    const updated = [...datasets, entry];
    setDatasets(updated);
    void persistDatasets(updated);
    setNewName("");
    setNewDescription("");
    setAdding(false);
  }

  function handleDelete(id: string) {
    const updated = datasets.filter((d) => d.id !== id);
    setDatasets(updated);
    void persistDatasets(updated);
  }

  const kindLabel: Record<DatasetEntry["kind"], { label: string; color: string }> = {
    knowledge: { label: "Knowledge", color: "text-emerald-600 border-emerald-300" },
    eval: { label: "Eval", color: "text-rose-600 border-rose-300" },
    example: { label: "Example", color: "text-blue-600 border-blue-300" },
  };

  return (
    <div className="space-y-8">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-base font-semibold">Dataset</h2>
          <p className="text-sm text-muted-foreground mt-0.5">
            Connect knowledge, evaluation inputs, or example data to this agent.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={() => setAdding(true)}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Dataset
        </Button>
      </div>

      {/* Add form */}
      {adding && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm font-medium">New Dataset Entry</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="grid gap-4 sm:grid-cols-2">
              <div className="space-y-1.5">
                <Label htmlFor="ds-name">Name</Label>
                <Input
                  id="ds-name"
                  value={newName}
                  onChange={(e) => setNewName(e.target.value)}
                  placeholder="e.g. Product Knowledge Base"
                />
              </div>
              <div className="space-y-1.5">
                <Label htmlFor="ds-kind">Type</Label>
                <select
                  id="ds-kind"
                  value={newKind}
                  onChange={(e) => setNewKind(e.target.value as DatasetEntry["kind"])}
                  className="flex h-9 w-full rounded-md border border-input bg-background px-3 py-1 text-sm"
                >
                  <option value="knowledge">Knowledge</option>
                  <option value="eval">Eval</option>
                  <option value="example">Example</option>
                </select>
              </div>
            </div>
            <div className="space-y-1.5">
              <Label htmlFor="ds-description">Description</Label>
              <Textarea
                id="ds-description"
                value={newDescription}
                onChange={(e) => setNewDescription(e.target.value)}
                placeholder="What does this dataset contain?"
                className="min-h-[80px]"
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

      {/* Dataset list */}
      {datasets.length === 0 && !adding ? (
        <EmptyDataset onAdd={() => setAdding(true)} />
      ) : (
        <div className="space-y-3">
          {datasets.map((ds) => {
            const meta = kindLabel[ds.kind];
            return (
              <Card key={ds.id}>
                <CardContent className="flex items-start gap-4 py-4">
                  <div className="rounded-md border border-border bg-muted/50 p-2">
                    <Database className="h-4 w-4 text-muted-foreground" />
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex items-center gap-2">
                      <p className="text-sm font-medium">{ds.name}</p>
                      <Badge
                        variant="outline"
                        className={`text-[10px] ${meta.color}`}
                      >
                        {meta.label}
                      </Badge>
                    </div>
                    {ds.description && (
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {ds.description}
                      </p>
                    )}
                    <p className="mt-1 text-[10px] text-muted-foreground">
                      Added {new Date(ds.createdAt).toLocaleDateString()}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                    onClick={() => handleDelete(ds.id)}
                  >
                    <Trash2 className="h-3.5 w-3.5" />
                  </Button>
                </CardContent>
              </Card>
            );
          })}
        </div>
      )}

      {/* Upload placeholder */}
      <Card className="border-dashed">
        <CardContent className="flex flex-col items-center gap-3 py-10 text-center">
          <UploadCloud className="h-8 w-8 text-muted-foreground/40" />
          <div>
            <p className="text-sm font-medium text-muted-foreground">
              File upload coming soon
            </p>
            <p className="text-xs text-muted-foreground mt-0.5">
              You'll be able to attach PDFs, markdown files, and other documents directly.
            </p>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}

function EmptyDataset({ onAdd }: { onAdd: () => void }) {
  return (
    <Card className="border-dashed">
      <CardContent className="flex flex-col items-center gap-4 py-16 text-center">
        <Database className="h-10 w-10 text-muted-foreground/30" />
        <div>
          <p className="text-sm font-medium">No datasets connected</p>
          <p className="mt-1 text-xs text-muted-foreground max-w-xs">
            Attach knowledge bases, evaluation inputs, or example data to help your agent perform better.
          </p>
        </div>
        <Button variant="outline" size="sm" onClick={onAdd}>
          <Plus className="mr-1.5 h-3.5 w-3.5" />
          Add Dataset
        </Button>
      </CardContent>
    </Card>
  );
}
