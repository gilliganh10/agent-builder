import type {
  FlowDefinition,
  FlowNode,
  ConversationMessage,
  FlowRunOutput,
  RunArtifact,
} from "@/db/agents/schema";
import { V2_NODE_TYPES } from "@/db/agents/schema";
import { conversationSessionRepository } from "@/repositories/conversation-session.repository";
import { parseFlowRunOutput } from "./flow/output";
import {
  coerceStructuredMessageContent,
  summarizeStructuredMessageContent,
} from "@/lib/agents/chat-message-content";

const AGENT_LIKE_TYPES = new Set<string>(["agent", ...V2_NODE_TYPES]);

/**
 * Build a conversation history array from a session's completed runs.
 *
 * For each past turn:
 * 1. The canonical user input (or rewritten version, if a rewrite occurred) becomes a
 *    { role: "user" } message
 * 2. Each completed agent-like flow step whose node has persistOutput !== false
 *    becomes a { role: "assistant" } message
 * 3. For single-shot runs, or flows that persisted no assistant step output,
 *    the run's final output becomes the assistant message fallback
 * 4. Proposal artifacts are summarised so follow-up turns can refer back to
 *    pending/applied/rejected suggestions
 *
 * Nodes default to persisted; only nodes explicitly tagged persistOutput: false
 * are excluded.
 */
export async function buildConversationHistory(
  sessionId: string,
  flowDefinition: FlowDefinition | null | undefined
): Promise<ConversationMessage[]> {
  const runs = await conversationSessionRepository.getHistory(sessionId);
  if (runs.length === 0) return [];

  const nodeMap = new Map<string, FlowNode>();
  if (flowDefinition) {
    for (const node of flowDefinition.nodes) {
      nodeMap.set(node.id, node);
    }
  }

  const messages: ConversationMessage[] = [];

  for (const run of runs) {
    let userMessage = extractConversationInput(run.input, run.meta);

    // Check if this run produced a FlowRunOutput with an effective rewrite
    const runFinalOutput = (run as { finalOutput?: string | null }).finalOutput;
    const flowOutput = parseFlowRunOutput(runFinalOutput ?? null);
    if (flowOutput?.effectiveUserMessage) {
      userMessage = flowOutput.effectiveUserMessage;
    }

    messages.push({ role: "user", content: userMessage });

    let assistantMessageCount = 0;

    for (const step of run.steps) {
      if (!step.nodeId || !step.output) continue;

      const flowNode = nodeMap.get(step.nodeId);
      if (!flowNode || !AGENT_LIKE_TYPES.has(flowNode.type)) continue;
      if (flowNode.data.persistOutput === false) continue;

      // Skip rewrite-only nodes in conversation history (their effect
      // is already reflected in the user message above)
      if (flowNode.data.canRewrite) continue;

      const content = extractMessageContent(step.output);
      if (!content) continue;

      messages.push({
        role: "assistant",
        content,
        meta: {
          nodeId: step.nodeId,
          label: flowNode.data.displayName ?? flowNode.data.label,
        },
      });
      assistantMessageCount += 1;
    }

    const proposalSummary = extractProposalSummary(run.artifacts);
    if (assistantMessageCount === 0) {
      const fallbackContent = extractAssistantContent(runFinalOutput ?? null, flowOutput, proposalSummary);
      if (fallbackContent) {
        messages.push({ role: "assistant", content: fallbackContent });
      }
      continue;
    }

    if (proposalSummary) {
      messages.push({
        role: "assistant",
        content: proposalSummary,
        meta: {
          nodeId: "proposal-summary",
          label: "Proposal Summary",
        },
      });
    }
  }

  return messages;
}

function extractConversationInput(
  rawInput: string,
  meta: Record<string, unknown> | undefined
): string {
  const conversationInput = meta?.conversationInput;
  if (typeof conversationInput === "string" && conversationInput.trim().length > 0) {
    return conversationInput;
  }
  return rawInput;
}

function extractMessageContent(output: Record<string, unknown>): string | null {
  const structuredSummary = summarizeStructuredMessageContent(
    coerceStructuredMessageContent(output.structuredContent)
  );

  if (typeof output.message === "string" && output.message.length > 0) {
    return output.message;
  }
  if (structuredSummary) {
    return structuredSummary;
  }
  const withoutMeta = { ...output };
  delete withoutMeta._display;
  delete withoutMeta._branch;
  delete withoutMeta.rewrittenMessage;
  delete withoutMeta.explanation;
  delete withoutMeta.structuredContent;
  const serialized = JSON.stringify(withoutMeta);
  return serialized !== "{}" ? serialized : null;
}

function extractAssistantContent(
  finalOutput: string | null,
  flowOutput: FlowRunOutput | null,
  proposalSummary: string | null
): string | null {
  let content: string | null = null;

  if (flowOutput?.userFacingMessage) {
    content = flowOutput.userFacingMessage;
  } else if (flowOutput?.events?.length) {
    const lastMessageEvent = [...flowOutput.events]
      .reverse()
      .find((event) => event.type === "message");
    if (lastMessageEvent && lastMessageEvent.type === "message") {
      content = lastMessageEvent.content;
    }
  } else if (finalOutput && finalOutput.length > 0) {
    content = finalOutput;
  }

  if (proposalSummary && content) {
    return `${content}\n\n${proposalSummary}`;
  }

  return content ?? proposalSummary;
}

function extractProposalSummary(artifacts: RunArtifact[] | undefined): string | null {
  if (!artifacts || artifacts.length === 0) return null;

  const proposalLines = artifacts
    .filter((artifact) => artifact.kind === "proposal")
    .map((artifact) => {
      const description = typeof artifact.data.description === "string"
        ? artifact.data.description
        : null;
      if (!description) return null;

      const op = typeof artifact.data.op === "string" ? artifact.data.op : "proposal";
      return `- ${statusLabel(artifact)} ${op}: ${description}`;
    })
    .filter((line): line is string => Boolean(line));

  if (proposalLines.length === 0) return null;

  return ["Proposal summary:", ...proposalLines].join("\n");
}

function statusLabel(artifact: RunArtifact): string {
  if (artifact.appliedAt) return "[applied]";
  if (artifact.rejected) return "[rejected]";
  if (artifact.ignoredAt) return "[ignored]";
  return "[pending]";
}
