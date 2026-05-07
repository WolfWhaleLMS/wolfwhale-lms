# Data Processing Checklist

Date: 2026-05-07

## Student Data Classes

WolfWhale processes:

- Account profile data
- Tenant membership and role data
- Courses, sections, and enrollments
- Assignments and submissions
- Grades, feedback, rubrics, and attendance
- Guardian links
- Messages, notifications, and resources
- Audit logs

## Launch Controls

- Supabase Auth is the identity source.
- Tenant memberships drive authorization.
- Protected role routes perform server-side membership checks.
- Supabase RLS is enabled on launch-sensitive school tables.
- Private resources are accessed through signed URL redirects.
- Anonymous table, function, and reviewed storage exposure checks pass on the connected Supabase project.
- Admin roster imports use server-only service role code.
- Support and incident contacts are documented in `.env.example`.

## Retention And Deletion

Before onboarding a real school, confirm:

- Contractual retention period.
- School data export contact.
- Deletion approval authority.
- Backup retention period.
- Legal hold process.
- Parent/student access request workflow.

## Customer Data Processing Packet

Provide customers:

- Privacy policy
- Terms of service
- Support runbook summary
- Incident response summary
- Data deletion request process
- Hosting region and subprocessors
- Backup and restore-drill evidence

## Pre-Sale Approval

Do not process production student data until:

- School signs the data-processing agreement.
- School confirms roster import authority.
- Support escalation contact is configured.
- Privacy officer contact is configured.
- Launch verification evidence is current.
