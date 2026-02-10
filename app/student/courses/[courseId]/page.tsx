import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect, notFound } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { Progress } from '@/components/ui/progress'
import {
  ArrowLeft,
  BookOpen,
  CheckCircle2,
  Circle,
  Clock,
  PlayCircle,
  Lock,
  User,
} from 'lucide-react'

export default async function StudentCourseDetailPage({
  params,
}: {
  params: Promise<{ courseId: string }>
}) {
  const { courseId } = await params

  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  if (!tenantId) return notFound()

  // Verify enrollment
  const { data: enrollment } = await supabase
    .from('course_enrollments')
    .select('id, status')
    .eq('course_id', courseId)
    .eq('student_id', user.id)
    .eq('status', 'active')
    .maybeSingle()

  if (!enrollment) {
    return (
      <div className="flex flex-col items-center justify-center py-20 text-center">
        <Lock className="mb-4 h-12 w-12 text-muted-foreground/40" />
        <h2 className="text-xl font-semibold text-foreground">
          Access Denied
        </h2>
        <p className="mt-2 text-muted-foreground">
          You are not enrolled in this course.
        </p>
        <Link
          href="/student/courses"
          className="whale-gradient mt-6 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white"
        >
          Back to My Courses
        </Link>
      </div>
    )
  }

  // Fetch course
  const { data: course, error } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single()

  if (error || !course) return notFound()

  // Fetch lessons, teacher profile, and progress in parallel
  const [lessonResult, teacherResult, progressResult] = await Promise.all([
    supabase
      .from('lessons')
      .select(
        'id, title, description, order_index, status, duration_minutes, learning_objectives'
      )
      .eq('course_id', courseId)
      .order('order_index', { ascending: true }),
    supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .eq('id', course.created_by)
      .single(),
    supabase
      .from('lesson_progress')
      .select('lesson_id, status, progress_percentage, completed_at')
      .eq('user_id', user.id),
  ])

  const lessons = lessonResult.data || []
  const teacher = teacherResult.data
  const progressData = progressResult.data || []

  const teacherName = teacher
    ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() ||
      'Teacher'
    : 'Teacher'

  // Calculate overall progress
  const completedLessons = lessons.filter((l) =>
    progressData.some(
      (p) => p.lesson_id === l.id && p.status === 'completed'
    )
  )
  const inProgressLessons = lessons.filter((l) =>
    progressData.some(
      (p) => p.lesson_id === l.id && p.status === 'in_progress'
    )
  )

  const overallProgress =
    lessons.length > 0
      ? Math.round((completedLessons.length / lessons.length) * 100)
      : 0

  const getLessonStatus = (lessonId: string) => {
    const progress = progressData.find((p) => p.lesson_id === lessonId)
    if (!progress) return 'not_started'
    return progress.status
  }

  const statusIcon = (status: string) => {
    switch (status) {
      case 'completed':
        return (
          <CheckCircle2 className="h-5 w-5 text-green-500 dark:text-green-400" />
        )
      case 'in_progress':
        return (
          <PlayCircle className="h-5 w-5 text-blue-500 dark:text-blue-400" />
        )
      default:
        return <Circle className="h-5 w-5 text-muted-foreground/40" />
    }
  }

  const totalDuration = lessons.reduce(
    (sum, l) => sum + (l.duration_minutes || 0),
    0
  )

  return (
    <div className="space-y-8">
      {/* Breadcrumb */}
      <Link
        href="/student/courses"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to My Courses
      </Link>

      {/* Course Header */}
      <div className="ocean-card rounded-2xl p-6">
        <h1 className="text-2xl font-bold text-foreground">{course.name}</h1>

        {course.description && (
          <p className="mt-2 text-muted-foreground">{course.description}</p>
        )}

        <div className="mt-4 flex flex-wrap items-center gap-4 text-sm text-muted-foreground">
          <div className="flex items-center gap-1.5">
            <User className="h-4 w-4" />
            <span>{teacherName}</span>
          </div>
          {course.subject && (
            <span className="rounded-md bg-muted px-2 py-1">
              {course.subject}
            </span>
          )}
          {course.grade_level && (
            <span className="rounded-md bg-muted px-2 py-1">
              Grade {course.grade_level}
            </span>
          )}
          {totalDuration > 0 && (
            <div className="flex items-center gap-1.5">
              <Clock className="h-4 w-4" />
              <span>{totalDuration} min total</span>
            </div>
          )}
        </div>

        {/* Overall Progress */}
        <div className="mt-6 space-y-2">
          <div className="flex items-center justify-between text-sm">
            <span className="text-muted-foreground">
              {completedLessons.length} of {lessons.length} lessons completed
            </span>
            <span className="font-semibold text-foreground">
              {overallProgress}%
            </span>
          </div>
          <Progress value={overallProgress} className="h-3" />
        </div>
      </div>

      {/* Lesson List */}
      <div className="space-y-4">
        <h2 className="text-lg font-semibold text-foreground">Lessons</h2>

        {lessons.length === 0 ? (
          <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
            <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground">
              No lessons available yet
            </h3>
            <p className="mt-1 text-sm text-muted-foreground">
              Your teacher has not added lessons to this course yet. Check back
              soon.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            {lessons.map((lesson, index) => {
              const status = getLessonStatus(lesson.id)
              const isPublished = lesson.status === 'published'

              return (
                <div key={lesson.id}>
                  {isPublished ? (
                    <Link
                      href={`/student/courses/${courseId}/lessons/${lesson.id}`}
                      className="ocean-card group flex items-center gap-4 rounded-xl p-4 transition-all hover:shadow-md hover:bg-muted/30"
                    >
                      <div className="shrink-0">
                        {statusIcon(status)}
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-sm font-bold text-primary">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                          {lesson.title}
                        </h4>
                        {lesson.description && (
                          <p className="mt-0.5 text-sm text-muted-foreground truncate">
                            {lesson.description}
                          </p>
                        )}
                      </div>
                      <div className="shrink-0 flex items-center gap-3 text-xs text-muted-foreground">
                        {lesson.duration_minutes && (
                          <span className="flex items-center gap-1">
                            <Clock className="h-3.5 w-3.5" />
                            {lesson.duration_minutes} min
                          </span>
                        )}
                        {status === 'completed' && (
                          <span className="rounded-full bg-green-100 px-2 py-0.5 text-green-700 dark:bg-green-900/30 dark:text-green-400">
                            Completed
                          </span>
                        )}
                        {status === 'in_progress' && (
                          <span className="rounded-full bg-blue-100 px-2 py-0.5 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            In Progress
                          </span>
                        )}
                      </div>
                    </Link>
                  ) : (
                    <div className="ocean-card flex items-center gap-4 rounded-xl p-4 opacity-50">
                      <div className="shrink-0">
                        <Lock className="h-5 w-5 text-muted-foreground/40" />
                      </div>
                      <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-muted text-sm font-bold text-muted-foreground">
                        {index + 1}
                      </div>
                      <div className="flex-1 min-w-0">
                        <h4 className="font-medium text-muted-foreground truncate">
                          {lesson.title}
                        </h4>
                        <p className="mt-0.5 text-sm text-muted-foreground">
                          Not yet available
                        </p>
                      </div>
                    </div>
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}
