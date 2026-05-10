# Privacy Launch Readiness Packet

Date: 2026-05-10

Status: template packet for beta readiness. This is not legal advice and must be reviewed by qualified counsel and the contracting school before paid launch.

## Scope

WolfWhale LMS handles student records, guardian links, teacher-created content, attendance, grades, messages, audit logs, and private uploaded files. Launch readiness requires a written operating packet before a serious school beta.

## Required Artifacts

| Artifact | File | Beta Status |
| --- | --- | --- |
| Public privacy policy | `app/privacy/page.tsx` | Exists; needs counsel review against actual hosting, subprocessors, and school contract terms. |
| Data Processing Addendum template | `docs/security/data-processing-addendum-template.md` | Template added; not contract-ready. |
| Subprocessor register | `docs/security/subprocessor-register.md` | Template added; vendor list needs owner confirmation. |
| Breach/incident response runbook | `docs/security/breach-response-runbook.md` | Template added; needs named incident owner and notification clock. |
| Retention/export/delete/correction runbook | `docs/security/student-record-rights-runbook.md` | Template added; needs product automation and school-specific retention schedules. |
| Threat model | `docs/security/threat-model.md` | Exists; must be rerun after live RLS validation. |
| Launch scorecard | `docs/audits/launch-readiness-scorecard.md` | Updated with current evidence and blockers. |

## Beta Privacy Gates

- No student or parent account is created without a school-controlled onboarding path.
- Parent portal access is limited to linked children only.
- File buckets are private, signed, scoped, size/type limited, and auditable.
- Important writes create audit logs.
- School export/delete/correction requests have an owner, ticket trail, and verification checklist.
- Any legal claims for FERPA, COPPA, PPRA, PIPEDA, BC FIPPA, or other provincial expectations are reviewed before being used in sales.

## Known Gaps

- Live Supabase RLS validation is blocked until DB/read credentials are available.
- The new assigned-teacher submission RLS migration must be applied before the stricter signed-file browser smoke can pass.
- Subprocessor locations, data residency guarantees, and contractual terms need confirmation from deployed infrastructure settings.
