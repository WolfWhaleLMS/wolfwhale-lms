# Tomorrow School Pilot Completion Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Ship WolfWhale as a verified tomorrow-ready school pilot, meaning one controlled school can authenticate, use role-specific LMS surfaces, run one complete assignment cycle, and validate that sensitive school data is not exposed.

**Architecture:** Build a smallest-real LMS workflow on top of the existing Next.js App Router and Supabase schema. Use server-side access boundaries, honest role dashboards, focused server actions/API routes, seeded pilot data, and repeatable tests instead of broad unverified feature claims.

**Tech Stack:** Next.js 16, React 19, TypeScript, Supabase, Vitest, Playwright CLI/browser smoke checks, Vercel cron.

---

## Final End Goal

WolfWhale is complete for tomorrow when all of these gates pass:

- A pilot user can sign in and be routed to exactly one of: student, teacher, admin, guardian.
- Admin can see the pilot school, users, class/course, and enrollment state.
- Teacher can see their class, create or view an assignment, review a student submission, and enter grade/feedback.
- Student can see enrolled class, see assignment, submit work, and see grade/feedback after grading.
- Guardian can see only the linked student summary and no other student records.
- `/student`, `/teacher`, `/admin`, and `/guardian` are inaccessible without authentication.
- Supabase launch-security checks are repeatable and documented.
- `npm run lint`, `npm run typecheck`, `npm test`, and `npm run build` pass.
- Browser smoke checks prove the pilot workflow renders on desktop and mobile.
- Launch docs state exactly how to run the pilot and how to roll back.

When these gates pass, the active goal can be marked complete.

## Goal 1: Stabilize The Repo And Completion Gates

- [ ] Confirm the current dev server state and stop stale sessions if they interfere with tests.
- [ ] Run `git status --short --untracked-files=all` and preserve unrelated user changes.
- [ ] Add or update `PILOT_COMPLETION_CHECKLIST.md` with the final gates above.
- [ ] Add `npm run launch:verify` to run lint, typecheck, tests, build, and documented launch checks.
- [ ] Run `npm run launch:verify` once and record the starting failures in `TEST_EVIDENCE.md`.

## Goal 2: Make Authentication Real Enough For Tomorrow

- [ ] Replace the temporary `WW_PILOT_SESSION=1` manual cookie gate with a pilot sign-in form on `/login`.
- [ ] Use server-side validation with a required `PILOT_ACCESS_CODE` environment variable.
- [ ] Issue an HttpOnly, SameSite=Lax, secure-in-production pilot session cookie.
- [ ] Store the selected role in a signed or server-validated cookie value.
- [ ] Update `proxy.ts` so protected role routes require a valid pilot session and matching role path.
- [ ] Add logout.
- [ ] Add tests proving unauthenticated access redirects, wrong-role access redirects, and valid-role access is allowed.

## Goal 3: Build The Pilot Data Model Boundary

- [ ] Create a small TypeScript pilot data module with one school, one teacher, one student, one guardian, one course, one assignment, one submission state, and one grade state.
- [ ] Keep the module server-only where state is used by route handlers/server actions.
- [ ] Define role permissions in one place.
- [ ] Add tests proving student and guardian selectors never return other students' private data.
- [ ] Add a documented switch point for replacing pilot fixtures with Supabase queries.

## Goal 4: Build Role Dashboards For The Minimum Workflow

- [ ] Replace the current role shells with real pilot dashboards.
- [ ] Admin dashboard shows school, users, course, enrollment, and launch checks.
- [ ] Teacher dashboard shows course roster, assignment, submission, grading panel, and feedback status.
- [ ] Student dashboard shows course, assignment details, submission form/status, and grade feedback.
- [ ] Guardian dashboard shows linked student progress, assignment status, grade feedback, and attendance placeholder marked not active.
- [ ] All dashboards must be mobile usable and must not contain fake unverifiable claims.

## Goal 5: Implement The Assignment Cycle

- [ ] Add server actions or route handlers for student submission and teacher grading.
- [ ] Validate role before every mutation.
- [ ] Persist pilot submission/grade in the smallest safe local mechanism available for the Next dev/runtime environment.
- [ ] Return explicit errors for wrong-role, missing content, and invalid grade values.
- [ ] Add tests for submit, grade, wrong-role denial, and student feedback visibility.

## Goal 6: Wire Supabase Security Completion Path

- [ ] Keep both hardening migrations in `supabase/migrations`.
- [ ] Add `SUPABASE_DB_URL` instructions to `.env.example` without committing secrets.
- [ ] Make `npm run security:supabase` print the exact missing env var when blocked.
- [ ] Add a no-DB static test proving the launch-security SQL contains all current sensitive tables and high-risk RPCs.
- [ ] If a database URL is present, run the live security check and update `TEST_EVIDENCE.md`.

## Goal 7: Browser And Accessibility Smoke Checks

- [ ] Add a Playwright smoke script or documented CLI sequence for `/login`, `/student`, `/teacher`, `/admin`, and `/guardian`.
- [ ] Capture desktop and mobile screenshots.
- [ ] Verify no route has a framework error overlay.
- [ ] Verify protected routes redirect when unauthenticated.
- [ ] Check keyboard focus order on login and dashboards.
- [ ] Record evidence in `TEST_EVIDENCE.md`.

## Goal 8: Launch Documentation And Operator Runbook

- [ ] Update `README.md` so it does not claim unbuilt LMS features as production-ready.
- [ ] Add `PILOT_RUNBOOK.md` with setup, env vars, test accounts/roles, verification, rollback, and support contacts.
- [ ] Update `AUDIT_REPORT.md`, `LAUNCH_BLOCKERS.md`, `FIX_LOG.md`, `TEST_EVIDENCE.md`, and `SCHOOL_LAUNCH_READINESS_ROADMAP.md`.
- [ ] Move any unresolved external-only items into an explicit "Needs human/operator action" section.

## Goal 9: Final Verification

- [ ] Run `npm run lint`.
- [ ] Run `npm run typecheck`.
- [ ] Run `npm test`.
- [ ] Run `npm run build`.
- [ ] Run `npm audit --audit-level=moderate`.
- [ ] Run `npm run security:supabase` if a database URL is configured.
- [ ] Run browser smoke checks.
- [ ] Fix every repo-local P0/P1 failure found by those commands.
- [ ] Mark the active goal complete only when the final end goal gates pass.
