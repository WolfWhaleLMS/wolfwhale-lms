# Student Record Rights, Retention, Export, Delete, And Correction Runbook

Date: 2026-05-10

Status: beta template. This is not legal advice; school record-retention schedules and applicable law control.

## Intake

Requests may come from a school administrator, student, parent/guardian, teacher, or legal/privacy contact. Open a ticket for every request and verify:

- Requester identity.
- Requester authority.
- Tenant/school.
- Student(s) or records in scope.
- Requested action: access/export, correction, deletion, retention hold, or objection.

## Export

- Preferred owner: school administrator.
- Export formats: CSV for gradebook/attendance, JSON for SIS-style records, files through signed private URLs or secure archive workflow.
- Required evidence: requester, export scope, generated file names, delivery method, expiration date, and audit log entry.

## Correction

- Corrections to grades, attendance, submissions, sections, or guardian links must be approved by the school role that owns the record.
- Preserve audit history of old value, new value, approver, and reason.
- Notify affected guardian/student only according to school instruction.

## Deletion

- Delete or anonymize only after school approval and retention/legal-hold check.
- Remove private storage objects, database rows, derived reports, and companion/event records when in scope.
- Record deletion job ID, records affected, storage paths affected, verification query, and approver.

## Retention

- Default beta posture: retain active school records for service delivery; apply school-specific retention schedule before contract launch.
- Course resource security reviews should track retention expiry and legal hold.
- Backups require a documented restore/delete limitation statement in the DPA.

## P0 Product Gaps

- Admin UI for export/delete/correction requests is not complete.
- Automated private-file archive and verified deletion job are not complete.
- Restore-drill evidence is still template-only.
- Live RLS matrix for wrong-child and wrong-tenant access is still pending.
