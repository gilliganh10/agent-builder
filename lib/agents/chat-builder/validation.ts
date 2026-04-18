import type {
  ChatBuilderSpec,
  MessageBlock,
  BlockAttachment,
  OrchestratorConfig,
  AgentStateConfig,
} from "@/db/agents/schema";

export interface ChatBuilderValidationError {
  path: string;
  message: string;
}

export type ValidationSeverity = "error" | "warning";

export interface ChatBuilderValidationDiagnostic {
  path: string;
  message: string;
  severity: ValidationSeverity;
}

export interface ChatBuilderValidationResult {
  valid: boolean;
  errors: ChatBuilderValidationError[];
  warnings: ChatBuilderValidationDiagnostic[];
}

export function validateChatBuilder(
  spec: ChatBuilderSpec,
  orchestrator?: OrchestratorConfig,
  primitiveSlugs?: string[],
  stateConfig?: AgentStateConfig
): ChatBuilderValidationResult {
  const errors: ChatBuilderValidationError[] = [];
  const warnings: ChatBuilderValidationDiagnostic[] = [];

  if (!spec.blocks || spec.blocks.length === 0) {
    errors.push({ path: "blocks", message: "At least one message block is required" });
    return { valid: false, errors, warnings };
  }

  const hasUser = spec.blocks.some((b) => b.type === "user");
  const hasAssistant = spec.blocks.some((b) => b.type === "assistant");
  const hasBranch = spec.blocks.some((b) => b.type === "branch");
  const branchHasAssistant = spec.blocks.some(
    (b) =>
      b.type === "branch" &&
      b.branchConfig &&
      ([...b.branchConfig.trueBranch, ...b.branchConfig.falseBranch].some(
        (nb) => nb.type === "assistant"
      ))
  );

  if (!hasUser) {
    errors.push({ path: "blocks", message: "At least one user message block is required" });
  }
  if (!hasAssistant && !branchHasAssistant) {
    errors.push({ path: "blocks", message: "At least one assistant message block is required" });
  }

  // Build var keys from stateConfig or orchestrator
  const varKeys = stateConfig
    ? new Set(stateConfig.fields.map((f) => f.key))
    : new Set((orchestrator?.vars ?? []).map((v) => v.key));
  const lockedKeys = new Set(orchestrator?.locks ?? []);

  const blockIds = new Set<string>();
  for (let i = 0; i < spec.blocks.length; i++) {
    const block = spec.blocks[i];
    const blockPath = `blocks[${i}]`;

    if (!block.id) {
      errors.push({ path: `${blockPath}.id`, message: "Block ID is required" });
    } else if (blockIds.has(block.id)) {
      errors.push({ path: `${blockPath}.id`, message: `Duplicate block ID: ${block.id}` });
    }
    blockIds.add(block.id);

    if (!block.type) {
      errors.push({ path: `${blockPath}.type`, message: "Block type is required" });
    } else if (
      !["user", "assistant", "system", "context", "extract", "branch", "parallel", "goal"].includes(
        block.type
      )
    ) {
      errors.push({ path: `${blockPath}.type`, message: `Invalid block type: ${block.type}` });
    }

    if (!block.label) {
      errors.push({ path: `${blockPath}.label`, message: "Block label is required" });
    }

    validateBlockAttachments(block, i, errors, warnings, varKeys, lockedKeys, primitiveSlugs);

    if (block.type === "assistant") {
      validateAssistantBlockCompleteness(block, i, warnings);
    }

    if (block.type === "extract") {
      validateExtractBlock(block, blockPath, errors, warnings, varKeys);
    }

    if (block.type === "branch") {
      validateBranchBlock(block, blockPath, errors, warnings, varKeys, lockedKeys, primitiveSlugs, stateConfig, orchestrator);
    }

    if (block.type === "parallel") {
      validateParallelBlock(block, blockPath, errors, warnings, varKeys, lockedKeys, primitiveSlugs, stateConfig, orchestrator);
    }

    if (block.type === "goal") {
      validateGoalBlock(block, blockPath, errors, warnings, varKeys);
    }
  }

  validatePositions(spec.blocks, errors);

  if (stateConfig) {
    validateStateConfig(stateConfig, errors, warnings);
  }

  return { valid: errors.length === 0, errors, warnings };
}

function validateAssistantBlockCompleteness(
  block: MessageBlock,
  blockIndex: number,
  warnings: ChatBuilderValidationDiagnostic[]
): void {
  const blockPath = `blocks[${blockIndex}]`;
  const hasContent = !!block.content?.trim();
  const hasParallels = block.attachments.some((a) => a.mode === "parallel");
  const hasResponderBefore = block.attachments.some(
    (a) =>
      a.mode === "before" &&
      (a.inlinePrimitive?.kind === "responder" || a.primitiveId)
  );

  if (!hasContent && !hasParallels && !hasResponderBefore) {
    warnings.push({
      path: blockPath,
      message:
        "Assistant block has no instructions and no responder attachment. Add response instructions or attach a responder primitive.",
      severity: "warning",
    });
  }
}

function validateBlockAttachments(
  block: MessageBlock,
  blockIndex: number,
  errors: ChatBuilderValidationError[],
  warnings: ChatBuilderValidationDiagnostic[],
  varKeys: Set<string>,
  lockedKeys: Set<string>,
  primitiveSlugs?: string[]
): void {
  const blockPath = `blocks[${blockIndex}]`;

  for (let j = 0; j < (block.attachments ?? []).length; j++) {
    const att = block.attachments[j];
    const attPath = `${blockPath}.attachments[${j}]`;

    if (!att.id) {
      errors.push({ path: `${attPath}.id`, message: "Attachment ID is required" });
    }

    if (!att.mode) {
      errors.push({ path: `${attPath}.mode`, message: "Attachment mode is required" });
    } else if (!["before", "after", "parallel", "override"].includes(att.mode)) {
      errors.push({ path: `${attPath}.mode`, message: `Invalid attachment mode: ${att.mode}` });
    }

    if (att.mode === "override" && block.type !== "user") {
      errors.push({
        path: `${attPath}.mode`,
        message: "OVERRIDE attachments are only allowed on user message blocks",
      });
    }

    if (att.mode === "override" && !att.condition) {
      warnings.push({
        path: `${attPath}.condition`,
        message: "This override has no condition and will always apply",
        severity: "warning",
      });
    }

    if (att.mode === "override" && att.condition?.field.startsWith("vars.")) {
      const varKey = att.condition.field.slice(5);
      if (!varKeys.has(varKey)) {
        warnings.push({
          path: `${attPath}.condition.field`,
          message: `Condition references undeclared orchestrator var: ${varKey}`,
          severity: "warning",
        });
      }
    }

    if (att.mode === "parallel" && block.type !== "assistant") {
      errors.push({
        path: `${attPath}.mode`,
        message: "PARALLEL attachments are only allowed on assistant message blocks",
      });
    }

    if (!att.primitiveId && !att.inlinePrimitive) {
      errors.push({
        path: attPath,
        message: "Attachment must reference a primitive (primitiveId) or define an inline primitive",
      });
    }

    if (att.primitiveId && primitiveSlugs && !primitiveSlugs.includes(att.primitiveId)) {
      errors.push({
        path: `${attPath}.primitiveId`,
        message: `Primitive not found: ${att.primitiveId}`,
      });
    }

    if (att.varsRead) {
      for (const key of att.varsRead) {
        if (!varKeys.has(key)) {
          errors.push({
            path: `${attPath}.varsRead`,
            message: `varsRead references undefined var: ${key}`,
          });
        }
      }
    }

    if (att.varsPatch) {
      for (const targetKey of Object.values(att.varsPatch)) {
        if (!varKeys.has(targetKey)) {
          errors.push({
            path: `${attPath}.varsPatch`,
            message: `varsPatch targets undefined var: ${targetKey}`,
          });
        }
        if (lockedKeys.has(targetKey)) {
          errors.push({
            path: `${attPath}.varsPatch`,
            message: `varsPatch targets locked var: ${targetKey}`,
          });
        }
      }
    }
  }
}

function validatePositions(
  blocks: MessageBlock[],
  errors: ChatBuilderValidationError[]
): void {
  const positions = blocks.map((b) => b.position).sort((a, b) => a - b);
  for (let i = 1; i < positions.length; i++) {
    if (positions[i] === positions[i - 1]) {
      errors.push({
        path: "blocks",
        message: `Duplicate block position: ${positions[i]}`,
      });
    }
  }
}

function validateExtractBlock(
  block: MessageBlock,
  blockPath: string,
  errors: ChatBuilderValidationError[],
  warnings: ChatBuilderValidationDiagnostic[],
  varKeys: Set<string>
): void {
  if (!block.extractConfig) {
    errors.push({
      path: `${blockPath}.extractConfig`,
      message: "Extract block must have an extractConfig",
    });
    return;
  }

  const cfg = block.extractConfig;

  if (!cfg.outputSchema || cfg.outputSchema.length === 0) {
    errors.push({
      path: `${blockPath}.extractConfig.outputSchema`,
      message: "Extract block must define at least one output schema field",
    });
  } else {
    const fieldKeys = new Set<string>();
    for (let j = 0; j < cfg.outputSchema.length; j++) {
      const field = cfg.outputSchema[j];
      const fieldPath = `${blockPath}.extractConfig.outputSchema[${j}]`;

      if (!field.key || field.key.trim() === "") {
        errors.push({ path: `${fieldPath}.key`, message: "Schema field key is required" });
      } else if (fieldKeys.has(field.key)) {
        errors.push({ path: `${fieldPath}.key`, message: `Duplicate schema field key: ${field.key}` });
      }
      fieldKeys.add(field.key);

      if (!["string", "number", "boolean"].includes(field.type)) {
        errors.push({ path: `${fieldPath}.type`, message: `Invalid schema field type: ${field.type}` });
      }

      if (!field.description || field.description.trim() === "") {
        warnings.push({
          path: `${fieldPath}.description`,
          message: `Schema field "${field.key}" should have a description for better extraction`,
          severity: "warning",
        });
      }
    }
  }

  if (cfg.varsRead) {
    for (const key of cfg.varsRead) {
      if (!varKeys.has(key)) {
        warnings.push({
          path: `${blockPath}.extractConfig.varsRead`,
          message: `varsRead references undeclared state var: ${key}`,
          severity: "warning",
        });
      }
    }
  }

  if (cfg.varsPatch) {
    for (const targetKey of Object.values(cfg.varsPatch)) {
      if (!varKeys.has(targetKey)) {
        errors.push({
          path: `${blockPath}.extractConfig.varsPatch`,
          message: `varsPatch targets undefined state var: ${targetKey}`,
        });
      }
    }
  }
}

function validateBranchBlock(
  block: MessageBlock,
  blockPath: string,
  errors: ChatBuilderValidationError[],
  warnings: ChatBuilderValidationDiagnostic[],
  varKeys: Set<string>,
  lockedKeys: Set<string>,
  primitiveSlugs?: string[],
  stateConfig?: AgentStateConfig,
  orchestrator?: OrchestratorConfig
): void {
  if (!block.branchConfig) {
    errors.push({
      path: `${blockPath}.branchConfig`,
      message: "Branch block must have a branchConfig",
    });
    return;
  }

  const cfg = block.branchConfig;

  if (!cfg.condition) {
    errors.push({
      path: `${blockPath}.branchConfig.condition`,
      message: "Branch block must have a condition",
    });
  } else if (!cfg.condition.field) {
    errors.push({
      path: `${blockPath}.branchConfig.condition.field`,
      message: "Condition field is required",
    });
  }

  for (let i = 0; i < cfg.trueBranch.length; i++) {
    const child = cfg.trueBranch[i];
    const childPath = `${blockPath}.branchConfig.trueBranch[${i}]`;
    validateNestedBlock(child, childPath, errors, warnings, varKeys, lockedKeys, primitiveSlugs, stateConfig, orchestrator);
  }

  for (let i = 0; i < cfg.falseBranch.length; i++) {
    const child = cfg.falseBranch[i];
    const childPath = `${blockPath}.branchConfig.falseBranch[${i}]`;
    validateNestedBlock(child, childPath, errors, warnings, varKeys, lockedKeys, primitiveSlugs, stateConfig, orchestrator);
  }
}

function validateParallelBlock(
  block: MessageBlock,
  blockPath: string,
  errors: ChatBuilderValidationError[],
  warnings: ChatBuilderValidationDiagnostic[],
  varKeys: Set<string>,
  lockedKeys: Set<string>,
  primitiveSlugs?: string[],
  stateConfig?: AgentStateConfig,
  orchestrator?: OrchestratorConfig
): void {
  if (!block.parallelConfig) {
    errors.push({
      path: `${blockPath}.parallelConfig`,
      message: "Parallel block must have a parallelConfig",
    });
    return;
  }

  const cfg = block.parallelConfig;

  for (let i = 0; i < cfg.laneA.length; i++) {
    const child = cfg.laneA[i];
    const childPath = `${blockPath}.parallelConfig.laneA[${i}]`;
    validateNestedBlock(child, childPath, errors, warnings, varKeys, lockedKeys, primitiveSlugs, stateConfig, orchestrator);
  }

  for (let i = 0; i < cfg.laneB.length; i++) {
    const child = cfg.laneB[i];
    const childPath = `${blockPath}.parallelConfig.laneB[${i}]`;
    validateNestedBlock(child, childPath, errors, warnings, varKeys, lockedKeys, primitiveSlugs, stateConfig, orchestrator);
  }
}

function validateGoalBlock(
  block: MessageBlock,
  blockPath: string,
  errors: ChatBuilderValidationError[],
  _warnings: ChatBuilderValidationDiagnostic[],
  varKeys: Set<string>
): void {
  const cfg = block.goalConfig;
  if (!cfg) {
    errors.push({
      path: `${blockPath}.goalConfig`,
      message: "Goal block must have a goalConfig",
    });
    return;
  }

  if (!cfg.name || cfg.name.trim() === "") {
    errors.push({
      path: `${blockPath}.goalConfig.name`,
      message: "Goal name is required",
    });
  }

  if (cfg.conditions.length === 0) {
    errors.push({
      path: `${blockPath}.goalConfig.conditions`,
      message: "Goal must have at least one condition",
    });
  }

  for (let j = 0; j < cfg.conditions.length; j++) {
    const cond = cfg.conditions[j];
    const condPath = `${blockPath}.goalConfig.conditions[${j}]`;

    if (!varKeys.has(cond.field)) {
      errors.push({
        path: `${condPath}.field`,
        message: `Condition references unknown state field: ${cond.field}`,
      });
    }
  }

  if (cfg.onComplete.type === "handoff" && !cfg.onComplete.handoffAgentSlug) {
    errors.push({
      path: `${blockPath}.goalConfig.onComplete.handoffAgentSlug`,
      message: "Handoff action requires a target agent slug",
    });
  }
}

function validateNestedBlock(
  block: MessageBlock,
  blockPath: string,
  errors: ChatBuilderValidationError[],
  warnings: ChatBuilderValidationDiagnostic[],
  varKeys: Set<string>,
  lockedKeys: Set<string>,
  primitiveSlugs?: string[],
  stateConfig?: AgentStateConfig,
  orchestrator?: OrchestratorConfig
): void {
  if (!block.id) {
    errors.push({ path: `${blockPath}.id`, message: "Block ID is required" });
  }
  if (!block.type) {
    errors.push({ path: `${blockPath}.type`, message: "Block type is required" });
  }
  if (!block.label) {
    errors.push({ path: `${blockPath}.label`, message: "Block label is required" });
  }

  if (block.type === "extract") {
    validateExtractBlock(block, blockPath, errors, warnings, varKeys);
  }
  if (block.type === "branch") {
    validateBranchBlock(block, blockPath, errors, warnings, varKeys, lockedKeys, primitiveSlugs, stateConfig, orchestrator);
  }
  if (block.type === "parallel") {
    validateParallelBlock(block, blockPath, errors, warnings, varKeys, lockedKeys, primitiveSlugs, stateConfig, orchestrator);
  }
  if (block.type === "assistant") {
    validateAssistantBlockCompleteness(block, 0, warnings);
  }

  validateBlockAttachments(block, 0, errors, warnings, varKeys, lockedKeys, primitiveSlugs);
}

function validateStateConfig(
  config: AgentStateConfig,
  errors: ChatBuilderValidationError[],
  warnings: ChatBuilderValidationDiagnostic[]
): void {
  const fieldKeys = new Set<string>();

  for (let i = 0; i < config.fields.length; i++) {
    const field = config.fields[i];
    const path = `stateConfig.fields[${i}]`;

    if (!field.key || field.key.trim() === "") {
      errors.push({ path: `${path}.key`, message: "Field key is required" });
    } else if (fieldKeys.has(field.key)) {
      errors.push({ path: `${path}.key`, message: `Duplicate field key: ${field.key}` });
    }
    fieldKeys.add(field.key);

    if (!field.description || field.description.trim() === "") {
      errors.push({
        path: `${path}.description`,
        message: `Field "${field.key}" must have a description (used by the extraction LLM)`,
      });
    }

    if (!["string", "number", "boolean", "json"].includes(field.type)) {
      errors.push({ path: `${path}.type`, message: `Invalid field type: ${field.type}` });
    }
  }

  if (config.goals.length > 0 && config.fields.length === 0) {
    warnings.push({
      path: "stateConfig.goals",
      message: "Goals are defined but no state fields exist. Goals require state fields to evaluate conditions.",
      severity: "warning",
    });
  }

  for (let i = 0; i < config.goals.length; i++) {
    const goal = config.goals[i];
    const goalPath = `stateConfig.goals[${i}]`;

    if (!goal.name || goal.name.trim() === "") {
      errors.push({ path: `${goalPath}.name`, message: "Goal name is required" });
    }

    if (goal.conditions.length === 0) {
      warnings.push({
        path: `${goalPath}.conditions`,
        message: `Goal "${goal.name}" has no conditions and will never be achieved`,
        severity: "warning",
      });
    }

    for (let j = 0; j < goal.conditions.length; j++) {
      const cond = goal.conditions[j];
      const condPath = `${goalPath}.conditions[${j}]`;

      if (!fieldKeys.has(cond.field)) {
        errors.push({
          path: `${condPath}.field`,
          message: `Condition references unknown state field: ${cond.field}`,
        });
      }
    }

    if (goal.onComplete.type === "handoff" && !goal.onComplete.handoffAgentSlug) {
      errors.push({
        path: `${goalPath}.onComplete.handoffAgentSlug`,
        message: "Handoff action requires a target agent slug",
      });
    }
  }
}
