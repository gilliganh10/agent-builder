import { z } from "zod";

// ---------------------------------------------------------------------------
// SSE event envelope — v1
// ---------------------------------------------------------------------------

export const SSE_SCHEMA_VERSION = 1;

export type SseEventType =
  | "ready"
  | "message"
  | "delta"
  | "stage"
  | "progress"
  | "run_step"
  | "proposal_created"
  | "proposal_status_updated"
  | "done"
  | "error";

export interface SseEnvelope<T = unknown> {
  v: number;
  type: SseEventType;
  runId: string;
  sessionId: string | null;
  sequence: number;
  payload: T;
}

// -- Payload types ----------------------------------------------------------

export interface ReadyPayload {
  runId: string;
}

export interface MessagePayload {
  nodeId: string;
  content: string;
  lane?: string;
  display?: {
    nodeId: string;
    name: string;
    color: string | null;
    side: "left" | "right";
  };
}

export interface DeltaPayload {
  runId: string;
  nodeId: string;
  lane?: "main" | "sidecar";
  text: string;
  sequence: number;
  display?: MessagePayload["display"];
}

export interface StagePayload {
  name: string;
  nodeId?: string;
  detail?: string;
}

export interface ProgressPayload {
  nodeId: string;
  status: "started" | "completed" | "skipped" | "failed";
  durationMs?: number;
}

export interface RunStepPayload {
  stepIndex: number;
  nodeId: string;
  status: string;
}

export type ProposalStreamStatus = "created" | "applied" | "rejected" | "ignored";

export interface ProposalCreatedPayload {
  runId: string;
  proposalId: string;
  artifactId?: string;
  fileId?: string;
  path?: string;
  targetType?: string;
  /** Legacy: artifact target kind / targetType; prefer `op` for project file patches. */
  kind?: string;
  /** Project file patch op when kind is proposal (e.g. replace_heading_section). */
  op?: string;
  content?: string;
  title?: string;
  heading?: string | null;
  sectionPath?: string[];
  status: "created";
  baseRevision?: number;
  isNewFile?: boolean;
  summary?: string;
}

export interface ProposalStatusUpdatedPayload {
  runId: string;
  proposalId: string;
  artifactId?: string;
  status: Exclude<ProposalStreamStatus, "created">;
}

export interface DonePayload {
  runId: string;
  sessionId: string | null;
  finalOutput: string | null;
  artifacts?: unknown[];
  meta?: Record<string, unknown>;
}

export interface ErrorPayload {
  code?: string;
  message: string;
}

// -- Zod schemas for validation ---------------------------------------------

const sseEventTypeSchema = z.enum([
  "ready",
  "message",
  "delta",
  "stage",
  "progress",
  "run_step",
  "proposal_created",
  "proposal_status_updated",
  "done",
  "error",
]);

export const sseEnvelopeSchema = z.object({
  v: z.number().int().min(1),
  type: sseEventTypeSchema,
  runId: z.string().min(1),
  sessionId: z.string().nullable(),
  sequence: z.number().int().min(0),
  payload: z.unknown(),
});

export const readyPayloadSchema = z.object({
  runId: z.string().min(1),
});

export const messagePayloadSchema = z.object({
  nodeId: z.string().min(1),
  content: z.string(),
  lane: z.string().optional(),
  display: z
    .object({
      nodeId: z.string(),
      name: z.string(),
      color: z.string().nullable(),
      side: z.enum(["left", "right"]),
    })
    .optional(),
});

export const deltaPayloadSchema = z.object({
  runId: z.string().min(1),
  nodeId: z.string().min(1),
  lane: z.enum(["main", "sidecar"]).optional(),
  text: z.string(),
  sequence: z.number().int().min(0),
  display: z
    .object({
      nodeId: z.string(),
      name: z.string(),
      color: z.string().nullable(),
      side: z.enum(["left", "right"]),
    })
    .optional(),
});

export const donePayloadSchema = z.object({
  runId: z.string().min(1),
  sessionId: z.string().nullable(),
  finalOutput: z.string().nullable(),
  artifacts: z.array(z.unknown()).optional(),
  meta: z.record(z.string(), z.unknown()).optional(),
});

export const proposalCreatedPayloadSchema = z.object({
  runId: z.string().min(1),
  proposalId: z.string().min(1),
  artifactId: z.string().min(1).optional(),
  fileId: z.string().min(1).optional(),
  path: z.string().min(1).optional(),
  targetType: z.string().min(1).optional(),
  kind: z.string().min(1).optional(),
  op: z.string().min(1).optional(),
  content: z.string().optional(),
  title: z.string().min(1).optional(),
  heading: z.string().nullable().optional(),
  sectionPath: z.array(z.string().min(1)).optional(),
  status: z.literal("created"),
  baseRevision: z.number().int().optional(),
  isNewFile: z.boolean().optional(),
  summary: z.string().optional(),
});

export const proposalStatusUpdatedPayloadSchema = z.object({
  runId: z.string().min(1),
  proposalId: z.string().min(1),
  artifactId: z.string().min(1).optional(),
  status: z.enum(["applied", "rejected", "ignored"]),
});

export const errorPayloadSchema = z.object({
  code: z.string().optional(),
  message: z.string(),
});
