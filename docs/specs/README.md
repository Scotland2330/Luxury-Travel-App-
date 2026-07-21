# Voyance Spec Pack

Execution-ready specs for autonomous overnight builds. Author: Claude Code, 2026-07-20.

## Contents

| File | Purpose |
|---|---|
| [`00-stack-decisions.md`](00-stack-decisions.md) | Locked stack + version pins (single source of truth for package.json) |
| [`phase-1.spec.md`](phase-1.spec.md) | Production MVP — auth, DB, 15 screens wired, NMI payments, launch |
| [`phase-2.spec.md`](phase-2.spec.md) | Mobile PWA, AI itinerary, workflow automation, compliance |
| [`autonomous-execution.md`](autonomous-execution.md) | Runbook for overnight loop mode — DAG dispatch, gates, resume |

## Companion (upstream)

- `../../Voyance - Luxury Travel App - Technical Specification.md` — source-of-truth product requirements (v1.0, 2026-07-21)

## Reading order

1. Stack decisions (`00-stack-decisions.md`) — locks the tech
2. Phase 1 spec (`phase-1.spec.md`) — first 5-6 weeks of work
3. Autonomous execution (`autonomous-execution.md`) — how to run overnight
4. Phase 2 spec (`phase-2.spec.md`) — after Phase 1 ships
