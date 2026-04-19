"use client";

import { useState, useTransition } from "react";
import { useRouter } from "next/navigation";
import { Sparkles } from "lucide-react";
import { Button } from "@/components/ui/button";
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import { AGENT_TEMPLATES, type AgentTemplate } from "@/lib/agents/templates";
import { createAgentFromTemplate } from "./actions";

interface NewFromTemplateButtonProps {
  variant?: "default" | "outline" | "ghost";
  size?: "sm" | "default";
  label?: string;
  className?: string;
}

export function NewFromTemplateButton({
  variant = "outline",
  size = "sm",
  label = "New from template",
  className,
}: NewFromTemplateButtonProps) {
  const router = useRouter();
  const [open, setOpen] = useState(false);
  const [isPending, startTransition] = useTransition();
  const [error, setError] = useState<string | null>(null);
  const [pendingId, setPendingId] = useState<string | null>(null);

  function pickTemplate(template: AgentTemplate) {
    setError(null);
    setPendingId(template.id);
    startTransition(async () => {
      try {
        const { slug } = await createAgentFromTemplate(template.id);
        setOpen(false);
        router.push(`/agents/${slug}?tab=builder&subtab=plan`);
        router.refresh();
      } catch (err) {
        setError(err instanceof Error ? err.message : "Failed to create agent");
      } finally {
        setPendingId(null);
      }
    });
  }

  return (
    <>
      <Button
        variant={variant}
        size={size}
        onClick={() => setOpen(true)}
        className={className}
      >
        <Sparkles className="mr-1 h-4 w-4" />
        {label}
      </Button>

      <Dialog open={open} onOpenChange={setOpen}>
        <DialogContent className="max-w-lg">
          <DialogHeader>
            <DialogTitle>Start from a template</DialogTitle>
            <DialogDescription>
              Seed a new agent with a fully-wired example. You can edit everything
              afterwards.
            </DialogDescription>
          </DialogHeader>

          <ul className="space-y-2">
            {AGENT_TEMPLATES.map((template) => (
              <li key={template.id}>
                <button
                  type="button"
                  disabled={isPending}
                  onClick={() => pickTemplate(template)}
                  className="w-full rounded-lg border border-border bg-background p-3 text-left transition-colors hover:border-border/80 hover:bg-muted/50 disabled:cursor-not-allowed disabled:opacity-60"
                >
                  <div className="flex items-start justify-between gap-3">
                    <div className="min-w-0">
                      <p className="text-sm font-semibold">{template.name}</p>
                      <p className="mt-0.5 text-xs text-muted-foreground">
                        {template.tagline}
                      </p>
                    </div>
                    {pendingId === template.id && (
                      <span className="text-[10px] text-muted-foreground">
                        Creating…
                      </span>
                    )}
                  </div>
                  <p className="mt-2 text-[11px] text-muted-foreground">
                    {template.description}
                  </p>
                </button>
              </li>
            ))}
          </ul>

          {error && (
            <p className="text-xs text-destructive" role="alert">
              {error}
            </p>
          )}

          <DialogFooter>
            <Button variant="ghost" size="sm" onClick={() => setOpen(false)}>
              Cancel
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>
    </>
  );
}
