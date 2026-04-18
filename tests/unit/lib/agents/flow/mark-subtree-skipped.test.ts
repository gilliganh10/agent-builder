import { describe, expect, it } from "vitest";
import type { FlowNode } from "@/db/agents/schema";
import { markSubtreeSkipped } from "@/lib/agents/flow/executor";

function buildAdj(edges: Array<{ source: string; target: string }>): Map<string, string[]> {
  const nodes = new Set<string>();
  for (const e of edges) {
    nodes.add(e.source);
    nodes.add(e.target);
  }
  const adj = new Map<string, string[]>();
  for (const id of nodes) adj.set(id, []);
  for (const e of edges) {
    adj.get(e.source)?.push(e.target);
  }
  return adj;
}

function buildReverseAdj(edges: Array<{ source: string; target: string }>): Map<string, string[]> {
  const nodes = new Set<string>();
  for (const e of edges) {
    nodes.add(e.source);
    nodes.add(e.target);
  }
  const rev = new Map<string, string[]>();
  for (const id of nodes) rev.set(id, []);
  for (const e of edges) {
    rev.get(e.target)?.push(e.source);
  }
  return rev;
}

describe("markSubtreeSkipped", () => {
  it("does not skip a merge target that still has a completed non-skipped predecessor (project copilot diamond)", () => {
    const edges = [
      { source: "action-propose", target: "propose" },
      { source: "action-propose", target: "need-clarify" },
      { source: "need-clarify", target: "condition-answer" },
      { source: "condition-answer", target: "propose" },
      { source: "propose", target: "output-1" },
    ];
    const adj = buildAdj(edges);
    const reverseAdj = buildReverseAdj(edges);
    const nodeMap = new Map<string, FlowNode>([
      ["action-propose", { id: "action-propose", type: "condition", position: { x: 0, y: 0 }, data: {} }],
      ["need-clarify", { id: "need-clarify", type: "condition", position: { x: 0, y: 0 }, data: {} }],
      ["condition-answer", { id: "condition-answer", type: "condition", position: { x: 0, y: 0 }, data: {} }],
      ["propose", { id: "propose", type: "agent", position: { x: 0, y: 0 }, data: {} }],
      ["output-1", { id: "output-1", type: "output", position: { x: 0, y: 0 }, data: {} }],
    ]);
    const completed = new Set<string>(["action-propose"]);
    const skipped = new Set<string>();

    markSubtreeSkipped("need-clarify", adj, reverseAdj, nodeMap, completed, skipped);

    expect(skipped.has("need-clarify")).toBe(true);
    expect(skipped.has("condition-answer")).toBe(true);
    expect(skipped.has("propose")).toBe(false);
    expect(skipped.has("output-1")).toBe(false);
  });

  it("still skips a linear chain off the unused branch", () => {
    const edges = [
      { source: "c", target: "a" },
      { source: "c", target: "b" },
      { source: "b", target: "leaf" },
    ];
    const adj = buildAdj(edges);
    const reverseAdj = buildReverseAdj(edges);
    const nodeMap = new Map<string, FlowNode>([
      ["c", { id: "c", type: "condition", position: { x: 0, y: 0 }, data: {} }],
      ["a", { id: "a", type: "tool", position: { x: 0, y: 0 }, data: {} }],
      ["b", { id: "b", type: "tool", position: { x: 0, y: 0 }, data: {} }],
      ["leaf", { id: "leaf", type: "tool", position: { x: 0, y: 0 }, data: {} }],
    ]);
    const completed = new Set<string>(["c"]);
    const skipped = new Set<string>();

    markSubtreeSkipped("b", adj, reverseAdj, nodeMap, completed, skipped);

    expect(skipped.has("b")).toBe(true);
    expect(skipped.has("leaf")).toBe(true);
    expect(skipped.has("a")).toBe(false);
  });
});
