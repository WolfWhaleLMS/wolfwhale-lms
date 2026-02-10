import Link from 'next/link'
import {
  Users,
  GraduationCap,
  Calendar,
  ClipboardList,
  MessageSquare,
  TrendingUp,
  AlertCircle,
  ChevronRight,
  BarChart3,
  BookOpen,
  Clock,
} from 'lucide-react'
import { getChildren } from '@/app/actions/parent'

export default async function ParentDashboardPage() {
  let children: Awaited<ReturnType<typeof getChildren>> = []
  let error: string | null = null

  try {
    children = await getChildren()
  } catch (e: any) {
    error = e.message ?? 'Failed to load data'
  }

  const totalMissing = children.reduce((s, c) => s + c.missingAssignments, 0)
  const avgGPA =
    children.filter((c) => c.gpa > 0).length > 0
      ? Math.round(
          (children.filter((c) => c.gpa > 0).reduce((s, c) => s + c.gpa, 0) /
            children.filter((c) => c.gpa > 0).length) *
            10
        ) / 10
      : null
  const avgAttendance =
    children.filter((c) => c.attendanceRate > 0).length > 0
      ? Math.round(
          children
            .filter((c) => c.attendanceRate > 0)
            .reduce((s, c) => s + c.attendanceRate, 0) /
            children.filter((c) => c.attendanceRate > 0).length
        )
      : null

  function getGradeColor(gpa: number) {
    if (gpa >= 90) return 'text-green-600 dark:text-green-400'
    if (gpa >= 80) return 'text-blue-600 dark:text-blue-400'
    if (gpa >= 70) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  function getAttendanceColor(rate: number) {
    if (rate >= 95) return 'text-green-600 dark:text-green-400'
    if (rate >= 85) return 'text-amber-600 dark:text-amber-400'
    return 'text-red-600 dark:text-red-400'
  }

  return (
    <div className="space-y-8 pb-12">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Parent Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Monitor your children&apos;s academic progress at a glance.
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

      {/* No Children State */}
      {!error && children.length === 0 && (
        <div className="ocean-card rounded-2xl p-12 text-center">
          <Users className="mx-auto h-16 w-16 text-muted-foreground/30" />
          <h3 className="mt-4 text-lg font-semibold text-foreground">
            No Children Linked
          </h3>
          <p className="mt-2 max-w-md mx-auto text-muted-foreground">
            Your account is not linked to any students yet. Contact your
            school&apos;s administrator to connect your account with your
            child&apos;s profile.
          </p>
        </div>
      )}

      {children.length > 0 && (
        <>
          {/* Summary Stats */}
          <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
            <div className="ocean-card rounded-2xl p-5 text-center">
              <Users className="mx-auto mb-2 h-6 w-6 text-primary" />
              <p className="text-3xl font-bold text-foreground">
                {children.length}
              </p>
              <p className="text-sm text-muted-foreground">
                {children.length === 1 ? 'Child' : 'Children'}
              </p>
            </div>
            <div className="ocean-card rounded-2xl p-5 text-center">
              <GraduationCap className="mx-auto mb-2 h-6 w-6 text-blue-500" />
              <p
                className={`text-3xl font-bold ${avgGPA ? getGradeColor(avgGPA) : 'text-foreground'}`}
              >
                {avgGPA ? `${avgGPA}%` : '--'}
              </p>
              <p className="text-sm text-muted-foreground">Avg Grade</p>
            </div>
            <div className="ocean-card rounded-2xl p-5 text-center">
              <Calendar className="mx-auto mb-2 h-6 w-6 text-green-500" />
              <p
                className={`text-3xl font-bold ${avgAttendance ? getAttendanceColor(avgAttendance) : 'text-foreground'}`}
              >
                {avgAttendance ? `${avgAttendance}%` : '--'}
              </p>
              <p className="text-sm text-muted-foreground">Avg Attendance</p>
            </div>
            <div className="ocean-card rounded-2xl p-5 text-center">
              <AlertCircle
                className={`mx-auto mb-2 h-6 w-6 ${totalMissing > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
              />
              <p
                className={`text-3xl font-bold ${totalMissing > 0 ? 'text-red-500' : 'text-foreground'}`}
              >
                {totalMissing}
              </p>
              <p className="text-sm text-muted-foreground">
                Missing Assignments
              </p>
            </div>
          </div>

          {/* Children Cards */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Your Children
            </h2>
            <div className="grid gap-6 md:grid-cols-2">
              {children.map((child) => (
                <Link
                  key={child.studentId}
                  href={`/parent/children/${child.studentId}`}
                  className="group"
                >
                  <div className="ocean-card rounded-2xl overflow-hidden transition-all group-hover:scale-[1.01] group-hover:shadow-lg">
                    {/* Child Header */}
                    <div className="whale-gradient p-5">
                      <div className="flex items-center gap-4">
                        <div className="flex h-14 w-14 items-center justify-center rounded-full bg-white/20 text-xl font-bold text-white shadow-lg">
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
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl font-bold text-white truncate group-hover:underline">
                            {child.fullName}
                          </h3>
                          <p className="text-white/70">
                            {child.gradeLevel
                              ? `Grade ${child.gradeLevel}`
                              : 'Student'}
                            {child.relationship && (
                              <span className="ml-2 capitalize">
                                ({child.relationship})
                              </span>
                            )}
                          </p>
                        </div>
                        <ChevronRight className="h-6 w-6 text-white/50 group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    </div>

                    {/* Quick Stats */}
                    <div className="p-5">
                      <div className="grid grid-cols-2 gap-3 sm:grid-cols-4">
                        <div className="rounded-xl bg-muted/50 p-3 text-center">
                          <GraduationCap className="mx-auto mb-1 h-4 w-4 text-primary" />
                          <p
                            className={`text-lg font-bold ${child.gpa > 0 ? getGradeColor(child.gpa) : 'text-foreground'}`}
                          >
                            {child.gpa > 0 ? `${child.gpa}%` : '--'}
                          </p>
                          <p className="text-xs text-muted-foreground">Grade</p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-3 text-center">
                          <Calendar className="mx-auto mb-1 h-4 w-4 text-green-500" />
                          <p
                            className={`text-lg font-bold ${child.attendanceRate > 0 ? getAttendanceColor(child.attendanceRate) : 'text-foreground'}`}
                          >
                            {child.attendanceRate > 0
                              ? `${child.attendanceRate}%`
                              : '--'}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Attendance
                          </p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-3 text-center">
                          <BookOpen className="mx-auto mb-1 h-4 w-4 text-blue-500" />
                          <p className="text-lg font-bold text-foreground">
                            {child.courseCount}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Courses
                          </p>
                        </div>
                        <div className="rounded-xl bg-muted/50 p-3 text-center">
                          <AlertCircle
                            className={`mx-auto mb-1 h-4 w-4 ${child.missingAssignments > 0 ? 'text-red-500' : 'text-muted-foreground'}`}
                          />
                          <p
                            className={`text-lg font-bold ${child.missingAssignments > 0 ? 'text-red-500' : 'text-foreground'}`}
                          >
                            {child.missingAssignments}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            Missing
                          </p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-4">
            <h2 className="text-lg font-semibold text-foreground">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
              <Link
                href="/parent/children"
                className="ocean-card rounded-2xl p-6 flex items-center gap-4 transition-all hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-6 w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">View Children</p>
                  <p className="text-sm text-muted-foreground">
                    Detailed profiles & grades
                  </p>
                </div>
              </Link>
              <Link
                href="/parent/progress"
                className="ocean-card rounded-2xl p-6 flex items-center gap-4 transition-all hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                  <BarChart3 className="h-6 w-6 text-green-600 dark:text-green-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Progress Overview
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Trends & analytics
                  </p>
                </div>
              </Link>
              <Link
                href="/messaging"
                className="ocean-card rounded-2xl p-6 flex items-center gap-4 transition-all hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex h-12 w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <MessageSquare className="h-6 w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div>
                  <p className="font-semibold text-foreground">
                    Message Teacher
                  </p>
                  <p className="text-sm text-muted-foreground">
                    Contact teachers directly
                  </p>
                </div>
              </Link>
            </div>
          </div>
        </>
      )}
    </div>
  )
}
