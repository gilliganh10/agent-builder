"use client";

import { useState } from "react";
import { useRouter } from "next/navigation";
import { Search, Zap, PenLine, MessageSquare, ClipboardCheck, Trash2, Blocks } from "lucide-react";
import { Badge } from "@/components/ui/badge";
import { DataTable } from "@/components/data-table/DataTable";
import type { TableConfig } from "@/components/data-table/types";
import type { PrimitiveDefinition, PrimitiveKind } from "@/db/agents/schema";
import { policyFromModel, MODEL_POLICIES } from "@/lib/agents/model-policy";
import { PrimitiveFormDialog } from "./PrimitiveFormDialog";
import { useTenant } from "@/lib/tenant-context";

const KIND_COLORS: Record<PrimitiveKind, string> = {
  researcher: "bg-[#222E50] hover:bg-[#222E50]/90",
  actor: "bg-[#F45B69] hover:bg-[#F45B69]/90",
  rewriter: "bg-[#946E83] hover:bg-[#946E83]/90",
  responder: "bg-[#222E50] hover:bg-[#222E50]/90",
  eval: "bg-[#CDD5D1] text-foreground hover:bg-[#CDD5D1]/90",
  state_extractor: "bg-[#222E50]/70 hover:bg-[#222E50]/60",
};

interface PrimitiveListViewProps {
  primitives: PrimitiveDefinition[];
}

export function PrimitiveListView({ primitives }: PrimitiveListViewProps) {
  const router = useRouter();
  const { tenantSlug } = useTenant();
  const [formOpen, setFormOpen] = useState(false);
  const [selected, setSelected] = useState<PrimitiveDefinition | undefined>();

  function openCreate() {
    setSelected(undefined);
    setFormOpen(true);
  }

  function openEdit(prim: PrimitiveDefinition) {
    setSelected(prim);
    setFormOpen(true);
  }

  async function handleDelete(prim: PrimitiveDefinition) {
    if (!confirm(`Delete primitive "${prim.name}"?`)) return;
    await fetch(`/api/agents/primitives/${prim.slug}`, { method: "DELETE" });
    router.refresh();
  }

  const tableConfig: TableConfig<PrimitiveDefinition> = {
    columns: [
      {
        id: "name",
        label: "Name",
        accessor: "name",
        cell: (_value, row) => (
          <span className="font-medium">{row.name}</span>
        ),
      },
      {
        id: "kind",
        label: "Kind",
        accessor: "kind",
        cell: (value) => {
          const kind = String(value) as PrimitiveKind;
          return (
            <Badge className={`gap-1 ${KIND_COLORS[kind] ?? ""}`}>
              {kind}
            </Badge>
          );
        },
      },
      {
        id: "description",
        label: "Description",
        accessor: "description",
        cell: (value) => (
          <span className="text-muted-foreground line-clamp-1 max-w-xs text-xs">
            {String(value ?? "—")}
          </span>
        ),
      },
      {
        id: "model",
        label: "Model",
        accessor: (row) => {
          const policy = policyFromModel(row.defaultModel);
          return MODEL_POLICIES[policy].label;
        },
      },
      {
        id: "updatedAt",
        label: "Updated",
        accessor: "updatedAt",
        cell: (value) => {
          if (!value) return null;
          const d = new Date(String(value));
          const str = `${d.getUTCFullYear()}-${String(d.getUTCMonth() + 1).padStart(2, "0")}-${String(d.getUTCDate()).padStart(2, "0")}`;
          return <span className="text-sm text-muted-foreground">{str}</span>;
        },
      },
    ],

    toolbar: {
      searchable: true,
      searchPlaceholder: "Search primitives\u2026",
      searchFields: ["name", "description", "kind"],
      primaryAction: {
        label: "New Primitive",
        onClick: openCreate,
        requiredPermission: "agents.create",
      },
    },

    actions: [
      {
        label: "Edit",
        icon: PenLine,
        onClick: openEdit,
        requiredPermission: "agents.create",
      },
      {
        label: "Delete",
        icon: Trash2,
        onClick: handleDelete,
        requiredPermission: "agents.manage",
        variant: "destructive",
      },
    ],

    emptyState: {
      icon: Blocks,
      noData: {
        title: "No primitives yet",
        description: "Primitives are reusable building blocks for v2 agent flows.",
        ctaLabel: "Create first primitive",
        onCta: openCreate,
      },
      noResults: {
        title: "No primitives match your filters",
        description: "Try adjusting your search.",
      },
    },

    pagination: {
      defaultPageSize: 10,
      pageSizeOptions: [10, 25, 50],
    },
  };

  return (
    <>
      <DataTable data={primitives} config={tableConfig} />
      <PrimitiveFormDialog
        open={formOpen}
        onOpenChange={setFormOpen}
        primitive={selected}
      />
    </>
  );
}
