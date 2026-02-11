export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-32 bg-muted/50 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
