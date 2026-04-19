/**
 * Converts a legacy `ChatBuilderSpec` (block-based authoring) into a
 * canonical `SimplifiedBuilderSpec`. Best-effort: any construct that
 * cannot be represented faithfully is dropped with a visible warning so
 * the author can patch it up manually after import.
 *
 * The goal is "good enough to open the agent in the simplified studio",
 * not a lossless round-trip.
 */

import type {
  BlockAttachment,
  ChatBuilderSpec,
  ExtractFieldSchema,
  MessageBlock,
} from "@/db/agents/schema";
import {
  createEmptySimplifiedBuilder,
  type SimplifiedBuilderSpec,
  type SimplifiedStep,
  type SimplifiedVarMapping,
} from "./simplified-types";

let idCounter = 0;
function nextId(kind: string): string {
  idCounter += 1;
  return `${kind}-imp-${idCounter}`;
}

interface Ctx {
  steps: SimplifiedStep[];
  warnings: Set<string>;
}

/**
 * Entry point — returns a simplified spec alongside any user-facing
 * warnings that should be surfaced in the Plan tab header.
 */
export function importSimplifiedFromChatBuilder(
  chat: ChatBuilderSpec
): { spec: SimplifiedBuilderSpec; warnings: string[] } {
  const empty = createEmptySimplifiedBuilder();
  const ctx: Ctx = {
    steps: empty.steps.slice(), // keep fixed input + end
    warnings: new Set(),
  };

  const inputId = empty.rootOrder[0];
  const endId = empty.rootOrder[empty.rootOrder.length - 1];
  const bodyIds: string[] = [];

  const sorted = [...chat.blocks].sort((a, b) => a.position - b.position);
  for (const block of sorted) {
    const ids = convertBlock(block, ctx);
    bodyIds.push(...ids);
  }

  const spec: SimplifiedBuilderSpec = {
    version: 1,
    steps: ctx.steps,
    rootOrder: [inputId, ...bodyIds, endId],
  };

  return { spec, warnings: Array.from(ctx.warnings) };
}

// ---------------------------------------------------------------------------
// Block conversion
// ---------------------------------------------------------------------------

function convertBlock(block: MessageBlock, ctx: Ctx): string[] {
  // Pre-attachments (mode "before") become steps that run before the block.
  const preAttachmentIds: string[] = [];
  for (const att of block.attachments ?? []) {
    if (att.mode !== "before") continue;
    const id = convertAttachment(att, ctx);
    if (id) preAttachmentIds.push(id);
  }

  const ownIds = convertBlockBody(block, ctx);

  // Post-attachments (mode "after") run immediately after the block.
  const postAttachmentIds: string[] = [];
  for (const att of block.attachments ?? []) {
    if (att.mode === "before") continue;
    if (att.mode === "parallel" || att.mode === "override") {
      ctx.warnings.add(
        `Dropped a ${att.mode} attachment on "${block.label}". Rebuild it as a Parallel or Transform step.`
      );
      continue;
    }
    const id = convertAttachment(att, ctx);
    if (id) postAttachmentIds.push(id);
  }

  return [...preAttachmentIds, ...ownIds, ...postAttachmentIds];
}

function convertBlockBody(block: MessageBlock, ctx: Ctx): string[] {
  switch (block.type) {
    case "user":
      return [];

    case "system": {
      ctx.warnings.add(
        `Dropped system block "${block.label}". Move its guidance into a Message step's instructions.`
      );
      return [];
    }

    case "context": {
      ctx.warnings.add(
        `Dropped context block "${block.label}". Rebuild it as a Transform or Update State step.`
      );
      return [];
    }

    case "assistant": {
      const id = nextId("message");
      ctx.steps.push({
        id,
        kind: "message",
        label: block.label || "Reply",
        instructions: block.content ?? "",
        outputMode: "text",
      });
      return [id];
    }

    case "extract": {
      const cfg = block.extractConfig;
      if (!cfg) {
        ctx.warnings.add(`Extract block "${block.label}" had no config and was skipped.`);
        return [];
      }
      const id = nextId("update_state");
      ctx.steps.push({
        id,
        kind: "update_state",
        label: block.label || "Update memory",
        instructions: cfg.instructions,
        model: cfg.model,
        jsonSchema: cfg.outputSchema,
        varsRead: cfg.varsRead,
        varsFromOutput: varMappingsFromPatch(cfg.varsPatch),
      });
      return [id];
    }

    case "branch": {
      const cfg = block.branchConfig;
      if (!cfg) return [];
      const yesIds: string[] = [];
      for (const child of [...cfg.trueBranch].sort((a, b) => a.position - b.position)) {
        yesIds.push(...convertBlock(child, ctx));
      }
      const noIds: string[] = [];
      for (const child of [...cfg.falseBranch].sort((a, b) => a.position - b.position)) {
        noIds.push(...convertBlock(child, ctx));
      }
      const id = nextId("condition");
      ctx.steps.push({
        id,
        kind: "condition",
        label: block.label || "Condition",
        condition: cfg.condition,
        yesSteps: yesIds,
        noSteps: noIds,
      });
      return [id];
    }

    case "parallel": {
      const cfg = block.parallelConfig;
      if (!cfg) return [];
      const laneA: string[] = [];
      for (const child of [...cfg.laneA].sort((a, b) => a.position - b.position)) {
        laneA.push(...convertBlock(child, ctx));
      }
      const laneB: string[] = [];
      for (const child of [...cfg.laneB].sort((a, b) => a.position - b.position)) {
        laneB.push(...convertBlock(child, ctx));
      }
      const id = nextId("parallel");
      ctx.steps.push({
        id,
        kind: "parallel",
        label: block.label || "Run in parallel",
        laneA,
        laneB,
      });
      return [id];
    }

    case "goal": {
      const cfg = block.goalConfig;
      const id = nextId("end");
      ctx.steps.push({
        id,
        kind: "end",
        label: block.label || "End",
        goalId: cfg?.goalId,
      });
      ctx.warnings.add(
        `Imported goal "${cfg?.name ?? block.label}" as an End step. Rebuild goal conditions in the Memory tab.`
      );
      return [id];
    }
  }
}

function convertAttachment(
  att: BlockAttachment,
  ctx: Ctx
): string | null {
  if (att.primitiveId && !att.inlinePrimitive) {
    ctx.warnings.add(
      `Attachment "${att.label}" referenced a saved primitive; rebuild it in the simplified builder.`
    );
    return null;
  }
  const inline = att.inlinePrimitive;
  if (!inline) return null;

  if (inline.kind === "rewriter") {
    const id = nextId("transform");
    ctx.steps.push({
      id,
      kind: "transform",
      label: att.label || "Rewrite user message",
      instructions: inline.instructions,
      model: inline.model,
      outputMode: "text",
      varsRead: att.varsRead,
      varsFromOutput: varMappingsFromPatch(att.varsPatch),
    });
    return id;
  }

  if (inline.kind === "state_extractor") {
    const id = nextId("update_state");
    ctx.steps.push({
      id,
      kind: "update_state",
      label: att.label || "Update memory",
      instructions: inline.instructions,
      model: inline.model,
      jsonSchema: att.outputSchema ?? defaultExtractFields(att.varsPatch),
      varsRead: att.varsRead,
      varsFromOutput: varMappingsFromPatch(att.varsPatch),
    });
    return id;
  }

  if (inline.kind === "responder") {
    const id = nextId("message");
    ctx.steps.push({
      id,
      kind: "message",
      label: att.label || "Reply",
      instructions: inline.instructions,
      model: inline.model,
      outputMode: att.outputSchema?.length ? "json_schema" : "text",
      jsonSchema: att.outputSchema,
      varsRead: att.varsRead,
      varsFromOutput: varMappingsFromPatch(att.varsPatch),
    });
    return id;
  }

  ctx.warnings.add(
    `Attachment "${att.label}" used primitive "${inline.kind}" which is not available in the simplified builder.`
  );
  return null;
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function varMappingsFromPatch(
  patch?: Record<string, string>
): SimplifiedVarMapping[] | undefined {
  if (!patch) return undefined;
  const entries = Object.entries(patch);
  if (entries.length === 0) return undefined;
  // Legacy shape is { memoryKey: outputKey }; simplified flips that around.
  return entries.map(([to, from]) => ({ from, to }));
}

function defaultExtractFields(
  patch?: Record<string, string>
): ExtractFieldSchema[] {
  if (!patch) return [];
  return Object.entries(patch).map(([, outputKey]) => ({
    key: outputKey,
    type: "string" as const,
    description: "",
  }));
}
