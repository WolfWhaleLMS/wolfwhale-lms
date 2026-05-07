import { StudentNotificationsWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export default async function StudentNotificationsPage() {
  const view = await loadLmsDashboardView('student')

  return <StudentNotificationsWorkspace view={view} />
}
