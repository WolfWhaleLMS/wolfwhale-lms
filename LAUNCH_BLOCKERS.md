# Launch Blockers

Audit date: 2026-05-07

## Current Gate

No repo-local or connected-Supabase P0/P1 blockers remain for a commercial single-school LMS launch within the currently verified operating envelope.

Closed gates:

- Real Supabase Auth email/password login is wired through SSR-safe server clients.
- Protected role routes reject unauthenticated users.
- Server-side membership checks redirect users away from unauthorized role dashboards.
- Student, teacher, admin, and guardian dashboards use persistent Supabase-backed LMS records.
- Student, teacher, admin, and guardian dashboards expose clickable role-specific tool hubs instead of static unclickable report pages.
- Student courses and assignments now open real workspaces instead of forcing students to hunt through one unclickable scrolling dashboard.
- Student gradebook, grades/feedback, attendance, calendar, resources, messages, and notifications now open dedicated workspaces from the tool hub.
- Student course workspaces collect each course's syllabus, lessons, materials, submit portals, grades/feedback, gradebook, attendance, calendar, and messages in one course-specific view.
- Student settings can change background themes, and the study companion baseline can hatch, render through the sprite fallback/atlas contract, earn XP, level, switch behavior mode locally, and open the companion world.
- Student submissions, teacher assignment creation, teacher grading, teacher attendance marking, teacher rubric creation, admin course creation, admin enrollment, and admin roster import/invite flow persist through API routes.
- Weighted gradebook, attendance, and academic-risk summaries are available to the correct roles.
- Calendar, message, notification, and course-resource visibility are present in each role surface.
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
- File upload UI, malware scanning, storage quotas, retention policies, and legal hold workflows.
- Production restore-drill evidence against a disposable staging database.
- Independent customer load testing beyond the current verified envelope of 5000 active students, 500 teachers, 1000 courses, and 50000 active enrollments.
- Formal WCAG audit beyond current smoke checks.
- Signed support SLA, incident rotation, and customer onboarding policy decisions.
