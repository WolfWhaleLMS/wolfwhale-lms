# Subprocessor Register

Date: 2026-05-10

Status: placeholder register. Confirm actual deployed vendors, regions, and contract terms before launch.

| Subprocessor | Purpose | Data Potentially Processed | Region/Data Residency To Confirm | Beta Status |
| --- | --- | --- | --- | --- |
| Supabase | Auth, Postgres, private storage, backups | account data, student records, submissions, files, audit logs | Project region and backup region must be confirmed | Required |
| Vercel | Web hosting, CDN, serverless execution, logs | request metadata and server-rendered app traffic | Deployment/log regions must be confirmed | Required |
| Sentry | Error monitoring | error context, stack traces, limited user/session metadata if enabled | Region and scrubbing config must be confirmed | Planned/optional |
| Resend | Transactional email | recipient email, message metadata, invite/support content | Region and message retention must be confirmed | Planned/optional |
| Upstash | Rate limiting/Redis if enabled | request keys, route metadata, rate-limit counters | Region and key hashing must be confirmed | Planned/optional |

## Required Operating Rules

- Keep this register public or customer-available before contracting.
- Add notification procedure for material subprocessor changes.
- Disable optional subprocessors unless there is a launch owner and data-minimization config.
- Never place raw student submission files, grades, or messages in monitoring/email logs unless required for support and approved by school instruction.
