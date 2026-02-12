import Link from 'next/link'
import { getDashboardStats, getAttendanceReport, getEnrollmentTrends } from '@/app/actions/school-admin'
import { Users, BookOpen, GraduationCap, LogIn, TrendingUp, Calendar, ArrowLeft } from 'lucide-react'
import { ExportButton } from '@/components/reports/ExportButton'

export default async function AdminReportsPage() {
  let stats, attendance, trends
  try {
    ;[stats, attendance, trends] = await Promise.all([
      getDashboardStats(),
      getAttendanceReport(),
      getEnrollmentTrends(),
    ])
  } catch {
    return (
      <div className="space-y-6">
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
        <div className="ocean-card rounded-2xl p-8 text-center">
          <p className="text-muted-foreground">Unable to load reports. Please try again.</p>
        </div>
      </div>
    )
  }

  const trendDates = Object.keys(trends).sort()
  const maxTrend = Math.max(...Object.values(trends), 1)

  return (
    <div className="space-y-4 sm:space-y-8 overflow-x-hidden max-w-full">
      {/* Back Button */}
      <Link
        href="/admin/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      <div className="flex flex-col gap-3 sm:flex-row sm:items-start sm:justify-between">
        <div className="min-w-0">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Reports & Analytics</h1>
          <p className="mt-1 text-sm sm:text-base text-muted-foreground">
            Overview of school performance and engagement metrics.
          </p>
        </div>
        <ExportButton
          pdfUrl="/api/reports/admin/school/pdf"
          csvUrl="/api/reports/admin/school/csv"
          label="Export School Report"
        />
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4">
        <div className="ocean-card rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-primary/10">
              <Users className="h-4 w-4 sm:h-5 sm:w-5 text-primary" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalUsers}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Total Users</p>
            </div>
          </div>
        </div>
        <div className="ocean-card rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-teal-500/10">
              <GraduationCap className="h-4 w-4 sm:h-5 sm:w-5 text-teal-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalStudents}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Students</p>
            </div>
          </div>
        </div>
        <div className="ocean-card rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-purple-500/10">
              <BookOpen className="h-4 w-4 sm:h-5 sm:w-5 text-purple-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.totalCourses}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Courses</p>
            </div>
          </div>
        </div>
        <div className="ocean-card rounded-2xl p-3 sm:p-5">
          <div className="flex items-center gap-2 sm:gap-3">
            <div className="flex h-8 w-8 sm:h-10 sm:w-10 shrink-0 items-center justify-center rounded-xl bg-amber-500/10">
              <LogIn className="h-4 w-4 sm:h-5 sm:w-5 text-amber-500" />
            </div>
            <div className="min-w-0">
              <p className="text-xl sm:text-2xl font-bold text-foreground">{stats.weeklyLogins}</p>
              <p className="text-xs sm:text-sm text-muted-foreground">Logins (7 days)</p>
            </div>
          </div>
        </div>
      </div>

      {/* Role Breakdown & Attendance */}
      <div className="grid grid-cols-1 gap-4 sm:gap-6 lg:grid-cols-2">
        {/* Role Breakdown */}
        <div className="ocean-card rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">User Distribution</h2>
          <div className="space-y-3">
            {Object.entries(stats.roleCounts).map(([role, count]) => (
              <div key={role} className="flex items-center justify-between">
                <div className="flex items-center gap-2">
                  <span className="inline-flex h-2 w-2 rounded-full bg-primary" />
                  <span className="text-sm capitalize text-foreground">
                    {role.replace('_', ' ')}
                  </span>
                </div>
                <div className="flex items-center gap-3">
                  <div className="h-2 w-24 overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-primary transition-all"
                      style={{
                        width: `${Math.round(((count as number) / stats.totalUsers) * 100)}%`,
                      }}
                    />
                  </div>
                  <span className="text-sm font-medium text-foreground w-8 text-right">
                    {count as number}
                  </span>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Attendance Summary */}
        <div className="ocean-card rounded-2xl p-4 sm:p-6">
          <h2 className="text-lg font-semibold text-foreground mb-4">
            <Calendar className="mr-2 inline h-5 w-5" />
            Attendance (Last 7 Days)
          </h2>
          <div className="mb-4 text-center">
            <p className="text-4xl font-bold text-primary">{attendance.attendanceRate}%</p>
            <p className="text-sm text-muted-foreground">Overall Attendance Rate</p>
          </div>
          <div className="grid grid-cols-3 gap-2 sm:gap-4 text-center">
            <div className="rounded-xl bg-green-50 p-2 sm:p-3 dark:bg-green-950/30">
              <p className="text-lg font-bold text-green-600 dark:text-green-400">
                {attendance.present}
              </p>
              <p className="text-xs text-muted-foreground">Present</p>
            </div>
            <div className="rounded-xl bg-red-50 p-2 sm:p-3 dark:bg-red-950/30">
              <p className="text-lg font-bold text-red-600 dark:text-red-400">
                {attendance.absent}
              </p>
              <p className="text-xs text-muted-foreground">Absent</p>
            </div>
            <div className="rounded-xl bg-amber-50 p-2 sm:p-3 dark:bg-amber-950/30">
              <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                {attendance.tardy}
              </p>
              <p className="text-xs text-muted-foreground">Tardy</p>
            </div>
          </div>
        </div>
      </div>

      {/* Enrollment Trends */}
      <div className="ocean-card rounded-2xl p-4 sm:p-6">
        <h2 className="text-lg font-semibold text-foreground mb-4">
          <TrendingUp className="mr-2 inline h-5 w-5" />
          Enrollment Trend (Last 30 Days)
        </h2>
        {trendDates.length === 0 ? (
          <p className="py-8 text-center text-muted-foreground">
            No new enrollments in the last 30 days.
          </p>
        ) : (
          <div className="flex items-end gap-1" style={{ height: '120px' }}>
            {trendDates.map((date) => (
              <div key={date} className="flex flex-1 flex-col items-center gap-1">
                <div
                  className="w-full rounded-t bg-primary/70 transition-all hover:bg-primary"
                  style={{
                    height: `${Math.max((trends[date] / maxTrend) * 100, 4)}px`,
                  }}
                  title={`${date}: ${trends[date]} enrollments`}
                />
              </div>
            ))}
          </div>
        )}
        {trendDates.length > 0 && (
          <div className="mt-2 flex justify-between text-xs text-muted-foreground">
            <span>{trendDates[0]}</span>
            <span>{trendDates[trendDates.length - 1]}</span>
          </div>
        )}
      </div>
    </div>
  )
}
