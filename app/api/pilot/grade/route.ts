import { NextRequest, NextResponse } from 'next/server'
import { PILOT_SESSION_COOKIE, readPilotSessionCookieValue, rolePath } from '@/lib/pilot/session'
import { gradePilotSubmission } from '@/lib/pilot/data'
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit'

export async function POST(request: NextRequest) {
  const session = await readPilotSessionCookieValue(request.cookies.get(PILOT_SESSION_COOKIE)?.value)
  const formData = await request.formData()
  const score = Number(formData.get('score'))
  const feedback = String(formData.get('feedback') ?? '')
  const studentId = String(formData.get('studentId') ?? '')

  if (!session) {
    return NextResponse.redirect(new URL('/login?next=%2Fteacher', request.url), { status: 303 })
  }

  const rateLimit = await checkRateLimit({ id: 'pilot:grade', limit: 20, window: '1 m' }, rateLimitKey(request, [session.role]))
  if (!rateLimit.success) {
    return NextResponse.redirect(new URL(`${rolePath(session.role)}?error=rate_limited`, request.url), { status: 303 })
  }

  const result = gradePilotSubmission({
    role: session.role,
    teacherId: 'teacher-1',
    studentId,
    score,
    feedback,
  })

  const destination = new URL(rolePath(session.role), request.url)
  if (!result.ok) {
    destination.searchParams.set('error', result.error)
  }

  return NextResponse.redirect(destination, { status: 303 })
}
