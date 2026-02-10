// Environment variable validation
// Validates required env vars at build time

function getRequiredEnv(key: string): string {
  const value = process.env[key]
  if (!value) {
    throw new Error(`Missing required environment variable: ${key}`)
  }
  return value
}

function getOptionalEnv(key: string, defaultValue = ''): string {
  return process.env[key] || defaultValue
}

export const env = {
  // Supabase (required)
  supabaseUrl: getRequiredEnv('NEXT_PUBLIC_SUPABASE_URL'),
  supabaseAnonKey: getRequiredEnv('NEXT_PUBLIC_SUPABASE_ANON_KEY'),
  supabaseServiceRoleKey: getOptionalEnv('SUPABASE_SERVICE_ROLE_KEY'),

  // App
  appUrl: getOptionalEnv('NEXT_PUBLIC_SITE_URL', 'http://localhost:3000'),
  nodeEnv: getOptionalEnv('NODE_ENV', 'development'),

  // Stripe (optional for now)
  stripePublishableKey: getOptionalEnv('NEXT_PUBLIC_STRIPE_PUBLISHABLE_KEY'),
  stripeSecretKey: getOptionalEnv('STRIPE_SECRET_KEY'),
  stripeWebhookSecret: getOptionalEnv('STRIPE_WEBHOOK_SECRET'),

  // Feature flags
  isProduction: process.env.NODE_ENV === 'production',
  isDevelopment: process.env.NODE_ENV !== 'production',
} as const
