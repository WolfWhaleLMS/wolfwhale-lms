# Large-Scale LMS Replacement Implementation Plan

> **For agentic workers:** REQUIRED SUB-SKILL: Use superpowers:executing-plans to implement this plan task-by-task. Steps use checkbox (`- [ ]`) syntax for tracking.

**Goal:** Move WolfWhale from a sellable LMS MVP toward a credible large-school LMS replacement tier by adding gradebook/rubric, attendance/reporting, roster operations, and scale verification surfaces.

**Architecture:** Extend the existing Supabase-backed LMS read model instead of creating a separate reporting stack. Use existing tables (`courses.grading_policy`, `assignments.category`, `rubrics`, `grades.rubric_scores`, `attendance_records`) and keep UI additions inside existing role dashboards.

**Tech Stack:** Next.js 16 App Router, React 19 server components, Supabase Auth/RLS, Vitest, Playwright smoke.

---

### Task 1: Weighted Gradebook And Rubrics

**Files:**
- Modify: `lib/lms/types.ts`
- Modify: `lib/lms/queries.ts`
- Modify: `lib/lms/read-model.ts`
- Modify: `lib/lms/mutations.ts`
- Modify: `components/lms/TeacherDashboard.tsx`
- Modify: `components/lms/StudentDashboard.tsx`
- Modify: `components/lms/GuardianDashboard.tsx`
- Add: `app/api/lms/rubrics/route.ts`
- Test: `tests/lms-gradebook-attendance.test.ts`

- [ ] Write failing gradebook/rubric tests.
- [ ] Run the focused tests and confirm they fail because gradebook/rubric fields are missing.
- [ ] Add typed gradebook/rubric records and summaries.
- [ ] Load assignment categories, course grading policies, grade percentages, letters, rubric scores, and rubrics.
- [ ] Add weighted gradebook summaries to teacher, student, guardian, and admin views.
- [ ] Add rubric creation validation and route.
- [ ] Render gradebook/rubric panels.
- [ ] Run focused tests until green.

### Task 2: Attendance And Reporting

**Files:**
- Modify: `lib/lms/types.ts`
- Modify: `lib/lms/queries.ts`
- Modify: `lib/lms/read-model.ts`
- Modify: `lib/lms/mutations.ts`
- Modify: `components/lms/AdminDashboard.tsx`
- Modify: `components/lms/TeacherDashboard.tsx`
- Modify: `components/lms/StudentDashboard.tsx`
- Modify: `components/lms/GuardianDashboard.tsx`
- Add: `app/api/lms/attendance/route.ts`
- Test: `tests/lms-gradebook-attendance.test.ts`

- [ ] Write failing attendance summary and mutation tests.
- [ ] Run the focused tests and confirm they fail because attendance fields are missing.
- [ ] Load attendance records from Supabase.
- [ ] Compute attendance rates and risk levels per student/course.
- [ ] Add teacher attendance marking form and admin risk summary.
- [ ] Add student/guardian attendance visibility.
- [ ] Run focused tests until green.

### Task 3: Roster Operations And Scale Gates

**Files:**
- Add: `lib/lms/roster.ts`
- Add: `tests/lms-roster.test.ts`
- Add: `scripts/lms-scale-check.ts`
- Modify: `package.json`
- Modify: `README.md`
- Modify: `SCHOOL_LAUNCH_READINESS_ROADMAP.md`

- [ ] Write failing roster CSV and scale budget tests.
- [ ] Implement CSV validation for roster imports without service-role leakage.
- [ ] Add a scale-check script that fails when route/data budgets are exceeded.
- [ ] Add npm scripts for roster validation and scale checks.
- [ ] Run focused tests until green.

### Task 4: Verification And Docs

**Files:**
- Modify: `AUDIT_REPORT.md`
- Modify: `LAUNCH_BLOCKERS.md`
- Modify: `FIX_LOG.md`
- Modify: `TEST_EVIDENCE.md`

- [ ] Run `npm run launch:verify`.
- [ ] Run `npm run test:lms-smoke`.
- [ ] Run `npm audit --audit-level=moderate`.
- [ ] Update evidence and blocker files with exact results.
