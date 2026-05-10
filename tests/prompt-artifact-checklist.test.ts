import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(__dirname, '..')
const checklistPath = path.join(repoRoot, 'docs/audits/prompt-to-artifact-checklist.md')

function readChecklist() {
  return readFileSync(checklistPath, 'utf8')
}

describe('prompt-to-artifact launch checklist', () => {
  it('exists and references every named launch document from the active objective', () => {
    expect(existsSync(checklistPath)).toBe(true)
    const checklist = readChecklist()

    for (const file of [
      'docs/product/wolfwhale-operational-lms-blueprint.md',
      'docs/product/operational-lms-backlog.md',
      'docs/audits/launch-readiness-scorecard.md',
      'docs/security/threat-model.md',
      'docs/roadmap/launch-blockers.md',
    ]) {
      expect(checklist).toContain(file)
      expect(existsSync(path.join(repoRoot, file))).toBe(true)
    }
  })

  it('maps the 14 required P0 LMS flows to evidence and status', () => {
    const checklist = readChecklist()

    for (const phrase of [
      '1. One-click demo accounts',
      '2. Real sign-in/sign-out',
      '3. Admin creates school/course/section',
      '4. Teacher creates course content and assignments',
      '5. Student submits text and files',
      '6. Teacher grades with feedback/rubric',
      '7. Parent sees only linked child',
      '8. Gradebook updates',
      '9. Calendar shows',
      '10. Attendance can be recorded',
      '11. Messaging works',
      '12. Reports summarize',
      '13. File uploads are private',
      '14. Pets gain XP',
    ]) {
      expect(checklist).toContain(phrase)
    }

    expect(checklist).toContain('Partial')
    expect(checklist).toContain('Pending live apply')
  })

  it('tracks blocked launch gates that cannot be satisfied by local tests alone', () => {
    const checklist = readChecklist().toLowerCase()

    for (const blocker of [
      'live supabase launch-security checks',
      'teacher signed-file download',
      'wrong-child/wrong-tenant',
      'counsel and customer review',
      '10k-concurrent',
      'deployed smoke',
    ]) {
      expect(checklist).toContain(blocker)
    }
  })
})
