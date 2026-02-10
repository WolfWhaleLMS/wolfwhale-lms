import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Progress } from '@/components/ui/progress'
import { BookOpen, Users, GraduationCap } from 'lucide-react'
import { JoinCourseDialog } from './join-course-dialog'

export default async function StudentCoursesPage() {
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

  // Fetch enrolled courses
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select(`
      id,
      course_id,
      status,
      enrolled_at,
      courses (
        id,
        name,
        description,
        subject,
        grade_level,
        created_by,
        status
      )
    `)
    .eq('tenant_id', tenantId)
    .eq('student_id', user.id)
    .eq('status', 'active')
    .order('enrolled_at', { ascending: false })

  const courseData = (enrollments || [])
    .filter((e) => e.courses)
    .map((e) => ({
      enrollment_id: e.id,
      enrolled_at: e.enrolled_at,
      ...(e.courses as any),
    }))

  // Get teacher names, lesson counts, and progress
  const teacherIds = [...new Set(courseData.map((c) => c.created_by))]
  const courseIds = courseData.map((c) => c.id)

  const [profileResult, lessonResult, progressResult] = await Promise.all([
    teacherIds.length > 0
      ? supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', teacherIds)
      : Promise.resolve({ data: [] }),
    courseIds.length > 0
      ? supabase
          .from('lessons')
          .select('id, course_id')
          .in('course_id', courseIds)
      : Promise.resolve({ data: [] }),
    courseIds.length > 0
      ? supabase
          .from('lesson_progress')
          .select('lesson_id, status')
          .eq('user_id', user.id)
          .eq('status', 'completed')
      : Promise.resolve({ data: [] }),
  ])

  const profiles = profileResult.data || []
  const lessons = lessonResult.data || []
  const progress = progressResult.data || []

  const coursesWithMeta = courseData.map((course) => {
    const teacher = profiles.find((p) => p.id === course.created_by)
    const courseLessons = lessons.filter((l) => l.course_id === course.id)
    const completedLessons = courseLessons.filter((l) =>
      progress.some((p) => p.lesson_id === l.id)
    )
    const progressPct =
      courseLessons.length > 0
        ? Math.round((completedLessons.length / courseLessons.length) * 100)
        : 0

    return {
      ...course,
      teacher_name: teacher
        ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() ||
          'Teacher'
        : 'Teacher',
      lesson_count: courseLessons.length,
      completed_lessons: completedLessons.length,
      progress_percentage: progressPct,
    }
  })

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            My Courses
          </h1>
          <p className="mt-1 text-muted-foreground">
            View your enrolled courses and track your learning progress.
          </p>
        </div>
        <JoinCourseDialog />
      </div>

      {/* Course Grid */}
      {coursesWithMeta.length === 0 ? (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-20 text-center">
          <GraduationCap className="mb-4 h-16 w-16 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-foreground">
            No courses yet
          </h3>
          <p className="mt-2 max-w-sm text-sm text-muted-foreground">
            Join a course using a class code from your teacher to start
            learning.
          </p>
          <div className="mt-6">
            <JoinCourseDialog />
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {coursesWithMeta.map((course) => (
            <Link
              key={course.id}
              href={`/student/courses/${course.id}`}
              className="ocean-card group rounded-2xl p-6 transition-all hover:shadow-lg"
            >
              <div className="mb-3">
                <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                  {course.name}
                </h3>
                <p className="mt-0.5 text-sm text-muted-foreground">
                  {course.teacher_name}
                </p>
              </div>

              {course.subject && (
                <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                  <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
                    {course.subject}
                  </span>
                  {course.grade_level && (
                    <span className="rounded-md bg-muted px-2 py-1 text-muted-foreground">
                      Grade {course.grade_level}
                    </span>
                  )}
                </div>
              )}

              {course.description && (
                <p className="mb-4 text-sm text-muted-foreground line-clamp-2">
                  {course.description}
                </p>
              )}

              {/* Progress */}
              <div className="mt-auto space-y-2 border-t border-border pt-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="text-muted-foreground">
                    {course.completed_lessons} / {course.lesson_count} lessons
                  </span>
                  <span className="font-medium text-foreground">
                    {course.progress_percentage}%
                  </span>
                </div>
                <Progress value={course.progress_percentage} className="h-2" />
              </div>
            </Link>
          ))}
        </div>
      )}
    </div>
  )
}
