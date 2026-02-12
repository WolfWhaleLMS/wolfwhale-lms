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
  ArrowLeft,
  MapPin,
  Globe,
} from 'lucide-react'
import { Badge } from '@/components/ui/badge'
import { getComplianceStatus, getConsentRecords, getDataRequests } from '@/app/actions/compliance'

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
  let complianceResult: Awaited<ReturnType<typeof getComplianceStatus>> = { data: null, error: null }
  let consentResult: Awaited<ReturnType<typeof getConsentRecords>> = { data: null, error: null }
  let dataRequestsResult: Awaited<ReturnType<typeof getDataRequests>> = { data: null, error: null }

  try {
    ;[complianceResult, consentResult, dataRequestsResult] = await Promise.all([
      getComplianceStatus(),
      getConsentRecords(),
      getDataRequests(),
    ])
  } catch {
    // If the entire fetch fails (e.g. no tenant context), show the page
    // with empty data and an error banner rather than crashing.
  }

  const compliance = complianceResult.data
  const consentRecords = consentResult.data ?? []
  const dataRequests = dataRequestsResult.data ?? []
  const hasError = complianceResult.error || consentResult.error || dataRequestsResult.error

  const ferpaStatus = compliance ? overallStatus(compliance.ferpa) : 'warning'
  const coppaStatus = compliance ? overallStatus(compliance.coppa) : 'warning'
  const pipedaStatus = compliance?.pipeda?.length
    ? overallStatus(compliance.pipeda)
    : 'warning'

  const consentGiven = consentRecords.filter((r) => r.consent_given).length
  const consentPending = consentRecords.filter((r) => !r.consent_given).length

  const pendingRequests = dataRequests.filter(
    (r) => r.status === 'pending' || r.status === 'in_progress'
  ).length

  return (
    <div className="space-y-6">
      {/* Back Button */}
      <Link
        href="/admin/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Header */}
      <div className="flex items-start justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            Compliance Dashboard
          </h1>
          <p className="mt-1 text-muted-foreground">
            FERPA, COPPA, PIPEDA, and Canadian privacy law compliance status.
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

      {/* Error Banner */}
      {hasError && (
        <div className="flex items-center gap-3 rounded-xl border border-amber-200 bg-amber-50 p-4 dark:border-amber-800 dark:bg-amber-950/30">
          <AlertTriangle className="size-5 shrink-0 text-amber-600 dark:text-amber-400" />
          <div>
            <p className="text-sm font-medium text-amber-800 dark:text-amber-300">
              Some compliance data could not be loaded
            </p>
            <p className="text-xs text-amber-600 dark:text-amber-400">
              {complianceResult.error || consentResult.error || dataRequestsResult.error}
            </p>
          </div>
        </div>
      )}

      {/* Overall status summary */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-4">
        <div className="ocean-card flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-primary/10 p-3">
            <Shield className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">FERPA</p>
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
            <p className="text-sm text-muted-foreground">COPPA</p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(coppaStatus)}`}
            >
              {statusLabel(coppaStatus)}
            </span>
          </div>
        </div>
        <div className="ocean-card flex items-center gap-4 rounded-2xl p-5">
          <div className="rounded-xl bg-primary/10 p-3">
            <MapPin className="size-5 text-primary" />
          </div>
          <div>
            <p className="text-sm text-muted-foreground">PIPEDA</p>
            <span
              className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(pipedaStatus)}`}
            >
              {statusLabel(pipedaStatus)}
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
        {/* PIPEDA / Canadian Compliance Card */}
        <div className="ocean-card rounded-2xl p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <MapPin className="size-5 text-red-600" />
            <h2 className="text-lg font-semibold text-foreground">
              Canadian Privacy Law (PIPEDA & Provincial)
            </h2>
            <span className="ml-auto text-xs text-muted-foreground">
              PIPEDA, FIPPA (BC), MFIPPA (ON), Law 25 (QC), FOIP (AB)
            </span>
          </div>
          <div className="grid grid-cols-1 gap-3 md:grid-cols-2">
            {compliance?.pipeda?.map((item) => (
              <div
                key={item.id}
                className="flex items-start gap-3 rounded-xl bg-muted/50 p-4"
              >
                <StatusIcon status={item.status} />
                <div className="flex-1">
                  <div className="flex items-center justify-between gap-2">
                    <p className="text-sm font-medium text-foreground">
                      {item.label}
                    </p>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusBadgeClass(item.status)}`}
                    >
                      {statusLabel(item.status)}
                    </span>
                  </div>
                  <p className="mt-0.5 text-xs text-muted-foreground">
                    {item.description}
                  </p>
                  <span className="mt-1 inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-[10px] font-medium text-muted-foreground">
                    {item.category === 'pipeda' ? 'Federal (PIPEDA)' : 'Provincial'}
                  </span>
                </div>
              </div>
            )) ?? (
              <p className="py-4 text-center text-sm text-muted-foreground col-span-2">
                Unable to load Canadian compliance data.
              </p>
            )}
          </div>
        </div>

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

        {/* Data Requests (PIPEDA) */}
        <div className="ocean-card rounded-2xl p-6">
          <div className="mb-5 flex items-center gap-3">
            <FileCheck className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Data Requests (PIPEDA)
            </h2>
            {pendingRequests > 0 && (
              <span className="ml-auto inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/50 dark:text-amber-400">
                {pendingRequests} pending
              </span>
            )}
          </div>
          <p className="mb-3 text-xs text-muted-foreground">
            Under PIPEDA, individuals have the right to request access, correction,
            deletion, or portability of their personal information. Requests must be
            processed within 30 days.
          </p>
          {dataRequests.length > 0 ? (
            <div className="overflow-hidden rounded-xl border border-border">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-border bg-muted/50">
                    <th className="px-3 py-2 text-left font-medium text-muted-foreground">
                      Type
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
                  {dataRequests.slice(0, 5).map((req) => (
                    <tr key={req.id}>
                      <td className="px-3 py-2 capitalize text-foreground">
                        {req.request_type}
                      </td>
                      <td className="px-3 py-2">
                        <Badge
                          className={
                            req.status === 'completed'
                              ? 'bg-green-100 text-green-700'
                              : req.status === 'denied'
                                ? 'bg-red-100 text-red-700'
                                : 'bg-amber-100 text-amber-700'
                          }
                        >
                          {req.status}
                        </Badge>
                      </td>
                      <td className="px-3 py-2 text-right text-xs text-muted-foreground">
                        {new Date(req.created_at).toLocaleDateString()}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          ) : (
            <p className="text-center text-sm text-muted-foreground">
              No data requests submitted.
            </p>
          )}
        </div>

        {/* Quick Actions */}
        <div className="ocean-card rounded-2xl p-6 lg:col-span-2">
          <div className="mb-5 flex items-center gap-3">
            <FileCheck className="size-5 text-primary" />
            <h2 className="text-lg font-semibold text-foreground">
              Quick Actions
            </h2>
          </div>
          <div className="grid grid-cols-1 gap-3 sm:grid-cols-2">
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
            <Link href="/privacy" className="block">
              <div className="flex items-center justify-between rounded-xl bg-muted/50 p-4 transition-colors hover:bg-muted">
                <div className="flex items-center gap-3">
                  <Globe className="size-4 text-muted-foreground" />
                  <div>
                    <p className="text-sm font-medium text-foreground">
                      Privacy Policy (EN/FR)
                    </p>
                    <p className="text-xs text-muted-foreground">
                      View bilingual privacy policy page
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
