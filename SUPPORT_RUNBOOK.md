# Support Runbook

Date: 2026-05-07

## Support Tiers

P0:

- Student data exposure
- Authentication outage
- Cross-tenant data access
- Gradebook, attendance, or submission data loss
- Full app unavailable during school hours

P1:

- Role dashboard unavailable for one school
- Assignment submission or grading blocked
- Roster import blocked during onboarding
- Resource downloads unavailable

P2:

- Display defects
- Non-critical report or dashboard issue
- Documentation issue

## Response Targets

- P0: acknowledge within 15 minutes, active mitigation immediately.
- P1: acknowledge within 1 business hour, workaround or fix plan same day.
- P2: acknowledge within 1 business day.

## Required Contacts

Configure:

- `SUPPORT_ESCALATION_EMAIL`
- `INCIDENT_COMMANDER_EMAIL`
- `PRIVACY_OFFICER_EMAIL`

## First Response Checklist

1. Identify impacted tenant, roles, and routes.
2. Confirm whether student personal information or grades may be exposed.
3. Check current deployment health and recent changes.
4. Run `npm run security:supabase` if data exposure is suspected and DB access is available.
5. Run `npm run test:lms-smoke` against the impacted environment when browser access is available.
6. Preserve screenshots, logs, timestamps, and exact user reports.
7. Escalate P0 privacy/security issues to the privacy officer.

## Customer Update Cadence

- P0: every 30 minutes until mitigated.
- P1: every 2 business hours until workaround or fix is in place.
- P2: at status changes.

## Closeout

Every P0/P1 requires:

- Root cause
- Customer impact
- Data impact assessment
- Fix summary
- Preventive action
- Verification evidence
