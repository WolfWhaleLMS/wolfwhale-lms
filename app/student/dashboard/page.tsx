import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLetterGrade } from '@/lib/config/constants'
import {
  Sparkles,
  Star,
  Trophy,
  Zap,
  Flame,
  BookOpen,
  Target,
  Rocket,
  Crown,
  ChevronRight,
  Clock,
  PartyPopper,
  GraduationCap,
  MessageCircle,
  CalendarDays,
} from 'lucide-react'

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
  let achievements: {
    id: string
    name: string
    icon: string
    earnedAt: string
  }[] = []
  let xpData = {
    currentXP: 0,
    nextLevelXP: 100,
    level: 1,
    levelName: 'Rookie Navigator',
    tier: 'Bronze',
  }
  let streak = 0

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

    // Fetch in parallel: profiles, lessons, lesson_progress, assignments, grades, xp, achievements
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
      xpResult,
      achievementResult,
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

      // XP / level data
      supabase
        .from('student_xp')
        .select('total_xp, current_level, current_tier')
        .eq('student_id', user.id)
        .eq('tenant_id', tenantId)
        .single(),

      // Recent achievements
      supabase
        .from('student_achievements')
        .select('id, unlocked_at, achievements:achievement_id(id, name, icon)')
        .eq('student_id', user.id)
        .eq('tenant_id', tenantId)
        .order('unlocked_at', { ascending: false })
        .limit(5),
    ])

    const profiles = profileResult.data || []
    const lessons = lessonResult.data || []
    const progressData = progressResult.data || []
    const assignmentsData = assignmentResult.data || []
    const gradesData = gradeResult.data || []
    const userLevel = xpResult.data
    const achievementsData = achievementResult.data || []

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

    // XP data
    if (userLevel) {
      const level = userLevel.current_level || 1
      // Approximate next level XP thresholds
      const xpThresholds: Record<number, number> = {
        1: 100,
        2: 250,
        3: 500,
        4: 1000,
        5: 2000,
        6: 3500,
        7: 5500,
        8: 8000,
        9: 12000,
        10: 20000,
      }
      const nextLevelXP = xpThresholds[level + 1] || xpThresholds[level] || 100
      const currentLevelXP = xpThresholds[level] || 0

      // Level name mapping
      const levelNames: Record<number, string> = {
        1: 'Rookie Navigator',
        2: 'Wave Rider',
        3: 'Reef Explorer',
        4: 'Ocean Scout',
        5: 'Tide Master',
        6: 'Deep Diver',
        7: 'Sea Sage',
        8: 'Whale Whisperer',
        9: 'Ocean Guardian',
        10: 'Legendary Leviathan',
      }

      xpData = {
        currentXP: userLevel.total_xp || 0,
        nextLevelXP: nextLevelXP,
        level: level,
        levelName: levelNames[level] || 'Rookie Navigator',
        tier: userLevel.current_tier || 'Bronze',
      }
    }

    // Recent achievements
    achievements = achievementsData.map((ua: any) => {
      const ach = ua.achievements as any
      return {
        id: ach?.id || ua.id,
        name: ach?.name || 'Achievement',
        icon: ach?.icon || '🏆',
        earnedAt: ua.unlocked_at
          ? new Date(ua.unlocked_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
      }
    })

    // Calculate streak from XP events (consecutive days with activity)
    const { data: xpEvents } = await supabase
      .from('xp_transactions')
      .select('created_at')
      .eq('student_id', user.id)
      .eq('tenant_id', tenantId)
      .order('created_at', { ascending: false })
      .limit(100)

    if (xpEvents && xpEvents.length > 0) {
      const uniqueDays = [
        ...new Set(
          xpEvents.map((e) => e.created_at?.split('T')[0]).filter(Boolean)
        ),
      ].sort((a, b) => (b as string).localeCompare(a as string))

      let currentStreak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let i = 0; i < uniqueDays.length; i++) {
        const expectedDate = new Date(today)
        expectedDate.setDate(expectedDate.getDate() - i)
        const expectedStr = expectedDate.toISOString().split('T')[0]

        if (uniqueDays[i] === expectedStr) {
          currentStreak++
        } else {
          break
        }
      }
      streak = currentStreak
    }
  }

  // Compute derived values
  const xpProgress =
    xpData.nextLevelXP > 0
      ? Math.min((xpData.currentXP / xpData.nextLevelXP) * 100, 100)
      : 0

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
    streak,
  }

  // Playful gradient palettes for course cards
  const courseGradients = [
    'from-violet-500 to-purple-600',
    'from-blue-500 to-cyan-500',
    'from-emerald-500 to-teal-500',
    'from-orange-400 to-pink-500',
    'from-fuchsia-500 to-rose-500',
    'from-amber-400 to-orange-500',
  ]

  // Playful gradient palettes for task cards
  const taskGradients = [
    'from-sky-400 to-blue-500',
    'from-violet-400 to-purple-500',
    'from-emerald-400 to-green-500',
    'from-amber-400 to-orange-500',
    'from-pink-400 to-rose-500',
  ]

  // Streak encouragement messages
  const streakMessage =
    streak >= 7
      ? "You're UNSTOPPABLE!"
      : streak >= 3
        ? "You're on fire!"
        : streak >= 1
          ? 'Keep it going!'
          : 'Start a streak today!'

  // XP encouragement
  const xpMessage =
    xpProgress >= 90
      ? 'Almost there! So close to leveling up!'
      : xpProgress >= 50
        ? 'Halfway to the next level!'
        : 'Every XP counts!'

  return (
    <div className="min-h-screen space-y-8 pb-16">
      {/* ===== BIG FRIENDLY GREETING ===== */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-violet-600 via-purple-500 to-fuchsia-500 p-8 text-white shadow-2xl sm:p-10">
        {/* Decorative background circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/4 top-1/2 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3">
            <Sparkles className="h-8 w-8 text-yellow-300" />
            <p className="text-lg font-medium text-white/80">{greeting}</p>
          </div>
          <h1 className="mt-2 text-4xl font-extrabold tracking-tight sm:text-5xl">
            Hey {studentName}!
          </h1>
          <p className="mt-2 text-xl text-white/90">
            Ready to learn something awesome today?
          </p>

          {/* Streak badge */}
          {streak > 0 && (
            <div className="mt-4 inline-flex items-center gap-2 rounded-full bg-white/20 px-5 py-2.5 text-base font-semibold backdrop-blur-sm">
              <Flame className="h-5 w-5 text-orange-300" />
              {streak}-day streak &mdash; {streakMessage}
            </div>
          )}
        </div>
      </div>

      {/* ===== XP / LEVEL PROGRESS BAR ===== */}
      <div className="rounded-3xl bg-gradient-to-r from-amber-400 via-yellow-400 to-orange-400 p-6 shadow-lg sm:p-8">
        <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
          <div className="flex items-center gap-4">
            <div className="flex h-16 w-16 items-center justify-center rounded-2xl bg-white/30 text-3xl font-black text-white shadow-inner backdrop-blur-sm">
              {xpData.level}
            </div>
            <div>
              <div className="flex items-center gap-2">
                <Star className="h-5 w-5 text-white" />
                <h2 className="text-xl font-bold text-white sm:text-2xl">
                  {xpData.levelName}
                </h2>
              </div>
              <p className="text-sm font-medium text-white/80">
                {xpData.tier} Tier &middot; {xpMessage}
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className="text-3xl font-extrabold text-white">
              {xpData.currentXP}
              <span className="text-lg font-medium text-white/70">
                {' '}
                / {xpData.nextLevelXP} XP
              </span>
            </p>
          </div>
        </div>

        {/* Big juicy progress bar */}
        <div className="mt-5 h-6 w-full overflow-hidden rounded-full bg-white/30 shadow-inner backdrop-blur-sm">
          <div
            className="flex h-full items-center justify-end rounded-full bg-white px-3 shadow-lg transition-all duration-700 ease-out"
            style={{ width: `${Math.max(xpProgress, 3)}%` }}
          >
            {xpProgress >= 10 && (
              <Zap className="h-4 w-4 text-amber-500" />
            )}
          </div>
        </div>
      </div>

      {/* ===== TODAY'S TASKS ===== */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-sky-400 to-blue-500 shadow-md">
              <Target className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Today&apos;s Tasks
            </h2>
          </div>
          <Link
            href="/student/assignments"
            className="flex items-center gap-1 rounded-full bg-blue-50 px-4 py-2 text-sm font-semibold text-blue-600 transition-all hover:bg-blue-100 hover:scale-105 dark:bg-blue-950 dark:text-blue-300"
          >
            See All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {upcomingAssignments.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {upcomingAssignments.slice(0, 5).map((assignment, idx) => {
              const gradient = taskGradients[idx % taskGradients.length]
              const isUrgent =
                assignment.urgency === 'today' ||
                assignment.urgency === 'overdue'
              return (
                <div
                  key={assignment.id}
                  className="group relative overflow-hidden rounded-2xl p-5 text-white shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
                >
                  {/* Gradient background */}
                  <div
                    className={`absolute inset-0 bg-gradient-to-br ${gradient} transition-all duration-300 group-hover:scale-105`}
                  />
                  {/* Content */}
                  <div className="relative z-10">
                    {isUrgent && (
                      <span className="mb-2 inline-flex items-center gap-1 rounded-full bg-white/25 px-3 py-1 text-xs font-bold uppercase tracking-wide backdrop-blur-sm">
                        <Clock className="h-3 w-3" />
                        {assignment.urgency === 'overdue'
                          ? 'Overdue'
                          : 'Due Today'}
                      </span>
                    )}
                    <h3 className="mt-1 text-lg font-bold leading-snug">
                      {assignment.name}
                    </h3>
                    <p className="mt-1 text-sm text-white/80">
                      {assignment.course}
                    </p>
                    <div className="mt-4 flex items-center justify-between">
                      <span className="flex items-center gap-1 rounded-full bg-white/20 px-3 py-1 text-sm font-semibold backdrop-blur-sm">
                        <Zap className="h-3.5 w-3.5" /> {assignment.points} pts
                      </span>
                      <span className="text-sm font-medium text-white/90">
                        {assignment.dueDate}
                      </span>
                    </div>
                  </div>
                </div>
              )
            })}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-blue-200 bg-blue-50/50 py-16 text-center dark:border-blue-800 dark:bg-blue-950/30">
            <Rocket className="mb-4 h-16 w-16 text-blue-300" />
            <p className="text-xl font-bold text-foreground">
              All clear! Nothing due soon.
            </p>
            <p className="mt-2 text-base text-muted-foreground">
              You&apos;re all caught up &mdash; nice work!
            </p>
          </div>
        )}
      </section>

      {/* ===== MY CLASSES ===== */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-emerald-400 to-teal-500 shadow-md">
              <BookOpen className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">My Classes</h2>
          </div>
          <Link
            href="/student/courses"
            className="flex items-center gap-1 rounded-full bg-emerald-50 px-4 py-2 text-sm font-semibold text-emerald-600 transition-all hover:bg-emerald-100 hover:scale-105 dark:bg-emerald-950 dark:text-emerald-300"
          >
            See All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {enrolledCourses.length > 0 ? (
          <div className="grid grid-cols-1 gap-5 sm:grid-cols-2 lg:grid-cols-3">
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
                    className={`h-28 bg-gradient-to-br ${gradient} flex items-end p-5 transition-all duration-300 group-hover:h-32`}
                  >
                    <div className="relative z-10">
                      <h3 className="text-lg font-bold text-white drop-shadow-sm">
                        {course.name}
                      </h3>
                      <p className="flex items-center gap-1 text-sm text-white/80">
                        <GraduationCap className="h-3.5 w-3.5" />{' '}
                        {course.teacher}
                      </p>
                    </div>
                    {/* Decorative circle */}
                    <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
                  </div>

                  {/* Bottom info section */}
                  <div className="rounded-b-2xl bg-white p-5 dark:bg-gray-900">
                    {/* Progress bar */}
                    <div className="mb-1 flex items-center justify-between text-sm">
                      <span className="font-medium text-muted-foreground">
                        Progress
                      </span>
                      <span className="font-bold text-foreground">
                        {course.progress}%
                      </span>
                    </div>
                    <div className="h-3 w-full overflow-hidden rounded-full bg-gray-100 dark:bg-gray-800">
                      <div
                        className={`h-full rounded-full bg-gradient-to-r ${gradient} transition-all duration-500`}
                        style={{ width: `${course.progress}%` }}
                      />
                    </div>
                    <p className="mt-3 text-sm text-muted-foreground">
                      {course.progress === 100 ? (
                        <span className="flex items-center gap-1 font-semibold text-emerald-600 dark:text-emerald-400">
                          <PartyPopper className="h-4 w-4" /> All caught up!
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
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-emerald-200 bg-emerald-50/50 py-16 text-center dark:border-emerald-800 dark:bg-emerald-950/30">
            <BookOpen className="mb-4 h-16 w-16 text-emerald-300" />
            <p className="text-xl font-bold text-foreground">No classes yet</p>
            <p className="mt-2 text-base text-muted-foreground">
              Ask your teacher to enroll you in a class to get started!
            </p>
          </div>
        )}
      </section>

      {/* ===== ACHIEVEMENTS ===== */}
      <section>
        <div className="mb-5 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-gradient-to-br from-amber-400 to-orange-500 shadow-md">
              <Trophy className="h-5 w-5 text-white" />
            </div>
            <h2 className="text-2xl font-bold text-foreground">
              Achievements
            </h2>
          </div>
          <Link
            href="/student/achievements"
            className="flex items-center gap-1 rounded-full bg-amber-50 px-4 py-2 text-sm font-semibold text-amber-600 transition-all hover:bg-amber-100 hover:scale-105 dark:bg-amber-950 dark:text-amber-300"
          >
            See All <ChevronRight className="h-4 w-4" />
          </Link>
        </div>

        {achievements.length > 0 ? (
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {achievements.slice(0, 3).map((achievement) => (
              <div
                key={achievement.id}
                className="group flex items-center gap-4 rounded-2xl border border-amber-200 bg-gradient-to-br from-amber-50 to-yellow-50 p-5 shadow-sm transition-all duration-300 hover:-translate-y-1 hover:shadow-lg dark:border-amber-800 dark:from-amber-950/50 dark:to-yellow-950/50"
              >
                <span className="flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br from-amber-400 to-orange-500 text-2xl shadow-md transition-transform duration-300 group-hover:scale-110">
                  {achievement.icon}
                </span>
                <div className="flex-1">
                  <p className="text-base font-bold text-foreground">
                    {achievement.name}
                  </p>
                  <p className="text-sm text-muted-foreground">
                    {achievement.earnedAt}
                  </p>
                </div>
                <Crown className="h-5 w-5 text-amber-400" />
              </div>
            ))}
          </div>
        ) : (
          <div className="flex flex-col items-center justify-center rounded-3xl border-2 border-dashed border-amber-200 bg-amber-50/50 py-12 text-center dark:border-amber-800 dark:bg-amber-950/30">
            <Trophy className="mb-4 h-14 w-14 text-amber-300" />
            <p className="text-lg font-bold text-foreground">
              Your trophy case is waiting!
            </p>
            <p className="mt-2 text-base text-muted-foreground">
              Complete tasks and lessons to earn awesome achievements.
            </p>
          </div>
        )}
      </section>

      {/* ===== QUICK ACTIONS ===== */}
      <section>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          {[
            {
              href: '/student/study-mode',
              label: 'Study Mode',
              icon: <Rocket className="h-7 w-7" />,
              gradient: 'from-blue-500 to-cyan-400',
              bg: 'bg-blue-50 dark:bg-blue-950/40',
            },
            {
              href: '/messaging',
              label: 'Messages',
              icon: <MessageCircle className="h-7 w-7" />,
              gradient: 'from-purple-500 to-pink-400',
              bg: 'bg-purple-50 dark:bg-purple-950/40',
            },
            {
              href: '/calendar',
              label: 'Calendar',
              icon: <CalendarDays className="h-7 w-7" />,
              gradient: 'from-emerald-500 to-green-400',
              bg: 'bg-emerald-50 dark:bg-emerald-950/40',
            },
            {
              href: '/student/leaderboard',
              label: 'Leaderboard',
              icon: <Crown className="h-7 w-7" />,
              gradient: 'from-amber-500 to-orange-400',
              bg: 'bg-amber-50 dark:bg-amber-950/40',
            },
          ].map((action) => (
            <Link
              key={action.href}
              href={action.href}
              className={`group flex flex-col items-center gap-3 rounded-2xl ${action.bg} border border-transparent p-6 transition-all duration-300 hover:-translate-y-1 hover:shadow-lg hover:border-gray-200 dark:hover:border-gray-700`}
            >
              <div
                className={`flex h-14 w-14 items-center justify-center rounded-2xl bg-gradient-to-br ${action.gradient} text-white shadow-md transition-transform duration-300 group-hover:scale-110`}
              >
                {action.icon}
              </div>
              <span className="text-sm font-bold text-foreground">
                {action.label}
              </span>
            </Link>
          ))}
        </div>
      </section>
    </div>
  )
}
