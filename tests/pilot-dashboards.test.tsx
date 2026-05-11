import { render, screen } from '@testing-library/react'
import { describe, expect, it } from 'vitest'
import { PilotRoleDashboard } from '@/components/school/PilotRoleDashboard'
import { getPilotAdminView, getPilotGuardianView, getPilotStudentView, getPilotTeacherView } from '@/lib/pilot/data'

describe('pilot role dashboards', () => {
  it('renders admin pilot operations without hiding launch checks', () => {
    render(<PilotRoleDashboard role="admin" view={getPilotAdminView()} />)

    expect(screen.getByRole('heading', { name: /Admin dashboard/i })).toBeInTheDocument()
    expect(screen.getAllByText('WolfWhale Pilot School').length).toBeGreaterThan(0)
    expect(screen.getByText(/Grade 8 Launch Humanities/)).toBeInTheDocument()
    expect(screen.getByText('Pilot auth gate configured')).toBeInTheDocument()
  })

  it('renders teacher course, roster, assignment, and submission review state', () => {
    render(<PilotRoleDashboard role="teacher" view={getPilotTeacherView('teacher-1')} />)

    expect(screen.getByRole('heading', { name: /Teacher dashboard/i })).toBeInTheDocument()
    expect(screen.getByText('Tessa Teacher')).toBeInTheDocument()
    expect(screen.getByText('Sam Student')).toBeInTheDocument()
    expect(screen.getByText('Riley Student')).toBeInTheDocument()
    expect(screen.getByText('Launch Reflection')).toBeInTheDocument()
    expect(screen.getByText('No submissions yet')).toBeInTheDocument()
  })

  it('renders student assignment state without exposing other students', () => {
    render(<PilotRoleDashboard role="student" view={getPilotStudentView('student-1')} />)

    expect(screen.getByRole('heading', { name: /Student dashboard/i })).toBeInTheDocument()
    expect(screen.getByText('Sam Student')).toBeInTheDocument()
    expect(screen.getByText('Launch Reflection')).toBeInTheDocument()
    expect(screen.getByText('Submission not started')).toBeInTheDocument()
    expect(screen.queryByText('Riley Student')).not.toBeInTheDocument()
  })

  it('renders guardian linked student state without exposing unlinked students', () => {
    render(<PilotRoleDashboard role="guardian" view={getPilotGuardianView('guardian-1')} />)

    expect(screen.getByRole('heading', { name: /Guardian dashboard/i })).toBeInTheDocument()
    expect(screen.getByText('Greer Guardian')).toBeInTheDocument()
    expect(screen.getByText('Sam Student')).toBeInTheDocument()
    expect(screen.getByText('Launch Reflection')).toBeInTheDocument()
    expect(screen.queryByText('Riley Student')).not.toBeInTheDocument()
  })
})
