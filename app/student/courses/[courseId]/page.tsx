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
  ListTodo,
  HelpCircle,
  ChevronRight,
  FolderOpen,
  AlertCircle,
  Send,
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

  // Fetch lessons, teacher, progress, modules, assignments, quizzes, and submissions in parallel
  const [
    lessonResult,
    teacherResult,
    progressResult,
    moduleResult,
    assignmentResult,
    submissionResult,
    quizResult,
  ] = await Promise.all([
    supabase
      .from('lessons')
      .select(
        'id, title, description, order_index, status, duration_minutes, learning_objectives, module_id'
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
    supabase
      .from('modules')
      .select('id, title, description, order_index, status')
      .eq('course_id', courseId)
      .order('order_index', { ascending: true }),
    supabase
      .from('assignments')
      .select('id, title, type, due_date, max_points, submission_type, status')
      .eq('course_id', courseId)
      .eq('tenant_id', tenantId)
      .eq('status', 'assigned')
      .order('due_date', { ascending: true }),
    supabase
      .from('submissions')
      .select('assignment_id, status, submitted_at')
      .eq('student_id', user.id)
      .eq('tenant_id', tenantId),
    supabase
      .from('quizzes')
      .select('id, title, time_limit_minutes, max_attempts, passing_score, status')
      .eq('course_id', courseId)
      .eq('tenant_id', tenantId)
      .eq('status', 'published'),
  ])

  const lessons = lessonResult.data || []
  const teacher = teacherResult.data
  const progressData = progressResult.data || []
  const modules = moduleResult.data || []
  const assignments = assignmentResult.data || []
  const submissions = submissionResult.data || []
  const quizzes = quizResult.data || []

  const teacherName = teacher
    ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim() ||
      'Teacher'
    : 'Teacher'

  // Build submission lookup
  const submissionMap: Record<string, { status: string; submitted_at: string }> = {}
  for (const s of submissions) {
    submissionMap[s.assignment_id] = { status: s.status, submitted_at: s.submitted_at }
  }

  // Calculate overall progress
  const completedLessons = lessons.filter((l) =>
    progressData.some(
      (p) => p.lesson_id === l.id && p.status === 'completed'
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

  // Group lessons by module
  const hasModules = modules.length > 0
  const publishedModules = modules.filter((m) => m.status === 'published' || m.status === 'active')

  // Helper to get assignment status display for a student
  function getAssignmentDisplayStatus(assignmentId: string, dueDate: string | null) {
    const sub = submissionMap[assignmentId]
    if (sub?.status === 'graded') return 'graded'
    if (sub?.status === 'returned') return 'returned'
    if (sub?.status === 'submitted') return 'submitted'
    if (dueDate && new Date(dueDate) < new Date()) return 'overdue'
    return 'pending'
  }

  const assignmentStatusBadge = (status: string) => {
    switch (status) {
      case 'graded':
        return (
          <span className="rounded-full bg-[#33FF33]/10 px-2 py-0.5 text-xs font-medium text-[#059669] dark:text-[#059669]">
            Graded
          </span>
        )
      case 'submitted':
        return (
          <span className="rounded-full bg-[#00BFFF]/10 px-2 py-0.5 text-xs font-medium text-[#00BFFF]">
            Submitted
          </span>
        )
      case 'returned':
        return (
          <span className="rounded-full bg-[#FFAA00]/10 px-2 py-0.5 text-xs font-medium text-[#D97706] dark:text-[#FFD700]">
            Returned
          </span>
        )
      case 'overdue':
        return (
          <span className="rounded-full bg-red-100 px-2 py-0.5 text-xs font-medium text-red-700 dark:bg-red-900/30 dark:text-red-400">
            Overdue
          </span>
        )
      default:
        return (
          <span className="rounded-full bg-gray-100 px-2 py-0.5 text-xs font-medium text-gray-600 dark:bg-gray-800 dark:text-gray-300">
            Pending
          </span>
        )
    }
  }

  // Render a single lesson row
  function renderLessonRow(lesson: (typeof lessons)[0], index: number) {
    const status = getLessonStatus(lesson.id)
    const isPublished = lesson.status === 'published'

    if (isPublished) {
      return (
        <Link
          key={lesson.id}
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
      )
    }

    return (
      <div key={lesson.id} className="ocean-card flex items-center gap-4 rounded-xl p-4 opacity-50">
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
    )
  }

  // Find the next lesson to continue (first in_progress, or first not_started)
  const nextLesson = lessons.find((l) => {
    const s = getLessonStatus(l.id)
    return l.status === 'published' && s === 'in_progress'
  }) || lessons.find((l) => {
    const s = getLessonStatus(l.id)
    return l.status === 'published' && s === 'not_started'
  })

  // Count pending assignments
  const pendingAssignments = assignments.filter((a) => {
    const status = getAssignmentDisplayStatus(a.id, a.due_date)
    return status === 'pending' || status === 'overdue' || status === 'returned'
  })

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

        {/* Quick Action: Continue Learning */}
        {nextLesson && (
          <Link
            href={`/student/courses/${courseId}/lessons/${nextLesson.id}`}
            className="whale-gradient mt-5 inline-flex items-center gap-2 rounded-xl px-5 py-3 text-sm font-medium text-white shadow-sm transition-all hover:shadow-md"
          >
            <PlayCircle className="h-4 w-4" />
            Continue: {nextLesson.title}
            <ChevronRight className="h-4 w-4" />
          </Link>
        )}
      </div>

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        <div className="ocean-card rounded-2xl p-4 text-center">
          <BookOpen className="mx-auto mb-1 h-5 w-5 text-primary" />
          <p className="text-2xl font-bold text-primary">{lessons.filter(l => l.status === 'published').length}</p>
          <p className="text-xs text-muted-foreground">Lessons</p>
        </div>
        <div className="ocean-card rounded-2xl p-4 text-center">
          <CheckCircle2 className="mx-auto mb-1 h-5 w-5 text-[#059669]" />
          <p className="text-2xl font-bold text-[#059669]">{completedLessons.length}</p>
          <p className="text-xs text-muted-foreground">Completed</p>
        </div>
        <div className="ocean-card rounded-2xl p-4 text-center">
          <ListTodo className="mx-auto mb-1 h-5 w-5 text-[#00BFFF]" />
          <p className="text-2xl font-bold text-[#00BFFF]">{assignments.length}</p>
          <p className="text-xs text-muted-foreground">Assignments</p>
        </div>
        <div className="ocean-card rounded-2xl p-4 text-center">
          <HelpCircle className="mx-auto mb-1 h-5 w-5 text-[#D97706]" />
          <p className="text-2xl font-bold text-[#D97706]">{quizzes.length}</p>
          <p className="text-xs text-muted-foreground">Quizzes</p>
        </div>
      </div>

      {/* Pending Assignments Alert */}
      {pendingAssignments.length > 0 && (
        <div className="rounded-2xl border-2 border-[#FFAA00]/30 bg-[#FFAA00]/5 p-5 dark:border-[#FFD700]/30 dark:bg-[#FFD700]/5">
          <div className="flex items-start gap-3">
            <AlertCircle className="mt-0.5 h-5 w-5 shrink-0 text-[#D97706] dark:text-[#FFD700]" />
            <div className="flex-1">
              <h3 className="font-semibold text-foreground">
                {pendingAssignments.length} assignment{pendingAssignments.length !== 1 ? 's' : ''} need{pendingAssignments.length === 1 ? 's' : ''} your attention
              </h3>
              <div className="mt-3 space-y-2">
                {pendingAssignments.slice(0, 3).map((a) => {
                  const displayStatus = getAssignmentDisplayStatus(a.id, a.due_date)
                  return (
                    <Link
                      key={a.id}
                      href={`/student/assignments/${a.id}`}
                      className="group flex items-center justify-between rounded-xl border border-border bg-background p-3 transition-all hover:bg-muted/30 hover:shadow-sm"
                    >
                      <div className="flex items-center gap-2 min-w-0">
                        <Send className="h-4 w-4 shrink-0 text-muted-foreground" />
                        <span className="truncate text-sm font-medium text-foreground group-hover:text-primary">
                          {a.title}
                        </span>
                        {assignmentStatusBadge(displayStatus)}
                      </div>
                      <div className="shrink-0 flex items-center gap-2 text-xs text-muted-foreground">
                        {a.due_date && (
                          <span>
                            Due {new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                          </span>
                        )}
                        <ChevronRight className="h-3.5 w-3.5" />
                      </div>
                    </Link>
                  )
                })}
                {pendingAssignments.length > 3 && (
                  <p className="text-xs text-muted-foreground pl-6">
                    +{pendingAssignments.length - 3} more
                  </p>
                )}
              </div>
            </div>
          </div>
        </div>
      )}

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
        ) : hasModules && publishedModules.length > 0 ? (
          /* Module-grouped lessons */
          <div className="space-y-6">
            {publishedModules.map((mod) => {
              const moduleLessons = lessons.filter((l) => (l as any).module_id === mod.id)
              if (moduleLessons.length === 0) return null

              const moduleCompletedCount = moduleLessons.filter((l) =>
                progressData.some((p) => p.lesson_id === l.id && p.status === 'completed')
              ).length

              return (
                <div key={mod.id} className="space-y-2">
                  <div className="flex items-center gap-2 px-1">
                    <FolderOpen className="h-4 w-4 text-primary" />
                    <h3 className="text-base font-semibold text-foreground">{mod.title}</h3>
                    <span className="text-xs text-muted-foreground">
                      ({moduleCompletedCount}/{moduleLessons.length} done)
                    </span>
                  </div>
                  {mod.description && (
                    <p className="px-1 text-sm text-muted-foreground">{mod.description}</p>
                  )}
                  <div className="space-y-2 pl-2">
                    {moduleLessons.map((lesson, index) => renderLessonRow(lesson, index))}
                  </div>
                </div>
              )
            })}

            {/* Lessons without a module */}
            {(() => {
              const unmoduled = lessons.filter((l) => !(l as any).module_id)
              if (unmoduled.length === 0) return null
              return (
                <div className="space-y-2">
                  {publishedModules.length > 0 && (
                    <div className="flex items-center gap-2 px-1">
                      <BookOpen className="h-4 w-4 text-muted-foreground" />
                      <h3 className="text-base font-semibold text-foreground">Other Lessons</h3>
                    </div>
                  )}
                  <div className="space-y-2">
                    {unmoduled.map((lesson, index) => renderLessonRow(lesson, index))}
                  </div>
                </div>
              )
            })()}
          </div>
        ) : (
          /* Flat lesson list */
          <div className="space-y-2">
            {lessons.map((lesson, index) => renderLessonRow(lesson, index))}
          </div>
        )}
      </div>

      {/* Assignments Section */}
      {assignments.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Assignments</h2>
            <span className="text-sm text-muted-foreground">{assignments.length} total</span>
          </div>
          <div className="space-y-2">
            {assignments.map((a) => {
              const displayStatus = getAssignmentDisplayStatus(a.id, a.due_date)
              const isOverdue = displayStatus === 'overdue'

              return (
                <Link
                  key={a.id}
                  href={`/student/assignments/${a.id}`}
                  className={`ocean-card group flex items-center gap-4 rounded-xl p-4 transition-all hover:shadow-md hover:bg-muted/30 ${
                    isOverdue ? 'ring-1 ring-red-500/30' : ''
                  }`}
                >
                  <div className="shrink-0">
                    {displayStatus === 'graded' ? (
                      <CheckCircle2 className="h-5 w-5 text-[#059669]" />
                    ) : displayStatus === 'submitted' ? (
                      <CheckCircle2 className="h-5 w-5 text-[#00BFFF]" />
                    ) : isOverdue ? (
                      <AlertCircle className="h-5 w-5 text-red-500" />
                    ) : (
                      <ListTodo className="h-5 w-5 text-muted-foreground/60" />
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                      {a.title}
                    </h4>
                    <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                      <span className="capitalize">{a.type}</span>
                      <span className="text-border">|</span>
                      <span>{a.max_points} pts</span>
                    </div>
                  </div>
                  <div className="shrink-0 flex items-center gap-3 text-xs text-muted-foreground">
                    {a.due_date && (
                      <span className={`flex items-center gap-1 ${isOverdue ? 'font-bold text-red-600 dark:text-red-400' : ''}`}>
                        <Clock className="h-3.5 w-3.5" />
                        {new Date(a.due_date).toLocaleDateString('en-US', { month: 'short', day: 'numeric' })}
                      </span>
                    )}
                    {assignmentStatusBadge(displayStatus)}
                  </div>
                </Link>
              )
            })}
          </div>
        </div>
      )}

      {/* Quizzes Section */}
      {quizzes.length > 0 && (
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold text-foreground">Quizzes</h2>
            <Link
              href={`/student/courses/${courseId}/quizzes`}
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>
          <div className="space-y-2">
            {quizzes.slice(0, 5).map((quiz) => (
              <Link
                key={quiz.id}
                href={`/student/courses/${courseId}/quizzes/${quiz.id}`}
                className="ocean-card group flex items-center gap-4 rounded-xl p-4 transition-all hover:shadow-md hover:bg-muted/30"
              >
                <div className="shrink-0">
                  <HelpCircle className="h-5 w-5 text-[#D97706]" />
                </div>
                <div className="flex-1 min-w-0">
                  <h4 className="font-medium text-foreground group-hover:text-primary transition-colors truncate">
                    {quiz.title}
                  </h4>
                  <div className="mt-0.5 flex items-center gap-2 text-xs text-muted-foreground">
                    {quiz.time_limit_minutes && (
                      <span className="flex items-center gap-1">
                        <Clock className="h-3 w-3" />
                        {quiz.time_limit_minutes} min
                      </span>
                    )}
                    <span>{quiz.passing_score}% to pass</span>
                    <span>{quiz.max_attempts} attempt{quiz.max_attempts !== 1 ? 's' : ''}</span>
                  </div>
                </div>
                <ChevronRight className="h-4 w-4 shrink-0 text-muted-foreground group-hover:text-primary" />
              </Link>
            ))}
          </div>
        </div>
      )}
    </div>
  )
}
