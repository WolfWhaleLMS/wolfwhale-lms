import Link from 'next/link'
import {
  Users,
  GraduationCap,
  Calendar,
  BookOpen,
  AlertCircle,
  ChevronRight,
  TrendingUp,
  Award,
} from 'lucide-react'
import { getChildren, getChildAssignments } from '@/app/actions/parent'
import { getAttendanceSummary } from '@/app/actions/attendance'

function DashboardCard({
  title,
  icon,
  children,
  className = '',
}: {
  title: string
  icon: React.ReactNode
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`ocean-card rounded-2xl p-6 ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        {icon}
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      </div>
      {children}
    </div>
  )
}

export default async function ParentDashboardPage() {
  let childrenData: Awaited<ReturnType<typeof getChildren>> = []
  let allAssignments: Array<
    Awaited<ReturnType<typeof getChildAssignments>>[number] & {
      childName: string
    }
  > = []
  let attendanceSummaries: Array<{
    studentId: string
    childName: string
    summary: Awaited<ReturnType<typeof getAttendanceSummary>>
  }> = []
  let error: string | null = null

  try {
    childrenData = await getChildren()

    // Load assignments and attendance for each child
    const results = await Promise.allSettled(
      childrenData.map(async (child) => {
        const [assignments, attendance] = await Promise.all([
          getChildAssignments(child.studentId),
          getAttendanceSummary(child.studentId),
        ])
        return { child, assignments, attendance }
      })
    )

    for (const result of results) {
      if (result.status === 'fulfilled') {
        const { child, assignments, attendance } = result.value
        for (const a of assignments) {
          allAssignments.push({ ...a, childName: child.fullName })
        }
        attendanceSummaries.push({
          studentId: child.studentId,
          childName: child.fullName,
          summary: attendance,
        })
      }
    }
  } catch (e: any) {
    error = e.message ?? 'Failed to load dashboard data'
  }

  // Calculate aggregate stats
  const totalChildren = childrenData.length
  const averageGPA =
    childrenData.length > 0
      ? Math.round(
          (childrenData.reduce((sum, c) => sum + c.gpa, 0) /
            childrenData.length) *
            10
        ) / 10
      : 0
  const totalMissing = childrenData.reduce(
    (sum, c) => sum + c.missingAssignments,
    0
  )
  const averageAttendance =
    attendanceSummaries.length > 0
      ? Math.round(
          attendanceSummaries.reduce((sum, a) => sum + a.summary.rate, 0) /
            attendanceSummaries.length
        )
      : 0

  // Sort and filter assignments
  const upcomingAssignments = allAssignments
    .filter((a) => a.status === 'upcoming')
    .sort(
      (a, b) => new Date(a.dueDate).getTime() - new Date(b.dueDate).getTime()
    )
    .slice(0, 8)

  const missingAssignments = allAssignments
    .filter((a) => a.status === 'missing')
    .slice(0, 5)

  // Aggregate attendance
  const totalPresent = attendanceSummaries.reduce(
    (sum, a) => sum + a.summary.present,
    0
  )
  const totalTardy = attendanceSummaries.reduce(
    (sum, a) => sum + a.summary.tardy,
    0
  )
  const totalAbsent = attendanceSummaries.reduce(
    (sum, a) => sum + a.summary.absent,
    0
  )

  return (
    <div className="space-y-8">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Parent Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            Stay connected with your{' '}
            {totalChildren === 1 ? "child's" : "children's"} learning progress.
          </p>
        </div>
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

      {/* Quick Stats Row */}
      <div className="grid grid-cols-2 gap-4 lg:grid-cols-4">
        <div className="ocean-card rounded-2xl p-5 text-center">
          <Users className="mx-auto mb-2 h-6 w-6 text-primary" />
          <p className="text-3xl font-bold text-primary">{totalChildren}</p>
          <p className="mt-1 text-sm text-muted-foreground">
            {totalChildren === 1 ? 'Child' : 'Children'}
          </p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <GraduationCap className="mx-auto mb-2 h-6 w-6 text-blue-500" />
          <p className="text-3xl font-bold text-blue-500">
            {averageGPA > 0 ? `${averageGPA}%` : '--'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Average Grade</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <Calendar className="mx-auto mb-2 h-6 w-6 text-green-500" />
          <p className="text-3xl font-bold text-green-500">
            {averageAttendance > 0 ? `${averageAttendance}%` : '--'}
          </p>
          <p className="mt-1 text-sm text-muted-foreground">Attendance</p>
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
          <p className="mt-1 text-sm text-muted-foreground">Missing Work</p>
        </div>
      </div>

      {/* Children Cards */}
      <DashboardCard
        title="My Children"
        icon={<Users className="h-5 w-5 text-primary" />}
      >
        {childrenData.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Users className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">No linked children yet.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Contact your school administrator to link your children to your
              account.
            </p>
          </div>
        ) : (
          <div className="grid gap-4 sm:grid-cols-2">
            {childrenData.map((child) => (
              <Link
                key={child.studentId}
                href={`/parent/children/${child.studentId}`}
                className="group"
              >
                <div className="flex items-center gap-4 rounded-xl bg-muted/50 p-4 transition-all hover:bg-muted/80 hover:scale-[1.02]">
                  <div className="flex h-12 w-12 items-center justify-center rounded-full bg-primary/10 text-lg font-bold text-primary">
                    {child.avatarUrl ? (
                      <img
                        src={child.avatarUrl}
                        alt={child.fullName}
                        className="h-12 w-12 rounded-full object-cover"
                      />
                    ) : (
                      child.fullName.charAt(0).toUpperCase()
                    )}
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="font-semibold text-foreground truncate group-hover:text-primary transition-colors">
                      {child.fullName}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {child.gradeLevel
                        ? `Grade ${child.gradeLevel}`
                        : 'Student'}
                      {' - '}
                      {child.courseCount} course
                      {child.courseCount !== 1 ? 's' : ''}
                    </p>
                  </div>
                  <div className="hidden sm:flex items-center gap-3 text-sm shrink-0">
                    {child.gpa > 0 && (
                      <span
                        className={`font-semibold ${
                          child.gpa >= 90
                            ? 'text-green-600 dark:text-green-400'
                            : child.gpa >= 80
                              ? 'text-blue-600 dark:text-blue-400'
                              : child.gpa >= 70
                                ? 'text-amber-600 dark:text-amber-400'
                                : 'text-red-600 dark:text-red-400'
                        }`}
                      >
                        {child.gpa}%
                      </span>
                    )}
                    {child.missingAssignments > 0 && (
                      <span className="flex items-center gap-1 text-red-500">
                        <AlertCircle className="h-3.5 w-3.5" />
                        {child.missingAssignments}
                      </span>
                    )}
                  </div>
                  <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary group-hover:translate-x-1 transition-all" />
                </div>
              </Link>
            ))}
          </div>
        )}

        {childrenData.length > 0 && (
          <div className="mt-4 text-center">
            <Link
              href="/parent/children"
              className="text-sm text-primary hover:underline"
            >
              View all children details
            </Link>
          </div>
        )}
      </DashboardCard>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Grade Summary */}
        <DashboardCard
          title="Grade Summary"
          icon={<GraduationCap className="h-5 w-5 text-blue-500" />}
        >
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div>
                <p className="font-medium text-foreground">Overall Average</p>
                <p className="text-sm text-muted-foreground">
                  Across all children
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">
                  {averageGPA > 0 ? `${averageGPA}%` : '--'}
                </p>
                {averageGPA === 0 && (
                  <p className="text-xs text-muted-foreground">No data yet</p>
                )}
              </div>
            </div>

            {childrenData.length > 0 ? (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                        Child
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                        GPA
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                        Courses
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {childrenData.map((child) => (
                      <tr
                        key={child.studentId}
                        className="border-b border-border last:border-0"
                      >
                        <td className="px-4 py-3 text-foreground">
                          <Link
                            href={`/parent/children/${child.studentId}/grades`}
                            className="hover:text-primary hover:underline"
                          >
                            {child.fullName}
                          </Link>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`font-semibold ${
                              child.gpa > 0
                                ? child.gpa >= 90
                                  ? 'text-green-600 dark:text-green-400'
                                  : child.gpa >= 80
                                    ? 'text-blue-600 dark:text-blue-400'
                                    : child.gpa >= 70
                                      ? 'text-amber-600 dark:text-amber-400'
                                      : 'text-red-600 dark:text-red-400'
                                : 'text-muted-foreground'
                            }`}
                          >
                            {child.gpa > 0 ? `${child.gpa}%` : '--'}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right text-muted-foreground">
                          {child.courseCount}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            ) : (
              <div className="overflow-hidden rounded-xl border border-border">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b border-border bg-muted/50">
                      <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                        Course
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                        Grade
                      </th>
                      <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                        Trend
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    <tr>
                      <td
                        colSpan={3}
                        className="px-4 py-6 text-center text-muted-foreground"
                      >
                        No grade data available.
                      </td>
                    </tr>
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* Attendance Summary */}
        <DashboardCard
          title="Attendance Summary"
          icon={<Calendar className="h-5 w-5 text-green-500" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-green-50 p-4 dark:bg-green-950/30">
                <p className="text-2xl font-bold text-green-600 dark:text-green-400">
                  {totalPresent || '--'}
                </p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">
                  Days Present
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-4 dark:bg-amber-950/30">
                <p className="text-2xl font-bold text-amber-600 dark:text-amber-400">
                  {totalTardy || '--'}
                </p>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                  Days Late
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-4 dark:bg-red-950/30">
                <p className="text-2xl font-bold text-red-600 dark:text-red-400">
                  {totalAbsent || '--'}
                </p>
                <p className="text-xs text-red-600/70 dark:text-red-400/70">
                  Days Absent
                </p>
              </div>
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div>
                <p className="font-medium text-foreground">Attendance Rate</p>
                <p className="text-sm text-muted-foreground">
                  All children combined
                </p>
              </div>
              <div className="text-right">
                <p
                  className={`text-2xl font-bold ${
                    averageAttendance >= 95
                      ? 'text-green-600 dark:text-green-400'
                      : averageAttendance >= 85
                        ? 'text-amber-600 dark:text-amber-400'
                        : averageAttendance > 0
                          ? 'text-red-600 dark:text-red-400'
                          : 'text-primary'
                  }`}
                >
                  {averageAttendance > 0 ? `${averageAttendance}%` : '--%'}
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Missing Assignments Alert */}
        {missingAssignments.length > 0 && (
          <div className="ocean-card rounded-2xl border-l-4 border-l-red-500 p-6 lg:col-span-2">
            <div className="mb-4 flex items-center gap-3">
              <AlertCircle className="h-5 w-5 text-red-500" />
              <h3 className="text-lg font-semibold text-red-700 dark:text-red-400">
                Missing Assignments ({totalMissing})
              </h3>
            </div>
            <div className="space-y-3">
              {missingAssignments.map((assignment) => (
                <div
                  key={assignment.id}
                  className="flex items-center justify-between rounded-xl bg-red-50 p-4 dark:bg-red-950/20"
                >
                  <div className="min-w-0 flex-1">
                    <p className="font-medium text-foreground truncate">
                      {assignment.title}
                    </p>
                    <p className="text-sm text-muted-foreground">
                      {assignment.childName} - {assignment.courseName}
                    </p>
                  </div>
                  <div className="ml-4 text-right shrink-0">
                    <p className="text-sm text-red-600 dark:text-red-400">
                      Due{' '}
                      {new Date(assignment.dueDate).toLocaleDateString(
                        undefined,
                        { month: 'short', day: 'numeric' }
                      )}
                    </p>
                    <span className="inline-flex items-center rounded-full bg-red-100 px-2.5 py-0.5 text-xs font-semibold text-red-700 dark:bg-red-900/30 dark:text-red-400">
                      Missing
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Upcoming Assignments */}
        <DashboardCard
          title="Upcoming Assignments"
          icon={<BookOpen className="h-5 w-5 text-blue-500" />}
          className="lg:col-span-2"
        >
          {upcomingAssignments.length === 0 ? (
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Child
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  <tr>
                    <td
                      colSpan={5}
                      className="px-4 py-8 text-center text-muted-foreground"
                    >
                      <div className="flex flex-col items-center gap-2">
                        <BookOpen className="h-10 w-10 text-muted-foreground/30" />
                        <span>No upcoming assignments to display.</span>
                      </div>
                    </td>
                  </tr>
                </tbody>
              </table>
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
                    <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                      Child
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Due Date
                    </th>
                    <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                      Status
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {upcomingAssignments.map((assignment) => {
                    const dueDate = new Date(assignment.dueDate)
                    const now = new Date()
                    const daysLeft = Math.ceil(
                      (dueDate.getTime() - now.getTime()) /
                        (1000 * 60 * 60 * 24)
                    )

                    return (
                      <tr
                        key={assignment.id}
                        className="border-b border-border last:border-0 hover:bg-muted/20 transition-colors"
                      >
                        <td className="px-4 py-3 font-medium text-foreground">
                          {assignment.title}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {assignment.courseName}
                        </td>
                        <td className="px-4 py-3 text-muted-foreground">
                          {assignment.childName}
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span
                            className={`${
                              daysLeft <= 1
                                ? 'text-red-500'
                                : daysLeft <= 3
                                  ? 'text-amber-500'
                                  : 'text-muted-foreground'
                            }`}
                          >
                            {dueDate.toLocaleDateString(undefined, {
                              month: 'short',
                              day: 'numeric',
                            })}
                          </span>
                        </td>
                        <td className="px-4 py-3 text-right">
                          <span className="inline-flex items-center rounded-full bg-blue-100 px-2.5 py-0.5 text-xs font-semibold text-blue-700 dark:bg-blue-900/30 dark:text-blue-400">
                            Upcoming
                          </span>
                        </td>
                      </tr>
                    )
                  })}
                </tbody>
              </table>
            </div>
          )}
        </DashboardCard>
      </div>

      {/* Quick Action Links */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <Link
          href="/parent/children"
          className="group ocean-card rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-primary/10">
            <Users className="h-6 w-6 text-primary" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-primary transition-colors">
              My Children
            </h3>
            <p className="text-sm text-muted-foreground">
              View detailed profiles
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-primary transition-all group-hover:translate-x-1" />
        </Link>

        <Link
          href="/parent/progress"
          className="group ocean-card rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-green-500/10">
            <TrendingUp className="h-6 w-6 text-green-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-green-500 transition-colors">
              Progress Overview
            </h3>
            <p className="text-sm text-muted-foreground">
              Trends and analytics
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-green-500 transition-all group-hover:translate-x-1" />
        </Link>

        <Link
          href="/parent/children"
          className="group ocean-card rounded-2xl p-5 flex items-center gap-4 transition-all hover:scale-[1.02]"
        >
          <div className="flex h-12 w-12 items-center justify-center rounded-xl bg-amber-500/10">
            <Award className="h-6 w-6 text-amber-500" />
          </div>
          <div className="flex-1">
            <h3 className="font-semibold text-foreground group-hover:text-amber-500 transition-colors">
              Achievements
            </h3>
            <p className="text-sm text-muted-foreground">
              Badges and milestones
            </p>
          </div>
          <ChevronRight className="h-5 w-5 text-muted-foreground group-hover:text-amber-500 transition-all group-hover:translate-x-1" />
        </Link>
      </div>
    </div>
  )
}
