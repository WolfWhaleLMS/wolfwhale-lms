import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Badge } from '@/components/ui/badge'
import { BookOpen, Plus, Users, Copy } from 'lucide-react'

export default async function TeacherCoursesPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  if (!tenantId) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <p className="text-muted-foreground">No school context found.</p>
      </div>
    )
  }

  // Fetch teacher's courses
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name, description, subject, grade_level, semester, status, created_at')
    .eq('tenant_id', tenantId)
    .eq('created_by', user.id)
    .neq('status', 'archived')
    .order('created_at', { ascending: false })

  // Get student counts per course
  const courseIds = (courses || []).map((c) => c.id)
  const [enrollmentResult, codeResult, lessonResult] = await Promise.all([
    courseIds.length > 0
      ? supabase
          .from('course_enrollments')
          .select('course_id')
          .in('course_id', courseIds)
          .eq('status', 'active')
      : Promise.resolve({ data: [] }),
    courseIds.length > 0
      ? supabase
          .from('class_codes')
          .select('course_id, code')
          .in('course_id', courseIds)
          .eq('is_active', true)
      : Promise.resolve({ data: [] }),
    courseIds.length > 0
      ? supabase
          .from('lessons')
          .select('course_id')
          .in('course_id', courseIds)
      : Promise.resolve({ data: [] }),
  ])

  const enrollments = enrollmentResult.data || []
  const classCodes = codeResult.data || []
  const lessons = lessonResult.data || []

  const coursesWithMeta = (courses || []).map((course) => ({
    ...course,
    student_count: enrollments.filter((e) => e.course_id === course.id).length,
    lesson_count: lessons.filter((l) => l.course_id === course.id).length,
    class_code: classCodes.find((c) => c.course_id === course.id)?.code || null,
  }))

  const statusColor = (status: string) => {
    switch (status) {
      case 'active':
        return 'bg-[#33FF33]/10 text-[#33FF33] dark:bg-[#33FF33]/10 dark:text-[#33FF33]'
      case 'draft':
        return 'bg-[#FFAA00]/10 text-[#FFAA00] dark:bg-[#FFAA00]/10 dark:text-[#FFAA00]'
      case 'archived':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
      default:
        return ''
    }
  }

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Courses
          </h1>
          <p className="mt-1 text-muted-foreground">
            Create and manage your courses, lessons, and students.
          </p>
        </div>
        <Link
          href="/teacher/courses/new"
          className="whale-gradient inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
        >
          <Plus className="h-4 w-4" />
          Create Course
        </Link>
      </div>

      {/* Course Grid */}
      {coursesWithMeta.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <div className="mb-4 text-6xl opacity-40">
            <BookOpen className="h-16 w-16 text-muted-foreground" />
          </div>
          <h3 className="text-lg font-semibold text-foreground">
            No courses yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Create your first course to start organizing lessons and enrolling
            students.
          </p>
          <Link
            href="/teacher/courses/new"
            className="whale-gradient mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md transition-all hover:shadow-lg"
          >
            <Plus className="h-4 w-4" />
            Create Your First Course
          </Link>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {coursesWithMeta.map((course) => (
            <Link
              key={course.id}
              href={`/teacher/courses/${course.id}`}
              className="ocean-card group rounded-2xl p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-3 flex items-start justify-between">
                <div className="flex-1">
                  <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                    {course.name}
                  </h3>
                  {course.subject && (
                    <p className="mt-0.5 text-sm text-muted-foreground">
                      {course.subject}
                      {course.grade_level ? ` - Grade ${course.grade_level}` : ''}
                    </p>
                  )}
                </div>
                <span
                  className={`ml-2 inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-xs font-medium ${statusColor(course.status)}`}
                >
                  {course.status}
                </span>
              </div>

              {course.description && (
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              )}

              <div className="mt-auto flex items-center gap-4 border-t border-border pt-4 text-sm text-muted-foreground">
                <div className="flex items-center gap-1.5">
                  <Users className="h-4 w-4" />
                  <span>
                    {course.student_count}{' '}
                    {course.student_count === 1 ? 'student' : 'students'}
                  </span>
                </div>
                <div className="flex items-center gap-1.5">
                  <BookOpen className="h-4 w-4" />
                  <span>
                    {course.lesson_count}{' '}
                    {course.lesson_count === 1 ? 'lesson' : 'lessons'}
                  </span>
                </div>
              </div>

              {course.class_code && (
                <div className="mt-3 flex items-center gap-2 rounded-lg bg-muted/50 px-3 py-2 text-xs">
                  <span className="text-muted-foreground">Class Code:</span>
                  <code className="font-mono font-semibold text-primary">
                    {course.class_code}
                  </code>
                </div>
              )}
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
