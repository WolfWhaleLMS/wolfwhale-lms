import type { EmailOtpType } from '@supabase/supabase-js'
import { NextRequest, NextResponse } from 'next/server'
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
      return NextResponse.redirect(new URL(safeAuthRedirectPath(next, '/student'), request.url), { status: 303 })
    }
  }

  return NextResponse.redirect(new URL('/login?error=auth-confirmation-failed', request.url), { status: 303 })
}
