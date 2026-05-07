import type { Metadata } from 'next'
import { TeacherDashboard } from '@/components/lms/TeacherDashboard'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Teacher LMS Console',
  description: 'Supabase-backed courses, rosters, assignments, submissions, and grading queue.',
}

export const dynamic = 'force-dynamic'

export default async function TeacherPage() {
  const view = await loadLmsDashboardView('teacher')

  return <TeacherDashboard view={view} />
}
