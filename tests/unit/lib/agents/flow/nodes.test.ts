import { describe, it, expect } from "vitest";
import { executeConditionNode, executeJoinNode } from "@/lib/agents/flow/nodes";
import type { FlowNode, OrchestratorState } from "@/db/agents/schema";

function makeConditionNode(field: string, operator: string, value: unknown): FlowNode {
  return {
    id: "cond-1",
    type: "condition",
    position: { x: 0, y: 0 },
    data: {
      label: "Test Condition",
      condition: { field, operator: operator as "eq" | "neq" | "contains" | "gt" | "lt" | "exists" | "not_exists", value },
    },
  };
}

function makeJoinNode(): FlowNode {
  return {
    id: "join-1",
    type: "join",
    position: { x: 0, y: 0 },
    data: { label: "Merge" },
  };
}

describe("executeConditionNode with orchestrator vars", () => {
  const orchestratorState: OrchestratorState = {
    vars: {
      style: "pirate",
      enabled: true,
      count: 5,
    },
    goals: [],
    locks: [],
  };

  it("reads vars.X from orchestratorState when field starts with vars.", () => {
    const node = makeConditionNode("vars.style", "eq", "pirate");
    const result = executeConditionNode(node, {}, orchestratorState);
    expect(result.branch).toBe("true");
  });

  it("returns false branch when vars.X does not match", () => {
    const node = makeConditionNode("vars.style", "eq", "formal");
    const result = executeConditionNode(node, {}, orchestratorState);
    expect(result.branch).toBe("false");
  });

  it("reads vars.X boolean values", () => {
    const node = makeConditionNode("vars.enabled", "eq", true);
    const result = executeConditionNode(node, {}, orchestratorState);
    expect(result.branch).toBe("true");
  });

  it("falls back to upstream output when field does not start with vars.", () => {
    const node = makeConditionNode("needs_correction", "eq", true);
    const upstream = { needs_correction: true };
    const result = executeConditionNode(node, upstream, orchestratorState);
    expect(result.branch).toBe("true");
  });

  it("falls back to upstream nested lookup when no orchestratorState provided", () => {
    const node = makeConditionNode("vars.style", "eq", "pirate");
    const result = executeConditionNode(node, { vars: { style: "pirate" } });
    expect(result.branch).toBe("true");
  });

  it("returns false when vars. field has no orchestratorState and no matching upstream", () => {
    const node = makeConditionNode("vars.style", "eq", "pirate");
    const result = executeConditionNode(node, {});
    expect(result.branch).toBe("false");
  });

  it("handles neq operator with orchestrator vars", () => {
    const node = makeConditionNode("vars.style", "neq", "formal");
    const result = executeConditionNode(node, {}, orchestratorState);
    expect(result.branch).toBe("true");
  });

  it("handles exists operator with orchestrator vars", () => {
    const node = makeConditionNode("vars.style", "exists", undefined);
    const result = executeConditionNode(node, {}, orchestratorState);
    expect(result.branch).toBe("true");
  });

  it("returns false for non-existent var with exists operator", () => {
    const node = makeConditionNode("vars.nonexistent", "exists", undefined);
    const result = executeConditionNode(node, {}, orchestratorState);
    expect(result.branch).toBe("false");
  });
});

describe("executeJoinNode promotes rewrittenMessage", () => {
  it("promotes rewrittenMessage to top-level message field", () => {
    const node = makeJoinNode();
    const branchOutputs = {
      "rewriter-1": {
        rewrittenMessage: "Arr, me hearties!",
        explanation: "Converted to pirate speak",
        _display: { name: "Pirate" },
      },
    };

    const result = executeJoinNode(node, branchOutputs);
    expect(result.message).toBe("Arr, me hearties!");
    expect(result["rewriter-1"]).toEqual(branchOutputs["rewriter-1"]);
  });

  it("preserves normal message behavior when no rewrittenMessage", () => {
    const node = makeJoinNode();
    const branchOutputs = {
      "responder-1": {
        message: "Hello there!",
        _display: { name: "Bot" },
      },
    };

    const result = executeJoinNode(node, branchOutputs);
    expect(result.messages).toEqual(["Hello there!"]);
  });

  it("handles mixed branches with condition skip and rewriter", () => {
    const node = makeJoinNode();
    const branchOutputs = {
      "rewriter-3": {
        rewrittenMessage: "Corrected message",
        explanation: "Fixed grammar",
      },
    };

    const result = executeJoinNode(node, branchOutputs);
    expect(result.message).toBe("Corrected message");
  });
});
