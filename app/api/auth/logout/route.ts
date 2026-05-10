import { localRedirect } from '@/lib/http/redirects'
import { createClient } from '@/lib/supabase/server'

export async function POST() {
  const supabase = await createClient()
  await supabase.auth.signOut()

  return localRedirect('/login?loggedOut=1', 303)
}
