# Launch Blockers

Audit date: 2026-05-07

## Current Gate

No repo-local P0/P1 blockers remain for a commercial single-school LMS launch within the currently verified operating envelope. Connected Supabase browser smoke passes for the current LMS workflows, including real teacher resource upload through the existing `lesson-resources` bucket.

Operator-gated live proof still required: apply `20260508180000_student_companion_profiles.sql`, `20260508181000_course_resource_upload_rls.sql`, and `20260508192000_course_resource_reviews_and_companion_version.sql` to the target Supabase project and rerun `npm run security:supabase` with direct DB credentials or a database-read Supabase token. Until then, companion progress keeps its local fallback and resource upload still works through the server-side service-role storage path, but the newest table/policy hardening, resource review ledger, upload quota hooks, retention metadata, and companion conflict-version column have not been SQL-proven on the live database from this shell.

Latest operator attempt on 2026-05-08:

- `supabase migration up` could not apply the migrations because the linked Supabase history reports remote migration versions that are not present in this local migration directory.
- `npm run security:supabase` still exits before querying because no `SUPABASE_DB_URL`, `DATABASE_URL`, `SUPABASE_DB_PASSWORD`, or `SUPABASE_ACCESS_TOKEN` plus `SUPABASE_PROJECT_REF` is available in this shell.

Closed gates:

- Real Supabase Auth email/password login is wired through SSR-safe server clients.
- Protected role routes reject unauthenticated users.
- Server-side membership checks redirect users away from unauthorized role dashboards.
- Student, teacher, admin, and guardian dashboards use persistent Supabase-backed LMS records.
- Student, teacher, admin, and guardian dashboards expose clickable role-specific tool hubs instead of static unclickable report pages.
- Student courses and assignments now open real workspaces instead of forcing students to hunt through one unclickable scrolling dashboard.
- Student gradebook, grades/feedback, attendance, calendar, resources, messages, and notifications now open dedicated workspaces from the tool hub.
- Student course workspaces collect each course's syllabus, lessons, materials, submit portals, grades/feedback, gradebook, attendance, calendar, and messages in one course-specific view.
- Student settings can change background themes, and the study companion baseline can hatch, render through the sprite fallback/atlas contract, earn XP, level, sync through authenticated Supabase persistence, switch behavior mode, and open the companion world.
- Student submissions, teacher assignment creation, teacher grading, teacher attendance marking, teacher rubric creation, admin course creation, admin enrollment, and admin roster import/invite flow persist through API routes.
- Weighted gradebook, attendance, and academic-risk summaries are available to the correct roles.
- Calendar, message, notification, and course-resource visibility are present in each role surface.
- Teacher and admin dashboards can upload private course resources into signed-link Supabase Storage.
- Course resource downloads go through signed Supabase Storage URLs.
- Guardian views are scoped to linked students.
- Roster CSV validation and scale-budget checks are implemented.
- OneRoster validation, SSO config validation, gradebook export, attendance export, report-card generation, and admin SIS export package generation are implemented.
- District proof profile validation is implemented and passing for the demo district profile.
- Supabase anonymous table/function/storage exposure is validated clean on the connected project.
- Messaging RLS recursion found during browser smoke was fixed live and captured in migrations.
- Lint, typecheck, all tests, enterprise readiness, scale check, synthetic load smoke, build, npm audit, live Supabase MCP checks, browser smoke, mutating workflow smoke, and Computer Use visual navigation checks pass.
- Backup and restore-drill scripts now exist and are guarded against accidental production restore.
- Support, incident-response, data-processing, and enterprise-readiness runbooks now exist.

## Resolved Live Supabase Findings

Before hardening, read-only connector checks against `yhxesebykwhlpsmxxiqo` found risky anon grants, public function execution, high-risk RPC exposure, risky views, and public reviewed storage buckets.

After hardening and the messaging RLS fix, live validation found:

- 0 sensitive public tables selectable by `anon`.
- 0 public functions executable by `anon`.
- 0 reviewed storage buckets left public.
- 0 key launch tables without RLS.
- 0 legacy recursive messaging policies.
- 0 failing rows across the five live launch-security SQL checks run through Supabase MCP.

## Remaining Large-District Parity Work

These are not repo-local P0/P1 blockers for the current commercial baseline, but they are customer-specific proof items before claiming proven Canvas/Brightspace/Moodle displacement across a named large district:

- Automated OneRoster/SIS sync, LTI, standards alignment, analytics, and archival exports for that customer.
- SSO/SAML/OIDC, password recovery policy, delegated admin workflows, and invite lifecycle polish for that customer.
- Repo-level upload review, quotas, retention metadata, and legal-hold flags now exist; production malware scanner integration, admin review UI, and customer legal-hold policy still need operator/customer decisions.
- Production restore-drill evidence against a disposable staging database.
- Independent customer load testing beyond the current verified envelope of 5000 active students, 500 teachers, 1000 courses, and 50000 active enrollments.
- Formal WCAG audit beyond current smoke checks.
- Signed support SLA, incident rotation, and customer onboarding policy decisions.
