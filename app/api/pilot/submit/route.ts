import { NextRequest } from 'next/server'
import { localPathWithParams, localRedirect } from '@/lib/http/redirects'
import { readPilotSessionCookieValue, PILOT_SESSION_COOKIE, rolePath } from '@/lib/pilot/session'
import { submitPilotAssignment } from '@/lib/pilot/data'
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit'

export async function POST(request: NextRequest) {
  const session = await readPilotSessionCookieValue(request.cookies.get(PILOT_SESSION_COOKIE)?.value)
  const formData = await request.formData()
  const content = String(formData.get('content') ?? '')

  if (!session) {
    return localRedirect(localPathWithParams('/login', { next: '/student' }), 303)
  }

  const rateLimit = await checkRateLimit({ id: 'pilot:submit', limit: 20, window: '1 m' }, rateLimitKey(request, [session.role]))
  if (!rateLimit.success) {
    return localRedirect(localPathWithParams(rolePath(session.role), { error: 'rate_limited' }), 303)
  }

  const result = submitPilotAssignment({
    role: session.role,
    userId: 'student-1',
    content,
  })

  const params: Record<string, string | undefined> = {}
  if (!result.ok) {
    params.error = result.error
  }

  return localRedirect(localPathWithParams(rolePath(session.role), params), 303)
}
