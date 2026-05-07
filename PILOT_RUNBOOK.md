# Pilot Runbook

Date: 2026-05-07

## Scope

This runbook launches the controlled WolfWhale school pilot. It does not authorize unrestricted production use with real student records.

## Environment

Required local or deployment variables:

```bash
PILOT_ACCESS_CODE='replace-with-school-pilot-access-code'
PILOT_SESSION_SECRET='replace-with-a-different-long-random-session-secret'
NEXT_PUBLIC_SITE_URL='http://localhost:3000'
CRON_SECRET='replace-with-a-long-random-secret'
```

Required for live Supabase security validation:

```bash
SUPABASE_DB_URL='postgresql://...'
```

The connected Supabase project `yhxesebykwhlpsmxxiqo` was also validated through the Supabase connector after applying launch hardening.

## Local Launch

```bash
npm install
PILOT_ACCESS_CODE=launch-tomorrow \
PILOT_SESSION_SECRET=test-session-secret-with-enough-length \
npm run dev
```

Open `http://localhost:3000/login`.

Pilot roles:

- `student`
- `teacher`
- `admin`
- `guardian`

Use the configured pilot access code for each role.

## Verification

Run the repo-local gate:

```bash
npm run launch:verify
```

Run the browser smoke:

```bash
PILOT_ACCESS_CODE=launch-tomorrow \
PILOT_SESSION_SECRET=test-session-secret-with-enough-length \
npm run test:pilot-smoke
```

Run dependency audit:

```bash
npm audit --audit-level=moderate
```

Run live Supabase launch-security validation when a DB URL is available:

```bash
SUPABASE_DB_URL='postgresql://...' npm run security:supabase
```

The Supabase command must return zero rows for every launch-security check before real student data is allowed.

Current connected-project validation result:

- 0 anonymous sensitive table grants.
- 0 anonymous public function grants.
- 0 authenticated high-risk security-definer RPC grants.
- 0 risky launch views.
- 0 risky reviewed storage bucket exposures.

## Pilot Workflow

1. Sign in as `student`.
2. Open the current assignment.
3. Submit or update the reflection response.
4. Sign in as `teacher`.
5. Review the student submission.
6. Enter a score from 0 to 10 and feedback.
7. Sign in as `student` and confirm score/feedback.
8. Sign in as `guardian` and confirm only the linked student's progress is visible.
9. Sign in as `admin` and review school, users, course, enrollments, and launch checks.

## Rollback

For local pilot state:

- Restart the dev server to clear runtime pilot state.

For deployment:

- Disable or rotate `PILOT_ACCESS_CODE`.
- Redeploy the previous known-good build.
- Keep `/student`, `/teacher`, `/admin`, and `/guardian` behind the pilot gate until production auth is ready.

For Supabase migrations:

- Do not apply production migrations without a staging pass.
- If a migration blocks required access, revert during an approved maintenance window using a reviewed SQL rollback.

## Support

Before using real school accounts, assign:

- Pilot owner.
- School contact.
- Technical incident owner.
- Parent/guardian support contact.
- Data privacy owner.

Escalate immediately if any user sees another student's data, if unauthenticated access reaches a role route, or if Supabase validation returns risky rows after hardening.
