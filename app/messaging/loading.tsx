export default function MessagingLoading() {
  return (
    <div className="p-6 space-y-4 animate-pulse">
      <div className="h-8 w-36 bg-gray-200 dark:bg-gray-700 rounded" />
      <div className="flex gap-4 h-[70vh]">
        <div className="w-80 bg-gray-200 dark:bg-gray-700 rounded-xl" />
        <div className="flex-1 bg-gray-200 dark:bg-gray-700 rounded-xl" />
      </div>
    </div>
  )
}
