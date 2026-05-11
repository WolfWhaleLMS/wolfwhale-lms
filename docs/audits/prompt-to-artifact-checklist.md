# Prompt To Artifact Checklist

Date: 2026-05-10

Purpose: map the active WolfWhale LMS launch objective to concrete repo artifacts, verification commands, and known blockers. This checklist is evidence for audit work only; it does not claim production readiness.

## Repository And Named Files

| Requirement | Evidence | Status |
| --- | --- | --- |
| Use existing `wolfwhale-core` unless restart is proven cheaper | `/Users/wolfwhale/wolfwhale-core` was not present; active repo is `/Users/wolfwhale/wolfwhale-lms` | Partial |
| Product blueprint | `docs/product/wolfwhale-operational-lms-blueprint.md` | Present |
| Operational backlog | `docs/product/operational-lms-backlog.md` | Present |
| Launch readiness scorecard | `docs/audits/launch-readiness-scorecard.md` | Present |
| Threat model | `docs/security/threat-model.md` | Present |
| Launch blockers | `docs/roadmap/launch-blockers.md` | Present |
| Prompt checklist | `docs/audits/prompt-to-artifact-checklist.md` | Present |

## P0 LMS Flow Map

| P0 Flow | Evidence | Status |
| --- | --- | --- |
| 1. One-click demo accounts only on login screen | `app/login/page.tsx` includes demo account POST buttons that submit to `/api/auth/login`; `tests/lms-auth.test.ts` guards the real-auth forms | Present |
| 2. Real sign-in/sign-out | `app/api/auth/login/route.ts`, `app/api/auth/logout/route.ts`, `proxy.ts`, `tests/lms-auth.test.ts`, browser smoke | Partial: deployed smoke pending |
| 3. Admin creates school/course/section and invites users | `app/api/lms/courses/route.ts`, `app/api/lms/enrollments/route.ts`, `app/api/lms/invitations/route.ts`, `app/api/lms/invitations/resend/route.ts`, `app/api/lms/memberships/status/route.ts`, `app/api/lms/memberships/role/route.ts`, `app/api/lms/guardian-links/route.ts`, `app/api/lms/guardian-links/contact/route.ts`, `app/api/lms/guardian-links/unlink/route.ts`, `app/api/lms/roster/import/route.ts`, `components/lms/AdminDashboard.tsx`, `lib/lms/mutations.ts`, `lib/lms/invitations.ts`, `lib/lms/guardian-links.ts`, `lib/lms/queries.ts`, `lib/lms/exports.ts`, `supabase/migrations/20260510225408_course_section_metadata.sql`, `supabase/migrations/20260511001241_guardian_contact_details.sql`, `tests/lms-course-sections.test.ts`, `tests/lms-invitations.test.ts`, `tests/lms-guardian-links.test.ts` | Partial: course section/term metadata, direct audited user invitations, invite resend, membership deactivate/reactivate, membership role changes, guardian linking/contact details/unlinking now exist; school lifecycle and live RLS/deployed proof still incomplete |
| 4. Teacher creates course content and assignments | `app/api/lms/assignments/route.ts`, `app/api/lms/resources/route.ts`, teacher dashboard, mutating smoke | Partial: live RLS proof pending |
| 5. Student submits text and files | `app/api/lms/submissions/route.ts`, `lib/lms/mutations.ts`, student assignment workspace, storage migration | Partial: file upload works; live signed-link smoke blocked until new table RLS migration is applied |
| 6. Teacher grades with feedback/rubric | `app/api/lms/grades/route.ts`, `app/api/lms/rubrics/route.ts`, `lib/lms/mutations.ts`, mutating smoke | Partial: live RLS proof pending |
| 7. Parent sees only linked child feedback/progress | `lib/lms/read-model.ts`, `lib/lms/guardian-links.ts`, `app/api/lms/guardian-links/route.ts`, `tests/lms-read-model.test.ts`, `tests/lms-guardian-links.test.ts`, `tests/pilot-data.test.ts`, guardian dashboard | Partial: local read model filters linked-child data, inactive linked-student memberships, and over-fetched private messages, and admins can now create durable parent-child links; live wrong-child/wrong-tenant RLS matrix pending |
| 8. Gradebook updates from submissions and grades | `lib/lms/read-model.ts`, `lib/lms/exports.ts`, `tests/lms-gradebook-attendance.test.ts` | Partial: full live regression pending |
| 9. Calendar shows due dates, classes, events | `app/api/lms/calendar-events/route.ts`, `lib/lms/calendar-events.ts`, `components/lms/SharedLmsPanels.tsx`, role dashboards, `supabase/migrations/20260510231855_lms_calendar_events.sql`, `tests/lms-calendar-events.test.ts`, and `scripts/lms-browser-smoke.ts` | Partial: audited durable event creation and role calendar visibility exist; live RLS/deployed browser proof and recurring event workflow remain pending |
| 10. Attendance can be recorded and reported | `app/api/lms/attendance/route.ts`, attendance dashboard, `lib/lms/exports.ts` | Partial: live RLS proof pending |
| 11. Messaging works between allowed roles | `app/api/lms/messages/route.ts`, `app/api/lms/exports/messages/route.ts`, `app/api/lms/messages/[messageId]/moderation/route.ts`, `lib/lms/mutations.ts`, `lib/lms/exports.ts`, `components/lms/SharedLmsPanels.tsx`, `components/lms/AdminDashboard.tsx`, `components/lms/TeacherDashboard.tsx`, `components/lms/student-workspaces/calendar-resources-messages.tsx`, `supabase/migrations/20260510233000_course_message_write_policy.sql`, `supabase/migrations/20260511004429_message_moderation_controls.sql`, `tests/lms-messages.test.ts`, `tests/lms-message-export.test.tsx`, `tests/lms-message-moderation.test.tsx` | Partial: audited write workflow, relationship-aware policy artifact, staff message CSV export, and staff moderation status controls exist; retention policy controls and live RLS validation remain pending |
| 12. Reports summarize progress, missing work, attendance, grade trends | admin/teacher/student/guardian views, `lib/lms/read-model.ts`, `lib/lms/exports.ts`, `lib/lms/grade-trends.ts`, `tests/lms-gradebook-attendance.test.ts`, `tests/lms-district-scale.test.ts`, `tests/lms-dashboards.test.tsx`, `tests/lms-student-workspaces.test.tsx` | Partial: grade trend read/export/rendering proof exists; live regression, date-range reporting, and deployed proof pending |
| 13. File uploads are private, scoped, size/type limited, auditable | `lib/lms/mutations.ts`, `lib/lms/resource-security.ts`, `lib/lms/resource-review-summary.ts`, `app/api/lms/submissions/[submissionId]/file/route.ts`, `components/lms/SharedLmsPanels.tsx`, `components/lms/AdminDashboard.tsx`, `components/lms/student-workspaces/shared.tsx`, `components/lms/GuardianDashboard.tsx`, storage migrations, `tests/lms-submission-file-route.test.ts`, `tests/lms-student-workspaces.test.tsx`, `tests/resource-security.test.ts`, `tests/lms-resource-review-dashboard.test.tsx` | Partial: upload validation, signed routes, teacher/student/guardian download affordances, audit metadata, SHA-256 denylist auto-quarantine, admin scan/legal-hold/quarantine/retention review controls, and resource queue/quota summary exist; live DB/storage policy validation and external scanner integration pending |
| 14. Pets gain XP and unlock from real learning events | `lib/companion/fish-companion.ts`, `lib/companion/server-xp.ts`, `lib/lms/mutations.ts`, `tests/fish-companion.test.ts`, `tests/companion-server-xp.test.ts`, `components/lms/StudentCompanionWidget.tsx`, `supabase/migrations/20260510220050_fish_companion_species.sql` | Partial: fish-only companion is enforced in code, docs, public companion assets, and Supabase species constraints; first-time submissions, teacher feedback, and present/online attendance records grant server-side XP; lessons/quizzes still pending |

## Security, Privacy, And Compliance Artifacts

| Requirement | Evidence | Status |
| --- | --- | --- |
| RLS/security checks | `lib/supabase/launch-security-checks.ts`, `scripts/check-supabase-launch-security.ts`, `tests/supabase-launch-security.test.ts` | Partial: live DB validation blocked by credentials |
| Private storage policies | `supabase/migrations/20260510205641_student_submission_file_storage.sql` | Pending live apply |
| Assigned-teacher submission policy | `supabase/migrations/20260510212739_submissions_assigned_teacher_read_policy.sql` | Pending live apply |
| Calendar event policies | `supabase/migrations/20260510231855_lms_calendar_events.sql` | Pending live apply |
| Course section metadata | `supabase/migrations/20260510225408_course_section_metadata.sql` | Pending live apply |
| Audit-log coverage | `tests/lms-audit-log-coverage.test.ts`, `tests/lms-audit-review.test.tsx`, `lib/lms/mutations.ts`, `lib/lms/roster-import.ts`, `app/api/lms/resources/[resourceId]/route.ts`, `app/api/lms/exports/audit/route.ts` | Partial: static write coverage, admin review metadata, and admin-only CSV export present; live audit-row proof pending |
| Secret/dependency checks | `npm audit --audit-level=moderate`; changed-file secret scans recorded in scorecard | Partial |
| Privacy launch packet | `docs/security/privacy-launch-readiness.md`, DPA, subprocessor, breach, retention/export/delete/correction runbooks | Partial: counsel and customer review pending |
| Threat model | `docs/security/threat-model.md` | Present; needs refresh after live RLS checks |

## Design, Assets, And UX

| Requirement | Evidence | Status |
| --- | --- | --- |
| WolfWhale logo | `public/wolfwhale-logo-final.png`, `components/ui/wolfwhale-brand.tsx` | Present |
| Frutiger Aero / tactile public UI | `app/page.tsx`, `app/login/page.tsx`, `app/globals.css`, screenshots in `test-results/landing-refresh` | Partial: formal accessibility review pending |
| Fish companion/pixel pet direction | `docs/sea-companion-pixel-pet-handoff.md`, `public/clownfish.svg`, `public/images/sea-companion/concepts/puffer-fish-design-bible.png`, `tests/fish-companion.test.ts` | Present as fish-only concept handoff with retired non-fish public assets removed; final atlases pending |
| Consistent role dashboard shell | `components/lms/LmsShell.tsx`, role dashboards, `scripts/lms-browser-smoke.ts` | Partial |

## Scale, Ops, And Deployment

| Requirement | Evidence | Status |
| --- | --- | --- |
| 100k-500k path and 10k concurrency proof plan | `scripts/check-lms-scale-budget.ts`, `scripts/lms-load-smoke.ts`, `docs/product/wolfwhale-operational-lms-blueprint.md` | Partial: no 10k-concurrent evidence |
| Monitoring and ops | Sentry configs, `docs/ops/production-promotion-checklist.md`, `docs/ops/restore-drill-evidence.md` | Partial: production alert ownership and completed restore drill pending |
| Backup/restore plan | `scripts/backup-db.sh`, `scripts/restore-drill.sh`, `tests/ops-evidence.test.ts` | Partial: template evidence only |
| Deployment target | `vercel.json`, public URL target `wolfwhale.ca` in launch docs | Partial: fresh deployed smoke pending |

## Verification Commands

Fresh evidence currently recorded in `docs/audits/launch-readiness-scorecard.md` includes:

- `npm test`
- `npm run lint`
- `npm run typecheck`
- `npm run build`
- `npm audit --audit-level=moderate`
- Landing/login Playwright smoke for `/` and `/login`
- `LMS_SMOKE_MUTATE=1 npm run test:a11y`, currently blocked by unapplied live RLS once the stricter teacher signed-file assertion is enabled
- `npm run security:supabase`, currently blocked by missing DB/read credentials

## Not Ready Until These Are Closed

- Apply and verify the pending Supabase migrations on the target project.
- Run live Supabase launch-security checks.
- Pass the stricter mutating browser smoke including teacher signed-file download.
- Complete parent wrong-child/wrong-tenant live RLS matrix.
- Convert privacy packet placeholders into reviewed legal/customer operating artifacts.
- Expand server-side companion XP grants beyond submissions, teacher feedback, and attendance check-ins into lessons and quizzes.
- Produce deployed smoke evidence for `wolfwhale.ca`.
- Produce restore-drill, monitoring, and load-test evidence before scale claims.
