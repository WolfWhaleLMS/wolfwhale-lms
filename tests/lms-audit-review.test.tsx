import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdminDashboard } from '@/components/lms/AdminDashboard'
import { buildAuditLogCsv } from '@/lib/lms/exports'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'

const repoRoot = path.resolve(__dirname, '..')

function sourceFor(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath)
  expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true)

  return readFileSync(absolutePath, 'utf8')
}

describe('admin audit review and export', () => {
  it('builds a CSV audit export with actor, resource, and detail metadata', () => {
    const csv = buildAuditLogCsv([
      {
        id: 'audit-1',
        tenantId: 'tenant-1',
        userId: 'admin-1',
        action: 'grade.created',
        resourceType: 'grade',
        resourceId: 'grade-1',
        details: { course_id: 'course-1', note: 'Needs "care"', student_id: 'student-1' },
        createdAt: '2026-05-07T16:01:00.000Z',
      },
    ])

    expect(csv).toContain('audit_id,created_at,user_id,action,resource_type,resource_id,details')
    expect(csv).toContain('audit-1,2026-05-07T16:01:00.000Z,admin-1,grade.created,grade,grade-1')
    expect(csv).toContain('course_id')
    expect(csv).toContain('Needs')
    expect(csv).toContain('care')
  })

  it('keeps the audit export route admin-only and downloadable', () => {
    const routeSource = sourceFor('app/api/lms/exports/audit/route.ts')

    expect(routeSource).toContain('buildAuditLogCsv')
    expect(routeSource).toContain("dashboard.role !== 'admin'")
    expect(routeSource).toContain('audit_export_not_allowed')
    expect(routeSource).toContain('wolfwhale-audit-log.csv')
  })

  it('renders audit review metadata and export access on the admin dashboard', () => {
    const view = buildLmsDashboardViews(createDemoLmsRecords()).admin

    render(<AdminDashboard view={view} />)

    expect(screen.getByRole('link', { name: /Export audit log/ })).toHaveAttribute('href', '/api/lms/exports/audit')
    expect(screen.getByText('Audit review')).toBeInTheDocument()
    expect(screen.getByText(/Actor/)).toBeInTheDocument()
    expect(screen.getAllByText(/^Resource$/).length).toBeGreaterThan(0)
  })
})
