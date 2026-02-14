'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function ErrorBoundaryContent({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    Sentry.captureException(error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="text-center max-w-md">
        <div className="text-5xl font-display font-bold text-[#00BFFF] text-glow-blue mb-4">
          OOPS
        </div>
        <h2 className="text-xl font-bold text-[#0A2540] dark:text-[#E8F8FF] mb-2">
          Something went wrong
        </h2>
        <p className="text-[#0A2540]/70 dark:text-[#E8F8FF]/60 mb-6">
          Our whale hit a rough wave. Don&apos;t worry, we&apos;re on it!
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#00BFFF] text-white rounded-lg hover:bg-[#00BFFF]/80 transition-colors font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
