import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import { getDashboardStats, getAttendanceReport } from '@/app/actions/school-admin'
import Link from 'next/link'
import {
  GraduationCap,
  Users,
  BookOpen,
  BarChart3,
  Activity,
  Clock,
  Building2,
  Globe,
  Calendar,
} from 'lucide-react'
import { AnnouncementBanner } from '@/components/announcements/AnnouncementBanner'

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
        <h3 className="text-lg font-semibold text-foreground text-outlined">{title}</h3>
      </div>
      {children}
    </div>
  )
}

function StatusBadge({
  status,
  label,
}: {
  status: 'healthy' | 'warning' | 'error' | 'neutral'
  label: string
}) {
  const colors = {
    healthy:
      'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
    warning:
      'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
    error: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
    neutral: 'bg-muted text-muted-foreground',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}
    >
      {label}
    </span>
  )
}

export default async function AdminDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  const userRole = headersList.get('x-user-role')
  const isSuperAdmin = userRole === 'super_admin'

  // Fetch dashboard data with error handling
  let stats: {
    totalUsers: number
    roleCounts: Record<string, number>
    totalCourses: number
    totalStudents: number
    weeklyLogins: number
  } | null = null

  let attendance: {
    total: number
    present: number
    absent: number
    tardy: number
    attendanceRate: number
  } | null = null

  let auditLogs: any[] = []

  try {
    ;[stats, attendance] = await Promise.all([
      getDashboardStats(),
      getAttendanceReport(),
    ])
  } catch {
    // Role check may fail - proceed with null data
  }

  // Fetch recent audit logs directly
  if (tenantId) {
    try {
      const { data: rawLogs } = await supabase
        .from('audit_logs')
        .select('id, action, details, created_at, user_id')
        .eq('tenant_id', tenantId)
        .order('created_at', { ascending: false })
        .limit(10)

      // Fetch profiles separately (PostgREST cannot follow audit_logs.user_id -> profiles)
      const logUserIds = [...new Set((rawLogs ?? []).map((l: any) => l.user_id).filter(Boolean))]
      const logProfilesMap: Record<string, any> = {}
      if (logUserIds.length > 0) {
        const { data: logProfiles } = await supabase
          .from('profiles')
          .select('id, full_name')
          .in('id', logUserIds)
        for (const p of logProfiles ?? []) {
          logProfilesMap[p.id] = p
        }
      }

      auditLogs = (rawLogs ?? []).map((l: any) => ({
        ...l,
        profiles: logProfilesMap[l.user_id] ?? null,
      }))
    } catch {
      // Audit logs may not be available
    }
  }

  // Fetch seat usage for current tenant
  let seatUsage = { currentUsers: 0, maxUsers: 50 }
  if (tenantId) {
    try {
      const [tenantResult, countResult] = await Promise.all([
        supabase
          .from('tenants')
          .select('max_users')
          .eq('id', tenantId)
          .single(),
        supabase
          .from('tenant_memberships')
          .select('id', { count: 'exact', head: true })
          .eq('tenant_id', tenantId),
      ])
      seatUsage = {
        currentUsers: countResult.count ?? 0,
        maxUsers: tenantResult.data?.max_users ?? 50,
      }
    } catch {
      // Seat usage may fail silently
    }
  }

  // Fetch all schools for super_admin overview
  let allSchools: any[] = []
  let schoolMemberCounts: Record<string, number> = {}
  if (isSuperAdmin) {
    try {
      const { data: tenants } = await supabase
        .from('tenants')
        .select('id, name, slug, subscription_plan, max_users, status, created_at')
        .order('created_at', { ascending: false })

      allSchools = tenants ?? []

      if (allSchools.length > 0) {
        const tenantIds = allSchools.map((t: any) => t.id)
        const { data: memberships } = await supabase
          .from('tenant_memberships')
          .select('tenant_id')
          .in('tenant_id', tenantIds)

        if (memberships) {
          for (const m of memberships) {
            const tid = (m as any).tenant_id
            schoolMemberCounts[tid] = (schoolMemberCounts[tid] || 0) + 1
          }
        }
      }
    } catch {
      // Schools data may fail silently
    }
  }

  const studentCount = stats?.roleCounts?.student ?? 0
  const teacherCount = stats?.roleCounts?.teacher ?? 0
  const adminCount =
    (stats?.roleCounts?.admin ?? 0) +
    (stats?.roleCounts?.super_admin ?? 0) +
    (stats?.roleCounts?.school_admin ?? 0)
  const parentCount = stats?.roleCounts?.parent ?? 0
  const activeCourses = stats?.totalCourses ?? 0
  const attendanceRate = attendance?.attendanceRate ?? 0

  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground text-outlined">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          School overview, enrollment data, and system health at a glance.
        </p>
      </div>

      {/* Pinned Announcements */}
      <AnnouncementBanner />

      {/* Seat Usage Banner */}
      <div className="ocean-card rounded-2xl p-5">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="rounded-xl bg-indigo-500/10 p-3">
              <Users className="h-6 w-6 text-indigo-500" />
            </div>
            <div>
              <p className="text-sm font-medium text-foreground">Seat Usage</p>
              <p className="text-sm text-muted-foreground">
                {seatUsage.currentUsers} of {seatUsage.maxUsers} seats used
              </p>
            </div>
          </div>
          <div className="text-right">
            <p className={`text-2xl font-bold ${seatUsage.currentUsers >= seatUsage.maxUsers ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
              {seatUsage.currentUsers}/{seatUsage.maxUsers}
            </p>
            {seatUsage.currentUsers >= seatUsage.maxUsers && (
              <span className="inline-flex items-center rounded-full bg-red-100 dark:bg-red-950/50 px-2.5 py-0.5 text-xs font-medium text-red-700 dark:text-red-400">
                Limit Reached
              </span>
            )}
          </div>
        </div>
        <div className="mt-3 h-2 overflow-hidden rounded-full bg-muted">
          <div
            className={`h-full rounded-full transition-all ${
              seatUsage.currentUsers >= seatUsage.maxUsers
                ? 'bg-red-500'
                : seatUsage.currentUsers >= seatUsage.maxUsers * 0.8
                  ? 'bg-amber-500'
                  : 'bg-primary'
            }`}
            style={{
              width: `${Math.min(100, Math.round((seatUsage.currentUsers / seatUsage.maxUsers) * 100))}%`,
            }}
          />
        </div>
        <div className="mt-2 flex justify-between text-sm text-muted-foreground">
          <span>{Math.max(0, seatUsage.maxUsers - seatUsage.currentUsers)} seats remaining</span>
          <span>{Math.round((seatUsage.currentUsers / seatUsage.maxUsers) * 100)}% utilized</span>
        </div>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold text-foreground">
                {studentCount}
              </p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <GraduationCap className="h-6 w-6 text-primary" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {stats?.totalUsers ?? 0} total users
          </p>
        </div>
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Teachers</p>
              <p className="text-3xl font-bold text-foreground">
                {teacherCount}
              </p>
            </div>
            <div className="rounded-xl bg-purple-500/10 p-3">
              <Users className="h-6 w-6 text-purple-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {activeCourses} active courses
          </p>
        </div>
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Courses</p>
              <p className="text-3xl font-bold text-foreground">
                {activeCourses}
              </p>
            </div>
            <div className="rounded-xl bg-teal-500/10 p-3">
              <BookOpen className="h-6 w-6 text-teal-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            {stats?.weeklyLogins ?? 0} logins this week
          </p>
        </div>
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
              <p className="text-3xl font-bold text-foreground">
                {attendance ? `${attendanceRate}%` : '--%'}
              </p>
            </div>
            <div className="rounded-xl bg-amber-500/10 p-3">
              <BarChart3 className="h-6 w-6 text-amber-500" />
            </div>
          </div>
          <p className="mt-2 text-sm text-muted-foreground">
            School-wide average (7 days)
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* School Health */}
        <DashboardCard
          title="School Health"
          icon={<Building2 className="h-6 w-6 text-primary" />}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <span className="text-sm font-medium text-foreground">
                Overall Status
              </span>
              <StatusBadge
                status={stats ? 'healthy' : 'neutral'}
                label={stats ? 'Active' : 'No Data'}
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <span className="text-sm font-medium text-foreground">
                Student Engagement
              </span>
              <StatusBadge
                status={
                  attendance && attendanceRate >= 80
                    ? 'healthy'
                    : attendance && attendanceRate >= 60
                      ? 'warning'
                      : attendance
                        ? 'error'
                        : 'neutral'
                }
                label={
                  attendance ? `${attendanceRate}% attendance` : 'No Data'
                }
              />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <span className="text-sm font-medium text-foreground">
                Assignment Completion
              </span>
              <StatusBadge status="neutral" label="No Data" />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <span className="text-sm font-medium text-foreground">
                Teacher Activity
              </span>
              <StatusBadge
                status={teacherCount > 0 ? 'healthy' : 'neutral'}
                label={
                  teacherCount > 0
                    ? `${teacherCount} active`
                    : 'No Data'
                }
              />
            </div>
          </div>
        </DashboardCard>

        {/* Enrollment Stats */}
        <DashboardCard
          title="Enrollment Stats"
          icon={<BarChart3 className="h-6 w-6 text-primary" />}
        >
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {studentCount}
                </p>
                <p className="text-sm text-muted-foreground">Students</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {teacherCount}
                </p>
                <p className="text-sm text-muted-foreground">Teachers</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {parentCount}
                </p>
                <p className="text-sm text-muted-foreground">Parents</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">
                  {adminCount}
                </p>
                <p className="text-sm text-muted-foreground">Admins</p>
              </div>
            </div>
            {stats && stats.totalUsers > 0 ? (
              <div className="rounded-xl border border-border p-4">
                <p className="mb-3 text-sm font-medium text-foreground">
                  Role Distribution
                </p>
                <div className="space-y-2">
                  {Object.entries(stats.roleCounts).map(([role, count]) => (
                    <div key={role} className="flex items-center gap-3">
                      <span className="w-20 text-sm capitalize text-muted-foreground">
                        {role.replace('_', ' ')}
                      </span>
                      <div className="h-2 flex-1 overflow-hidden rounded-full bg-muted">
                        <div
                          className="h-full rounded-full bg-primary transition-all"
                          style={{
                            width: `${Math.round((count / stats.totalUsers) * 100)}%`,
                          }}
                        />
                      </div>
                      <span className="w-8 text-right text-xs font-medium text-foreground">
                        {count}
                      </span>
                    </div>
                  ))}
                </div>
              </div>
            ) : (
              <div className="rounded-xl border border-border p-4">
                <p className="mb-2 text-sm font-medium text-foreground">
                  Role Distribution
                </p>
                <div className="flex flex-col items-center justify-center py-4">
                  <p className="text-sm text-muted-foreground">
                    No enrollment data available yet.
                  </p>
                </div>
              </div>
            )}
          </div>
        </DashboardCard>

        {/* System Status */}
        <DashboardCard
          title="System Status"
          icon={<Activity className="h-6 w-6 text-primary" />}
        >
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-foreground">
                  Authentication
                </span>
              </div>
              <StatusBadge status="healthy" label="Operational" />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-foreground">
                  Database
                </span>
              </div>
              <StatusBadge status="healthy" label="Operational" />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-foreground">
                  File Storage
                </span>
              </div>
              <StatusBadge status="healthy" label="Operational" />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div className="flex items-center gap-3">
                <div className="h-2.5 w-2.5 rounded-full bg-green-500" />
                <span className="text-sm font-medium text-foreground">
                  Realtime
                </span>
              </div>
              <StatusBadge status="healthy" label="Operational" />
            </div>
          </div>
        </DashboardCard>

        {/* Key Alerts */}
        <DashboardCard
          title="Key Alerts"
          icon={<Clock className="h-6 w-6 text-amber-500" />}
        >
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <Clock className="mb-3 h-12 w-12 text-muted-foreground/30" />
            <p className="text-muted-foreground">No active alerts.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              System alerts and important notifications will appear here.
            </p>
          </div>
        </DashboardCard>
      </div>

      {/* Schools Overview (Super Admin only) */}
      {isSuperAdmin && (
        <DashboardCard
          title="Schools Overview"
          icon={<Building2 className="h-6 w-6 text-primary" />}
          className="w-full"
        >
          <div className="mb-4 flex items-center justify-between">
            <p className="text-sm text-muted-foreground">
              {allSchools.length} registered school{allSchools.length !== 1 ? 's' : ''} across the platform.
            </p>
            <Link
              href="/admin/tenants"
              className="text-sm text-primary hover:underline"
            >
              Manage tenants
            </Link>
          </div>
          <div className="overflow-hidden rounded-xl border border-border">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      School
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Slug
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Plan
                    </th>
                    <th className="px-4 py-3 text-center font-semibold text-muted-foreground">
                      Users / Max
                    </th>
                    <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                      Status
                    </th>
                    <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                      Created
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {allSchools.length === 0 ? (
                    <tr>
                      <td
                        colSpan={6}
                        className="px-4 py-8 text-center text-muted-foreground"
                      >
                        No schools registered yet.
                      </td>
                    </tr>
                  ) : (
                    allSchools.map((school: any) => {
                      const members = schoolMemberCounts[school.id] ?? 0
                      const max = school.max_users ?? 50
                      const plan = school.subscription_plan ?? 'starter'
                      const status = school.status ?? 'active'
                      const seatPct = max > 0 ? Math.round((members / max) * 100) : 0

                      const planStyles: Record<string, string> = {
                        free: 'bg-muted text-muted-foreground',
                        starter: 'bg-blue-100 text-blue-700 dark:bg-blue-950/50 dark:text-blue-400',
                        growth: 'bg-purple-100 text-purple-700 dark:bg-purple-950/50 dark:text-purple-400',
                        enterprise: 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400',
                      }

                      const statusStyles: Record<string, string> = {
                        active: 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400',
                        suspended: 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400',
                        cancelled: 'bg-muted text-muted-foreground',
                      }

                      return (
                        <tr
                          key={school.id}
                          className="transition-colors hover:bg-muted/30"
                        >
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-2">
                              <div className="flex h-8 w-8 items-center justify-center rounded-lg bg-primary/10">
                                <Building2 className="h-4 w-4 text-primary" />
                              </div>
                              <span className="font-medium text-foreground">
                                {school.name ?? 'Unnamed School'}
                              </span>
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <div className="flex items-center gap-1 text-sm text-muted-foreground">
                              <Globe className="h-3 w-3" />
                              {school.slug ?? '--'}
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${planStyles[plan] ?? 'bg-muted text-muted-foreground'}`}
                            >
                              {plan}
                            </span>
                          </td>
                          <td className="px-4 py-3 text-center">
                            <span className={`text-sm font-semibold ${members >= max ? 'text-red-600 dark:text-red-400' : 'text-foreground'}`}>
                              {members}/{max}
                            </span>
                            <div className="mx-auto mt-1 h-1.5 w-20 overflow-hidden rounded-full bg-muted">
                              <div
                                className={`h-full rounded-full ${
                                  members >= max
                                    ? 'bg-red-500'
                                    : seatPct >= 80
                                      ? 'bg-amber-500'
                                      : 'bg-primary'
                                }`}
                                style={{ width: `${Math.min(100, seatPct)}%` }}
                              />
                            </div>
                          </td>
                          <td className="px-4 py-3">
                            <span
                              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium capitalize ${statusStyles[status] ?? 'bg-muted text-muted-foreground'}`}
                            >
                              {status}
                            </span>
                          </td>
                          <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-muted-foreground">
                            {school.created_at
                              ? new Date(school.created_at).toLocaleDateString(
                                  'en-US',
                                  {
                                    month: 'short',
                                    day: 'numeric',
                                    year: 'numeric',
                                  }
                                )
                              : '--'}
                          </td>
                        </tr>
                      )
                    })
                  )}
                </tbody>
              </table>
            </div>
          </div>
        </DashboardCard>
      )}

      {/* Recent Activity */}
      <DashboardCard
        title="Recent Activity"
        icon={<Activity className="h-6 w-6 text-primary" />}
        className="w-full"
      >
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Event
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left font-semibold text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-right font-semibold text-muted-foreground">
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {auditLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={4}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No recent activity to display.
                  </td>
                </tr>
              ) : (
                auditLogs.map((log: any) => {
                  const actionLabel = (log.action ?? '')
                    .replace(/\./g, ' ')
                    .replace(/_/g, ' ')
                  const userName =
                    (log.profiles as any)?.full_name ?? 'Unknown User'
                  const actionType = (log.action ?? '').split('.')[0] ?? 'system'
                  const timeAgo = formatTimeAgo(log.created_at)

                  return (
                    <tr
                      key={log.id}
                      className="transition-colors hover:bg-muted/30"
                    >
                      <td className="px-4 py-3">
                        <span className="font-medium capitalize text-foreground">
                          {actionLabel}
                        </span>
                      </td>
                      <td className="px-4 py-3 text-muted-foreground">
                        {userName}
                      </td>
                      <td className="px-4 py-3">
                        <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium capitalize text-muted-foreground">
                          {actionType}
                        </span>
                      </td>
                      <td className="whitespace-nowrap px-4 py-3 text-right text-sm text-muted-foreground">
                        {timeAgo}
                      </td>
                    </tr>
                  )
                })
              )}
            </tbody>
          </table>
        </div>
        {auditLogs.length > 0 && (
          <div className="mt-3 text-right">
            <Link
              href="/admin/audit-logs"
              className="text-sm text-primary hover:underline"
            >
              View all audit logs →
            </Link>
          </div>
        )}
      </DashboardCard>
    </div>
  )
}

function formatTimeAgo(dateString: string): string {
  const date = new Date(dateString)
  const now = new Date()
  const diffMs = now.getTime() - date.getTime()
  const diffMins = Math.floor(diffMs / 60000)
  const diffHours = Math.floor(diffMs / 3600000)
  const diffDays = Math.floor(diffMs / 86400000)

  if (diffMins < 1) return 'Just now'
  if (diffMins < 60) return `${diffMins}m ago`
  if (diffHours < 24) return `${diffHours}h ago`
  if (diffDays < 7) return `${diffDays}d ago`

  return date.toLocaleDateString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
  })
}
