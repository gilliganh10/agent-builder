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
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import {
  ALL_MODEL_POLICIES,
  MODEL_POLICIES,
  policyFromModel,
  type ModelPolicy,
} from "@/lib/agents/model-policy";
import type { PrimitiveDefinition, PrimitiveKind } from "@/db/agents/schema";
import { PRIMITIVE_KINDS } from "@/db/agents/schema";
import { useTenant } from "@/lib/tenant-context";

interface PrimitiveFormDialogProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  primitive?: PrimitiveDefinition;
}

interface FormValues {
  name: string;
  slug: string;
  kind: PrimitiveKind;
  description: string;
  instructions: string;
  modelPolicy: ModelPolicy;
}

const EMPTY_FORM: FormValues = {
  name: "",
  slug: "",
  kind: "researcher",
  description: "",
  instructions: "",
  modelPolicy: "default",
};

function toSlug(name: string) {
  return name
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/^-|-$/g, "");
}

export function PrimitiveFormDialog({
  open,
  onOpenChange,
  primitive,
}: PrimitiveFormDialogProps) {
  const router = useRouter();
  const { tenantSlug } = useTenant();
  const [isPending, startTransition] = useTransition();
  const [form, setForm] = useState<FormValues>(EMPTY_FORM);
  const [error, setError] = useState<string | null>(null);

  const isEdit = !!primitive;

  useEffect(() => {
    if (primitive) {
      setForm({
        name: primitive.name,
        slug: primitive.slug,
        kind: primitive.kind,
        description: primitive.description,
        instructions: primitive.instructions,
        modelPolicy: policyFromModel(primitive.defaultModel),
      });
    } else {
      setForm(EMPTY_FORM);
    }
    setError(null);
  }, [primitive, open]);

  function handleNameChange(name: string) {
    setForm((f) => ({
      ...f,
      name,
      ...(isEdit ? {} : { slug: toSlug(name) }),
    }));
  }

  function handleSubmit() {
    setError(null);
    startTransition(async () => {
      try {
        if (isEdit) {
          const res = await fetch(`/api/agents/primitives/${primitive.slug}`, {
            method: "PUT",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify({
              name: form.name,
              description: form.description,
              instructions: form.instructions,
              modelPolicy: form.modelPolicy,
            }),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(data.error ?? `Error ${res.status}`);
          }
        } else {
          const res = await fetch(`/api/agents/primitives`, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(form),
          });
          if (!res.ok) {
            const data = await res.json().catch(() => ({}));
            throw new Error(
              typeof data.error === "string"
                ? data.error
                : JSON.stringify(data.error) ?? `Error ${res.status}`
            );
          }
        }
        onOpenChange(false);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : String(err));
      }
    });
  }

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-lg max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle>
            {isEdit ? `Edit ${primitive.name}` : "New Primitive"}
          </DialogTitle>
        </DialogHeader>

        <div className="space-y-4 py-2">
          <div className="space-y-1.5">
            <Label htmlFor="prim-name">Name</Label>
            <Input
              id="prim-name"
              value={form.name}
              onChange={(e) => handleNameChange(e.target.value)}
              placeholder="My Researcher"
            />
          </div>

          {!isEdit && (
            <div className="space-y-1.5">
              <Label htmlFor="prim-slug">Slug</Label>
              <Input
                id="prim-slug"
                value={form.slug}
                onChange={(e) => setForm((f) => ({ ...f, slug: e.target.value }))}
                placeholder="my-researcher"
                className="font-mono text-sm"
              />
            </div>
          )}

          {!isEdit && (
            <div className="space-y-1.5">
              <Label>Kind</Label>
              <Select
                value={form.kind}
                onValueChange={(v) => setForm((f) => ({ ...f, kind: v as PrimitiveKind }))}
              >
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  {PRIMITIVE_KINDS.map((k) => (
                    <SelectItem key={k} value={k}>
                      {k.charAt(0).toUpperCase() + k.slice(1)}
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>
          )}

          <div className="space-y-1.5">
            <Label htmlFor="prim-desc">Description</Label>
            <Input
              id="prim-desc"
              value={form.description}
              onChange={(e) => setForm((f) => ({ ...f, description: e.target.value }))}
              placeholder="What this primitive does..."
            />
          </div>

          <div className="space-y-1.5">
            <Label htmlFor="prim-instructions">Instructions</Label>
            <Textarea
              id="prim-instructions"
              value={form.instructions}
              onChange={(e) => setForm((f) => ({ ...f, instructions: e.target.value }))}
              placeholder="System instructions..."
              className="min-h-[160px] font-mono text-sm"
            />
            <p className="text-[10px] text-muted-foreground">
              Supports {"{{env.KEY}}"} and {"{{vars.KEY}}"} interpolation
            </p>
          </div>

          <div className="space-y-1.5">
            <Label>Model</Label>
            <Select
              value={form.modelPolicy}
              onValueChange={(v) =>
                setForm((f) => ({ ...f, modelPolicy: v as ModelPolicy }))
              }
            >
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {ALL_MODEL_POLICIES.map((policy) => (
                  <SelectItem key={policy} value={policy}>
                    {MODEL_POLICIES[policy].label} — {MODEL_POLICIES[policy].description}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>

          {error && (
            <p className="text-sm text-destructive">{error}</p>
          )}
        </div>

        <DialogFooter>
          <Button variant="outline" onClick={() => onOpenChange(false)}>
            Cancel
          </Button>
          <Button onClick={handleSubmit} disabled={isPending || !form.name || !form.instructions}>
            {isPending ? "Saving..." : isEdit ? "Update" : "Create"}
          </Button>
        </DialogFooter>
      </DialogContent>
    </Dialog>
  );
}
