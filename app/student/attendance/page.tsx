import { StudentAttendanceWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export default async function StudentAttendancePage() {
  const view = await loadLmsDashboardView('student')

  return <StudentAttendanceWorkspace view={view} />
}
