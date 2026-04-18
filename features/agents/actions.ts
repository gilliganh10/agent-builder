"use server";

import { revalidatePath } from "next/cache";
import { requirePermission } from "@/lib/auth-guard";
import { agentRepository } from "@/repositories/agent.repository";
import { allToolNames } from "@/lib/agents/tool-registry";
import { resolveModel, type ModelPolicy } from "@/lib/agents/model-policy";
import type { FlowDefinition } from "@/db/agents/schema";
import { canEditAgentDefinition } from "@/lib/agents/agent-visibility";
import { findAgentTemplate } from "@/lib/agents/templates";

export interface AgentFormValues {
  name: string;
  slug: string;
  description: string;
  instructions: string;
  allowedTools: string[];
  modelPolicy: ModelPolicy;
  flowDefinition?: FlowDefinition | null;
  changelog?: string;
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9]+/g, "-")
    .replace(/(^-|-$)/g, "");
}

export async function createAgent(tenantId: string, values: AgentFormValues) {
  await requirePermission("agents.create");

  const slug = values.slug || slugify(values.name);

  const validTools = allToolNames();
  const invalid = values.allowedTools.filter((t) => !validTools.includes(t));
  if (invalid.length > 0) {
    throw new Error(`Unknown tools: ${invalid.join(", ")}`);
  }

  const existing = await agentRepository.findBySlug(tenantId, slug);
  if (existing) {
    throw new Error(`Agent with slug "${slug}" already exists`);
  }

  const defaultModel = resolveModel(values.modelPolicy);

  const agent = await agentRepository.create(tenantId, {
    name: values.name,
    slug,
    description: values.description,
    kind: "user_created",
    instructions: values.instructions,
    allowedTools: values.allowedTools,
    defaultModel,
    flowDefinition: values.flowDefinition,
    meta: { modelPolicy: values.modelPolicy },
  });

  await agentRepository.createVersion(tenantId, agent.id, {
    version: 1,
    instructions: values.instructions,
    allowedTools: values.allowedTools,
    defaultModel,
    flowDefinition: values.flowDefinition,
    changelog: "Initial version",
  });

  revalidatePath("/agents");
  revalidatePath(`/agents/${agent.slug}`);

  return agent;
}

export async function updateAgent(tenantId: string, id: string, values: AgentFormValues) {
  await requirePermission("agents.create");

  const agent = await agentRepository.findById(tenantId, id);
  if (!agent) throw new Error("Agent not found");
  if (!canEditAgentDefinition(agent)) throw new Error("Built-in agents cannot be edited");

  const validTools = allToolNames();
  const invalid = values.allowedTools.filter((t) => !validTools.includes(t));
  if (invalid.length > 0) {
    throw new Error(`Unknown tools: ${invalid.join(", ")}`);
  }

  const defaultModel = resolveModel(values.modelPolicy);

  const updatePayload: Parameters<typeof agentRepository.update>[2] = {
    name: values.name,
    description: values.description,
    instructions: values.instructions,
    allowedTools: values.allowedTools,
    defaultModel,
    meta: { ...agent.meta, modelPolicy: values.modelPolicy },
  };

  if (values.flowDefinition !== undefined) {
    updatePayload.flowDefinition = values.flowDefinition;
  }

  const updated = await agentRepository.update(tenantId, id, updatePayload);

  if (!updated) throw new Error("Update failed");

  const latestVersion = await agentRepository.getLatestVersion(tenantId, id);
  const nextVersion = latestVersion ? latestVersion.version + 1 : 1;

  await agentRepository.createVersion(tenantId, id, {
    version: nextVersion,
    instructions: values.instructions,
    allowedTools: values.allowedTools,
    defaultModel,
    flowDefinition: updated.flowDefinition,
    changelog: values.changelog || "Updated",
  });

  revalidatePath("/agents");
  revalidatePath(`/agents/${updated.slug}`);

  return updated;
}

/**
 * Provision a new agent from a template (see `lib/agents/templates`). Slug
 * collisions append `-<n>` so the same template can be seeded repeatedly.
 */
export async function createAgentFromTemplate(
  tenantId: string,
  templateId: string
): Promise<{ slug: string }> {
  await requirePermission("agents.create");

  const template = findAgentTemplate(templateId);
  if (!template) throw new Error(`Unknown template: ${templateId}`);

  let slug = template.slugSuggestion;
  let suffix = 2;
  while (await agentRepository.findBySlug(tenantId, slug)) {
    slug = `${template.slugSuggestion}-${suffix++}`;
  }

  const flowDefinition = template.buildFlowDefinition();
  const defaultModel = resolveModel(template.modelPolicy);

  const agent = await agentRepository.create(tenantId, {
    name: template.name,
    slug,
    description: template.description,
    kind: "user_created",
    instructions: template.instructions,
    allowedTools: [],
    defaultModel,
    flowDefinition,
    mode: template.mode,
    meta: { modelPolicy: template.modelPolicy, templateId: template.id },
  });

  await agentRepository.createVersion(tenantId, agent.id, {
    version: 1,
    instructions: template.instructions,
    allowedTools: [],
    defaultModel,
    flowDefinition,
    changelog: `Initial version from template: ${template.id}`,
  });

  revalidatePath("/agents");
  revalidatePath(`/agents/${agent.slug}`);

  return { slug: agent.slug };
}

export async function deleteAgent(tenantId: string, id: string) {
  await requirePermission("agents.manage");

  const agent = await agentRepository.findById(tenantId, id);
  if (!agent) throw new Error("Agent not found");
  if (agent.kind === "built_in") throw new Error("Built-in agents cannot be deleted");

  const { slug } = agent;
  await agentRepository.delete(tenantId, id);

  revalidatePath("/agents");
  revalidatePath(`/agents/${slug}`);
}
