import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import {
  BookOpen,
  Users,
  ClipboardList,
  Clock,
  Plus,
  ChevronRight,
  GraduationCap,
  CalendarCheck,
  MessageSquare,
  Calendar,
  BarChart3,
} from 'lucide-react'
import { AnnouncementBanner } from '@/components/announcements/AnnouncementBanner'

export default async function TeacherDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  // Fetch teacher profile and courses in parallel to eliminate waterfall
  const [profileResult, courseDataResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('first_name, last_name, full_name')
      .eq('id', user.id)
      .single(),
    tenantId
      ? supabase
          .from('courses')
          .select('id, name, status, subject')
          .eq('tenant_id', tenantId)
          .eq('created_by', user.id)
          .neq('status', 'archived')
          .order('created_at', { ascending: false })
      : Promise.resolve({ data: null }),
  ])

  const profile = profileResult.data

  const teacherName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    'Teacher'

  // Time-of-day greeting
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // Fetch real data if tenant context exists
  interface TeacherCourse {
    id: string
    name: string
    status: string
    subject: string | null
    studentCount?: number
    lessonCount?: number
  }

  interface RecentSubmission {
    id: string
    studentName: string
    assignmentTitle: string
    courseName: string
    submittedAt: string
    status: string
    assignmentId: string
    courseId: string | undefined
  }

  let courses: TeacherCourse[] = (courseDataResult.data || []) as TeacherCourse[]
  let totalStudents = 0
  let pendingGrading = 0
  let recentSubmissions: RecentSubmission[] = []

  if (tenantId) {
    const courseIds = courses.map((c) => c.id)

    if (courseIds.length > 0) {
      // Get student counts, submissions, and grades in parallel
      const [enrollmentResult, submissionResult, lessonResult] =
        await Promise.all([
          supabase
            .from('course_enrollments')
            .select('id, course_id')
            .in('course_id', courseIds)
            .eq('status', 'active'),
          supabase
            .from('submissions')
            .select(
              'id, assignment_id, student_id, status, submitted_at, content'
            )
            .eq('tenant_id', tenantId)
            .in('course_id', courseIds)
            .order('submitted_at', { ascending: false })
            .limit(10),
          supabase
            .from('lessons')
            .select('id, course_id')
            .in('course_id', courseIds),
        ])

      const enrollments = enrollmentResult.data || []
      totalStudents = new Set(enrollments.map((e) => e.id)).size

      // Enrich courses with counts
      const lessons = lessonResult.data || []
      courses = courses.map((c) => ({
        ...c,
        studentCount: enrollments.filter((e) => e.course_id === c.id).length,
        lessonCount: lessons.filter((l) => l.course_id === c.id).length,
      }))

      // Count ungraded submissions
      const submissions = submissionResult.data || []
      pendingGrading = submissions.filter(
        (s) => s.status === 'submitted'
      ).length

      // Batch-fetch student profiles and assignment info in parallel
      const studentIds = [
        ...new Set(submissions.map((s) => s.student_id)),
      ]
      const assignmentIds = [
        ...new Set(submissions.map((s) => s.assignment_id)),
      ]
      if (studentIds.length > 0) {
        const [{ data: profiles }, { data: assignments }] = await Promise.all([
          supabase
            .from('profiles')
            .select('id, first_name, last_name')
            .in('id', studentIds),
          supabase
            .from('assignments')
            .select('id, title, course_id')
            .in('id', assignmentIds),
        ])

        const profileMap = new Map(
          (profiles || []).map((p) => [
            p.id,
            `${p.first_name || ''} ${p.last_name || ''}`.trim() || 'Student',
          ])
        )

        const assignmentMap = new Map(
          (assignments || []).map((a) => [a.id, a])
        )
        const courseMap = new Map(courses.map((c) => [c.id, c.name]))

        recentSubmissions = submissions.slice(0, 5).map((s) => {
          const assignment = assignmentMap.get(s.assignment_id)
          return {
            id: s.id,
            studentName: profileMap.get(s.student_id) || 'Student',
            assignmentTitle: assignment?.title || 'Assignment',
            courseName: courseMap.get(assignment?.course_id) || 'Course',
            submittedAt: s.submitted_at,
            status: s.status,
            assignmentId: s.assignment_id,
            courseId: assignment?.course_id,
          }
        })
      }
    }
  }

  function formatTimeAgo(dateStr: string) {
    const date = new Date(dateStr)
    const now = new Date()
    const diffMs = now.getTime() - date.getTime()
    const diffHours = Math.floor(diffMs / (1000 * 60 * 60))
    const diffDays = Math.floor(diffHours / 24)
    if (diffDays > 0) return `${diffDays}d ago`
    if (diffHours > 0) return `${diffHours}h ago`
    return 'Just now'
  }

  const currentDate = new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  })

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden max-w-full">
      {/* Pinned Announcements */}
      <Suspense fallback={null}>
        <AnnouncementBanner />
      </Suspense>

      {/* Welcome Header */}
      <div className="ocean-card rounded-2xl p-4 sm:p-6">
        <div className="mb-3 sm:mb-4">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-outlined break-words">
            {greeting}, {teacherName}
          </h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            {currentDate} &mdash; You&apos;re making a difference today.
          </p>
        </div>

        {/* Quick Stats Row */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-4">
          <div className="rounded-xl border border-border bg-muted/30 p-3 sm:p-4 text-center">
            <BookOpen className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            <p className="text-2xl sm:text-3xl font-bold text-primary">{courses.length}</p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Courses</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3 sm:p-4 text-center">
            <Users className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-[#00BFFF]" />
            <p className="text-2xl sm:text-3xl font-bold text-[#00BFFF] dark:text-[#00BFFF]">
              {totalStudents}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Students</p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3 sm:p-4 text-center">
            <ClipboardList className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-[#D97706]" />
            <p className="text-2xl sm:text-3xl font-bold text-[#D97706] dark:text-[#D97706]">
              {pendingGrading}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">
              Pending Grading
            </p>
          </div>
          <div className="rounded-xl border border-border bg-muted/30 p-3 sm:p-4 text-center">
            <Clock className="mx-auto mb-1 h-4 w-4 sm:h-5 sm:w-5 text-[#059669]" />
            <p className="text-2xl sm:text-3xl font-bold text-[#059669] dark:text-[#059669]">
              {courses.reduce((s, c) => s + (c.lessonCount || 0), 0)}
            </p>
            <p className="mt-1 text-xs sm:text-sm text-muted-foreground">Total Lessons</p>
          </div>
        </div>
      </div>

      {/* Quick Actions */}
      <div className="ocean-card rounded-2xl p-4 sm:p-6">
        <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-foreground text-outlined">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 md:grid-cols-5">
          <Link
            href="/teacher/courses/new"
            className="group flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl border border-border bg-gradient-to-br from-primary/10 to-primary/5 p-3 sm:p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-primary/20">
              <Plus className="h-4 w-4 sm:h-6 sm:w-6 text-primary" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-foreground text-center">
              Create Course
            </span>
          </Link>

          <Link
            href="/teacher/courses"
            className="group flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl border border-border bg-gradient-to-br from-[#00BFFF]/10 to-[#00BFFF]/5 p-3 sm:p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#00BFFF]/20">
              <BookOpen className="h-4 w-4 sm:h-6 sm:w-6 text-[#00BFFF]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-foreground text-center">
              My Courses
            </span>
          </Link>

          <Link
            href="/teacher/gradebook"
            className="group flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl border border-border bg-gradient-to-br from-[#33FF33]/10 to-[#33FF33]/5 p-3 sm:p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#33FF33]/20">
              <GraduationCap className="h-4 w-4 sm:h-6 sm:w-6 text-[#059669]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-foreground text-center">
              Gradebook
            </span>
          </Link>

          <Link
            href="/messaging"
            className="group flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl border border-border bg-gradient-to-br from-[#00BFFF]/10 to-[#00BFFF]/5 p-3 sm:p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#00BFFF]/20">
              <MessageSquare className="h-4 w-4 sm:h-6 sm:w-6 text-[#00BFFF]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-foreground text-center">
              Messages
            </span>
          </Link>

          <Link
            href="/calendar"
            className="group flex flex-col items-center gap-1.5 sm:gap-2 rounded-xl border border-border bg-gradient-to-br from-[#00FFFF]/10 to-[#00FFFF]/5 p-3 sm:p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <div className="flex h-9 w-9 sm:h-12 sm:w-12 items-center justify-center rounded-full bg-[#00FFFF]/20">
              <Calendar className="h-4 w-4 sm:h-6 sm:w-6 text-[#00FFFF]" />
            </div>
            <span className="text-xs sm:text-sm font-semibold text-foreground text-center">
              Calendar
            </span>
          </Link>
        </div>
      </div>

      {/* My Courses */}
      <div className="ocean-card rounded-2xl p-4 sm:p-6">
        <div className="mb-3 sm:mb-4 flex items-center justify-between">
          <h2 className="text-lg sm:text-xl font-bold text-foreground text-outlined">My Courses</h2>
          <Link
            href="/teacher/courses"
            className="text-sm text-primary hover:underline"
          >
            View All
          </Link>
        </div>

        {courses.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-12 text-center">
            <BookOpen className="mb-3 h-12 w-12 text-muted-foreground/40" />
            <h3 className="text-lg font-semibold text-foreground">
              No courses yet
            </h3>
            <p className="mt-1 max-w-sm text-sm text-muted-foreground">
              Create your first course to start building lessons and enrolling
              students.
            </p>
            <Link
              href="/teacher/courses/new"
              className="whale-gradient mt-4 inline-flex items-center gap-2 rounded-lg px-4 py-2.5 text-sm font-medium text-white shadow-md"
            >
              <Plus className="h-4 w-4" />
              Create Your First Course
            </Link>
          </div>
        ) : (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 md:grid-cols-2 lg:grid-cols-3">
            {courses.slice(0, 6).map((course) => (
              <Link
                key={course.id}
                href={`/teacher/courses/${course.id}`}
                className="group rounded-xl border border-border p-3 sm:p-4 transition-all hover:shadow-md hover:border-primary/30"
              >
                <div className="mb-2 flex items-start justify-between gap-2 min-w-0">
                  <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-1 min-w-0">
                    {course.name}
                  </h3>
                  <ChevronRight className="h-4 w-4 text-muted-foreground group-hover:text-primary shrink-0" />
                </div>
                {course.subject && (
                  <p className="mb-3 text-sm text-muted-foreground">
                    {course.subject}
                  </p>
                )}
                <div className="flex items-center gap-3 text-sm text-muted-foreground">
                  <span className="flex items-center gap-1">
                    <Users className="h-3.5 w-3.5" />
                    {course.studentCount || 0} students
                  </span>
                  <span className="flex items-center gap-1">
                    <BookOpen className="h-3.5 w-3.5" />
                    {course.lessonCount || 0} lessons
                  </span>
                </div>
              </Link>
            ))}
          </div>
        )}
      </div>

      {/* Recent Submissions */}
      {recentSubmissions.length > 0 && (
        <div className="ocean-card rounded-2xl p-4 sm:p-6">
          <h2 className="mb-3 sm:mb-4 text-lg sm:text-xl font-bold text-foreground text-outlined">
            Recent Submissions
          </h2>
          {/* Mobile card view */}
          <div className="space-y-3 sm:hidden">
            {recentSubmissions.map((sub) => (
              <div
                key={sub.id}
                className="rounded-xl border border-border p-3"
              >
                <div className="flex items-start justify-between gap-2 mb-1">
                  <p className="font-medium text-foreground text-sm truncate">{sub.studentName}</p>
                  {sub.status === 'submitted' ? (
                    <Link
                      href={`/teacher/courses/${sub.courseId}/assignments/${sub.assignmentId}/submissions`}
                      className="rounded-lg bg-primary px-2.5 py-0.5 text-xs font-medium text-white transition-colors hover:bg-primary/90 shrink-0"
                    >
                      Grade
                    </Link>
                  ) : (
                    <span className="text-xs text-[#059669] dark:text-[#059669] shrink-0">
                      Graded
                    </span>
                  )}
                </div>
                <p className="text-xs text-muted-foreground truncate">{sub.assignmentTitle}</p>
                <div className="mt-1 flex items-center gap-2 text-xs text-muted-foreground">
                  <span className="truncate">{sub.courseName}</span>
                  <span className="shrink-0">{formatTimeAgo(sub.submittedAt)}</span>
                </div>
              </div>
            ))}
          </div>
          {/* Desktop table view */}
          <div className="hidden sm:block overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Student
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Assignment
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Course
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Time
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {recentSubmissions.map((sub) => (
                    <tr
                      key={sub.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3 font-medium text-foreground">
                        {sub.studentName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {sub.assignmentTitle}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {sub.courseName}
                      </td>
                      <td className="px-4 py-3 text-sm text-muted-foreground">
                        {formatTimeAgo(sub.submittedAt)}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {sub.status === 'submitted' ? (
                          <Link
                            href={`/teacher/courses/${sub.courseId}/assignments/${sub.assignmentId}/submissions`}
                            className="rounded-lg bg-primary px-3 py-1 text-xs font-medium text-white transition-colors hover:bg-primary/90"
                          >
                            Grade
                          </Link>
                        ) : (
                          <span className="text-xs text-[#059669] dark:text-[#059669]">
                            Graded
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
