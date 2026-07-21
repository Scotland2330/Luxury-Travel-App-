# CLAUDE.md — Voyance

Repo-specific rules + navigation for Claude Code sessions in this project.

## Ownership

- **Repo:** `FirstClassOps/voyance` (private)
- **Product owner:** First Class Operations
- **Engineering owner:** `hexvar:fullstack-perfectionist` (per `.claude/project.json`)
- **Reviewer (merge gate):** `hexvar:reviewer`
- **Identity profile:** `fco-client` (uses `bentheautomator` GH account, FCO Vercel/Neon/Sentry conventions)
- **Session scope:** `this-repo-only` (do NOT drift into other repos without operator approval)

Global Army rules apply. See `~/.claude/CLAUDE.md` for the always-loaded core.

## Navigation

| Ask | Read |
|---|---|
| What does Voyance do? | [`docs/product-spec.md`](docs/product-spec.md) |
| Which stack + versions? | [`docs/specs/00-stack-decisions.md`](docs/specs/00-stack-decisions.md) |
| Phase 1 build plan? | [`docs/specs/phase-1.spec.md`](docs/specs/phase-1.spec.md) |
| Phase 2 build plan? | [`docs/specs/phase-2.spec.md`](docs/specs/phase-2.spec.md) |
| How to kick autonomous overnight loop? | [`docs/specs/autonomous-execution.md`](docs/specs/autonomous-execution.md) |
| Session state / resume? | `.claude/session.md` (gitignored, operator-private) |

## Do

- Always route via `hexvar:fullstack-perfectionist` for implementation, `hexvar:reviewer` for review
- Use `tenantDb()` middleware for every DB query — see [`docs/specs/phase-1.spec.md`](docs/specs/phase-1.spec.md) §3
- Every mutation Server Action calls `tenantDb({ requireMutate: true })` — enforces mirror-mode read-only
- Version-pin per [`docs/specs/00-stack-decisions.md`](docs/specs/00-stack-decisions.md); run `pnpm dlx npm-check-updates` at each sprint boundary
- NMI Gateway integration = sandbox from day 1, production creds only after Ben-approval breakpoint

## Don't

- Don't fall back to Supabase (stack was swapped: Neon + R2 + Clerk + Vercel)
- Don't use react-router-dom (Next.js App Router replaces it — remove if any code imports it)
- Don't wire raw `db.select().from(...)` — always via `tenantDb()`
- Don't commit `.claude/session.md` (gitignored, operator-private)
- Don't touch NMI without Ben approval + sandbox verification first
- Don't push to `main` w/o senior review via `hexvar:reviewer` (per Army `pr-review-senior-required.md`)
- Don't merge PRs touching auth / DB migrations / NMI / secrets without operator sign-off

## Autonomous execution

Kickoff prompt (paste to fire loop):

```
/loop proceed with phase-1 per docs/specs/phase-1.spec.md
    autonomously per docs/specs/autonomous-execution.md
```

Runbook governs: preflight, DAG dispatch, breakpoints (NMI kickoff, NMI prod cutover, launch gate, cost cap, PR failure loop), kill switch, resume protocol.

## Deploy

- Vercel project name: `fco-voyance` (per `fco-client` profile prefix)
- Environments: `production` (main), `staging` (staging branch), `preview` (per PR)
- Neon: branch-per-PR (each preview gets isolated DB)
- Env vars: see [`docs/specs/phase-1.spec.md`](docs/specs/phase-1.spec.md) Appendix A
- Vault (1Password): `Denise - Scope CFO, FCO`

## GH Issues taxonomy

Follows Army `gh-label-standard.md`. Phase-scoped labels:

- `phase-1` / `phase-2` — Which phase this belongs to
- `enhancement` / `bug` / `tech-debt` / `documentation` / `incident` / `security` — Type (exactly one)
- `sev:critical|high|medium|low` — Severity for bug/incident/security
- `area:auth|db|payments|ui|api|infra|portal` — Optional area filter
- `backlog` — Deferred w/ observable trigger in body

Seed labels with `/hexvar:seed-labels` after first session.

## Testing

- Unit: `pnpm test` (Vitest, 60%+ coverage on Server Actions + auth middleware)
- E2E: `pnpm test:e2e` (Playwright, 5 happy-path flows minimum)
- Type: `pnpm lint` (runs `tsc --noEmit` + ESLint)
- Pre-commit + pre-push hooks: lefthook (see `lefthook.yml`)

## Payments (NMI Gateway)

- Per-tenant merchant creds stored KMS-encrypted in `agencies.nmi_credentials_kms_ref`
- Client-side tokenization via Collect.js — card data NEVER hits Voyance servers
- Sandbox tests first, production cutover only after Ben-approval breakpoint
- Webhook signature verification MANDATORY on every incoming NMI event
- PCI: NMI SAQ-A self-attestation (Phase 2 formalization)

## Support / questions

- Ben: @bentheautomator on GH, iMessage
- FCO product: Denise (Scope CFO) — via 1Password shared vault
