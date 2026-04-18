"use client";

import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Card, CardContent } from "@/components/ui/card";
import { Separator } from "@/components/ui/separator";
import { Textarea } from "@/components/ui/textarea";
import { cn, formControlSurface } from "@/lib/utils";
import { Plus, Trash2, Target } from "lucide-react";
import type {
  AgentGoal,
  GoalCondition,
  GoalCompletionAction,
  StateFieldDefinition,
  JSONValue,
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
  function addGoal() {
    const newGoal: AgentGoal = {
      id: generateGoalId(),
      name: "",
      description: "",
      conditions: [],
      conditionLogic: "all",
      onComplete: { type: "close" },
    };
    onChange([...goals, newGoal]);
  }

  function updateGoal(index: number, patch: Partial<AgentGoal>) {
    const updated = [...goals];
    updated[index] = { ...updated[index], ...patch };
    onChange(updated);
  }

  function removeGoal(index: number) {
    onChange(goals.filter((_, i) => i !== index));
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
    <div className="space-y-3">
      {goals.length === 0 ? (
        <p className="text-xs text-muted-foreground py-2">
          No goals yet. Add a goal to define when your agent&apos;s job is done.
        </p>
      ) : (
        goals.map((goal, gi) => (
          <Card key={goal.id} className="py-0 gap-0">
            <CardContent className="p-3 space-y-2.5">
              {/* Goal name + delete */}
              <div className="flex items-start gap-2">
                <Target className="h-4 w-4 text-muted-foreground mt-1.5 shrink-0" />
                <div className="flex-1 space-y-1.5">
                  <Input
                    className={cn("h-8 text-xs font-medium", formControlSurface)}
                    value={goal.name}
                    onChange={(e) => updateGoal(gi, { name: e.target.value })}
                    placeholder="e.g. Collect all required info"
                  />
                  <Input
                    className={cn("h-8 text-xs", formControlSurface)}
                    value={goal.description}
                    onChange={(e) => updateGoal(gi, { description: e.target.value })}
                    placeholder="Short description (optional)"
                  />
                </div>
                <Button
                  variant="ghost"
                  size="icon"
                  className="h-7 w-7 text-muted-foreground hover:text-destructive shrink-0"
                  onClick={() => removeGoal(gi)}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>

              <Separator />

              {/* Conditions — when is this goal met? */}
              <div className="space-y-1.5">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-1.5">
                    <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                      Done when
                    </span>
                    <select
                      className={cn(
                        "h-5 rounded border border-input px-1 text-[10px]",
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
                    className="h-5 text-[10px] px-1.5"
                    onClick={() => addCondition(gi)}
                  >
                    + Rule
                  </Button>
                </div>

                {goal.conditions.length === 0 && (
                  <p className="text-[10px] text-muted-foreground italic">
                    No rules yet — add one to define when this goal is achieved.
                  </p>
                )}

                {goal.conditions.map((cond, ci) => (
                  <div key={ci} className="flex items-center gap-1.5">
                    <select
                      className={cn(
                        "h-8 rounded-md border border-input px-1.5 text-xs flex-1 min-w-0",
                        formControlSurface
                      )}
                      value={cond.field}
                      onChange={(e) => updateCondition(gi, ci, { field: e.target.value })}
                    >
                      {fields.length === 0 && (
                        <option value="">Add a memory variable first</option>
                      )}
                      {fields.map((f) => (
                        <option key={f.key} value={f.key}>
                          {f.key}
                        </option>
                      ))}
                    </select>

                    <select
                      className={cn(
                        "h-8 rounded-md border border-input px-1.5 text-xs w-[140px]",
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
                        className={cn("h-8 text-xs w-20", formControlSurface)}
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
                      className="h-6 w-6 text-muted-foreground hover:text-destructive shrink-0"
                      onClick={() => removeCondition(gi, ci)}
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  </div>
                ))}
              </div>

              <Separator />

              {/* Then what? — compact by default */}
              <div className="space-y-1.5">
                <div className="flex items-center gap-2">
                  <span className="text-[10px] font-medium text-muted-foreground uppercase tracking-wider">
                    Then
                  </span>
                  <select
                    className={cn(
                      "h-8 rounded-md border border-input px-1.5 text-xs flex-1",
                      formControlSurface
                    )}
                    value={goal.onComplete.type}
                    onChange={(e) =>
                      updateAction(gi, { type: e.target.value as GoalCompletionAction["type"] })
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

                {(goal.onComplete.type === "close" || goal.onComplete.type === "message") &&
                  (goal.onComplete.message || goal.onComplete.type === "message") && (
                    <Textarea
                      className={cn("text-xs min-h-[40px]", formControlSurface)}
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
                    className="text-[10px] text-muted-foreground hover:text-foreground underline"
                    onClick={() => updateAction(gi, { message: "" })}
                  >
                    + Add closing message
                  </button>
                )}

                {goal.onComplete.type === "handoff" && (
                  <div className="space-y-1.5">
                    <Input
                      className={cn("h-8 text-xs font-mono", formControlSurface)}
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
                            <span className="text-xs font-mono text-muted-foreground w-24 truncate">
                              {f.key}
                            </span>
                            <span className="text-[10px] text-muted-foreground">&rarr;</span>
                            <Input
                              className={cn(
                                "h-8 text-xs font-mono flex-1",
                                formControlSurface
                              )}
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
            </CardContent>
          </Card>
        ))
      )}

      <Button variant="outline" size="sm" className="h-7 text-xs" onClick={addGoal}>
        <Plus className="h-3.5 w-3.5 mr-1" />
        Add Goal
      </Button>
    </div>
  );
}
