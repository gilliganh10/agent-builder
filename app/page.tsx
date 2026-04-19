import Link from "next/link";
import { Bot, History } from "lucide-react";

export default function Home() {
  return (
    <main className="mx-auto flex w-full max-w-3xl flex-1 flex-col gap-10 px-8 py-16">
      <header className="space-y-3">
        <p className="text-sm font-mono uppercase tracking-wider text-muted-foreground">
          Agent Builder
        </p>
        <h1 className="text-4xl font-semibold tracking-tight">
          Build, test, and publish AI agents — locally.
        </h1>
        <p className="max-w-xl text-lg text-muted-foreground">
          Define agents with instructions, tools, and flow graphs, run them
          against live inputs, and optionally expose a public chat endpoint
          by publishing.
        </p>
      </header>

      <nav className="grid gap-3 sm:grid-cols-2">
        <Link
          href="/agents"
          className="group rounded-lg border border-border bg-card p-5 transition hover:border-foreground/40 hover:bg-muted/40"
        >
          <Bot className="mb-3 h-5 w-5 text-primary" />
          <h2 className="font-medium group-hover:underline">Agents</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Create and manage agent definitions.
          </p>
        </Link>
        <Link
          href="/agents/runs"
          className="group rounded-lg border border-border bg-card p-5 transition hover:border-foreground/40 hover:bg-muted/40"
        >
          <History className="mb-3 h-5 w-5 text-primary" />
          <h2 className="font-medium group-hover:underline">All runs</h2>
          <p className="mt-1 text-sm text-muted-foreground">
            Inspect run history, artifacts, and evals.
          </p>
        </Link>
      </nav>

      <section className="rounded-md border border-amber-500/40 bg-amber-500/10 p-4 text-sm text-amber-900 dark:text-amber-200">
        <strong>Local-trust build.</strong> This app has no authentication.
        Do not expose it directly on the public internet. Run it locally, or
        put it behind a reverse proxy with its own auth and rate limiting.
      </section>
    </main>
  );
}
