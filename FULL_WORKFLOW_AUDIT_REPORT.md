# Full LMS Workflow Audit Report

Audit date: 2026-05-08

Target surfaces:

- Production: `https://wolfwhale.ca`
- Local fallback: `http://localhost:3000`

Audit method:

- Four parallel subagents tested isolated role/cross-cutting browser sessions.
- Existing Playwright smoke coverage was reviewed as the baseline regression gate.
- Confirmed defects are tracked below with severity, repro, fix status, and verification.

## Findings

### P2: Teacher Mobile Dashboard Horizontal Overflow

Status: confirmed, fix in progress.

Surface: `https://wolfwhale.ca/teacher`

Repro:

1. Open `https://wolfwhale.ca/login?next=%2Fteacher` at `390x844`.
2. Log in as `teacher@wolfwhale.ca`.
3. Land on `/teacher`.
4. Observe horizontal page scroll.

Evidence:

- `documentElement.scrollWidth = 550`
- `clientWidth = 390`
- Subagent isolated the likely source to Attendance/Rubrics form controls.

Screenshots:

- `test-results/subagent-teacher/03-mobile-dashboard.png`
- `test-results/subagent-teacher/04-mobile-overflow-top.png`

### P1: Gradebook/Risk Data Contradicts Visible Grades

Status: confirmed, fix in progress.

Surface: `https://wolfwhale.ca/guardian`, `https://wolfwhale.ca/api/lms/exports/gradebook`

Repro:

1. Log in as `parent@wolfwhale.ca`.
2. Open `/guardian`.
3. Review linked student grade list and gradebook.

Evidence:

- Assignment grade list shows scores such as `95/100` and `91/100`.
- Gradebook/export showed graded courses as `0% F` and high risk.
- Likely cause: gradebook weighted summary only used assignments whose category matched the course grading policy, with no fallback for legacy/demo categories.

### P1: Companion Profile API 500s When Live Migration Is Missing

Status: confirmed, fix in progress.

Surface: `https://wolfwhale.ca/api/companion/profile`

Repro:

1. Log in as `student@wolfwhale.ca`.
2. Open `/api/companion/profile`.

Evidence:

- API returned `500`.
- Message: `Could not find the table 'public.student_companion_profiles' in the schema cache`.
- The route needs to fail soft to local companion fallback until the live Supabase migration is applied.

### P2: Admin Audit Trail Is Unbounded

Status: confirmed, fix in progress.

Surface: `https://wolfwhale.ca/admin`

Evidence:

- Audit trail rendered 159 list items.
- Panel height measured 7376px in a 1000px viewport.

### P2: Calendar Displays Raw ISO Timestamps

Status: confirmed, fix in progress.

Surface: `https://wolfwhale.ca/guardian#calendar`

Evidence:

- Dates rendered like `2026-01-27T03:57:40.7+00:00`.

### P2: Enroll-Student Dropdown Has Ambiguous Duplicate Labels

Status: confirmed, fix in progress.

Surface: `https://wolfwhale.ca/admin#enroll-student`

Evidence:

- Multiple `Workflow Student` options appear without email/grade/id disambiguation.

### P2: Admin Mobile Dashboard Slight Horizontal Overflow

Status: confirmed, likely covered by shared dashboard form width fix.

Surface: `https://wolfwhale.ca/admin`

Evidence:

- `documentElement.scrollWidth = 397`, `clientWidth = 390`.

### P2: Assignment Submission Has No Visible Success Confirmation

Status: confirmed, fix in progress.

Surface: `https://wolfwhale.ca/student/assignments#submit-work`

Repro:

1. Log in as `student@wolfwhale.ca`.
2. Open `/student/assignments#submit-work`.
3. Submit work.
4. App redirects to `/student?saved=submission` but shows no visible confirmation.

### P2: Alternate `/student/dashboard` Is Stale

Status: confirmed, fix in progress.

Surface: `https://wolfwhale.ca/student/dashboard`

Evidence:

- Shows stale empty data while `/student/courses` shows enrolled courses.
- Contains broken links to `/student/study-mode`, `/messaging`, `/calendar`, and `/student/leaderboard`.

## Fixes Applied

- Teacher/admin mobile overflow: added shared LMS dashboard min-width/field-width constraints and panel min-width guards.
- Gradebook/risk P1: added fallback grade percentage calculation from points/max points when stored `percentage` is zero and no grading-policy category matches legacy assignments.
- Gradebook missing-work counts: changed missing-work risk to count only past-due ungraded assignments instead of every future assigned item.
- Companion API P1: added missing-table detection so live environments without `student_companion_profiles` return local-fallback JSON instead of 500.
- Login rate-limit feedback: added visible `rate-limited` message on `/login`.
- Admin audit trail: capped visible audit rows to latest 25 with a scrollable panel and count summary.
- Calendar timestamps: formatted LMS calendar dates into readable local date/time labels.
- Admin enrollment dropdown: disambiguated duplicate student/teacher names with user ID prefixes.
- Student submission confirmation: added visible `/student?saved=submission` success message.
- Stale `/student/dashboard`: replaced old page with redirect to `/student` and removed orphaned old dashboard files.

## Verification

- `npm run lint` passed.
- `npm run typecheck` passed.
- `npm test` passed: 22 files / 93 tests.
- `npm audit --omit=dev --audit-level=high` passed: 0 vulnerabilities.
- `npm run build` passed and generated 293 static pages.
- `npm run test:a11y` passed against local `http://localhost:3000`.
- Local 390px teacher width check after the fix measured `scrollWidth=390`, `clientWidth=390`.
