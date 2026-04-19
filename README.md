# Agent Builder

A small, self-contained **agent builder** and **chat tester** built with Next.js. Define flows in the UI, run them in the built-in chat, publish a token, and iterate locally—no tenant layers or control-panel chrome.

You can **create your own agents from scratch** or start from templates under **New from template** on the Agents screen. The app is a focused playground: one workspace, flat APIs, and a clear path from idea → flow → run → inspect.

## What’s inside

- **Plan, Graph, Test** — Sketch steps on the Plan tab, see the compiled graph, and exercise the agent in Test chat with live state and goals.
- **Templates** — Two opinionated starters ship with the repo:
  - **Glottr** — A bilingual-friendly **language-learning** companion: it triages the learner’s message, corrects grammar when needed, and replies in the **target language** at the chosen proficiency level.
  - **Joke persuader** — A playful agent that tells jokes and tries to win you over; it demonstrates **conversation goals** (e.g. “win a smile”) that complete when the user’s reaction matches your conditions.
- **API** — Flat routes under `/api/agents/*` for local integration work.
- **Public chat** — `/api/public/chat/[token]` for agents you explicitly publish (treat the token like a secret).
- **Data & tests** — SQLite-first Prisma schema and a Vitest unit suite.

This project was extracted from a larger SaaS codebase: multi-tenancy, auth, and enterprise surfaces are stripped so it runs as a **single-scope** local tool.

## Local-trust model — not for public deployment

This build has **no authentication**, **no RBAC**, and **no multi-tenancy**. Every HTTP caller is treated as the implicit local operator with full permissions. That fits a developer laptop, a trusted internal network, or an app already wrapped by your own auth.

Do **not** expose the app raw on the public internet. If you host it remotely, put it behind authentication (OAuth, IP allowlist, mTLS), rate limiting, and network controls that isolate the database and `OPENAI_API_KEY`.

The only route meant to be network-facing without the full UI is `/api/public/chat/[token]`, and only when you protect the publish token.

## Getting started

```bash
npm install
cp .env.example .env.local
# edit .env.local — set OPENAI_API_KEY at minimum
npm run db:push
npm run dev
```

Open http://localhost:3000.

The default database is a local SQLite file (`./dev.db`). Point `DATABASE_URL` in `.env.local` at Postgres or another Prisma-supported backend if you prefer.

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

The tool registry (`lib/agents/tool-registry.ts`) is intentionally empty. To expose tools to agents, implement `Tool<AgentRunContext>` from `@openai/agents` and add an entry to `TOOL_MAP`. The same file documents `resolveTools`, `getTool`, and `allToolNames`.

## License

This extracted build is distributed without a bundled license. Pick the license appropriate for your project before publishing.
