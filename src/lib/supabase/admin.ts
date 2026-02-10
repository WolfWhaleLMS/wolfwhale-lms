import { createClient } from '@supabase/supabase-js';
import type { Database } from '@/types/database.types';

/**
 * Create an admin Supabase client for use on the server.
 * This client uses the service role key and bypasses RLS policies.
 * IMPORTANT: Only use this in server-only contexts for administrative operations.
 * Never expose the service role key to the client.
 */
export function createAdminClient() {
  return createClient<Database>(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.SUPABASE_SERVICE_ROLE_KEY!,
    {
      auth: {
        autoRefreshToken: false,
        persistSession: false,
      },
    }
  );
}
