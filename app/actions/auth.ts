'use server'

import { createClient } from '@/lib/supabase/server'
import { verifyTurnstileToken } from '@/lib/turnstile'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { z } from 'zod'

const loginSchema = z.object({
  email: z.string().email(),
  password: z.string().min(1),
  turnstileToken: z.string().optional(),
})

export async function loginUser(formData: z.infer<typeof loginSchema>) {
  // Rate limit
  const rl = await rateLimitAction('login')
  if (!rl.success) {
    return { error: rl.error ?? 'Too many requests. Please try again later.' }
  }

  // Verify Turnstile if token provided
  if (formData.turnstileToken) {
    const valid = await verifyTurnstileToken(formData.turnstileToken)
    if (!valid) {
      return { error: 'CAPTCHA verification failed. Please try again.' }
    }
  }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email: formData.email,
    password: formData.password,
  })

  if (error) {
    return { error: error.message }
  }

  return { success: true }
}
