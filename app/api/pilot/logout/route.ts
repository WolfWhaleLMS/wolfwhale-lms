import { NextRequest, NextResponse } from 'next/server'
import { PILOT_SESSION_COOKIE } from '@/lib/pilot/session'

export async function POST(request: NextRequest) {
  const response = NextResponse.redirect(new URL('/login?loggedOut=1', request.url), { status: 303 })

  response.cookies.set(PILOT_SESSION_COOKIE, '', {
    httpOnly: true,
    sameSite: 'lax',
    secure: process.env.NODE_ENV === 'production',
    path: '/',
    maxAge: 0,
  })

  return response
}
