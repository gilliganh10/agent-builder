import type { EnvVarDefinition, FlowDefinition } from "@/db/agents/schema";

// ---------------------------------------------------------------------------
// Resolve env vars by merging layers in precedence order (lowest to highest):
//   1. EnvVarDefinition.default (design-time)
//   2. publishedEnvOverrides (from AgentDefinition.meta)
//   3. sessionEnvOverrides (from ConversationSession.meta)
//   4. runEnvOverrides (per-run API parameter)
// ---------------------------------------------------------------------------

export interface ResolveEnvVarsParams {
  flowDefinition: FlowDefinition;
  publishedOverrides?: Record<string, string>;
  sessionOverrides?: Record<string, string>;
  runOverrides?: Record<string, string>;
}

export function resolveEnvVars(params: ResolveEnvVarsParams): Record<string, string> {
  const { flowDefinition, publishedOverrides, sessionOverrides, runOverrides } = params;
  const defs = flowDefinition.envVars ?? [];

  const resolved: Record<string, string> = {};

  for (const def of defs) {
    let value: string | undefined;

    if (def.default !== undefined) value = def.default;
    if (publishedOverrides?.[def.key] !== undefined) value = publishedOverrides[def.key];
    if (sessionOverrides?.[def.key] !== undefined) value = sessionOverrides[def.key];
    if (runOverrides?.[def.key] !== undefined) value = runOverrides[def.key];

    if (value !== undefined) {
      resolved[def.key] = value;
    } else if (def.required) {
      resolved[def.key] = "";
    }
  }

  return resolved;
}

// ---------------------------------------------------------------------------
// Filter overrides to only publicly-editable env vars
// ---------------------------------------------------------------------------

export function filterPublicOverrides(
  overrides: Record<string, string>,
  flowDefinition: FlowDefinition
): Record<string, string> {
  const defs = flowDefinition.envVars ?? [];
  const publicKeys = new Set(defs.filter((d) => d.publicEditable).map((d) => d.key));
  const filtered: Record<string, string> = {};
  for (const [key, value] of Object.entries(overrides)) {
    if (publicKeys.has(key)) {
      filtered[key] = value;
    }
  }
  return filtered;
}

// ---------------------------------------------------------------------------
// Template interpolation
//
// Supported forms (applied in order):
//   1. {{env.KEY}}  — resolved env (design-time + overrides)
//   2. {{vars.KEY}} — orchestrator memory field
//   3. {{KEY}}      — bare name: merged env ∪ vars, **env wins on key collision**
//
// Prefer explicit {{env.*}} / {{vars.*}} in new content; bare keys are for author ergonomics.
// ---------------------------------------------------------------------------

const ENV_TEMPLATE_RE = /\{\{env\.(\w+)\}\}/g;
const VARS_TEMPLATE_RE = /\{\{vars\.(\w+)\}\}/g;
/** Bare identifiers: word chars only (matches typical env/memory keys). */
const BARE_TEMPLATE_RE = /\{\{([a-zA-Z_][a-zA-Z0-9_]*)\}\}/g;

function mergeBareInterpolationValues(
  env: Record<string, string>,
  vars: Record<string, unknown> | undefined
): Record<string, string> {
  const merged: Record<string, string> = {};
  if (vars) {
    for (const [k, v] of Object.entries(vars)) {
      merged[k] = v != null ? String(v) : "";
    }
  }
  for (const [k, v] of Object.entries(env)) {
    merged[k] = v;
  }
  return merged;
}

export function interpolateTemplate(
  template: string,
  env: Record<string, string>,
  vars?: Record<string, unknown>
): string {
  let result = template.replace(ENV_TEMPLATE_RE, (_match, key: string) => {
    return env[key] ?? "";
  });

  if (vars) {
    result = result.replace(VARS_TEMPLATE_RE, (_match, key: string) => {
      const v = vars[key];
      return v != null ? String(v) : "";
    });
  }

  const merged = mergeBareInterpolationValues(env, vars);
  result = result.replace(BARE_TEMPLATE_RE, (_match, key: string) => {
    return merged[key] ?? "";
  });

  return result;
}
