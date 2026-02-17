# PR Agent Loop — WolfWhale LMS

Deterministic, risk-aware PR pipeline for agent-driven development.

## Architecture

```
PR opened / synchronized
  |
  v
risk-policy-gate         classify risk tier, compute required checks,
  |                      enforce docs-drift rules, preflight policy
  v
wait-for-review          poll for code-review agent on current head SHA
  |
  v-- findings? -------- remediation agent pushes fix, loop restarts
  |
  v-- clean
resolve-stale-threads    auto-resolve bot-only review threads
  |
  v
ci (matrix)              lint | typecheck | test | build (parallel)
  |
  v
merge-gate               all-or-nothing verdict for branch protection
```

## Contract

All rules live in `.pr-policy.json` at the repo root. Workflows, scripts, and this doc derive behavior from that single file.

### Risk Tiers

| Tier | Paths | Review Agent | Human Reviewer | Evidence |
|------|-------|-------------|----------------|----------|
| Critical | auth, middleware, migrations, workflows, policy contract | Required | 1 | browser + test |
| High | API routes, server actions, supabase lib, scripts | Required | 1 | test |
| Medium | admin/teacher pages, layout components, lib | Required | 0 | none |
| Low | everything else | Skipped | 0 | none |

### Required Checks by Tier

- **Critical/High**: risk-policy-gate, code-review-agent, lint, typecheck, test, build
- **Medium**: risk-policy-gate, code-review-agent, lint, typecheck, build
- **Low**: risk-policy-gate, lint, build

### Docs Drift Rules

When control-plane files change (`.pr-policy.json`, `.github/workflows/**`), this doc must be updated in the same PR. When migrations are added, `types/database.types.ts` must be regenerated.

## SHA Discipline

- Review state is valid only for the current PR head commit
- Stale review comments tied to older SHAs are ignored
- Gate fails if the latest review run is non-success or times out
- Reruns are required after each synchronize/push event
- Rerun comments are deduplicated by `marker + sha:<head>`

## Scripts

| Script | Purpose |
|--------|---------|
| `scripts/pr-policy-gate.ts` | Risk classification, docs drift, review gate |
| `scripts/wait-for-review.ts` | Poll for review agent check run completion |
| `scripts/resolve-bot-threads.ts` | Auto-resolve bot-only review threads via GraphQL |

## npm Commands

```bash
npm run harness:pre-pr     # lint + typecheck + test + build (local preflight)
npm run harness:risk-tier   # run the policy gate locally (needs env vars)
npm run typecheck           # tsc --noEmit
npm test                    # vitest run
```

## Review Agent Configuration

The contract supports any review agent. Current config uses Greptile. To swap providers, update the `reviewAgent` section in `.pr-policy.json`:

```json
{
  "provider": "greptile",
  "checkRunName": "greptile-code-review",
  "timeoutMinutes": 20,
  "rerunMarker": "<!-- pr-agent-loop-rerun -->",
  "rerunCommand": "/greptile review"
}
```

## Branch Protection Setup

In GitHub repo settings, set `merge-gate` as the only required status check. The merge-gate job validates all upstream jobs passed, so a single check covers the entire pipeline.
