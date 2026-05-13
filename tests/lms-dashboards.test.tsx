import { render, screen, within } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { AdminDashboard } from '@/components/lms/AdminDashboard'
import { GuardianDashboard } from '@/components/lms/GuardianDashboard'
import { StudentDashboard } from '@/components/lms/StudentDashboard'
import { TeacherDashboard } from '@/components/lms/TeacherDashboard'
import { buildLmsDashboardViews, createDemoLmsRecords } from '@/lib/lms/read-model'

const views = buildLmsDashboardViews(createDemoLmsRecords())

function expectDashboardTools(labels: string[]) {
  const tools = screen.getByRole('navigation', { name: 'Dashboard tools' })

  for (const label of labels) {
    expect(within(tools).getByRole('link', { name: new RegExp(label) })).toBeInTheDocument()
  }
}

describe('persistent LMS dashboards', () => {
  it('renders the admin operations dashboard', () => {
    render(<AdminDashboard view={views.admin} />)

    expect(screen.getByRole('heading', { name: 'Admin dashboard' })).toBeInTheDocument()
    expectDashboardTools(['School', 'Metrics', 'Risk', 'Create course', 'Invite user', 'Guardian links', 'Roster import'])
    expect(screen.getAllByText('WolfWhale Academy').length).toBeGreaterThan(0)
    expect(screen.getByText('Active students')).toBeInTheDocument()
    expect(screen.getByText('grade.created')).toBeInTheDocument()
    expect(screen.getByText('Risk summary')).toBeInTheDocument()
    expect(screen.getByText('High')).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Attendance' })).toBeInTheDocument()
    expect(screen.getByText('Export SIS package')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Import roster' })).toBeInTheDocument()
    expect(screen.getAllByText('Primary Source Pack').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Humanities check-in').length).toBeGreaterThan(0)
  })

  it('renders the teacher class and grading dashboard', () => {
    render(<TeacherDashboard view={views.teacher} />)

    expect(screen.getByRole('heading', { name: 'Teacher dashboard' })).toBeInTheDocument()
    expectDashboardTools(['Courses', 'Roster', 'Create assignment', 'Gradebook', 'Attendance', 'Rubrics', 'Grading queue'])
    expect(screen.getAllByText('Grade 8 Humanities').length).toBeGreaterThan(0)
    expect(screen.getAllByText(/section 8A/).length).toBeGreaterThan(0)
    expect(screen.getAllByText('Alex Student').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Primary Source Exit Ticket').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Riley Student').length).toBeGreaterThan(0)
    expect(screen.getByRole('button', { name: 'Create' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save attendance' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Save rubric' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Post grade' })).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument()
    expect(screen.getByRole('heading', { name: 'Gradebook' })).toBeInTheDocument()
    expect(screen.getByText('Export gradebook')).toBeInTheDocument()
    expect(screen.getAllByText('Needs more grades').length).toBeGreaterThan(0)
    expect(screen.getByRole('heading', { name: 'Rubrics' })).toBeInTheDocument()
    expect(screen.getByText('Reflection Rubric')).toBeInTheDocument()
    expect(screen.getAllByText('Primary Source Pack').length).toBeGreaterThan(0)
  })

  it('renders the student dashboard without unrelated classmates', () => {
    render(<StudentDashboard view={views.student} />)

    expect(screen.getByRole('heading', { name: 'Student dashboard' })).toBeInTheDocument()
    expectDashboardTools(['Courses', 'Assignments', 'Submit work', 'Grades and feedback', 'Gradebook', 'Attendance', 'Calendar', 'Resources', 'Messages', 'Notifications'])
    expect(screen.getAllByText('Launch Reflection').length).toBeGreaterThan(0)
    expect(screen.getByText(/9\/10/)).toBeInTheDocument()
    expect(screen.getAllByText('90%').length).toBeGreaterThan(0)
    expect(screen.getAllByText('67%').length).toBeGreaterThan(0)
    expect(screen.getAllByText('Please review the source pack before tomorrow.').length).toBeGreaterThan(0)
    const tools = screen.getByRole('navigation', { name: 'Dashboard tools' })
    expect(within(tools).getByRole('link', { name: /^Submit work\b/ })).toHaveAttribute('href', '/student/assignments#submit-work')
    expect(screen.queryByRole('textbox', { name: 'Response' })).not.toBeInTheDocument()
    expect(screen.queryByRole('button', { name: /Submit / })).not.toBeInTheDocument()
    expect(screen.queryByText('Riley Student')).not.toBeInTheDocument()
  })

  it('renders the guardian dashboard scoped to linked students only', () => {
    render(<GuardianDashboard view={views.guardian} />)

    expect(screen.getByRole('heading', { name: 'Guardian dashboard' })).toBeInTheDocument()
    expectDashboardTools(['Linked students', 'Attendance', 'Calendar', 'Resources', 'Messages'])
    const linkedStudentSection = screen.getByTestId('guardian-linked-students')

    expect(within(linkedStudentSection).getByText('Alex Student')).toBeInTheDocument()
    expect(within(linkedStudentSection).getByText('9/10')).toBeInTheDocument()
    expect(within(linkedStudentSection).getByText('90% A-')).toBeInTheDocument()
    expect(within(linkedStudentSection).getByText(/Needs more grades trend/)).toBeInTheDocument()
    expect(screen.getByText('67% present/online')).toBeInTheDocument()
    expect(screen.getByRole('button', { name: 'Send message' })).toBeInTheDocument()
    expect(screen.queryByText('Riley Student')).not.toBeInTheDocument()
  })
})
