# Enterprise Launch Readiness

Date: 2026-05-07

## Verified Scope

WolfWhale is verified for the current district proof envelope:

- 5000 active students
- 500 active teachers
- 1000 active courses
- 50000 active enrollments

`npm run scale:check` enforces the guardrail. `npm run load:smoke` builds synthetic LMS records and verifies role dashboard read-model generation inside the configured time budget. `npm run district:proof` validates the district profile contract.

## Identity Readiness

Current production-ready identity path:

- Supabase Auth email/password
- SSR session refresh through Next proxy
- Role routing from tenant memberships
- Admin roster invitation flow through server-only Supabase service role

Enterprise SSO contract is documented in `.env.example`:

- `SSO_PROVIDER_TYPE`
- `OIDC_ISSUER`
- `OIDC_CLIENT_ID`
- `OIDC_CLIENT_SECRET`
- `SAML_METADATA_URL`
- `SAML_ENTITY_ID`
- `SAML_ACS_URL`

SSO can be sold as an implementation track, not as already configured for every customer tenant.

## SIS And Rostering

Implemented now:

- Admin CSV roster import
- Validated roles: student, teacher, parent, admin, super_admin
- Supabase Auth invitations
- Profile and tenant membership upserts
- Audit log entry for roster imports

Enterprise SIS contract is documented in `.env.example`:

- `ONEROSTER_IMPORT_MODE`
- `ONEROSTER_SFTP_HOST`
- `ONEROSTER_SFTP_USERNAME`
- `ONEROSTER_SFTP_PRIVATE_KEY_PATH`

For tomorrow launch, use CSV imports or validated OneRoster bundles. For district replacement deals, connect the district's live OneRoster/SFTP source as the customer-specific implementation milestone.

## Security Evidence

Live Supabase MCP validation against project `yhxesebykwhlpsmxxiqo` returned zero failing rows for:

- anon sensitive table select
- anon public function execute
- authenticated high-risk security-definer RPC execute
- public storage bucket listing
- security-invoker view configuration

Local `npm run launch:verify` also runs the same direct DB security script when `SUPABASE_DB_URL` or `DATABASE_URL` is available.

## Operations Evidence

Implemented:

- `npm run db:backup`
- `npm run db:restore-drill`
- `npm run security:supabase`
- `npm run scale:check`
- `npm run load:smoke`
- `npm run district:proof`
- `npm run district:verify`
- `npm run test:a11y`
- `npm run test:lms-smoke`

Restore drills are intentionally guarded by `RESTORE_DRILL_CONFIRM=restore-non-production` and require a disposable non-production database URL.

## Sales Boundary

Safe claim:

> WolfWhale is a commercial school LMS baseline with real role dashboards, gradebook, attendance, rubrics, roster invitations, private resources, and hardened Supabase data access.

Do not claim:

> Proven full Canvas replacement for large districts.

That claim requires a named district-scale SSO/SIS integration, formal load test report, signed support SLA, completed restore drill, and formal WCAG audit.
