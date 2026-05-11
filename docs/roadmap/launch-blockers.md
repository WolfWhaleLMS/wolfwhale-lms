# Launch Blockers

Date: 2026-05-11

## P0 Blockers Before Serious Paid Beta

- Complete full deployed role/RLS/browser verification on `wolfwhale.ca` after pending Supabase migrations are applied. The production alias now points to the `wolfwhale-lms` deployment, `/login` is canonical, `/auth` redirects to `/login`, and a teacher demo browser smoke passes.
- Apply and verify `supabase/migrations/20260510205641_student_submission_file_storage.sql` and `supabase/migrations/20260510212739_submissions_assigned_teacher_read_policy.sql` against the target Supabase project.
- Apply and verify `supabase/migrations/20260510220050_fish_companion_species.sql` so live companion profiles accept only clownfish and pufferfish.
- Apply and verify `supabase/migrations/20260511013851_textbook_inline_quiz_attempts.sql` so live textbook quiz attempts are RLS-scoped, audited, and eligible for first-attempt fish companion XP.
- Apply and verify `supabase/migrations/20260511001241_guardian_contact_details.sql`; the app now falls back when the newer optional guardian contact columns are absent so demo dashboards do not loop, but live parent-contact, consent-note, and custody-note proof still requires the migration.
- Apply and verify `supabase/migrations/20260510233000_course_message_write_policy.sql` so live conversation reads and member inserts follow course, role, and guardian-link boundaries.
- Apply and verify `supabase/migrations/20260511004429_message_moderation_controls.sql` so live message queries and staff moderation controls have the required review columns.
- Apply and verify `supabase/migrations/20260510225408_course_section_metadata.sql` so live course setup persists section labels and keeps tenant-scoped section queries indexed.
- Apply and verify `supabase/migrations/20260510231855_lms_calendar_events.sql` so live school/course event writes and calendar reads follow role, course, and guardian-link boundaries.
- Restore and verify active LMS smoke credentials/data before release QA. Run `npx tsx scripts/check-lms-smoke-readiness.ts` first; `npm run test:a11y` now uses the same auth/read-model preflight before launching Playwright. Latest observed target-project schema misses include `student_parents.consent_notes`, `courses.section_label`, `messages.moderation_status`, and `public.calendar_events`; local dashboards now degrade for these read-model fields, but the migrations still need live application before beta.
- Run live Supabase security validation with `SUPABASE_DB_URL`, `DATABASE_URL`, or equivalent read-only project credentials.
- Browser-test the remaining file-submission privacy edges after applying the new RLS migration: teacher signed download in the UI, wrong-role denial, wrong-tenant denial, student feedback visibility, and guardian scoping. Automated signed-route tests now cover auth-required, RLS miss, signed redirect, and signing failure.
- Confirm all private file buckets are private and cannot be listed or read anonymously.
- Complete a role/relationship RLS matrix for student, teacher, admin, guardian, wrong tenant, wrong child, and unauthenticated requests.
- Prove live audit-log insertion and admin audit export contents for core mutation routes, roster import, and resource-review updates after target Supabase migrations are applied.
- Repeat secret scan and dependency audit evidence immediately before release tagging; the latest local pass found no changed-file secret patterns and `npm audit --audit-level=moderate` found 0 vulnerabilities.
- Get counsel/customer review and product automation behind the new privacy/security launch docs for file submissions, retention, exports, correction, deletion, DPA, subprocessors, and breach workflow.

## P1 Blockers Before Multi-School Sales

- Admin lifecycle live RLS/deployed proof. Direct audited single-user invite creation, invite resend, membership deactivate/reactivate, role changes, guardian linking/unlinking, guardian primary-contact/consent/custody details, and admin audit review/export now exist.
- Companion XP live proof. First-time submissions, first teacher feedback posts, present/online attendance check-ins, first-time textbook lesson completions, and first-time textbook inline quiz attempts now have server-side XP wiring; target-project RLS/audit evidence remains pending.
- External upload malware scanning, retention cleanup automation, and live resource-review proof. Initial SHA-256 denylist auto-quarantine, admin quarantine/legal-hold/retention controls, queue, and quota UI now exist.
- Messaging communication policy settings, retention/reporting controls, and live moderation proof. Initial staff message export/review and moderation status controls now exist.
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
- 2026-05-11 dashboard audit found the old login/dashboard loop was caused by target Supabase schema drift, not duplicate React routes alone. The shared role shell and schema-tolerant read model now let demo accounts reach `/teacher`, `/student`, `/guardian`, and `/admin` locally. Production aliases for `wolfwhale.ca` and `www.wolfwhale.ca` now point to `wolfwhale-lms`, and teacher demo smoke passes on the public domain.
