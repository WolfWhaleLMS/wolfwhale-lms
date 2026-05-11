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
- Admin resource-review queue now summarizes pending/quarantined/error/unreviewed files, legal holds, and tenant quota usage from mapped resource review metadata.
- Admin audit review now maps actor id, resource id, and JSON detail metadata into the read model, renders it on the admin dashboard, and exposes an admin-only `/api/lms/exports/audit` CSV.

The companion system is now fish-only for beta:

- Starter species are limited to clownfish and pufferfish.
- The tracked app tree now keeps companion code, docs, and raster assets fish-only.
- `student_companion_profiles.species` is moved to a fish-only check constraint by `20260510220050_fish_companion_species.sql`.
- Server-side XP is granted after first-time real LMS events: student assignment submission, first teacher feedback/grade post, first-time present/online attendance check-ins, and first-time textbook lesson completion. Repeat submissions, grade edits, attendance edits, and repeated lesson completion updates do not farm XP.

Course messaging now has a real audited write path:

- Student and guardian message forms send through `/api/lms/messages`; the server resolves the course staff recipient from active enrollment or linked-child relationships.
- Teacher message forms can send to students in their course roster, with server-side assignment checks before any conversation row is created.
- `sendCourseMessage` creates the conversation, members, message, notification, and `message.sent` audit row from one LMS mutation service.
- Admin and teacher dashboards expose `/api/lms/exports/messages`, a scoped CSV review export built from the same role dashboard read models.
- Admin and teacher dashboards now include staff-only message moderation status controls. `/api/lms/messages/[messageId]/moderation` delegates to `moderateCourseMessage`, writes `message.moderated` audit rows, and depends on `20260511004429_message_moderation_controls.sql` for live schema columns.
- `20260510233000_course_message_write_policy.sql` tightens conversation reads and member inserts so direct Supabase writes follow course, role, and guardian-link boundaries.

Admin course setup now carries durable section and term metadata:

- The admin create-course form accepts school-facing section and term labels.
- `normalizeCourseDraft` trims and caps section/term labels before writes.
- `createCourse` persists section labels in `courses.section_label` and term labels in the existing `courses.semester` field.
- Supabase query mapping, LMS read models, dashboards, and CSV exports expose the metadata.
- `20260510225408_course_section_metadata.sql` adds the section column, tenant-scoped section index, and column comments for live schema alignment.

Admin direct invitations now have a real write path:

- The admin dashboard exposes a direct invite form for student, teacher, parent, and admin roles.
- `/api/lms/invitations` rate-limits invite attempts and delegates to `inviteUserToSchool`.
- `inviteUserToSchool` verifies the current user is a school admin, sends the Supabase invite through the server-side admin client, upserts profile and tenant membership rows, and writes a `user.invited` audit event.
- The school-membership list posts invite resend requests to `/api/lms/invitations/resend`.
- `resendSchoolInvitation` verifies the current user is a school admin, requires the server-side admin client, loads the tenant-scoped membership, retrieves the Auth user email with `getUserById`, resends through `inviteUserByEmail`, refreshes `invited_at`/`invited_by`, and writes `user.invite_resent`.
- The admin dashboard now lists school memberships and posts deactivate/reactivate requests to `/api/lms/memberships/status`.
- `updateSchoolMembershipStatus` verifies the current user is a school admin, requires the server-side admin client, blocks self-deactivation and super-admin deactivation, updates the tenant-scoped `tenant_memberships.status`, and writes `user.deactivated` or `user.reactivated` audit events.
- The same school-membership list posts role-change requests to `/api/lms/memberships/role`.
- `updateSchoolMembershipRole` verifies the current user is a school admin, requires the server-side admin client, blocks self role changes and super-admin changes, updates the tenant-scoped `tenant_memberships.role`, and writes `user.role_changed`.
- Remaining admin lifecycle work includes audit review, live RLS proof, and deployed smoke.

Admin guardian linking now has a real write path:

- The admin dashboard exposes a guardian-link form populated from active student and parent memberships.
- `/api/lms/guardian-links` rate-limits link attempts and delegates to `linkGuardianToStudent`.
- `linkGuardianToStudent` verifies the current user is a school admin, verifies both student and guardian are active in the same tenant, upserts `student_parents`, and writes a `guardian.linked` audit event.
- The admin dashboard also lists active guardian links and posts unlink requests to `/api/lms/guardian-links/unlink`.
- `unlinkGuardianFromStudent` verifies the current user is a school admin, deactivates the tenant-scoped active `student_parents` row, and writes a `guardian.unlinked` audit event.
- The active guardian-link list also posts primary-contact, consent method/notes, and custody notes to `/api/lms/guardian-links/contact`.
- `updateGuardianContactDetails` verifies the current user is a school admin, updates the tenant-scoped active `student_parents` row, clears other active primary contacts for the same student when needed, and writes `guardian.contact_updated`.
- `20260511001241_guardian_contact_details.sql` restores `is_primary_contact`, adds `consent_notes` and `custody_notes`, comments the sensitive fields, and indexes active primary contacts.
- Guardian/teacher read models now exclude inactive student memberships from linked-student and teacher-roster operational views.
- Remaining guardian lifecycle work includes live wrong-child/wrong-tenant RLS proof.

School and course calendar events now have a real write path:

- Admin and teacher dashboards expose event forms wired to `/api/lms/calendar-events`.
- `createCalendarEvent` verifies active staff membership, requires teachers to attach events to assigned courses, and permits admins to create school-wide events.
- `calendar_events` are loaded through the durable Supabase read model and merged with assignment due dates in role calendars.
- `20260510231855_lms_calendar_events.sql` adds the event table, indexes, course/school event shape constraints, RLS policies, and authenticated grants.
- Remaining calendar work includes recurring events, edit/cancel UI, iCal/feed export, notification rules, and live RLS/deployed proof.

Gradebook and reports now include trend evidence:

- Gradebook summaries compute a per-student course trend from the two most recent graded items.
- Teacher, student, and guardian gradebook surfaces render the trend as a plain-language label.
- Gradebook CSV exports and generated report-card objects include the raw trend field for downstream school reporting.
- Remaining reporting work includes date-range filters, report-pack generation, teacher/admin report builders, and live/deployed proof.

Submitted file downloads now have student and guardian affordances:

- Assignment summaries include submitted file metadata only for the current student context used to build student and linked-guardian views.
- Student assignment cards link to the signed submission file route when the student has an uploaded file.
- Guardian linked-student panels expose submitted-file links for linked students and do not surface unrelated classmates' submitted files.
- Course resource uploads compute SHA-256 hashes and can automatically quarantine configured denylist matches before the resource becomes downloadable.
- Admin resource review controls can update scan status, legal hold, quarantine notes, and retention expiry while recording the review in audit details.
- Remaining file work includes live wrong-role/wrong-tenant proof, bucket policy validation, external malware scanner integration, and retention cleanup automation.

## Evidence

- `npm test -- tests/lms-mutations.test.ts tests/lms-query-mapping.test.ts tests/lms-student-workspaces.test.tsx`: 13/13 passing on 2026-05-10.
- `npm test`: 28 files / 122 tests passing on 2026-05-10.
- `npm test -- tests/lms-auth.test.ts tests/pilot-auth.test.ts`: 16/16 passing on 2026-05-10 for real auth routing, one-click demo forms, route-handler local redirects, and proxy host preservation.
- `npm test -- tests/lms-audit-log-coverage.test.ts`: 3/3 passing on 2026-05-10.
- `npm test -- tests/lms-audit-review.test.tsx tests/lms-query-mapping.test.ts`: 5/5 passing on 2026-05-10 for audit read-model metadata, dashboard review UI, and admin-only CSV export route coverage.
- `npm test -- tests/fish-companion.test.ts`: 13/13 passing on 2026-05-10.
- `npm test -- tests/companion-server-xp.test.ts tests/fish-companion.test.ts`: 16/16 passing on 2026-05-10 for fish-only companion guardrails and server-side XP grants from real submission, feedback, present/online attendance, and textbook lesson-completion events.
- `npm test -- tests/lms-message-export.test.tsx tests/lms-messages.test.ts tests/lms-dashboards.test.tsx tests/prompt-artifact-checklist.test.ts`: 14/14 passing on 2026-05-10 for staff-only message CSV export, dashboard links, message workflows, dashboards, and launch checklist coverage.
- `npm test -- tests/lms-message-moderation.test.tsx tests/lms-message-export.test.tsx tests/lms-messages.test.ts tests/lms-query-mapping.test.ts tests/lms-dashboards.test.tsx tests/lms-audit-log-coverage.test.ts`: 21/21 passing on 2026-05-10 for staff-only message moderation controls, export/review, message workflows, query mapping, dashboards, and audit coverage.
- `npm test -- tests/lms-resource-review-dashboard.test.tsx tests/resource-security.test.ts tests/lms-query-mapping.test.ts tests/lms-dashboards.test.tsx tests/prompt-artifact-checklist.test.ts`: 16/16 passing on 2026-05-10 for resource quarantine/legal-hold/quota summary logic, admin dashboard queue UI, query mapping, access decisions, and checklist coverage.
- `npm test -- tests/resource-security.test.ts`: 8/8 passing on 2026-05-10 for upload hashing, SHA-256 denylist auto-quarantine, pending/clean scan policy, retention expiry, admin retention-date normalization, legal hold, and missing-review-table rollout handling.
- `npm test -- tests/resource-security.test.ts tests/lms-resource-review-dashboard.test.tsx tests/lms-audit-log-coverage.test.ts`: 13/13 passing on 2026-05-10 for retention expiry normalization, admin retention override UI, resource review queue UI, and direct resource-review audit coverage.
- `npm test -- tests/lms-messages.test.ts tests/lms-dashboards.test.tsx tests/lms-student-workspaces.test.tsx tests/lms-audit-log-coverage.test.ts`: 16/16 passing on 2026-05-10 for audited message writes, composer UI, route delegation, and policy artifact coverage.
- `npm test -- tests/lms-read-model.test.ts tests/lms-dashboards.test.tsx tests/lms-student-workspaces.test.tsx`: 14/14 passing on 2026-05-10 for role-scoped dashboards and message visibility filtering.
- `npm test -- tests/lms-course-sections.test.ts tests/lms-query-mapping.test.ts tests/lms-dashboards.test.tsx`: 10/10 passing on 2026-05-10 for course section/term normalization, admin UI, query mapping, exports, and migration coverage.
- `npm test -- tests/lms-invitations.test.ts tests/lms-audit-log-coverage.test.ts tests/lms-dashboards.test.tsx`: 9/9 passing on 2026-05-10 for direct invite normalization, route/form wiring, and audit-log coverage.
- `npm test -- tests/lms-invitations.test.ts tests/lms-audit-log-coverage.test.ts tests/lms-read-model.test.ts tests/lms-dashboards.test.tsx`: 16/16 passing on 2026-05-10 for membership deactivate/reactivate normalization, route/form wiring, audited actions, and inactive-student guardian/teacher filtering.
- `npm test -- tests/lms-invitations.test.ts tests/lms-audit-log-coverage.test.ts tests/lms-dashboards.test.tsx`: 11/11 passing on 2026-05-10 for membership role-change normalization, route/form wiring, audited action coverage, and admin dashboard controls.
- `npm test -- tests/lms-invitations.test.ts tests/lms-audit-log-coverage.test.ts tests/lms-dashboards.test.tsx`: 12/12 passing on 2026-05-10 for invite resend normalization, route/form wiring, Supabase admin user lookup, resend API wiring, audited action coverage, and admin dashboard controls.
- `npm test -- tests/lms-guardian-links.test.ts tests/lms-audit-log-coverage.test.ts tests/lms-dashboards.test.tsx`: 11/11 passing on 2026-05-10 for guardian-link normalization, admin read-model choices, guardian unlinking read model/form/route wiring, and audit-log coverage.
- `npm test -- tests/lms-guardian-links.test.ts tests/lms-query-mapping.test.ts tests/lms-audit-log-coverage.test.ts tests/lms-dashboards.test.tsx`: 14/14 passing on 2026-05-10 for guardian contact/consent normalization, query mapping, migration artifact, route/form wiring, and audit-log coverage.
- `npm test -- tests/lms-calendar-events.test.ts tests/lms-audit-log-coverage.test.ts tests/lms-query-mapping.test.ts tests/lms-dashboards.test.tsx`: 12/12 passing on 2026-05-10 for durable calendar event normalization, role calendars, admin/teacher forms, query mapping, migration artifact, route delegation, and audit-log coverage.
- `npm test -- tests/lms-gradebook-attendance.test.ts tests/lms-district-scale.test.ts tests/lms-dashboards.test.tsx tests/lms-student-workspaces.test.tsx`: 20/20 passing on 2026-05-10 for grade trends in read models, report cards, CSV exports, teacher dashboard, guardian dashboard, and student workspaces.
- `npm test -- tests/lms-student-workspaces.test.tsx tests/lms-dashboards.test.tsx`: 10/10 passing on 2026-05-10 for student and guardian submitted-file download affordances through the signed submission file route.
- `npm test`: 36 files / 159 tests passing on 2026-05-10 after the lesson-completion XP slice.
- `npm test -- tests/lms-read-model.test.ts tests/lms-resource-review-dashboard.test.tsx tests/fish-companion.test.ts`: 21/21 passing on 2026-05-10 for resource file-size read-model mapping, admin resource review queue UI, and fish-only companion guardrails.
- `npm run lint`, `npm run typecheck`, `npm audit --audit-level=moderate`, `git diff --check`, and `npm run build`: passing on 2026-05-10 after the lesson-completion XP slice.
- `npm run load:smoke`: passing on 2026-05-10 in 2954ms for 5000 students, 500 teachers, 1000 courses, and 50000 enrollments after the audited guardian-contact slice.
- Landing/login visual smoke passed on 2026-05-10 for desktop and mobile with no missing image alt text, unnamed buttons, or horizontal overflow.
- `LMS_SMOKE_MUTATE=1 npm run test:a11y`: passing locally on 2026-05-10 with student file attachment, teacher grading, admin writes, logout, and screenshots in `test-results/lms-smoke`.
- `LMS_SMOKE_BASE_URL=http://127.0.0.1:3010 npm run test:lms-smoke`: blocked after the staff message export slice because the smoke student reached `/login?error=lms-access-required` after sign-in before the dashboard rendered. The smoke harness checks export API links, Add event controls, and mutating calendar-event writes once active LMS smoke accounts/data are restored.
- Admin rendered QA fallback against `http://127.0.0.1:3010`: blocked on 2026-05-10 after the resource retention review slice because the admin smoke account reached `/login?error=lms-access-required` after sign-in before the dashboard rendered. Browser plugin runtime did not expose the required JavaScript browser-control tool, so repo Playwright was used.
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
