import { StudentCalendarWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export default async function StudentCalendarPage() {
  const view = await loadLmsDashboardView('student')

  return <StudentCalendarWorkspace view={view} />
}
