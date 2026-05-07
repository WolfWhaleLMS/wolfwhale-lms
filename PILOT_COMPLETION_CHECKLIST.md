# Pilot Completion Checklist

Completion target: tomorrow-ready controlled school pilot.

## Final End Goal

WolfWhale supports one controlled school pilot where authenticated users can run a complete assignment cycle with role-appropriate access:

- Admin reviews the pilot school, users, class/course, and enrollment state.
- Teacher sees the class, assignment, student submission, and grade/feedback workflow.
- Student sees enrolled course, assignment, submission state, and grade/feedback.
- Guardian sees only the linked student summary and no other student data.
- Sensitive Supabase data exposure checks are repeatable and documented.

## Repo-Local Required Gates

- [x] `/login` authenticates pilot users with a server-validated access code.
- [x] `/student`, `/teacher`, `/admin`, and `/guardian` reject unauthenticated access.
- [x] Wrong-role access to protected role routes is rejected.
- [x] Admin dashboard shows pilot school, course, enrollments, and launch checks.
- [x] Teacher dashboard supports the pilot assignment review and grading path.
- [x] Student dashboard supports assignment viewing and submission/update.
- [x] Guardian dashboard is limited to the linked student.
- [x] Student submission mutation rejects wrong roles and empty submissions.
- [x] Teacher grading mutation rejects wrong roles and invalid grades.
- [x] Supabase hardening migrations are present and covered by static tests.
- [x] `npm run security:supabase` is ready to run when a DB URL is configured.
- [x] Connected Supabase project hardening migrations are applied.
- [x] Connected Supabase project validation returns zero risky rows for launch-sensitive checks.
- [x] `npm run lint` passes.
- [x] `npm run typecheck` passes.
- [x] `npm test` passes.
- [x] `npm run build` passes.
- [x] Browser smoke checks pass for login, assignment cycle, wrong-role redirect, and role dashboards.
- [x] `PILOT_RUNBOOK.md` explains setup, verification, rollback, and support.

## Follow-Up Gates Before Expanding Beyond Controlled Pilot

These do not block the controlled pilot, but they should be closed before a broader LMS rollout:

- [ ] Supabase leaked-password protection is enabled in the dashboard.
- [ ] Production backup/restore drill is completed.
- [ ] Production support owner and escalation contact are confirmed.
