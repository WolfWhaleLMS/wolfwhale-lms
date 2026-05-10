import { existsSync, readFileSync, readdirSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'

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

describe('LMS calendar events', () => {
  it('normalizes event drafts before writing school calendar rows', async () => {
    const modulePath = '@/lib/lms/calendar-events'
    const { normalizeCalendarEventDraft } = await import(modulePath)

    expect(
      normalizeCalendarEventDraft({
        courseId: ' course-1 ',
        title: '  Field trip  ',
        description: '  Museum visit. ',
        startsAt: '2026-06-02T09:30:00.000Z',
        endsAt: '2026-06-02T14:30:00.000Z',
      })
    ).toMatchObject({
      courseId: 'course-1',
      title: 'Field trip',
      description: 'Museum visit.',
      startsAt: '2026-06-02T09:30:00.000Z',
      endsAt: '2026-06-02T14:30:00.000Z',
    })
  })

  it('includes durable calendar events in role dashboard calendars', () => {
    const records = createDemoLmsRecords()
    records.calendarEvents.push({
      id: 'event-1',
      tenantId: records.tenant.id,
      courseId: '',
      title: 'Spring learning showcase',
      description: 'Families visit student portfolios.',
      startsAt: '2026-06-04T18:00:00.000Z',
      endsAt: '2026-06-04T20:00:00.000Z',
      status: 'published',
      createdBy: records.actorIds.admin,
    })

    const views = buildLmsDashboardViews(records)

    expect(views.admin.calendar.map((item) => item.title)).toContain('Spring learning showcase')
    expect(views.teacher.calendar.map((item) => item.title)).toContain('Spring learning showcase')
    expect(views.student.calendar.map((item) => item.title)).toContain('Spring learning showcase')
    expect(views.guardian.calendar.map((item) => item.title)).toContain('Spring learning showcase')
  })

  it('wires teacher/admin calendar forms, route, query mapping, and migration', () => {
    const sharedPanelsSource = sourceFor('components/lms/SharedLmsPanels.tsx')
    const routeSource = sourceFor('app/api/lms/calendar-events/route.ts')
    const querySource = sourceFor('lib/lms/queries.ts')
    const migrationSource = migrationSources()

    expect(sharedPanelsSource).toContain('action="/api/lms/calendar-events"')
    expect(sharedPanelsSource).toContain('name="startsAt"')
    expect(routeSource).toContain('createCalendarEvent')
    expect(querySource).toContain('calendar_events')
    expect(migrationSource).toContain('CREATE TABLE IF NOT EXISTS public.calendar_events')
    expect(migrationSource).toContain('calendar_events_course_audience_match')
    expect(migrationSource).toContain('calendar_events_select')
    expect(migrationSource).toContain('calendar_events_insert')
    expect(migrationSource).toContain('calendar_events_update')
  })
})
