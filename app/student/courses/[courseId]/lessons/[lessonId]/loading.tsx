export default function Loading() {
  return (
    <div className="mx-auto max-w-4xl space-y-6 animate-in fade-in duration-300">
      {/* Breadcrumb skeleton */}
      <div className="h-5 w-32 rounded bg-muted animate-pulse" />

      {/* Lesson Header skeleton */}
      <div className="ocean-card rounded-2xl p-6 space-y-4">
        <div className="flex items-start justify-between gap-4">
          <div className="flex-1 space-y-3">
            <div className="h-7 w-3/4 rounded bg-muted animate-pulse" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
          </div>
        </div>
        <div className="flex items-center gap-4">
          <div className="h-4 w-20 rounded bg-muted animate-pulse" />
          <div className="h-4 w-16 rounded bg-muted animate-pulse" />
        </div>
      </div>

      {/* Learning Objectives skeleton */}
      <div className="ocean-card rounded-2xl p-6 space-y-3">
        <div className="flex items-center gap-2">
          <div className="h-5 w-5 rounded bg-muted animate-pulse" />
          <div className="h-5 w-40 rounded bg-muted animate-pulse" />
        </div>
        <div className="space-y-2">
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="h-4 w-full rounded bg-muted animate-pulse" />
          </div>
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="h-4 w-4/5 rounded bg-muted animate-pulse" />
          </div>
          <div className="flex items-start gap-2">
            <div className="h-5 w-5 rounded-full bg-muted animate-pulse shrink-0" />
            <div className="h-4 w-3/5 rounded bg-muted animate-pulse" />
          </div>
        </div>
      </div>

      {/* Content skeleton */}
      <div className="ocean-card rounded-2xl p-6 space-y-4">
        <div className="h-6 w-1/2 rounded bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-5/6 rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
        </div>
        <div className="h-48 w-full rounded-lg bg-muted animate-pulse" />
        <div className="space-y-2">
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-full rounded bg-muted animate-pulse" />
          <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
        </div>
      </div>

      {/* Mark Complete button skeleton */}
      <div className="flex justify-center">
        <div className="h-12 w-48 rounded-lg bg-muted animate-pulse" />
      </div>

      {/* Navigation skeleton */}
      <div className="flex items-center justify-between border-t border-border pt-6">
        <div className="h-16 w-44 rounded-lg bg-muted animate-pulse" />
        <div className="h-16 w-44 rounded-lg bg-muted animate-pulse" />
      </div>
    </div>
  )
}
