# Phase 2 — Mobile + AI + Automation

**Status:** Ready for autonomous execution AFTER Phase 1 launched + stable
**Duration:** 4-6 weeks calendar, 19-23 dev-days
**Cost frame:** $16-28k (AI-native pricing)
**Prereq:** Phase 1 shipped, 30 days of stable production data, no P0 open

---

## Scope + acceptance

### In scope

- Mobile responsive rework for 15 screens
- PWA: manifest, service worker, offline resilience, push notifications
- AI itinerary generation via Claude API (into existing 1,136 LOC ItineraryBuilder)
- Workflow automation engine (rule-based triggers, cron)
- Email transactional (Resend + React Email templates + sequences)
- Advanced reports (aggregations, CSV/PDF exports)
- Realtime (Ably) — task updates, hub streaming, dashboard KPI push
- SOC 2 alignment prep + PCI attestation
- Multi-currency support

### Definition of done

- ✅ All 15 screens usable on iPhone 15 (390×844) + Pixel 8 (412×915)
- ✅ PWA installable on iOS 17 + Android 14; offline: trip detail viewable, mutations queue
- ✅ AI itinerary: enter destination + dates + budget + preferences → structured itinerary JSON in <30s → editable → PDF export
- ✅ Workflow automation: user creates rule "when trip → confirmed, send email X, create task Y", rule fires within 30s of trigger
- ✅ Passport expiration cron: nightly job scans, alerts at 90/60/30 days
- ✅ Realtime: task moved on advisor A's screen appears on advisor B's screen in <2s
- ✅ CSV export: reports downloadable, PDF export via server-side renderer
- ✅ SOC 2: audit log complete, access review process documented, backup verified
- ✅ PCI: NMI SAQ-A attestation signed by Ben

---

## Work packets

### 2.1 Mobile responsive (3-4 days)

- Tailwind breakpoints: 375px (mobile), 640px (large mobile), 768px (tablet), 1024px+ (desktop)
- Sidebar → hamburger drawer at <768px (Radix Drawer or Vaul)
- Kanban → horizontal-scroll on mobile, swipe-to-complete gesture
- Tables → card stacks on mobile (`hidden md:table-cell` pattern)
- Touch targets ≥44px (`min-h-11 min-w-11`)
- Modals → bottom sheet on mobile
- Client portal: prioritize mobile-first (majority of clients access via phone)

**Files touched:** every screen's colocated components. Parallel-safe file-disjoint per screen.

**Acceptance:** Playwright device emulation runs 5 flows on iPhone + Android viewports, all green.

### 2.2 PWA (1 day)

- `next-pwa` (with Next 15 App Router compat, or hand-rolled service worker)
- `public/manifest.json` w/ agency-branded icons per subdomain
- Service worker caches: `/`, static assets, last 5 viewed trips
- Push notifications: `web-push` package + VAPID keys, opt-in flow

**Acceptance:** iOS 17.4+ + Android install prompt works, offline shows cached content, push notification received on new trip request.

### 2.3 AI itinerary (2-3 days)

- Extend `app/(dashboard)/itinerary/[tripId]/page.tsx` w/ "Generate w/ AI" button
- Server Action: `generateItinerary(destination, dates, budget, preferences)` → Anthropic API w/ tool-use for structured output
- Response schema (Zod-validated):

```ts
const ItinerarySchema = z.object({
  days: z.array(z.object({
    date: z.string(),
    theme: z.string(),
    accommodations: z.array(z.object({ name: z.string(), type: z.string(), notes: z.string() })),
    activities: z.array(z.object({ time: z.string(), title: z.string(), duration_min: z.number(), notes: z.string() })),
    dining: z.array(z.object({ time: z.string(), venue: z.string(), notes: z.string() })),
    transfers: z.array(z.object({ from: z.string(), to: z.string(), mode: z.string() })),
  })),
});
```

- Advisor reviews + edits in existing UI (already built in prototype)
- PDF export: `@react-pdf/renderer` or Puppeteer via Vercel Fn
- Template application: existing template + smart date shift

**Acceptance:** Generate 7-day Paris itinerary in <30s, editable, PDF renders with agency branding.

### 2.4 Workflow automation (3-4 days)

- Rule schema table: `automation_rules` (agency_id, trigger, conditions, actions, active)
- Trigger types: `trip.stage_changed · task.due_date_approaching · invoice.overdue · document.expiring · time.scheduled_cron`
- Action types: `send_email(template_id) · create_task(...) · notify_advisor · update_field(...) · trigger_webhook(url)`
- Executor: Vercel Cron every minute polls trigger queue, dispatches to Server Action per rule
- Admin UI: `app/(dashboard)/admin/automations/page.tsx` — rule builder

**Acceptance:** Create rule "when trip.stage = confirmed → send email + create task", change trip stage, verify both fire within 30s.

### 2.5 Email + templates (1 day)

- React Email templates for: welcome, invoice, payment receipt, feedback request, follow-up
- Resend integration w/ per-agency FROM (via Clerk custom domain OR agency-configured)
- Unsubscribe link handling + database opt-out
- Deliverability monitoring via Resend dashboard alerts

**Acceptance:** 5 templates render + send + inbox-deliverable to Gmail + Outlook + Apple Mail.

### 2.6 Advanced reports (2 days)

- Pre-aggregation strategy: nightly cron rolls up daily/weekly/monthly summaries into `report_snapshots` table
- Report tabs (already in prototype): Revenue, Bookings, Client Analytics, Team Performance
- Server Components stream individual chart data
- CSV export: server generates + streams via `Response`
- PDF export: `@react-pdf/renderer` w/ branded template
- Scheduled reports: cron sends weekly summary email w/ PDF attached

**Acceptance:** Generate + email weekly report to agency owner every Monday 7am local time.

### 2.7 Realtime (1-2 days)

- Ably client + server SDK
- Channels per agency: `agency:{id}:tasks · agency:{id}:trips · agency:{id}:hub`
- Client hooks: `useAblyChannel(channel)` returns messages + presence
- Server publishes on every mutation: Server Action side-effect fires Ably publish
- Fallback: if Ably unreachable, polling every 30s (Phase 1 behavior)

**Acceptance:** Two browser sessions same agency: mutation in one visible in other in <2s.

### 2.8 Compliance (2 days)

- Audit log middleware (already scoped in Phase 1) — verify complete, add retention policy
- Access review: quarterly report auto-generated of who accessed what
- Data export/delete flows verified against real user request
- Backup verification: monthly restore-drill in staging
- PCI: complete NMI SAQ-A, upload to shared drive
- SOC 2 prep: Vanta or Drata onboarding (Ben decision if committing to SOC 2)

**Acceptance:** SAQ-A signed, backup restore drill passes, audit log has 100% mutation coverage (verified by test).

### 2.9 Multi-currency (1 day)

- Currency field on `invoices` + `payment_transactions` (USD/EUR/GBP/CAD/AUD)
- Display: format via `Intl.NumberFormat`
- Aggregation: convert to agency's base currency for reports (use daily FX rate from exchangerate-api.com cached in KV)

**Acceptance:** Create EUR invoice, appears in EUR on invoice PDF, converts to USD in agency dashboard totals.

### 2.10 QA + buffer (3 days)

- Regression suite: full E2E on staging
- Load test: 500 concurrent users, p95 <800ms
- Mobile device matrix: BrowserStack scan
- Bugfix + polish

---

## Cost estimate

| Bucket | Days | $ @ $8-12k/wk |
|---|---|---|
| 2.1 Mobile responsive | 3-4 | $4.8-9.6k |
| 2.2 PWA | 1 | $1.6-2.4k |
| 2.3 AI itinerary | 2-3 | $3.2-7.2k |
| 2.4 Workflow automation | 3-4 | $4.8-9.6k |
| 2.5 Email + templates | 1 | $1.6-2.4k |
| 2.6 Advanced reports | 2 | $3.2-4.8k |
| 2.7 Realtime | 1-2 | $1.6-4.8k |
| 2.8 Compliance | 2 | $3.2-4.8k |
| 2.9 Multi-currency | 1 | $1.6-2.4k |
| 2.10 QA + buffer | 3 | $4.8-7.2k |
| **Total** | **19-23** | **$30-55k** raw · **$16-28k** compressed via fork parallelism |

---

## Out of scope (Phase 3+)

- Native iOS/Android apps
- White-label reseller platform
- Marketplace of supplier integrations (Sabre, Amadeus, direct hotel APIs)
- Advanced AI: trip recommendations, predictive pricing, client sentiment analysis on feedback
- Multi-region deployment (Neon multi-region, R2 multi-region)
- CF Durable Objects migration from Ably (if scale demands)
- Advanced analytics: PostHog / Amplitude
