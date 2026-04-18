import type { ReactNode } from "react";

export default function AgentDetailLayout({
  children,
}: {
  children: ReactNode;
}) {
  return (
    <div className="flex h-full min-h-0 w-full flex-1 flex-col overflow-hidden bg-background">
      {children}
    </div>
  );
}
