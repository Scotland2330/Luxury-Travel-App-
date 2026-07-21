# Stack Decisions + Version Pins

**Effective:** 2026-07-20
**Status:** LOCKED. Do not deviate without Ben approval.
**Verification cadence:** Re-check versions at Phase 1 kickoff + before Phase 2. All pins = latest stable at author time.

---

## Locked stack

| Concern | Choice | Version pin | Alt considered / rejected |
|---|---|---|---|
| Runtime | Node.js | **22 LTS (22.x)** | Node 20 (older LTS), Bun (young, less battle-tested for prod payments) |
| Framework | Next.js | **^15.5.0** (App Router) | Vite SPA (kept for pages that don't need SSR), Remix, TanStack Start |
| UI runtime | React | **^19.2.0** | React 18 (missing Server Actions ergonomics) |
| Language | TypeScript | **~5.9.3** | JavaScript (rejected — spec mandates strict TS) |
| Styling | Tailwind CSS | **^4.2.1** + `@tailwindcss/vite` / `@tailwindcss/postcss` | Tailwind 3.x (v4 has 5× build speed + native CSS variables) |
| Component library | Radix Primitives + hand-rolled | latest | shadcn/ui (allowed as source, not runtime dep) |
| DB | Neon (Postgres) | serverless driver `^0.10.x` | Supabase (Ben ask: swap out), Turso, PlanetScale |
| ORM | Drizzle ORM | **^0.36.x** + `drizzle-kit ^0.28.x` | Prisma (heavy, slow cold-start on edge), Kysely (raw, more work) |
| Auth | Clerk | **^5.20.x** (`@clerk/nextjs`) | Auth.js v5 (more work for orgs), Better-Auth (young) |
| Storage | Cloudflare R2 | S3 SDK `@aws-sdk/client-s3 ^3.700.x` | Vercel Blob (higher egress), Supabase Storage (rejected) |
| API layer | Next.js Route Handlers + Server Actions | native to Next 15 | tRPC (extra layer, unnecessary for Next 15) |
| Realtime | Ably | `ably ^2.6.x` (Phase 2) | Pusher, CF Durable Objects (deferred — DO for Phase 3 if scale demands) |
| Email | Resend | `resend ^4.0.x` + React Email `@react-email/components ^0.0.32` | SendGrid (older API), Postmark |
| Payments | NMI Gateway | Direct API + Collect.js (no npm SDK exists) | Stripe (rejected — spec mandates NMI for luxury travel merchant reqs) |
| AI (Phase 2) | Anthropic Claude API | `@anthropic-ai/sdk ^0.35.x` | OpenAI, Gemini |
| Monitoring | Sentry | `@sentry/nextjs ^8.45.x` | LogRocket, Datadog |
| Cron / scheduling | Vercel Cron | native | GH Actions cron (less reliable), Trigger.dev (extra infra) |
| Hosting | Vercel (app) + Cloudflare R2 (files) + Neon (db) | — | Cloudflare Pages (Ben allows either; Vercel picked for Next.js parity) |

---

## Dev tooling pins

| Tool | Version | Purpose |
|---|---|---|
| ESLint | `^9.39.1` | Lint (flat config) |
| typescript-eslint | `^8.48.0` | TS lint rules |
| Prettier | `^3.4.0` | Format |
| Vitest | `^3.0.x` | Unit tests |
| Playwright | `^1.55.x` | E2E |
| Lefthook | `^1.11.x` | Git hooks (per Army `ci-prefers-lefthook.md`) |
| pnpm | **^10.0.x** | Package manager (fast, disk-efficient) |
| tsx | `^4.20.x` | TS script runner (migrations, seeds) |
| Zod | `^4.0.x` | Runtime schemas + form validation |
| React Hook Form | `^7.55.x` | Form state |
| TanStack Query | `^5.62.x` | Client cache (for SPA screens that stay on Vite side) |
| date-fns | `^4.1.x` | Date handling |
| next-safe-action | `^7.10.x` | Type-safe Server Actions |

---

## Package.json target shape (Phase 1 start)

```jsonc
{
  "name": "voyance",
  "version": "0.1.0",
  "private": true,
  "type": "module",
  "engines": { "node": ">=22.0.0", "pnpm": ">=10.0.0" },
  "scripts": {
    "dev": "next dev --turbopack",
    "build": "next build",
    "start": "next start",
    "lint": "eslint . && tsc --noEmit",
    "test": "vitest run",
    "test:e2e": "playwright test",
    "db:generate": "drizzle-kit generate",
    "db:migrate": "tsx scripts/migrate.ts",
    "db:studio": "drizzle-kit studio",
    "db:seed": "tsx scripts/seed.ts"
  },
  "dependencies": {
    "next": "^15.5.0",
    "react": "^19.2.0",
    "react-dom": "^19.2.0",
    "@clerk/nextjs": "^5.20.0",
    "@neondatabase/serverless": "^0.10.0",
    "drizzle-orm": "^0.36.0",
    "@aws-sdk/client-s3": "^3.700.0",
    "@aws-sdk/s3-request-presigner": "^3.700.0",
    "resend": "^4.0.0",
    "@react-email/components": "^0.0.32",
    "@sentry/nextjs": "^8.45.0",
    "zod": "^4.0.0",
    "react-hook-form": "^7.55.0",
    "@hookform/resolvers": "^3.9.0",
    "@tanstack/react-query": "^5.62.0",
    "date-fns": "^4.1.0",
    "next-safe-action": "^7.10.0",
    "@radix-ui/react-dialog": "^1.1.0",
    "@radix-ui/react-select": "^2.1.0",
    "@radix-ui/react-tabs": "^1.1.0",
    "@radix-ui/react-toast": "^1.2.0"
  },
  "devDependencies": {
    "typescript": "~5.9.3",
    "@types/node": "^24.0.0",
    "@types/react": "^19.2.7",
    "@types/react-dom": "^19.2.3",
    "eslint": "^9.39.1",
    "@eslint/js": "^9.39.1",
    "typescript-eslint": "^8.48.0",
    "eslint-config-next": "^15.5.0",
    "prettier": "^3.4.0",
    "tailwindcss": "^4.2.1",
    "@tailwindcss/postcss": "^4.2.1",
    "postcss": "^8.5.0",
    "autoprefixer": "^10.4.20",
    "vitest": "^3.0.0",
    "@vitejs/plugin-react": "^5.1.1",
    "@testing-library/react": "^16.1.0",
    "@testing-library/jest-dom": "^6.6.0",
    "@playwright/test": "^1.55.0",
    "drizzle-kit": "^0.28.0",
    "tsx": "^4.20.0",
    "lefthook": "^1.11.0"
  }
}
```

---

## Version audit workflow (Task 1.0 of Phase 1)

Before writing any feature code, an autonomous agent runs:

```bash
# 1. Latest-stable check
pnpm dlx npm-check-updates --format group

# 2. Compat-check for React 19 + Next 15 peer deps
pnpm ls --parseable | xargs -I{} npm view {} peerDependencies 2>/dev/null

# 3. Security audit (fail build on high/critical)
pnpm audit --audit-level=high

# 4. Bump anything behind; open PR titled "chore(deps): bump to latest stable YYYY-MM-DD"
```

**Rule:** if any pin above lags >1 minor version behind current npm-latest, bump before starting the sprint. Don't ship with stale.

---

## Explicitly OUT

- **Supabase (any package)** — Ben decision, stack swap.
- **React 18** — Server Actions in 19 unlock the Server-Action pattern Phase 1 depends on.
- **Vite (as app framework)** — kept only for existing screen components during migration; deleted once Next 15 port complete.
- **react-router-dom** — Next.js App Router replaces it. Uninstall in Phase 1.0.
- **Prisma** — Drizzle wins on edge cold-start + serverless cost.
- **Zustand / Redux / Jotai** — Server Components + React Context (existing) cover state. Add later only if measured pain.
- **Storybook** — deferred. Not blocking a launch.
- **Turborepo / Nx** — monorepo overhead. Single Next 15 app until proven need.
- **Docker (dev)** — Vercel + Neon + R2 all cloud-native, no local containers.

---

## Reference

- Next.js 15: https://nextjs.org/blog/next-15
- React 19: https://react.dev/blog/2024/12/05/react-19
- Tailwind v4: https://tailwindcss.com/blog/tailwindcss-v4
- Drizzle: https://orm.drizzle.team/docs/overview
- Clerk Next: https://clerk.com/docs/quickstarts/nextjs
- Neon serverless: https://neon.tech/docs/serverless/serverless-driver
- Cloudflare R2 S3-compat: https://developers.cloudflare.com/r2/api/s3/api/
- NMI Collect.js: https://secure.nmi.com/merchants/resources/integration/integration_portal.php
