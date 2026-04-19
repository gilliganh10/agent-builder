import type { ReactNode } from "react";

/** Fills viewport height so agent detail (graph canvas) can use flex-1 / h-full. */
export default function AgentsLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex min-h-0 min-h-screen flex-1 flex-col bg-background">
      {children}
    </div>
  );
}
