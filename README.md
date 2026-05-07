# WolfWhale LMS

WolfWhale is a Next.js school LMS with Supabase Auth, PostgreSQL RLS, private resources, gradebook, attendance, rubrics, roster invitations, and role dashboards for students, teachers, admins, and guardians.

## Current Verified Scope

- School email/password login at `/login`.
- Protected dashboards at `/student`, `/teacher`, `/admin`, and `/guardian`.
- Supabase-backed tenant membership and role resolution.
- Courses, enrollments, assignments, submissions, weighted grades, rubrics, attendance, feedback, notifications, calendar items, messages, and resources.
- Admin course creation and student enrollment.
- Admin roster CSV import with Supabase Auth invitations.
- OneRoster bundle validation and SSO config validation.
- Admin SIS export package, gradebook CSV export, attendance CSV export, and report-card generation.
- District proof profile validation for SSO, SIS, load, legal/support evidence, and guarded restore drill command.
- Teacher assignment creation, grade posting, attendance marking, and rubric creation.
- Student text assignment submission.
- Student and guardian gradebook/attendance visibility scoped by role.
- Private course resources through signed Supabase Storage URLs.
- Single-school scale-budget validation.
- Enterprise readiness gate, synthetic load smoke, support runbook, incident runbook, and data-processing checklist.
- Supabase hardening migrations and launch-security validation script.
- Browser smoke across all four role dashboards.

## Enterprise-Parity Gaps

WolfWhale is ready as a commercial school LMS baseline. Do not claim proven large-district Canvas/Brightspace/Moodle displacement until the following are also built and verified:

- Customer-specific OneRoster/SIS sync, LTI, SSO/SAML/OIDC, password recovery policy, and delegated admin.
- Standards alignment, report cards, analytics, and archival exports.
- File upload UI, retention policy, virus scanning, and quota management.
- Messaging moderation, audit review, and communication policy controls.
- Load testing beyond the verified single-school envelope, full WCAG audit, restore-drill evidence, and support SLA.

## Tech Stack

- Next.js 16.2.5 App Router
- React 19
- TypeScript
- Tailwind CSS 4
- Supabase PostgreSQL/Auth/Storage
- Vitest
- Playwright smoke testing

## Setup

```bash
npm install
cp .env.example .env.local
```

Configure at least:

```bash
NEXT_PUBLIC_SUPABASE_URL='https://your-project.supabase.co'
NEXT_PUBLIC_SUPABASE_ANON_KEY='your-anon-key'
NEXT_PUBLIC_SITE_URL='http://localhost:3000'
CRON_SECRET='replace-with-a-long-random-secret'
```

Start local development:

```bash
npm run dev
```

Open `http://localhost:3000/login`.

## Verification

Run the launch gate:

```bash
npm run launch:verify
```

Run browser smoke:

```bash
npm run test:lms-smoke
```

Run the district-scale gate:

```bash
npm run district:verify
```

Run the district proof profile:

```bash
npm run district:proof
```

Run the enterprise readiness gate:

```bash
npm run enterprise:check
```

Run the scale-budget gate:

```bash
npm run scale:check
```

Run the synthetic load smoke:

```bash
npm run load:smoke
```

Run Supabase launch-security validation when a direct database URL is available:

```bash
SUPABASE_DB_URL='postgresql://...' npm run security:supabase
```

Run dependency audit:

```bash
npm audit --audit-level=moderate
```

Run a backup:

```bash
SUPABASE_DB_URL='postgresql://...' npm run db:backup
```

Run a guarded restore drill against a disposable non-production database:

```bash
RESTORE_DRILL_CONFIRM=restore-non-production \
RESTORE_DRILL_DB_URL='postgresql://localhost:5432/wolfwhale_restore_drill' \
BACKUP_FILE='backups/wolfwhale-example.dump' \
npm run db:restore-drill
```

## Key Files

- `AUDIT_REPORT.md`
- `LAUNCH_BLOCKERS.md`
- `FIX_LOG.md`
- `TEST_EVIDENCE.md`
- `SCHOOL_LAUNCH_READINESS_ROADMAP.md`
- `lib/lms/auth.ts`
- `lib/lms/queries.ts`
- `lib/lms/read-model.ts`
- `lib/lms/mutations.ts`
- `lib/lms/server.ts`
- `components/lms`
- `scripts/lms-browser-smoke.ts`
- `scripts/check-supabase-launch-security.ts`
- `scripts/backup-db.sh`
- `scripts/restore-drill.sh`
- `supabase/migrations`
