import { NextRequest } from 'next/server'
import { localPathWithParams, localRedirect } from '@/lib/http/redirects'
import {
  PILOT_SESSION_COOKIE,
  PILOT_SESSION_TTL_SECONDS,
  createPilotSessionCookieValue,
  getPilotAccessCode,
  isPilotRole,
  rolePath,
} from '@/lib/pilot/session'
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit'

function loginRedirect(_request: NextRequest, error: string) {
  return localRedirect(localPathWithParams('/login', { error }), 303)
}

function destinationFor(role: string, requestedNext: string | null) {
  if (isPilotRole(role) && requestedNext?.startsWith(rolePath(role))) {
    return requestedNext
  }

  return isPilotRole(role) ? rolePath(role) : '/login'
}

export async function POST(request: NextRequest) {
  const configuredCode = getPilotAccessCode()
  if (!configuredCode) {
    return loginRedirect(request, 'not-configured')
  }

  const formData = await request.formData()
  const role = String(formData.get('role') ?? '')
  const code = String(formData.get('code') ?? '')
  const requestedNext = String(formData.get('next') ?? '') || null
  const rateLimit = await checkRateLimit({ id: 'pilot:login', limit: 10, window: '10 m' }, rateLimitKey(request, [role]))

  if (!rateLimit.success) {
    return loginRedirect(request, 'rate-limited')
  }

  if (!isPilotRole(role)) {
    return loginRedirect(request, 'invalid-role')
  }

  if (code !== configuredCode) {
    return loginRedirect(request, 'invalid-code')
  }

  const response = localRedirect(destinationFor(role, requestedNext), 303)
  const cookieValue = await createPilotSessionCookieValue(role)

  response.cookies.set(PILOT_SESSION_COOKIE, cookieValue, {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: PILOT_SESSION_TTL_SECONDS,
  })

  return response
}
