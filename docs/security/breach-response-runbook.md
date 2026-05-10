# Breach Response Runbook

Date: 2026-05-10

Status: beta template. This is not legal advice; notification obligations must be confirmed with counsel and customer contracts.

## Severity

- SEV-1: confirmed unauthorized access to student records, parent links, grades, submissions, attendance, messages, private files, credentials, or production secrets.
- SEV-2: credible suspected access or exposure requiring containment and forensic review.
- SEV-3: low-risk event with no evidence of student-record exposure.

## First Hour

1. Open an incident ticket and assign an incident commander.
2. Preserve logs and evidence; do not destroy affected resources.
3. Contain the issue: revoke keys, disable routes, suspend accounts, block storage paths, or roll back deployment as appropriate.
4. Identify affected tenant, roles, tables, files, and time window.
5. Notify internal privacy/security owner.

## Investigation Checklist

- Auth/session logs reviewed.
- Supabase audit/log evidence collected.
- Storage object paths reviewed.
- RLS/policy changes reviewed.
- Deployment diff and secret changes reviewed.
- Affected schools, students, guardians, and staff identified.
- Whether data was viewed, exported, modified, deleted, or exfiltrated is documented.

## Notification Draft Inputs

- What happened.
- What data categories were involved.
- Which school/customer is affected.
- When it happened and when it was discovered.
- What containment actions were taken.
- What customer actions are recommended.
- Contact point for follow-up.

## Closure

- Root cause documented.
- Customer-facing post-incident summary drafted where required.
- Corrective actions have owners and dates.
- Threat model, scorecard, and tests are updated before the incident is closed.
