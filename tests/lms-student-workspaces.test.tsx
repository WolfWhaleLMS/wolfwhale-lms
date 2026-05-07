import { cleanup, render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
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

describe('student LMS workspaces', () => {
  it('links student dashboard tools into real feature workspaces', () => {
    render(<StudentDashboard view={views.student} />)

    expect(screen.getByRole('link', { name: /Grade 8 Humanities/ })).toHaveAttribute('href', '/student/courses/course-1')

    const tools = screen.getByRole('navigation', { name: 'Dashboard tools' })
    expect(within(tools).getByRole('link', { name: /^Courses\b/ })).toHaveAttribute('href', '/student/courses')
    expect(within(tools).getByRole('link', { name: /^Assignments\b/ })).toHaveAttribute('href', '/student/assignments')
    expect(within(tools).getByRole('link', { name: /^Submit work\b/ })).toHaveAttribute('href', '/student/assignments#submit-work')
    expect(within(tools).getByRole('link', { name: /^Grades and feedback\b/ })).toHaveAttribute('href', '/student/grades-feedback')
    expect(within(tools).getByRole('link', { name: /^Gradebook\b/ })).toHaveAttribute('href', '/student/gradebook')
    expect(within(tools).getByRole('link', { name: /^Attendance\b/ })).toHaveAttribute('href', '/student/attendance')
    expect(within(tools).getByRole('link', { name: /^Calendar\b/ })).toHaveAttribute('href', '/student/calendar')
    expect(within(tools).getByRole('link', { name: /^Resources\b/ })).toHaveAttribute('href', '/student/resources')
    expect(within(tools).getByRole('link', { name: /^Messages\b/ })).toHaveAttribute('href', '/student/messages')
    expect(within(tools).getByRole('link', { name: /^Notifications\b/ })).toHaveAttribute('href', '/student/notifications')
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
  })

  it('renders student settings with easy background themes and pet controls', () => {
    render(<StudentSettingsWorkspace />)

    expect(screen.getByRole('heading', { name: 'Student settings' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: /Woodland Boreal/ })).toBeInTheDocument()
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
    cleanup()

    render(<StudentAttendanceWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Attendance' })).toBeInTheDocument()
    expect(screen.getByText(/67 percent present/)).toBeInTheDocument()
    cleanup()

    render(<StudentCalendarWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Calendar' })).toBeInTheDocument()
    expect(screen.getByText('Launch Reflection')).toBeInTheDocument()
    cleanup()

    render(<StudentResourcesWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Resources' })).toBeInTheDocument()
    expect(screen.getByRole('link', { name: /Primary Source Pack/ })).toHaveAttribute('href', '/api/lms/resources/resource-1')
    cleanup()

    render(<StudentMessagesWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Messages' })).toBeInTheDocument()
    expect(screen.getByText('Humanities check-in')).toBeInTheDocument()
    cleanup()

    render(<StudentNotificationsWorkspace view={views.student} />)
    expect(screen.getByRole('heading', { name: 'Notifications' })).toBeInTheDocument()
    expect(screen.getByText('Grade posted')).toBeInTheDocument()
  })
})
