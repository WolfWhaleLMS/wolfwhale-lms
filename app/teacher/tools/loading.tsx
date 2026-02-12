export default function Loading() {
  return (
    <div className="space-y-8">
      <div className="h-6 w-36 animate-pulse rounded bg-muted" />
      <div className="h-40 animate-pulse rounded-2xl bg-muted" />
      <div className="space-y-4">
        <div className="h-10 animate-pulse rounded-xl bg-muted" />
        <div className="flex gap-2">
          {[1, 2, 3, 4, 5].map((i) => (
            <div key={i} className="h-8 w-24 animate-pulse rounded-full bg-muted" />
          ))}
        </div>
      </div>
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
        {[1, 2, 3, 4, 5, 6].map((i) => (
          <div key={i} className="h-48 animate-pulse rounded-2xl bg-muted" />
        ))}
      </div>
    </div>
  )
}
