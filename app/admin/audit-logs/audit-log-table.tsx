'use client'

import { useState, useCallback } from 'react'
import { Loader2 } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { AuditFilters } from './audit-filters'

interface AuditLog {
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

function actionBadgeVariant(action: string) {
  if (action.startsWith('user.')) return 'default'
  if (action.startsWith('grade.')) return 'secondary'
  if (action.startsWith('data.')) return 'outline'
  if (action.startsWith('admin.')) return 'destructive'
  return 'secondary'
}

function formatTimestamp(iso: string) {
  const d = new Date(iso)
  return d.toLocaleString('en-US', {
    month: 'short',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
    hour12: true,
  })
}

function formatDetails(details: Record<string, unknown> | null | undefined) {
  if (!details) return '--'
  const entries = Object.entries(details)
  if (entries.length === 0) return '--'
  return entries
    .slice(0, 3)
    .map(([k, v]) => `${k}: ${String(v)}`)
    .join(', ')
}

export function AuditLogTable({ initialLogs }: { initialLogs: AuditLog[] }) {
  const [visibleCount, setVisibleCount] = useState(25)
  const [loading, setLoading] = useState(false)

  const visibleLogs = initialLogs.slice(0, visibleCount)
  const hasMore = visibleCount < initialLogs.length

  const handleLoadMore = useCallback(() => {
    setLoading(true)
    // Simulate a brief loading state for UX feedback
    setTimeout(() => {
      setVisibleCount((prev) => prev + 25)
      setLoading(false)
    }, 200)
  }, [])

  const handleExport = useCallback(() => {
    // Build CSV on the client from visible data
    const header =
      'Timestamp,User,Action,Resource Type,Resource ID,IP Address,Details'
    const rows = initialLogs.map((log) => {
      const timestamp = new Date(log.created_at).toISOString()
      const user = (log.profiles?.full_name ?? log.user_id).replace(/,/g, ' ')
      const action = log.action
      const resourceType = log.resource_type ?? ''
      const resourceId = log.resource_id ?? ''
      const ip = log.ip_address ?? ''
      const details = log.details
        ? JSON.stringify(log.details).replace(/,/g, ';')
        : ''
      return `${timestamp},${user},${action},${resourceType},${resourceId},${ip},"${details}"`
    })
    const csv = [header, ...rows].join('\n')
    const blob = new Blob([csv], { type: 'text/csv;charset=utf-8;' })
    const url = URL.createObjectURL(blob)
    const link = document.createElement('a')
    link.href = url
    link.download = `audit-logs-${new Date().toISOString().split('T')[0]}.csv`
    link.click()
    URL.revokeObjectURL(url)
  }, [initialLogs])

  return (
    <>
      <AuditFilters onExport={handleExport} />

      {/* Table */}
      <div className="ocean-card overflow-hidden rounded-2xl">
        <div className="overflow-x-auto">
          <table className="w-full text-sm">
            <thead>
              <tr className="border-b border-border bg-muted/50">
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Timestamp
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  User
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Action
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Resource
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  IP Address
                </th>
                <th className="px-4 py-3 text-left font-medium text-muted-foreground">
                  Details
                </th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {visibleLogs.length === 0 ? (
                <tr>
                  <td
                    colSpan={6}
                    className="px-4 py-12 text-center text-muted-foreground"
                  >
                    No audit events found matching your filters.
                  </td>
                </tr>
              ) : (
                visibleLogs.map((log) => (
                  <tr
                    key={log.id}
                    className="transition-colors hover:bg-muted/30"
                  >
                    <td className="whitespace-nowrap px-4 py-3 text-muted-foreground">
                      {formatTimestamp(log.created_at)}
                    </td>
                    <td className="px-4 py-3 font-medium text-foreground">
                      {log.profiles?.full_name ?? (
                        <span className="font-mono text-xs text-muted-foreground">
                          {log.user_id.slice(0, 8)}...
                        </span>
                      )}
                    </td>
                    <td className="px-4 py-3">
                      <Badge variant={actionBadgeVariant(log.action)}>
                        {log.action}
                      </Badge>
                    </td>
                    <td className="px-4 py-3 text-muted-foreground">
                      {log.resource_type ? (
                        <span>
                          {log.resource_type}
                          {log.resource_id && (
                            <span className="ml-1 font-mono text-xs">
                              #{log.resource_id.slice(0, 8)}
                            </span>
                          )}
                        </span>
                      ) : (
                        '--'
                      )}
                    </td>
                    <td className="whitespace-nowrap px-4 py-3 font-mono text-xs text-muted-foreground">
                      {log.ip_address ?? '--'}
                    </td>
                    <td className="max-w-[200px] truncate px-4 py-3 text-xs text-muted-foreground">
                      {formatDetails(log.details)}
                    </td>
                  </tr>
                ))
              )}
            </tbody>
          </table>
        </div>

        {/* Load more */}
        {hasMore && (
          <div className="flex justify-center border-t border-border p-4">
            <Button
              onClick={handleLoadMore}
              variant="outline"
              size="sm"
              disabled={loading}
            >
              {loading && <Loader2 className="size-4 animate-spin" />}
              Load More ({initialLogs.length - visibleCount} remaining)
            </Button>
          </div>
        )}
      </div>
    </>
  )
}
