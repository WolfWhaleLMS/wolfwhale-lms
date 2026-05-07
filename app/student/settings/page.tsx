import type { Metadata } from 'next'
import { StudentSettingsWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Student Settings',
  description: 'Student dashboard background theme and study companion settings.',
}

export const dynamic = 'force-dynamic'

export default async function StudentSettingsPage() {
  await loadLmsDashboardView('student')

  return <StudentSettingsWorkspace />
}
