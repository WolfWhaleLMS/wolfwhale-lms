import type { EmailOtpType } from '@supabase/supabase-js'
import { NextRequest } from 'next/server'
import { localRedirect } from '@/lib/http/redirects'
import { safeAuthRedirectPath } from '@/lib/lms/auth'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
  const tokenHash = request.nextUrl.searchParams.get('token_hash')
  const type = request.nextUrl.searchParams.get('type') as EmailOtpType | null
  const next = request.nextUrl.searchParams.get('next')

  if (tokenHash && type) {
    const supabase = await createClient()
    const { error } = await supabase.auth.verifyOtp({ token_hash: tokenHash, type })

    if (!error) {
      return localRedirect(safeAuthRedirectPath(next, '/student'), 303)
    }
  }

  return localRedirect('/login?error=auth-confirmation-failed', 303)
}
