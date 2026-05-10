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

## Evidence

- `npm test -- tests/lms-mutations.test.ts tests/lms-query-mapping.test.ts tests/lms-student-workspaces.test.tsx`: 13/13 passing on 2026-05-10.
- `npm test`: 23 files / 98 tests passing on 2026-05-10.
- `npm run lint`, `npm run typecheck`, and `npm run build`: passing on 2026-05-10.
- `LMS_SMOKE_MUTATE=1 npm run test:a11y`: passing locally on 2026-05-10 with student file attachment, teacher grading, admin writes, logout, and screenshots in `test-results/lms-smoke`.
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
