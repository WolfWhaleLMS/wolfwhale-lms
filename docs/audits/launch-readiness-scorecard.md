# Launch Readiness Scorecard

Date: 2026-05-10

Status key: Pass means freshly verified in this pass. Partial means implemented or previously evidenced but needs fresh full-gate proof after current changes. Blocked means external credentials, deployment, or operator action is required.

| Gate | Status | Evidence |
| --- | --- | --- |
| Repository foundation | Partial | `/Users/wolfwhale/wolfwhale-core` was missing; `/Users/wolfwhale/wolfwhale-lms` is the active repo with Next.js, Supabase, LMS routes, tests, and prior launch docs. |
| Auth sign-in/sign-out | Partial | `/api/auth/login`, `/api/auth/logout`, `lib/lms/auth.ts`, and existing tests are present. Fresh local browser smoke passed for all four roles; deployed smoke still pending. |
| Role dashboards | Partial | Student, teacher, admin, and guardian dashboards loaded in the local smoke run with desktop/mobile viewports and accessibility checks. Deployed and formal WCAG passes pending. |
| Admin setup flows | Partial | Local mutating smoke passed for course creation, enrollment, and roster import. Live RLS/security proof and deployed smoke pending. |
| Teacher assignment/grading/attendance/rubrics | Partial | Local mutating smoke passed for assignment creation, resource upload, attendance, rubric, and grade posting. Live RLS/security proof pending. |
| Student text and file submission | Partial | Added file upload support, metadata mapping, private signed file route, UI file input, storage policy migration, and assigned-teacher submission RLS migration. Upload is verified, but the stricter signed-link browser smoke is blocked until the new table RLS migration is applied live. |
| Parent linked-child privacy | Partial | Guardian dashboard passed local smoke through linked-student surfaces; full live RLS matrix for wrong-child/wrong-tenant access is still pending. |
| Gradebook/reports | Partial | Weighted read model and exports exist; full regression pending. |
| Calendar/attendance/messages | Partial | Role read models and route surfaces exist and loaded in local smoke; deeper workflow and live RLS proof pending. |
| Private files | Partial | Course resources and student submission files use private buckets and signed routes. The linked dev project has a private `submissions` bucket; storage and table RLS migrations still need live DB application/validation. |
| Audit logging | Partial | LMS mutation helper writes audit rows for key paths; route coverage audit still needed for all writes. |
| Pets/rewards | Partial | Companion code exists; server-side XP from real events still needs deeper integration. |
| Accessibility | Partial | Prior smoke evidence exists; fresh WCAG-focused checks pending. |
| Security/RLS | Partial | Static tests now cover assigned-teacher submission read/update policy shape. Live DB validation is blocked by missing DB/read credentials and Supabase CLI role-permission failure. |
| Scale | Partial | Existing scale scripts cover a single-school envelope; no 10k-concurrent evidence yet. |
| Monitoring/ops | Partial | Sentry config and ops scripts/docs exist; production alert and restore-drill proof pending. |
| Deployment | Partial | Vercel config exists and prior wolfwhale.ca evidence exists; fresh deployed smoke pending after current changes. |

## Latest Fresh Verification

- `npm test -- tests/lms-mutations.test.ts tests/lms-query-mapping.test.ts tests/lms-student-workspaces.test.tsx`: passed, 3 files / 13 tests.
- `npm test -- tests/lms-submission-file-route.test.ts`: passed, 4 tests covering auth-required, RLS miss, signed redirect, and signing failure.
- `npm test -- tests/supabase-launch-security.test.ts tests/lms-submission-file-route.test.ts`: passed, 2 files / 11 tests after adding the assigned-teacher submission RLS verifier.
- `npm test`: passed, 23 files / 99 tests.
- `npm run lint`: passed after the assigned-teacher RLS migration and stricter smoke update.
- `npm run typecheck`: passed after the assigned-teacher RLS migration and stricter smoke update.
- `npm run build`: passed; route list includes `/api/lms/submissions/[submissionId]/file`.
- `npm audit --audit-level=moderate`: passed, 0 vulnerabilities.
- `LMS_SMOKE_MUTATE=1 npm run test:a11y`: previously passed locally; after adding the teacher signed-file assertion, the latest run exposed that the live Supabase `submissions` SELECT policy does not yet allow the assigned teacher to see the uploaded INDIG 100 submission. New migration: `20260510212739_submissions_assigned_teacher_read_policy.sql`.
- Changed-file secret scan for service-role/API/private-key patterns: no matches.
- Supabase changelog and Storage docs checked on 2026-05-10 before storage-facing implementation.
- `npm run security:supabase`: still blocked because no `SUPABASE_DB_URL`, `DATABASE_URL`, `SUPABASE_DB_PASSWORD`, or `SUPABASE_ACCESS_TOKEN` plus project ref is available to the script.
- `supabase migration list --linked`: blocked by remote role permission error while initializing the CLI login role.

## Next Gate To Run

1. `npm test`
2. `npm run lint`
3. `npm run build`
4. `npm run test:a11y`
5. `npm run security:supabase` with DB credentials after applying `20260510205641_student_submission_file_storage.sql` and `20260510212739_submissions_assigned_teacher_read_policy.sql`
6. Fresh deployed smoke on `wolfwhale.ca` after the branch is deployed
