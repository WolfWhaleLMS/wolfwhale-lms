import Link from 'next/link'
import {
  TrendingUp,
  GraduationCap,
  Calendar,
  Award,
  BookOpen,
  AlertCircle,
  Users,
  ChevronRight,
  ArrowLeft,
} from 'lucide-react'
import { getChildren, getChildProgress } from '@/app/actions/parent'
import { getAttendanceSummary } from '@/app/actions/attendance'

export default async function ProgressOverviewPage() {
  let children: Awaited<ReturnType<typeof getChildren>> = []
  let error: string | null = null

  try {
    children = await getChildren()
  } catch (e: any) {
    error = e.message ?? 'Failed to load children'
  }

  // Load progress data for each child
  const childProgressData: Array<{
    child: (typeof children)[number]
    progress: Awaited<ReturnType<typeof getChildProgress>> | null
    attendance: Awaited<ReturnType<typeof getAttendanceSummary>> | null
  }> = []

  for (const child of children) {
    try {
      const [progressData, attendanceData] = await Promise.all([
        getChildProgress(child.studentId),
        getAttendanceSummary(child.studentId),
      ])
      childProgressData.push({
        child,
        progress: progressData,
        attendance: attendanceData,
      })
    } catch {
      childProgressData.push({
        child,
        progress: null,
        attendance: null,
      })
    }
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/parent/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Progress Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          Academic progress, attendance trends, and gamification data for your
          children.
        </p>
      </div>

      {/* Error State */}
      {error && (
        <div className="ocean-card rounded-2xl p-6">
          <div className="flex items-center gap-3 text-red-500">
            <AlertCircle className="h-5 w-5" />
            <p>{error}</p>
          </div>
        </div>
      )}

      {/* Empty State */}
      {!error && children.length === 0 && (
        <div className="ocean-card rounded-2xl p-12 text-center">
          <Users className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No Children Linked
          </h3>
          <p className="mt-2 max-w-md mx-auto text-muted-foreground">
            Your account is not linked to any students yet. Contact your school
            administrator to connect your children.
          </p>
        </div>
      )}

      {/* Child Progress Cards */}
      {childProgressData.map(({ child, progress, attendance }) => (
        <div
          key={child.studentId}
          className="ocean-card rounded-2xl overflow-hidden"
        >
          {/* Child Header */}
          <div className="whale-gradient p-6">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-4">
                <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold text-white">
                  {child.avatarUrl ? (
                    <img
                      src={child.avatarUrl}
                      alt={child.fullName}
                      className="h-14 w-14 rounded-full object-cover"
                    />
                  ) : (
                    child.fullName.charAt(0).toUpperCase()
                  )}
                </div>
                <div>
                  <h2 className="text-xl font-bold text-white">
                    {child.fullName}
                  </h2>
                  <p className="text-white/70">
                    {child.gradeLevel
                      ? `Grade ${child.gradeLevel}`
                      : 'Student'}
                  </p>
                </div>
              </div>
              <Link
                href={`/parent/children/${child.studentId}`}
                className="hidden sm:flex items-center gap-1 rounded-xl bg-white/10 px-4 py-2 text-sm text-white hover:bg-white/20 transition-colors"
              >
                View Details
                <ChevronRight className="h-4 w-4" />
              </Link>
            </div>
          </div>

          {progress ? (
            <div className="p-6 space-y-6">
              {/* Quick Stats Row */}
              <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <GraduationCap className="mx-auto mb-2 h-5 w-5 text-primary" />
                  <p
                    className={`text-xl font-bold ${
                      progress.academics.overallGPA != null
                        ? progress.academics.overallGPA >= 90
                          ? 'text-green-600 dark:text-green-400'
                          : progress.academics.overallGPA >= 80
                            ? 'text-blue-600 dark:text-blue-400'
                            : progress.academics.overallGPA >= 70
                              ? 'text-amber-600 dark:text-amber-400'
                              : 'text-red-600 dark:text-red-400'
                        : 'text-foreground'
                    }`}
                  >
                    {progress.academics.overallGPA != null
                      ? `${progress.academics.overallGPA}%`
                      : '--'}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Overall Grade
                    {progress.academics.overallLetterGrade &&
                      ` (${progress.academics.overallLetterGrade})`}
                  </p>
                </div>

                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <Calendar className="mx-auto mb-2 h-5 w-5 text-green-500" />
                  <p
                    className={`text-xl font-bold ${
                      progress.attendance.attendanceRate >= 95
                        ? 'text-green-600 dark:text-green-400'
                        : progress.attendance.attendanceRate >= 85
                          ? 'text-amber-600 dark:text-amber-400'
                          : 'text-red-600 dark:text-red-400'
                    }`}
                  >
                    {progress.attendance.attendanceRate}%
                  </p>
                  <p className="text-xs text-muted-foreground">Attendance</p>
                </div>

                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <BookOpen className="mx-auto mb-2 h-5 w-5 text-blue-500" />
                  <p className="text-xl font-bold text-foreground">
                    {progress.academics.activeCourses}
                  </p>
                  <p className="text-xs text-muted-foreground">
                    Active Courses
                  </p>
                </div>

                <div className="rounded-xl bg-muted/50 p-4 text-center">
                  <Award className="mx-auto mb-2 h-5 w-5 text-amber-500" />
                  <p className="text-xl font-bold text-amber-500">
                    {progress.gamification.totalXP.toLocaleString()}
                  </p>
                  <p className="text-xs text-muted-foreground">XP Earned</p>
                </div>
              </div>

              {/* Grade Trend (placeholder chart area) */}
              <div className="glass-panel rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <TrendingUp className="h-5 w-5 text-primary" />
                  <h3 className="font-semibold text-foreground">
                    Grade Trend
                  </h3>
                </div>

                {progress.academics.recentGrades.length > 0 ? (
                  <div className="space-y-3">
                    {/* Simple visual bar chart for recent grades */}
                    <div className="flex items-end gap-2 h-32">
                      {progress.academics.recentGrades.map((grade, i) => {
                        const height = Math.max(
                          (grade.percentage / 100) * 100,
                          8
                        )
                        return (
                          <div
                            key={i}
                            className="flex-1 flex flex-col items-center justify-end"
                          >
                            <span className="text-xs text-muted-foreground mb-1">
                              {Math.round(grade.percentage)}%
                            </span>
                            <div
                              className={`w-full rounded-t-md transition-all ${
                                grade.percentage >= 90
                                  ? 'bg-green-500/70'
                                  : grade.percentage >= 80
                                    ? 'bg-blue-500/70'
                                    : grade.percentage >= 70
                                      ? 'bg-amber-500/70'
                                      : 'bg-red-500/70'
                              }`}
                              style={{ height: `${height}%` }}
                            />
                          </div>
                        )
                      })}
                    </div>
                    <p className="text-center text-xs text-muted-foreground">
                      Last {progress.academics.recentGrades.length} graded
                      assignments
                    </p>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <TrendingUp className="mx-auto h-10 w-10 text-muted-foreground/30" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      Grade trend data will appear as assignments are graded.
                    </p>
                  </div>
                )}
              </div>

              {/* Attendance Breakdown */}
              <div className="glass-panel rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Calendar className="h-5 w-5 text-green-500" />
                  <h3 className="font-semibold text-foreground">
                    Attendance Breakdown
                  </h3>
                </div>

                {progress.attendance.totalDays > 0 ? (
                  <div className="space-y-3">
                    {/* Attendance bar */}
                    <div className="h-6 w-full overflow-hidden rounded-full bg-muted flex">
                      {progress.attendance.presentDays > 0 && (
                        <div
                          className="h-full bg-green-500 transition-all"
                          style={{
                            width: `${(progress.attendance.presentDays / progress.attendance.totalDays) * 100}%`,
                          }}
                          title={`Present: ${progress.attendance.presentDays}`}
                        />
                      )}
                      {progress.attendance.tardyDays > 0 && (
                        <div
                          className="h-full bg-amber-500 transition-all"
                          style={{
                            width: `${(progress.attendance.tardyDays / progress.attendance.totalDays) * 100}%`,
                          }}
                          title={`Tardy: ${progress.attendance.tardyDays}`}
                        />
                      )}
                      {progress.attendance.excusedDays > 0 && (
                        <div
                          className="h-full bg-blue-400 transition-all"
                          style={{
                            width: `${(progress.attendance.excusedDays / progress.attendance.totalDays) * 100}%`,
                          }}
                          title={`Excused: ${progress.attendance.excusedDays}`}
                        />
                      )}
                      {progress.attendance.absentDays > 0 && (
                        <div
                          className="h-full bg-red-500 transition-all"
                          style={{
                            width: `${(progress.attendance.absentDays / progress.attendance.totalDays) * 100}%`,
                          }}
                          title={`Absent: ${progress.attendance.absentDays}`}
                        />
                      )}
                    </div>

                    {/* Legend */}
                    <div className="flex flex-wrap gap-4 text-sm">
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-green-500" />
                        <span className="text-muted-foreground">
                          Present ({progress.attendance.presentDays})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-amber-500" />
                        <span className="text-muted-foreground">
                          Tardy ({progress.attendance.tardyDays})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-blue-400" />
                        <span className="text-muted-foreground">
                          Excused ({progress.attendance.excusedDays})
                        </span>
                      </div>
                      <div className="flex items-center gap-2">
                        <div className="h-3 w-3 rounded-full bg-red-500" />
                        <span className="text-muted-foreground">
                          Absent ({progress.attendance.absentDays})
                        </span>
                      </div>
                    </div>
                  </div>
                ) : (
                  <div className="py-8 text-center">
                    <Calendar className="mx-auto h-10 w-10 text-muted-foreground/30" />
                    <p className="mt-2 text-sm text-muted-foreground">
                      No attendance records yet.
                    </p>
                  </div>
                )}
              </div>

              {/* XP / Gamification Progress */}
              <div className="glass-panel rounded-2xl p-6">
                <div className="mb-4 flex items-center gap-3">
                  <Award className="h-5 w-5 text-amber-500" />
                  <h3 className="font-semibold text-foreground">
                    Gamification Progress
                  </h3>
                </div>

                <div className="grid grid-cols-2 gap-4 sm:grid-cols-3">
                  <div className="rounded-xl bg-muted/50 p-4 text-center">
                    <p className="text-lg font-bold text-amber-500">
                      Level {progress.gamification.currentLevel}
                    </p>
                    <p className="text-xs text-muted-foreground capitalize">
                      {progress.gamification.currentTier} Tier
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-4 text-center">
                    <p className="text-lg font-bold text-primary">
                      {progress.gamification.totalXP.toLocaleString()} XP
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Total Experience
                    </p>
                  </div>
                  <div className="rounded-xl bg-muted/50 p-4 text-center">
                    <p className="text-lg font-bold text-foreground">
                      {progress.gamification.streakDays} days
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Current Streak (Best:{' '}
                      {progress.gamification.longestStreak})
                    </p>
                  </div>
                </div>

                {/* XP Progress Bar */}
                <div className="mt-4">
                  <div className="mb-2 flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      Level {progress.gamification.currentLevel}
                    </span>
                    <span className="font-medium text-foreground">
                      {progress.gamification.totalXP.toLocaleString()} XP
                    </span>
                  </div>
                  <div className="h-3 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-primary to-primary/70 transition-all duration-500"
                      style={{
                        width: `${Math.min(
                          ((progress.gamification.totalXP % 1000) / 1000) * 100,
                          100
                        )}%`,
                      }}
                    />
                  </div>
                  <p className="mt-1 text-xs text-muted-foreground">
                    {1000 - (progress.gamification.totalXP % 1000)} XP to next
                    level
                  </p>
                </div>
              </div>
            </div>
          ) : (
            <div className="p-6">
              <div className="py-8 text-center">
                <AlertCircle className="mx-auto h-10 w-10 text-muted-foreground/30" />
                <p className="mt-2 text-muted-foreground">
                  Could not load progress data for this student.
                </p>
              </div>
            </div>
          )}
        </div>
      ))}
    </div>
  )
}
