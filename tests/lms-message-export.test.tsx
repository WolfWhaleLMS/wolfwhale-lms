import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { cleanup, render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdminDashboard } from '@/components/lms/AdminDashboard'
import { GuardianDashboard } from '@/components/lms/GuardianDashboard'
import { StudentDashboard } from '@/components/lms/StudentDashboard'
import { TeacherDashboard } from '@/components/lms/TeacherDashboard'
import { buildMessagesCsv } from '@/lib/lms/exports'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'

const repoRoot = path.resolve(__dirname, '..')

function sourceFor(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath)
  expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true)

  return readFileSync(absolutePath, 'utf8')
}

describe('LMS message review exports', () => {
  it('builds a CSV export for scoped message review', () => {
    const csv = buildMessagesCsv([
      {
        id: 'message-1',
        courseId: 'course-1',
        subject: 'Check-in, week 3',
        senderName: 'Tessa Teacher',
        content: 'Please review "Primary Source Pack" before class.',
        createdAt: '2026-05-07T16:03:00.000Z',
        moderationStatus: 'visible',
        moderationNote: '',
        moderatedBy: '',
        moderatedAt: '',
      },
    ])

    expect(csv).toContain('message_id,created_at,course_id,subject,sender_name,content')
    expect(csv).toContain('message-1,2026-05-07T16:03:00.000Z,course-1')
    expect(csv).toContain('"Check-in, week 3"')
    expect(csv).toContain('""Primary Source Pack""')
  })

  it('keeps the message export route staff-only and downloadable', () => {
    const routeSource = sourceFor('app/api/lms/exports/messages/route.ts')

    expect(routeSource).toContain('buildMessagesCsv')
    expect(routeSource).toContain("dashboard.role === 'admin'")
    expect(routeSource).toContain("dashboard.role === 'teacher'")
    expect(routeSource).toContain('message_export_not_allowed')
    expect(routeSource).toContain('wolfwhale-messages.csv')
  })

  it('shows message export links only on staff dashboards', () => {
    const views = buildLmsDashboardViews(createDemoLmsRecords())

    render(<AdminDashboard view={views.admin} />)
    expect(screen.getByRole('link', { name: /Export messages/ })).toHaveAttribute('href', '/api/lms/exports/messages')

    cleanup()

    render(<TeacherDashboard view={views.teacher} />)
    expect(screen.getByRole('link', { name: /Export messages/ })).toHaveAttribute('href', '/api/lms/exports/messages')

    cleanup()

    render(<StudentDashboard view={views.student} />)
    expect(screen.queryByRole('link', { name: /Export messages/ })).not.toBeInTheDocument()

    cleanup()

    render(<GuardianDashboard view={views.guardian} />)
    expect(screen.queryByRole('link', { name: /Export messages/ })).not.toBeInTheDocument()
  })
})
