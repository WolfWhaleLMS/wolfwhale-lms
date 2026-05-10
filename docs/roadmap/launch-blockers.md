# Launch Blockers

Date: 2026-05-10

## P0 Blockers Before Serious Paid Beta

- Fresh deployed verification after current changes: run deployed smoke on `wolfwhale.ca` once this branch is deployed.
- Apply and verify `supabase/migrations/20260510205641_student_submission_file_storage.sql` and `supabase/migrations/20260510212739_submissions_assigned_teacher_read_policy.sql` against the target Supabase project.
- Apply and verify `supabase/migrations/20260510220050_fish_companion_species.sql` so live companion profiles accept only clownfish and pufferfish.
- Apply and verify `supabase/migrations/20260510233000_course_message_write_policy.sql` so live conversation reads and member inserts follow course, role, and guardian-link boundaries.
- Apply and verify `supabase/migrations/20260510225408_course_section_metadata.sql` so live course setup persists section labels and keeps tenant-scoped section queries indexed.
- Restore and verify active LMS smoke credentials/data before browser QA; the latest local admin form browser attempt reached `/login?error=lms-access-required` before the protected dashboard rendered.
- Run live Supabase security validation with `SUPABASE_DB_URL`, `DATABASE_URL`, or equivalent read-only project credentials.
- Browser-test the remaining file-submission privacy edges after applying the new RLS migration: teacher signed download in the UI, wrong-role denial, wrong-tenant denial, student feedback visibility, and guardian scoping. Automated signed-route tests now cover auth-required, RLS miss, signed redirect, and signing failure.
- Confirm all private file buckets are private and cannot be listed or read anonymously.
- Complete a role/relationship RLS matrix for student, teacher, admin, guardian, wrong tenant, wrong child, and unauthenticated requests.
- Prove live audit-log insertion for core mutation routes, roster import, and resource-review updates after target Supabase migrations are applied.
- Repeat secret scan and dependency audit evidence immediately before release tagging; the latest local pass found no changed-file secret patterns and `npm audit --audit-level=moderate` found 0 vulnerabilities.
- Get counsel/customer review and product automation behind the new privacy/security launch docs for file submissions, retention, exports, correction, deletion, DPA, subprocessors, and breach workflow.

## P1 Blockers Before Multi-School Sales

- Admin lifecycle for invite resend, user deactivation/reactivation, role changes, guardian unlinking, primary-contact/consent details, and audit review. Direct audited single-user invite creation and guardian linking now exist.
- Expand server-side companion XP beyond first-time submissions and first teacher feedback posts into lessons, quizzes, streaks, and attendance patterns.
- Upload malware scanning, quarantine queue, legal hold workflow, and quota UI.
- Messaging moderation, communication policy controls, and export/review tools.
- Formal WCAG 2.2 audit and remediation evidence.
- Production monitoring and alert ownership.
- Backup/restore drill evidence against a disposable non-production database.

## P2 Blockers Before Canvas/Brightspace/Edsby/Moodle Replacement Claims

- Customer-specific SIS/OneRoster scheduled sync.
- Customer-specific SSO/SAML/OIDC and delegated admin.
- LTI and archival exports.
- District analytics and standards alignment.
- External load-test evidence for the advertised user/concurrency target.
- Signed support SLA, incident rotation, and privacy/legal operating packet.

## Workspace Notes

- Requested `wolfwhale-core` path was not present; this pass used `/Users/wolfwhale/wolfwhale-lms`.
- The worktree had pre-existing uncommitted landing/login/logo/sea-companion changes before this pass. Those were not reverted.
