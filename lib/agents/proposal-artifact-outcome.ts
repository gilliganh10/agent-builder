import { z } from "zod";
import type { RunArtifact } from "@/db/agents/schema";

/**
 * Optional client-supplied materialization for project-file-style proposals
 * (inline review / diff). Same shape as apply route `outcomes` entries.
 */
export const proposalArtifactMaterializationSchema = z.object({
  userEdited: z.boolean(),
  originalMaterializedMarkdown: z.string(),
  finalMaterializedMarkdown: z.string(),
});

export type ProposalArtifactMaterialization = z.infer<
  typeof proposalArtifactMaterializationSchema
>;

/** Per-inline-hunk decision while reviewing a single RunArtifact. */
export interface HunkDecisionEntry {
  hunkId: string;
  disposition: "accepted" | "rejected";
  recordedAt: string;
  decidedBy?: string;
}

/** Versioned JSON stored in RunArtifact.proposalOutcome (apply + reject + partial review). */
export interface ProposalArtifactOutcomeV1 {
  version: 1;
  disposition: "pending" | "applied" | "rejected" | "partial";
  recordedAt: string;
  snapshot: ProposalArtifactSnapshotV1;
  hunkDecisions?: HunkDecisionEntry[];
  userEdited?: boolean;
  originalMaterializedMarkdown?: string;
  finalMaterializedMarkdown?: string;
  rejectedReason?: string;
}

export interface ProposalArtifactSnapshotV1 {
  artifactId: string;
  runId: string;
  kind: string;
  targetType: string | null;
  targetId: string | null;
  data: Record<string, unknown>;
}

function cloneJson<T>(value: T): T {
  return JSON.parse(JSON.stringify(value)) as T;
}

export function proposalSnapshotFromArtifact(artifact: RunArtifact): ProposalArtifactSnapshotV1 {
  return {
    artifactId: artifact.id,
    runId: artifact.runId,
    kind: artifact.kind,
    targetType: artifact.targetType ?? null,
    targetId: artifact.targetId ?? null,
    data: cloneJson(artifact.data ?? {}),
  };
}

function isOutcomeLockedForReview(outcome: Record<string, unknown> | null): boolean {
  if (!outcome || typeof outcome !== "object") return false;
  const d = outcome.disposition;
  return d === "applied" || d === "rejected" || d === "partial";
}

/**
 * Merge one hunk decision into proposalOutcome while review is in progress.
 * Does not set appliedAt/rejected on the row (caller uses repository merge only).
 */
export function mergeHunkDecisionIntoOutcome(
  existing: Record<string, unknown> | null,
  artifact: RunArtifact,
  entry: HunkDecisionEntry
): Record<string, unknown> {
  if (isOutcomeLockedForReview(existing)) {
    throw new Error("Proposal outcome is already finalized");
  }
  const base = existing && typeof existing === "object" ? { ...existing } : {};
  const rawList = base.hunkDecisions;
  const hunkDecisions: HunkDecisionEntry[] = Array.isArray(rawList)
    ? rawList.map((h) => ({ ...(h as HunkDecisionEntry) }))
    : [];
  const idx = hunkDecisions.findIndex((h) => h.hunkId === entry.hunkId);
  if (idx >= 0) {
    hunkDecisions[idx] = entry;
  } else {
    hunkDecisions.push(entry);
  }

  const snapshot =
    base.snapshot && typeof base.snapshot === "object"
      ? (base.snapshot as ProposalArtifactSnapshotV1)
      : proposalSnapshotFromArtifact(artifact);

  return {
    version: 1,
    disposition: "pending",
    recordedAt: entry.recordedAt,
    snapshot,
    hunkDecisions,
  };
}

export type FinalReviewClassification = {
  disposition: "applied" | "rejected" | "partial";
  anyAccepted: boolean;
  allRejected: boolean;
};

export function classifyHunkDecisions(
  decisions: HunkDecisionEntry[]
): FinalReviewClassification {
  const accepted = decisions.filter((h) => h.disposition === "accepted").length;
  const rejected = decisions.filter((h) => h.disposition === "rejected").length;
  if (accepted + rejected !== decisions.length || decisions.length === 0) {
    throw new Error("Invalid or empty hunk decisions");
  }
  if (accepted === 0) {
    return { disposition: "rejected", anyAccepted: false, allRejected: true };
  }
  if (rejected === 0) {
    return { disposition: "applied", anyAccepted: true, allRejected: false };
  }
  return { disposition: "partial", anyAccepted: true, allRejected: false };
}

/**
 * Build finalized proposalOutcome after all hunks are resolved (applied / rejected / partial).
 */
export function buildFinalProposalReviewOutcome(
  artifact: RunArtifact,
  hunkDecisions: HunkDecisionEntry[],
  options?: {
    materialization?: ProposalArtifactMaterialization;
    recordedAt?: string;
  }
): Record<string, unknown> {
  const classification = classifyHunkDecisions(hunkDecisions);
  const recordedAt = options?.recordedAt ?? new Date().toISOString();
  const out: Record<string, unknown> = {
    version: 1,
    disposition: classification.disposition,
    recordedAt,
    snapshot: proposalSnapshotFromArtifact(artifact),
    hunkDecisions: [...hunkDecisions],
  };
  if (options?.materialization) {
    out.userEdited = options.materialization.userEdited;
    out.originalMaterializedMarkdown = options.materialization.originalMaterializedMarkdown;
    out.finalMaterializedMarkdown = options.materialization.finalMaterializedMarkdown;
  }
  return out;
}

export function buildProposalOutcomeApplied(
  artifact: RunArtifact,
  options?: {
    materialization?: ProposalArtifactMaterialization;
    recordedAt?: string;
    hunkDecisions?: HunkDecisionEntry[];
  }
): Record<string, unknown> {
  const recordedAt = options?.recordedAt ?? new Date().toISOString();
  const out: Record<string, unknown> = {
    version: 1,
    disposition: "applied",
    recordedAt,
    snapshot: proposalSnapshotFromArtifact(artifact),
  };
  if (options?.hunkDecisions?.length) {
    out.hunkDecisions = [...options.hunkDecisions];
  }
  if (options?.materialization) {
    out.userEdited = options.materialization.userEdited;
    out.originalMaterializedMarkdown = options.materialization.originalMaterializedMarkdown;
    out.finalMaterializedMarkdown = options.materialization.finalMaterializedMarkdown;
  }
  return out;
}

export function buildProposalOutcomeRejected(
  artifact: RunArtifact,
  options?: {
    materialization?: ProposalArtifactMaterialization;
    rejectedReason?: string | null;
    recordedAt?: string;
    hunkDecisions?: HunkDecisionEntry[];
  }
): Record<string, unknown> {
  const recordedAt = options?.recordedAt ?? new Date().toISOString();
  const out: Record<string, unknown> = {
    version: 1,
    disposition: "rejected",
    recordedAt,
    snapshot: proposalSnapshotFromArtifact(artifact),
  };
  if (options?.rejectedReason) {
    out.rejectedReason = options.rejectedReason;
  }
  if (options?.hunkDecisions?.length) {
    out.hunkDecisions = [...options.hunkDecisions];
  }
  if (options?.materialization) {
    out.userEdited = options.materialization.userEdited;
    out.originalMaterializedMarkdown = options.materialization.originalMaterializedMarkdown;
    out.finalMaterializedMarkdown = options.materialization.finalMaterializedMarkdown;
  }
  return out;
}

export function appliedProposalOutcome(
  artifact: RunArtifact,
  outcomes: Record<string, ProposalArtifactMaterialization> | undefined,
  artifactId: string
): Record<string, unknown> {
  return buildProposalOutcomeApplied(artifact, {
    materialization: outcomes?.[artifactId],
  });
}
