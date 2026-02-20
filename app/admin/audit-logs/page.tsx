import { Suspense } from 'react'
import Link from 'next/link'
import { Shield, Eye, Clock, ArrowLeft, AlertTriangle } from 'lucide-react'
import { getAuditLogs } from '@/lib/compliance/audit-logger'
import { AuditLogTable } from './audit-log-table'

interface AuditLogEntry {
  id: string
  created_at: string
  user_id: string
  action: string
  resource_type?: string | null
  resource_id?: string | null
  ip_address?: string | null
  details?: Record<string, unknown> | null
  profiles?: { full_name?: string | null; avatar_url?: string | null } | null
}

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

  let logs: AuditLogEntry[] = []
  let fetchError = false

  try {
    logs = await getAuditLogs(filters)
  } catch {
    fetchError = true
  }

  // Aggregate quick stats from returned data
  const uniqueUsers = new Set(logs.map((l) => l.user_id)).size
  const todayCount = logs.filter((l) => {
    const d = new Date(l.created_at)
    const now = new Date()
    return (
      d.getFullYear() === now.getFullYear() &&
      d.getMonth() === now.getMonth() &&
      d.getDate() === now.getDate()
    )
  }).length

  return (
    <div className="space-y-4 sm:space-y-6 overflow-x-hidden max-w-full">
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
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
          Audit Logs
        </h1>
        <p className="mt-1 text-muted-foreground">
          Track all system activity for compliance and security monitoring.
        </p>
      </div>

      {/* Error banner */}
      {fetchError && (
        <div className="ocean-card flex items-center gap-3 rounded-2xl border border-amber-500/30 bg-amber-500/10 p-4">
          <AlertTriangle className="size-5 flex-shrink-0 text-amber-500" />
          <p className="text-sm text-foreground">
            Unable to load audit logs. The audit log table may not be set up yet, or there was a temporary database issue. Please try refreshing the page.
          </p>
        </div>
      )}

      {/* Quick stats */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 sm:grid-cols-3">
        <div className="ocean-card flex items-center gap-2 sm:gap-4 rounded-2xl p-3 sm:p-5">
          <div className="rounded-xl bg-primary/10 p-2 sm:p-3 shrink-0">
            <Shield className="h-4 w-4 sm:size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground">Total Events</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{logs.length}</p>
          </div>
        </div>
        <div className="ocean-card flex items-center gap-2 sm:gap-4 rounded-2xl p-3 sm:p-5">
          <div className="rounded-xl bg-primary/10 p-2 sm:p-3 shrink-0">
            <Eye className="h-4 w-4 sm:size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground">Unique Users</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{uniqueUsers}</p>
          </div>
        </div>
        <div className="ocean-card flex items-center gap-2 sm:gap-4 rounded-2xl p-3 sm:p-5 col-span-2 sm:col-span-1">
          <div className="rounded-xl bg-primary/10 p-2 sm:p-3 shrink-0">
            <Clock className="h-4 w-4 sm:size-5 text-primary" />
          </div>
          <div className="min-w-0">
            <p className="text-xs sm:text-sm text-muted-foreground">Today</p>
            <p className="text-xl sm:text-2xl font-bold text-foreground">{todayCount}</p>
          </div>
        </div>
      </div>

      {/* Table with filters */}
      <Suspense fallback={<div className="ocean-card h-24 animate-pulse rounded-2xl" />}>
        <AuditLogTable initialLogs={logs} />
      </Suspense>
    </div>
  )
}
