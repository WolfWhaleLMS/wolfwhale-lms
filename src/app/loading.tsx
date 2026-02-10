export default function Loading() {
  return (
    <div className="min-h-screen bg-gradient-to-br from-blue-50 to-indigo-100 dark:from-slate-900 dark:to-slate-800 flex items-center justify-center">
      <div className="flex flex-col items-center gap-6">
        {/* Animated Wolf and Whale */}
        <div className="flex items-center gap-4">
          <div className="text-6xl animate-bounce" style={{ animationDelay: '0s' }}>
            🐺
          </div>
          <div className="text-5xl font-bold text-blue-600 dark:text-blue-400">Wolf Whale</div>
          <div className="text-6xl animate-bounce" style={{ animationDelay: '0.2s' }}>
            🐳
          </div>
        </div>

        {/* Loading Spinner */}
        <div className="relative w-12 h-12">
          <div className="absolute inset-0 rounded-full border-4 border-blue-200 dark:border-blue-900" />
          <div className="absolute inset-0 rounded-full border-4 border-transparent border-t-blue-600 dark:border-t-blue-400 animate-spin" />
        </div>

        {/* Loading Text */}
        <p className="text-slate-600 dark:text-slate-300 font-medium">Where Learning Comes Alive...</p>
      </div>
    </div>
  );
}
