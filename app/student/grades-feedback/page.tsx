import { StudentGradesFeedbackWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export default async function StudentGradesFeedbackPage() {
  const view = await loadLmsDashboardView('student')

  return <StudentGradesFeedbackWorkspace view={view} />
}
