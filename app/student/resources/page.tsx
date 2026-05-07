import { StudentResourcesWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export default async function StudentResourcesPage() {
  const view = await loadLmsDashboardView('student')

  return <StudentResourcesWorkspace view={view} />
}
