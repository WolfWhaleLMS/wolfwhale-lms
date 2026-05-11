# WolfWhale LMS Threat Model

Date: 2026-05-10

This is an engineering threat model for student-record software. It is not legal advice.

## Assets

- Student education records: assignments, submissions, grades, feedback, attendance, messages, notes, companion progress, and files.
- Parent-child relationship records.
- Teacher/admin operational records.
- Tenant membership and role data.
- Private Supabase Storage objects.
- Audit logs, exports, restore artifacts, and support evidence.
- Supabase service-role credentials, database credentials, SSO/SIS credentials, and deployment secrets.

## Actors

- Student
- Parent/guardian
- Teacher
- School admin
- Super admin/operator
- Unauthenticated internet user
- Authenticated user in the wrong tenant or role
- Compromised browser/session
- Malicious file uploader
- Third-party infrastructure or integration provider

## Trust Boundaries

- Browser to Next.js route handlers.
- Route handlers to Supabase Auth/Postgres/Storage.
- Supabase authenticated client versus service-role client.
- Tenant boundary inside shared database tables.
- Parent-child link boundary.
- Private storage object boundary.
- Production versus demo/pilot data.
- Future SIS/SSO/LTI integrations.

## High-Risk Abuse Cases

- Student reads another student's submissions, grades, attendance, messages, or files.
- Parent reads an unlinked child's records.
- Teacher reads or modifies courses outside their assignment.
- Admin crosses tenant boundaries.
- Client-supplied role state bypasses server authorization.
- Storage object path guessing yields private files.
- Public bucket or anonymous Data API grant exposes school data.
- Service-role key leaks into browser bundle or logs.
- File upload accepts malware, active HTML, oversized files, or unreviewed public access.
- Messaging enables unauthorized contact or record disclosure.
- Demo data contaminates live school records.
- Missing audit logs hide important writes.

## Current Controls

- Supabase Auth SSR session handling.
- Server-side membership and role checks before dashboards and mutation paths.
- Supabase RLS on core LMS tables.
- Private storage buckets with signed access routes.
- File type/size allowlists for course resources and student submission files.
- SHA-256 denylist auto-quarantine for known bad course resource uploads.
- Admin resource review queue for scan status, legal hold, quarantine notes, and quota usage.
- Audit logs for core mutations, roster imports, and admin resource-review updates.
- Staff-only message export and moderation status controls with audited `message.moderated` events.
- Rate limiting for auth and LMS mutation endpoints.
- Tests for auth redirect safety, LMS mutations, read-model mapping, role surfaces, resource security, and launch security invariants.

## Current Gaps To Close

- Fresh repository-wide Codex Security scan after current changes.
- Live Supabase validation after applying the new submission-file storage migration.
- Full RLS test matrix for student/teacher/admin/guardian cross-tenant and cross-child denial cases.
- Malware scanning and quarantine worker for uploaded files.
- Live audit-row insertion proof after target Supabase migrations are applied.
- Live application and RLS validation for message moderation columns and staff-only moderation routes.
- Secret scan and dependency audit in the current branch.
- Formal privacy/compliance review for FERPA, COPPA, PPRA, PIPEDA, BC/Canadian school expectations, and retention/deletion workflows.

## Security Requirements For New Work

- Never authorize from client role state.
- Every write route must verify authenticated user, active tenant membership, allowed role, and object ownership/relationship.
- Parent access must always be derived from `student_parents` or its successor, not from request input.
- Storage objects must be private, tenant scoped, user/course scoped, size/type limited, and accessed through signed routes or strict RLS.
- Important writes must create audit logs with actor, tenant, resource type, resource id, and material details.
- New public-schema tables exposed to Supabase Data API must have explicit grants reviewed and RLS enabled.
- Security-definer functions must stay out of exposed schemas unless explicitly reviewed.
