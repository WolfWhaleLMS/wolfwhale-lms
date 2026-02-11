# Wolf Whale LMS - Claude Code Guidelines

## Project Overview

- **Stack**: Next.js 16 (Turbopack), Supabase, Tailwind CSS, Sentry, Stripe
- **Repo**: `WolfWhaleLMS/wolfwhale-lms` on GitHub
- **Deploy**: Push to `main` triggers production deployment

## Vibe Coding Workflow (YC Guidelines)

### Planning

- Start features with a detailed implementation plan in markdown
- Review and trim unnecessary items; mark complex features as "won't do" or "later"
- Keep a separate section for future ideas to maintain focus
- Implement section by section, not all at once
- Mark sections complete after successful implementation

### Version Control

- Use Git religiously - don't rely solely on AI revert functionality
- Start each new feature with a clean Git slate
- Use `git reset --hard HEAD` if implementation goes off track
- Avoid layering failed attempts - reset and implement cleanly when a solution is found
- Commit each working section before moving to the next

### Testing

- Prioritize end-to-end integration tests over unit tests
- Test by simulating user behavior (clicking through the app)
- Always test before proceeding to the next feature - LLMs often change unrelated logic
- Use tests as guardrails; consider starting with test cases for clear boundaries

### Bug Fixing

- Copy-paste error messages directly - often enough for diagnosis
- Analyze multiple possible causes before writing code
- Reset after failed fix attempts; implement the fix on a clean codebase
- Add strategic logging to understand runtime behavior
- Try different AI models when one gets stuck

### Design Philosophy

- For each proposed change, examine the existing system and redesign it into the most elegant solution that would have emerged if the change had been a foundational assumption from the start

### Code Quality

- Keep files small and modular - easier for both humans and AI
- Don't have files thousands of lines long
- Service-based architecture with clear boundaries over monolith
- Refactor regularly once tests are in place
- Avoid cumulative bad code from multiple failed attempts

### AI Collaboration

- This CLAUDE.md file is the primary instruction set
- Download relevant docs locally for accuracy when needed
- Use screenshots to share UI bugs or design inspiration
- Ask AI to explain implementations line by line when learning
- Compare multiple solution approaches and pick the best one

## Project Conventions

- Build must pass (`npm run build`) before any push to `main`
- Use Lucide icons (no emoji) in dashboard UI for professional feel
- Role-scoped theming: student=purple, teacher=rose, admin=blue-gray, parent=green
- Supabase migrations go in `supabase/migrations/` with timestamp prefixes
- Server actions go in `app/actions/`
- Shared components in `components/`, organized by domain (layout, auth, course, etc.)
