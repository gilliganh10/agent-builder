import type {
  BranchBlockConfig,
  MessageBlock,
  ParallelBlockConfig,
} from "@/db/agents/schema";

export type BranchKey = "trueBranch" | "falseBranch";

/** DFS: find a block by id anywhere in the tree (top-level or inside branch/parallel). */
export function findBlockById(
  blocks: MessageBlock[],
  id: string
): MessageBlock | null {
  for (const b of blocks) {
    if (b.id === id) return b;
    if (b.type === "branch" && b.branchConfig) {
      const found = findInBranchConfig(b.branchConfig, id);
      if (found) return found;
    }
    if (b.type === "parallel" && b.parallelConfig) {
      const found = findInParallelConfig(b.parallelConfig, id);
      if (found) return found;
    }
  }
  return null;
}

function findInBranchConfig(cfg: BranchBlockConfig, id: string): MessageBlock | null {
  for (const br of [cfg.trueBranch, cfg.falseBranch]) {
    for (const child of br) {
      if (child.id === id) return child;
      if (child.type === "branch" && child.branchConfig) {
        const d = findInBranchConfig(child.branchConfig, id);
        if (d) return d;
      }
      if (child.type === "parallel" && child.parallelConfig) {
        const d = findInParallelConfig(child.parallelConfig, id);
        if (d) return d;
      }
    }
  }
  return null;
}

function findInParallelConfig(cfg: ParallelBlockConfig, id: string): MessageBlock | null {
  for (const lane of [cfg.laneA, cfg.laneB]) {
    for (const child of lane) {
      if (child.id === id) return child;
      if (child.type === "branch" && child.branchConfig) {
        const d = findInBranchConfig(child.branchConfig, id);
        if (d) return d;
      }
      if (child.type === "parallel" && child.parallelConfig) {
        const d = findInParallelConfig(child.parallelConfig, id);
        if (d) return d;
      }
    }
  }
  return null;
}

/** True if `id` appears in the top-level blocks array only. */
export function isTopLevelBlock(blocks: MessageBlock[], id: string): boolean {
  return blocks.some((b) => b.id === id);
}

/** First user block when sorted by position (canonical pipeline entry). */
export function getCanonicalUserBlockId(blocks: MessageBlock[]): string | null {
  const sorted = [...blocks].sort((a, b) => a.position - b.position);
  const user = sorted.find((b) => b.type === "user");
  return user?.id ?? null;
}

function mapNestedBlock(
  block: MessageBlock,
  targetId: string,
  fn: (b: MessageBlock) => MessageBlock
): MessageBlock {
  if (block.id === targetId) return fn(block);
  if (block.type === "branch" && block.branchConfig) {
    const cfg = mapBranchConfig(block.branchConfig, targetId, fn);
    if (cfg !== block.branchConfig) return { ...block, branchConfig: cfg };
  }
  if (block.type === "parallel" && block.parallelConfig) {
    const cfg = mapParallelConfig(block.parallelConfig, targetId, fn);
    if (cfg !== block.parallelConfig) return { ...block, parallelConfig: cfg };
  }
  return block;
}

function mapBranchConfig(
  cfg: BranchBlockConfig,
  targetId: string,
  fn: (b: MessageBlock) => MessageBlock
): BranchBlockConfig {
  const mapArr = (arr: MessageBlock[]) =>
    arr.map((c) => mapNestedBlock(c, targetId, fn));
  const trueBranch = mapArr(cfg.trueBranch);
  const falseBranch = mapArr(cfg.falseBranch);
  if (
    trueBranch === cfg.trueBranch &&
    falseBranch === cfg.falseBranch
  ) {
    return cfg;
  }
  return { ...cfg, trueBranch, falseBranch };
}

function mapParallelConfig(
  cfg: ParallelBlockConfig,
  targetId: string,
  fn: (b: MessageBlock) => MessageBlock
): ParallelBlockConfig {
  const laneA = cfg.laneA.map((c) => mapNestedBlock(c, targetId, fn));
  const laneB = cfg.laneB.map((c) => mapNestedBlock(c, targetId, fn));
  if (laneA === cfg.laneA && laneB === cfg.laneB) return cfg;
  return { ...cfg, laneA, laneB };
}

export function updateBlockDeep(
  blocks: MessageBlock[],
  targetId: string,
  patch: Partial<MessageBlock>
): MessageBlock[] {
  return blocks.map((b) => mapNestedBlock(b, targetId, (x) => ({ ...x, ...patch })));
}

function transformNestedDelete(block: MessageBlock, targetId: string): MessageBlock {
  if (block.type === "branch" && block.branchConfig) {
    const cfg = block.branchConfig;
    return {
      ...block,
      branchConfig: {
        ...cfg,
        trueBranch: deleteBlockDeep(cfg.trueBranch, targetId),
        falseBranch: deleteBlockDeep(cfg.falseBranch, targetId),
      },
    };
  }
  if (block.type === "parallel" && block.parallelConfig) {
    const cfg = block.parallelConfig;
    return {
      ...block,
      parallelConfig: {
        ...cfg,
        laneA: deleteBlockDeep(cfg.laneA, targetId),
        laneB: deleteBlockDeep(cfg.laneB, targetId),
      },
    };
  }
  return block;
}

export function deleteBlockDeep(blocks: MessageBlock[], targetId: string): MessageBlock[] {
  return blocks
    .filter((b) => b.id !== targetId)
    .map((b) => transformNestedDelete(b, targetId));
}

export function appendChildToBranch(
  blocks: MessageBlock[],
  parentId: string,
  branch: BranchKey,
  child: MessageBlock
): MessageBlock[] {
  return blocks.map((b) => appendChildToBranchInBlock(b, parentId, branch, child));
}

function appendChildToBranchInBlock(
  block: MessageBlock,
  parentId: string,
  branch: BranchKey,
  child: MessageBlock
): MessageBlock {
  if (block.id === parentId && block.type === "branch" && block.branchConfig) {
    const cfg = block.branchConfig;
    const arr = [...cfg[branch], { ...child, position: cfg[branch].length }];
    return { ...block, branchConfig: { ...cfg, [branch]: arr } };
  }
  if (block.type === "branch" && block.branchConfig) {
    const cfg = block.branchConfig;
    return {
      ...block,
      branchConfig: {
        ...cfg,
        trueBranch: cfg.trueBranch.map((c) =>
          appendChildToBranchInBlock(c, parentId, branch, child)
        ),
        falseBranch: cfg.falseBranch.map((c) =>
          appendChildToBranchInBlock(c, parentId, branch, child)
        ),
      },
    };
  }
  if (block.type === "parallel" && block.parallelConfig) {
    const cfg = block.parallelConfig;
    return {
      ...block,
      parallelConfig: {
        laneA: cfg.laneA.map((c) =>
          appendChildToBranchInBlock(c, parentId, branch, child)
        ),
        laneB: cfg.laneB.map((c) =>
          appendChildToBranchInBlock(c, parentId, branch, child)
        ),
      },
    };
  }
  return block;
}

export type ParallelLane = "laneA" | "laneB";

export function appendChildToParallelLane(
  blocks: MessageBlock[],
  parentId: string,
  lane: ParallelLane,
  child: MessageBlock
): MessageBlock[] {
  return blocks.map((b) => appendChildToParallelInBlock(b, parentId, lane, child));
}

function appendChildToParallelInBlock(
  block: MessageBlock,
  parentId: string,
  lane: ParallelLane,
  child: MessageBlock
): MessageBlock {
  if (block.id === parentId && block.type === "parallel" && block.parallelConfig) {
    const cfg = block.parallelConfig;
    const arr = [...cfg[lane], { ...child, position: cfg[lane].length }];
    return { ...block, parallelConfig: { ...cfg, [lane]: arr } };
  }
  if (block.type === "branch" && block.branchConfig) {
    const cfg = block.branchConfig;
    return {
      ...block,
      branchConfig: {
        ...cfg,
        trueBranch: cfg.trueBranch.map((c) =>
          appendChildToParallelInBlock(c, parentId, lane, child)
        ),
        falseBranch: cfg.falseBranch.map((c) =>
          appendChildToParallelInBlock(c, parentId, lane, child)
        ),
      },
    };
  }
  if (block.type === "parallel" && block.parallelConfig) {
    const cfg = block.parallelConfig;
    return {
      ...block,
      parallelConfig: {
        laneA: cfg.laneA.map((c) =>
          appendChildToParallelInBlock(c, parentId, lane, child)
        ),
        laneB: cfg.laneB.map((c) =>
          appendChildToParallelInBlock(c, parentId, lane, child)
        ),
      },
    };
  }
  return block;
}
