# Operational LMS Backlog

Date: 2026-05-10

## P0: Serious Single-School Beta

- Auth and role routing: keep Supabase Auth, logout, safe redirects, role dashboards, and membership checks verified.
- School setup: admin creates school/course/section equivalents, enrolls users, links guardians, and imports roster/invites.
- Course operations: teacher creates course content, assignments, rubrics, resources, attendance, calendar events, messages, and grades.
- Student work: student views courses and submits text/files through private storage.
- Parent privacy: guardian sees only linked-child progress, feedback, attendance, calendar, messages, and teacher notes.
- Gradebook and reports: submissions update grades, missing-work counts, attendance summaries, and export/report views.
- Private files: storage buckets stay private; uploads are scoped, size/type limited, signed, reviewed, and auditable.
- Audit logs: important writes create durable audit rows.
- Pet rewards: XP and unlocks come from real learning events, not only manual demo buttons.
- Browser QA: login, all role dashboards, mobile, upload, grading, parent visibility, and logout pass.
- Security QA: RLS tests, storage policy tests, dependency audit, secret scan, and threat-model review pass.
- Launch docs: privacy, DPA, subprocessor, breach, retention, export, delete, correction, support, and restore docs exist; legal review and product automation remain open.

## P1: Paid Pilot Hardening

- One-click demo account buttons on login without exposing reusable passwords in broader app surfaces.
- Assignment submission file-download affordances for student and guardian views where policy allows. Initial signed-link affordances now render when the scoped submission row is visible.
- Admin user lifecycle: live RLS/deployed proof. Initial direct invites, invite resend, membership deactivate/reactivate, role changes, guardian linking/unlinking, guardian primary-contact/consent/custody details, and audit review/export now exist.
- Calendar lifecycle: edit/cancel events, add recurring events, event reminders, calendar feeds, and school-year/term views. Initial audited school/course event creation now exists.
- Teacher content modules: reorder modules, attach resources per module, publish/unpublish, and preview as student.
- Messaging controls: allowed role matrix admin settings, reporting, and retention policy controls. Initial staff message CSV export/review and staff moderation status controls now exist.
- Attendance reports: date-range filters, CSV/PDF export, absence trend flags, and guardian notes.
- Resource review UI: admin quarantine/legal-hold queue and quota summary now exist; malware scanner integration, retention override automation, and live policy proof remain.
- Companion XP integration: server-side XP grants for submission, grade feedback, and attendance check-ins now exist; lesson completion and quiz completion remain.
- Accessibility audit: keyboard-only flows, focus order, color contrast, reduced motion, form errors, and WCAG 2.2 target sizing.
- Monitoring: Sentry release health, alert routing, uptime checks, DB/storage error dashboards.

## P2: District And Enterprise Path

- SIS/OneRoster scheduled sync with conflict review and rollback.
- SSO/SAML/OIDC per tenant with delegated admin.
- LTI and external tool launch.
- Standards alignment, report cards, archival exports, analytics, and district dashboards.
- Background jobs for notifications, exports, file scans, and digest emails.
- Multi-region CDN/object-storage strategy and restore drill evidence.
- Load testing with target profiles for 10k concurrent users before enterprise concurrency claims.
- Native iOS, macOS, and Android clients against the same backend.

## Current Evidence Links

- Blueprint: `docs/product/wolfwhale-operational-lms-blueprint.md`
- Scorecard: `docs/audits/launch-readiness-scorecard.md`
- Threat model: `docs/security/threat-model.md`
- Launch blockers: `docs/roadmap/launch-blockers.md`
