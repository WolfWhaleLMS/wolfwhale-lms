'use server'

import { createClient } from '@/lib/supabase/server'

const DEMO_ACCOUNTS: Record<string, string> = {
  student: 'student@wolfwhale.ca',
  teacher: 'teacher@wolfwhale.ca',
  parent: 'parent@wolfwhale.ca',
  admin: 'admin@wolfwhale.ca',
}

export async function demoLogin(role: string): Promise<{ error?: string }> {
  const DEMO_PASSWORD = process.env.DEMO_ACCOUNT_PASSWORD
  if (!DEMO_PASSWORD) {
    return { error: 'Demo accounts are not configured.' }
  }

  const email = DEMO_ACCOUNTS[role]
  if (!email) return { error: 'Invalid demo role' }

  const supabase = await createClient()
  const { error } = await supabase.auth.signInWithPassword({
    email,
    password: DEMO_PASSWORD,
  })

  if (error) return { error: error.message }
  return {}
}
