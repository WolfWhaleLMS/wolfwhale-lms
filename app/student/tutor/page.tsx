import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getConversations } from '@/app/actions/tutor'
import { buildCourseContext } from '@/lib/tutor/context-builder'
import { StudentTutorClient } from './StudentTutorClient'

export const metadata = { title: 'AI Tutor' }

export default async function StudentTutorPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Verify student role
  const headersList = await headers()
  const role = headersList.get('x-user-role') || 'student'
  if (role !== 'student') redirect('/dashboard')

  // Fetch initial data in parallel
  let conversations: Awaited<ReturnType<typeof getConversations>> = []
  let courseContext = ''
  let enrolledCourses: { id: string; name: string; subject: string | null }[] = []
  let error: string | null = null

  try {
    const headersList2 = await headers()
    const tenantId = headersList2.get('x-tenant-id')

    const [convResult, contextResult, coursesResult] = await Promise.all([
      getConversations().catch(() => []),
      buildCourseContext(user.id).catch(() => ''),
      tenantId
        ? supabase
            .from('course_enrollments')
            .select('course_id, courses (id, name, subject)')
            .eq('student_id', user.id)
            .eq('tenant_id', tenantId)
            .eq('status', 'active')
        : Promise.resolve({ data: [] }),
    ])

    conversations = convResult
    courseContext = contextResult

    const enrollmentData = coursesResult.data || []
    enrolledCourses = enrollmentData
      .filter((e: any) => e.courses)
      .map((e: any) => ({
        id: e.courses.id,
        name: e.courses.name,
        subject: e.courses.subject,
      }))
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load tutor data'
  }

  return (
    <StudentTutorClient
      initialConversations={conversations}
      initialCourseContext={courseContext}
      enrolledCourses={enrolledCourses}
      error={error}
    />
  )
}
