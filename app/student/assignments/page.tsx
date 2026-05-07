import type { Metadata } from 'next'
import { StudentAssignmentsWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Student Assignments',
  description: 'Student assignment workspace grouped by course with submission portals.',
}

export const dynamic = 'force-dynamic'

export default async function StudentAssignmentsPage() {
  const view = await loadLmsDashboardView('student')

  return <StudentAssignmentsWorkspace view={view} />
}
