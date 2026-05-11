import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdminDashboard } from '@/components/lms/AdminDashboard'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'
import { buildResourceReviewSummary } from '@/lib/lms/resource-review-summary'
import type { LmsResourceSummary } from '@/lib/lms/types'

function resource(overrides: Partial<LmsResourceSummary>): LmsResourceSummary {
  return {
    id: 'resource-1',
    lessonId: 'lesson-1',
    courseId: 'course-1',
    title: 'Resource',
    courseTitle: 'Course',
    fileName: 'resource.pdf',
    fileType: 'application/pdf',
    fileSize: 100,
    scanStatus: 'clean',
    scanProvider: 'mock',
    legalHold: false,
    retentionExpiresAt: '2033-05-06T21:00:00.000Z',
    quarantineReason: '',
    ...overrides,
  }
}

describe('LMS resource review dashboard', () => {
  it('summarizes quarantine, legal hold, and quota state', () => {
    const summary = buildResourceReviewSummary(
      [
        resource({ id: 'clean', fileSize: 100 }),
        resource({ id: 'pending', title: 'Pending scan', scanStatus: 'pending', fileSize: 200 }),
        resource({ id: 'blocked', title: 'Blocked pack', scanStatus: 'blocked', legalHold: true, quarantineReason: 'Malware match', fileSize: 300 }),
      ],
      { tenantQuotaBytes: 1000 }
    )

    expect(summary).toMatchObject({
      totalResources: 3,
      needsReview: 2,
      quarantined: 1,
      legalHolds: 1,
      usedBytes: 600,
      quotaPercent: 60,
    })
    expect(summary.queue.map((item) => item.title)).toEqual(['Blocked pack', 'Pending scan'])
  })

  it('renders an admin resource review queue with quota status', () => {
    const records = createDemoLmsRecords()
    records.resources.push(
      {
        id: 'resource-blocked',
        lessonId: 'lesson-1',
        fileName: 'blocked.pdf',
        fileType: 'application/pdf',
        fileSize: 300,
        displayName: 'Blocked Source Pack',
        scanStatus: 'blocked',
        scanProvider: 'mock',
        legalHold: true,
        retentionExpiresAt: '2033-05-06T21:00:00.000Z',
        quarantineReason: 'Malware match',
      },
      {
        id: 'resource-pending',
        lessonId: 'lesson-1',
        fileName: 'pending.pdf',
        fileType: 'application/pdf',
        fileSize: 200,
        displayName: 'Pending Lab Sheet',
        scanStatus: 'pending',
        scanProvider: 'mock',
        legalHold: false,
        retentionExpiresAt: '2033-05-06T21:00:00.000Z',
        quarantineReason: '',
      }
    )

    render(<AdminDashboard view={buildLmsDashboardViews(records).admin} />)

    const panel = screen.getByRole('heading', { name: 'Resource review queue' }).closest('section')
    expect(panel).not.toBeNull()
    const reviewPanel = within(panel!)

    expect(reviewPanel.getByText('2 need review')).toBeInTheDocument()
    expect(reviewPanel.getByText('1 quarantined')).toBeInTheDocument()
    expect(reviewPanel.getByText(/Quota used/)).toBeInTheDocument()
    expect(reviewPanel.getByText('Blocked Source Pack')).toBeInTheDocument()
    expect(reviewPanel.getByText('Malware match')).toBeInTheDocument()
    expect(screen.getAllByLabelText(/Retention expiry/i).some((input) => (input as HTMLInputElement).value === '2033-05-06')).toBe(true)
  })
})
