'use client'

export default function ErrorPage({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E8F8FF] via-[#D0F0FF] to-[#B0E8FF] p-4">
      <div className="text-center max-w-md">
        <div className="text-6xl font-display font-bold bg-gradient-to-r from-[#00BFFF] to-[#33FF33] bg-clip-text text-transparent mb-4">
          Oops
        </div>
        <h1 className="text-2xl font-bold text-[#0A2540] mb-2">
          Something went wrong
        </h1>
        <p className="text-lg text-[#0A2540]/70 mb-6">
          An unexpected error occurred. Please try again.
        </p>
        <div className="flex flex-col sm:flex-row gap-3 justify-center">
          <button
            onClick={reset}
            className="px-6 py-3 bg-[#00BFFF] text-white rounded-lg hover:shadow-[0_0_25px_rgba(0,191,255,0.4)] transition-all font-medium"
          >
            Try Again
          </button>
          <a
            href="/"
            className="px-6 py-3 border border-[#00BFFF]/30 text-[#0A2540] rounded-lg hover:border-[#00BFFF] hover:bg-[#00BFFF]/5 transition-all font-medium"
          >
            Go Home
          </a>
        </div>
      </div>
    </div>
  )
}
