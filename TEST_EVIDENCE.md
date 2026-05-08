# Test Evidence

Evidence date: 2026-05-07

## Final Local Gate

`npm run launch:verify` passed after the dashboard navigation/workflow audit fixes, Supabase-backed LMS changes, messaging RLS fixes, and large-school workflow expansion.

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
- Vitest passed: 16 test files / 64 tests.
- District verification passed: OneRoster validation, SIS export package, gradebook CSV export, attendance CSV export, report cards, SSO config validation, district proof profile, enterprise gate, and load smoke.
- Enterprise readiness gate passed.
- Scale-budget check passed for the verified single-school operating envelope.
- LMS load smoke passed during `launch:verify` for 5000 students, 500 teachers, 1000 courses, and 50000 enrollments.
- Next build passed on Next.js 16.2.5.
- Build generated 291 static pages and `ƒ Proxy`; route list includes `/api/lms/attendance`, `/api/lms/rubrics`, `/api/lms/roster/import`, `/api/lms/exports/attendance`, `/api/lms/exports/gradebook`, `/api/lms/exports/sis`, and the student workspace routes.
- Supabase direct DB security step is skipped by `launch:verify` when no `SUPABASE_DB_URL` or `DATABASE_URL` is set.
- Equivalent live Supabase MCP SQL validation passed against project `yhxesebykwhlpsmxxiqo`.

## Browser Smoke

`npm run test:lms-smoke` and `npm run test:a11y` passed.

The smoke test verifies:

- `/student` redirects unauthenticated users to `/login?next=%2Fstudent`.
- Student, teacher, admin, and guardian accounts sign in with Supabase Auth.
- Each role dashboard renders its role heading.
- Each role dashboard exposes a `Dashboard tools` navigation region.
- Every required role dashboard tool link is clicked and verified to target a real section.
- `Dashboard home` navigation is clicked and verified.
- The login `Account help` link goes to `/help` instead of looping through `/`.
- Sign-out returns users to `/login?loggedOut=1`.
- LMS export/resource links return successful HTTP responses.
- Each role dashboard renders Calendar, Resources, and Messages panels.
- Teacher dashboard includes gradebook, attendance, and rubrics.
- Admin dashboard includes risk summary and roster import.
- Desktop student and mobile teacher/admin/guardian dashboard screenshots render without framework errors.
- Accessibility smoke requires each tested page to have an `h1`, no `img` without `alt`, no unlabeled form controls, and no unnamed buttons.

## Mutating Workflow Audit

`LMS_SMOKE_MUTATE=1 npm run test:a11y` passed against the local app.

The mutating browser audit verified:

- Student submission forms can submit successfully and redirect with `saved=submission`.
- Teacher assignment creation redirects with `saved=assignment`.
- Teacher attendance marking redirects with `saved=attendance`.
- Teacher rubric creation redirects with `saved=rubric`.
- Teacher grading queue posts a grade when a queue item exists and redirects with `saved=grade`.
- Admin course creation redirects with `saved=course`.
- Admin enrollment redirects with `saved=enrollment`.
- Admin roster CSV import redirects with `saved=roster`.

Computer Use was also used in Chrome to visually confirm the student demo login, dashboard tool hub, `Submit work` jump, `Dashboard home` jump, and sign-out return to the login page.

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

## Student Boreal Dashboard Evidence

Verification on 2026-05-07:

- `npm test -- tests/lms-dashboards.test.tsx` passed.
- `npm run lint` completed with 0 errors and 10 existing warnings outside the changed student dashboard file.
- `npm run test:a11y` passed against `http://localhost:3000`.
- Playwright desktop capture at `1440x900` exercised login, the Assignments tool-hub anchor, Dashboard home navigation, and screenshot capture with no console/page errors.
- Playwright mobile capture at `390x844` verified the student dashboard renders first on mobile.

Screenshot evidence:

- `test-results/lms-smoke/student.png`
- `/tmp/student-boreal-1440x900.png`
- `/tmp/student-boreal-390x844.png`

## Student Course Workspace Evidence

Verification on 2026-05-07:

- `npm test` passed, 18 files / 76 tests.
- `npm run lint` completed with 0 errors and 10 existing warnings outside the changed student course/theme/companion files.
- `npm run typecheck` passed.
- `npm run build` passed and includes dynamic routes for `/student/courses`, `/student/courses/[courseId]`, `/student/assignments`, `/student/grades-feedback`, `/student/gradebook`, `/student/attendance`, `/student/calendar`, `/student/resources`, `/student/messages`, `/student/notifications`, `/student/settings`, and `/student/companion-world`.
- `npm run test:a11y` passed against `http://localhost:3000`; the role smoke clicked every student dashboard tool into a real workspace and returned to the dashboard.
- Additional Playwright browser workflow passed for the student account on `http://localhost:3000`: login, seven dedicated feature pages, Courses workspace, click a course with assignments, verify syllabus/lessons/assignments/materials/gradebook/attendance/calendar/messages, verify course submit forms, verify all-assignments submit forms, apply the Fisher Price Toybox and Ancient Monolith themes, hatch a Glyptodont companion, open Companion world, and verify no framework errors.

Screenshot evidence:

- `test-results/student-course-workflows/courses.png`
- `test-results/student-course-workflows/course-detail.png`
- `test-results/student-course-workflows/assignments.png`
- `test-results/student-course-workflows/settings-pet-theme.png`
- `test-results/student-course-workflows/feature-pages-and-settings.png`
- `test-results/student-course-workflows/companion-world.png`

## Student App Dashboard And Companion Preview Evidence

Verification on 2026-05-08:

- `npm test -- tests/lms-student-workspaces.test.tsx tests/lms-dashboards.test.tsx tests/ice-age-companion.test.ts` passed: 3 files / 18 tests.
- `npm test -- tests/lms-mutations.test.ts tests/lms-student-workspaces.test.tsx tests/lms-dashboards.test.tsx tests/ice-age-companion.test.ts` passed: 4 files / 22 tests.
- `npm run typecheck` passed.
- `npm run lint` completed with 0 errors and the same 10 existing unrelated warnings in textbook/referral files.
- `npm run build` passed.
- `npm run test:a11y` passed; the browser smoke logged in all four demo roles, clicked dashboard tools, checked target pages, API resource/export links, logout, and basic accessibility.
- `LMS_SMOKE_BASE_URL=https://wolfwhale.ca npm run test:a11y` passed after the production deployment and custom-domain alias update.

Additional Playwright measurement against `http://localhost:3000` with the student demo account:

- `1440x900`: `scrollHeight=900`, `clientHeight=900`, `overflow=0`.
- `1920x1080`: `scrollHeight=1080`, `clientHeight=1080`, `overflow=0`.
- Student dashboard has 12 dashboard tool links and 3 course launch links.
- Student dashboard has 0 submission forms and 0 textareas.
- Student dashboard renders 5 Ice Age base preview images.
- Final animated sprite atlas count remains 0 because the production WebP atlases have not been generated yet.

Deployment evidence:

- Commit `4fa3b5b` deployed to Vercel production as `https://wolfwhale-hbyvp29tr-ryland-dupres-projects.vercel.app`.
- Follow-up commit `5aa814b` deployed to Vercel production as `https://wolfwhale-fhn5v0p9h-ryland-dupres-projects.vercel.app`.
- `wolfwhale.ca` was aliased to the `5aa814b` deployment.
- `LMS_SMOKE_BASE_URL=https://wolfwhale.ca npm run test:a11y` passed against the final custom-domain deployment.
- `https://wolfwhale.ca/images/ice-age-companion/base/woolly-mammoth.png` returned HTTP 200 after aliasing.
