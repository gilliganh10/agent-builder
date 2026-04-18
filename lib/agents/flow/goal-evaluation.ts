import type {
  AgentGoal,
  GoalCondition,
  GoalCompletionAction,
  JSONValue,
} from "@/db/agents/schema";

export interface GoalEvaluationResult {
  goalId: string;
  goalName: string;
  achieved: boolean;
  action?: GoalCompletionAction;
}

/**
 * Evaluate all goals against the current state. Returns results for goals
 * that were newly achieved (skips those already in `achievedGoalIds`).
 */
export function evaluateGoals(
  goals: AgentGoal[],
  state: Record<string, JSONValue>,
  achievedGoalIds: Set<string>
): GoalEvaluationResult[] {
  const results: GoalEvaluationResult[] = [];

  for (const goal of goals) {
    if (achievedGoalIds.has(goal.id)) continue;

    const achieved = evaluateGoalConditions(
      goal.conditions,
      goal.conditionLogic,
      state
    );

    if (achieved) {
      results.push({
        goalId: goal.id,
        goalName: goal.name,
        achieved: true,
        action: goal.onComplete,
      });
    }
  }

  return results;
}

function evaluateGoalConditions(
  conditions: GoalCondition[],
  logic: "all" | "any",
  state: Record<string, JSONValue>
): boolean {
  if (conditions.length === 0) return false;

  if (logic === "all") {
    return conditions.every((c) => evaluateCondition(c, state));
  }
  return conditions.some((c) => evaluateCondition(c, state));
}

function evaluateCondition(
  condition: GoalCondition,
  state: Record<string, JSONValue>
): boolean {
  const value = state[condition.field];

  switch (condition.operator) {
    case "exists":
      return valueExists(value);

    case "not_exists":
      return !valueExists(value);

    case "eq":
      return looseEqual(value, condition.value);

    case "neq":
      return !looseEqual(value, condition.value);

    case "gt":
      return compareNumeric(value, condition.value) > 0;

    case "lt":
      return compareNumeric(value, condition.value) < 0;

    case "gte":
      return compareNumeric(value, condition.value) >= 0;

    case "lte":
      return compareNumeric(value, condition.value) <= 0;

    case "contains": {
      if (typeof value === "string" && typeof condition.value === "string") {
        return value.includes(condition.value);
      }
      if (Array.isArray(value)) {
        return value.some((item) => looseEqual(item, condition.value));
      }
      return false;
    }

    default:
      return false;
  }
}

function valueExists(value: JSONValue | undefined): boolean {
  if (value === null || value === undefined) return false;
  if (typeof value === "string" && value === "") return false;
  return true;
}

function looseEqual(a: JSONValue | undefined, b: JSONValue | undefined): boolean {
  if (a === b) return true;
  if (a == null || b == null) return a == b;
  if (typeof a === "number" && typeof b === "string") return a === Number(b);
  if (typeof a === "string" && typeof b === "number") return Number(a) === b;
  return JSON.stringify(a) === JSON.stringify(b);
}

function compareNumeric(
  a: JSONValue | undefined,
  b: JSONValue | undefined
): number {
  const na = typeof a === "number" ? a : Number(a);
  const nb = typeof b === "number" ? b : Number(b);
  if (isNaN(na) || isNaN(nb)) return NaN;
  return na - nb;
}
