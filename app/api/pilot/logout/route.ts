import { localRedirect } from '@/lib/http/redirects'
import { PILOT_SESSION_COOKIE } from '@/lib/pilot/session'

export async function POST() {
  const response = localRedirect('/login?loggedOut=1', 303)

  response.cookies.set(PILOT_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}
