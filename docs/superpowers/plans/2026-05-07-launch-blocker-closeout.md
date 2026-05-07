# Launch Blocker Closeout Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:subagent-driven-development (recommended) or superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Reduce the remaining school-launch blockers that can be safely handled in the repo without applying production database changes or inventing unverified LMS workflows.

**Architecture:** Add verifiable launch-security checks around Supabase grants/RPCs, harden the direct RPC surface with a migration, and add protected role route shells for the minimum student/teacher/admin/guardian navigation surface. Keep the UI honest: these routes should be controlled-pilot shells, not fake operational workflows.

**Tech Stack:** Next.js App Router, TypeScript, Vitest, Supabase/Postgres migrations, Node CLI scripts.

---

### Task 1: Supabase Security Invariants

**Files:**
- Create: `lib/supabase/launch-security-checks.ts`
- Create: `scripts/check-supabase-launch-security.ts`
- Modify: `supabase/migrations/20260507141641_restrict_security_definer_rpc_surface.sql`
- Test: `tests/supabase-launch-security.test.ts`

- [x] **Step 1: Write failing tests**

Tests must prove the repo has explicit launch-security invariants for sensitive tables, security-definer RPCs, views, and storage buckets.

- [ ] **Step 2: Implement migration and validation helpers**

Add a migration that revokes direct execution on high-risk RPCs from `anon`, `authenticated`, and `PUBLIC`; keep RLS helper functions available to `authenticated` until they can be moved to a private schema.

- [ ] **Step 3: Run focused tests**

Run: `npm test tests/supabase-launch-security.test.ts`

Expected: pass after implementation.

### Task 2: Protected Role Route Shells

**Files:**
- Create: `lib/school-launch/role-surfaces.ts`
- Create: `components/school/LaunchRoleShell.tsx`
- Create: `app/student/page.tsx`
- Create: `app/teacher/page.tsx`
- Create: `app/admin/page.tsx`
- Create: `app/guardian/page.tsx`
- Create: `middleware.ts`
- Modify: `app/login/page.tsx`
- Test: `tests/school-role-surface.test.ts`

- [ ] **Step 1: Write failing tests**

Tests must assert role routes exist, declare controlled-pilot status, and middleware protects the role prefixes.

- [ ] **Step 2: Implement protected shells**

Add route shells that name the role, show only launch-safe workflow status, and avoid displaying mock student data.

- [ ] **Step 3: Run focused tests**

Run: `npm test tests/school-role-surface.test.ts tests/launch-routing.test.ts`

Expected: pass after implementation.

### Task 3: Documentation And Verification

**Files:**
- Modify: `AUDIT_REPORT.md`
- Modify: `LAUNCH_BLOCKERS.md`
- Modify: `FIX_LOG.md`
- Modify: `TEST_EVIDENCE.md`
- Modify: `SCHOOL_LAUNCH_READINESS_ROADMAP.md`

- [ ] **Step 1: Update evidence**

Record the new migration, validation script, role shell routes, and remaining proof gaps.

- [ ] **Step 2: Run full verification**

Run:

```bash
npm run lint
npm run typecheck
npm test
npm run build
npm audit --audit-level=moderate
```

Expected: first four pass; audit may still fail on the known Next/PostCSS advisory unless upstream has changed.
