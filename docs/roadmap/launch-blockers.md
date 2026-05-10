# Launch Blockers

Date: 2026-05-10

## P0 Blockers Before Serious Paid Beta

- Fresh deployed verification after current changes: run deployed smoke on `wolfwhale.ca` once this branch is deployed.
- Apply and verify `supabase/migrations/20260510205641_student_submission_file_storage.sql` and `supabase/migrations/20260510212739_submissions_assigned_teacher_read_policy.sql` against the target Supabase project.
- Run live Supabase security validation with `SUPABASE_DB_URL`, `DATABASE_URL`, or equivalent read-only project credentials.
- Browser-test the remaining file-submission privacy edges after applying the new RLS migration: teacher signed download in the UI, wrong-role denial, wrong-tenant denial, student feedback visibility, and guardian scoping. Automated signed-route tests now cover auth-required, RLS miss, signed redirect, and signing failure.
- Confirm all private file buckets are private and cannot be listed or read anonymously.
- Complete a role/relationship RLS matrix for student, teacher, admin, guardian, wrong tenant, wrong child, and unauthenticated requests.
- Prove live audit-log insertion for core mutation routes, roster import, and resource-review updates after target Supabase migrations are applied.
- Produce current secret scan and dependency audit evidence.
- Get counsel/customer review and product automation behind the new privacy/security launch docs for file submissions, retention, exports, correction, deletion, DPA, subprocessors, and breach workflow.

## P1 Blockers Before Multi-School Sales

- Admin lifecycle for invites, user deactivation, role changes, guardian linking/unlinking, and audit review.
- Server-side companion XP grants from real learning events.
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
