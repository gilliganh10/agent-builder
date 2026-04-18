# Agent Builder

A minimal, self-contained Next.js app for defining, testing, and publishing AI
agents. Extracted from a larger SaaS monolith with all multi-tenancy, auth,
and control-panel surfaces removed, so it runs as a single-scope local tool.

What you get:

- An **Agent Builder UI** at `/agents` — create agents, edit instructions,
  attach a flow graph, run them against live input, inspect runs and steps.
- **Flat API routes** under `/api/agents/*` (no tenant slug, no session
  cookies).
- A **public chat endpoint** at `/api/public/chat/[token]` for agents you
  explicitly publish.
- SQLite-first Prisma schema and a Vitest unit test suite.

## Local-trust model — not for public deployment

This build has **no authentication**, **no RBAC**, and **no multi-tenancy**.
Every caller of the HTTP API is treated as the implicit local operator with
full permissions. That is fine for a developer laptop, a trusted internal
network, or running inside an existing authenticated envelope.

It is **not** safe to expose this app directly on the public internet. If you
need to run it remotely, put it behind:

- a reverse proxy that enforces authentication (e.g. OAuth, IP allowlist,
  mutual TLS), and
- rate limiting / abuse protection appropriate for your deployment, and
- network controls that restrict the Prisma database and the `OPENAI_API_KEY`
  to the proxied path only.

The only route intended to be network-facing is `/api/public/chat/[token]`,
and even that relies on you treating the per-agent publish token as a secret.

## Getting started

```bash
npm install
cp .env.example .env.local
# edit .env.local — set OPENAI_API_KEY at minimum
npm run db:push
npm run dev
```

Open http://localhost:3000.

The default database is a local SQLite file (`./dev.db`). Swap
`DATABASE_URL` in `.env.local` to point at Postgres or another Prisma-supported
backend if you need to.

## Scripts

- `npm run dev` — Next.js dev server
- `npm run build` / `npm start` — production build and serve
- `npm run db:push` — apply the Prisma schema to your database
- `npm run db:studio` — open Prisma Studio
- `npm test` — run the unit test suite (Vitest)

## Configuration

Environment variables (see `.env.example`):

- `DATABASE_URL` — Prisma connection string. Defaults to `file:./dev.db`.
- `OPENAI_API_KEY` — required for agent runs and guardrails.
- `INPUT_GUARDRAILS_ENABLED` — opt-in input guardrails (`1` to enable).

## Extending

The tool registry (`lib/agents/tool-registry.ts`) is intentionally empty. To
expose tools to agents, implement `Tool<AgentRunContext>` from
`@openai/agents` and add an entry to `TOOL_MAP`. The same file documents
`resolveTools`, `getTool`, and `allToolNames`.

## License

This extracted build is distributed without a bundled license. Pick the
license appropriate for your project before publishing.
