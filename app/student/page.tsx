import type { Metadata } from 'next'
import { StudentDashboard } from '@/components/lms/StudentDashboard'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Student LMS Console',
  description: 'Supabase-backed courses, assignments, submissions, grades, feedback, and notifications.',
}

export const dynamic = 'force-dynamic'

export default async function StudentPage() {
  const view = await loadLmsDashboardView('student')

  return <StudentDashboard view={view} />
}
