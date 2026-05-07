import { NextRequest, NextResponse } from 'next/server'
import { rolePathForMembershipRole, safeAuthRedirectPath } from '@/lib/lms/auth'
import { createClient } from '@/lib/supabase/server'

function loginRedirect(request: NextRequest, error: string, next: string | null) {
  const destination = new URL('/login', request.url)
  destination.searchParams.set('error', error)
  if (next) destination.searchParams.set('next', next)

  return NextResponse.redirect(destination, { status: 303 })
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()
  const email = String(formData.get('email') ?? '').trim().toLowerCase()
  const password = String(formData.get('password') ?? '')
  const next = String(formData.get('next') ?? '')

  if (!email || !password) {
    return loginRedirect(request, 'missing-credentials', next)
  }

  const supabase = await createClient()
  const { data, error } = await supabase.auth.signInWithPassword({ email, password })

  if (error || !data.user) {
    return loginRedirect(request, 'invalid-credentials', next)
  }

  const { data: memberships, error: membershipError } = await supabase
    .from('tenant_memberships')
    .select('role,status')
    .eq('user_id', data.user.id)
    .eq('status', 'active')
    .limit(1)

  if (membershipError || !memberships?.length) {
    await supabase.auth.signOut()
    return loginRedirect(request, 'no-membership', next)
  }

  const fallback = rolePathForMembershipRole(String(memberships[0].role))
  const destination = new URL(safeAuthRedirectPath(next, fallback), request.url)

  return NextResponse.redirect(destination, { status: 303 })
}
