export default function Loading() {
  return (
    <div className="p-6 space-y-6">
      <div className="h-8 w-48 bg-muted/50 rounded animate-pulse" />
      <div className="space-y-3">
        {Array.from({ length: 6 }).map((_, i) => (
          <div key={i} className="h-16 bg-muted/50 rounded-xl animate-pulse" />
        ))}
      </div>
    </div>
  )
}
