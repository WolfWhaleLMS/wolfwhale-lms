import * as Sentry from '@sentry/nextjs'

Sentry.init({
  dsn: process.env.NEXT_PUBLIC_SENTRY_DSN,
  tracesSampleRate: 0.1,
  replaysSessionSampleRate: 0,
  // Replay disabled to save ~30-50KB client bundle; set to 1.0 to re-enable
  replaysOnErrorSampleRate: 0,
  debug: false,
  enabled: process.env.NODE_ENV === 'production',
})
