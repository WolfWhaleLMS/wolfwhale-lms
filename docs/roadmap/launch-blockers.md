# Launch Blockers

Date: 2026-05-11

## P0 Blockers Before Serious Paid Beta

- Complete full deployed role/RLS/privacy-edge verification on `wolfwhale.ca` after the 2026-05-11 Supabase schema repair. The production alias now points to the `wolfwhale-lms` deployment, `/login` is canonical, `/auth` redirects to `/login`, and deployed browser smoke now passes for student, teacher, guardian, and admin dashboards.
- Restore and verify active LMS smoke credentials/data before release QA. Run `npx tsx scripts/check-lms-smoke-readiness.ts` first; `npm run test:a11y` now uses the same auth/read-model preflight before launching Playwright.
- Run full live Supabase security validation through the repo script once `SUPABASE_DB_URL`, `DATABASE_URL`, `SUPABASE_DB_PASSWORD`, or `SUPABASE_ACCESS_TOKEN` is available locally. Connector-run launch predicates passed on 2026-05-11, but the repo CLI gate still lacks local credentials.
- Resolve Supabase advisor warnings before a serious beta claim: authenticated GraphQL exposure across public LMS tables, remaining security-definer RPC exposure decisions, mutable search paths on older functions, leaked-password protection disabled, multiple permissive RLS policies, duplicate indexes, and unindexed foreign keys.
- Browser-test the remaining file-submission privacy edges after the successful deployed dashboard smoke: teacher signed download in the UI, wrong-role denial, wrong-tenant denial, student feedback visibility, and guardian scoping. Automated signed-route tests now cover auth-required, RLS miss, signed redirect, and signing failure.
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
