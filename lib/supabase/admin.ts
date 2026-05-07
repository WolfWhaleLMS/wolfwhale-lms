import 'server-only'
import { createClient } from '@supabase/supabase-js'
import { getSupabaseBrowserEnv } from '@/lib/supabase/env'

export function hasSupabaseAdminEnv() {
  return Boolean(process.env.SUPABASE_SERVICE_ROLE_KEY?.trim())
}

export function createAdminClient() {
  const { url } = getSupabaseBrowserEnv()
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY?.trim()

  if (!serviceRoleKey) {
    throw new Error('SUPABASE_SERVICE_ROLE_KEY is required for server-side roster imports.')
  }

  return createClient(url, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
