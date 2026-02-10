'use client'

import { useEffect } from 'react'

export default function MessagingError({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  useEffect(() => {
    console.error('Messaging error:', error)
  }, [error])

  return (
    <div className="flex items-center justify-center min-h-[60vh] p-4">
      <div className="text-center max-w-md">
        <div className="text-5xl mb-4">🐋</div>
        <h2 className="text-xl font-bold text-gray-900 dark:text-white mb-2">
          Messaging unavailable
        </h2>
        <p className="text-gray-600 dark:text-gray-400 mb-6">
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
