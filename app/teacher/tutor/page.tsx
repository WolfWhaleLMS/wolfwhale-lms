import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getConversations } from '@/app/actions/tutor'
import { TeacherTutorClient } from './TeacherTutorClient'

export const metadata = { title: 'AI Assistant' }

export default async function TeacherTutorPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verify teacher role (super_admin can also access teacher routes)
  const headersList = await headers()
  const role = headersList.get('x-user-role') || 'student'
  if (role !== 'teacher' && role !== 'super_admin') redirect('/dashboard')

  // Fetch initial data
  let conversations: Awaited<ReturnType<typeof getConversations>> = []
  let teacherCourses: { id: string; name: string; subject: string | null; studentCount: number }[] = []
  let error: string | null = null

  try {
    const [convResult, coursesResult] = await Promise.all([
      getConversations().catch(() => []),
      supabase
        .from('courses')
        .select('id, name, subject')
        .eq('created_by', user.id)
        .eq('status', 'active')
        .order('name'),
    ])

    conversations = convResult

    const courseData = coursesResult.data || []

    // Get student counts per course
    const courseIds = courseData.map((c) => c.id)
    let enrollmentCounts: Record<string, number> = {}

    if (courseIds.length > 0) {
      const headersList2 = await headers()
      const tenantId = headersList2.get('x-tenant-id')

      if (tenantId) {
        const { data: enrollments } = await supabase
          .from('course_enrollments')
          .select('course_id')
          .in('course_id', courseIds)
          .eq('tenant_id', tenantId)
          .eq('status', 'active')

        if (enrollments) {
          for (const e of enrollments) {
            enrollmentCounts[e.course_id] = (enrollmentCounts[e.course_id] || 0) + 1
          }
        }
      }
    }

    teacherCourses = courseData.map((c) => ({
      id: c.id,
      name: c.name,
      subject: c.subject,
      studentCount: enrollmentCounts[c.id] || 0,
    }))
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load assistant data'
  }

  return (
    <TeacherTutorClient
      initialConversations={conversations}
      teacherCourses={teacherCourses}
      error={error}
    />
  )
}
