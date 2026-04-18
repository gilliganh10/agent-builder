import { Loader2 } from "lucide-react";

export default function AgentDetailLoading() {
  return (
    <div className="flex flex-col gap-4 py-8">
      <div className="h-8 w-48 animate-pulse rounded-md bg-muted" />
      <div className="h-4 w-full max-w-md animate-pulse rounded-md bg-muted" />
      <div className="flex gap-1 border-b border-border pt-2">
        {Array.from({ length: 6 }).map((_, i) => (
          <div
            key={i}
            className="h-10 w-24 shrink-0 animate-pulse rounded-t-md bg-muted"
          />
        ))}
      </div>
      <div className="flex justify-center py-16 text-muted-foreground">
        <Loader2 className="h-8 w-8 animate-spin" aria-hidden />
      </div>
    </div>
  );
}
