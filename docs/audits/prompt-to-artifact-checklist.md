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
| 3. Admin creates school/course/section and invites users | `app/api/lms/courses/route.ts`, `app/api/lms/enrollments/route.ts`, `app/api/lms/roster/import/route.ts`, admin dashboard | Partial: school/section lifecycle still incomplete |
| 4. Teacher creates course content and assignments | `app/api/lms/assignments/route.ts`, `app/api/lms/resources/route.ts`, teacher dashboard, mutating smoke | Partial: live RLS proof pending |
| 5. Student submits text and files | `app/api/lms/submissions/route.ts`, `lib/lms/mutations.ts`, student assignment workspace, storage migration | Partial: file upload works; live signed-link smoke blocked until new table RLS migration is applied |
| 6. Teacher grades with feedback/rubric | `app/api/lms/grades/route.ts`, `app/api/lms/rubrics/route.ts`, `lib/lms/mutations.ts`, mutating smoke | Partial: live RLS proof pending |
| 7. Parent sees only linked child feedback/progress | `lib/lms/read-model.ts`, `tests/lms-read-model.test.ts`, `tests/pilot-data.test.ts`, guardian dashboard | Partial: live wrong-child/wrong-tenant RLS matrix pending |
| 8. Gradebook updates from submissions and grades | `lib/lms/read-model.ts`, `lib/lms/exports.ts`, `tests/lms-gradebook-attendance.test.ts` | Partial: full live regression pending |
| 9. Calendar shows due dates, classes, events | role dashboards and `scripts/lms-browser-smoke.ts` | Partial: deeper workflow coverage pending |
| 10. Attendance can be recorded and reported | `app/api/lms/attendance/route.ts`, attendance dashboard, `lib/lms/exports.ts` | Partial: live RLS proof pending |
| 11. Messaging works between allowed roles | role dashboards and read models expose conversations/messages | Partial: write workflow and moderation policy incomplete |
| 12. Reports summarize progress, missing work, attendance, grade trends | admin/teacher views, exports, `lib/lms/exports.ts` | Partial: report depth and trend proof pending |
| 13. File uploads are private, scoped, size/type limited, auditable | `lib/lms/mutations.ts`, `lib/lms/resource-security.ts`, `app/api/lms/submissions/[submissionId]/file/route.ts`, storage migrations | Partial: live DB/storage policy validation pending |
| 14. Pets gain XP and unlock from real learning events | `lib/companion/fish-companion.ts`, `tests/fish-companion.test.ts`, `components/lms/StudentCompanionWidget.tsx`, `supabase/migrations/20260510220050_fish_companion_species.sql` | Partial: fish-only companion is enforced; server-side XP grants from real LMS events still incomplete |

## Security, Privacy, And Compliance Artifacts

| Requirement | Evidence | Status |
| --- | --- | --- |
| RLS/security checks | `lib/supabase/launch-security-checks.ts`, `scripts/check-supabase-launch-security.ts`, `tests/supabase-launch-security.test.ts` | Partial: live DB validation blocked by credentials |
| Private storage policies | `supabase/migrations/20260510205641_student_submission_file_storage.sql` | Pending live apply |
| Assigned-teacher submission policy | `supabase/migrations/20260510212739_submissions_assigned_teacher_read_policy.sql` | Pending live apply |
| Audit-log coverage | `tests/lms-audit-log-coverage.test.ts`, `lib/lms/mutations.ts`, `lib/lms/roster-import.ts`, `app/api/lms/resources/[resourceId]/route.ts` | Partial: static coverage present; live audit-row proof pending |
| Secret/dependency checks | `npm audit --audit-level=moderate`; changed-file secret scans recorded in scorecard | Partial |
| Privacy launch packet | `docs/security/privacy-launch-readiness.md`, DPA, subprocessor, breach, retention/export/delete/correction runbooks | Partial: counsel and customer review pending |
| Threat model | `docs/security/threat-model.md` | Present; needs refresh after live RLS checks |

## Design, Assets, And UX

| Requirement | Evidence | Status |
| --- | --- | --- |
| WolfWhale logo | `public/wolfwhale-logo-final.png`, `components/ui/wolfwhale-brand.tsx` | Present |
| Frutiger Aero / tactile public UI | `app/page.tsx`, `app/login/page.tsx`, `app/globals.css`, screenshots in `test-results/landing-refresh` | Partial: formal accessibility review pending |
| Fish companion/pixel pet direction | `docs/sea-companion-pixel-pet-handoff.md`, `public/clownfish.svg`, `public/images/sea-companion/concepts/puffer-fish-design-bible.png` | Present as fish-only concept handoff; final atlases pending |
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
- Complete server-side companion XP grants from real learning events.
- Produce deployed smoke evidence for `wolfwhale.ca`.
- Produce restore-drill, monitoring, and load-test evidence before scale claims.
