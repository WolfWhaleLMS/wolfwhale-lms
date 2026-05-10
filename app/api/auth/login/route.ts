import { NextRequest } from 'next/server'
import { localPathWithParams, localRedirect } from '@/lib/http/redirects'
import { rolePathForMembershipRole, safeAuthRedirectPath } from '@/lib/lms/auth'
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit'
import { createClient } from '@/lib/supabase/server'

function loginRedirect(error: string, next: string | null) {
  return localRedirect(localPathWithParams('/login', { error, next }), 303)
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '')

  if (!email || !password) {
    return loginRedirect('missing-credentials', next)
  }

  const rateLimit = await checkRateLimit(
    { id: 'auth:login', limit: 8, window: '10 m' },
    rateLimitKey(request, [email || 'blank-email'])
  )

  if (!rateLimit.success) {
    return loginRedirect('rate-limited', next)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    return loginRedirect('invalid-credentials', next)
  }

  const { data: memberships, error: membershipError } = await supabase
    .from('tenant_memberships')
    .select('role,status')
    .eq('user_id', data.user.id)
    .eq('status', 'active')
    .limit(1)

  if (membershipError || !memberships?.length) {
    await supabase.auth.signOut()
    return loginRedirect('no-membership', next)
  }

  const fallback = rolePathForMembershipRole(String(memberships[0].role))

  return localRedirect(safeAuthRedirectPath(next, fallback), 303)
}
