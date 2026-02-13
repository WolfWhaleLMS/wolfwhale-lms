'use server'

import { rateLimitAction } from '@/lib/rate-limit-action'

const DEMO_ACCOUNTS: Record<string, string> = {
  student: 'student@wolfwhale.ca',
  teacher: 'teacher@wolfwhale.ca',
  parent: 'parent@wolfwhale.ca',
  admin: 'admin@wolfwhale.ca',
}

/**
 * Returns demo credentials after rate-limiting.
 * The actual sign-in happens client-side so browser cookies are set properly.
 */
export async function getDemoCredentials(role: string): Promise<{ email?: string; password?: string; error?: string }> {
  // Rate limit demo logins to prevent abuse
  const rl = await rateLimitAction('demo-login')
  if (!rl.success) {
    return { error: rl.error ?? 'Too many demo login attempts. Please try again later.' }
  }

  const DEMO_PASSWORD = process.env.DEMO_ACCOUNT_PASSWORD
  if (!DEMO_PASSWORD) {
    return { error: 'Demo accounts are not configured.' }
  }

  const email = DEMO_ACCOUNTS[role]
  if (!email) return { error: 'Invalid demo role' }

  return { email, password: DEMO_PASSWORD }
}
