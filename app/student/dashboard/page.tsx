import Link from 'next/link'
import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getLetterGrade } from '@/lib/config/constants'

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
            .select('id, title, course_id, due_date, points_possible')
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
            .select('id, score, max_score, assignment_id, assignments:assignment_id(course_id, title)')
            .eq('student_id', user.id)
            .eq('tenant_id', tenantId)
            .order('graded_at', { ascending: false })
            .limit(50)
        : Promise.resolve({ data: [] }),

      // XP / level data
      supabase
        .from('user_levels')
        .select('total_xp, current_level, current_tier')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .single(),

      // Recent achievements
      supabase
        .from('user_achievements')
        .select('id, earned_at, achievements(id, name, icon)')
        .eq('user_id', user.id)
        .eq('tenant_id', tenantId)
        .order('earned_at', { ascending: false })
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
        points: a.points_possible || 0,
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
      courseTotals[cId].totalScore += g.score || 0
      courseTotals[cId].totalMax += g.max_score || 0
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
        earnedAt: ua.earned_at
          ? new Date(ua.earned_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
      }
    })

    // Calculate streak from XP events (consecutive days with activity)
    const { data: xpEvents } = await supabase
      .from('xp_events')
      .select('created_at')
      .eq('user_id', user.id)
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

  // Helper function to get grade color
  const getGradeColor = (grade: string) => {
    if (grade.startsWith('A'))
      return 'text-green-600 bg-green-50 border-green-200'
    if (grade.startsWith('B'))
      return 'text-blue-600 bg-blue-50 border-blue-200'
    if (grade.startsWith('C'))
      return 'text-amber-600 bg-amber-50 border-amber-200'
    return 'text-red-600 bg-red-50 border-red-200'
  }

  // Helper function to get urgency color
  const getUrgencyColor = (urgency: string) => {
    if (urgency === 'overdue') return 'border-l-red-500 bg-red-50/50'
    if (urgency === 'today') return 'border-l-amber-500 bg-amber-50/50'
    return 'border-l-blue-500 bg-blue-50/20'
  }

  return (
    <div className="min-h-screen space-y-6 pb-12">
      {/* Welcome Header */}
      <div className="whale-gradient rounded-3xl p-8 text-white shadow-lg">
        <div className="flex flex-col gap-6 lg:flex-row lg:items-center lg:justify-between">
          <div className="flex-1">
            <h1 className="mb-2 text-4xl font-bold">
              {greeting}, {studentName}!
            </h1>
            <p className="text-lg text-white/90">
              Ready to make some waves today?
            </p>

            {/* XP Progress */}
            <div className="mt-6">
              <div className="mb-2 flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="text-2xl">⭐</span>
                  <span className="font-semibold">
                    Level {xpData.level} - {xpData.levelName}
                  </span>
                  <span className="rounded-full bg-white/20 px-3 py-1 text-xs font-medium">
                    {xpData.tier}
                  </span>
                </div>
                <span className="text-sm font-medium">
                  {xpData.currentXP} / {xpData.nextLevelXP} XP
                </span>
              </div>
              <div className="h-4 w-full overflow-hidden rounded-full bg-white/20 backdrop-blur-sm">
                <div
                  className="h-full rounded-full bg-white shadow-lg transition-all duration-500"
                  style={{ width: `${xpProgress}%` }}
                />
              </div>
            </div>
          </div>

          {/* Quick Stats */}
          <div className="grid grid-cols-2 gap-4 lg:grid-cols-1">
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">🔥</span>
                <div>
                  <p className="text-2xl font-bold">{stats.streak}</p>
                  <p className="text-sm text-white/80">Day Streak</p>
                </div>
              </div>
            </div>
            <div className="rounded-2xl bg-white/10 p-4 backdrop-blur-sm">
              <div className="flex items-center gap-2">
                <span className="text-2xl">📚</span>
                <div>
                  <p className="text-2xl font-bold">{stats.coursesEnrolled}</p>
                  <p className="text-sm text-white/80">Courses</p>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Additional Stats Row */}
        <div className="mt-6 grid grid-cols-2 gap-4 sm:grid-cols-4">
          <div className="text-center">
            <p className="text-3xl font-bold">{stats.assignmentsDue}</p>
            <p className="text-sm text-white/80">Due This Week</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{stats.currentGPA}</p>
            <p className="text-sm text-white/80">Current GPA</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{xpData.currentXP}</p>
            <p className="text-sm text-white/80">Total XP</p>
          </div>
          <div className="text-center">
            <p className="text-3xl font-bold">{achievements.length}</p>
            <p className="text-sm text-white/80">Achievements</p>
          </div>
        </div>
      </div>

      {/* Main Content Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-3">
        {/* Left Column - 2/3 width */}
        <div className="space-y-6 lg:col-span-2">
          {/* Today's Tasks - Priority Section */}
          <div className="ocean-card rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🎯</span>
                <h2 className="text-xl font-bold text-foreground">
                  Today&apos;s Tasks
                </h2>
              </div>
              <Link
                href="/student/assignments"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {upcomingAssignments.length > 0 ? (
              <div className="space-y-3">
                {upcomingAssignments.map((assignment) => (
                  <div
                    key={assignment.id}
                    className={`rounded-xl border-l-4 p-4 transition-all hover:shadow-md ${getUrgencyColor(
                      assignment.urgency
                    )}`}
                  >
                    <div className="flex items-start justify-between">
                      <div className="flex-1">
                        <h3 className="font-semibold text-foreground">
                          {assignment.name}
                        </h3>
                        <p className="text-sm text-muted-foreground">
                          {assignment.course}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-medium text-foreground">
                          {assignment.points} pts
                        </p>
                        <p className="text-xs text-muted-foreground">
                          Due {assignment.dueDate}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 text-6xl opacity-40">🌊</div>
                <p className="text-lg font-medium text-foreground">
                  Smooth sailing ahead!
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  No assignments due in the next 7 days. Time to get ahead or
                  relax!
                </p>
              </div>
            )}
          </div>

          {/* My Courses Grid */}
          <div className="ocean-card rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📖</span>
                <h2 className="text-xl font-bold text-foreground">
                  My Courses
                </h2>
              </div>
              <Link
                href="/student/courses"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {enrolledCourses.length > 0 ? (
              <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
                {enrolledCourses.map((course) => (
                  <Link
                    key={course.id}
                    href={`/student/courses/${course.id}`}
                    className="group overflow-hidden rounded-xl border border-border bg-gradient-to-br from-background to-muted/30 p-5 transition-all hover:shadow-lg"
                  >
                    <div className="mb-3">
                      <h3 className="font-semibold text-foreground group-hover:text-primary">
                        {course.name}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {course.teacher}
                      </p>
                    </div>
                    <div className="mb-2">
                      <div className="mb-1 flex items-center justify-between text-xs">
                        <span className="text-muted-foreground">Progress</span>
                        <span className="font-medium text-foreground">
                          {course.progress}%
                        </span>
                      </div>
                      <div className="h-2 w-full overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-500"
                          style={{ width: `${course.progress}%` }}
                        />
                      </div>
                    </div>
                    <p className="text-xs text-muted-foreground">
                      Next: {course.nextLesson}
                    </p>
                  </Link>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-12 text-center">
                <div className="mb-4 text-6xl opacity-40">🐺</div>
                <p className="text-lg font-medium text-foreground">
                  No courses yet
                </p>
                <p className="mt-1 text-sm text-muted-foreground">
                  Ask your teacher to enroll you in a course to get started!
                </p>
              </div>
            )}
          </div>
        </div>

        {/* Right Column - 1/3 width */}
        <div className="space-y-6">
          {/* Grade Overview */}
          <div className="ocean-card rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">📊</span>
                <h2 className="text-xl font-bold text-foreground">Grades</h2>
              </div>
              <Link
                href="/student/grades"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {grades.length > 0 ? (
              <div className="space-y-3">
                {grades.map((grade) => (
                  <div
                    key={grade.courseId}
                    className={`rounded-xl border p-4 ${getGradeColor(
                      grade.grade
                    )}`}
                  >
                    <div className="flex items-center justify-between">
                      <div className="flex-1">
                        <p className="text-sm font-medium">
                          {grade.courseName}
                        </p>
                      </div>
                      <div className="text-right">
                        <p className="text-2xl font-bold">{grade.grade}</p>
                        <p className="text-xs">{grade.percentage}%</p>
                      </div>
                    </div>
                  </div>
                ))}

                {/* Overall GPA */}
                <div className="mt-4 rounded-xl bg-gradient-to-r from-purple-500 to-blue-500 p-4 text-white">
                  <p className="text-sm font-medium">Overall GPA</p>
                  <p className="text-3xl font-bold">{stats.currentGPA}</p>
                </div>
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 text-5xl opacity-40">📈</div>
                <p className="text-sm text-muted-foreground">
                  No grades yet. Keep working hard!
                </p>
              </div>
            )}
          </div>

          {/* Achievement Spotlight */}
          <div className="ocean-card rounded-2xl p-6">
            <div className="mb-4 flex items-center justify-between">
              <div className="flex items-center gap-3">
                <span className="text-2xl">🏆</span>
                <h2 className="text-xl font-bold text-foreground">
                  Achievements
                </h2>
              </div>
              <Link
                href="/student/achievements"
                className="text-sm font-medium text-primary hover:underline"
              >
                View All
              </Link>
            </div>

            {achievements.length > 0 ? (
              <div className="space-y-3">
                {achievements.slice(0, 3).map((achievement) => (
                  <div
                    key={achievement.id}
                    className="rounded-xl bg-gradient-to-r from-amber-50 to-yellow-50 p-4 border border-amber-200"
                  >
                    <div className="flex items-center gap-3">
                      <span className="text-3xl">{achievement.icon}</span>
                      <div className="flex-1">
                        <p className="font-semibold text-foreground">
                          {achievement.name}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {achievement.earnedAt}
                        </p>
                      </div>
                    </div>
                  </div>
                ))}
              </div>
            ) : (
              <div className="flex flex-col items-center justify-center py-8 text-center">
                <div className="mb-3 text-5xl opacity-40">🎖️</div>
                <p className="text-sm text-muted-foreground">
                  Earn achievements by completing tasks!
                </p>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Quick Actions Row */}
      <div className="ocean-card rounded-2xl p-6">
        <h2 className="mb-4 text-lg font-bold text-foreground">
          Quick Actions
        </h2>
        <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
          <Link
            href="/student/study-mode"
            className="group flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-blue-50 to-cyan-50 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <span className="text-4xl">📚</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary">
              Study Mode
            </span>
          </Link>

          <Link
            href="/messaging"
            className="group flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-purple-50 to-pink-50 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <span className="text-4xl">💬</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary">
              Messages
            </span>
          </Link>

          <Link
            href="/calendar"
            className="group flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-green-50 to-emerald-50 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <span className="text-4xl">📅</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary">
              Calendar
            </span>
          </Link>

          <Link
            href="/student/leaderboard"
            className="group flex flex-col items-center gap-2 rounded-xl bg-gradient-to-br from-amber-50 to-orange-50 p-6 transition-all hover:shadow-lg hover:scale-105"
          >
            <span className="text-4xl">🏅</span>
            <span className="text-sm font-medium text-foreground group-hover:text-primary">
              Leaderboard
            </span>
          </Link>
        </div>
      </div>
    </div>
  )
}
