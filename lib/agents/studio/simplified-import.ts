import type { FlowDefinition } from "@/db/agents/schema";
import { importSimplifiedFromChatBuilder } from "./legacy-import";
import {
  createEmptySimplifiedBuilder,
  type SimplifiedBuilderSpec,
} from "./simplified-types";

export interface SimplifiedImportResult {
  spec: SimplifiedBuilderSpec;
  /** True when the spec came from the persisted `simplifiedBuilder`. */
  fromCanonical: boolean;
  /** User-visible warnings from legacy imports. */
  warnings: string[];
}

/**
 * Load the canonical simplified builder from a FlowDefinition.
 *
 * Order of preference:
 *   1. Persisted `simplifiedBuilder` — use as-is.
 *   2. Legacy `chatBuilder` blocks — best-effort import, may emit warnings.
 *   3. Anything else — fall back to an empty Input → End template and
 *      warn if a raw graph is present so the author knows they will
 *      start from scratch.
 */
export function importSimplifiedBuilder(
  flow?: FlowDefinition | null
): SimplifiedImportResult {
  if (flow?.simplifiedBuilder) {
    return {
      spec: flow.simplifiedBuilder,
      fromCanonical: true,
      warnings: [],
    };
  }

  if (flow?.chatBuilder?.blocks?.length) {
    const { spec, warnings } = importSimplifiedFromChatBuilder(flow.chatBuilder);
    return {
      spec,
      fromCanonical: false,
      warnings: [
        "Imported from the previous block builder. Review each step before saving.",
        ...warnings,
      ],
    };
  }

  const warnings: string[] = [];
  if (flow && flow.nodes.length > 0) {
    warnings.push(
      "This agent has a custom graph that cannot be imported automatically. Steps start empty — rebuild on the Plan tab, or keep editing on the Graph tab."
    );
  }

  return {
    spec: createEmptySimplifiedBuilder(),
    fromCanonical: false,
    warnings,
  };
}
