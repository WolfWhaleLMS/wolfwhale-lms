import { headers } from 'next/headers'
import { redirect } from 'next/navigation'

import { getMyTextbooks } from '@/app/actions/textbooks'
import { getLetterGrade } from '@/lib/config/constants'
import { createClient } from '@/lib/supabase/server'

export type StudentDashboardData = {
  studentName: string
  greeting: string
  enrolledCourses: EnrolledCourse[]
  upcomingAssignments: UpcomingAssignment[]
  achievements: Achievement[]
  xpData: XpData
  xpProgress: number
  xpMessage: string
  attendanceRate: number
  assignedTextbooks: AssignedTextbook[]
  stats: {
    coursesEnrolled: number
    assignmentsDue: number
    currentGPA: string
    streak: number
  }
  streakMessage: string
}

export type EnrolledCourse = {
  id: string
  name: string
  teacher: string
  progress: number
  nextLesson: string
}

export type UpcomingAssignment = {
  id: string
  name: string
  course: string
  dueDate: string
  points: number
  urgency: string
}

export type CourseGrade = {
  courseId: string
  courseName: string
  grade: string
  percentage: number
}

export type Achievement = {
  id: string
  name: string
  icon: string
  earnedAt: string
}

export type XpData = {
  currentXP: number
  nextLevelXP: number
  level: number
  levelName: string
  tier: string
}

export type AssignedTextbook = {
  id: string
  title: string
  subject: string
  coverImageUrl: string | null
  readingProgress: number
  textbookId: string
}

type ProfileRow = {
  id: string
  first_name?: string | null
  last_name?: string | null
  full_name?: string | null
}

type CourseRow = {
  id: string
  name: string
  created_by: string
}

type EnrollmentRow = {
  id: string
  courses: CourseRow | CourseRow[] | null
}

type LessonRow = {
  id: string
  course_id: string
  title: string
}

type LessonProgressRow = {
  lesson_id: string
}

type AssignmentRow = {
  id: string
  title: string
  course_id: string
  due_date: string
  max_points?: number | null
}

type GradeRow = {
  points_earned?: number | null
  percentage?: number | null
  assignments: { course_id?: string | null; title?: string | null } | Array<{ course_id?: string | null; title?: string | null }> | null
}

type AchievementRow = {
  id: string
  unlocked_at?: string | null
  achievements: { id?: string | null; name?: string | null; icon?: string | null } | Array<{ id?: string | null; name?: string | null; icon?: string | null }> | null
}

type TextbookAssignmentRow = {
  id: string
  textbook_id: string
  textbook?: {
    title?: string | null
    subject?: string | null
    cover_image_url?: string | null
  } | null
}

function embeddedOne<T>(value: T | T[] | null | undefined) {
  return Array.isArray(value) ? value[0] ?? null : value ?? null
}

function numberValue(value: unknown, fallback = 0) {
  return typeof value === 'number' && Number.isFinite(value) ? value : fallback
}

const XP_THRESHOLDS: Record<number, number> = {
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

const LEVEL_NAMES: Record<number, string> = {
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

const GRADE_POINTS: Record<string, number> = {
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

export async function getStudentDashboardData(): Promise<StudentDashboardData> {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, full_name')
    .eq('id', user.id)
    .single()

  const studentName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    'Student'

  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  let enrolledCourses: EnrolledCourse[] = []
  let upcomingAssignments: UpcomingAssignment[] = []
  let grades: CourseGrade[] = []
  let achievements: Achievement[] = []
  let xpData: XpData = {
    currentXP: 0,
    nextLevelXP: 100,
    level: 1,
    levelName: 'Rookie Navigator',
    tier: 'Bronze',
  }
  let streak = 0
  let attendanceRate = 0
  let assignedTextbooks: AssignedTextbook[] = []

  if (tenantId) {
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

    const courseData = ((enrollments || []) as EnrollmentRow[])
      .map((enrollment) => embeddedOne(enrollment.courses))
      .filter((course): course is CourseRow => Boolean(course?.id))

    const courseIds = courseData.map((course) => course.id)
    const teacherIds = [...new Set(courseData.map((course) => course.created_by).filter(Boolean))]

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
      teacherIds.length > 0
        ? supabase
            .from('profiles')
            .select('id, first_name, last_name, full_name')
            .in('id', teacherIds as string[])
        : Promise.resolve({ data: [] }),
      courseIds.length > 0
        ? supabase
            .from('lessons')
            .select('id, course_id, title, order_index')
            .in('course_id', courseIds)
            .order('order_index', { ascending: true })
        : Promise.resolve({ data: [] }),
      courseIds.length > 0
        ? supabase
            .from('lesson_progress')
            .select('lesson_id, status')
            .eq('user_id', user.id)
            .eq('status', 'completed')
        : Promise.resolve({ data: [] }),
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
      courseIds.length > 0
        ? supabase
            .from('grades')
            .select('id, points_earned, percentage, assignment_id, assignments:assignment_id(course_id, title)')
            .eq('student_id', user.id)
            .eq('tenant_id', tenantId)
            .order('graded_at', { ascending: false })
            .limit(50)
        : Promise.resolve({ data: [] }),
      supabase
        .from('student_xp')
        .select('total_xp, current_level, current_tier')
        .eq('student_id', user.id)
        .eq('tenant_id', tenantId)
        .single(),
      supabase
        .from('student_achievements')
        .select('id, unlocked_at, achievements:achievement_id(id, name, icon)')
        .eq('student_id', user.id)
        .eq('tenant_id', tenantId)
        .order('unlocked_at', { ascending: false })
        .limit(5),
    ])

    const profiles = (profileResult.data || []) as ProfileRow[]
    const lessons = (lessonResult.data || []) as LessonRow[]
    const progressData = (progressResult.data || []) as LessonProgressRow[]
    const assignmentsData = (assignmentResult.data || []) as AssignmentRow[]
    const gradesData = (gradeResult.data || []) as GradeRow[]
    const userLevel = xpResult.data
    const achievementsData = (achievementResult.data || []) as AchievementRow[]

    const courseNameMap: Record<string, string> = {}
    for (const course of courseData) {
      courseNameMap[course.id] = course.name
    }

    enrolledCourses = courseData.map((course) => {
      const teacher = profiles.find((teacherProfile) => teacherProfile.id === course.created_by)
      const teacherName = teacher
        ? teacher.full_name ||
          [teacher.first_name, teacher.last_name].filter(Boolean).join(' ') ||
          'Teacher'
        : 'Teacher'

      const courseLessons = lessons.filter((lesson) => lesson.course_id === course.id)
      const completedLessonIds = new Set(progressData.map((progress) => progress.lesson_id))
      const completedCount = courseLessons.filter((lesson) =>
        completedLessonIds.has(lesson.id)
      ).length
      const progressPct =
        courseLessons.length > 0
          ? Math.round((completedCount / courseLessons.length) * 100)
          : 0

      const nextLesson = courseLessons.find(
        (lesson) => !completedLessonIds.has(lesson.id)
      )

      return {
        id: course.id,
        name: course.name,
        teacher: teacherName,
        progress: progressPct,
        nextLesson: nextLesson?.title || 'All caught up!',
      }
    })

    upcomingAssignments = assignmentsData.map((assignment) => {
      const dueDate = new Date(`${assignment.due_date}T00:00:00`)
      const diffDays = Math.ceil(
        (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
      )

      let urgency = 'upcoming'
      if (diffDays <= 0) urgency = 'today'
      if (diffDays < 0) urgency = 'overdue'

      return {
        id: assignment.id,
        name: assignment.title,
        course: courseNameMap[assignment.course_id] || 'Course',
        dueDate: dueDate.toLocaleDateString('en-US', {
          weekday: 'short',
          month: 'short',
          day: 'numeric',
        }),
        points: numberValue(assignment.max_points),
        urgency,
      }
    })

    const courseTotals: Record<
      string,
      { courseName: string; totalPercentage: number; gradedCount: number }
    > = {}
    for (const grade of gradesData) {
      const assignment = embeddedOne(grade.assignments)
      if (!assignment?.course_id) continue
      const courseId = assignment.course_id
      if (!courseTotals[courseId]) {
        courseTotals[courseId] = {
          courseName: courseNameMap[courseId] || 'Course',
          totalPercentage: 0,
          gradedCount: 0,
        }
      }
      courseTotals[courseId].totalPercentage += numberValue(grade.percentage)
      courseTotals[courseId].gradedCount += 1
    }

    grades = Object.entries(courseTotals).map(([courseId, data]) => {
      const percentage =
        data.gradedCount > 0
          ? Math.round(data.totalPercentage / data.gradedCount)
          : 0
      return {
        courseId,
        courseName: data.courseName,
        grade: getLetterGrade(percentage),
        percentage,
      }
    })

    if (userLevel) {
      const level = userLevel.current_level || 1
      const nextLevelXP = XP_THRESHOLDS[level + 1] || XP_THRESHOLDS[level] || 100

      xpData = {
        currentXP: userLevel.total_xp || 0,
        nextLevelXP,
        level,
        levelName: LEVEL_NAMES[level] || 'Rookie Navigator',
        tier: userLevel.current_tier || 'Bronze',
      }
    }

    achievements = achievementsData.map((userAchievement) => {
      const achievement = embeddedOne(userAchievement.achievements)
      return {
        id: achievement?.id || userAchievement.id,
        name: achievement?.name || 'Achievement',
        icon: achievement?.icon || '🏆',
        earnedAt: userAchievement.unlocked_at
          ? new Date(userAchievement.unlocked_at).toLocaleDateString('en-US', {
              month: 'short',
              day: 'numeric',
              year: 'numeric',
            })
          : '',
      }
    })

    const { data: attendanceRecords } = await supabase
      .from('attendance_records')
      .select('status')
      .eq('tenant_id', tenantId)
      .eq('student_id', user.id)

    if (attendanceRecords && attendanceRecords.length > 0) {
      const present = attendanceRecords.filter((record) => record.status === 'present' || record.status === 'online').length
      attendanceRate = Math.round((present / attendanceRecords.length) * 100)
    }

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
          xpEvents.map((event) => event.created_at?.split('T')[0]).filter(Boolean)
        ),
      ].sort((a, b) => (b as string).localeCompare(a as string))

      let currentStreak = 0
      const today = new Date()
      today.setHours(0, 0, 0, 0)

      for (let index = 0; index < uniqueDays.length; index++) {
        const expectedDate = new Date(today)
        expectedDate.setDate(expectedDate.getDate() - index)
        const expectedStr = expectedDate.toISOString().split('T')[0]

        if (uniqueDays[index] === expectedStr) {
          currentStreak++
        } else {
          break
        }
      }
      streak = currentStreak
    }

    try {
      const textbookAssignments = await getMyTextbooks()
      const typedTextbookAssignments = textbookAssignments as TextbookAssignmentRow[]
      const textbookIds = typedTextbookAssignments.map((assignment) => assignment.textbook_id)

      let readingProgressMap: Record<string, { completed: number; total: number }> = {}
      if (textbookIds.length > 0) {
        const { data: allChapters } = await supabase
          .from('textbook_chapters')
          .select('id, textbook_id')
          .in('textbook_id', textbookIds)
          .eq('tenant_id', tenantId)
          .eq('is_published', true)

        const { data: readingProgress } = await supabase
          .from('student_reading_progress')
          .select('chapter_id, textbook_id, status')
          .eq('student_id', user.id)
          .eq('tenant_id', tenantId)
          .in('textbook_id', textbookIds)

        for (const chapter of allChapters || []) {
          if (!readingProgressMap[chapter.textbook_id]) {
            readingProgressMap[chapter.textbook_id] = { completed: 0, total: 0 }
          }
          readingProgressMap[chapter.textbook_id].total++
        }

        for (const progress of readingProgress || []) {
          if (progress.status === 'completed' && readingProgressMap[progress.textbook_id]) {
            readingProgressMap[progress.textbook_id].completed++
          }
        }
      }

      assignedTextbooks = typedTextbookAssignments.slice(0, 4).map((assignment) => {
        const textbook = assignment.textbook
        const progress = readingProgressMap[assignment.textbook_id]
        const progressPct = progress && progress.total > 0
          ? Math.round((progress.completed / progress.total) * 100)
          : 0

        return {
          id: assignment.id,
          title: textbook?.title || 'Textbook',
          subject: textbook?.subject || 'general',
          coverImageUrl: textbook?.cover_image_url || null,
          readingProgress: progressPct,
          textbookId: assignment.textbook_id,
        }
      })
    } catch {
      // Textbook fetch is non-critical; dashboard still renders.
    }
  }

  const xpProgress =
    xpData.nextLevelXP > 0
      ? Math.min((xpData.currentXP / xpData.nextLevelXP) * 100, 100)
      : 0

  const currentGPA =
    grades.length > 0
      ? (
          grades.reduce(
            (sum, grade) => sum + (GRADE_POINTS[grade.grade] ?? 0),
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

  const streakMessage =
    streak >= 7
      ? "You're UNSTOPPABLE!"
      : streak >= 3
        ? "You're on fire!"
        : streak >= 1
          ? 'Keep it going!'
          : 'Start a streak today!'

  const xpMessage =
    xpProgress >= 90
      ? 'Almost there! So close to leveling up!'
      : xpProgress >= 50
        ? 'Halfway to the next level!'
        : 'Every XP counts!'

  return {
    studentName,
    greeting,
    enrolledCourses,
    upcomingAssignments,
    achievements,
    xpData,
    xpProgress,
    xpMessage,
    attendanceRate,
    assignedTextbooks,
    stats,
    streakMessage,
  }
}
