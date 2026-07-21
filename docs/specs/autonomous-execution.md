# Autonomous Execution Runbook — Overnight Mode

**Purpose:** Let Ben kick a session, walk away, wake up to progress.
**Author:** Claude Code, 2026-07-20
**Prereq:** Phase 1 spec locked (`phase-1.spec.md`), stack decisions locked (`00-stack-decisions.md`)

---

## What "autonomous overnight" means here

- Coordinator (main Claude) runs the DAG in `phase-1.spec.md`
- Dispatches fork agents in `isolation: "worktree"` mode per work packet
- Each fork ships a PR against `main`
- Coordinator senior-reviews each PR (per Army rule `pr-review-senior-required.md`), auto-fixes findings, auto-merges if safe
- Halts + notifies Ben at explicit **breakpoints** (see §Breakpoints below) — never blindly ships past a gate
- Cost cap enforced: token budget of $30 per overnight run (halts + notifies if exceeded)

---

## Preflight (Ben runs before walking away)

Interactive steps. Coordinator cannot do these — need Ben eyes/hands.

### 1. Ben-only decisions (unfilled from prior session)

Coordinator loads these from `.claude/session.md` "Remaining items" + AskUserQuestion at kickoff:

- [ ] Client portal auth = **Clerk client-tier + magic link** (default, unless Ben overrides)
- [ ] Neon plan = **Free tier** (dev), **Scale plan** (prod, ~$70/mo)
- [ ] Vercel plan = **Pro** (required for Cron + longer function timeouts, ~$20/mo)
- [ ] Clerk plan = **Free tier** (10k MAU included, upgrade at scale)
- [ ] Cloudflare R2 = **pay-as-you-go**, negligible cost at Phase 1 volume
- [ ] Resend plan = **Free tier** (3k emails/mo)
- [ ] Ably plan = **Free tier** (3M msgs/mo — Phase 2)
- [ ] NMI = Ben provides sandbox + production merchant creds (blocker for Task 1.6)

### 2. Provisioning (Ben runs interactively)

```bash
# Neon: create project + get connection strings
neon projects create --name voyance
neon connection-string voyance --branch main --pooled | pbcopy   # → DATABASE_POOLED_URL

# Vercel: link repo
vercel link
vercel env pull .env.local

# Clerk: create app manually in dashboard, add publishable + secret to Vercel env
open https://dashboard.clerk.com/apps/new

# Cloudflare: R2 bucket via wrangler
wrangler r2 bucket create voyance-docs-prod
wrangler r2 bucket create voyance-docs-staging

# Resend: create API key
open https://resend.com/api-keys

# Sentry: create Next.js project
open https://sentry.io/new/project/?platform=javascript-nextjs
```

Populate Vercel env vars per `phase-1.spec.md` Appendix A. Verify via `vercel env ls`.

### 3. Repo bootstrap (Ben runs, one-time)

```bash
cd /Users/automator/git/automator-fco/Luxury-Travel-App-
git fetch origin
git worktree add ../voyance-main -b main origin/claude/build-full-stack-app-DwS4h
cd ../voyance-main

# gitguard init (enables MCP tools for coordinator)
gitguard init
gitguard install-hooks

# Author project.json (coordinator will do this if missing, but faster if pre-set)
cat > .claude/project.json <<'EOF'
{
  "name": "voyance",
  "owner": "hexvar:fullstack-perfectionist",
  "reviewer": "hexvar:reviewer",
  "identities": { "profile": "bentheautomator-personal" },
  "session_scope": { "mode": "this-repo-only" },
  "permissions": {
    "allowed_write_roots": ["~/.claude"],
    "allowed_agent_patterns": ["hexvar:*", "army-*", "oracle-*"]
  }
}
EOF
```

### 4. Seed GitHub Issues from Phase 1 work packets

```bash
# Coordinator does this if not done; Ben can pre-seed to save time
for pkt in "1.0 Bootstrap" "1.1 DB schema" "1.2 Auth + tenancy" "1.3 Core Ops screens" "1.4 Ops+Client screens" "1.5 Resources+Platform screens" "1.6 NMI Gateway" "1.7 Storage" "1.8 Deploy/CI" "1.9 Monitoring"; do
  gh issue create --title "[phase-1] $pkt" --label "phase-1,enhancement" --body "See docs/specs/phase-1.spec.md §$pkt"
done
```

---

## Kicking the loop

Once preflight done, Ben says:

> `/loop 45m proceed with phase-1 per docs/specs/phase-1.spec.md, dispatching per docs/specs/autonomous-execution.md`

OR autonomous:

> `/loop proceed with phase-1 autonomously per docs/specs/`

Coordinator then executes the DAG below.

---

## Coordinator DAG (what the loop does per tick)

```
Loop tick:
  1. Read TaskList — find highest-priority pending task
  2. If task = "1.0 Bootstrap" (serial):
       - Do inline (no fork)
       - Run acceptance tests
       - Mark completed, commit, push, open PR, senior-review, auto-merge
  3. If task ∈ {1.1, 1.2, 1.3, 1.4, 1.5, 1.7, 1.8, 1.9} (parallel-safe):
       - Dispatch fork Agent(isolation: "worktree") per §Fork dispatch template
       - Wait for fork to finish (or timeout at 30 min)
       - Senior-review PR via hexvar:reviewer
       - Auto-fix HIGH+MEDIUM findings per Army rule
       - Auto-merge if safe per pr-auto-merge-when-safe.md
  4. If task = "1.6 NMI Gateway" (serial, hot surface):
       - Ben-approval breakpoint: notify + halt
       - Reason: PCI-adjacent, per-tenant credential vault, real merchant creds
  5. At end of tick: TaskList, /handoff (updates .claude/session.md)
  6. Sleep until next tick OR halt if breakpoint hit
```

---

## Fork dispatch template (per work packet)

Coordinator uses this shape (per Army `templates/dispatch-prompt-skeleton.md`):

```
Agent(
  subagent_type: "hexvar:fullstack-perfectionist",
  isolation: "worktree",
  description: "Phase 1 Task <N.M> — <title>",
  prompt: `
# Task <N.M> — <title>

## Context (verify at STEP 0)
- Read docs/specs/phase-1.spec.md §<section>
- Read docs/specs/00-stack-decisions.md for version pins
- Verify branch: git rev-parse --abbrev-ref HEAD == main (or task branch)
- Verify parent branch is at expected SHA: $(git rev-parse origin/main)

## STEP 0 sync (per fork-sync-ritual.md)
git fetch origin
git merge origin/main --no-edit

## Files ALLOWED
- <list per §File-disjoint fork boundaries in phase-1.spec.md>

## Files FORBIDDEN (escalate if you need to touch these)
- db/schema.ts (Task 1.1 only)
- db/tenant.ts (Task 1.1 only)
- middleware.ts (Task 1.2 only)
- Any file outside your allowed list

## Acceptance
<paste §Acceptance for this task from phase-1.spec.md>

## Report back
End your session with:
  \`\`\`
  TASK: 1.<N>
  STATUS: [green|red|blocked]
  PR: #<num> (URL)
  FILES: <count> changed
  TESTS: <n>/<n> passing
  ACCEPTANCE: [met|missed <criterion>]
  NOTES: <anything the coordinator needs to know>
  \`\`\`

## STEP N sync + push
git fetch origin
git merge origin/main --no-edit
gitguard ship
`,
)
```

---

## Breakpoints (coordinator halts + notifies)

Coordinator does NOT proceed past these without Ben:

| Breakpoint | Trigger | Notification | Resume |
|---|---|---|---|
| **NMI kickoff** | Before Task 1.6 dispatch | Send iMessage: "NMI Gateway starting. Confirm sandbox creds in Vercel env, then reply CONTINUE." | Ben reply: `CONTINUE` |
| **NMI prod cutover** | Task 1.6 sandbox tests green, ready for prod merchant creds | iMessage: "Sandbox green. Provide production NMI creds via 1Password, reply CONTINUE for prod cutover." | Ben confirms |
| **Launch gate** | All Task 1.x green, staging demo ready | iMessage: "Phase 1 staging demo live at <url>. Walk through, reply CONTINUE to prod launch." | Ben confirms |
| **Cost cap** | Tokens spent this run > $30 | iMessage: "Token budget hit. Halting. Reply BUDGET <n> to raise, RESUME to continue anyway, STOP to end." | Ben decides |
| **PR failure loop** | 3 consecutive fork PRs fail acceptance | iMessage: "3 forks failing. Halting to prevent cascade. Latest PR: <url>. Reply INVESTIGATE / SKIP / STOP." | Ben decides |
| **Breaking-change discovery** | Any task requires schema migration on non-empty prod DB | iMessage: "Task <N.M> requires migration on prod. Halting." | Ben decides |

---

## Kill switch

Ben can stop the loop any time by:

- Reply `STOP` in iMessage
- `/loop stop` in Claude Code
- Close the terminal (loop dies w/ session)

---

## Cost cap enforcement

- Per-run token budget: **$30** default. Ben can override at kickoff: `/loop budget:$50 proceed...`
- Coordinator tracks `budget.spent()` per Claude Code Workflow API
- Halts + notifies Ben at 80% of budget
- Hard-stops at 100%

---

## Progress tracking

Every tick, coordinator:

1. Updates TaskList (in_progress → completed)
2. Rewrites `.claude/session.md` via `/handoff` (captures state)
3. Comments on the parent tracking issue: `gh issue comment <phase-1-tracking> --body "Tick <N>: <status>"`
4. Posts iMessage summary if any breakpoint or significant progress: "Task 1.<N> merged, moving to 1.<N+1>"

---

## Resume protocol

If loop halted (manual, breakpoint, cost cap, error):

1. Ben types: `/handoff resume`
2. Coordinator reads `.claude/session.md`, summarizes state, restores TodoWrite
3. Coordinator asks: "Resume from last action (<action>)?"
4. Ben: yes → coordinator re-enters loop OR runs next explicit task

---

## Safety rules coordinator obeys during loop

**Non-negotiable (per Army global rules):**

- **No raw git/gh** — gitguard MCP tools only (per `no-raw-git-gh.md`)
- **No delete without WHY** — every `rm` / `git rm` requires justification block (per `no-delete-without-why.md`)
- **Never guess** — verify factual claims before stating (per `never-guess-verify-first.md`)
- **AskUserQuestion for decisions** — no markdown-list options (per `ask-user-question-mandate.md`)
- **PR review required** — every PR gets `hexvar:reviewer` before merge (per `pr-review-senior-required.md`)
- **Auto-fix HIGH+MEDIUM** — no ping-pong (per `pr-review-auto-fix.md`)
- **Auto-merge when safe** — CHANGELOG conflict check + protected-surface check (per `pr-auto-merge-when-safe.md`)
- **Session stays in repo scope** — no cross-repo work (per `session-stays-in-repo-scope.md`)
- **Fork sync ritual** — STEP 0 + STEP N syncs per `fork-sync-ritual.md`

**Pricing:** never regress to 1990s consultancy rates. Per `~/.claude/memory/feedback_ai_native_pricing.md`.

---

## Post-run report

At loop end (breakpoint OR completion), coordinator sends Ben:

```
=== Phase 1 Overnight Run — <date> ===
Tasks completed: <N>/<M>
PRs merged: <N> (list w/ URLs)
Tests: <passing>/<total>
Token spend: $<amount>
Breakpoint: <reason if halted, else "run completed">
Next: <what would run next tick>

Full log: .claude/session.md
```

---

## Escape hatches

- **Fork stuck > 30 min:** coordinator kills fork, marks task blocked, moves to next parallel task
- **PR review fails 3× on same finding:** coordinator escalates via iMessage, halts task
- **Env var missing:** halt immediately, notify Ben (can't proceed without secrets)
- **Neon migration fails:** halt, restore from Neon branch snapshot, notify
- **Vercel deploy fails 2× consecutive:** halt, notify (usually env var or build error)

---

## Expected overnight yield (single 8-hour run w/ 2 parallel forks max)

Realistic in 8 hours:

- Task 1.0 (Bootstrap) — 1 hr solo
- Task 1.1 + 1.2 + 1.7 + 1.8 + 1.9 in parallel — 2 hrs (limited by slowest fork)
- Task 1.3 (4 screens parallel) — 2 hrs
- Task 1.4 (5 screens parallel) — 2 hrs
- Task 1.5 (5 screens parallel) — 1 hr (some faster than others)

**8-hour run: ~40-60% of Phase 1 done.** Task 1.6 (NMI) blocks at breakpoint, needs Ben approval + real work.

Second overnight run: NMI + polish + launch gate → Phase 1 complete.

**Two overnight runs + 1-2 Ben-driven daytime sessions = Phase 1 shipped.**

---

## What Ben wakes up to (ideal case)

- 8+ PRs merged
- Staging URL live: `https://voyance-staging.vercel.app`
- Screenshot of dashboard w/ real data
- `.claude/session.md` w/ full state
- iMessage: "Overnight run complete. Task 1.6 NMI awaits your creds. Staging live: <url>. Report: <link>"

---

## What Ben wakes up to (bad case)

- 2 PRs merged, 1 fork stuck
- iMessage: "Halted at Task 1.3 — Playwright test flaky, 3 consecutive failures. Latest PR: <url>. Rerun w/ /loop resume OR investigate."
- Full context in `.claude/session.md`, resume with `/handoff resume`
