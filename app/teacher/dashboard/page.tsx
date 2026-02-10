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

export default function TeacherDashboardPage() {
  return (
    <div className="space-y-8">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Teacher Dashboard
        </h1>
        <p className="mt-1 text-muted-foreground">
          Manage your classes, review submissions, and track student progress.
        </p>
      </div>

      {/* Stats Row */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="mt-1 text-sm text-muted-foreground">Classes Today</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="mt-1 text-sm text-muted-foreground">Pending Grading</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="mt-1 text-sm text-muted-foreground">Total Students</p>
        </div>
        <div className="ocean-card rounded-2xl p-5 text-center">
          <p className="text-3xl font-bold text-primary">0</p>
          <p className="mt-1 text-sm text-muted-foreground">Unread Messages</p>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* Today's Classes */}
        <DashboardCard title="Today's Classes" icon="🏫">
          <div className="space-y-3">
            <div className="flex flex-col items-center justify-center py-8 text-center">
              <div className="mb-3 text-5xl opacity-40">📅</div>
              <p className="text-muted-foreground">
                No classes scheduled for today.
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                Your upcoming classes will appear here.
              </p>
            </div>
          </div>
        </DashboardCard>

        {/* Pending Grading */}
        <DashboardCard title="Pending Grading" icon="✏️">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 text-5xl opacity-40">🐋</div>
            <p className="text-muted-foreground">
              All caught up! No submissions to grade.
            </p>
            <p className="mt-1 text-sm text-muted-foreground">
              New submissions will appear here for review.
            </p>
          </div>
        </DashboardCard>

        {/* Recent Submissions */}
        <DashboardCard title="Recent Submissions" icon="📥">
          <div className="overflow-hidden rounded-xl border border-border">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b border-border bg-muted/50">
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Student
                  </th>
                  <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                    Assignment
                  </th>
                  <th className="px-4 py-3 text-right font-medium text-muted-foreground">
                    Submitted
                  </th>
                </tr>
              </thead>
              <tbody>
                <tr>
                  <td
                    colSpan={3}
                    className="px-4 py-8 text-center text-muted-foreground"
                  >
                    No recent submissions.
                  </td>
                </tr>
              </tbody>
            </table>
          </div>
        </DashboardCard>

        {/* Attendance Overview */}
        <DashboardCard title="Attendance Overview" icon="📋">
          <div className="space-y-4">
            <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4">
              <div>
                <p className="font-medium text-foreground">Today's Attendance</p>
                <p className="text-sm text-muted-foreground">
                  No attendance records yet
                </p>
              </div>
              <div className="text-right">
                <p className="text-2xl font-bold text-primary">--</p>
                <p className="text-xs text-muted-foreground">Present</p>
              </div>
            </div>
            <div className="grid grid-cols-3 gap-3 text-center">
              <div className="rounded-lg bg-green-50 p-3 dark:bg-green-950/30">
                <p className="text-lg font-bold text-green-600 dark:text-green-400">
                  0
                </p>
                <p className="text-xs text-green-600/70 dark:text-green-400/70">
                  Present
                </p>
              </div>
              <div className="rounded-lg bg-amber-50 p-3 dark:bg-amber-950/30">
                <p className="text-lg font-bold text-amber-600 dark:text-amber-400">
                  0
                </p>
                <p className="text-xs text-amber-600/70 dark:text-amber-400/70">
                  Late
                </p>
              </div>
              <div className="rounded-lg bg-red-50 p-3 dark:bg-red-950/30">
                <p className="text-lg font-bold text-red-600 dark:text-red-400">
                  0
                </p>
                <p className="text-xs text-red-600/70 dark:text-red-400/70">
                  Absent
                </p>
              </div>
            </div>
          </div>
        </DashboardCard>

        {/* Messages */}
        <DashboardCard title="Messages" icon="💬" className="lg:col-span-2">
          <div className="flex flex-col items-center justify-center py-8 text-center">
            <div className="mb-3 text-5xl opacity-40">🐺</div>
            <p className="text-muted-foreground">No new messages.</p>
            <p className="mt-1 text-sm text-muted-foreground">
              Messages from students, parents, and staff will appear here.
            </p>
          </div>
        </DashboardCard>
      </div>
    </div>
  )
}
