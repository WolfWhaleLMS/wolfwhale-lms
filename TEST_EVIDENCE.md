# Test Evidence

Evidence date: 2026-05-07

## Final Local Gate

`npm run launch:verify` passed after the Supabase-backed LMS changes, messaging RLS fixes, and large-school workflow expansion.

The command ran:

- `npm run lint`
- `npm run typecheck`
- `npm test`
- `npm run district:verify`
- `npm run enterprise:check`
- `npm run scale:check`
- `npm run load:smoke`
- `npm run build`
- `npm run security:supabase` when a DB URL is configured

Observed result:

- Lint passed.
- TypeScript passed.
- Vitest passed: 15 test files / 61 tests.
- District verification passed: OneRoster validation, SIS export package, gradebook CSV export, attendance CSV export, report cards, SSO config validation, district proof profile, enterprise gate, and load smoke.
- Enterprise readiness gate passed.
- Scale-budget check passed for the verified single-school operating envelope.
- LMS load smoke passed in 1489ms during `launch:verify` for 5000 students, 500 teachers, 1000 courses, and 50000 enrollments.
- Next build passed on Next.js 16.2.5.
- Build generated 46 static pages and `ƒ Proxy`; route list includes `/api/lms/attendance`, `/api/lms/rubrics`, `/api/lms/roster/import`, `/api/lms/exports/attendance`, `/api/lms/exports/gradebook`, and `/api/lms/exports/sis`.
- Supabase direct DB security step is skipped by `launch:verify` when no `SUPABASE_DB_URL` or `DATABASE_URL` is set.
- Equivalent live Supabase MCP SQL validation passed against project `yhxesebykwhlpsmxxiqo`.

## Browser Smoke

`npm run test:lms-smoke` and `npm run test:a11y` passed.

The smoke test verifies:

- `/student` redirects unauthenticated users to `/login?next=%2Fstudent`.
- Student, teacher, admin, and guardian accounts sign in with Supabase Auth.
- Each role dashboard renders its role heading.
- Each role dashboard renders Calendar, Resources, and Messages panels.
- Teacher dashboard includes gradebook, attendance, and rubrics.
- Admin dashboard includes risk summary and roster import.
- Desktop student and mobile teacher/admin/guardian dashboard screenshots render without framework errors.
- Accessibility smoke requires each tested page to have an `h1`, no `img` without `alt`, no unlabeled form controls, and no unnamed buttons.

Screenshots:

- `test-results/lms-smoke/login-desktop.png`
- `test-results/lms-smoke/student.png`
- `test-results/lms-smoke/teacher.png`
- `test-results/lms-smoke/admin.png`
- `test-results/lms-smoke/guardian.png`

## Test Files

- `tests/launch-routing.test.ts`
- `tests/school-role-surface.test.ts`
- `tests/lms-auth.test.ts`
- `tests/lms-query-mapping.test.ts`
- `tests/lms-read-model.test.ts`
- `tests/lms-mutations.test.ts`
- `tests/lms-gradebook-attendance.test.ts`
- `tests/lms-roster.test.ts`
- `tests/lms-district-scale.test.ts`
- `tests/lms-dashboards.test.tsx`
- `tests/supabase-launch-security.test.ts`
- `tests/pilot-auth.test.ts`
- `tests/pilot-data.test.ts`
- `tests/pilot-assignment-cycle.test.ts`
- `tests/pilot-dashboards.test.tsx`
- `tests/ui-rendering-quality.test.ts`

## UI Sharpness And Motion Evidence

Added rendering guardrails for the 4K/high-refresh visual pass:

- CSS defines 120Hz-oriented motion tokens including an 8.333ms frame-budget token.
- Shared controls use explicit transitions instead of broad `transition-all` where patched.
- Shared button active states translate by 1px instead of scaling text.
- Glass and hub hover states no longer scale text containers.
- Chrome buttons and key landing headings no longer depend on text shadows for readability.

Verification on 2026-05-07:

- `npm run launch:verify` passed.
- `npm run test:a11y` passed.
- 4K rendered smoke at `3840x2160` passed on `http://localhost:3000/`.
- Rendered computed styles confirmed `text-rendering: optimizelegibility`, `-webkit-font-smoothing: antialiased`, button `text-shadow: none`, and homepage headline `text-shadow: none`.

## Dependency And Security Evidence

`npm audit --audit-level=moderate` passed with 0 vulnerabilities.

Live Supabase MCP validation against project `yhxesebykwhlpsmxxiqo` found:

- 0 sensitive public tables selectable by `anon`.
- 0 public functions executable by `anon`.
- 0 reviewed storage buckets left public.
- 0 key launch tables without RLS.
- 0 legacy recursive messaging policies.

Live launch-security SQL checks also returned 0 failing rows for:

- `anon_sensitive_table_select`
- `anon_public_function_execute`
- `security_invoker_views`
- `authenticated_high_risk_security_definer_rpc_execute`
- `public_storage_bucket_listing`

## District Proof Profile

`npm run district:proof` passed for `fixtures/district/canvas-replacement-demo.json`.

Evidence:

- SSO profile validated for OIDC.
- OneRoster bundle validated.
- Load profile is inside the verified envelope: 5000 students, 500 teachers, 1000 courses, 50000 enrollments.
- Legal, support, incident, data-processing, and enterprise-readiness evidence files are present.
- Restore drill command is guarded for disposable non-production restore.

All four demo launch accounts were verified through the Supabase client path:

- Student record load: passed.
- Teacher record load: passed.
- Guardian record load: passed.
- Admin record load: passed.
