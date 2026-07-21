# Phase 1 — Production MVP Spec

**Status:** Ready for autonomous execution
**Author:** Claude Code (Ben's session, 2026-07-20)
**Duration:** 4-6 weeks calendar, 20-27 dev-days
**Cost frame:** $18-32k (AI-native pricing, per `~/.claude/memory/feedback_ai_native_pricing.md`)
**Goal:** Take the 8,500 LOC React prototype → live production platform w/ auth, DB, real data, live payments, 15 screens wired.

Companion: `../../Voyance - Luxury Travel App - Technical Specification.md` (product truth).

---

## Table of contents

1. [Scope + acceptance](#1-scope--acceptance)
2. [Bootstrap (Task 1.0)](#2-bootstrap-task-10)
3. [Database schema (Task 1.1)](#3-database-schema-task-11)
4. [Auth + tenancy (Task 1.2)](#4-auth--tenancy-task-12)
5. [Screen wiring (Tasks 1.3 - 1.5)](#5-screen-wiring-tasks-13--15)
6. [NMI Gateway (Task 1.6)](#6-nmi-gateway-task-16)
7. [Storage + docs (Task 1.7)](#7-storage--docs-task-17)
8. [Deploy + CI (Task 1.8)](#8-deploy--ci-task-18)
9. [Monitoring + hardening (Task 1.9)](#9-monitoring--hardening-task-19)
10. [Work packet DAG (parallel dispatch)](#10-work-packet-dag-parallel-dispatch)
11. [Acceptance test matrix](#11-acceptance-test-matrix)
12. [Explicit out-of-scope](#12-explicit-out-of-scope)

---

## 1. Scope + acceptance

### In scope

- Next.js 15 App Router migration from Vite SPA
- Neon Postgres w/ Drizzle ORM, 13 core tables + tenant-scoped middleware
- Clerk auth (orgs = agencies, roles: Owner/Admin/Advisor/Read-Only/Client)
- All 15 screens wired to live data (replace demo data)
- NMI Gateway integration: Collect.js tokenization, invoicing, payment links, webhooks, Customer Vault
- Cloudflare R2 file storage + signed URLs for docs/passports
- Mirror-mode read-only enforcement (server-side, not just UI)
- Deployment: Vercel (staging + production), lefthook, CI/CD
- Sentry + Vercel Analytics + uptime monitoring
- GDPR-minimum: data export + delete endpoints

### Definition of done

- ✅ 5 agencies onboardable via self-service Clerk flow
- ✅ 15 screens all pull from Neon (no demo data anywhere)
- ✅ NMI end-to-end: create invoice → payment link → client pays via Collect.js → webhook updates invoice status → visible in dashboard
- ✅ Mirror-mode: parent-agency user opens sub-agency workspace, all mutations blocked server-side (verified by automated test)
- ✅ Sentry captures both frontend + edge fn errors w/ source maps
- ✅ Automated tests: 60%+ line coverage on Server Actions + auth middleware, 5 E2E happy paths green
- ✅ Load test: 100 concurrent users, p95 < 500ms on Dashboard + Master Trip Board
- ✅ Zero secrets in git (verified by `git secrets --scan`)
- ✅ Zero raw `SELECT * FROM x` without `agency_id` filter (verified by Drizzle middleware test)

---

## 2. Bootstrap (Task 1.0)

**Owner:** solo (blocks all downstream). ~1 day.

### Steps

1. **Establish `main` branch from source:**
   ```bash
   git fetch origin
   git worktree add ../voyance-main -b main origin/claude/build-full-stack-app-DwS4h
   cd ../voyance-main
   ```

2. **Version audit (per `00-stack-decisions.md` §Version audit workflow):**
   ```bash
   pnpm dlx npm-check-updates --format group
   # bump anything lagging >1 minor
   ```

3. **Framework migration Vite → Next.js 15:**
   - `pnpm create next-app@latest . --typescript --tailwind --app --turbopack --no-src-dir --import-alias "@/*"`
   - Merge existing `src/` under `app/(dashboard)/*` route groups
   - Convert `App.tsx` `useState` screen switch → file-based routes:
     - `app/(dashboard)/dashboard/page.tsx`
     - `app/(dashboard)/trips/requests/page.tsx`
     - `app/(dashboard)/trips/board/page.tsx`
     - `app/(dashboard)/calendar/page.tsx`
     - `app/(dashboard)/tasks/page.tsx`
     - `app/(dashboard)/time/page.tsx`
     - `app/(dashboard)/commissions/page.tsx`
     - `app/(dashboard)/feedback/page.tsx`
     - `app/(dashboard)/portal/page.tsx`
     - `app/(dashboard)/templates/page.tsx`
     - `app/(dashboard)/hub/page.tsx`
     - `app/(dashboard)/reports/page.tsx`
     - `app/(dashboard)/admin/[[...tab]]/page.tsx`
     - `app/(dashboard)/platform/page.tsx`
     - `app/(dashboard)/itinerary/[tripId]/page.tsx`
     - `app/(portal)/portal/[accessCode]/page.tsx` (client-facing, no chrome)
   - Layout: `app/(dashboard)/layout.tsx` = Topbar + Sidebar shell
   - Uninstall `react-router-dom` (unused per verified inspection)

4. **`.claude/project.json`** — declare ownership + scope:
   ```json
   {
     "name": "voyance",
     "description": "Voyance luxury travel operations platform",
     "owner": "hexvar:fullstack-perfectionist",
     "reviewer": "hexvar:reviewer",
     "identities": { "profile": "bentheautomator-personal" },
     "session_scope": { "mode": "this-repo-only" },
     "permissions": {
       "allowed_write_roots": ["~/.claude"],
       "allowed_agent_patterns": ["hexvar:*", "army-*", "oracle-*"]
     }
   }
   ```

5. **gitguard init:**
   ```bash
   gitguard init
   gitguard install-hooks
   ```

6. **Lefthook config** — pre-commit lint + type-check, pre-push tests + build.

7. **Baseline CI on Vercel:** connect repo, staging env pointing at Neon dev branch, production env pending.

### Acceptance

- `pnpm dev` boots Next.js at localhost:3000
- All 15 route paths render (empty state OK)
- `gitguard status` reports clean w/ ship.toml active
- `lefthook run pre-commit --force` exits 0

---

## 3. Database schema (Task 1.1)

**Owner:** parallel-safe after Task 1.0. ~1 day.

### 13 tables (per spec §10)

Drizzle schema file: `db/schema.ts`. Every table carries `agency_id` (except `agencies` itself). Every table has `created_at`, `updated_at`, `deleted_at` (soft delete).

```ts
// db/schema.ts (excerpt — full file spawns per-table)
import { pgTable, uuid, text, timestamp, jsonb, integer, numeric, boolean, index } from 'drizzle-orm/pg-core';

export const agencies = pgTable('agencies', {
  id: uuid('id').primaryKey().defaultRandom(),
  name: text('name').notNull(),
  slug: text('slug').notNull().unique(),
  plan: text('plan', { enum: ['starter', 'professional', 'enterprise'] }).notNull().default('starter'),
  branding: jsonb('branding').$type<{ primary: string; logo?: string }>(),
  settings: jsonb('settings').$type<Record<string, unknown>>(),
  parent_agency_id: uuid('parent_agency_id').references(() => agencies.id),   // sub-account link
  nmi_credentials_kms_ref: text('nmi_credentials_kms_ref'),   // encrypted vault ref, not raw
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'),
});

export const users = pgTable('users', {
  id: uuid('id').primaryKey().defaultRandom(),
  agency_id: uuid('agency_id').references(() => agencies.id).notNull(),
  clerk_id: text('clerk_id').notNull().unique(),
  email: text('email').notNull(),
  role: text('role', { enum: ['owner', 'admin', 'advisor', 'read_only', 'client'] }).notNull(),
  avatar_url: text('avatar_url'),
  created_at: timestamp('created_at').defaultNow().notNull(),
  updated_at: timestamp('updated_at').defaultNow().notNull(),
  deleted_at: timestamp('deleted_at'),
}, (t) => ({ agencyIdx: index('users_agency_idx').on(t.agency_id) }));

// ... clients, trips, tasks, invoices, commissions, documents, templates, feedback, time_entries, retainers
// See phase-1-schema.sql (autonomous agent generates from this spec)
```

### Required tables

`agencies · users · clients · trips · tasks · invoices · invoice_items · commissions · documents · templates · feedback · time_entries · retainers`

Plus 3 supporting: `audit_log · webhooks_received · payment_transactions`.

### Tenant-scoped query middleware

`db/tenant.ts`:

```ts
export async function tenantDb() {
  const { orgId } = auth();
  if (!orgId) throw new Error('Unauthenticated');
  return {
    query: <T>(q: PgSelect<T>) => q.where(eq(schema.$agencyId, orgId)),
    // wrapper enforces agency_id filter on every read
  };
}
```

**Rule:** every Server Action / Route Handler MUST use `tenantDb()`. Raw `db.select().from(...)` w/o tenant filter = automatic PR review reject.

### Migrations

- `drizzle-kit generate` → migrations checked into `db/migrations/`
- `drizzle-kit migrate` runs in Vercel pre-deploy step (via `vercel-build` script)
- Neon branch-per-PR = each preview deploy gets an isolated schema copy

### Acceptance

- `pnpm db:generate` produces migration for all 16 tables
- `pnpm db:migrate` applies cleanly to Neon dev branch
- Every table has `agency_id` FK (except `agencies`) verified by test
- Tenant middleware unit test: query w/o `orgId` throws; query w/ `orgId` filters correctly

---

## 4. Auth + tenancy (Task 1.2)

**Owner:** parallel-safe. ~1 day.

### Clerk setup

- Clerk Organizations = agencies (1:1 mapping)
- Clerk Roles: map to `owner/admin/advisor/read_only/client`
- Client portal auth: separate `@clerk/nextjs` client-user tier + `signInWith('email')` magic link via Resend as fallback
- Webhook: `POST /api/webhooks/clerk` — on `user.created` / `organization.created` → mirror into Neon `users` / `agencies` tables

### Middleware

`middleware.ts`:

```ts
import { clerkMiddleware, createRouteMatcher } from '@clerk/nextjs/server';

const isProtected = createRouteMatcher(['/(dashboard)(.*)', '/api/(.*)']);
const isPortal = createRouteMatcher(['/portal/(.*)']);

export default clerkMiddleware((auth, req) => {
  if (isProtected(req)) auth().protect();
  if (isPortal(req)) auth().protect({ role: 'client' });
});
```

### Mirror-mode

When Ben (Owner of parent agency) opens a sub-agency workspace:

- URL: `/(dashboard)?mirror=<sub-agency-id>`
- Server Action reads `mirror` param, verifies parent-child relationship in `agencies.parent_agency_id`
- Sets `tenantDb()` context to the SUB-agency's `agency_id`
- Sets `readonly: true` in context — every mutation server action checks this flag first, throws if set
- UI shows "MIRROR MODE / READ ONLY" banner (already exists in prototype)

### Acceptance

- Sign-up flow: new agency → new Clerk org → new `agencies` + `users` row → redirect to `/dashboard`
- Sign-in preserves org selection
- Mirror-mode E2E: parent opens child workspace, all 15 screens render, any mutation (create task, edit trip) returns 403 w/ "mirror mode read-only"
- Client portal: magic-link email → click → land on `/portal/[accessCode]` → see only their trip

---

## 5. Screen wiring (Tasks 1.3 - 1.5)

**~6-8 dev-days total, DAG-parallel-safe.**

Every screen swaps its demo-data source for a Server Component that calls `tenantDb()`. Mutations move to Server Actions using `next-safe-action` + Zod.

### Task 1.3 — Core Ops (parallel, file-disjoint)

| Screen | File | Contract |
|---|---|---|
| Dashboard | `app/(dashboard)/dashboard/page.tsx` | Read: KPI aggregates, today's priorities (tasks due today), upcoming departures (trips WHERE departure BETWEEN now AND now+7d), automation alerts (last 20 events) |
| Trip Requests | `app/(dashboard)/trips/requests/page.tsx` | Read: trips WHERE status IN ('new', 'qualifying', 'proposal_sent', 'booked'). Mutations: `moveTripStage(id, stage)` |
| Master Trip Board | `app/(dashboard)/trips/board/page.tsx` | Read: trips grouped by month + stage. Mutations: full trip CRUD |
| Calendar | `app/(dashboard)/calendar/page.tsx` | Read: events (trips.departure/return + tasks.due_date + custom events) for month |

### Task 1.4 — Ops + Client (parallel, file-disjoint)

| Screen | File | Contract |
|---|---|---|
| Tasks | `app/(dashboard)/tasks/page.tsx` | Read: tasks WHERE agency_id + optional filter. Mutations: CRUD + drag-to-status |
| Time & Retainers | `app/(dashboard)/time/page.tsx` | Read: time_entries + retainers. Mutations: timer start/stop, retainer package CRUD, KPI aggregates |
| Commissions | `app/(dashboard)/commissions/page.tsx` | Read: commissions w/ supplier + trip joins. Mutations: mark received, adjust split |
| Client Feedback | `app/(dashboard)/feedback/page.tsx` | Read: feedback w/ client + trip joins. Mutations: submit response, category filter |
| Client Portal (advisor cfg) | `app/(dashboard)/portal/page.tsx` | Read: portal config per agency. Mutations: regenerate access code, brand toggle |

### Task 1.5 — Resources + Platform (parallel, file-disjoint)

| Screen | File | Contract |
|---|---|---|
| Templates & Hub | `app/(dashboard)/templates/page.tsx` | Read: templates by category. Mutations: create/duplicate/archive, variable substitution |
| Advisor Hub | `app/(dashboard)/hub/page.tsx` | Read: messages by channel. Mutations: post, mark read. Realtime deferred to Phase 2 (polling every 30s Phase 1) |
| Reports | `app/(dashboard)/reports/page.tsx` | Read: aggregations (revenue MTD/QTD/YTD, booking trends, client metrics). Server Component w/ streamed sub-queries |
| Admin | `app/(dashboard)/admin/[[...tab]]/page.tsx` | 7-tab shell: Staff, Automations (Phase 2), Payments (invoicing + links), Agency Settings, Notifications, Passport, Team Calendar |
| Platform (sub-accounts) | `app/(dashboard)/platform/page.tsx` | Read: parent's child agencies. Mutations: onboard new agent (Clerk org create), mirror-mode entry |

### Wiring pattern (single-screen contract example)

```ts
// app/(dashboard)/tasks/page.tsx
import { tenantDb } from '@/db/tenant';
import { tasks } from '@/db/schema';
import TasksBoard from './tasks-board';

export default async function TasksPage() {
  const db = await tenantDb();
  const rows = await db.query(db.select().from(tasks).where(isNull(tasks.deleted_at)));
  return <TasksBoard initialTasks={rows} />;
}
```

```ts
// app/(dashboard)/tasks/actions.ts
'use server';
import { z } from 'zod';
import { action } from '@/lib/safe-action';

export const createTask = action
  .schema(z.object({
    title: z.string().min(1),
    trip_id: z.string().uuid().optional(),
    assignee_id: z.string().uuid(),
    priority: z.enum(['urgent', 'high', 'normal', 'low']),
    due_date: z.string().datetime().optional(),
  }))
  .action(async ({ parsedInput }) => {
    const db = await tenantDb({ requireMutate: true });   // throws in mirror mode
    return db.insert(tasks).values(parsedInput).returning();
  });
```

### Acceptance (per screen)

- Zero references to demo-data files (grep clean)
- Server Component streams initial data w/o layout shift
- All mutations wired w/ `useOptimistic` for perceived latency
- Empty state, loading state, error state all designed + implemented
- Zod schema on every input
- Mirror-mode block verified by unit test

---

## 6. NMI Gateway (Task 1.6)

**~5-7 dev-days. Highest risk in Phase 1. Sandbox from day 1.**

### Sub-components

1. **Per-tenant credentials vault**
   - Store NMI credentials encrypted at rest — use Vercel `env: encrypted` + KMS via `@aws-sdk/client-kms`
   - `agencies.nmi_credentials_kms_ref` = KMS key alias
   - Never log raw creds, never surface in API responses

2. **Collect.js embed** (client-side tokenization)
   - Load `<script src="https://secure.nmi.com/token/Collect.js" data-tokenization-key="...">` in payment forms
   - On successful token: POST to `/api/payments/charge` w/ token + amount + invoice_id
   - Server calls NMI `sale.api` w/ token, returns transaction result
   - Never send card data through Voyance servers (PCI scope minimization)

3. **Invoice CRUD** (`app/(dashboard)/admin/payments/invoices/*`)
   - Create invoice: line items, due date, gateway picker (if agency has multiple)
   - Generate NMI-hosted payment page URL per invoice
   - Status: `draft · sent · viewed · paid · overdue · void`

4. **Payment links** (`app/(dashboard)/admin/payments/links/*`)
   - Shareable URLs backed by unique token
   - Redirect to NMI-hosted checkout w/ pre-filled amount + agency branding
   - Track view count + conversion

5. **Webhook handler** (`app/api/webhooks/nmi/route.ts`)
   - Verify signature per NMI's HMAC scheme
   - Events: `sale.success · sale.decline · sale.refund · sale.chargeback`
   - Update `invoices.status` + `payment_transactions` + trigger notification email via Resend

6. **Customer Vault** (recurring)
   - Store tokenized payment methods per client via NMI Customer Vault API
   - Recurring charge cron: Vercel Cron nightly, charges retainer subscriptions
   - Handle failures: retry 3 times over 7 days, then notify agency

7. **Settlement dashboard** (`app/(dashboard)/admin/payments/gateway/*`)
   - Poll NMI settlement API daily via cron
   - Store settlement batches in `payment_transactions`
   - Display batch history w/ payout amounts + fees

### Sandbox contract

- NMI provides free sandbox account
- All test flows use sandbox merchant creds
- Zero live NMI calls in staging or dev branches
- Production cutover only after all 6 sub-components green in sandbox

### Acceptance

- Create invoice → generate payment link → open in incognito → pay with test card `4111 1111 1111 1111` → webhook fires within 10s → invoice status flips to `paid` → notification email sent
- Recurring charge fires nightly cron, updates retainer usage
- Refund via NMI portal → webhook → invoice status flips to `refunded`
- Failed transaction: dashboard shows in `overdue` bucket, notification sent
- Load test: 50 concurrent payment tokenizations, zero failures
- Security: `curl -X POST /api/webhooks/nmi -d '<bogus>'` returns 401 (signature validation)

---

## 7. Storage + docs (Task 1.7)

**~1 day, parallel-safe after Task 1.0.**

- Cloudflare R2 bucket per env: `voyance-docs-{dev,staging,prod}`
- S3 SDK w/ endpoint override to R2 API
- Upload flow: client requests presigned URL from Server Action → direct upload to R2 → returns key → server writes `documents` row
- Download: server generates presigned GET URL (5-min TTL) → client fetches
- Client portal: same flow but scoped by `access_code` verification

### Acceptance

- Upload 10MB PDF, verify appears in R2 dashboard + `documents` table
- Download via presigned URL succeeds, expires after 5 min
- Cross-tenant access blocked: agency-A user cannot get URL for agency-B doc

---

## 8. Deploy + CI (Task 1.8)

**~1 day, runs alongside other tasks.**

- Vercel project connected to `main` = production, `staging` branch = staging preview
- PR preview per push (Vercel default)
- Neon branch-per-PR: `neon branches create --parent main` in Vercel Deploy Hook
- Lefthook: `pre-commit` = `eslint --fix + prettier + tsc --noEmit`, `pre-push` = `vitest run + next build`
- Playwright E2E in Vercel Deploy Protection hook (staging only, blocks prod promotion)

### Acceptance

- Push to feature branch → Vercel preview URL live in <90s
- Push to `main` → production deploy triggered
- Failed test blocks deploy
- Rollback: `vercel rollback <deployment-url>` works

---

## 9. Monitoring + hardening (Task 1.9)

**~1 day, final polish before launch.**

- `@sentry/nextjs` initialized in `sentry.client.config.ts` + `sentry.server.config.ts` + `sentry.edge.config.ts`
- Source maps uploaded via Sentry CLI in `postbuild` hook
- Vercel Analytics + Speed Insights added to root layout
- Uptime: BetterStack or Vercel status page → `https://voyance.app/api/health` every 30s
- Rate limit: `@upstash/ratelimit` (or Vercel KV native) on `/api/*` — 100 req/min per user
- Security headers: `next.config.js` w/ CSP, HSTS, X-Frame-Options
- Audit log middleware: writes `audit_log` row on every mutation Server Action

### GDPR minimum (in scope for Phase 1)

- `POST /api/user/export` — returns JSON dump of user's + agency's data
- `DELETE /api/user/account` — soft-deletes all user data, hard-deletes Clerk user, 30-day retention window before hard delete

### Acceptance

- Trigger frontend error → appears in Sentry within 60s w/ source-mapped stack
- `/api/health` returns 200 in <100ms
- Rate limit: 101st request in a minute returns 429
- Security headers verified via securityheaders.com scan (A grade)
- Data export downloads valid JSON w/ all tenant data

---

## 10. Work packet DAG (parallel dispatch)

Autonomous agent runs the DAG below. Bar `⟶` = must-block, bar `∥` = parallel-safe (file-disjoint).

```
1.0 Bootstrap                                     [BLOCKING for all]
        ⟶
1.1 DB schema         1.2 Auth/tenancy   1.7 Storage   1.8 Deploy/CI   1.9 Monitoring
      (parallel ∥)          (parallel ∥)   (parallel ∥) (parallel ∥)   (parallel ∥)
        ⟶
1.3 Core Ops          1.4 Ops+Client     1.5 Resources+Platform
   (parallel ∥ each screen file-disjoint)
        ⟶
1.6 NMI Gateway (serialized — hot surface, hand-built, no fork parallelism)
        ⟶
LAUNCH GATE — Ben approval on staging demo before prod cutover
```

### File-disjoint fork boundaries

Task 1.3-1.5 forks are safe because each screen writes only to:
- Its own `app/(dashboard)/<screen>/page.tsx` + `actions.ts` + colocated components
- `db/schema.ts` and `db/tenant.ts` are READ-ONLY after Task 1.1
- Shared components (`components/ui/*`) are READ-ONLY (created in Task 1.0)

Any fork wanting to add a shared component OR modify schema → must serialize, coordinator merges sequentially.

---

## 11. Acceptance test matrix

| Category | Method | Threshold |
|---|---|---|
| Unit tests | Vitest | 60% line coverage on Server Actions + auth middleware |
| E2E happy path | Playwright | 5 flows green: sign-up · create trip · assign task · create invoice · pay invoice |
| Load | k6 or Vercel test | 100 concurrent users, p95 < 500ms on Dashboard |
| Security | `git secrets --scan` + Sentry secrets scan | Zero secrets in git or logs |
| Tenant isolation | Automated | Cross-tenant SELECT returns 0 rows |
| Mirror mode | Automated | Cross-mutation returns 403 |
| PCI | NMI SAQ-A self-assessment | Passing |
| A11y | Lighthouse | 90+ on all top-level routes |
| Bundle size | Next build report | <150KB First Load JS per route |

---

## 12. Explicit out-of-scope

Push to Phase 2 (see `phase-2.spec.md`):

- Mobile responsive layouts (Phase 1 = desktop-first, tablet works, mobile future)
- PWA / service worker / push notifications
- AI itinerary generation (Claude API integration into ItineraryBuilder)
- Workflow automation engine (rule-based triggers, sequences)
- Advanced reports (custom aggregations, CSV/PDF exports)
- Realtime collaboration (Ably) — Phase 1 uses polling
- SOC 2 attestation prep (Phase 1 = GDPR minimum only)
- Multi-currency conversion display (Phase 1 = USD only)
- Batch invoice processing

---

## Appendix A: Environment variables required

```
# Neon
DATABASE_URL=postgres://...
DATABASE_POOLED_URL=postgres://...

# Clerk
NEXT_PUBLIC_CLERK_PUBLISHABLE_KEY=pk_...
CLERK_SECRET_KEY=sk_...
CLERK_WEBHOOK_SECRET=whsec_...

# R2
R2_ACCOUNT_ID=...
R2_ACCESS_KEY_ID=...
R2_SECRET_ACCESS_KEY=...
R2_BUCKET=voyance-docs-prod

# NMI (per-agency stored encrypted in DB; these are platform defaults)
NMI_SANDBOX_KEY=...           # dev/staging only
NMI_WEBHOOK_SECRET=...
AWS_KMS_KEY_ID=alias/voyance-nmi-creds
AWS_REGION=us-east-1

# Resend
RESEND_API_KEY=re_...
RESEND_FROM=noreply@voyance.app

# Sentry
SENTRY_DSN=https://...
SENTRY_AUTH_TOKEN=...
NEXT_PUBLIC_SENTRY_DSN=https://...

# Upstash (rate limit)
KV_REST_API_URL=...
KV_REST_API_TOKEN=...
```

All stored in Vercel env, mirrored to `.env.local` via `vercel env pull` for local dev.

---

## Appendix B: Cost estimate

| Bucket | Days | $ @ $8-12k/wk |
|---|---|---|
| 1.0 Bootstrap + framework port | 1-2 | $1.6-4.8k |
| 1.1 Schema | 1 | $1.6-2.4k |
| 1.2 Auth + tenancy | 1 | $1.6-2.4k |
| 1.3-1.5 15 screens (parallel) | 6-8 | $9.6-19.2k |
| 1.6 NMI Gateway | 5-7 | $8-16.8k |
| 1.7 Storage | 1 | $1.6-2.4k |
| 1.8 Deploy/CI | 1 | $1.6-2.4k |
| 1.9 Monitoring | 1 | $1.6-2.4k |
| QA + bugfix buffer | 3-5 | $4.8-12k |
| **Total** | **20-27** | **$32-64.8k** raw · **$18-32k** compressed (fork parallelism reduces wall-clock 40-50%) |
