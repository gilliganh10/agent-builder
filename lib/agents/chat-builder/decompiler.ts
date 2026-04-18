import type {
  FlowDefinition,
  FlowNode,
  FlowEdge,
  ChatBuilderSpec,
  MessageBlock,
  BlockAttachment,
  AttachmentMode,
  PrimitiveKind,
  ExtractFieldSchema,
  ExtractBlockConfig,
  BranchBlockConfig,
  ConditionConfig,
  ParallelBlockConfig,
} from "@/db/agents/schema";

type OutMap = Map<string, { target: string; handle?: string; edge: FlowEdge }[]>;

/**
 * Best-effort decompiler: converts a v2 FlowDefinition into a ChatBuilderSpec.
 * Returns the existing chatBuilder if one is already stored on the flow.
 * Returns null if the flow topology can't be represented linearly.
 */
export function decompileFlow(flow: FlowDefinition): ChatBuilderSpec | null {
  if (flow.chatBuilder) return flow.chatBuilder;
  if (flow.version !== 2) return null;

  const nodeMap = new Map(flow.nodes.map((n) => [n.id, n]));
  const outgoing = buildAdjacency(flow.edges);
  const incoming = buildReverseAdjacency(flow.edges);

  const inputNode = flow.nodes.find((n) => n.type === "input");
  const outputNode = flow.nodes.find((n) => n.type === "output");
  if (!inputNode || !outputNode) return null;

  const path = walkLinearPath(inputNode.id, outputNode.id, outgoing, nodeMap);
  if (!path) return null;

  const blocks: MessageBlock[] = [];
  let position = 0;

  let i = 0;
  while (i < path.length) {
    const node = nodeMap.get(path[i])!;

    if (node.type === "input") {
      const userBlock = createUserBlock(position, path, i, nodeMap, outgoing, flow.edges);
      if (userBlock) {
        blocks.push(userBlock.block);
        position++;
        i = userBlock.nextIndex;
        continue;
      }
      i++;
      continue;
    }

    if (node.type === "state_extractor" && node.data.extractOutputSchema) {
      const extractBlock = decompileExtractNode(node, position);
      blocks.push(extractBlock);
      position++;
      i++;
      continue;
    }

    if (node.type === "fork") {
      const parallelResult = tryDecompileParallel(node, path, i, nodeMap, outgoing, position);
      if (parallelResult) {
        blocks.push(parallelResult.block);
        position++;
        i = parallelResult.nextIndex;
        continue;
      }
      return null;
    }

    if (node.type === "condition") {
      const branchResult = tryDecompileBranch(node, path, i, nodeMap, outgoing);
      if (branchResult) {
        blocks.push(branchResult.block);
        position++;
        i = branchResult.nextIndex;
        continue;
      }
      return null;
    }

    if (node.type === "responder") {
      const block: MessageBlock = {
        id: node.id,
        type: "assistant",
        label: node.data.label ?? "Assistant Reply",
        position,
        settings: {
          displayName: node.data.displayName,
          displayColor: node.data.displayColor,
          displaySide: node.data.displaySide,
          persistOutput: node.data.persistOutput,
        },
        attachments: [],
      };
      if (node.data.inlineInstructions) {
        block.content = node.data.inlineInstructions;
      }
      blocks.push(block);
      position++;
      i++;
      continue;
    }

    if (node.type === "output" || node.type === "join") {
      i++;
      continue;
    }

    return null;
  }

  if (blocks.length === 0) return null;

  return { blocks };
}

function decompileExtractNode(node: FlowNode, position: number): MessageBlock {
  const schema = (node.data.extractOutputSchema ?? []) as ExtractFieldSchema[];
  const extractConfig: ExtractBlockConfig = {
    instructions: node.data.inlineInstructions ?? "",
    outputSchema: schema,
    ...(node.data.inlineModel ? { model: node.data.inlineModel } : {}),
    ...(node.data.varsRead?.length ? { varsRead: node.data.varsRead as string[] } : {}),
    ...(node.data.varsPatch && Object.keys(node.data.varsPatch).length > 0
      ? { varsPatch: node.data.varsPatch as Record<string, string> }
      : {}),
  };

  return {
    id: node.id,
    type: "extract",
    label: node.data.label ?? "Extract",
    position,
    settings: {},
    attachments: [],
    extractConfig,
  };
}

function walkToJoin(
  startId: string,
  outgoing: OutMap,
  nodeMap: Map<string, FlowNode>
): string | null {
  let current = startId;
  const visited = new Set<string>();
  while (current && !visited.has(current)) {
    visited.add(current);
    const node = nodeMap.get(current);
    if (!node) break;
    if (node.type === "join") return current;
    const nextOuts = outgoing.get(current) ?? [];
    if (nextOuts.length !== 1) break;
    current = nextOuts[0].target;
  }
  return null;
}

function findParallelJoinNode(
  forkId: string,
  outgoing: OutMap,
  nodeMap: Map<string, FlowNode>
): string | null {
  const outs = outgoing.get(forkId) ?? [];
  const la = outs.find((o) => o.handle === "laneA" || o.edge.data?.branch === "laneA");
  const lb = outs.find((o) => o.handle === "laneB" || o.edge.data?.branch === "laneB");
  if (!la || !lb) return null;
  const ja = walkToJoin(la.target, outgoing, nodeMap);
  const jb = walkToJoin(lb.target, outgoing, nodeMap);
  if (!ja || !jb || ja !== jb) return null;
  return ja;
}

function tryDecompileParallel(
  forkNode: FlowNode,
  path: string[],
  forkIdx: number,
  nodeMap: Map<string, FlowNode>,
  outgoing: OutMap,
  position: number
): { block: MessageBlock; nextIndex: number } | null {
  const joinId = findParallelJoinNode(forkNode.id, outgoing, nodeMap);
  if (!joinId) return null;

  const outs = outgoing.get(forkNode.id) ?? [];
  const la = outs.find((o) => o.handle === "laneA" || o.edge.data?.branch === "laneA");
  const lb = outs.find((o) => o.handle === "laneB" || o.edge.data?.branch === "laneB");
  if (!la || !lb) return null;

  const laneA = decompileBranchArm(la.target, joinId, nodeMap, outgoing);
  const laneB = decompileBranchArm(lb.target, joinId, nodeMap, outgoing);

  const parallelConfig: ParallelBlockConfig = {
    laneA,
    laneB,
  };

  const joinIdx = path.indexOf(joinId, forkIdx);
  const nextIndex = joinIdx >= 0 ? joinIdx + 1 : forkIdx + 1;

  return {
    block: {
      id: forkNode.id,
      type: "parallel",
      label: forkNode.data.label ?? "Parallel",
      position,
      settings: {},
      attachments: [],
      parallelConfig,
    },
    nextIndex,
  };
}

function tryDecompileBranch(
  condNode: FlowNode,
  path: string[],
  condIdx: number,
  nodeMap: Map<string, FlowNode>,
  outgoing: OutMap
): { block: MessageBlock; nextIndex: number } | null {
  const outs = outgoing.get(condNode.id) ?? [];
  const trueOut = outs.find((o) => o.handle === "true" || o.edge.data?.branch === "true");
  const falseOut = outs.find((o) => o.handle === "false" || o.edge.data?.branch === "false");
  if (!trueOut || !falseOut) return null;

  const condition = condNode.data.condition as ConditionConfig | undefined;
  if (!condition) return null;

  const joinNodeId = findJoinNode(condNode.id, outgoing, nodeMap);
  if (!joinNodeId) return null;

  const trueBlocks = decompileBranchArm(trueOut.target, joinNodeId, nodeMap, outgoing);
  const falseBlocks = decompileBranchArm(falseOut.target, joinNodeId, nodeMap, outgoing);

  const branchConfig: BranchBlockConfig = {
    condition,
    trueBranch: trueBlocks,
    falseBranch: falseBlocks,
  };

  const joinIdx = path.indexOf(joinNodeId, condIdx);
  const nextIndex = joinIdx >= 0 ? joinIdx + 1 : condIdx + 1;

  return {
    block: {
      id: condNode.id,
      type: "branch",
      label: condNode.data.label ?? "Branch",
      position: 0,
      settings: {},
      attachments: [],
      branchConfig,
    },
    nextIndex,
  };
}

function findJoinNode(
  condId: string,
  outgoing: OutMap,
  nodeMap: Map<string, FlowNode>
): string | null {
  const outs = outgoing.get(condId) ?? [];
  for (const out of outs) {
    let current = out.target;
    const visited = new Set<string>();
    while (current && !visited.has(current)) {
      visited.add(current);
      const node = nodeMap.get(current);
      if (!node) break;
      if (node.type === "join") return current;
      const nextOuts = outgoing.get(current) ?? [];
      if (nextOuts.length !== 1) break;
      current = nextOuts[0].target;
    }
  }
  return null;
}

function decompileBranchArm(
  startId: string,
  joinId: string,
  nodeMap: Map<string, FlowNode>,
  outgoing: OutMap
): MessageBlock[] {
  if (startId === joinId) return [];

  const blocks: MessageBlock[] = [];
  let current = startId;
  let position = 0;
  const visited = new Set<string>();

  while (current && current !== joinId && !visited.has(current)) {
    visited.add(current);
    const node = nodeMap.get(current);
    if (!node) break;

    if (node.type === "responder") {
      const block: MessageBlock = {
        id: node.id,
        type: "assistant",
        label: node.data.label ?? "Assistant Reply",
        position,
        settings: {
          displayName: node.data.displayName,
          displayColor: node.data.displayColor,
          displaySide: node.data.displaySide,
          persistOutput: node.data.persistOutput,
        },
        attachments: [],
      };
      if (node.data.inlineInstructions) {
        block.content = node.data.inlineInstructions;
      }
      blocks.push(block);
      position++;
    } else if (node.type === "state_extractor" && node.data.extractOutputSchema) {
      blocks.push(decompileExtractNode(node, position));
      position++;
    }

    const nextOuts = outgoing.get(current) ?? [];
    if (nextOuts.length !== 1) break;
    current = nextOuts[0].target;
  }

  return blocks;
}

function createUserBlock(
  position: number,
  path: string[],
  startIdx: number,
  nodeMap: Map<string, FlowNode>,
  outgoing: Map<string, { target: string; handle?: string; edge: FlowEdge }[]>,
  edges: FlowEdge[]
): { block: MessageBlock; nextIndex: number } | null {
  const attachments: BlockAttachment[] = [];
  let i = startIdx + 1;

  while (i < path.length) {
    const node = nodeMap.get(path[i])!;

    if (node.type === "responder" || node.type === "output") break;

    if (node.type === "researcher" || node.type === "actor") {
      attachments.push(nodeToAttachment(node, "after"));
      i++;
      continue;
    }

    if (node.type === "condition") {
      const overrideResult = tryExtractOverride(node, path, i, nodeMap, outgoing, edges);
      if (overrideResult) {
        attachments.push(overrideResult.attachment);
        i = overrideResult.nextIndex;
        continue;
      }
      return null;
    }

    if (node.type === "join") {
      i++;
      continue;
    }

    return null;
  }

  return {
    block: {
      id: `user-block-${position}`,
      type: "user",
      label: "User Message",
      position,
      settings: { canRewrite: attachments.some((a) => a.mode === "override") },
      attachments,
    },
    nextIndex: i,
  };
}

function tryExtractOverride(
  condNode: FlowNode,
  path: string[],
  condIdx: number,
  nodeMap: Map<string, FlowNode>,
  outgoing: Map<string, { target: string; handle?: string; edge: FlowEdge }[]>,
  _edges: FlowEdge[]
): { attachment: BlockAttachment; nextIndex: number } | null {
  const outs = outgoing.get(condNode.id) ?? [];
  const trueTarget = outs.find((o) => o.handle === "true" || o.edge.data?.branch === "true");
  const falseTarget = outs.find((o) => o.handle === "false" || o.edge.data?.branch === "false");

  if (!trueTarget || !falseTarget) return null;

  const rewriterNode = nodeMap.get(trueTarget.target);
  if (!rewriterNode || rewriterNode.type !== "rewriter") return null;

  const rewriterOuts = outgoing.get(rewriterNode.id) ?? [];
  if (rewriterOuts.length !== 1) return null;

  const joinNodeId = rewriterOuts[0].target;
  const joinNode = nodeMap.get(joinNodeId);
  if (!joinNode || joinNode.type !== "join") return null;

  if (falseTarget.target !== joinNodeId) return null;

  const att: BlockAttachment = {
    id: rewriterNode.id,
    mode: "override",
    label: rewriterNode.data.label ?? "Override",
    condition: condNode.data.condition,
    ...(rewriterNode.data.primitiveId ? { primitiveId: rewriterNode.data.primitiveId } : {}),
    ...buildInlinePrimitiveFromNode(rewriterNode),
    ...(rewriterNode.data.displayName ? { displayName: rewriterNode.data.displayName } : {}),
    ...(rewriterNode.data.displayColor ? { displayColor: rewriterNode.data.displayColor } : {}),
    ...(rewriterNode.data.varsPatch && Object.keys(rewriterNode.data.varsPatch).length > 0
      ? { varsPatch: rewriterNode.data.varsPatch as Record<string, string> }
      : {}),
  };

  const joinIdx = path.indexOf(joinNodeId, condIdx);
  return {
    attachment: att,
    nextIndex: joinIdx >= 0 ? joinIdx + 1 : condIdx + 4,
  };
}

function buildInlinePrimitiveFromNode(
  node: FlowNode
): { inlinePrimitive?: { kind: PrimitiveKind; instructions: string; model?: string } } {
  if (!node.data.inlineInstructions) return {};
  const kind = (node.data.primitiveKind ?? node.type) as PrimitiveKind;
  return {
    inlinePrimitive: {
      kind,
      instructions: node.data.inlineInstructions,
      ...(node.data.inlineModel ? { model: node.data.inlineModel } : {}),
    },
  };
}

function nodeToAttachment(node: FlowNode, mode: AttachmentMode): BlockAttachment {
  return {
    id: node.id,
    mode,
    label: node.data.label ?? node.type,
    ...(node.data.primitiveId ? { primitiveId: node.data.primitiveId } : {}),
    ...buildInlinePrimitiveFromNode(node),
    ...(node.data.varsRead?.length ? { varsRead: node.data.varsRead as string[] } : {}),
    ...(node.data.varsPatch && Object.keys(node.data.varsPatch).length > 0
      ? { varsPatch: node.data.varsPatch as Record<string, string> }
      : {}),
    ...(node.data.displayName ? { displayName: node.data.displayName } : {}),
    ...(node.data.displayColor ? { displayColor: node.data.displayColor } : {}),
  };
}

/**
 * Walk from start to end through the DAG, collecting the main linear path.
 */
function walkLinearPath(
  startId: string,
  endId: string,
  outgoing: Map<string, { target: string; handle?: string; edge: FlowEdge }[]>,
  nodeMap: Map<string, FlowNode>
): string[] | null {
  const path: string[] = [];
  const visited = new Set<string>();
  let current = startId;

  while (current) {
    if (visited.has(current)) return null;
    visited.add(current);
    path.push(current);

    if (current === endId) return path;

    const node = nodeMap.get(current);
    if (!node) return null;

    const outs = outgoing.get(current) ?? [];

    if (node.type === "condition") {
      const falseOut = outs.find((o) => o.handle === "false" || o.edge.data?.branch === "false");
      const trueOut = outs.find((o) => o.handle === "true" || o.edge.data?.branch === "true");

      if (trueOut && falseOut) {
        // Override pattern: condition -> rewriter -> join, false -> join
        const rewriterNode = nodeMap.get(trueOut.target);
        if (rewriterNode && rewriterNode.type === "rewriter") {
          path.push(trueOut.target);
          const rewriterOuts = outgoing.get(trueOut.target) ?? [];
          if (rewriterOuts.length === 1 && falseOut.target === rewriterOuts[0].target) {
            current = rewriterOuts[0].target;
            continue;
          }
        }

        // Branch pattern: condition -> true branch -> join, false branch -> join
        const joinId = findJoinNode(current, outgoing, nodeMap);
        if (joinId) {
          current = joinId;
          continue;
        }

        current = falseOut.target;
        continue;
      }

      if (outs.length === 1) {
        current = outs[0].target;
        continue;
      }
      return null;
    }

    if (node.type === "fork") {
      const joinId = findParallelJoinNode(current, outgoing, nodeMap);
      if (!joinId) return null;
      current = joinId;
      continue;
    }

    if (outs.length === 0) return null;
    if (outs.length > 1) return null;
    current = outs[0].target;
  }

  return null;
}

function buildAdjacency(
  edges: FlowEdge[]
): Map<string, { target: string; handle?: string; edge: FlowEdge }[]> {
  const map = new Map<string, { target: string; handle?: string; edge: FlowEdge }[]>();
  for (const e of edges) {
    const list = map.get(e.source) ?? [];
    list.push({ target: e.target, handle: e.sourceHandle, edge: e });
    map.set(e.source, list);
  }
  return map;
}

function buildReverseAdjacency(
  edges: FlowEdge[]
): Map<string, { source: string; edge: FlowEdge }[]> {
  const map = new Map<string, { source: string; edge: FlowEdge }[]>();
  for (const e of edges) {
    const list = map.get(e.target) ?? [];
    list.push({ source: e.source, edge: e });
    map.set(e.target, list);
  }
  return map;
}
