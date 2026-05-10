import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(__dirname, '..')

const requiredDocs = [
  'docs/security/privacy-launch-readiness.md',
  'docs/security/data-processing-addendum-template.md',
  'docs/security/subprocessor-register.md',
  'docs/security/breach-response-runbook.md',
  'docs/security/student-record-rights-runbook.md',
] as const

describe('privacy launch documentation packet', () => {
  it('keeps the beta privacy placeholders in the repo', () => {
    for (const doc of requiredDocs) {
      expect(existsSync(path.join(repoRoot, doc)), doc).toBe(true)
    }
  })

  it('marks the packet as counsel-review required and covers named launch workflows', () => {
    const packet = requiredDocs.map((doc) => readFileSync(path.join(repoRoot, doc), 'utf8')).join('\n').toLowerCase()

    expect(packet).toContain('not legal advice')
    expect(packet).toContain('data processing addendum')
    expect(packet).toContain('subprocessor')
    expect(packet).toContain('breach')
    expect(packet).toContain('retention')
    expect(packet).toContain('export')
    expect(packet).toContain('deletion')
    expect(packet).toContain('correction')
    expect(packet).toContain('ferpa')
    expect(packet).toContain('coppa')
    expect(packet).toContain('pipeda')
  })
})
