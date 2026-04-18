import type { FlowDefinition, FlowNode, FlowEdge } from "@/db/agents/schema";
import { allToolNames } from "@/lib/agents/tool-registry";

export interface ValidationError {
  nodeId?: string;
  field?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

/**
 * Validate a flow definition is a well-formed DAG with correct
 * node types, required inputs, and no cycles.
 */
export function validateFlow(
  flow: FlowDefinition,
  availableAgentSlugs: string[]
): ValidationResult {
  const errors: ValidationError[] = [];

  if (!flow.nodes.length) {
    errors.push({ message: "Flow must have at least one node" });
    return { valid: false, errors };
  }

  const nodeMap = new Map<string, FlowNode>();
  for (const node of flow.nodes) {
    if (nodeMap.has(node.id)) {
      errors.push({ nodeId: node.id, message: `Duplicate node ID: ${node.id}` });
    }
    nodeMap.set(node.id, node);
  }

  const inputNodes = flow.nodes.filter((n) => n.type === "input");
  const outputNodes = flow.nodes.filter((n) => n.type === "output");

  if (inputNodes.length !== 1) {
    errors.push({ message: `Flow must have exactly one input node (found ${inputNodes.length})` });
  }
  if (outputNodes.length !== 1) {
    errors.push({ message: `Flow must have exactly one output node (found ${outputNodes.length})` });
  }

  for (const edge of flow.edges) {
    if (!nodeMap.has(edge.source)) {
      errors.push({ message: `Edge "${edge.id}" references unknown source node: ${edge.source}` });
    }
    if (!nodeMap.has(edge.target)) {
      errors.push({ message: `Edge "${edge.id}" references unknown target node: ${edge.target}` });
    }
  }

  for (const node of flow.nodes) {
    switch (node.type) {
      case "agent":
        if (!node.data.agentSlug && !node.data.inlineInstructions) {
          errors.push({
            nodeId: node.id,
            field: "agentSlug",
            message: "Agent node must have an agent selected or inline instructions",
          });
        } else if (node.data.agentSlug && !availableAgentSlugs.includes(node.data.agentSlug)) {
          errors.push({
            nodeId: node.id,
            field: "agentSlug",
            message: `Unknown agent slug: ${node.data.agentSlug}`,
          });
        }
        break;

      case "condition":
        if (node.data.goalCheck) {
          if (!node.data.goalConditions || !Array.isArray(node.data.goalConditions) || (node.data.goalConditions as unknown[]).length === 0) {
            errors.push({ nodeId: node.id, field: "goalConditions", message: "Goal-check condition must have at least one condition" });
          }
        } else if (!node.data.condition) {
          errors.push({ nodeId: node.id, field: "condition", message: "Condition node must specify a condition" });
        } else if (!node.data.condition.field) {
          errors.push({ nodeId: node.id, field: "condition.field", message: "Condition must have a field" });
        }
        break;

      case "fork": {
        const outEdges = flow.edges.filter((e) => e.source === node.id);
        if (outEdges.length < 2) {
          errors.push({ nodeId: node.id, message: "Fork node must have at least 2 outgoing edges" });
        }
        break;
      }

      case "join": {
        const inEdges = flow.edges.filter((e) => e.target === node.id);
        if (inEdges.length < 2) {
          errors.push({ nodeId: node.id, message: "Join node must have at least 2 incoming edges" });
        }
        break;
      }

      case "tool": {
        const toolName = node.data.toolName as string | undefined;
        if (!toolName || typeof toolName !== "string") {
          errors.push({ nodeId: node.id, field: "toolName", message: "Tool node must specify toolName" });
        } else if (!allToolNames().includes(toolName)) {
          errors.push({ nodeId: node.id, field: "toolName", message: `Unknown tool: ${toolName}` });
        }
        break;
      }
    }
  }

  const uniqueNodes = [...nodeMap.values()];

  const cycleError = detectCycle(uniqueNodes, flow.edges);
  if (cycleError) {
    errors.push({ message: cycleError });
  }

  const reachability = checkReachability(uniqueNodes, flow.edges);
  for (const err of reachability) {
    errors.push(err);
  }

  return { valid: errors.length === 0, errors };
}

function detectCycle(nodes: FlowNode[], edges: FlowEdge[]): string | null {
  const adj = new Map<string, string[]>();
  for (const node of nodes) {
    adj.set(node.id, []);
  }
  for (const edge of edges) {
    adj.get(edge.source)?.push(edge.target);
  }

  const WHITE = 0, GREY = 1, BLACK = 2;
  const color = new Map<string, number>();
  for (const node of nodes) {
    color.set(node.id, WHITE);
  }

  function dfs(nodeId: string): boolean {
    color.set(nodeId, GREY);
    for (const neighbor of adj.get(nodeId) ?? []) {
      const c = color.get(neighbor);
      if (c === GREY) return true;
      if (c === WHITE && dfs(neighbor)) return true;
    }
    color.set(nodeId, BLACK);
    return false;
  }

  for (const node of nodes) {
    if (color.get(node.id) === WHITE && dfs(node.id)) {
      return "Flow contains a cycle — it must be a directed acyclic graph (DAG)";
    }
  }

  return null;
}

function checkReachability(nodes: FlowNode[], edges: FlowEdge[]): ValidationError[] {
  const errors: ValidationError[] = [];
  const inputNode = nodes.find((n) => n.type === "input");
  const outputNode = nodes.find((n) => n.type === "output");
  if (!inputNode || !outputNode) return errors;

  const forwardAdj = new Map<string, string[]>();
  const backwardAdj = new Map<string, string[]>();
  for (const node of nodes) {
    forwardAdj.set(node.id, []);
    backwardAdj.set(node.id, []);
  }
  for (const edge of edges) {
    forwardAdj.get(edge.source)?.push(edge.target);
    backwardAdj.get(edge.target)?.push(edge.source);
  }

  const reachableFromInput = bfs(inputNode.id, forwardAdj);
  const reachableToOutput = bfs(outputNode.id, backwardAdj);

  const terminusIds = new Set(nodes.filter((n) => n.type === "terminus").map((n) => n.id));
  const reachableToTerminus = new Set<string>();
  for (const tid of terminusIds) {
    for (const id of bfs(tid, backwardAdj)) {
      reachableToTerminus.add(id);
    }
  }

  for (const node of nodes) {
    if (!reachableFromInput.has(node.id)) {
      errors.push({ nodeId: node.id, message: `Node "${node.data.label ?? node.id}" is not reachable from the input` });
    }
    if (!reachableToOutput.has(node.id) && !reachableToTerminus.has(node.id) && node.type !== "terminus") {
      errors.push({ nodeId: node.id, message: `Node "${node.data.label ?? node.id}" cannot reach the output` });
    }
  }

  return errors;
}

function bfs(start: string, adj: Map<string, string[]>): Set<string> {
  const visited = new Set<string>();
  const queue = [start];
  visited.add(start);
  while (queue.length > 0) {
    const current = queue.shift()!;
    for (const neighbor of adj.get(current) ?? []) {
      if (!visited.has(neighbor)) {
        visited.add(neighbor);
        queue.push(neighbor);
      }
    }
  }
  return visited;
}

/**
 * Topologically sort nodes. Returns ordered node IDs.
 * Throws if the graph has a cycle.
 */
export function topologicalSort(flow: FlowDefinition): string[] {
  const inDegree = new Map<string, number>();
  const adj = new Map<string, string[]>();

  for (const node of flow.nodes) {
    inDegree.set(node.id, 0);
    adj.set(node.id, []);
  }

  for (const edge of flow.edges) {
    adj.get(edge.source)?.push(edge.target);
    inDegree.set(edge.target, (inDegree.get(edge.target) ?? 0) + 1);
  }

  const queue: string[] = [];
  for (const [id, deg] of inDegree) {
    if (deg === 0) queue.push(id);
  }

  const sorted: string[] = [];
  while (queue.length > 0) {
    const current = queue.shift()!;
    sorted.push(current);
    for (const neighbor of adj.get(current) ?? []) {
      const newDeg = (inDegree.get(neighbor) ?? 1) - 1;
      inDegree.set(neighbor, newDeg);
      if (newDeg === 0) queue.push(neighbor);
    }
  }

  if (sorted.length !== flow.nodes.length) {
    throw new Error("Flow contains a cycle");
  }

  return sorted;
}
