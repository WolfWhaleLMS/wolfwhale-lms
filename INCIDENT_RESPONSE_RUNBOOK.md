# Incident Response Runbook

Date: 2026-05-07

## Severity

SEV-1:

- Confirmed or suspected student data exposure
- Unauthorized role or tenant access
- Production database corruption or destructive migration
- Authentication unavailable for a school day launch

SEV-2:

- LMS workflow outage for a tenant
- Roster import failure during onboarding
- Grade posting, submission, attendance, or resource download outage

SEV-3:

- Non-critical degraded performance
- Isolated UI defect

## SEV-1 Procedure

1. Assign incident commander from `INCIDENT_COMMANDER_EMAIL`.
2. Freeze non-essential deploys.
3. Preserve logs, screenshots, affected routes, impacted users, and timestamps.
4. Run live Supabase security checks through `npm run security:supabase` or the Supabase MCP SQL checks.
5. Disable affected routes or revoke affected policies if exposure is ongoing.
6. Notify privacy owner from `PRIVACY_OFFICER_EMAIL`.
7. Prepare customer notice with known facts only.
8. Produce incident closeout before resuming normal launch claims.

## Database Emergency Checklist

- Confirm latest backup location.
- Do not restore into production.
- Run restore only with `RESTORE_DRILL_CONFIRM=restore-non-production`.
- Validate restored data in a disposable database.
- Document restore duration, failure points, and checksum or spot-check evidence.

## Security Verification Commands

```bash
npm run security:supabase
npm run test:lms-smoke
npm run launch:verify
```

## Post-Incident Report

Include:

- Timeline
- Detection source
- Root cause
- Affected tenants
- Affected data classes
- Containment action
- Recovery action
- Preventive controls
- Verification evidence
