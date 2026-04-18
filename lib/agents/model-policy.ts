// ---------------------------------------------------------------------------
// Model policy tiers — user-facing abstraction over raw model names
// ---------------------------------------------------------------------------

export type ModelPolicy = "cheap" | "default" | "premium";

export interface ModelPolicyConfig {
  label: string;
  model: string;
  description: string;
}

export const MODEL_POLICIES: Record<ModelPolicy, ModelPolicyConfig> = {
  cheap: {
    label: "Economy",
    model: "gpt-4.1-nano",
    description: "Fast and lowest cost",
  },
  default: {
    label: "Standard",
    model: "gpt-5.4-mini",
    description: "Balanced quality and cost (GPT-5.4 mini)",
  },
  premium: {
    label: "Premium",
    model: "gpt-5.4",
    description: "Highest capability (GPT-5.4)",
  },
};

export const ALL_MODEL_POLICIES = Object.keys(MODEL_POLICIES) as ModelPolicy[];

export function resolveModel(policy: ModelPolicy): string {
  return MODEL_POLICIES[policy].model;
}

/** Stored defaultModel strings from older seeds — map to current policy keys for UI. */
const LEGACY_MODEL_TO_POLICY: Record<string, ModelPolicy> = {
  "gpt-4.1": "default",
  "gpt-4.1-mini": "cheap",
  "gpt-4o": "premium",
  "gpt-4o-mini": "cheap",
};

export function policyFromModel(model: string): ModelPolicy {
  for (const [policy, config] of Object.entries(MODEL_POLICIES)) {
    if (config.model === model) return policy as ModelPolicy;
  }
  const legacy = LEGACY_MODEL_TO_POLICY[model];
  if (legacy) return legacy;
  return "default";
}
