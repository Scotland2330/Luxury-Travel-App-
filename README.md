# Voyance

Luxury Travel Operations Platform for [First Class Operations](https://firstclassops.com).

Multi-tenant SaaS for luxury travel advisors: trip lifecycle, client comms, financials, team ops, client portals — one workspace.

## Status

- **Phase 1** — Production MVP (in flight). Next.js 15 + Neon + Clerk + Cloudflare R2 + Vercel + NMI Gateway. Spec: [`docs/specs/phase-1.spec.md`](docs/specs/phase-1.spec.md).
- **Phase 2** — Mobile PWA + AI itinerary + workflow automation + realtime + compliance. Spec: [`docs/specs/phase-2.spec.md`](docs/specs/phase-2.spec.md).

## Repo

- **Origin:** `git@github.com:FirstClassOps/voyance.git`
- **Default branch:** `main`
- **Deploy:** Vercel (staging + production), configured post-bootstrap.
- **Legacy:** compiled Vite prototype lives on `gh-pages` branch (historical, not tracked for deploy).

## Getting started (dev)

```bash
# Prereqs: Node 22 LTS, pnpm 10+
corepack enable && corepack prepare pnpm@latest --activate

pnpm install
cp .env.example .env.local     # populate per docs/specs/phase-1.spec.md Appendix A
pnpm dev                       # http://localhost:3000
```

## Docs

| Path | Purpose |
|---|---|
| [`docs/product-spec.md`](docs/product-spec.md) | Voyance product spec (v1.0, source of truth) |
| [`docs/specs/00-stack-decisions.md`](docs/specs/00-stack-decisions.md) | Locked stack + version pins |
| [`docs/specs/phase-1.spec.md`](docs/specs/phase-1.spec.md) | Phase 1 build spec (DAG, contracts, acceptance) |
| [`docs/specs/phase-2.spec.md`](docs/specs/phase-2.spec.md) | Phase 2 build spec |
| [`docs/specs/autonomous-execution.md`](docs/specs/autonomous-execution.md) | Overnight loop runbook |

## Stack

Next.js 15 (App Router) · React 19.2 · TypeScript 5.9 · Tailwind CSS 4 · Neon (Postgres) · Drizzle ORM · Clerk (auth) · Cloudflare R2 (storage) · Vercel (hosting + cron) · Resend (email) · Sentry (monitoring) · NMI Gateway (payments).

Full version pins: [`docs/specs/00-stack-decisions.md`](docs/specs/00-stack-decisions.md).

## Ownership

- **Product owner:** First Class Operations
- **Engineering:** [Automator Solutions](https://automatorsolutions.com) — [@bentheautomator](https://github.com/bentheautomator)
- **Repo config:** [`.claude/project.json`](.claude/project.json)

## License

Proprietary. Copyright © 2026 First Class Operations. All rights reserved.
