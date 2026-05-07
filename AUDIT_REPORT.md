# WolfWhale LMS Launch Readiness Audit

Audit date: 2026-05-07

## Executive Finding

WolfWhale has moved beyond the earlier controlled pilot and beyond the first Supabase-backed MVP. It now has a larger school-operations baseline with authenticated role routing, durable core LMS workflows, weighted gradebook summaries, rubrics, attendance, risk visibility, roster imports/invites, and scale-budget verification.

The verified claim is: **commercial school LMS baseline for single-school and controlled multi-school selling, with durable auth, role dashboards, clickable role tool hubs, course/enrollment management, assignments, submissions, weighted grades, rubrics, attendance, feedback, calendar/resource/message visibility, roster invitations, scale gates, and hardened Supabase data access.**

Do not market it as a proven large-district Canvas/Brightspace/Moodle displacement yet. That claim still requires a customer-specific SSO/SIS implementation, production restore-drill evidence against a disposable target, formal WCAG certification, and signed support/legal operating agreements.

## Current Stack

- Next.js 16.2.5 App Router, React 19, TypeScript, Tailwind 4.
- Supabase Auth SSR via `@supabase/ssr`.
- Supabase PostgreSQL RLS-backed tenant, role, course, enrollment, assignment, submission, grade, rubric, attendance, notification, resource, conversation, and message data.
- Supabase Storage private course resources with signed access route.
- Vitest unit/component tests, production build gate, and Playwright browser smoke.
- Sentry, Vercel Analytics, Vercel Speed Insights, and Vercel cron route support.

## Implemented LMS Surface

- `/login` signs users in with school email/password through Supabase Auth.
- `/student`, `/teacher`, `/admin`, and `/guardian` are protected through the Next proxy plus server-side membership checks.
- Admin dashboard shows school metrics, risk summary, attendance summary, audit trail, calendar, resources, messages, course creation, student enrollment, roster import, gradebook export, attendance export, and SIS export.
- Teacher dashboard shows courses, roster, assignments, assignment creation, weighted gradebook, gradebook export, attendance marking/export, rubric creation, grading queue, grade posting, calendar, resources, and messages.
- Student dashboard shows courses, assignments, submissions, weighted gradebook status, attendance, grades, feedback, notifications, calendar, resources, messages, student analytics, background themes, and a local study companion.
- Student course cards now open course-specific workspaces where syllabus, lessons, resources, assignment submission portals, grades/feedback, gradebook, attendance, calendar, and messages are displayed together for that course.
- Student assignments are also available in an all-assignments workspace grouped by course.
- Student grades/feedback, gradebook, attendance, calendar, resources, messages, notifications, settings, and companion world now have dedicated student routes rather than relying only on in-dashboard section jumps.
- Guardian dashboard shows linked-student courses, assignments, weighted gradebook status, attendance, grades, feedback, calendar, resources, and messages.
- Each role dashboard now has a clickable tool hub plus section anchors so users can jump directly to the features they are allowed to use.
- API routes persist core workflows:
  - `/api/lms/courses`
  - `/api/lms/enrollments`
  - `/api/lms/exports/attendance`
  - `/api/lms/exports/gradebook`
  - `/api/lms/exports/sis`
  - `/api/lms/assignments`
  - `/api/lms/attendance`
  - `/api/lms/submissions`
  - `/api/lms/grades`
  - `/api/lms/roster/import`
  - `/api/lms/resources/[resourceId]`
  - `/api/lms/rubrics`

## Benchmark Against Canvas/Brightspace/Moodle/Edsby

Covered for a commercial district-baseline LMS:

- Authentication and role routing.
- Student, teacher, admin, and guardian dashboards.
- Courses, enrollments, assignments, submissions, weighted grading, rubrics, attendance, feedback, calendar visibility, notifications, messages, and resources.
- Guardian-limited linked-student visibility.
- Admin roster CSV validation and Supabase Auth invite imports.
- OneRoster bundle validation, SIS export package generation, gradebook/attendance CSV exports, report-card generation, and SSO config validation.
- District proof profile validation for SSO, SIS, load, legal/support evidence, and guarded restore-drill command.
- Single-school scale-budget guardrail script.
- Supabase RLS/security hardening and live validation.
- Mobile smoke checks and accessibility smoke checks for key pages.
- Enterprise readiness gate, support runbook, incident runbook, data-processing checklist, and synthetic load smoke.

Still below mature large-district Canvas-scale proof:

- Customer-specific automated OneRoster/SIS sync, LTI, standards alignment, analytics, and archival exports.
- Customer-specific SSO/SAML/OIDC, delegated admin, password recovery policy, and invite lifecycle polish.
- File upload UI, malware scanning, quota management, and retention workflows.
- Load testing, restore-drill evidence, support SLAs, and full WCAG audit.

## Supabase Production Data Finding

Live Supabase connector validation against project `yhxesebykwhlpsmxxiqo` after hardening on 2026-05-07 found:

- 0 launch-sensitive public tables selectable by `anon`.
- 0 public functions executable by `anon`.
- 0 reviewed storage buckets left public.
- 0 key launch tables without RLS.
- 0 remaining legacy recursive messaging policies.

Applied live migration names include:

- `launch_lock_down_anon_data_api`
- `restrict_security_definer_rpc_surface`
- `restrict_public_storage_buckets`
- `drop_public_storage_listing_policy`
- `fix_conversation_rls_recursion`
- `fix_conversation_ids_function_no_inline`
- `fix_conversation_ids_function_row_security_off`
- `replace_recursive_messaging_policies_with_direct_membership`
- `drop_legacy_recursive_messaging_policies`

## Verification Summary

- `npm run launch:verify`: passed.
- `npm run lint`: passed.
- `npm run typecheck`: passed.
- `npm test`: passed, 18 files / 76 tests.
- `npm run enterprise:check`: passed.
- `npm run district:verify`: passed.
- `npm run district:proof`: passed for `fixtures/district/canvas-replacement-demo.json`.
- `npm run scale:check`: passed for the verified single-school operating envelope.
- `npm run load:smoke`: passed for 5000 students, 500 teachers, 1000 courses, and 50000 enrollments.
- `npm run build`: passed, 291 generated static pages and `ƒ Proxy`; route list includes attendance, rubric, roster import, gradebook export, attendance export, SIS export APIs, and dedicated student workspace routes.
- `npm run test:lms-smoke` / `npm run test:a11y`: passed with screenshots in `test-results/lms-smoke`.
- Student course workspace browser pass: passed with screenshots in `test-results/student-course-workflows`.
- `LMS_SMOKE_MUTATE=1 npm run test:a11y`: passed for real submit/create/attendance/rubric/grade/enrollment/import workflows.
- `npm audit --omit=dev --audit-level=high`: passed, 0 vulnerabilities.
- Computer Use visual workflow pass: student demo login, dashboard tool hub, tool jump, dashboard-home jump, and sign-out passed in Chrome.
- Live Supabase MCP security validation: passed against `yhxesebykwhlpsmxxiqo`, 0 failing rows across all five launch-security checks.

## Launch Recommendation

Launch/sell as a commercial school LMS baseline for single schools and carefully scoped multi-school customers. Keep sales language precise: WolfWhale now supports real school LMS operations across core roles, gradebook, attendance, rubrics, roster invites, and data safety, but it is not yet independently proven as a large-district Canvas displacement.
