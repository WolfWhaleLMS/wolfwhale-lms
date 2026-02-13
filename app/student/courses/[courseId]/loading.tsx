export default function Loading() {
  return (
    <div className="space-y-8 animate-in fade-in duration-300">
      {/* Breadcrumb skeleton */}
      <div className="h-5 w-36 rounded bg-muted animate-pulse" />

      {/* Course Header skeleton */}
      <div className="ocean-card rounded-2xl p-6 space-y-4">
        <div className="h-7 w-2/3 rounded bg-muted animate-pulse" />
        <div className="h-4 w-full rounded bg-muted animate-pulse" />
        <div className="flex flex-wrap items-center gap-4">
          <div className="h-4 w-24 rounded bg-muted animate-pulse" />
          <div className="h-6 w-16 rounded-md bg-muted animate-pulse" />
          <div className="h-6 w-20 rounded-md bg-muted animate-pulse" />
        </div>
        <div className="space-y-2 pt-2">
          <div className="flex justify-between">
            <div className="h-4 w-40 rounded bg-muted animate-pulse" />
            <div className="h-4 w-10 rounded bg-muted animate-pulse" />
          </div>
          <div className="h-3 w-full rounded-full bg-muted animate-pulse" />
        </div>
        <div className="h-12 w-56 rounded-xl bg-muted animate-pulse" />
      </div>

      {/* Stats row skeleton */}
      <div className="grid grid-cols-2 gap-4 sm:grid-cols-4">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="ocean-card rounded-2xl p-4 text-center space-y-2">
            <div className="mx-auto h-5 w-5 rounded bg-muted animate-pulse" />
            <div className="mx-auto h-7 w-10 rounded bg-muted animate-pulse" />
            <div className="mx-auto h-3 w-16 rounded bg-muted animate-pulse" />
          </div>
        ))}
      </div>

      {/* Lessons skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-20 rounded bg-muted animate-pulse" />
        <div className="space-y-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="ocean-card flex items-center gap-4 rounded-xl p-4">
              <div className="h-5 w-5 rounded-full bg-muted animate-pulse shrink-0" />
              <div className="h-8 w-8 rounded-lg bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-3/4 rounded bg-muted animate-pulse" />
                <div className="h-3 w-1/2 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-4 w-16 rounded bg-muted animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>

      {/* Assignments skeleton */}
      <div className="space-y-4">
        <div className="h-6 w-28 rounded bg-muted animate-pulse" />
        <div className="space-y-2">
          {[1, 2].map((i) => (
            <div key={i} className="ocean-card flex items-center gap-4 rounded-xl p-4">
              <div className="h-5 w-5 rounded bg-muted animate-pulse shrink-0" />
              <div className="flex-1 space-y-1.5">
                <div className="h-4 w-2/3 rounded bg-muted animate-pulse" />
                <div className="h-3 w-1/3 rounded bg-muted animate-pulse" />
              </div>
              <div className="h-5 w-20 rounded-full bg-muted animate-pulse shrink-0" />
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
