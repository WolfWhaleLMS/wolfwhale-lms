import { StudentGradebookWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export default async function StudentGradebookPage() {
  const view = await loadLmsDashboardView('student')

  return <StudentGradebookWorkspace view={view} />
}
