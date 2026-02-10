import Link from 'next/link'
import {
  Shield,
  FileCheck,
  AlertTriangle,
  Download,
  Search,
  Lock,
  CheckCircle2,
  XCircle,
  AlertCircle,
  ClipboardList,
  ExternalLink,
  Users,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { getComplianceStatus, getConsentRecords } from '@/app/actions/compliance'

function StatusIcon({ status }: { status: 'pass' | 'warning' | 'fail' }) {
  if (status === 'pass') {
    return <CheckCircle2 className="size-5 text-green-500" />
  }
  if (status === 'warning') {
    return <AlertCircle className="size-5 text-amber-500" />
  }
  return <XCircle className="size-5 text-red-500" />
}

function statusLabel(status: 'pass' | 'warning' | 'fail') {
  if (status === 'pass') return 'Compliant'
  if (status === 'warning') return 'Needs Review'
  return 'Non-Compliant'
}

function statusBadgeClass(status: 'pass' | 'warning' | 'fail') {
  if (status === 'pass')
    return 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
  if (status === 'warning')
    return 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
  return 'bg-red-100 text-red-700 dark:bg-red-950/50 dark:text-red-400'
}

function overallStatus(items: { status: 'pass' | 'warning' | 'fail' }[]) {
  if (items.some((i) => i.status === 'fail')) return 'fail'
  if (items.some((i) => i.status === 'warning')) return 'warning'
  return 'pass'
}

export default async function CompliancePage() {
  const [complianceResult, consentResult] = await Promise.all([
    getComplianceStatus(),
    getConsentRecords(),
  ])

  const compliance = complianceResult.data
  const consentRecords = consentResult.data ?? []

  const ferpaStatus = compliance ? overallStatus(compliance.ferpa) : 'warning'
  const coppaStatus = compliance ? overallStatus(compliance.coppa) : 'warning'

  const consentGiven = consentRecords.filter((r) => r.consent_given).length
  const consentPending = consentRecords.filter((r) => !r.consent_given).length

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Compliance Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            FERPA, COPPA, and data privacy compliance status for your institution.
          </p>
        </div>
        {compliance?.lastAuditDate && (
          <div className="text-right text-sm text-muted-foreground">
            <p>Last audit activity</p>
            <p className="font-medium text-foreground">
              {new Date(compliance.lastAuditDate).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                year: 'numeric',
              })}
            </p>
          </div>
        )}
      </div>

      {/* Overall status summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="ocean-card flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-primary/10 p-3">
            <Shield className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">FERPA Status</p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(ferpaStatus)}`}
            >
              {statusLabel(ferpaStatus)}
            </span>
          </div>
        </div>
        <div className="ocean-card flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-primary/10 p-3">
            <Lock className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">COPPA Status</p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(coppaStatus)}`}
            >
              {statusLabel(coppaStatus)}
            </span>
          </div>
        </div>
        <div className="ocean-card flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-primary/10 p-3">
            <Users className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">Consent Records</p>
            <p className="text-2xl font-bold text-foreground">
              {consentRecords.length}
            </p>
          </div>
        </div>
      </div>

      {/* Main Grid */}
      <div className="grid grid-cols-1 gap-6 lg:grid-cols-2">
        {/* FERPA Compliance Card */}
        <div className="ocean-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <Shield className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              FERPA Compliance
            </h2>
          </div>
          <div className="space-y-3">
            {compliance?.ferpa.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl bg-muted/50 p-4"
              >
                <StatusIcon status={item.status} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadgeClass(item.status)}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            )) ?? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Unable to load FERPA compliance data.
              </p>
            )}
          </div>
        </div>

        {/* COPPA Compliance Card */}
        <div className="ocean-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <Lock className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              COPPA Compliance
            </h2>
          </div>
          <div className="space-y-3">
            {compliance?.coppa.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl bg-muted/50 p-4"
              >
                <StatusIcon status={item.status} />
                <div className="flex-1">
                  <div className="flex items-center justify-between">
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <span
                      className={`inline-flex items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadgeClass(item.status)}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                </div>
              </div>
            )) ?? (
              <p className="py-4 text-center text-sm text-muted-foreground">
                Unable to load COPPA compliance data.
              </p>
            )}
          </div>
        </div>

        {/* Consent Tracking Summary */}
        <div className="ocean-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <ClipboardList className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Consent Tracking
            </h2>
          </div>
          <div className="grid grid-cols-2 gap-3">
            <div className="rounded-xl bg-green-50 p-4 text-center dark:bg-green-950/30">
              <p className="text-2xl font-bold text-green-700 dark:text-green-400">
                {consentGiven}
              </p>
              <p className="text-xs text-green-600 dark:text-green-500">
                Consent Given
              </p>
            </div>
            <div className="rounded-xl bg-amber-50 p-4 text-center dark:bg-amber-950/30">
              <p className="text-2xl font-bold text-amber-700 dark:text-amber-400">
                {consentPending}
              </p>
              <p className="text-xs text-amber-600 dark:text-amber-500">
                Pending / Denied
              </p>
            </div>
          </div>
          {consentRecords.length > 0 && (
            <div className="mt-4 overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Student
                    </th>
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Status
                    </th>
                    <th className="px-3 py-2 text-right font-medium text-muted-foreground">
                      Date
                    </th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-border">
                  {consentRecords.slice(0, 5).map((record) => (
                    <tr key={record.id}>
                      <td className="px-3 py-2 text-foreground">
                        {record.student_name ?? record.student_id.slice(0, 8)}
                      </td>
                      <td className="px-3 py-2">
                        {record.consent_given ? (
                          <Badge className="bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400">
                            Given
                          </Badge>
                        ) : (
                          <Badge className="bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                            Pending
                          </Badge>
                        )}
                      </td>
                      <td className="px-3 py-2 text-right text-xs text-muted-foreground">
                        {record.consent_date
                          ? new Date(record.consent_date).toLocaleDateString()
                          : '--'}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
          {consentRecords.length === 0 && (
            <p className="mt-4 text-center text-sm text-muted-foreground">
              No consent records found.
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="ocean-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <FileCheck className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Quick Actions
            </h2>
          </div>
          <div className="space-y-3">
            <Link href="/admin/audit-logs" className="block">
              <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Search className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      View Audit Logs
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Review all system activity and data access events
                    </p>
                  </div>
                </div>
                <ExternalLink className="size-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/admin/audit-logs?action=data.export" className="block">
              <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Download className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Export Data Logs
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Review and download data export history
                    </p>
                  </div>
                </div>
                <ExternalLink className="size-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/admin/audit-logs?action=data.access" className="block">
              <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted">
                <div className="flex items-center gap-3">
                  <AlertTriangle className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Data Access Logs
                    </p>
                    <p className="text-xs text-muted-foreground">
                      Monitor who accessed student records
                    </p>
                  </div>
                </div>
                <ExternalLink className="size-4 text-muted-foreground" />
              </div>
            </Link>
            <Link href="/admin/users" className="block">
              <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Users className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Manage Users
                    </p>
                    <p className="text-xs text-muted-foreground">
                      View and manage user accounts and roles
                    </p>
                  </div>
                </div>
                <ExternalLink className="size-4 text-muted-foreground" />
              </div>
            </Link>
          </div>
        </div>
      </div>
    </div>
  )
}
