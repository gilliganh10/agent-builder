"use client";

import {
  createContext,
  useCallback,
  useContext,
  useLayoutEffect,
  useMemo,
  useState,
  type ReactNode,
} from "react";
import { useRouter } from "next/navigation";
import {
  compileSimplifiedToFlowDefinition,
  importSimplifiedBuilder,
  validateSimplifiedBuilder,
} from "@/lib/agents/studio";
import type {
  SimplifiedBuilderSpec,
  SimplifiedStep,
  SimplifiedStepKind,
} from "@/lib/agents/studio";
import { useAgentWorkspace } from "@/features/agents/workspace/AgentWorkspaceContext";
import { useBuilderDocument } from "@/features/agents/workspace/BuilderDocumentContext";

export type SimplifiedLocation =
  | { kind: "root"; index: number }
  | { kind: "yes"; parentId: string; index: number }
  | { kind: "no"; parentId: string; index: number }
  | { kind: "laneA"; parentId: string; index: number }
  | { kind: "laneB"; parentId: string; index: number };

export interface SimplifiedBuilderContextValue {
  spec: SimplifiedBuilderSpec;
  importWarnings: string[];

  /** Currently selected step id (for the inspector). */
  selectedStepId: string | null;
  setSelectedStepId: (id: string | null) => void;
  selectedStep: SimplifiedStep | null;

  /** Ordered list of step ids that form the main sequence (includes input + end). */
  rootOrder: string[];
  stepsById: Map<string, SimplifiedStep>;

  /** Update a single step in place. */
  updateStep: (id: string, patch: Partial<SimplifiedStep>) => void;
  /** Insert a new step at the given location. Returns the new id. */
  insertStep: (kind: SimplifiedStepKind, location: SimplifiedLocation) => string;
  /** Delete a step (and its descendants if branch/parallel). */
  deleteStep: (id: string) => void;
  /** Move a step up or down within its current parent list. */
  reorderStep: (id: string, direction: "up" | "down") => void;
}

const SimplifiedBuilderContext =
  createContext<SimplifiedBuilderContextValue | null>(null);

export function useSimplifiedBuilder(): SimplifiedBuilderContextValue {
  const ctx = useContext(SimplifiedBuilderContext);
  if (!ctx) {
    throw new Error(
      "useSimplifiedBuilder must be used within SimplifiedBuilderProvider"
    );
  }
  return ctx;
}

// ---------------------------------------------------------------------------
// ID generation
// ---------------------------------------------------------------------------

function generateStepId(kind: SimplifiedStepKind): string {
  return `${kind}-${Date.now().toString(36)}-${Math.random().toString(36).slice(2, 6)}`;
}

// ---------------------------------------------------------------------------
// Step factory
// ---------------------------------------------------------------------------

function createStep(kind: SimplifiedStepKind): SimplifiedStep {
  const id = generateStepId(kind);
  switch (kind) {
    case "input":
      return { id, kind: "input", label: "User Message" };
    case "message":
      return {
        id,
        kind: "message",
        label: "Reply",
        instructions: "",
        outputMode: "text",
      };
    case "transform":
      return {
        id,
        kind: "transform",
        label: "Rewrite user message",
        instructions: "",
        outputMode: "text",
      };
    case "update_state":
      return {
        id,
        kind: "update_state",
        label: "Update memory",
        jsonSchema: [{ key: "result", type: "string", description: "" }],
      };
    case "condition":
      return {
        id,
        kind: "condition",
        label: "Condition",
        condition: { field: "", operator: "exists" },
        yesSteps: [],
        noSteps: [],
      };
    case "parallel":
      return {
        id,
        kind: "parallel",
        label: "Run in parallel",
        laneALabel: "Lane A",
        laneBLabel: "Lane B",
        laneA: [],
        laneB: [],
      };
    case "end":
      return { id, kind: "end", label: "End" };
  }
}

// ---------------------------------------------------------------------------
// Location helpers — read/write an ordered list at a Location
// ---------------------------------------------------------------------------

/** Apply a mutation to the relevant id list at `loc`, returning a new spec. */
function updateListAt(
  spec: SimplifiedBuilderSpec,
  loc: SimplifiedLocation,
  transform: (ids: string[]) => string[]
): SimplifiedBuilderSpec {
  if (loc.kind === "root") {
    return { ...spec, rootOrder: transform(spec.rootOrder) };
  }
  return {
    ...spec,
    steps: spec.steps.map((s) => {
      if (s.id !== loc.parentId) return s;
      if (loc.kind === "yes" && s.kind === "condition") {
        return { ...s, yesSteps: transform(s.yesSteps) };
      }
      if (loc.kind === "no" && s.kind === "condition") {
        return { ...s, noSteps: transform(s.noSteps) };
      }
      if (loc.kind === "laneA" && s.kind === "parallel") {
        return { ...s, laneA: transform(s.laneA) };
      }
      if (loc.kind === "laneB" && s.kind === "parallel") {
        return { ...s, laneB: transform(s.laneB) };
      }
      return s;
    }),
  };
}

/**
 * Find the list that currently contains `stepId`, if any. Used for
 * deleting and reordering without asking the caller for a Location.
 */
function findContainerOf(
  spec: SimplifiedBuilderSpec,
  stepId: string
): SimplifiedLocation | null {
  const rootIdx = spec.rootOrder.indexOf(stepId);
  if (rootIdx >= 0) return { kind: "root", index: rootIdx };
  for (const s of spec.steps) {
    if (s.kind === "condition") {
      const yi = s.yesSteps.indexOf(stepId);
      if (yi >= 0) return { kind: "yes", parentId: s.id, index: yi };
      const ni = s.noSteps.indexOf(stepId);
      if (ni >= 0) return { kind: "no", parentId: s.id, index: ni };
    } else if (s.kind === "parallel") {
      const ai = s.laneA.indexOf(stepId);
      if (ai >= 0) return { kind: "laneA", parentId: s.id, index: ai };
      const bi = s.laneB.indexOf(stepId);
      if (bi >= 0) return { kind: "laneB", parentId: s.id, index: bi };
    }
  }
  return null;
}

/** Collect the transitive closure of descendants for removal purposes. */
function collectDescendants(
  spec: SimplifiedBuilderSpec,
  rootId: string
): Set<string> {
  const out = new Set<string>();
  const visit = (id: string) => {
    const step = spec.steps.find((s) => s.id === id);
    if (!step) return;
    if (step.kind === "condition") {
      for (const child of [...step.yesSteps, ...step.noSteps]) {
        out.add(child);
        visit(child);
      }
    } else if (step.kind === "parallel") {
      for (const child of [...step.laneA, ...step.laneB]) {
        out.add(child);
        visit(child);
      }
    }
  };
  visit(rootId);
  return out;
}

// ---------------------------------------------------------------------------
// Provider
// ---------------------------------------------------------------------------

interface SimplifiedBuilderProviderProps {
  children: ReactNode;
}

export function SimplifiedBuilderProvider({
  children,
}: SimplifiedBuilderProviderProps) {
  const router = useRouter();
  const {
    agent,
    setSaving,
    setDirty,
    dirty,
    setValidationResult,
    registerSaveHandler,
    registerValidateHandler,
    setRightPanelMode,
    setRightPanelOpen,
  } = useAgentWorkspace();
  const { stateConfig, envVars } = useBuilderDocument();

  const initial = useMemo(
    () => importSimplifiedBuilder(agent.flowDefinition ?? null),
    [agent]
  );

  const [spec, setSpec] = useState<SimplifiedBuilderSpec>(initial.spec);
  const [importWarnings, setImportWarnings] = useState<string[]>(initial.warnings);
  const [selectedStepId, setSelectedStepIdInternal] = useState<string | null>(
    null
  );
  const [lastSyncedUpdatedAt, setLastSyncedUpdatedAt] = useState(agent.updatedAt);

  // Reset from agent when its identity changes and there are no pending
  // edits. Adjusting state during render is the recommended pattern here —
  // see https://react.dev/learn/you-might-not-need-an-effect.
  if (!dirty && agent.updatedAt !== lastSyncedUpdatedAt) {
    const next = importSimplifiedBuilder(agent.flowDefinition ?? null);
    setSpec(next.spec);
    setImportWarnings(next.warnings);
    setSelectedStepIdInternal(null);
    setLastSyncedUpdatedAt(agent.updatedAt);
  }

  const setSelectedStepId = useCallback(
    (id: string | null) => {
      setSelectedStepIdInternal(id);
      if (id === null) {
        setRightPanelOpen(false);
      } else {
        setRightPanelMode("inspect");
        setRightPanelOpen(true);
      }
    },
    [setRightPanelMode, setRightPanelOpen]
  );

  const stepsById = useMemo(
    () => new Map(spec.steps.map((s) => [s.id, s])),
    [spec.steps]
  );

  const selectedStep = useMemo(
    () => (selectedStepId ? stepsById.get(selectedStepId) ?? null : null),
    [selectedStepId, stepsById]
  );

  const updateStep = useCallback(
    (id: string, patch: Partial<SimplifiedStep>) => {
      setSpec((prev) => ({
        ...prev,
        steps: prev.steps.map((s) =>
          s.id === id ? ({ ...s, ...patch } as SimplifiedStep) : s
        ),
      }));
      setDirty(true);
    },
    [setDirty]
  );

  const insertStep = useCallback(
    (kind: SimplifiedStepKind, location: SimplifiedLocation) => {
      const step = createStep(kind);
      setSpec((prev) => {
        const withStep = { ...prev, steps: [...prev.steps, step] };
        return updateListAt(withStep, location, (ids) => {
          const next = [...ids];
          const at = Math.min(Math.max(location.index, 0), next.length);
          next.splice(at, 0, step.id);
          return next;
        });
      });
      setDirty(true);
      return step.id;
    },
    [setDirty]
  );

  const deleteStep = useCallback(
    (id: string) => {
      setSpec((prev) => {
        const container = findContainerOf(prev, id);
        if (!container) return prev;
        const target = prev.steps.find((s) => s.id === id);
        if (!target) return prev;
        if (target.kind === "input" || target.kind === "end") {
          return prev;
        }

        const descendants = collectDescendants(prev, id);
        const toDelete = new Set<string>([id, ...descendants]);

        const removed = updateListAt(prev, container, (ids) =>
          ids.filter((x) => x !== id)
        );
        return {
          ...removed,
          steps: removed.steps.filter((s) => !toDelete.has(s.id)),
        };
      });
      setDirty(true);
      setSelectedStepIdInternal((cur) => (cur === id ? null : cur));
    },
    [setDirty]
  );

  const reorderStep = useCallback(
    (id: string, direction: "up" | "down") => {
      setSpec((prev) => {
        const container = findContainerOf(prev, id);
        if (!container) return prev;
        return updateListAt(prev, container, (ids) => {
          const idx = ids.indexOf(id);
          if (idx < 0) return ids;
          const swapIdx = direction === "up" ? idx - 1 : idx + 1;
          if (swapIdx < 0 || swapIdx >= ids.length) return ids;
          // Prevent swapping input out of position or end out of position.
          const next = [...ids];
          const other = next[swapIdx];
          const thisStep = prev.steps.find((s) => s.id === id);
          const otherStep = prev.steps.find((s) => s.id === other);
          if (thisStep?.kind === "input" || otherStep?.kind === "input") return ids;
          if (thisStep?.kind === "end" || otherStep?.kind === "end") return ids;
          next[idx] = other;
          next[swapIdx] = id;
          return next;
        });
      });
      setDirty(true);
    },
    [setDirty]
  );

  // -------------------------------------------------------------------------
  // Save handler
  // -------------------------------------------------------------------------

  useLayoutEffect(() => {
    registerSaveHandler(async () => {
      setSaving(true);
      setValidationResult([], [], false);

      try {
        validateSimplifiedBuilder(spec);
      } catch (err) {
        setValidationResult(
          [err instanceof Error ? err.message : "Invalid simplified builder"],
          [],
          false
        );
        setSaving(false);
        return;
      }

      const flowDefinition = compileSimplifiedToFlowDefinition(spec, {
        stateConfig,
        envVars,
      });
      try {
        const res = await fetch(`/api/agents/${agent.slug}`, {
          method: "PUT",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            flowDefinition,
            changelog: "Updated via simplified builder",
          }),
        });
        if (!res.ok) {
          const data = await res.json().catch(() => ({}));
          throw new Error(data.error ?? `Save failed (${res.status})`);
        }
        setValidationResult([], [], true);
        setDirty(false);
        router.refresh();
      } catch (err) {
        setValidationResult(
          [err instanceof Error ? err.message : "Save failed"],
          [],
          false
        );
      } finally {
        setSaving(false);
      }
    });
  });

  useLayoutEffect(() => {
    registerValidateHandler(() => {
      try {
        validateSimplifiedBuilder(spec);
        setValidationResult([], [], true);
      } catch (err) {
        setValidationResult(
          [err instanceof Error ? err.message : "Invalid simplified builder"],
          [],
          false
        );
      }
    });
  });

  const value = useMemo<SimplifiedBuilderContextValue>(
    () => ({
      spec,
      importWarnings,
      selectedStepId,
      setSelectedStepId,
      selectedStep,
      rootOrder: spec.rootOrder,
      stepsById,
      updateStep,
      insertStep,
      deleteStep,
      reorderStep,
    }),
    [
      spec,
      importWarnings,
      selectedStepId,
      setSelectedStepId,
      selectedStep,
      stepsById,
      updateStep,
      insertStep,
      deleteStep,
      reorderStep,
    ]
  );

  return (
    <SimplifiedBuilderContext.Provider value={value}>
      {children}
    </SimplifiedBuilderContext.Provider>
  );
}
