import { Suspense } from 'react'
import { Shield, Eye, Clock } from 'lucide-react'
import { getAuditLogs } from '@/lib/compliance/audit-logger'
import { AuditFilters } from './audit-filters'
import { AuditLogTable } from './audit-log-table'

interface AuditLogsPageProps {
  searchParams: Promise<{
    user?: string
    action?: string
    startDate?: string
    endDate?: string
  }>
}

export default async function AuditLogsPage({ searchParams }: AuditLogsPageProps) {
  const params = await searchParams
  const filters = {
    userId: params.user || undefined,
    action: params.action || undefined,
    startDate: params.startDate || undefined,
    endDate: params.endDate || undefined,
    limit: 50,
  }

  const logs = await getAuditLogs(filters)

  // Aggregate quick stats from returned data
  const uniqueUsers = new Set(logs.map((l: any) => l.user_id)).size
  const todayCount = logs.filter((l: any) => {
    const d = new Date(l.created_at)
    const now = new Date()
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    )
  }).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">
          Audit Logs
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track all system activity for compliance and security monitoring.
        </p>
      </div>

      {/* Quick stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="ocean-card flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-primary/10 p-3">
            <Shield className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Total Events</p>
            <p className="text-2xl font-bold text-foreground">{logs.length}</p>
          </div>
        </div>
        <div className="ocean-card flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-primary/10 p-3">
            <Eye className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Unique Users</p>
            <p className="text-2xl font-bold text-foreground">{uniqueUsers}</p>
          </div>
        </div>
        <div className="ocean-card flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-primary/10 p-3">
            <Clock className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Today</p>
            <p className="text-2xl font-bold text-foreground">{todayCount}</p>
          </div>
        </div>
      </div>

      {/* Filters (client component) */}
      <Suspense fallback={<div className="ocean-card h-24 animate-pulse rounded-2xl" />}>
        <AuditLogTable initialLogs={logs} />
      </Suspense>
    </div>
  )
}
