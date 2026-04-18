import { TopBarBreadcrumb } from "@/components/shell/TopBarContext";
import { PageHeader } from "@/components/layout/PageHeader";
import { primitiveRepository } from "@/repositories/primitive.repository";
import { PrimitiveListView } from "@/features/agents/PrimitiveListView";

export const dynamic = "force-dynamic";

export const metadata = { title: "Primitives Library" };

export default async function PrimitivesPage() {
  const primitives = await primitiveRepository.list();

  return (
    <div className="space-y-8">
      <TopBarBreadcrumb
        backHref="/agents"
        backLabel="Agents"
        title="Primitives Library"
      />
      <PageHeader description="Reusable building blocks for v2 agent flows: researchers, actors, rewriters, responders, and evals." />
      <PrimitiveListView primitives={primitives} />
    </div>
  );
}
