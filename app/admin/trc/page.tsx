import Link from 'next/link'
import { ArrowLeft, Heart, CheckCircle2, Circle } from 'lucide-react'
import { getTrcStatus, type TrcCallToAction } from '@/app/actions/trc'

function statusBadgeClass(status: TrcCallToAction['status']) {
  if (status === 'addressed')
    return 'bg-green-100 text-green-700 dark:bg-green-950/50 dark:text-green-400'
  if (status === 'in_progress')
    return 'bg-amber-100 text-amber-700 dark:bg-amber-950/50 dark:text-amber-400'
  return 'bg-gray-100 text-gray-700 dark:bg-gray-800 dark:text-gray-400'
}

function statusLabel(status: TrcCallToAction['status']) {
  if (status === 'addressed') return 'Addressed'
  if (status === 'in_progress') return 'In Progress'
  return 'Not Started'
}

export default async function TrcCompliancePage() {
  const calls = await getTrcStatus()

  // Overall stats
  const addressed = calls.filter((c) => c.status === 'addressed').length
  const inProgress = calls.filter((c) => c.status === 'in_progress').length
  const notStarted = calls.filter((c) => c.status === 'not_started').length

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
      <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-3">
        <div className="flex items-start gap-3">
          <div className="rounded-xl bg-amber-100 p-2.5 dark:bg-amber-950/40 shrink-0">
            <Heart className="h-5 w-5 text-amber-600 dark:text-amber-400" />
          </div>
          <div>
            <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
              TRC Compliance Tracker
            </h1>
            <p className="mt-1 text-sm sm:text-base text-muted-foreground">
              Track your school&apos;s progress on Truth and Reconciliation Calls to
              Action 6&ndash;12
            </p>
          </div>
        </div>
      </div>

      {/* Overall progress banner */}
      <div className="ocean-card rounded-2xl p-4 sm:p-5">
        <div className="flex flex-wrap items-center gap-4 text-sm">
          <span className="font-medium text-foreground">Overall Progress:</span>
          <span className="inline-flex items-center gap-1.5 text-green-700 dark:text-green-400">
            <CheckCircle2 className="h-4 w-4" />
            {addressed} Addressed
          </span>
          <span className="inline-flex items-center gap-1.5 text-amber-700 dark:text-amber-400">
            <Circle className="h-4 w-4 fill-amber-400 stroke-amber-600 dark:fill-amber-500 dark:stroke-amber-400" />
            {inProgress} In Progress
          </span>
          <span className="inline-flex items-center gap-1.5 text-gray-500 dark:text-gray-400">
            <Circle className="h-4 w-4" />
            {notStarted} Not Started
          </span>
        </div>
      </div>

      {/* Summary cards grid */}
      <div className="grid grid-cols-2 gap-2 sm:gap-4 lg:grid-cols-4 xl:grid-cols-7">
        {calls.map((call) => {
          const completed = call.checklist.filter((c) => c.completed).length
          const total = call.checklist.length
          return (
            <a
              key={call.number}
              href={`#cta-${call.number}`}
              className="ocean-card flex flex-col gap-2 rounded-2xl p-3 sm:p-4 transition-colors hover:bg-muted/50"
            >
              <p className="text-xs font-semibold text-amber-600 dark:text-amber-400">
                CTA #{call.number}
              </p>
              <p className="text-sm font-medium text-foreground leading-tight line-clamp-2">
                {call.title}
              </p>
              <span
                className={`mt-auto inline-flex self-start items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(call.status)}`}
              >
                {statusLabel(call.status)}
              </span>
              <p className="text-[10px] text-muted-foreground">
                {completed}/{total} items
              </p>
            </a>
          )
        })}
      </div>

      {/* Detail section */}
      <div className="space-y-4 sm:space-y-6">
        {calls.map((call) => {
          const completed = call.checklist.filter((c) => c.completed).length
          const total = call.checklist.length
          const percent = total > 0 ? Math.round((completed / total) * 100) : 0

          return (
            <div
              key={call.number}
              id={`cta-${call.number}`}
              className="ocean-card rounded-2xl p-4 sm:p-6 scroll-mt-6"
            >
              {/* Card Header */}
              <div className="mb-4 flex flex-col sm:flex-row sm:items-center sm:justify-between gap-2">
                <div className="flex items-center gap-3">
                  <span className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-amber-100 text-sm font-bold text-amber-700 dark:bg-amber-950/40 dark:text-amber-400">
                    {call.number}
                  </span>
                  <h2 className="text-lg font-semibold text-foreground">
                    {call.title}
                  </h2>
                </div>
                <span
                  className={`inline-flex self-start sm:self-auto shrink-0 items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${statusBadgeClass(call.status)}`}
                >
                  {statusLabel(call.status)}
                </span>
              </div>

              {/* Description */}
              <p className="mb-5 text-sm text-muted-foreground leading-relaxed">
                {call.description}
              </p>

              {/* Progress bar */}
              <div className="mb-5">
                <div className="mb-1.5 flex items-center justify-between text-xs">
                  <span className="font-medium text-foreground">Progress</span>
                  <span className="text-muted-foreground">
                    {completed}/{total} completed ({percent}%)
                  </span>
                </div>
                <div className="h-2.5 w-full overflow-hidden rounded-full bg-gray-200 dark:bg-gray-700">
                  <div
                    className={`h-full rounded-full transition-all duration-500 ${
                      percent > 0
                        ? 'bg-gradient-to-r from-amber-400 to-amber-600'
                        : 'bg-gray-300 dark:bg-gray-600'
                    }`}
                    style={{ width: `${Math.max(percent, 0)}%` }}
                  />
                </div>
              </div>

              {/* Checklist */}
              <div className="mb-5 space-y-2">
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground">
                  Checklist
                </p>
                <div className="grid grid-cols-1 gap-2 md:grid-cols-2">
                  {call.checklist.map((item) => (
                    <div
                      key={item.id}
                      className="flex items-start gap-3 rounded-xl bg-muted/50 p-3"
                    >
                      {item.completed ? (
                        <CheckCircle2 className="mt-0.5 h-4 w-4 shrink-0 text-green-500" />
                      ) : (
                        <Circle className="mt-0.5 h-4 w-4 shrink-0 text-gray-400 dark:text-gray-500" />
                      )}
                      <span
                        className={`text-sm ${
                          item.completed
                            ? 'text-foreground line-through opacity-70'
                            : 'text-foreground'
                        }`}
                      >
                        {item.label}
                      </span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Evidence section */}
              <div>
                <p className="text-xs font-semibold uppercase tracking-wider text-muted-foreground mb-2">
                  Evidence &amp; Documentation
                </p>
                {call.evidence.length > 0 ? (
                  <ul className="space-y-1">
                    {call.evidence.map((item, idx) => (
                      <li
                        key={idx}
                        className="text-sm text-foreground flex items-center gap-2"
                      >
                        <CheckCircle2 className="h-3.5 w-3.5 text-green-500 shrink-0" />
                        {item}
                      </li>
                    ))}
                  </ul>
                ) : (
                  <p className="text-sm text-muted-foreground italic">
                    No evidence uploaded yet. Documentation can be added once tracking is
                    enabled.
                  </p>
                )}
              </div>
            </div>
          )
        })}
      </div>
    </div>
  )
}
