# WolfWhale Operational LMS Blueprint

Date: 2026-05-10

## Product Boundary

WolfWhale LMS is a web-first school LMS for elementary, high school, and university use. The active code foundation in this workspace is `/Users/wolfwhale/wolfwhale-lms`; `/Users/wolfwhale/wolfwhale-core` was not present during this audit pass.

The product target is a serious single-school paid beta first, then controlled multi-school pilots, then district-scale claims only after evidence for SSO/SIS, restore drills, support operations, formal accessibility, and load tests.

## Architecture

- Next.js App Router + TypeScript.
- Supabase Auth, Postgres, RLS, and Storage as source of truth.
- Server-side route handlers and services verify auth, tenant membership, role, course enrollment, and parent-child relationships.
- React components consume read models from `lib/lms/read-model.ts`; write logic lives in `lib/lms/mutations.ts`; Supabase row mapping lives in `lib/lms/queries.ts`.
- Demo/pilot routes remain separate from production LMS routes under `app/api/pilot/*` and `lib/pilot/*`.
- Auditable writes use `audit_logs` through LMS mutation helpers.

## Verified Core Surfaces

- Login and logout through Supabase Auth.
- Protected student, teacher, admin, and guardian dashboards.
- Admin course creation, enrollment, roster import/invites, exports, audit trail, resources, calendar, messages, and reports.
- Teacher assignment creation, resource upload, grading, rubrics, attendance, gradebook, calendar, messages, and reports.
- Student course workspaces, assignment portals, text/file submission support, resources, grades, feedback, attendance, messages, calendar, notifications, and companion UI.
- Guardian linked-student progress, grades, attendance, resources, messages, and calendar visibility.

## Current P0 Slice Closed In This Pass

Student assignment submissions now support private file upload in addition to text:

- UI form accepts text, file, or both.
- Server validates type and max size before upload.
- Files upload to the private `submissions` bucket.
- Submission metadata is stored in `submissions.file_path` and `submissions.file_name`.
- Teacher grading queue exposes submitted file links through a signed route.
- Audit log details include submitted file name, size, and SHA-256.
- New migration aligns storage RLS policy with the submission object path.
- New migration scopes `submissions` table read/update policies so assigned teachers can see and grade submissions even when they did not create the course shell.

Audit-log coverage is now guarded for critical beta write paths:

- Core LMS mutation services must call the shared audit helper with expected action names and resource types.
- Write routes for submissions, grades, courses, assignments, resources, attendance, rubrics, enrollments, and roster import must delegate into audited services.
- Admin resource-review updates now insert `resource_review.updated` audit rows with review id, resource id, scan status, legal-hold flag, and quarantine reason.

The companion system is now fish-only for beta:

- Starter species are limited to clownfish and pufferfish.
- Retired companion code, docs, and raster assets were removed from the tracked app tree.
- `student_companion_profiles.species` is moved to a fish-only check constraint by `20260510220050_fish_companion_species.sql`.
- Server-side XP is granted after first-time real LMS events: student assignment submission and first teacher feedback/grade post. Repeat submissions and grade edits do not farm XP.

Course messaging now has a real audited write path:

- Student and guardian message forms send through `/api/lms/messages`; the server resolves the course staff recipient from active enrollment or linked-child relationships.
- Teacher message forms can send to students in their course roster, with server-side assignment checks before any conversation row is created.
- `sendCourseMessage` creates the conversation, members, message, notification, and `message.sent` audit row from one LMS mutation service.
- `20260510233000_course_message_write_policy.sql` tightens conversation reads and member inserts so direct Supabase writes follow course, role, and guardian-link boundaries.

## Evidence

- `npm test -- tests/lms-mutations.test.ts tests/lms-query-mapping.test.ts tests/lms-student-workspaces.test.tsx`: 13/13 passing on 2026-05-10.
- `npm test`: 28 files / 121 tests passing on 2026-05-10.
- `npm test -- tests/lms-auth.test.ts tests/pilot-auth.test.ts`: 16/16 passing on 2026-05-10 for real auth routing, one-click demo forms, route-handler local redirects, and proxy host preservation.
- `npm test -- tests/lms-audit-log-coverage.test.ts`: 3/3 passing on 2026-05-10.
- `npm test -- tests/fish-companion.test.ts`: 12/12 passing on 2026-05-10.
- `npm test -- tests/companion-server-xp.test.ts`: 3/3 passing on 2026-05-10 for server-side companion XP grants from real submission and feedback events.
- `npm test -- tests/lms-messages.test.ts tests/lms-dashboards.test.tsx tests/lms-student-workspaces.test.tsx tests/lms-audit-log-coverage.test.ts`: 16/16 passing on 2026-05-10 for audited message writes, composer UI, route delegation, and policy artifact coverage.
- `npm run lint`, `npm run typecheck`, `npm audit --audit-level=moderate`, and `npm run build`: passing on 2026-05-10 after the audited messaging write slice.
- Landing/login visual smoke passed on 2026-05-10 for desktop and mobile with no missing image alt text, unnamed buttons, or horizontal overflow.
- `LMS_SMOKE_MUTATE=1 npm run test:a11y`: passing locally on 2026-05-10 with student file attachment, teacher grading, admin writes, logout, and screenshots in `test-results/lms-smoke`.
- Updated signed-file smoke assertion exposed a live RLS gap on 2026-05-10: assigned teachers cannot yet read all student submissions until `20260510212739_submissions_assigned_teacher_read_policy.sql` is applied.
- Non-mutating local Playwright smoke against `http://127.0.0.1:3010` passed on 2026-05-10 after fixing same-host auth redirects for local `127.0.0.1` login flows.
- Supabase changelog and Storage upload/access-control docs were checked on 2026-05-10 before implementing storage-facing code.
- `npm run security:supabase` is still blocked until DB/read credentials are available to the local shell.

## Scale Path

The current codebase already has scale-budget and load-smoke scripts for the verified single-school envelope. The next scale path is:

- Replace tenant-wide client-side read aggregation with paginated/server-side read models for large schools.
- Add query-plan review for high-cardinality LMS screens.
- Add storage quotas per tenant/course/student.
- Add queues for virus scanning, notifications, and exports.
- Add connection pooling and production DB sizing plan.
- Add external load-test report before any 10k-concurrent-user claim.

## Non-Goals Until Web MVP Is Stable

- Native iOS, macOS, and Android clients.
- Large-district replacement claims.
- Customer-specific SIS/SSO integrations as generic finished features.
- Legal/compliance certification claims without external review.
