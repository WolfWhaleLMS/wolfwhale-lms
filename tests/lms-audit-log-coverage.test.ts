import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(__dirname, '..')
const mutationSource = readFileSync(path.join(repoRoot, 'lib/lms/mutations.ts'), 'utf8')
const rosterImportSource = readFileSync(path.join(repoRoot, 'lib/lms/roster-import.ts'), 'utf8')
const invitationSource = readFileSync(path.join(repoRoot, 'lib/lms/invitations.ts'), 'utf8')
const guardianLinkSource = readFileSync(path.join(repoRoot, 'lib/lms/guardian-links.ts'), 'utf8')
const calendarEventSource = readFileSync(path.join(repoRoot, 'lib/lms/calendar-events.ts'), 'utf8')

const mutationAuditExpectations = [
  {
    functionName: 'submitAssignment',
    actions: ['submission.created', 'submission.updated'],
    resourceType: 'submission',
  },
  {
    functionName: 'gradeSubmission',
    actions: ['grade.created', 'grade.updated'],
    resourceType: 'grade',
  },
  {
    functionName: 'createCourse',
    actions: ['course.created'],
    resourceType: 'course',
  },
  {
    functionName: 'createAssignment',
    actions: ['assignment.created'],
    resourceType: 'assignment',
  },
  {
    functionName: 'createCourseResource',
    actions: ['resource.created'],
    resourceType: 'lesson_attachment',
  },
  {
    functionName: 'markAttendance',
    actions: ['attendance.created', 'attendance.updated'],
    resourceType: 'attendance_record',
  },
  {
    functionName: 'createRubric',
    actions: ['rubric.created'],
    resourceType: 'rubric',
  },
  {
    functionName: 'enrollStudent',
    actions: ['enrollment.created', 'enrollment.updated'],
    resourceType: 'course_enrollment',
  },
  {
    functionName: 'sendCourseMessage',
    actions: ['message.sent'],
    resourceType: 'message',
  },
] as const

const routeServiceExpectations = [
  ['app/api/lms/submissions/route.ts', 'submitAssignment'],
  ['app/api/lms/grades/route.ts', 'gradeSubmission'],
  ['app/api/lms/courses/route.ts', 'createCourse'],
  ['app/api/lms/assignments/route.ts', 'createAssignment'],
  ['app/api/lms/resources/route.ts', 'createCourseResource'],
  ['app/api/lms/attendance/route.ts', 'markAttendance'],
  ['app/api/lms/rubrics/route.ts', 'createRubric'],
  ['app/api/lms/enrollments/route.ts', 'enrollStudent'],
  ['app/api/lms/messages/route.ts', 'sendCourseMessage'],
  ['app/api/lms/invitations/route.ts', 'inviteUserToSchool'],
  ['app/api/lms/invitations/resend/route.ts', 'resendSchoolInvitation'],
  ['app/api/lms/memberships/status/route.ts', 'updateSchoolMembershipStatus'],
  ['app/api/lms/memberships/role/route.ts', 'updateSchoolMembershipRole'],
  ['app/api/lms/guardian-links/route.ts', 'linkGuardianToStudent'],
  ['app/api/lms/guardian-links/unlink/route.ts', 'unlinkGuardianFromStudent'],
  ['app/api/lms/guardian-links/contact/route.ts', 'updateGuardianContactDetails'],
  ['app/api/lms/calendar-events/route.ts', 'createCalendarEvent'],
  ['app/api/lms/roster/import/route.ts', 'importRosterWithInvites'],
] as const

const directRouteAuditExpectations = [
  {
    routePath: 'app/api/lms/resources/[resourceId]/route.ts',
    action: 'resource_review.updated',
    resourceType: 'course_resource_security_review',
  },
] as const

function exportedFunctionBody(source: string, functionName: string) {
  const marker = `export async function ${functionName}`
  const start = source.indexOf(marker)

  expect(start, `${functionName} should be exported`).toBeGreaterThanOrEqual(0)

  const next = source.indexOf('\nexport async function ', start + marker.length)
  return source.slice(start, next === -1 ? source.length : next)
}

function sourceFor(relativePath: string) {
  const absolutePath = path.join(repoRoot, relativePath)
  expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true)

  return readFileSync(absolutePath, 'utf8')
}

describe('LMS audit-log coverage', () => {
  it('keeps critical LMS mutation services wired to audit_logs', () => {
    for (const expectation of mutationAuditExpectations) {
      const body = exportedFunctionBody(mutationSource, expectation.functionName)

      expect(body, `${expectation.functionName} should write an audit row`).toContain('insertAuditLog')
      expect(body, `${expectation.functionName} should identify the audited resource type`).toContain(
        `resourceType: '${expectation.resourceType}'`
      )

      for (const action of expectation.actions) {
        expect(body, `${expectation.functionName} should audit ${action}`).toContain(action)
      }
    }
  })

  it('keeps write routes delegated to audited services', () => {
    for (const [routePath, serviceName] of routeServiceExpectations) {
      const routeSource = sourceFor(routePath)

      expect(routeSource, `${routePath} should import ${serviceName}`).toContain(serviceName)
      expect(routeSource, `${routePath} should enforce LMS mutation rate limits`).toContain('enforceLmsMutationRateLimit')
    }
  })

  it('keeps roster imports and direct resource-review writes auditable', () => {
    expect(rosterImportSource).toContain("admin.from('audit_logs').insert")
    expect(rosterImportSource).toContain('roster.imported')
    expect(invitationSource).toContain("admin.from('audit_logs').insert")
    expect(invitationSource).toContain('user.invited')
    expect(invitationSource).toContain('user.invite_resent')
    expect(invitationSource).toContain('user.deactivated')
    expect(invitationSource).toContain('user.reactivated')
    expect(invitationSource).toContain('user.role_changed')
    expect(guardianLinkSource).toContain(".from('audit_logs').insert")
    expect(guardianLinkSource).toContain('guardian.linked')
    expect(guardianLinkSource).toContain('guardian.unlinked')
    expect(guardianLinkSource).toContain('guardian.contact_updated')
    expect(calendarEventSource).toContain(".from('audit_logs').insert")
    expect(calendarEventSource).toContain('calendar_event.created')

    for (const expectation of directRouteAuditExpectations) {
      const routeSource = sourceFor(expectation.routePath)

      expect(routeSource).toContain(".from('audit_logs').insert")
      expect(routeSource).toContain(expectation.action)
      expect(routeSource).toContain(expectation.resourceType)
    }
  })
})
