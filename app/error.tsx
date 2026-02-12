'use client'

import { useEffect } from 'react'
import * as Sentry from '@sentry/nextjs'

export default function RootError({
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
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E8F8FF] via-[#D0F0FF] to-[#B0E8FF] dark:from-[#041428] dark:via-[#0A2040] dark:to-[#041428] p-4">
      <div className="text-center max-w-md">
        <div className="text-5xl font-display font-bold text-[#00BFFF] text-glow-blue mb-4">
          OOPS
        </div>
        <h1 className="text-2xl font-bold text-[#0A2540] dark:text-white mb-2">
          Something went wrong
        </h1>
        <p className="text-[#6B8FA3] dark:text-white/60 mb-6">
          Our whale hit a rough wave. Don&apos;t worry, we&apos;re on it!
        </p>
        <button
          onClick={reset}
          className="px-6 py-3 bg-[#00BFFF] text-white rounded-lg hover:shadow-[0_0_25px_rgba(0,191,255,0.4)] transition-all font-medium"
        >
          Try again
        </button>
      </div>
    </div>
  )
}
