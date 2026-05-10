import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { normalizeCourseDraft } from '@/lib/lms/mutations'

const repoRoot = path.resolve(__dirname, '..')

function sourceFor(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath)
  expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true)

  return readFileSync(absolutePath, 'utf8')
}

function migrationSources() {
  const dir = path.join(repoRoot, 'supabase/migrations')

  return readdirSync(dir)
    .filter((file) => file.endsWith('.sql'))
    .map((file) => readFileSync(path.join(dir, file), 'utf8'))
    .join('\n')
}

describe('LMS course section setup', () => {
  it('normalizes course section and term labels for admin setup', () => {
    expect(
      normalizeCourseDraft({
        name: '  Grade 8 Humanities  ',
        subject: ' Humanities ',
        gradeLevel: ' 8 ',
        sectionLabel: ' 8A ',
        termLabel: ' Spring 2026 ',
        description: '  Primary source skills. ',
      })
    ).toEqual({
      name: 'Grade 8 Humanities',
      subject: 'Humanities',
      gradeLevel: '8',
      sectionLabel: '8A',
      termLabel: 'Spring 2026',
      description: 'Primary source skills.',
    })
  })

  it('keeps the admin create-course route and dashboard form wired for sections', () => {
    const routeSource = sourceFor('app/api/lms/courses/route.ts')
    const dashboardSource = sourceFor('components/lms/AdminDashboard.tsx')
    const mutationSource = sourceFor('lib/lms/mutations.ts')

    expect(routeSource).toContain("sectionLabel: formData.get('sectionLabel')")
    expect(routeSource).toContain("termLabel: formData.get('termLabel')")
    expect(dashboardSource).toContain('name="sectionLabel"')
    expect(dashboardSource).toContain('name="termLabel"')
    expect(mutationSource).toContain('section_label')
    expect(mutationSource).toContain('semester')
  })

  it('maps and exports course section metadata from Supabase rows', () => {
    const querySource = sourceFor('lib/lms/queries.ts')
    const exportSource = sourceFor('lib/lms/exports.ts')

    expect(querySource).toContain('section_label')
    expect(querySource).toContain('semester')
    expect(querySource).toContain('sectionLabel')
    expect(querySource).toContain('termLabel')
    expect(exportSource).toContain('section_label')
    expect(exportSource).toContain('term_label')
  })

  it('ships a migration for durable course section metadata', () => {
    const migrations = migrationSources()

    expect(migrations).toContain('ADD COLUMN IF NOT EXISTS section_label')
    expect(migrations).toContain('idx_courses_tenant_section')
  })
})
