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
