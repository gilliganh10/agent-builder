import type { RunArtifact } from "@/db/agents/schema";
import type {
  ProposalCreatedPayload,
  ProposalStatusUpdatedPayload,
  ProposalStreamStatus,
} from "./types";
import type { RunEventSink } from "./sink";

const sinksByRunId = new Map<string, RunEventSink>();

export function registerProposalLifecycleSink(runId: string, sink: RunEventSink): () => void {
  sinksByRunId.set(runId, sink);
  return () => {
    const current = sinksByRunId.get(runId);
    if (current === sink) {
      sinksByRunId.delete(runId);
    }
  };
}

function parseSectionPath(value: unknown): string[] | undefined {
  if (!Array.isArray(value)) return undefined;
  const out = value.filter((x): x is string => typeof x === "string" && x.length > 0);
  return out.length > 0 ? out : undefined;
}

function toProposalCreatedPayload(artifact: RunArtifact): ProposalCreatedPayload {
  const data = artifact.data as Record<string, unknown>;
  const headingRaw = data.heading;
  const heading =
    headingRaw === null
      ? null
      : typeof headingRaw === "string"
        ? headingRaw
        : undefined;
  return {
    runId: artifact.runId,
    proposalId: artifact.id,
    artifactId: artifact.id,
    fileId: typeof data.fileId === "string" ? data.fileId : undefined,
    path: typeof data.path === "string" ? data.path : undefined,
    targetType: artifact.targetType ?? undefined,
    kind: typeof data.kind === "string" ? data.kind : artifact.targetType ?? undefined,
    op: typeof data.op === "string" ? data.op : undefined,
    content: typeof data.content === "string" ? data.content : undefined,
    title: typeof data.title === "string" ? data.title : undefined,
    heading,
    sectionPath: parseSectionPath(data.sectionPath),
    status: "created",
    baseRevision: typeof data.baseRevision === "number" ? data.baseRevision : undefined,
    isNewFile: data.op === "create_file" ? true : undefined,
    summary: typeof data.description === "string" ? data.description : undefined,
  };
}

function toProposalStatusPayload(
  artifact: RunArtifact,
  status: Exclude<ProposalStreamStatus, "created">
): ProposalStatusUpdatedPayload {
  return {
    runId: artifact.runId,
    proposalId: artifact.id,
    artifactId: artifact.id,
    status,
  };
}

export function emitProposalCreated(artifact: RunArtifact): void {
  const sink = sinksByRunId.get(artifact.runId);
  if (!sink || artifact.kind !== "proposal") return;
  sink.emit("proposal_created", toProposalCreatedPayload(artifact));
}

export function emitProposalStatusUpdated(
  artifact: RunArtifact,
  status: Exclude<ProposalStreamStatus, "created">
): void {
  const sink = sinksByRunId.get(artifact.runId);
  if (!sink || artifact.kind !== "proposal") return;
  sink.emit("proposal_status_updated", toProposalStatusPayload(artifact, status));
}
