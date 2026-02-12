import Link from 'next/link'
import {
  ArrowLeft,
  GraduationCap,
  Calendar,
  BookOpen,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react'
import {
  getChildProgress,
  getChildGrades,
  getChildAssignments,
  getChildCourses,
} from '@/app/actions/parent'
import { getAttendanceSummary } from '@/app/actions/attendance'

interface PageProps {
  params: Promise<{ studentId: string }>
}

export default async function ChildDetailPage({ params }: PageProps) {
  const { studentId } = await params

  let progress: Awaited<ReturnType<typeof getChildProgress>> | null = null
  let grades: Awaited<ReturnType<typeof getChildGrades>> = []
  let assignments: Awaited<ReturnType<typeof getChildAssignments>> = []
  let courses: Awaited<ReturnType<typeof getChildCourses>> = []
  let attendanceSummary: Awaited<ReturnType<typeof getAttendanceSummary>> | null = null
  let error: string | null = null

  try {
    const [progressData, gradesData, assignmentsData, coursesData, attendanceData] =
      await Promise.all([
        getChildProgress(studentId),
        getChildGrades(studentId),
        getChildAssignments(studentId),
        getChildCourses(studentId),
        getAttendanceSummary(studentId),
      ])
    progress = progressData
    grades = gradesData
    assignments = assignmentsData
    courses = coursesData
    attendanceSummary = attendanceData
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load student data'
  }

  if (error || !progress) {
    return (
      <div className="space-y-6">
        <Link
          href="/parent/children"
          className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Children
        </Link>
        <div className="ocean-card rounded-2xl p-12 text-center">
          <AlertCircle className="mx-auto h-12 w-12 text-red-500/50" />
          <p className="mt-4 text-red-500">{error || 'Student not found'}</p>
        </div>
      </div>
    )
  }

  const missingAssignments = assignments.filter((a) => a.status === 'missing')
  const upcomingAssignments = assignments.filter((a) => a.status === 'upcoming')
  const recentGradesList = grades
    .flatMap((c) => c.grades.map((g) => ({ ...g, courseName: c.courseName })))
    .sort(
      (a, b) =>
        new Date(b.gradedAt).getTime() - new Date(a.gradedAt).getTime()
    )
    .slice(0, 8)

  return (
    <div className="space-y-4 sm:space-y-8 overflow-x-hidden max-w-full">
      {/* Back Button */}
      <Link
        href="/parent/children"
        className="inline-flex items-center gap-2 text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Children
      </Link>

      {/* Student Header */}
      <div className="ocean-card rounded-2xl overflow-hidden">
        <div className="child-card-header p-4 sm:p-8">
          <div className="flex flex-col sm:flex-row items-center gap-3 sm:gap-6">
            <div className="flex h-14 w-14 sm:h-20 sm:w-20 shrink-0 items-center justify-center rounded-full bg-primary/15 dark:bg-white/20 text-xl sm:text-3xl font-bold text-primary dark:text-white shadow-xl">
              {progress.student.avatarUrl ? (
                <img
                  src={progress.student.avatarUrl}
                  alt={progress.student.fullName}
                  className="h-14 w-14 sm:h-20 sm:w-20 rounded-full object-cover"
                />
              ) : (
                progress.student.fullName.charAt(0).toUpperCase()
              )}
            </div>
            <div className="text-center sm:text-left min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold text-foreground dark:text-white truncate">
                {progress.student.fullName}
              </h1>
              <p className="mt-1 text-muted-foreground dark:text-white/70">
                {progress.student.gradeLevel
                  ? `Grade ${progress.student.gradeLevel}`
                  : 'Student'}
              </p>
            </div>
          </div>
        </div>

        {/* Summary Stats Grid */}
        <div className="grid grid-cols-2 gap-2 sm:gap-4 p-3 sm:p-6 md:grid-cols-4">
          {/* Overall GPA */}
          <div className="rounded-xl bg-muted/50 p-3 sm:p-4 text-center">
            <GraduationCap className="mx-auto mb-1 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 text-primary" />
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {progress.academics.overallGPA != null
                ? `${progress.academics.overallGPA}%`
                : '--'}
            </p>
            <p className="text-xs text-muted-foreground">
              {progress.academics.overallLetterGrade
                ? `Overall GPA (${progress.academics.overallLetterGrade})`
                : 'Overall GPA'}
            </p>
          </div>

          {/* Attendance Rate */}
          <div className="rounded-xl bg-muted/50 p-3 sm:p-4 text-center">
            <Calendar className="mx-auto mb-1 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {attendanceSummary
                ? `${attendanceSummary.rate}%`
                : `${progress.attendance.attendanceRate}%`}
            </p>
            <p className="text-xs text-muted-foreground">Attendance Rate</p>
          </div>

          {/* Current Courses */}
          <div className="rounded-xl bg-muted/50 p-3 sm:p-4 text-center">
            <BookOpen className="mx-auto mb-1 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {progress.academics.activeCourses}
            </p>
            <p className="text-xs text-muted-foreground">Active Courses</p>
          </div>

          {/* Missing Assignments */}
          <div className="rounded-xl bg-muted/50 p-3 sm:p-4 text-center">
            <AlertCircle
              className={`mx-auto mb-1 sm:mb-2 h-5 w-5 sm:h-6 sm:w-6 ${missingAssignments.length > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
            />
            <p
              className={`text-xl sm:text-2xl font-bold ${missingAssignments.length > 0 ? 'text-red-500' : 'text-foreground'}`}
            >
              {missingAssignments.length}
            </p>
            <p className="text-xs text-muted-foreground">Missing Work</p>
          </div>
        </div>
      </div>

      {/* Quick Links */}
      <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
        <Link
          href={`/parent/children/${studentId}/grades`}
          className="group ocean-card rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-primary/10">
            <GraduationCap className="h-5 w-5 sm:h-6 sm:w-6 text-primary" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-primary transition-colors">
              View All Grades
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Detailed grade breakdown
            </p>
          </div>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
        </Link>

        <Link
          href={`/parent/children/${studentId}/assignments`}
          className="group ocean-card rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-500/10">
            <BookOpen className="h-5 w-5 sm:h-6 sm:w-6 text-blue-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-blue-500 transition-colors">
              View Assignments
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Upcoming and past work
            </p>
          </div>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground group-hover:text-blue-500 transition-all group-hover:translate-x-1" />
        </Link>

        <Link
          href={`/parent/progress`}
          className="group ocean-card rounded-2xl p-4 sm:p-5 flex items-center gap-3 sm:gap-4 transition-all hover:scale-[1.02]"
        >
          <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-green-500/10">
            <TrendingUp className="h-5 w-5 sm:h-6 sm:w-6 text-green-500" />
          </div>
          <div className="flex-1 min-w-0">
            <h3 className="font-semibold text-sm sm:text-base text-foreground group-hover:text-green-500 transition-colors">
              Progress Overview
            </h3>
            <p className="text-xs sm:text-sm text-muted-foreground">
              Trends and analytics
            </p>
          </div>
          <ChevronRight className="h-4 w-4 sm:h-5 sm:w-5 shrink-0 text-muted-foreground group-hover:text-green-500 transition-all group-hover:translate-x-1" />
        </Link>
      </div>

      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Recent Grades */}
        <div className="ocean-card rounded-2xl p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <GraduationCap className="h-5 w-5 text-primary" />
              <h3 className="text-lg font-semibold text-foreground">
                Recent Grades
              </h3>
            </div>
            <Link
              href={`/parent/children/${studentId}/grades`}
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {recentGradesList.length === 0 ? (
            <div className="py-8 text-center">
              <GraduationCap className="mx-auto h-10 w-10 text-muted-foreground/30" />
              <p className="mt-2 text-muted-foreground">
                No grades recorded yet.
              </p>
            </div>
          ) : (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Assignment
                    </th>
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Course
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Grade
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {recentGradesList.map((grade) => (
                    <tr
                      key={grade.id}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-3 text-foreground">
                        {grade.assignmentTitle}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {grade.courseName}
                      </td>
                      <td className="px-4 py-3 text-right">
                        {grade.isExcused ? (
                          <span className="rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                            Excused
                          </span>
                        ) : (
                          <span
                            className={`font-semibold ${
                              Number(grade.percentage) >= 90
                                ? 'text-green-600 dark:text-green-400'
                                : Number(grade.percentage) >= 80
                                  ? 'text-blue-600 dark:text-blue-400'
                                  : Number(grade.percentage) >= 70
                                    ? 'text-amber-600 dark:text-amber-400'
                                    : 'text-red-600 dark:text-red-400'
                            }`}
                          >
                            {grade.percentage}%
                            {grade.letterGrade && (
                              <span className="ml-1 text-xs text-muted-foreground">
                                ({grade.letterGrade})
                              </span>
                            )}
                          </span>
                        )}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </div>

        {/* Upcoming Assignments */}
        <div className="ocean-card rounded-2xl p-4 sm:p-6">
          <div className="mb-4 flex items-center justify-between">
            <div className="flex items-center gap-3">
              <BookOpen className="h-5 w-5 text-blue-500" />
              <h3 className="text-lg font-semibold text-foreground">
                Upcoming Assignments
              </h3>
            </div>
            <Link
              href={`/parent/children/${studentId}/assignments`}
              className="text-sm text-primary hover:underline"
            >
              View all
            </Link>
          </div>

          {upcomingAssignments.length === 0 ? (
            <div className="py-8 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/30" />
              <p className="mt-2 text-muted-foreground">
                No upcoming assignments.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {upcomingAssignments.slice(0, 6).map((assignment) => {
                const dueDate = new Date(assignment.dueDate)
                const now = new Date()
                const daysLeft = Math.ceil(
                  (dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24)
                )

                return (
                  <div
                    key={assignment.id}
                    className="flex items-center justify-between gap-2 rounded-xl bg-muted/50 p-3 sm:p-4"
                  >
                    <div className="min-w-0 flex-1">
                      <p className="font-medium text-foreground truncate">
                        {assignment.title}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {assignment.courseName}
                      </p>
                    </div>
                    <div className="ml-4 text-right shrink-0">
                      <p
                        className={`text-sm font-medium ${
                          daysLeft <= 1
                            ? 'text-red-500'
                            : daysLeft <= 3
                              ? 'text-amber-500'
                              : 'text-muted-foreground'
                        }`}
                      >
                        {daysLeft <= 0
                          ? 'Due today'
                          : daysLeft === 1
                            ? 'Due tomorrow'
                            : `Due in ${daysLeft} days`}
                      </p>
                      <p className="text-xs text-muted-foreground">
                        {dueDate.toLocaleDateString()}
                      </p>
                    </div>
                  </div>
                )
              })}
            </div>
          )}

          {/* Missing Assignments Warning */}
          {missingAssignments.length > 0 && (
            <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 dark:border-red-900 dark:bg-red-950/30">
              <div className="flex items-center gap-2">
                <AlertCircle className="h-5 w-5 text-red-500" />
                <p className="font-medium text-red-700 dark:text-red-400">
                  {missingAssignments.length} Missing Assignment
                  {missingAssignments.length !== 1 ? 's' : ''}
                </p>
              </div>
              <ul className="mt-2 space-y-1">
                {missingAssignments.slice(0, 3).map((a) => (
                  <li
                    key={a.id}
                    className="text-sm text-red-600 dark:text-red-400"
                  >
                    {a.title} - {a.courseName}
                  </li>
                ))}
                {missingAssignments.length > 3 && (
                  <li className="text-sm text-red-500">
                    and {missingAssignments.length - 3} more...
                  </li>
                )}
              </ul>
            </div>
          )}
        </div>
      </div>

      {/* Courses and Attendance Row */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Current Courses */}
        <div className="ocean-card rounded-2xl p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <BookOpen className="h-5 w-5 text-blue-500" />
            <h3 className="text-lg font-semibold text-foreground">
              Current Courses
            </h3>
          </div>

          {courses.filter((c) => c.enrollmentStatus === 'active').length ===
          0 ? (
            <div className="py-8 text-center">
              <BookOpen className="mx-auto h-10 w-10 text-muted-foreground/30" />
              <p className="mt-2 text-muted-foreground">
                Not enrolled in any courses.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {courses
                .filter((c) => c.enrollmentStatus === 'active')
                .map((course) => (
                  <div
                    key={course.enrollmentId}
                    className="flex items-center justify-between gap-2 rounded-xl bg-muted/50 p-3 sm:p-4"
                  >
                    <div>
                      <p className="font-medium text-foreground">
                        {course.courseName}
                      </p>
                      <p className="text-sm text-muted-foreground">
                        {course.teacherName}
                        {course.subject && ` - ${course.subject}`}
                      </p>
                    </div>
                    {course.gradeLetter && (
                      <span
                        className={`rounded-full px-3 py-1 text-sm font-bold ${
                          course.gradeLetter.startsWith('A')
                            ? 'bg-green-100 text-green-700 dark:bg-green-900/30 dark:text-green-400'
                            : course.gradeLetter.startsWith('B')
                              ? 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
                              : course.gradeLetter.startsWith('C')
                                ? 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
                                : 'bg-red-100 text-red-700 dark:bg-red-900/30 dark:text-red-400'
                        }`}
                      >
                        {course.gradeLetter}
                      </span>
                    )}
                  </div>
                ))}
            </div>
          )}
        </div>

        {/* Attendance Summary */}
        <div className="ocean-card rounded-2xl p-4 sm:p-6">
          <div className="mb-4 flex items-center gap-3">
            <Calendar className="h-5 w-5 text-green-500" />
            <h3 className="text-lg font-semibold text-foreground">
              Attendance Summary
            </h3>
          </div>

          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
              <div className="rounded-lg bg-green-50 p-2 sm:p-4 dark:bg-green-950/30">
                <p className="text-xl sm:text-2xl font-bold text-green-600 dark:text-green-400">
                  {progress.attendance.presentDays}
                </p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">
                  Present
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-2 sm:p-4 dark:bg-amber-950/30">
                <p className="text-xl sm:text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {progress.attendance.tardyDays}
                </p>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                  Tardy
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-2 sm:p-4 dark:bg-red-950/30">
                <p className="text-xl sm:text-2xl font-bold text-red-600 dark:text-red-400">
                  {progress.attendance.absentDays}
                </p>
                <p className="text-xs text-red-600/70 dark:text-red-400/70">
                  Absent
                </p>
              </div>
            </div>

            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div>
                <p className="font-medium text-foreground">Attendance Rate</p>
                <p className="text-sm text-muted-foreground">
                  {progress.attendance.totalDays} total days
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-2xl font-bold ${
                    progress.attendance.attendanceRate >= 95
                      ? 'text-green-600 dark:text-green-400'
                      : progress.attendance.attendanceRate >= 85
                        ? 'text-amber-600 dark:text-amber-400'
                        : 'text-red-600 dark:text-red-400'
                  }`}
                >
                  {progress.attendance.attendanceRate}%
                </p>
              </div>
            </div>

            {progress.attendance.excusedDays > 0 && (
              <p className="text-sm text-muted-foreground">
                {progress.attendance.excusedDays} excused absence
                {progress.attendance.excusedDays !== 1 ? 's' : ''}
              </p>
            )}
          </div>
        </div>
      </div>

      {/* Gamification Stats */}
      <div className="ocean-card rounded-2xl p-4 sm:p-6">
        <div className="mb-4 flex items-center gap-3">
          <Award className="h-5 w-5 text-amber-500" />
          <h3 className="text-lg font-semibold text-foreground">
            Gamification Progress
          </h3>
        </div>
        <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-4">
          <div className="rounded-xl bg-muted/50 p-2 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-primary">
              {progress.gamification.totalXP.toLocaleString()}
            </p>
            <p className="text-xs text-muted-foreground">Total XP</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-2 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              Level {progress.gamification.currentLevel}
            </p>
            <p className="text-xs text-muted-foreground capitalize">
              {progress.gamification.currentTier}
            </p>
          </div>
          <div className="rounded-xl bg-muted/50 p-2 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-amber-500">
              {progress.gamification.streakDays}
            </p>
            <p className="text-xs text-muted-foreground">Day Streak</p>
          </div>
          <div className="rounded-xl bg-muted/50 p-2 sm:p-4 text-center">
            <p className="text-xl sm:text-2xl font-bold text-foreground">
              {progress.gamification.coins}
            </p>
            <p className="text-xs text-muted-foreground">Coins Earned</p>
          </div>
        </div>
      </div>
    </div>
  )
}
