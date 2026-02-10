export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <div className="text-center">
        <div className="text-4xl mb-4 animate-bounce">🐋</div>
        <div className="h-1 w-32 bg-gray-200 dark:bg-gray-700 rounded-full overflow-hidden">
          <div className="h-full w-1/2 bg-blue-600 rounded-full animate-[shimmer_1.5s_ease-in-out_infinite]" />
        </div>
      </div>
    </div>
  )
}
