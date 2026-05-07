# Sellable LMS Baseline Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move WolfWhale from controlled pilot to a sellable LMS baseline with durable Supabase Auth, persistent role dashboards, core LMS workflows, security evidence, and launch operations.

**Architecture:** Use the existing Supabase schema as the system of record. Keep Next.js App Router pages server-rendered where possible, with server route handlers for mutations and small client islands only when interaction requires it. Preserve the pilot path only as a development fallback until real auth and persistent workflows are verified.

**Tech Stack:** Next.js 16 App Router, React 19, TypeScript, Supabase Auth/Postgres/Storage, `@supabase/ssr`, Vitest, Playwright.

---

## Completion Gates

- Real Supabase Auth email/password login, logout, confirmation, SSR session refresh, and protected role route handling.
- Server-side role resolution from `tenant_memberships`, with `parent` normalized to guardian-facing routes.
- Persistent dashboards backed by Supabase tables: tenants, profiles, memberships, courses, enrollments, assignments, rubrics, submissions, grades, attendance, conversations, messages, notifications, and storage.
- Admin workflow: school setup, roster, role membership, courses, enrollments, audit/support visibility.
- Teacher workflow: courses, roster, assignment creation, rubric attachment, submission review, grading, feedback, notifications.
- Student workflow: enrolled courses, due work, submission, grade/feedback, messages, calendar.
- Guardian workflow: linked-student-only progress, grades, messages, and alerts.
- Files/resources baseline with private buckets and signed/download-only access.
- Calendar/notification/message baseline using existing due dates, notifications, and conversation tables.
- Security verification: RLS/static checks, live Supabase checks, dependency audit, route access tests, no public data exposure.
- Operations: backup/restore/support runbooks, launch evidence, browser/mobile/accessibility smoke.

## Task 1: Real Auth Foundation

**Files:**
- Create: `lib/supabase/env.ts`
- Create: `lib/supabase/client.ts`
- Create: `lib/supabase/server.ts`
- Create: `lib/supabase/proxy.ts`
- Create: `lib/lms/auth.ts`
- Create: `app/api/auth/login/route.ts`
- Create: `app/api/auth/logout/route.ts`
- Create: `app/auth/confirm/route.ts`
- Modify: `app/login/page.tsx`
- Modify: `proxy.ts`
- Test: `tests/lms-auth.test.ts`

Steps:

- [ ] Write failing tests for Supabase env fallback, role normalization, allowed `next` paths, and login form structure.
- [ ] Install `@supabase/ssr`.
- [ ] Implement Supabase browser/server/proxy clients using current Supabase SSR docs.
- [ ] Implement email/password login and logout route handlers.
- [ ] Implement confirmation route for PKCE/magic-link compatibility.
- [ ] Replace pilot-only login UI with production email/password login and demo credential guidance.
- [ ] Update proxy to refresh Supabase sessions and protect role routes.
- [ ] Run targeted auth tests.

## Task 2: Persistent LMS Read Model

**Files:**
- Create: `lib/lms/types.ts`
- Create: `lib/lms/queries.ts`
- Create: `lib/lms/read-model.ts`
- Create: `tests/lms-read-model.test.ts`

Steps:

- [ ] Write failing tests for admin, teacher, student, and guardian read models.
- [ ] Define normalized TypeScript types for LMS dashboards.
- [ ] Build pure read-model mapping from Supabase-shaped records.
- [ ] Add Supabase query functions that fetch only role-authorized records.
- [ ] Run targeted read-model tests.

## Task 3: Persistent Role Dashboards

**Files:**
- Create: `components/lms/LmsShell.tsx`
- Create: `components/lms/AdminDashboard.tsx`
- Create: `components/lms/TeacherDashboard.tsx`
- Create: `components/lms/StudentDashboard.tsx`
- Create: `components/lms/GuardianDashboard.tsx`
- Modify: `app/admin/page.tsx`
- Modify: `app/teacher/page.tsx`
- Modify: `app/student/page.tsx`
- Modify: `app/guardian/page.tsx`
- Test: `tests/lms-dashboards.test.tsx`

Steps:

- [ ] Write failing component tests for each role dashboard.
- [ ] Implement dashboard shell and role dashboards from persistent read-model props.
- [ ] Wire route pages to require real session/membership and fetch Supabase read model.
- [ ] Run targeted dashboard tests.

## Task 4: Core Mutation Workflows

**Files:**
- Create: `lib/lms/actions.ts`
- Create: `app/api/lms/courses/route.ts`
- Create: `app/api/lms/enrollments/route.ts`
- Create: `app/api/lms/assignments/route.ts`
- Create: `app/api/lms/submissions/route.ts`
- Create: `app/api/lms/grades/route.ts`
- Test: `tests/lms-actions.test.ts`

Steps:

- [ ] Write failing tests for validation and authorization boundaries.
- [ ] Implement course creation/update for teacher/admin.
- [ ] Implement enrollment add/drop for teacher/admin.
- [ ] Implement assignment creation with rubric JSON.
- [ ] Implement student submission/update.
- [ ] Implement teacher grading/feedback and notification creation.
- [ ] Run targeted action tests.

## Task 5: Calendar, Messaging, Notifications, Files

**Files:**
- Create: `lib/lms/calendar.ts`
- Create: `lib/lms/messages.ts`
- Create: `lib/lms/files.ts`
- Create: `app/api/lms/messages/route.ts`
- Create: `app/api/lms/files/sign/route.ts`
- Test: `tests/lms-communications.test.ts`

Steps:

- [ ] Write failing tests for due-date calendar events, conversation membership, notifications, and signed file access decisions.
- [ ] Implement calendar event projection from assignments and announcements.
- [ ] Implement message send/list guards.
- [ ] Implement signed file URL request guard for private buckets.
- [ ] Run targeted communications tests.

## Task 6: Security And Operations Closeout

**Files:**
- Modify: `scripts/launch-verify.sh`
- Modify: `scripts/pilot-browser-smoke.ts` or replace with `scripts/lms-browser-smoke.ts`
- Modify: `AUDIT_REPORT.md`
- Modify: `LAUNCH_BLOCKERS.md`
- Modify: `TEST_EVIDENCE.md`
- Modify: `SCHOOL_LAUNCH_READINESS_ROADMAP.md`
- Create: `PRODUCTION_RUNBOOK.md`
- Create: `BACKUP_RESTORE_RUNBOOK.md`

Steps:

- [ ] Extend launch verification to include audit and browser smoke when env is configured.
- [ ] Add browser smoke for real login and each durable role route.
- [ ] Update docs to reflect real auth and persistent workflows.
- [ ] Run full verification: lint, typecheck, tests, build, audit, browser smoke, live Supabase checks.
