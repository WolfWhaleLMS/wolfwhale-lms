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
      {/* Visual Header with Whale Gradient */}
      <div className="whale-gradient rounded-2xl p-8 text-white shadow-lg">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div>
            <div className="mb-2 flex items-center gap-3">
              <BookOpen className="h-8 w-8" />
              <h1 className="text-3xl font-bold tracking-tight">
                My Courses
              </h1>
            </div>
            <p className="text-white/90">
              View your enrolled courses and track your learning progress.
            </p>
            {coursesWithMeta.length > 0 && (
              <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <span className="text-2xl">{coursesWithMeta.length}</span>
                <span>Active Course{coursesWithMeta.length !== 1 ? 's' : ''}</span>
              </div>
            )}
          </div>
          <JoinCourseDialog />
        </div>
      </div>

      {/* Course Grid */}
      {coursesWithMeta.length === 0 ? (
        <div className="ocean-card relative overflow-hidden rounded-2xl py-20 text-center">
          <div className="blob-ocean absolute left-1/4 top-0 h-64 w-64 opacity-30" />
          <div className="blob-teal absolute bottom-0 right-1/4 h-64 w-64 opacity-30" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <div className="mb-4 text-6xl">🐋</div>
            <GraduationCap className="mb-4 h-16 w-16 text-primary/40" />
            <h3 className="text-xl font-bold text-foreground">
              Ready to Dive In?
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Join a course using a class code from your teacher to start your learning adventure!
            </p>
            <div className="mt-6">
              <JoinCourseDialog />
            </div>
          </div>
        </div>
      ) : (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {coursesWithMeta.map((course) => {
            const progressColor =
              course.progress_percentage === 100 ? 'bg-gradient-to-r from-[#33FF33] to-[#00FFFF]' :
              course.progress_percentage >= 70 ? 'bg-gradient-to-r from-[#00BFFF] to-[#00FFFF]' :
              course.progress_percentage >= 40 ? 'bg-gradient-to-r from-[#FFAA00] to-[#FFD700]' :
              'bg-gradient-to-r from-[#00BFFF] to-[#33FF33]'

            return (
              <Link
                key={course.id}
                href={`/student/courses/${course.id}`}
                className="ocean-card group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                {/* Progress indicator on top edge */}
                <div className="absolute left-0 right-0 top-0 h-1.5 bg-muted">
                  <div
                    className={`h-full transition-all duration-500 ${progressColor}`}
                    style={{ width: `${course.progress_percentage}%` }}
                  />
                </div>

                <div className="mb-3 flex items-start justify-between gap-2">
                  <div className="flex-1">
                    <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1">
                      {course.name}
                    </h3>
                    <div className="mt-1 flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-3.5 w-3.5" />
                      <span>{course.teacher_name}</span>
                    </div>
                  </div>
                  {course.progress_percentage === 100 && (
                    <div className="text-2xl animate-float">🏆</div>
                  )}
                </div>

                {course.subject && (
                  <div className="mb-3 flex flex-wrap items-center gap-2 text-xs">
                    <span className="rounded-full bg-gradient-to-r from-primary/20 to-primary/10 px-3 py-1 font-medium text-primary">
                      {course.subject}
                    </span>
                    {course.grade_level && (
                      <span className="rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">
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

                {/* Enhanced Progress Section */}
                <div className="mt-auto space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <BookOpen className="h-4 w-4" />
                      <span>{course.completed_lessons} / {course.lesson_count} lessons</span>
                    </div>
                    <span className={`text-lg font-bold ${
                      course.progress_percentage === 100 ? 'text-[#33FF33] dark:text-[#33FF33]' :
                      course.progress_percentage >= 70 ? 'text-[#00BFFF] dark:text-[#00BFFF]' :
                      course.progress_percentage >= 40 ? 'text-[#FFAA00] dark:text-[#FFD700]' :
                      'text-[#00BFFF] dark:text-[#00BFFF]'
                    }`}>
                      {course.progress_percentage}%
                    </span>
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full transition-all duration-500 ${progressColor} shadow-md`}
                      style={{ width: `${course.progress_percentage}%` }}
                    />
                  </div>
                </div>
              </Link>
            )
          })}
        </div>
      )}
    </div>
  )
}
