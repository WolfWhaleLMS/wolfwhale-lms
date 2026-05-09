# School Launch Readiness Roadmap

Audit date: 2026-05-07

## Current Position

WolfWhale is now a commercial school LMS baseline with durable Supabase-backed operations, not just a local controlled pilot or first-pass MVP.

Ready to sell/pilot now:

- School email/password login.
- Student, teacher, admin, and guardian role dashboards.
- Persistent courses, enrollments, assignments, submissions, weighted grades, rubrics, attendance, feedback, notifications, calendar items, messages, and resources.
- Admin course creation and enrollment.
- Admin roster CSV import and Supabase Auth invitations.
- Teacher assignment creation and grading.
- Teacher attendance marking and rubric creation.
- Student text submission.
- Student course workspaces with course-specific syllabus, lessons, materials, submit portals, grades/feedback, gradebook, attendance, calendar, and messages.
- Student all-assignments workspace grouped by course.
- Student dedicated feature workspaces for grades/feedback, gradebook, attendance, calendar, resources, messages, and notifications.
- Student background theme settings with local persistence.
- Student study companion baseline with starter species, hatching, XP, levels, behavior mode, sprite fallback rendering, world activities, local cache, and authenticated Supabase persistence.
- Guardian linked-student visibility.
- Private resource access through signed storage URLs.
- Teacher/admin private course resource uploads through Supabase Storage and lesson attachments.
- Server-side rate limits for auth, LMS mutations, roster import, resource upload, and companion profile save.
- Course-resource SHA-256 review ledger, quota hooks, retention metadata, quarantine states, legal-hold flags, and admin review controls.
- Companion profile server persistence with optimistic conflict versioning.
- Supabase RLS hardening and live validation.
- Single-school scale-budget checks.
- Enterprise readiness gate, support runbook, incident runbook, data-processing checklist, and synthetic load smoke.

## Phase 1: Commercial MVP

Status: complete in repo and validated against connected Supabase project `yhxesebykwhlpsmxxiqo`.

Exit criteria:

- Authenticated users only reach authorized role surfaces: passed.
- Student and guardian views cannot access unrelated student dashboard data: passed in read-model and dashboard tests.
- Assignment cycle persists through Supabase: implemented through API routes and mutation layer.
- Calendar, messaging, notifications, and resources are visible in role dashboards: passed.
- Browser smoke passes across roles: passed.
- Supabase anon exposure, storage exposure, RLS, and messaging policy recursion checks pass: passed.

## Phase 2: Large-School Product Depth

Status: partially complete in repo.

Completed in this sprint:

1. Weighted gradebook categories, letter-grade summaries, missing-work counts, and academic risk status.
2. Rubric summaries, validation, teacher rubric creation UI, and rubric API route.
3. Attendance summaries, attendance-risk integration, teacher attendance marking UI, and attendance API route.
4. Roster CSV validation, admin roster import UI, server-side Supabase Auth invitations, profile/membership upserts, and audit logging.
5. Scale-budget gate for the verified single-school envelope.
6. Enterprise readiness gate and operating runbooks.
7. Synthetic load smoke for 5000 students, 500 teachers, 1000 courses, and 50000 enrollments.
8. OneRoster validation, SSO config validation, gradebook export, attendance export, report cards, and SIS export package.
9. District proof profile validation for SSO, SIS, load, legal/support evidence, and guarded restore-drill command.

These are the next product-depth tracks before claiming complete Canvas/Brightspace/Moodle replacement parity:

1. Standards alignment, report cards, analytics, and parent notification policy.
2. Customer-specific automated OneRoster/SIS sync, LTI exploration, and archival exports.
3. Customer-specific SSO/SAML/OIDC, password recovery policy, and delegated admin controls.
4. Production malware scanner integration, admin quarantine/release UI, customer retention/legal-hold policy, and live proof of the repo upload-safety migrations.
5. Messaging moderation, abuse reporting, audit review, and communication policy controls.
6. Independent load testing beyond the verified single-school budget.
7. Full WCAG audit and remediation.
8. Production restore drill against a disposable non-production database.
9. Signed support SLA, escalation contacts, incident response, and customer onboarding checklist.

## Phase 3: Enterprise Readiness

1. Separate staging and production Supabase projects.
2. Promotion process for migrations and seed/test data.
3. Restore-drill evidence capture using `npm run ops:evidence` with `ENFORCE_REAL_OPS_EVIDENCE=1`.
4. Observability dashboards for auth errors, RLS denials, mutation failures, and slow queries.
5. Backups, restore drills, resource retention reports, and evidence from a disposable staging restore target.
6. Security review for FERPA/COPPA/PIPEDA-aligned operating procedures.
7. Contract-ready support and data-processing documentation.

## Sales Positioning

Use: "Commercial school LMS baseline with real role dashboards, gradebook, attendance, rubrics, roster invitations, and core LMS workflows."

Avoid until Phase 2/3 evidence exists: "proven full Canvas replacement for large districts."
