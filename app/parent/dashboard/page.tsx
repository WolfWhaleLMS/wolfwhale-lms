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
import { AnnouncementBanner } from '@/components/announcements/AnnouncementBanner'
import { CircularGauge } from '@/components/ui/circular-gauge'

export default async function ParentDashboardPage() {
  let children: Awaited<ReturnType<typeof getChildren>> = []
  let error: string | null = null

  try {
    children = await getChildren()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load data'
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
    <div className="space-y-4 sm:space-y-8 pb-8 sm:pb-12 overflow-x-hidden max-w-full">
      {/* Pinned Announcements */}
      <AnnouncementBanner />

      {/* Header */}
      <div>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground text-outlined">
          Parent Dashboard
        </h1>
        <p className="mt-1 text-sm sm:text-base text-muted-foreground">
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
          <h3 className="mt-4 text-2xl font-semibold text-foreground text-outlined">
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
          {/* Summary Stats with Gauges */}
          <div className="ocean-card rounded-2xl p-3 sm:p-6">
            <div className="grid grid-cols-2 gap-3 sm:gap-6 sm:grid-cols-4">
              <div className="flex flex-col items-center">
                <div className="flex h-[80px] w-[80px] sm:h-[140px] sm:w-[140px] flex-col items-center justify-center rounded-full bg-primary/5 dark:bg-primary/10">
                  <Users className="mb-0.5 sm:mb-1 h-5 w-5 sm:h-8 sm:w-8 text-primary" />
                  <p className="text-xl sm:text-3xl font-extrabold text-foreground">
                    {children.length}
                  </p>
                </div>
                <p className="mt-1 sm:mt-2 text-sm sm:text-lg font-semibold text-foreground">
                  {children.length === 1 ? 'Child' : 'Children'}
                </p>
              </div>
              <CircularGauge
                value={avgGPA ?? 0}
                label="Avg Grade"
                sublabel={avgGPA ? (avgGPA >= 90 ? 'Excellent' : avgGPA >= 80 ? 'Good' : avgGPA >= 70 ? 'Fair' : 'Needs Work') : undefined}
              />
              <CircularGauge
                value={avgAttendance ?? 0}
                label="Avg Attendance"
                sublabel={avgAttendance ? (avgAttendance >= 95 ? 'Excellent' : avgAttendance >= 85 ? 'Good' : 'Needs Attention') : undefined}
                colorThresholds={[
                  { value: 95, color: '#22c55e', bgColor: '#22c55e20' },
                  { value: 85, color: '#f59e0b', bgColor: '#f59e0b20' },
                  { value: 0, color: '#ef4444', bgColor: '#ef444420' },
                ]}
              />
              <div className="flex flex-col items-center">
                <div className={`flex h-[80px] w-[80px] sm:h-[140px] sm:w-[140px] flex-col items-center justify-center rounded-full ${totalMissing > 0 ? 'bg-red-50 dark:bg-red-950/20' : 'bg-muted/30'}`}>
                  <AlertCircle className={`mb-0.5 sm:mb-1 h-5 w-5 sm:h-8 sm:w-8 ${totalMissing > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
                  <p className={`text-xl sm:text-3xl font-extrabold ${totalMissing > 0 ? 'text-red-500' : 'text-foreground'}`}>
                    {totalMissing}
                  </p>
                </div>
                <p className="mt-1 sm:mt-2 text-sm sm:text-lg font-semibold text-foreground">Missing</p>
                <p className="text-xs sm:text-lg text-muted-foreground">Assignments</p>
              </div>
            </div>
          </div>

          {/* Children Cards */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground text-outlined">
              Your Children
            </h2>
            <div className="grid gap-4 sm:gap-6 md:grid-cols-2">
              {children.map((child) => (
                <Link
                  key={child.studentId}
                  href={`/parent/children/${child.studentId}`}
                  className="group"
                >
                  <div className="ocean-card rounded-2xl overflow-hidden transition-all group-hover:scale-[1.01] group-hover:shadow-lg">
                    {/* Child Header */}
                    <div className="child-card-header p-3 sm:p-5">
                      <div className="flex items-center gap-3 sm:gap-4">
                        <div className="flex h-10 w-10 sm:h-14 sm:w-14 shrink-0 items-center justify-center rounded-full bg-primary/15 dark:bg-white/20 text-xl sm:text-3xl font-bold text-primary dark:text-white shadow-lg">
                          {child.avatarUrl ? (
                            <img
                              src={child.avatarUrl}
                              alt={child.fullName}
                              className="h-10 w-10 sm:h-14 sm:w-14 rounded-full object-cover"
                            />
                          ) : (
                            child.fullName.charAt(0).toUpperCase()
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h3 className="text-xl sm:text-3xl font-bold text-foreground dark:text-white truncate group-hover:underline">
                            {child.fullName}
                          </h3>
                          <p className="text-muted-foreground dark:text-white/70">
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
                        <ChevronRight className="h-6 w-6 text-muted-foreground/50 dark:text-white/50 group-hover:text-primary dark:group-hover:text-white group-hover:translate-x-1 transition-all shrink-0" />
                      </div>
                    </div>

                    {/* Quick Stats with Mini Gauges */}
                    <div className="p-3 sm:p-5">
                      <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-4">
                        <CircularGauge
                          value={child.gpa}
                          size={90}
                          strokeWidth={8}
                          label="Grade"
                        />
                        <CircularGauge
                          value={child.attendanceRate}
                          size={90}
                          strokeWidth={8}
                          label="Attendance"
                          colorThresholds={[
                            { value: 95, color: '#22c55e', bgColor: '#22c55e20' },
                            { value: 85, color: '#f59e0b', bgColor: '#f59e0b20' },
                            { value: 0, color: '#ef4444', bgColor: '#ef444420' },
                          ]}
                        />
                        <div className="flex flex-col items-center gap-1 sm:gap-2" role="status" aria-label={`Courses: ${child.courseCount}`}>
                          <div className="flex h-[60px] w-[60px] sm:h-[90px] sm:w-[90px] items-center justify-center rounded-full bg-blue-50 dark:bg-blue-950/20">
                            <div className="text-center">
                              <BookOpen className="mx-auto mb-0.5 h-3 w-3 sm:h-4 sm:w-4 text-blue-500" />
                              <p className="text-lg sm:text-2xl font-extrabold text-foreground">{child.courseCount}</p>
                            </div>
                          </div>
                          <p className="text-xs sm:text-lg font-semibold text-foreground">Courses</p>
                        </div>
                        <div className="flex flex-col items-center gap-1 sm:gap-2" role="status" aria-label={`Missing assignments: ${child.missingAssignments}`}>
                          <div className={`flex h-[60px] w-[60px] sm:h-[90px] sm:w-[90px] items-center justify-center rounded-full ${child.missingAssignments > 0 ? 'bg-red-50 dark:bg-red-950/20' : 'bg-muted/30'}`}>
                            <div className="text-center">
                              <AlertCircle className={`mx-auto mb-0.5 h-3 w-3 sm:h-4 sm:w-4 ${child.missingAssignments > 0 ? 'text-red-500' : 'text-muted-foreground'}`} />
                              <p className={`text-lg sm:text-2xl font-extrabold ${child.missingAssignments > 0 ? 'text-red-500' : 'text-foreground'}`}>{child.missingAssignments}</p>
                            </div>
                          </div>
                          <p className="text-xs sm:text-lg font-semibold text-foreground">Missing</p>
                        </div>
                      </div>
                    </div>
                  </div>
                </Link>
              ))}
            </div>
          </div>

          {/* Quick Actions */}
          <div className="space-y-3 sm:space-y-4">
            <h2 className="text-xl sm:text-2xl font-semibold text-foreground text-outlined">
              Quick Actions
            </h2>
            <div className="grid grid-cols-1 gap-3 sm:gap-4 sm:grid-cols-3">
              <Link
                href="/parent/children"
                className="ocean-card rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 transition-all hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-blue-100 dark:bg-blue-900/30">
                  <Users className="h-5 w-5 sm:h-6 sm:w-6 text-blue-600 dark:text-blue-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm sm:text-base">View Children</p>
                  <p className="text-sm sm:text-lg text-muted-foreground truncate">
                    Detailed profiles & grades
                  </p>
                </div>
              </Link>
              <Link
                href="/parent/progress"
                className="ocean-card rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 transition-all hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-green-100 dark:bg-green-900/30">
                  <BarChart3 className="h-5 w-5 sm:h-6 sm:w-6 text-green-600 dark:text-green-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm sm:text-base">
                    Progress Overview
                  </p>
                  <p className="text-sm sm:text-lg text-muted-foreground truncate">
                    Trends & analytics
                  </p>
                </div>
              </Link>
              <Link
                href="/messaging"
                className="ocean-card rounded-2xl p-4 sm:p-6 flex items-center gap-3 sm:gap-4 transition-all hover:shadow-md hover:scale-[1.01]"
              >
                <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-xl bg-purple-100 dark:bg-purple-900/30">
                  <MessageSquare className="h-5 w-5 sm:h-6 sm:w-6 text-purple-600 dark:text-purple-400" />
                </div>
                <div className="min-w-0">
                  <p className="font-semibold text-foreground text-sm sm:text-base">
                    Message Teacher
                  </p>
                  <p className="text-sm sm:text-lg text-muted-foreground truncate">
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
