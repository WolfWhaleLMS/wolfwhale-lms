# Fix Log

Sprint date: 2026-05-07

## Auth And Route Protection

- Added Supabase Auth SSR support with `@supabase/ssr`.
- Added server/client Supabase helpers under `lib/supabase`.
- Reworked `/login` from pilot access-code login to school email/password login.
- Added `/api/auth/login`, `/api/auth/logout`, and `/auth/confirm`.
- Updated `proxy.ts` to refresh Supabase sessions for protected LMS role routes.
- Added safe redirect handling and role normalization in `lib/lms/auth.ts`.

## Durable LMS Data Layer

- Added `lib/lms/types.ts`, `lib/lms/queries.ts`, `lib/lms/read-model.ts`, and `lib/lms/server.ts`.
- Mapped Supabase tenant, membership, course, enrollment, assignment, submission, grade, notification, lesson, resource, conversation, and message rows into role-safe dashboard views.
- Fixed actor selection so the signed-in user is used for their active role instead of accidentally defaulting to the first tenant member.
- Replaced route pages with persistent role dashboards.

## LMS Workflows

- Added LMS dashboards in `components/lms`.
- Added shared calendar, resource, and message panels.
- Added role-specific dashboard tool hubs so student, teacher, admin, and guardian users can jump directly to their available workflows instead of scrolling through static dashboard content.
- Added stable section anchors and dashboard-home navigation for courses, assignments, submissions, grades, gradebook, attendance, calendar, resources, messages, roster, risk, audit, and admin operations.
- Replaced the dashboard `/` back link with an in-dashboard home anchor because `/` now intentionally redirects public visitors into LMS login.
- Updated the login-page back/help link to point to `/help` instead of looping through the root LMS redirect.
- Added student submission workflow.
- Added teacher assignment creation and grade posting workflow.
- Added weighted gradebook summaries with category weights, letter grades, missing-work counts, attendance rate, and risk status.
- Added rubric read model, validation, teacher rubric creation route, and dashboard UI.
- Added attendance read model, validation, teacher attendance marking route, and role-scoped attendance summaries.
- Added admin course creation and student enrollment workflow.
- Added admin roster CSV import UI and `/api/lms/roster/import` using server-only Supabase service-role invitations, profile upserts, membership upserts, and audit logging.
- Added signed private resource redirect route at `/api/lms/resources/[resourceId]`.
- Added LMS mutation validation in `lib/lms/mutations.ts`.
- Added `lib/lms/roster.ts` for CSV validation and large-school scale-budget checks.

## Supabase Security And RLS

- Applied previous launch hardening migrations for anon grants, function grants, views, and storage.
- Added messaging RLS recursion fixes:
  - `20260507170500_fix_conversation_rls_recursion.sql`
  - `20260507171300_fix_conversation_ids_function_no_inline.sql`
  - `20260507171600_fix_conversation_ids_function_row_security_off.sql`
  - `20260507171900_replace_recursive_messaging_policies_with_direct_membership.sql`
  - `20260507172200_drop_legacy_recursive_messaging_policies.sql`
- Applied the same messaging fixes to connected Supabase project `yhxesebykwhlpsmxxiqo`.
- Validated all four demo role accounts can authenticate and load LMS records through Supabase RLS.
- Revalidated live security exposure after the RLS changes.

## Verification And Ops

- Replaced pilot browser smoke with `scripts/lms-browser-smoke.ts`.
- Added `npm run test:lms-smoke`; kept `test:pilot-smoke` as a compatibility alias.
- Strengthened browser smoke to require gradebook, attendance, rubrics, risk summary, and roster import panels.
- Strengthened browser smoke again to click every role dashboard tool link, verify target sections, check dashboard-home navigation, validate LMS API export/resource links, test login help navigation, test logout, and optionally run mutating workflow submits with `LMS_SMOKE_MUTATE=1`.
- Added guarded `scripts/backup-db.sh`.
- Added guarded `scripts/restore-drill.sh`.
- Added `scripts/check-lms-scale-budget.ts` and `npm run scale:check`.
- Added `scripts/lms-load-smoke.ts` and `npm run load:smoke`.
- Added `scripts/check-enterprise-readiness.ts` and `npm run enterprise:check`.
- Added `npm run district:verify`.
- Added `npm run district:proof`.
- Added demo district proof profile at `fixtures/district/canvas-replacement-demo.json`.
- Added district proof validation in `lib/lms/district-proof.ts`.
- Added OneRoster bundle validation in `lib/lms/oneroster.ts`.
- Added gradebook, attendance, report-card, and SIS export generation in `lib/lms/exports.ts`.
- Added SSO configuration validation in `lib/lms/sso.ts`.
- Added admin/teacher export API routes for gradebook, attendance, and SIS packages.
- Added admin/teacher export controls in LMS dashboards.
- Added enterprise env contract entries for SSO/SAML/OIDC, OneRoster/SFTP, support escalation, incident command, and privacy contacts.
- Added `ENTERPRISE_LAUNCH_READINESS.md`, `SUPPORT_RUNBOOK.md`, `INCIDENT_RESPONSE_RUNBOOK.md`, and `DATA_PROCESSING_CHECKLIST.md`.
- Added `scale:check` to `npm run launch:verify`.
- Added `enterprise:check` and `load:smoke` to `npm run launch:verify`.
- Confirmed:
  - `npm run launch:verify` passes.
  - `npm run test:lms-smoke` passes.
  - `LMS_SMOKE_MUTATE=1 npm run test:a11y` passes against the local app.
  - `npm audit --audit-level=moderate` reports 0 vulnerabilities.
  - Live Supabase MCP launch-security checks pass against `yhxesebykwhlpsmxxiqo`.
  - `npm run district:proof` passes.

## UI Sharpness And High-Refresh Motion

- Reduced glass blur tokens and heavy backdrop saturation so text sits on clearer surfaces.
- Added high-refresh motion tokens targeting an 8.333ms frame budget for 120Hz-capable browsers.
- Added crisp text rendering defaults and a `.sharp-text` utility for UI surfaces and controls.
- Removed blur-prone scale transforms from shared buttons, hub controls, glass hover states, and active press states.
- Replaced broad `transition-all`/`transition: all` usage in shared UI controls and glass surfaces with explicit transform, color, border, background, and shadow transitions.
- Removed text shadows from chrome buttons and landing-page headings that were making UI text appear fuzzy.
- Added `tests/ui-rendering-quality.test.ts` to guard against regressions in button scaling, glass hover scaling, and rendering tokens.

## Student Reef Dashboard Theme

- Replaced the student LMS dashboard's shared corporate shell with a student-only reef-lagoon learning console.
- Added a horizontal bubble-glass tool hub with working anchors for courses, assignments, submissions, grades, gradebook, attendance, calendar, resources, messages, and notifications.
- Added student-first analytics widgets using radial dials for momentum, mastery, attendance weather, and workload health.
- Restyled courses, assignments, gradebook, attendance, resources, calendar, messages, notifications, and submit-work forms without changing teacher/admin/guardian dashboards.
- Added a lagoon Frutiger Aero-inspired backdrop using code-native sea lighting and code-native labels/controls.
- Reordered the mobile layout so the student dashboard appears before the side rail.

## Student Course Workspaces, Themes, And Companion

- Added real student workspace routes for `/student/courses`, `/student/courses/[courseId]`, `/student/assignments`, and `/student/settings`.
- Added dedicated student feature routes for `/student/grades-feedback`, `/student/gradebook`, `/student/attendance`, `/student/calendar`, `/student/resources`, `/student/messages`, and `/student/notifications`.
- Changed student course cards and dashboard tool links so courses open into course-specific workspaces instead of leaving students on one long scrolling dashboard.
- Added course-scoped syllabus, lessons, materials, assignment submission portals, grades/feedback, gradebook, attendance, calendar, and messages on each course detail page.
- Added an all-assignments workspace grouped by course with a single stable `#submit-work` anchor and course-specific submit forms.
- Extended the LMS read model with course-aware assignment categories, lesson summaries, resource course/lesson IDs, grade course IDs, calendar course IDs, and message course IDs.
- Added student background theme settings with local persistence and three launch themes: Reef Lagoon, Fisher Price toybox, and ancient monolith.
- Added a first usable study companion widget with starter fish species, local pet profile storage, hatching, XP rewards, level/hatch progress, behavior mode, and world activities.
- Added a companion world prototype at `/student/companion-world` plus a `/companion-world` redirect.
- Added companion sprite atlas contracts, animation-state mapping, and code-native fallback sprite/egg CSS so pets render while final atlas assets are still being prepared.
- Added tests covering course-specific read-model data, dashboard tool links, course workspace isolation, assignments grouped by course, settings themes, and companion local-storage safety.

## Student Dashboard App Shell And Companion Previews

- Reworked the student dashboard from a long embedded workflow page into a first-viewport app launcher.
- Kept dashboard access to 12 primary tools: courses, assignments, submit work, grades/feedback, gradebook, attendance, calendar, resources, messages, notifications, companion world, and settings.
- Kept compact course launch cards on the dashboard while moving course internals to course-specific pages.
- Confirmed the dashboard no longer contains submission forms or textareas; submissions live in `/student/assignments#submit-work` and course detail pages.
- Added compact learning cockpit rows for next action, latest feedback, and latest message, each linking to the relevant workspace.
- Tightened the student dashboard layout so the desktop first viewport fits at `1440x900` and `1920x1080`.
- Removed the retired mixed-animal base art direction and kept the companion preview direction fish-only.
- Added `basePreviewPath` support to `CompanionSprite` so planned species can show static real art before final animated WebP atlases are ready.
- Updated the companion hatch selector so students see the available creature art immediately.
- Left final sprite atlas status as `planned`; the two final transparent WebP atlases still need to be generated and QA-approved before any species is marked `ready`.
- Updated the optional mutating LMS browser smoke so student submission checks navigate to `/student/assignments#submit-work` instead of expecting submission forms on the dashboard.
- Allowed teachers to create assignments/rubrics for active courses they are assigned to through `course_enrollments`, not only courses they personally created.

## WolfWhale Main Brand Logo

- Replaced the primary `/logo.png` asset with a black WolfWhale silhouette mark derived from the existing product mark.
- Added `WolfWhaleBrand` as the shared brand lockup component.
- Applied the Times New Roman `WolfWhale` / `Learning Management System` lockup to the main login, help, privacy, terms, info, and LMS landing surfaces.
- Updated logo loading/glow components so the black mark sits on a white tile and remains visible on dark surfaces.

## Codebase Structure Hardening

- Split `components/lms/StudentWorkspaces.tsx` into a dedicated `components/lms/student-workspaces/` feature module with separate course, assignment, progress, communications, settings, helper, and shared UI files.
- Preserved the existing `StudentWorkspaces` export surface so route imports did not need to change.
- Split `app/student/dashboard/page.tsx` into a thin route wrapper, `dashboard-data.ts` for server-side Supabase/auth/data shaping, and `dashboard-view.tsx` for presentation.
- Tightened TypeScript config by disabling JavaScript compilation in the TypeScript project and enabling consistent import casing checks.
- Centralized textbook dynamic image rendering in `TextbookImage` so arbitrary textbook/admin images have one explicit native-image boundary instead of repeated lint exceptions.
- Fixed textbook admin/editor hook dependency warnings with stable callback loaders.
- Replaced the referral banner's raw internal anchor with Next `Link`.
- Verified the refactor with focused student LMS tests, full launch verification, clean lint, and browser LMS smoke checks.

## Supabase Security Gate Credential Path

- Added `scripts/resolve-supabase-db-url.ts` so live Supabase SQL checks can run from either `SUPABASE_DB_URL` / `DATABASE_URL` or a password-only `SUPABASE_DB_PASSWORD` setup.
- The resolver reads local env files and the linked Supabase pooler URL, so operators do not have to paste a full Postgres URL into the shell.
- Added an alternate Supabase Management API read-only query path using `SUPABASE_ACCESS_TOKEN` plus `SUPABASE_PROJECT_REF` for operators that prefer token-scoped database-read validation.
- Updated `npm run launch:verify` so missing DB credentials are handled as a deliberate skipped gate, while actual Supabase security failures still fail verification.
- Added `.env.example` entries and resolver tests for the password-only Supabase launch-security path.

## Resource Uploads, Companion Persistence, And Ops Evidence

- Added teacher/admin private course resource upload UI inside the Resources panel.
- Added `/api/lms/resources` and `createCourseResource` so staff uploads validate file type/size, upload to private Supabase Storage, create/reuse a course resources lesson, attach the file, and audit the mutation.
- Added `SUPABASE_COURSE_RESOURCE_BUCKET`, defaulting to the connected project's `lesson-resources` bucket while still supporting `course-materials` for new projects.
- Updated course resource upload/signing to use server-side service-role storage after normal role/membership validation, avoiding valid staff uploads being blocked by drifted bucket policies.
- Added RLS/storage migration `20260508181000_course_resource_upload_rls.sql` to remove broad course-material public reads, scope course-material insert paths to the uploader tenant, and allow assigned teachers to insert/delete lesson attachments.
- Expanded Supabase launch-security checks to include `student_companion_profiles`, course-material public listing, tenant-scoped upload policy validation, and assigned-teacher lesson-attachment insert validation.
- Added `student_companion_profiles` migration, `/api/companion/profile`, and client sync helpers so fish companion progress is durable for authenticated students while still using local cache as a fast fallback.
- Updated the floating companion, student companion widget, and companion world to sync with the server.
- Added restore-drill evidence schema validation, `npm run ops:evidence`, example evidence JSON, production-promotion checklist, and restore evidence documentation.
- Added `ops:evidence` to `npm run launch:verify` and `enterprise:check`.
- Tightened the student dashboard data loader by replacing loose `any` casts with typed Supabase row shapers and fixed course grade summaries to average stored grade percentages instead of mixing earned points with percentages.
- Strengthened browser smoke coverage so teacher/admin dashboard tool hubs include resources/calendar/messages and mutating teacher smoke uploads a real course resource file.

## Rate Limits, Resource Safety, And Companion Conflicts

- Added a shared server-side rate limiter with Upstash Redis support and an in-memory local fallback.
- Applied throttling to real login, LMS mutation routes, roster import, course resource upload, companion profile save, and legacy pilot demo mutations.
- Added `course_resource_security_reviews` migration with file SHA-256, scan status, scan provider, retention expiry, legal hold, quarantine reason, indexes, and RLS policies.
- Added upload quota enforcement hooks for school-wide and course-level resource storage budgets.
- Added download-time resource gating for quarantined, scan-error, pending-strict-scan, and retention-expired resources.
- Added admin resource-review controls to change scan status, quarantine note, and legal-hold state from the Resources panel.
- Added companion profile optimistic versioning so stale pet saves return a 409 conflict instead of silently overwriting newer server state.
- Expanded launch-security sensitive table tracking to include `course_resource_security_reviews`.
- Added focused tests for rate limiting and course resource security decisions.
