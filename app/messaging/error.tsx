'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function MessagingError({
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
        <div className="text-5xl mb-4">🐋</div>
        <h2 className="text-xl font-bold text-[#0A2540] dark:text-[#E8F8FF] mb-2">
          Messaging unavailable
        </h2>
        <p className="text-[#0A2540]/70 dark:text-[#E8F8FF]/60 mb-6">
          We couldn&apos;t load your messages. Please try again.
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
