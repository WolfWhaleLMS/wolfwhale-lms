<!--
  PR Agent Loop will auto-classify this PR into a risk tier based on the files changed.
  Do not remove the badge line below — it is updated automatically by the agent.
-->

**Risk Tier:** <!-- auto-detected: CRITICAL | HIGH | STANDARD | LOW -->

## What changed and why

<!-- One or two sentences. What problem does this solve? -->

## Evidence checklist

<!-- Complete the items that apply to your tier. The PR agent will enforce these. -->

- [ ] `npm run build` passes locally
- [ ] No TypeScript errors (`tsc --noEmit`)
- [ ] Affected flows tested manually (describe below)
- [ ] Supabase migration is additive / backward-compatible (if applicable)
- [ ] RLS policies reviewed (if touching auth, migrations, or data access)
- [ ] No secrets or `.env` values committed

**CRITICAL / HIGH tier only**
- [ ] Regression path tested end-to-end (auth, enrollment, billing, etc.)
- [ ] Rollback plan documented below

## Test plan

<!--
  Describe the exact steps you clicked through to verify this works.
  Example:
    1. Log in as a student
    2. Enroll in a course
    3. Confirmed enrollment row appears in Supabase dashboard
-->

1.
2.
3.

## Browser evidence (UI changes only)

<!--
  Paste a screenshot or screen recording here.
  Skip this section for backend-only changes.
-->

## Rollback plan (CRITICAL / HIGH tier only)

<!--
  How do we revert if this breaks production?
  Example: "Revert commit SHA. Migration is additive — no down migration needed."
-->

## Notes for reviewer

<!-- Anything the reviewer should know: trade-offs made, follow-up tickets, etc. -->
