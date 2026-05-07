import type { Metadata } from 'next'
import { GuardianDashboard } from '@/components/lms/GuardianDashboard'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Guardian LMS Console',
  description: 'Supabase-backed linked-student courses, assignments, grades, and feedback.',
}

export const dynamic = 'force-dynamic'

export default async function GuardianPage() {
  const view = await loadLmsDashboardView('guardian')

  return <GuardianDashboard view={view} />
}
