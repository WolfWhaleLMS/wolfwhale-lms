import type { Metadata } from 'next'
import { notFound } from 'next/navigation'
import { StudentCourseWorkspace } from '@/components/lms/StudentWorkspaces'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Student Course Workspace',
  description: 'Course-specific student workspace with assignments, resources, grades, feedback, and attendance.',
}

export const dynamic = 'force-dynamic'

export default async function StudentCoursePage({ params }: { params: Promise<{ courseId: string }> }) {
  const { courseId } = await params
  const view = await loadLmsDashboardView('student')

  if (!view.courses.some((course) => course.id === courseId)) {
    notFound()
  }

  return <StudentCourseWorkspace view={view} courseId={courseId} />
}
