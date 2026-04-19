"use client";

import { useState } from "react";
import { Bot, Pencil, Trash2 } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/DataTable";
import type { TableConfig } from "@/components/data-table/types";
import type { AgentDefinition } from "@/db/agents/schema";
import { policyFromModel, MODEL_POLICIES } from "@/lib/agents/model-policy";
import { AgentFormDialog } from "./AgentFormDialog";
import { AgentDeleteDialog } from "./AgentDeleteDialog";
import { canEditAgentDefinition } from "@/lib/agents/agent-visibility";

const kindLabel: Record<string, string> = {
  built_in: "Built-in",
  user_created: "Custom",
};

const kindVariant: Record<string, "default" | "secondary" | "outline"> = {
  built_in: "secondary",
  user_created: "default",
};

interface AgentListViewProps {
  agents: AgentDefinition[];
}

export function AgentListView({ agents }: AgentListViewProps) {
  const [formOpen, setFormOpen] = useState(false);
  const [deleteOpen, setDeleteOpen] = useState(false);
  const [selectedAgent, setSelectedAgent] = useState<
    AgentDefinition | undefined
  >(undefined);
  const [agentToDelete, setAgentToDelete] = useState<AgentDefinition | null>(
    null
  );

  function openCreate() {
    setSelectedAgent(undefined);
    setFormOpen(true);
  }

  function openEdit(agent: AgentDefinition) {
    if (!canEditAgentDefinition(agent)) return;
    setSelectedAgent(agent);
    setFormOpen(true);
  }

  function openDelete(agent: AgentDefinition) {
    setAgentToDelete(agent);
    setDeleteOpen(true);
  }

  const tableConfig: TableConfig<AgentDefinition> = {
    columns: [
      {
        id: "name",
        label: "Agent",
        accessor: "name",
        cell: (_value, row) => (
          <span className="font-medium">{row.name}</span>
        ),
      },
      {
        id: "description",
        label: "Description",
        accessor: "description",
        cell: (value) => (
          <span className="text-muted-foreground line-clamp-1 max-w-xs">
            {String(value ?? "")}
          </span>
        ),
      },
      {
        id: "kind",
        label: "Kind",
        accessor: "kind",
        cell: (value) => {
          const kind = String(value);
          return (
            <Badge variant={kindVariant[kind] ?? "outline"}>
              {kindLabel[kind] ?? kind}
            </Badge>
          );
        },
      },
      {
        id: "modelPolicy",
        label: "Model",
        accessor: (row) => {
          const policy = policyFromModel(row.defaultModel);
          return MODEL_POLICIES[policy].label;
        },
      },
      {
        id: "tools",
        label: "Tools",
        accessor: (row) => `${row.allowedTools.length}`,
      },
      {
        id: "updatedAt",
        label: "Updated",
        accessor: "updatedAt",
        cell: (value) => {
          if (!value) return null;
          const d = new Date(String(value));
          const str = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
          return (
            <span className="text-sm text-muted-foreground">{str}</span>
          );
        },
      },
    ],

    toolbar: {
      searchable: true,
      searchPlaceholder: "Search agents\u2026",
      searchFields: ["name", "description"],
      filters: [
        {
          id: "kind",
          label: "Kind",
          accessor: "kind",
          options: [
            { label: "Built-in", value: "built_in" },
            { label: "Custom", value: "user_created" },
          ],
        },
      ],
      primaryAction: {
        label: "New Agent",
        onClick: openCreate,
      },
    },

    actions: [
      {
        label: "Edit",
        icon: Pencil,
        onClick: openEdit,
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: openDelete,
        variant: "destructive",
      },
    ],

    rowLink: (row) => `/agents/${row.slug}`,

    emptyState: {
      icon: Bot,
      noData: {
        title: "No agents yet",
        description: "Agents will appear here once created.",
        ctaLabel: "Create first agent",
        onCta: openCreate,
      },
      noResults: {
        title: "No agents match your filters",
        description: "Try adjusting your search or filter.",
      },
    },

    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 25, 50],
    },
  };

  return (
    <>
      <DataTable data={agents} config={tableConfig} />

      <AgentFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        agent={selectedAgent}
      />

      <AgentDeleteDialog
        open={deleteOpen}
        onOpenChange={setDeleteOpen}
        agent={agentToDelete}
      />
    </>
  );
}
