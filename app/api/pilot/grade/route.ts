import { NextRequest } from 'next/server'
import { localPathWithParams, localRedirect } from '@/lib/http/redirects'
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
    return localRedirect(localPathWithParams('/login', { next: '/teacher' }), 303)
  }

  const rateLimit = await checkRateLimit({ id: 'pilot:grade', limit: 20, window: '1 m' }, rateLimitKey(request, [session.role]))
  if (!rateLimit.success) {
    return localRedirect(localPathWithParams(rolePath(session.role), { error: 'rate_limited' }), 303)
  }

  const result = gradePilotSubmission({
    role: session.role,
    teacherId: 'teacher-1',
    studentId,
    score,
    feedback,
  })

  const params: Record<string, string | undefined> = {}
  if (!result.ok) {
    params.error = result.error
  }

  return localRedirect(localPathWithParams(rolePath(session.role), params), 303)
}
