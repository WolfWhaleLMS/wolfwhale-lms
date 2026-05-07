import { StudentMessagesWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export default async function StudentMessagesPage() {
  const view = await loadLmsDashboardView('student')

  return <StudentMessagesWorkspace view={view} />
}
