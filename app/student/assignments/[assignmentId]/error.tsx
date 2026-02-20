'use client'

import ErrorBoundaryContent from '@/components/errors/ErrorBoundaryContent'

export default function Error({
  error,
  reset,
}: {
  error: Error & { digest?: string }
  reset: () => void
}) {
  return <ErrorBoundaryContent error={error} reset={reset} />
}
