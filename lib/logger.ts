import * as Sentry from '@sentry/nextjs'

/**
 * Centralized logger utility for WolfWhale LMS.
 *
 * Logs errors/warnings to the console AND forwards them to Sentry
 * for production monitoring.  Use this instead of bare console.error
 * in new code so every failure is captured in one place.
 */

export function logError(
  message: string,
  error?: unknown,
  context?: Record<string, unknown>,
) {
  console.error(message, error)

  try {
    if (error instanceof Error) {
      Sentry.captureException(error, { extra: { message, ...context } })
    } else {
      Sentry.captureMessage(message, {
        level: 'error',
        extra: { error, ...context },
      })
    }
  } catch {
    // Sentry may not be initialised in dev / tests — fail silently
  }
}

export function logWarning(
  message: string,
  context?: Record<string, unknown>,
) {
  console.warn(message, context)

  try {
    Sentry.captureMessage(message, {
      level: 'warning',
      extra: context,
    })
  } catch {
    // Sentry may not be initialised in dev / tests — fail silently
  }
}
