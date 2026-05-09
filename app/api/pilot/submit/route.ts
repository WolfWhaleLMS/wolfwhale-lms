import { NextRequest, NextResponse } from 'next/server'
import { readPilotSessionCookieValue, PILOT_SESSION_COOKIE, rolePath } from '@/lib/pilot/session'
import { submitPilotAssignment } from '@/lib/pilot/data'
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit'

export async function POST(request: NextRequest) {
  const session = await readPilotSessionCookieValue(request.cookies.get(PILOT_SESSION_COOKIE)?.value)
  const formData = await request.formData()
  const content = String(formData.get('content') ?? '')

  if (!session) {
    return NextResponse.redirect(new URL('/login?next=%2Fstudent', request.url), { status: 303 })
  }

  const rateLimit = await checkRateLimit({ id: 'pilot:submit', limit: 20, window: '1 m' }, rateLimitKey(request, [session.role]))
  if (!rateLimit.success) {
    return NextResponse.redirect(new URL(`${rolePath(session.role)}?error=rate_limited`, request.url), { status: 303 })
  }

  const result = submitPilotAssignment({
    role: session.role,
    userId: 'student-1',
    content,
  })

  const destination = new URL(rolePath(session.role), request.url)
  if (!result.ok) {
    destination.searchParams.set('error', result.error)
  }

  return NextResponse.redirect(destination, { status: 303 })
}
