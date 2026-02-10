import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getAttendanceReport } from '@/app/actions/school-admin'
import Link from 'next/link'
import {
  ArrowLeft,
  ClipboardCheck,
  UserCheck,
  UserX,
  Clock,
  BarChart3,
} from 'lucide-react'

const STATUS_STYLES: Record<string, string> = {
  present:
    'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  online:
    'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
  absent: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
  tardy:
    'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
  excused:
    'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
}

export default async function AdminAttendancePage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  // Fetch attendance report via server action
  let report: {
    total: number
    present: number
    absent: number
    tardy: number
    attendanceRate: number
  } | null = null

  try {
    report = await getAttendanceReport()
  } catch {
    // Role check may fail
  }

  // Fetch recent attendance records directly
  let recentRecords: any[] = []

  if (tenantId) {
    const sevenDaysAgo = new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
      .toISOString()
      .split('T')[0]

    try {
      const { data } = await supabase
        .from('attendance_records')
        .select(
          'id, date, status, notes, student_id, course_id, profiles:student_id(full_name), courses:course_id(name)'
        )
        .eq('tenant_id', tenantId)
        .gte('date', sevenDaysAgo)
        .order('date', { ascending: false })
        .limit(50)

      recentRecords = data ?? []
    } catch {
      // Table may not exist or be empty
    }
  }

  return (
    <div className="space-y-8">
      {/* Back Button */}
      <Link
        href="/admin/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Attendance Overview
        </h1>
        <p className="mt-1 text-muted-foreground">
          School-wide attendance data and recent records for the last 7 days.
        </p>
      </div>

      {/* Overview Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-5">
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-primary/10">
              <ClipboardCheck className="h-5 w-5 text-primary" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {report?.total ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Total Records</p>
            </div>
          </div>
        </div>
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-green-500/10">
              <UserCheck className="h-5 w-5 text-green-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {report?.present ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Present</p>
            </div>
          </div>
        </div>
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-red-500/10">
              <UserX className="h-5 w-5 text-red-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {report?.absent ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Absent</p>
            </div>
          </div>
        </div>
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-amber-500/10">
              <Clock className="h-5 w-5 text-amber-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {report?.tardy ?? 0}
              </p>
              <p className="text-sm text-muted-foreground">Tardy</p>
            </div>
          </div>
        </div>
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center gap-3">
            <div className="flex h-10 w-10 items-center justify-center rounded-xl bg-teal-500/10">
              <BarChart3 className="h-5 w-5 text-teal-500" />
            </div>
            <div>
              <p className="text-2xl font-bold text-foreground">
                {report ? `${report.attendanceRate}%` : '--%'}
              </p>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
            </div>
          </div>
        </div>
      </div>

      {/* Attendance Rate Visual */}
      {report && report.total > 0 && (
        <div className="ocean-card rounded-2xl p-6">
          <h2 className="mb-4 text-lg font-semibold text-foreground">
            Attendance Breakdown
          </h2>
          <div className="mb-3 h-4 w-full overflow-hidden rounded-full bg-muted">
            <div className="flex h-full">
              {report.present > 0 && (
                <div
                  className="h-full bg-green-500 transition-all"
                  style={{
                    width: `${Math.round((report.present / report.total) * 100)}%`,
                  }}
                  title={`Present: ${report.present}`}
                />
              )}
              {report.tardy > 0 && (
                <div
                  className="h-full bg-amber-500 transition-all"
                  style={{
                    width: `${Math.round((report.tardy / report.total) * 100)}%`,
                  }}
                  title={`Tardy: ${report.tardy}`}
                />
              )}
              {report.absent > 0 && (
                <div
                  className="h-full bg-red-500 transition-all"
                  style={{
                    width: `${Math.round((report.absent / report.total) * 100)}%`,
                  }}
                  title={`Absent: ${report.absent}`}
                />
              )}
            </div>
          </div>
          <div className="flex flex-wrap gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-green-500" />
              <span className="text-muted-foreground">
                Present ({report.present})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-amber-500" />
              <span className="text-muted-foreground">
                Tardy ({report.tardy})
              </span>
            </div>
            <div className="flex items-center gap-2">
              <div className="h-3 w-3 rounded-full bg-red-500" />
              <span className="text-muted-foreground">
                Absent ({report.absent})
              </span>
            </div>
          </div>
        </div>
      )}

      {/* Recent Attendance Records Table */}
      <div className="ocean-card overflow-hidden rounded-2xl">
        <div className="border-b border-border px-6 py-4">
          <h2 className="text-lg font-semibold text-foreground">
            Recent Attendance Records
          </h2>
          <p className="text-sm text-muted-foreground">
            Last 7 days of attendance data across all courses.
          </p>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Date
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Student
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Course
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Status
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Notes
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {recentRecords.length === 0 ? (
                <tr>
                  <td
                    colSpan={5}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No attendance records found for the last 7 days.
                  </td>
                </tr>
              ) : (
                recentRecords.map((record: any) => {
                  const studentName =
                    (record.profiles as any)?.full_name ?? 'Unknown Student'
                  const courseName =
                    (record.courses as any)?.name ?? 'Unknown Course'
                  const status = record.status ?? 'unknown'
                  const statusStyle =
                    STATUS_STYLES[status] ?? 'bg-muted text-muted-foreground'

                  return (
                    <tr
                      key={record.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="whitespace-nowrap px-4 py-3 text-foreground">
                        {record.date
                          ? new Date(record.date + 'T00:00:00').toLocaleDateString(
                              'en-US',
                              {
                                weekday: 'short',
                                month: 'short',
                                day: 'numeric',
                              }
                            )
                          : '--'}
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {studentName}
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {courseName}
                      </td>
                      <td className="px-4 py-3">
                        <span
                          className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyle}`}
                        >
                          {status}
                        </span>
                      </td>
                      <td className="max-w-[200px] truncate px-4 py-3 text-sm text-muted-foreground">
                        {record.notes || '--'}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}
