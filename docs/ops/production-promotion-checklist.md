# Production Promotion Checklist

Date: 2026-05-08

Use this checklist before promoting a school tenant from pilot/staging into production.

## Required Repo Gates

Run:

```bash
npm run launch:verify
npm run test:lms-smoke
npm run security:supabase
```

`npm run security:supabase` must run against the target Supabase project with `SUPABASE_DB_URL`, `DATABASE_URL`, `SUPABASE_DB_PASSWORD`, or `SUPABASE_ACCESS_TOKEN` plus `SUPABASE_PROJECT_REF`.

## Required Operator Gates

- Confirm the Vercel deployment URL and custom domain.
- Confirm the connected Supabase project ref and migration version.
- Apply all pending migrations, including companion profile persistence, course resource RLS hardening, resource security reviews, and companion profile versioning.
- Set the resource safety environment values for the customer: `COURSE_RESOURCE_TENANT_QUOTA_BYTES`, `COURSE_RESOURCE_COURSE_QUOTA_BYTES`, `COURSE_RESOURCE_RETENTION_DAYS`, `COURSE_RESOURCE_REQUIRE_CLEAN_SCAN`, and `COURSE_RESOURCE_SCAN_PROVIDER`.
- Run a backup and record the backup checksum.
- Run a restore drill into a disposable non-production database.
- Save restore evidence in the restore-drill evidence JSON format.
- Run `ENFORCE_REAL_OPS_EVIDENCE=1 RESTORE_DRILL_EVIDENCE_PATH=<path> npm run ops:evidence`.
- Confirm support escalation, incident commander, and privacy officer contacts.
- Confirm SSO/SIS status for the customer: disabled, configured, or scheduled.
- Confirm file storage policy: max file size, retention, malware scanning, and legal hold owner.

## Sales Boundary

Commercial single-school baseline is acceptable after repo gates and operator gates pass.

Large-district Canvas displacement claims still require named-customer SSO/SIS proof, formal load test evidence, WCAG audit evidence, restore drill evidence, and signed support/legal operating terms.
