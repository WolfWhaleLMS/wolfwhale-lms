'use client'

function DashboardCard({
  title,
  icon,
  children,
  className = '',
}: {
  title: string
  icon: string
  children: React.ReactNode
  className?: string
}) {
  return (
    <div className={`ocean-card rounded-2xl p-6 ${className}`}>
      <div className="mb-4 flex items-center gap-3">
        <span className="text-2xl">{icon}</span>
        <h3 className="text-lg font-semibold text-foreground">{title}</h3>
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
    neutral:
      'bg-muted text-muted-foreground',
  }

  return (
    <span
      className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${colors[status]}`}
    >
      {label}
    </span>
  )
}

export default function AdminDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Admin Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          School overview, enrollment data, and system health at a glance.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Students</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <span className="text-2xl">🎓</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            +0 this semester
          </p>
        </div>
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Total Teachers</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <span className="text-2xl">👩‍🏫</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            0 active courses
          </p>
        </div>
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Active Courses</p>
              <p className="text-3xl font-bold text-foreground">0</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <span className="text-2xl">📚</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            0 in progress
          </p>
        </div>
        <div className="ocean-card rounded-2xl p-5">
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm text-muted-foreground">Attendance Rate</p>
              <p className="text-3xl font-bold text-foreground">--%</p>
            </div>
            <div className="rounded-xl bg-primary/10 p-3">
              <span className="text-2xl">📊</span>
            </div>
          </div>
          <p className="mt-2 text-xs text-muted-foreground">
            School-wide average
          </p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* School Health */}
        <DashboardCard title="School Health" icon="🏫">
          <div className="space-y-3">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <span className="text-sm font-medium text-foreground">
                Overall Status
              </span>
              <StatusBadge status="neutral" label="No Data" />
            </div>
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <span className="text-sm font-medium text-foreground">
                Student Engagement
              </span>
              <StatusBadge status="neutral" label="No Data" />
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
              <StatusBadge status="neutral" label="No Data" />
            </div>
          </div>
        </DashboardCard>

        {/* Enrollment Stats */}
        <DashboardCard title="Enrollment Stats" icon="📈">
          <div className="space-y-4">
            <div className="grid grid-cols-2 gap-3">
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Students</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Teachers</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Parents</p>
              </div>
              <div className="rounded-xl bg-muted/50 p-4 text-center">
                <p className="text-2xl font-bold text-foreground">0</p>
                <p className="text-xs text-muted-foreground">Admins</p>
              </div>
            </div>
            <div className="rounded-xl border border-border p-4">
              <p className="mb-2 text-sm font-medium text-foreground">
                Enrollment by Grade
              </p>
              <div className="flex flex-col items-center justify-center py-4">
                <p className="text-sm text-muted-foreground">
                  No enrollment data available yet.
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* System Status */}
        <DashboardCard title="System Status" icon="🔧">
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
        <DashboardCard title="Key Alerts" icon="🔔">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 text-5xl opacity-40">🐺</div>
            <p className="text-muted-foreground">
              No active alerts.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              System alerts and important notifications will appear here.
            </p>
          </div>
        </DashboardCard>
      </div>

      {/* Recent Activity */}
      <DashboardCard title="Recent Activity" icon="🕐" className="w-full">
        <div className="overflow-hidden rounded-xl border border-border">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Event
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Type
                </th>
                <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                  Time
                </th>
              </tr>
            </thead>
            <tbody>
              <tr>
                <td
                  colSpan={4}
                  className="px-4 py-8 text-center text-muted-foreground"
                >
                  No recent activity to display.
                </td>
              </tr>
            </tbody>
          </table>
        </div>
      </DashboardCard>
    </div>
  )
}
