// Wolf Whale LMS - Supabase Admin (Service Role) Client
// Phase C: Server-only client for privileged operations
//
// IMPORTANT: This client uses the SUPABASE_SERVICE_ROLE_KEY and bypasses
// Row Level Security. It must NEVER be imported from client components or
// exposed to the browser.
//
// Usage:
//   import { createAdminClient } from '@/lib/supabase/admin'
//   const admin = createAdminClient()
//   const { data } = await admin.from('tenants').select('*')

import { createClient } from '@supabase/supabase-js'

/**
 * Creates a Supabase client authenticated with the service-role key.
 * This client bypasses RLS and should only be used in:
 *   - Server Actions
 *   - API Routes / Route Handlers
 *   - Background jobs / cron functions
 *
 * Never import this file from a Client Component or pass the client to one.
 */
export function createAdminClient() {
  const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL
  const serviceRoleKey = process.env.SUPABASE_SERVICE_ROLE_KEY

  if (!supabaseUrl) {
    throw new Error(
      'Missing NEXT_PUBLIC_SUPABASE_URL. Add it to .env.local.',
    )
  }

  if (!serviceRoleKey) {
    throw new Error(
      'Missing SUPABASE_SERVICE_ROLE_KEY. Add it to .env.local. ' +
      'You can find it in the Supabase dashboard under Settings > API.',
    )
  }

  return createClient(supabaseUrl, serviceRoleKey, {
    auth: {
      autoRefreshToken: false,
      persistSession: false,
    },
  })
}
