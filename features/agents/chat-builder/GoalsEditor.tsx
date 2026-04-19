"use client";

import { useState } from "react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import {
  Sheet,
  SheetContent,
  SheetFooter,
  SheetHeader,
  SheetTitle,
} from "@/components/ui/sheet";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn, formControlSurface } from "@/lib/utils";
import { ChevronDown, Pencil, Plus, Target, Trash2 } from "lucide-react";
import type {
  AgentGoal,
  GoalCondition,
  GoalCompletionAction,
  JSONValue,
  StateFieldDefinition,
} from "@/db/agents/schema";

interface GoalsEditorProps {
  goals: AgentGoal[];
  fields: StateFieldDefinition[];
  onChange: (goals: AgentGoal[]) => void;
}

const OPERATORS: { value: GoalCondition["operator"]; label: string }[] = [
  { value: "exists", label: "has a value" },
  { value: "not_exists", label: "is empty" },
  { value: "eq", label: "equals" },
  { value: "neq", label: "does not equal" },
  { value: "gt", label: "is greater than" },
  { value: "lt", label: "is less than" },
  { value: "gte", label: "is at least" },
  { value: "lte", label: "is at most" },
  { value: "contains", label: "contains" },
];

const NO_VALUE_OPS = new Set<GoalCondition["operator"]>(["exists", "not_exists"]);

const ACTION_LABELS: Record<GoalCompletionAction["type"], string> = {
  close: "Close conversation",
  handoff: "Hand off to another agent",
  message: "Send a message",
};

function generateGoalId(): string {
  return `goal-${Date.now()}-${Math.random().toString(36).slice(2, 5)}`;
}

export function GoalsEditor({ goals, fields, onChange }: GoalsEditorProps) {
  const [openIndex, setOpenIndex] = useState<number | null>(null);
  const [expanded, setExpanded] = useState<Set<string>>(() => new Set());

  const editing = openIndex != null ? goals[openIndex] : null;

  function addGoal() {
    const newGoal: AgentGoal = {
      id: generateGoalId(),
      name: "",
      description: "",
      conditions: [],
      conditionLogic: "all",
      onComplete: { type: "close" },
    };
    const next = [...goals, newGoal];
    onChange(next);
    setOpenIndex(next.length - 1);
  }

  function openEditSheet(index: number) {
    setOpenIndex(index);
  }

  function closeSheet() {
    setOpenIndex(null);
  }

  function updateGoal(index: number, patch: Partial<AgentGoal>) {
    const updated = [...goals];
    updated[index] = { ...updated[index], ...patch };
    onChange(updated);
  }

  function removeGoal(index: number) {
    const id = goals[index]?.id;
    onChange(goals.filter((_, i) => i !== index));
    if (openIndex === index) setOpenIndex(null);
    else if (openIndex != null && openIndex > index) setOpenIndex(openIndex - 1);
    if (id) {
      setExpanded((prev) => {
        const next = new Set(prev);
        next.delete(id);
        return next;
      });
    }
  }

  function addCondition(goalIndex: number) {
    const goal = goals[goalIndex];
    const newCondition: GoalCondition = {
      field: fields[0]?.key ?? "",
      operator: "exists",
    };
    updateGoal(goalIndex, {
      conditions: [...goal.conditions, newCondition],
    });
  }

  function updateCondition(
    goalIndex: number,
    condIndex: number,
    patch: Partial<GoalCondition>
  ) {
    const goal = goals[goalIndex];
    const conditions = [...goal.conditions];
    conditions[condIndex] = { ...conditions[condIndex], ...patch };
    updateGoal(goalIndex, { conditions });
  }

  function removeCondition(goalIndex: number, condIndex: number) {
    const goal = goals[goalIndex];
    updateGoal(goalIndex, {
      conditions: goal.conditions.filter((_, i) => i !== condIndex),
    });
  }

  function updateAction(goalIndex: number, patch: Partial<GoalCompletionAction>) {
    const goal = goals[goalIndex];
    updateGoal(goalIndex, { onComplete: { ...goal.onComplete, ...patch } });
  }

  function parseConditionValue(raw: string, fieldKey: string): JSONValue | undefined {
    const fieldDef = fields.find((f) => f.key === fieldKey);
    if (!fieldDef) return raw;
    switch (fieldDef.type) {
      case "number": {
        const n = Number(raw);
        return isNaN(n) ? raw : n;
      }
      case "boolean":
        return raw === "true";
      default:
        return raw;
    }
  }

  return (
    <div className="space-y-2">
      <div className="flex items-center justify-end">
        <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addGoal}>
          <Plus className="mr-1 h-3.5 w-3.5" />
          Add goal
        </Button>
      </div>

      <Sheet
        open={openIndex !== null}
        onOpenChange={(o) => {
          if (!o) closeSheet();
        }}
      >
        <SheetContent className="flex w-full flex-col gap-0 overflow-y-auto sm:max-w-md">
          {editing && openIndex != null && (
            <>
              <SheetHeader>
                <SheetTitle>Goal</SheetTitle>
              </SheetHeader>
              <div className="flex flex-1 flex-col gap-3 px-4 pb-4">
                <div className="space-y-1">
                  <Label className="text-xs">Name</Label>
                  <Input
                    className={cn("h-8 text-xs font-medium", formControlSurface)}
                    value={editing.name}
                    onChange={(e) => updateGoal(openIndex, { name: e.target.value })}
                    placeholder="e.g. Collect required info"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">Description (optional)</Label>
                  <Input
                    className={cn("h-8 text-xs", formControlSurface)}
                    value={editing.description}
                    onChange={(e) => updateGoal(openIndex, { description: e.target.value })}
                    placeholder="Short description"
                  />
                </div>
                <div className="space-y-1">
                  <Label className="text-xs">On completion</Label>
                  <select
                    className={cn(
                      "h-8 w-full rounded-md border border-input bg-background px-2 text-xs shadow-sm dark:bg-zinc-950",
                      formControlSurface
                    )}
                    value={editing.onComplete.type}
                    onChange={(e) =>
                      updateGoal(openIndex, {
                        onComplete: {
                          ...editing.onComplete,
                          type: e.target.value as GoalCompletionAction["type"],
                        },
                      })
                    }
                  >
                    {(Object.entries(ACTION_LABELS) as [GoalCompletionAction["type"], string][]).map(
                      ([value, label]) => (
                        <option key={value} value={value}>
                          {label}
                        </option>
                      )
                    )}
                  </select>
                </div>
              </div>
              <SheetFooter className="border-t border-border sm:flex-row sm:justify-between">
                <Button
                  type="button"
                  variant="destructive"
                  size="sm"
                  className="gap-1"
                  onClick={() => {
                    removeGoal(openIndex);
                    closeSheet();
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                  Remove
                </Button>
                <Button type="button" size="sm" onClick={closeSheet}>
                  Done
                </Button>
              </SheetFooter>
            </>
          )}
        </SheetContent>
      </Sheet>

      {goals.length === 0 ? (
        <p className="rounded-md border border-dashed border-border bg-muted/50 px-3 py-4 text-center text-xs text-muted-foreground dark:bg-muted/40">
          No goals yet. Add a goal to define when the conversation is complete.
        </p>
      ) : (
        goals.map((goal, gi) => {
          const isOpen = expanded.has(goal.id);
          const ruleCount = goal.conditions.length;
          const summaryLine = `${ruleCount} rule${ruleCount === 1 ? "" : "s"} · On completion: ${ACTION_LABELS[goal.onComplete.type]}`;

          return (
            <Collapsible
              key={goal.id}
              open={isOpen}
              onOpenChange={(open) => {
                setExpanded((prev) => {
                  const next = new Set(prev);
                  if (open) next.add(goal.id);
                  else next.delete(goal.id);
                  return next;
                });
              }}
              className="overflow-hidden rounded-lg border border-border bg-card"
            >
              <div className="flex items-start gap-2 p-2">
                <CollapsibleTrigger asChild>
                  <button
                    type="button"
                    className="flex min-w-0 flex-1 items-start gap-2 rounded-md px-1 py-0.5 text-left hover:bg-muted/50"
                  >
                    <ChevronDown
                      className={cn(
                        "mt-0.5 h-4 w-4 shrink-0 text-muted-foreground transition-transform",
                        isOpen && "rotate-180"
                      )}
                    />
                    <Target className="mt-0.5 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="min-w-0 flex-1">
                      <div className="truncate text-xs font-medium text-foreground">
                        {goal.name.trim() || "Untitled goal"}
                      </div>
                      <div className="text-[10px] text-muted-foreground">{summaryLine}</div>
                    </div>
                  </button>
                </CollapsibleTrigger>
                <Button
                  type="button"
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-foreground"
                  title="Edit name and completion"
                  onClick={(e) => {
                    e.stopPropagation();
                    openEditSheet(gi);
                  }}
                >
                  <Pencil className="h-3.5 w-3.5" />
                </Button>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 shrink-0 text-muted-foreground hover:text-destructive"
                  onClick={(e) => {
                    e.stopPropagation();
                    removeGoal(gi);
                  }}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <CollapsibleContent>
                <div className="space-y-2.5 border-t border-border px-3 pb-3 pt-2">
                  <div className="space-y-1.5">
                    <div className="flex flex-wrap items-center justify-between gap-2">
                      <div className="flex flex-wrap items-center gap-1.5">
                        <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                          Completion rule
                        </span>
                        <select
                          className={cn(
                            "h-5 rounded border border-input bg-background px-1 text-[10px] shadow-sm dark:bg-zinc-950",
                            formControlSurface
                          )}
                          value={goal.conditionLogic}
                          onChange={(e) =>
                            updateGoal(gi, { conditionLogic: e.target.value as "all" | "any" })
                          }
                        >
                          <option value="all">all are true</option>
                          <option value="any">any is true</option>
                        </select>
                      </div>
                      <Button
                        variant="outline"
                        size="sm"
                        className="h-6 text-[10px] px-2"
                        onClick={() => addCondition(gi)}
                      >
                        + Rule
                      </Button>
                    </div>

                    {goal.conditions.length === 0 && (
                      <p className="text-[10px] italic text-muted-foreground">
                        No rules yet — add rules when the goal should be satisfied.
                      </p>
                    )}

                    {goal.conditions.map((cond, ci) => (
                      <div key={ci} className="flex items-center gap-1.5">
                        <select
                          className={cn(
                            "h-8 min-w-0 flex-1 rounded-md border border-input bg-background px-1.5 text-xs shadow-sm dark:bg-zinc-950",
                            formControlSurface
                          )}
                          value={cond.field}
                          onChange={(e) => updateCondition(gi, ci, { field: e.target.value })}
                        >
                          {fields.length === 0 && (
                            <option value="">Add a memory field first</option>
                          )}
                          {fields.map((f) => (
                            <option key={f.key} value={f.key}>
                              {f.key}
                            </option>
                          ))}
                        </select>

                        <select
                          className={cn(
                            "h-8 w-[140px] shrink-0 rounded-md border border-input bg-background px-1.5 text-xs shadow-sm dark:bg-zinc-950",
                            formControlSurface
                          )}
                          value={cond.operator}
                          onChange={(e) =>
                            updateCondition(gi, ci, {
                              operator: e.target.value as GoalCondition["operator"],
                            })
                          }
                        >
                          {OPERATORS.map((op) => (
                            <option key={op.value} value={op.value}>
                              {op.label}
                            </option>
                          ))}
                        </select>

                        {!NO_VALUE_OPS.has(cond.operator) && (
                          <Input
                            className={cn("h-8 w-20 shrink-0 text-xs", formControlSurface)}
                            value={cond.value != null ? String(cond.value) : ""}
                            onChange={(e) =>
                              updateCondition(gi, ci, {
                                value: parseConditionValue(e.target.value, cond.field),
                              })
                            }
                            placeholder="value"
                          />
                        )}

                        <Button
                          variant="ghost"
                          size="icon"
                          className="h-6 w-6 shrink-0 text-muted-foreground hover:text-destructive"
                          onClick={() => removeCondition(gi, ci)}
                        >
                          <Trash2 className="h-3 w-3" />
                        </Button>
                      </div>
                    ))}
                  </div>

                  <Separator />

                  <div className="space-y-1.5">
                    {(goal.onComplete.type === "close" || goal.onComplete.type === "message") &&
                      (goal.onComplete.message || goal.onComplete.type === "message") && (
                        <Textarea
                          className={cn("min-h-[40px] text-xs", formControlSurface)}
                          value={goal.onComplete.message ?? ""}
                          onChange={(e) => updateAction(gi, { message: e.target.value })}
                          placeholder={
                            goal.onComplete.type === "close"
                              ? "Optional closing message"
                              : "Message to send"
                          }
                          rows={2}
                        />
                      )}

                    {goal.onComplete.type === "close" && !goal.onComplete.message && (
                      <button
                        type="button"
                        className="text-[10px] text-muted-foreground underline hover:text-foreground"
                        onClick={() => updateAction(gi, { message: "" })}
                      >
                        + Add closing message
                      </button>
                    )}

                    {goal.onComplete.type === "handoff" && (
                      <div className="space-y-1.5">
                        <Input
                          className={cn("h-8 font-mono text-xs", formControlSurface)}
                          value={goal.onComplete.handoffAgentSlug ?? ""}
                          onChange={(e) => updateAction(gi, { handoffAgentSlug: e.target.value })}
                          placeholder="target-agent-slug"
                        />
                        {fields.length > 0 && (
                          <div className="space-y-1">
                            <span className="text-[10px] text-muted-foreground">
                              Pass memory to next agent
                            </span>
                            {fields.map((f) => (
                              <div key={f.key} className="flex items-center gap-1.5">
                                <span className="w-24 truncate font-mono text-xs text-muted-foreground">
                                  {f.key}
                                </span>
                                <span className="text-[10px] text-muted-foreground">&rarr;</span>
                                <Input
                                  className={cn("h-8 flex-1 text-xs font-mono", formControlSurface)}
                                  value={goal.onComplete.handoffPayloadMapping?.[f.key] ?? ""}
                                  onChange={(e) => {
                                    const mapping = { ...(goal.onComplete.handoffPayloadMapping ?? {}) };
                                    if (e.target.value) {
                                      mapping[f.key] = e.target.value;
                                    } else {
                                      delete mapping[f.key];
                                    }
                                    updateAction(gi, { handoffPayloadMapping: mapping });
                                  }}
                                  placeholder="input key"
                                />
                              </div>
                            ))}
                          </div>
                        )}
                      </div>
                    )}
                  </div>
                </div>
              </CollapsibleContent>
            </Collapsible>
          );
        })
      )}
    </div>
  );
}
