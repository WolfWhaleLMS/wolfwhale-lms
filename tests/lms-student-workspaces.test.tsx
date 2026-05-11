import { cleanup, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { GuardianDashboard } from '@/components/lms/GuardianDashboard'
import { StudentDashboard } from '@/components/lms/StudentDashboard'
import {
  StudentAssignmentsWorkspace,
  StudentAttendanceWorkspace,
  StudentCalendarWorkspace,
  StudentCourseWorkspace,
  StudentGradebookWorkspace,
  StudentGradesFeedbackWorkspace,
  StudentMessagesWorkspace,
  StudentNotificationsWorkspace,
  StudentResourcesWorkspace,
  StudentSettingsWorkspace,
} from '@/components/lms/StudentWorkspaces'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'

const views = buildLmsDashboardViews(createDemoLmsRecords())

function viewsWithStudentSubmissionFile() {
  const records = createDemoLmsRecords()
  const submission = records.submissions.find((candidate) => candidate.studentId === records.actorIds.student)

  if (submission) {
    submission.fileName = 'reflection-notes.pdf'
    submission.filePath = `${records.tenant.id}/${records.actorIds.student}/${records.courses[0].id}/${submission.assignmentId}/reflection-notes.pdf`
  }

  return buildLmsDashboardViews(records)
}

describe('student LMS workspaces', () => {
  it('links student dashboard tools into real feature workspaces', () => {
    render(<StudentDashboard view={views.student} />)

    expect(screen.getByRole('link', { name: /Grade 8 Humanities/ })).toHaveAttribute('href', '/student/courses/course-1')

    const tools = screen.getByRole('navigation', { name: 'Dashboard tools' })
    expect(within(tools).getByRole('link', { name: /^Courses/ })).toHaveAttribute('href', '/student/courses')
    expect(within(tools).getByRole('link', { name: /^Assignments/ })).toHaveAttribute('href', '/student/assignments')
    expect(within(tools).getByRole('link', { name: /^Submit work/ })).toHaveAttribute('href', '/student/assignments#submit-work')
    expect(within(tools).getByRole('link', { name: /^Grades and feedback/ })).toHaveAttribute('href', '/student/grades-feedback')
    expect(within(tools).getByRole('link', { name: /^Gradebook/ })).toHaveAttribute('href', '/student/gradebook')
    expect(within(tools).getByRole('link', { name: /^Attendance/ })).toHaveAttribute('href', '/student/attendance')
    expect(within(tools).getByRole('link', { name: /^Calendar/ })).toHaveAttribute('href', '/student/calendar')
    expect(within(tools).getByRole('link', { name: /^Resource Center/ })).toHaveAttribute('href', '/student/resources')
    expect(within(tools).getByRole('link', { name: /^Messages/ })).toHaveAttribute('href', '/student/messages')
    expect(within(tools).getByRole('link', { name: /^Notifications/ })).toHaveAttribute('href', '/student/notifications')
  })

  it('renders one course workspace with relevant materials, submissions, syllabus, and feedback together', () => {
    render(<StudentCourseWorkspace view={views.student} courseId="course-1" />)

    expect(screen.getByRole('heading', { name: 'Grade 8 Humanities' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Course syllabus' })).toBeInTheDocument()
    expect(screen.getByText('Reflection')).toBeInTheDocument()
    expect(screen.getByText('Exit Ticket')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Course materials' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Primary Source Pack/ })).toHaveAttribute('href', '/api/lms/resources/resource-1')
    expect(screen.getByText('Write one paragraph about what helped you learn.')).toBeInTheDocument()
    expect(screen.getAllByRole('button', { name: /Submit / }).length).toBeGreaterThan(0)
    expect(screen.getByText('9/10')).toBeInTheDocument()
    expect(screen.getByText('67%')).toBeInTheDocument()
    expect(screen.queryByText('Riley Student')).not.toBeInTheDocument()
  })

  it('renders an assignment workspace grouped by course with submission portals', () => {
    render(<StudentAssignmentsWorkspace view={views.student} />)

    expect(screen.getByRole('heading', { name: 'Assignments' })).toBeInTheDocument()
    const humanities = screen.getByRole('region', { name: 'Grade 8 Humanities assignments' })

    expect(within(humanities).getByText('Launch Reflection')).toBeInTheDocument()
    expect(within(humanities).getByText('Primary Source Exit Ticket')).toBeInTheDocument()
    expect(within(humanities).getAllByRole('button', { name: /Submit / }).length).toBe(2)
    expect(within(humanities).getAllByLabelText('Attach file')).toHaveLength(2)
  })

  it('shows signed submitted-file links to students and linked guardians', () => {
    const linkedViews = viewsWithStudentSubmissionFile()

    expect(linkedViews.student.assignments[0]).toMatchObject({
      submittedFileName: 'reflection-notes.pdf',
      submissionFileHref: '/api/lms/submissions/submission-1/file',
    })

    render(<StudentAssignmentsWorkspace view={linkedViews.student} />)
    expect(screen.getByRole('link', { name: /Download submitted file reflection-notes\.pdf/ })).toHaveAttribute('href', '/api/lms/submissions/submission-1/file')
    cleanup()

    render(<GuardianDashboard view={linkedViews.guardian} />)
    expect(screen.getByRole('link', { name: /Download submitted file reflection-notes\.pdf/ })).toHaveAttribute('href', '/api/lms/submissions/submission-1/file')
    expect(screen.queryByText('source-notes.pdf')).not.toBeInTheDocument()
  })

  it('renders student settings with easy background themes and pet controls', () => {
    render(<StudentSettingsWorkspace />)

    expect(screen.getByRole('heading', { name: 'Student settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Reef Lagoon/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Fisher Price Toybox/ })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Study companion' })).toBeInTheDocument()
  })

  it('renders dedicated student feature workspaces for the rest of the tool hub', () => {
    render(<StudentGradesFeedbackWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Grades and feedback' })).toBeInTheDocument()
    expect(screen.getByText('Strong reflection with a clear next question.')).toBeInTheDocument()
    cleanup()

    render(<StudentGradebookWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Gradebook' })).toBeInTheDocument()
    expect(screen.getByText('90% A-')).toBeInTheDocument()
    expect(screen.getByText('Needs more grades')).toBeInTheDocument()
    cleanup()

    render(<StudentAttendanceWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Attendance' })).toBeInTheDocument()
    expect(screen.getByText(/67 percent present/)).toBeInTheDocument()
    cleanup()

    render(<StudentCalendarWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument()
    expect(screen.getByText('Launch Reflection')).toBeInTheDocument()
    cleanup()

    render(<StudentMessagesWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Messages' })).toBeInTheDocument()
    expect(screen.getByText('Humanities check-in')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument()
    cleanup()

    render(<StudentNotificationsWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Notifications' })).toBeInTheDocument()
    expect(screen.getByText('Grade posted')).toBeInTheDocument()
  })

  it('renders the student resource center with interactive studios', () => {
    render(<StudentResourcesWorkspace view={views.student} />)

    expect(screen.getByRole('heading', { name: 'Resource Center' })).toBeInTheDocument()
    const libraryCatalog = screen.getByRole('region', { name: 'Interactive Resource Library catalog' })
    expect(within(libraryCatalog).getByRole('heading', { name: 'Interactive Resource Library' })).toBeInTheDocument()
    expect(within(libraryCatalog).getByText('B.C. curriculum areas')).toBeInTheDocument()
    expect(within(libraryCatalog).getByRole('link', { name: /Open Cell Architecture Studio/ })).toHaveAttribute('href', '#cell-architecture-studio')
    expect(within(libraryCatalog).getByRole('link', { name: /Open Human Body Studio/ })).toHaveAttribute('href', '#human-body-studio')
    expect(within(libraryCatalog).getByRole('link', { name: /Open Solar System Studio/ })).toHaveAttribute('href', '#solar-system-studio')
    expect(within(libraryCatalog).getByRole('link', { name: /Open Fur Trade Routes Map/ })).toHaveAttribute('href', '#fur-trade-routes-map')
    expect(within(libraryCatalog).getByRole('heading', { name: 'Chemistry Studio' })).toBeInTheDocument()
    expect(within(libraryCatalog).getByRole('heading', { name: 'Earth Systems Studio' })).toBeInTheDocument()
    expect(within(libraryCatalog).getByRole('heading', { name: 'Physics Lab Studio' })).toBeInTheDocument()
    expect(within(libraryCatalog).getByRole('heading', { name: 'Geometry Studio' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Human Body Studio' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Select Heart and Circulation body system/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Select Lungs and Breathing body system/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Inspect' })).toBeInTheDocument()
    expect(screen.getByText('Image-to-3D Pipeline')).toBeInTheDocument()
    expect(screen.getByText('gpt-image-2 reference')).toBeInTheDocument()
    expect(screen.getByText('Tripo3D candidate')).toBeInTheDocument()
    expect(screen.getByText('Hunyuan3D candidate')).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Cell studio' })).toBeInTheDocument()
    expect(screen.getByRole('tab', { name: 'Course files' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Cell Architecture Studio' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Plant Cell/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /White Blood Cell/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Mesh' })).toBeInTheDocument()
    expect(screen.getByText('Organelle Details')).toBeInTheDocument()
    expect(screen.getByText('Microscope Views')).toBeInTheDocument()
    expect(screen.getAllByText('Light Microscope').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Electron Microscope').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: 'Solar System Studio' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Mercury/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Neptune/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Orbit' })).toBeInTheDocument()
    expect(screen.getByText('Planet Details')).toBeInTheDocument()
    expect(screen.getByRole('region', { name: 'Fur Trade Routes Map resource' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /York Factory/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Montreal/ })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '1670-1774' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: '3D terrain' })).toBeInTheDocument()
    expect(screen.getByText('Accurate 3D Route Terrain')).toBeInTheDocument()
    expect(screen.getByText('geoBoundaries Canada outline')).toBeInTheDocument()
    expect(screen.getByText('HD image-generated relief texture')).toBeInTheDocument()
    expect(screen.getByText('Real longitude and latitude projection')).toBeInTheDocument()
    expect(screen.getByText('Indigenous Trade Networks')).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Primary Source Pack/ })).toHaveAttribute('href', '/api/lms/resources/resource-1')
  }, 10000)
})
