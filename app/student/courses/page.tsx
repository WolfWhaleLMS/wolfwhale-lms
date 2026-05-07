import type { Metadata } from 'next'
import { StudentCoursesWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Student Courses',
  description: 'Student course workspaces with syllabus, lessons, assignments, resources, grades, attendance, and messages.',
}

export const dynamic = 'force-dynamic'

export default async function StudentCoursesPage() {
  const view = await loadLmsDashboardView('student')

  return <StudentCoursesWorkspace view={view} />
}
