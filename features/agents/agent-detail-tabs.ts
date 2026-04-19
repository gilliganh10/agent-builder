/** Shared tab ids for agent detail (server + client). */

export const AGENT_DETAIL_TABS = [
  { id: "overview", label: "Overview" },
  { id: "builder", label: "Builder" },
  { id: "runs", label: "Runs" },
  { id: "versions", label: "Versions" },
] as const;

export type AgentDetailTabId = (typeof AGENT_DETAIL_TABS)[number]["id"];

export type BuilderSubtab = "plan" | "graph" | "test";

export const BUILDER_SUBTAB_IDS: BuilderSubtab[] = ["plan", "graph", "test"];

const LEGACY_TAB_MAP: Record<string, AgentDetailTabId> = {
  flow: "builder",
  "chat-builder": "builder",
  plan: "builder",
  graph: "builder",
  test: "builder",
  run: "runs",
  history: "runs",
  dataset: "overview",
  triggers: "overview",
};

const LEGACY_SUBTAB_MAP: Record<string, BuilderSubtab> = {
  flow: "graph",
  graph: "graph",
  "chat-builder": "plan",
  chat: "plan",
  plan: "plan",
  test: "test",
};

const ALL_TAB_IDS: readonly AgentDetailTabId[] = AGENT_DETAIL_TABS.map((t) => t.id);

export function isAgentDetailTabId(
  tab: string | undefined
): tab is AgentDetailTabId {
  return tab !== undefined && ALL_TAB_IDS.includes(tab as AgentDetailTabId);
}

export function resolveAgentDetailTab(tab: string | undefined): AgentDetailTabId {
  if (!tab) return "overview";
  if (isAgentDetailTabId(tab)) return tab;
  return LEGACY_TAB_MAP[tab] ?? "overview";
}

export function resolveBuilderSubtab(
  tab: string | undefined,
  subtab: string | undefined
): BuilderSubtab {
  if (tab && LEGACY_SUBTAB_MAP[tab]) return LEGACY_SUBTAB_MAP[tab];
  if (subtab && LEGACY_SUBTAB_MAP[subtab]) return LEGACY_SUBTAB_MAP[subtab];
  return "plan";
}
