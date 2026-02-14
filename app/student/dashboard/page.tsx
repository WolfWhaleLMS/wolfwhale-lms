import Link from 'next/link'
import Image from 'next/image'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { getLetterGrade } from '@/lib/config/constants'
import {
  Sparkles,
  Zap,
  BookOpen,
  Target,
  Rocket,
  ChevronRight,
  Clock,
  PartyPopper,
  GraduationCap,
  MessageCircle,
  CalendarDays,
  Calendar,
} from 'lucide-react'
import { AnnouncementBanner } from '@/components/announcements/AnnouncementBanner'
import { CircularGauge } from '@/components/ui/circular-gauge'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  // Fetch student profile
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, full_name')
    .eq('id', user.id)
    .single()

  const studentName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    'Student'

  // Time-of-day greeting (server-side)
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  // Initialize data defaults
  let enrolledCourses: {
    id: string
    name: string
    teacher: string
    progress: number
    nextLesson: string
  }[] = []
  let upcomingAssignments: {
    id: string
    name: string
    course: string
    dueDate: string
    points: number
    urgency: string
  }[] = []
  let grades: {
    courseId: string
    courseName: string
    grade: string
    percentage: number
  }[] = []
  let attendanceRate = 0

  if (tenantId) {
    // Fetch enrolled courses
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select(`
        id,
        course_id,
        status,
        courses (
          id,
          name,
          created_by
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
        ...(e.courses as any),
      }))

    const courseIds = courseData.map((c: any) => c.id)
    const teacherIds = [...new Set(courseData.map((c: any) => c.created_by))]

    // Fetch in parallel: profiles, lessons, lesson_progress, assignments, grades, attendance
    const now = new Date()
    const sevenDaysFromNow = new Date(now)
    sevenDaysFromNow.setDate(sevenDaysFromNow.getDate() + 7)
    const todayStr = now.toISOString().split('T')[0]
    const futureStr = sevenDaysFromNow.toISOString().split('T')[0]

    const [
      profileResult,
      lessonResult,
      progressResult,
      assignmentResult,
      gradeResult,
      attendanceTotalResult,
      attendancePresentResult,
    ] = await Promise.all([
      // Teacher profiles
      teacherIds.length > 0
        ? supabase
            .from('profiles')
            .select('id, first_name, last_name, full_name')
            .in('id', teacherIds as string[])
        : Promise.resolve({ data: [] }),

      // Lessons per course
      courseIds.length > 0
        ? supabase
            .from('lessons')
            .select('id, course_id, title, order_index')
            .in('course_id', courseIds)
            .order('order_index', { ascending: true })
        : Promise.resolve({ data: [] }),

      // Lesson progress for the student
      courseIds.length > 0
        ? supabase
            .from('lesson_progress')
            .select('lesson_id, status')
            .eq('user_id', user.id)
            .eq('status', 'completed')
        : Promise.resolve({ data: [] }),

      // Upcoming assignments (due within 7 days)
      courseIds.length > 0
        ? supabase
            .from('assignments')
            .select('id, title, course_id, due_date, max_points')
            .in('course_id', courseIds)
            .gte('due_date', todayStr)
            .lte('due_date', futureStr)
            .order('due_date', { ascending: true })
            .limit(10)
        : Promise.resolve({ data: [] }),

      // Student grades
      courseIds.length > 0
        ? supabase
            .from('grades')
            .select('id, points_earned, percentage, assignment_id, assignments:assignment_id(course_id, title)')
            .eq('student_id', user.id)
            .eq('tenant_id', tenantId)
            .order('graded_at', { ascending: false })
            .limit(50)
        : Promise.resolve({ data: [] }),

      // Attendance: total count
      supabase
        .from('attendance_records')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .eq('student_id', user.id),

      // Attendance: present + online count
      supabase
        .from('attendance_records')
        .select('*', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .eq('student_id', user.id)
        .in('status', ['present', 'online']),
    ])

    const profiles = profileResult.data || []
    const lessons = lessonResult.data || []
    const progressData = progressResult.data || []
    const assignmentsData = assignmentResult.data || []
    const gradesData = gradeResult.data || []

    // Build course name map for assignments
    const courseNameMap: Record<string, string> = {}
    for (const c of courseData) {
      courseNameMap[(c as any).id] = (c as any).name
    }

    // Build enrolled courses with progress and teacher info
    enrolledCourses = courseData.map((course: any) => {
      const teacher = profiles.find((p) => p.id === course.created_by)
      const teacherName = teacher
        ? teacher.full_name ||
          [teacher.first_name, teacher.last_name].filter(Boolean).join(' ') ||
          'Teacher'
        : 'Teacher'

      const courseLessons = lessons.filter((l) => l.course_id === course.id)
      const completedLessonIds = new Set(progressData.map((p) => p.lesson_id))
      const completedCount = courseLessons.filter((l) =>
        completedLessonIds.has(l.id)
      ).length
      const progressPct =
        courseLessons.length > 0
          ? Math.round((completedCount / courseLessons.length) * 100)
          : 0

      // Find the next incomplete lesson
      const nextLesson = courseLessons.find(
        (l) => !completedLessonIds.has(l.id)
      )

      return {
        id: course.id,
        name: course.name,
        teacher: teacherName,
        progress: progressPct,
        nextLesson: nextLesson?.title || 'All caught up!',
      }
    })

    // Build upcoming assignments
    upcomingAssignments = assignmentsData.map((a: any) => {
      const dueDate = new Date(a.due_date + 'T00:00:00')
      const diffDays = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )

      let urgency = 'upcoming'
      if (diffDays <= 0) urgency = 'today'
      if (diffDays < 0) urgency = 'overdue'

      return {
        id: a.id,
        name: a.title,
        course: courseNameMap[a.course_id] || 'Course',
        dueDate: dueDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        points: a.max_points || 0,
        urgency,
      }
    })

    // Build grades per course (average score per course)
    const courseTotals: Record<
      string,
      { courseName: string; totalScore: number; totalMax: number }
    > = {}
    for (const g of gradesData) {
      const assignment = g.assignments as any
      if (!assignment?.course_id) continue
      const cId = assignment.course_id
      if (!courseTotals[cId]) {
        courseTotals[cId] = {
          courseName: courseNameMap[cId] || 'Course',
          totalScore: 0,
          totalMax: 0,
        }
      }
      courseTotals[cId].totalScore += g.points_earned || 0
      courseTotals[cId].totalMax += g.percentage || 0
    }

    grades = Object.entries(courseTotals).map(([cId, data]) => {
      const pct =
        data.totalMax > 0
          ? Math.round((data.totalScore / data.totalMax) * 100)
          : 0
      return {
        courseId: cId,
        courseName: data.courseName,
        grade: getLetterGrade(pct),
        percentage: pct,
      }
    })

    // Process attendance from count queries (no row transfer)
    const totalCount = attendanceTotalResult.count ?? 0
    const presentCount = attendancePresentResult.count ?? 0
    if (totalCount > 0) {
      attendanceRate = Math.round((presentCount / totalCount) * 100)
    }

  }

  // Calculate GPA from grades
  const gradePoints: Record<string, number> = {
    'A+': 4.0,
    A: 4.0,
    'A-': 3.7,
    'B+': 3.3,
    B: 3.0,
    'B-': 2.7,
    'C+': 2.3,
    C: 2.0,
    'C-': 1.7,
    'D+': 1.3,
    D: 1.0,
    'D-': 0.7,
    F: 0.0,
  }

  const currentGPA =
    grades.length > 0
      ? (
          grades.reduce(
            (sum, g) => sum + (gradePoints[g.grade] ?? 0),
            0
          ) / grades.length
        ).toFixed(2)
      : '--'

  const stats = {
    coursesEnrolled: enrolledCourses.length,
    assignmentsDue: upcomingAssignments.length,
    currentGPA,
  }

  // Playful gradient palettes for course cards
  const courseGradients = [
    'from-[#00BFFF] to-[#33FF33]',
    'from-[#00BFFF] to-[#00FFFF]',
    'from-[#33FF33] to-[#00FFFF]',
    'from-[#FFAA00] to-[#FFD700]',
    'from-[#00BFFF] to-[#33FF33]',
    'from-[#FFAA00] to-[#FFD700]',
  ]

  // Playful gradient palettes for task cards
  const taskGradients = [
    'from-[#00BFFF] to-[#00FFFF]',
    'from-[#00BFFF] to-[#33FF33]',
    'from-[#33FF33] to-[#00FFFF]',
    'from-[#FFAA00] to-[#FFD700]',
    'from-[#00BFFF] to-[#00FFFF]',
  ]

  return (
    <div className="space-y-4 sm:space-y-8 pb-8 sm:pb-16 overflow-x-hidden max-w-full">
      {/* ===== BIG FRIENDLY GREETING ===== */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl bg-gradient-to-br from-[#00BFFF] via-[#00FFFF] to-[#33FF33] p-4 sm:p-8 md:p-10 text-white text-white-outlined shadow-2xl">
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-20 w-20 rounded-full bg-white/5 hidden sm:block" />

        {/* Clownfish easter egg */}
        <Image
          src="/clownfish.svg"
          alt="Nemo the clownfish"
          width={60}
          height={45}
          className="pointer-events-none absolute bottom-2 right-4 sm:bottom-4 sm:right-8 z-[5] opacity-80 hover:opacity-100 hover:animate-wiggle transition-opacity duration-300"
          aria-hidden="true"
        />

        <div className="relative z-10">
          <div className="flex items-center gap-2 sm:gap-3">
            <Sparkles className="h-6 w-6 sm:h-10 sm:w-10 text-[#D97706] shrink-0" />
            <p className="text-lg sm:text-3xl font-medium text-white text-white-outlined">{greeting}</p>
          </div>
          <h1 className="mt-1 sm:mt-2 text-3xl sm:text-6xl md:text-7xl font-extrabold tracking-tight text-white-outlined break-words">
            Hey {studentName}!
          </h1>
          <p className="mt-1 sm:mt-2 text-lg sm:text-3xl text-white/90 text-white-outlined">
            Ready to learn something awesome today?
          </p>
        </div>
      </div>

      {/* ===== PINNED ANNOUNCEMENTS ===== */}
      <Suspense fallback={null}>
        <AnnouncementBanner />
      </Suspense>


      {/* ===== PERFORMANCE GAUGES ===== */}
      <section>
        <div className="ocean-card rounded-2xl sm:rounded-3xl p-3 sm:p-6 md:p-8">
          <h2 className="mb-3 sm:mb-6 text-center text-lg sm:text-3xl font-bold text-foreground text-outlined">
            Your Performance at a Glance
          </h2>
          <div className="grid grid-cols-2 gap-2 sm:gap-6 sm:grid-cols-4">
            <CircularGauge
              value={currentGPA !== '--' ? parseFloat(currentGPA) : 0}
              max={4}
              label="GPA"
              sublabel={currentGPA !== '--' ? (parseFloat(currentGPA) >= 3.5 ? 'Excellent' : parseFloat(currentGPA) >= 2.5 ? 'Good' : parseFloat(currentGPA) >= 1.5 ? 'Fair' : 'Needs Work') : undefined}
              valueDisplay={currentGPA !== '--' ? currentGPA : '--'}
              colorThresholds={[
                { value: 87.5, color: '#22c55e', bgColor: '#22c55e20' },
                { value: 62.5, color: '#3b82f6', bgColor: '#3b82f620' },
                { value: 37.5, color: '#f59e0b', bgColor: '#f59e0b20' },
                { value: 0, color: '#ef4444', bgColor: '#ef444420' },
              ]}
            />
            <CircularGauge
              value={attendanceRate}
              label="Attendance"
              sublabel={attendanceRate > 0 ? (attendanceRate >= 95 ? 'Excellent' : attendanceRate >= 85 ? 'Good' : 'Needs Attention') : undefined}
              colorThresholds={[
                { value: 95, color: '#22c55e', bgColor: '#22c55e20' },
                { value: 85, color: '#f59e0b', bgColor: '#f59e0b20' },
                { value: 0, color: '#ef4444', bgColor: '#ef444420' },
              ]}
            />
            <div className="flex flex-col items-center gap-1 sm:gap-2" role="status" aria-label={`${stats.coursesEnrolled} courses enrolled`}>
              <div className="flex h-[80px] w-[80px] sm:h-[140px] sm:w-[140px] items-center justify-center rounded-full bg-[#00BFFF]/5 dark:bg-[#00BFFF]/10">
                <div className="text-center">
                  <BookOpen className="mx-auto mb-1 h-4 w-4 sm:h-7 sm:w-7 text-[#00BFFF]" />
                  <p className="text-xl sm:text-4xl font-extrabold text-foreground">{stats.coursesEnrolled}</p>
                </div>
              </div>
              <p className="text-xs sm:text-lg font-semibold text-foreground">Courses</p>
              <p className="text-[10px] sm:text-lg text-muted-foreground">Enrolled</p>
            </div>
            <div className="flex flex-col items-center gap-1 sm:gap-2" role="status" aria-label={`${stats.assignmentsDue} assignments due this week`}>
              <div className={`flex h-[80px] w-[80px] sm:h-[140px] sm:w-[140px] items-center justify-center rounded-full ${stats.assignmentsDue > 0 ? 'bg-[#FFAA00]/5 dark:bg-[#FFAA00]/10' : 'bg-muted/30'}`}>
                <div className="text-center">
                  <Calendar className={`mx-auto mb-1 h-4 w-4 sm:h-7 sm:w-7 ${stats.assignmentsDue > 0 ? 'text-[#D97706]' : 'text-muted-foreground'}`} />
                  <p className={`text-xl sm:text-4xl font-extrabold ${stats.assignmentsDue > 0 ? 'text-[#D97706] dark:text-[#FFD700]' : 'text-foreground'}`}>{stats.assignmentsDue}</p>
                </div>
              </div>
              <p className="text-xs sm:text-lg font-semibold text-foreground">Due Soon</p>
              <p className="text-[10px] sm:text-lg text-muted-foreground">This Week</p>
            </div>
          </div>
        </div>
      </section>

      {/* ===== TODAY'S TASKS ===== */}
      <section>
        <div className="mb-3 sm:mb-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex h-7 w-7 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#00BFFF] to-[#00FFFF] shadow-md">
              <Target className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-4xl font-bold text-foreground text-outlined truncate">
              Today&apos;s Tasks
            </h2>
          </div>
          <Link
            href="/student/assignments"
            className="flex shrink-0 items-center gap-1 rounded-full bg-[#00BFFF]/5 px-2 py-1 sm:px-5 sm:py-2.5 text-[11px] sm:text-lg font-semibold text-[#00BFFF] transition-all hover:bg-[#00BFFF]/10 hover:scale-105 dark:bg-[#00BFFF]/10 dark:text-[#00BFFF]"
          >
            See All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>

        {upcomingAssignments.length > 0 ? (
          <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingAssignments.slice(0, 5).map((assignment, idx) => {
              const gradient = taskGradients[idx % taskGradients.length]
              const isUrgent =
                assignment.urgency === 'today' ||
                assignment.urgency === 'overdue'
              return (
                <div
                  key={assignment.id}
                  className="group relative overflow-hidden rounded-2xl p-4 sm:p-5 text-white text-white-outlined shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-300 group-hover:scale-105`}
                  />
                  {/* Content */}
                  <div className="relative z-10">
                    {isUrgent && (
                      <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/25 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-base font-bold uppercase tracking-wide text-white-outlined backdrop-blur-sm">
                        <Clock className="h-3 w-3 sm:h-4 sm:w-4" />
                        {assignment.urgency === 'overdue'
                          ? 'Overdue'
                          : 'Due Today'}
                      </span>
                    )}
                    <h3 className="mt-1 text-base sm:text-2xl font-bold leading-snug text-white-outlined">
                      {assignment.name}
                    </h3>
                    <p className="mt-1 text-xs sm:text-lg text-white text-white-outlined">
                      {assignment.course}
                    </p>
                    <div className="mt-2 sm:mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 rounded-full bg-white/20 px-2 py-0.5 sm:px-3 sm:py-1 text-xs sm:text-lg font-semibold text-white-outlined backdrop-blur-sm">
                        <Zap className="h-3 w-3 sm:h-4 sm:w-4" /> {assignment.points} pts
                      </span>
                      <span className="text-xs sm:text-lg font-medium text-white/90 text-white-outlined">
                        {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#00BFFF]/20 bg-[#00BFFF]/5 py-6 sm:py-16 px-3 sm:px-4 text-center dark:border-[#00BFFF]/20 dark:bg-[#00BFFF]/5">
            <Rocket className="mb-2 sm:mb-4 h-8 w-8 sm:h-16 sm:w-16 text-[#00BFFF]/50" />
            <p className="text-lg sm:text-3xl font-bold text-foreground">
              All clear! Nothing due soon.
            </p>
            <p className="mt-1 sm:mt-2 text-xs sm:text-xl text-muted-foreground">
              You&apos;re all caught up &mdash; nice work!
            </p>
          </div>
        )}
      </section>

      {/* ===== MY CLASSES ===== */}
      <section>
        <div className="mb-3 sm:mb-5 flex items-center justify-between gap-2">
          <div className="flex items-center gap-2 sm:gap-3 min-w-0">
            <div className="flex h-7 w-7 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-lg sm:rounded-xl bg-gradient-to-br from-[#33FF33] to-[#00FFFF] text-white-outlined shadow-md">
              <BookOpen className="h-3.5 w-3.5 sm:h-5 sm:w-5 text-white" />
            </div>
            <h2 className="text-lg sm:text-4xl font-bold text-foreground text-outlined truncate">My Classes</h2>
          </div>
          <Link
            href="/student/courses"
            className="flex shrink-0 items-center gap-1 rounded-full bg-[#33FF33]/5 px-2 py-1 sm:px-5 sm:py-2.5 text-[11px] sm:text-lg font-semibold text-[#059669] transition-all hover:bg-[#33FF33]/10 hover:scale-105 dark:bg-[#33FF33]/10 dark:text-[#059669]"
          >
            See All <ChevronRight className="h-3 w-3 sm:h-4 sm:w-4" />
          </Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:gap-5 sm:grid-cols-2 lg:grid-cols-3">
            {enrolledCourses.map((course, idx) => {
              const gradient = courseGradients[idx % courseGradients.length]
              return (
                <Link
                  key={course.id}
                  href={`/student/courses/${course.id}`}
                  className="group relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Top colored band */}
                  <div
                    className={`h-24 sm:h-28 bg-gradient-to-br ${gradient} flex items-end p-3 sm:p-5 transition-all duration-300 group-hover:h-28 sm:group-hover:h-32`}
                  >
                    <div className="relative z-10 min-w-0">
                      <h3 className="text-base sm:text-2xl font-bold text-white text-white-outlined truncate">
                        {course.name}
                      </h3>
                      <p className="flex items-center gap-1 text-xs sm:text-lg text-white text-white-outlined truncate">
                        <GraduationCap className="h-3 w-3 sm:h-4 sm:w-4 shrink-0" />{' '}
                        {course.teacher}
                      </p>
                    </div>
                    {/* Decorative circle */}
                    <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
                  </div>

                  {/* Bottom info section */}
                  <div className="rounded-b-2xl bg-card p-3 sm:p-5">
                    {/* Progress bar */}
                    <div className="mb-1 flex items-center justify-between text-xs sm:text-lg">
                      <span className="font-medium text-muted-foreground">
                        Progress
                      </span>
                      <span className="font-bold text-foreground">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="h-2.5 sm:h-3 w-full overflow-hidden rounded-full bg-muted">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="mt-2 sm:mt-3 text-sm sm:text-lg text-muted-foreground truncate">
                      {course.progress === 100 ? (
                        <span className="flex items-center gap-1 font-semibold text-[#059669] dark:text-[#059669]">
                          <PartyPopper className="h-4 w-4 sm:h-5 sm:w-5 shrink-0" /> All caught up!
                        </span>
                      ) : (
                        <>
                          <span className="text-muted-foreground">
                            Up next:{' '}
                          </span>
                          <span className="font-medium text-foreground">
                            {course.nextLesson}
                          </span>
                        </>
                      )}
                    </p>
                  </div>
                </Link>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-2xl sm:rounded-3xl border-2 border-dashed border-[#33FF33]/20 bg-[#33FF33]/5 py-6 sm:py-16 px-3 sm:px-4 text-center dark:border-[#33FF33]/20 dark:bg-[#33FF33]/5">
            <BookOpen className="mb-2 sm:mb-4 h-8 w-8 sm:h-16 sm:w-16 text-[#059669]/50" />
            <p className="text-lg sm:text-3xl font-bold text-foreground">No classes yet</p>
            <p className="mt-1 sm:mt-2 text-xs sm:text-xl text-muted-foreground">
              Ask your teacher to enroll you in a class to get started!
            </p>
          </div>
        )}
      </section>

      {/* ===== QUICK ACTIONS ===== */}
      <section>
        <div className="grid grid-cols-2 gap-2.5 sm:gap-4 sm:grid-cols-4">
          {[
            {
              href: '/student/courses',
              label: 'My Courses',
              icon: <BookOpen className="h-5 w-5 sm:h-7 sm:w-7" />,
              gradient: 'from-[#00BFFF] to-[#00FFFF]',
              bg: 'bg-[#00BFFF]/5 dark:bg-[#00BFFF]/10',
            },
            {
              href: '/student/assignments',
              label: 'Assignments',
              icon: <Target className="h-5 w-5 sm:h-7 sm:w-7" />,
              gradient: 'from-[#33FF33] to-[#00FFFF]',
              bg: 'bg-[#33FF33]/5 dark:bg-[#33FF33]/10',
            },
            {
              href: '/messaging',
              label: 'Messages',
              icon: <MessageCircle className="h-5 w-5 sm:h-7 sm:w-7" />,
              gradient: 'from-[#00BFFF] to-[#33FF33]',
              bg: 'bg-[#00BFFF]/5 dark:bg-[#00BFFF]/10',
            },
            {
              href: '/calendar',
              label: 'Calendar',
              icon: <CalendarDays className="h-5 w-5 sm:h-7 sm:w-7" />,
              gradient: 'from-[#FFAA00] to-[#FFD700]',
              bg: 'bg-[#FFAA00]/5 dark:bg-[#FFAA00]/10',
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group flex flex-col items-center gap-1.5 sm:gap-3 rounded-xl sm:rounded-2xl ${action.bg} border border-transparent p-2.5 sm:p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700`}
            >
              <div
                className={`flex h-9 w-9 sm:h-14 sm:w-14 items-center justify-center rounded-lg sm:rounded-2xl bg-gradient-to-br ${action.gradient} text-white text-white-outlined shadow-md transition-transform duration-300 group-hover:scale-110`}
              >
                {action.icon}
              </div>
              <span className="text-xs sm:text-lg font-bold text-foreground text-center">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
