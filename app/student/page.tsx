import type { Metadata } from 'next'
import { StudentDashboard } from '@/components/lms/StudentDashboard'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Student LMS Console',
  description: 'Supabase-backed courses, assignments, submissions, grades, feedback, and notifications.',
}

export const dynamic = 'force-dynamic'

interface StudentPageProps {
  searchParams?: Promise<Record<string, string | string[] | undefined>>
}

function firstParam(value: string | string[] | undefined) {
  return Array.isArray(value) ? value[0] : value
}

export default async function StudentPage({ searchParams }: StudentPageProps) {
  const view = await loadLmsDashboardView('student')
  const params = (await searchParams) ?? {}
  const saved = firstParam(params.saved)
  const error = firstParam(params.error)

  return <StudentDashboard view={view} saved={saved} error={error} />
}
