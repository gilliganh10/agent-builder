import type {
  FlowDefinition,
  FlowNode,
  OrchestratorConfig,
  PrimitiveKind,
  VarDefinition,
  V2_NODE_TYPES,
} from "@/db/agents/schema";
import { PRIMITIVE_KINDS } from "@/db/agents/schema";

export interface ValidationError {
  nodeId?: string;
  field?: string;
  message: string;
}

export interface ValidationResult {
  valid: boolean;
  errors: ValidationError[];
}

const PRIMITIVE_NODE_TYPES = new Set<string>(PRIMITIVE_KINDS);

function isPrimitiveNode(node: FlowNode): boolean {
  return PRIMITIVE_NODE_TYPES.has(node.type);
}

export function validateV2Flow(flow: FlowDefinition): ValidationResult {
  const errors: ValidationError[] = [];

  if (flow.version !== 2) {
    return { valid: true, errors: [] };
  }

  if (!flow.orchestrator) {
    errors.push({ message: "v2 flows must have an orchestrator config" });
    return { valid: false, errors };
  }

  validateOrchestratorConfig(flow.orchestrator, errors);

  const varKeys = new Set(flow.orchestrator.vars.map((v) => v.key));

  for (const node of flow.nodes) {
    if (!isPrimitiveNode(node)) continue;

    validatePrimitiveNode(node, varKeys, flow.orchestrator.locks, errors);
  }

  validateEvalNodes(flow, errors);

  return { valid: errors.length === 0, errors };
}

function validateOrchestratorConfig(
  config: OrchestratorConfig,
  errors: ValidationError[]
): void {
  if (!config.vars || !Array.isArray(config.vars)) {
    errors.push({ field: "orchestrator.vars", message: "vars must be an array" });
  } else {
    const seen = new Set<string>();
    for (const v of config.vars) {
      if (!v.key || typeof v.key !== "string") {
        errors.push({ field: "orchestrator.vars", message: "each var must have a string key" });
        continue;
      }
      if (seen.has(v.key)) {
        errors.push({ field: "orchestrator.vars", message: `duplicate var key: ${v.key}` });
      }
      seen.add(v.key);
      if (!["string", "number", "boolean", "json"].includes(v.type)) {
        errors.push({ field: `orchestrator.vars.${v.key}`, message: `invalid var type: ${v.type}` });
      }
    }
  }

  if (!config.goals || !Array.isArray(config.goals)) {
    errors.push({ field: "orchestrator.goals", message: "goals must be an array" });
  } else {
    const seen = new Set<string>();
    for (const g of config.goals) {
      if (!g.id || typeof g.id !== "string") {
        errors.push({ field: "orchestrator.goals", message: "each goal must have a string id" });
        continue;
      }
      if (seen.has(g.id)) {
        errors.push({ field: "orchestrator.goals", message: `duplicate goal id: ${g.id}` });
      }
      seen.add(g.id);
      if (!g.description) {
        errors.push({ field: `orchestrator.goals.${g.id}`, message: "goal must have a description" });
      }
    }
  }

  if (!Array.isArray(config.locks)) {
    errors.push({ field: "orchestrator.locks", message: "locks must be an array" });
  } else {
    const varKeys = new Set((config.vars ?? []).map((v) => v.key));
    for (const lock of config.locks) {
      if (!varKeys.has(lock)) {
        errors.push({ field: "orchestrator.locks", message: `locked var "${lock}" is not defined in vars` });
      }
    }
  }

  if (!["run", "conversation"].includes(config.scope)) {
    errors.push({ field: "orchestrator.scope", message: `invalid scope: ${config.scope}` });
  }
}

function validatePrimitiveNode(
  node: FlowNode,
  varKeys: Set<string>,
  locks: string[],
  errors: ValidationError[]
): void {
  const lockSet = new Set(locks);

  if (!node.data.inlineInstructions) {
    errors.push({
      nodeId: node.id,
      message: `primitive node "${node.data.label ?? node.id}" must have inlineInstructions`,
    });
  }

  if (node.data.varsRead) {
    for (const key of node.data.varsRead) {
      if (!varKeys.has(key)) {
        errors.push({
          nodeId: node.id,
          field: "varsRead",
          message: `varsRead key "${key}" is not defined in orchestrator vars`,
        });
      }
    }
  }

  if (node.data.varsPatch) {
    for (const varKey of Object.values(node.data.varsPatch)) {
      if (lockSet.has(varKey)) {
        errors.push({
          nodeId: node.id,
          field: "varsPatch",
          message: `cannot patch locked var "${varKey}"`,
        });
      }
      if (!varKeys.has(varKey)) {
        errors.push({
          nodeId: node.id,
          field: "varsPatch",
          message: `varsPatch target "${varKey}" is not defined in orchestrator vars`,
        });
      }
    }
  }
}

function validateEvalNodes(flow: FlowDefinition, errors: ValidationError[]): void {
  const evalNodes = flow.nodes.filter((n) => n.type === "eval");

  for (const evalNode of evalNodes) {
    const outEdges = flow.edges.filter((e) => e.source === evalNode.id);
    const nonOutputTargets = outEdges.filter((e) => {
      const target = flow.nodes.find((n) => n.id === e.target);
      return target && target.type !== "output";
    });

    if (nonOutputTargets.length > 0) {
      errors.push({
        nodeId: evalNode.id,
        message: `eval node "${evalNode.data.label ?? evalNode.id}" must not have outgoing edges to non-output nodes (eval is out-of-band)`,
      });
    }
  }
}
