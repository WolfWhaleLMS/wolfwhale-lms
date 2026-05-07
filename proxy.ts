import { NextRequest, NextResponse } from 'next/server'
import { PILOT_SESSION_COOKIE, readPilotSessionCookieValue, roleFromProtectedPath, rolePath } from '@/lib/pilot/session'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/env'
import { updateSupabaseSession } from '@/lib/supabase/proxy'

const PROTECTED_ROLE_PREFIXES = ['/student', '/teacher', '/admin', '/guardian']

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl
  const isProtectedRoleRoute = PROTECTED_ROLE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (!isProtectedRoleRoute) {
    return NextResponse.next()
  }

  const session = await readPilotSessionCookieValue(request.cookies.get(PILOT_SESSION_COOKIE)?.value)
  const requestedRole = roleFromProtectedPath(pathname)

  if (session && requestedRole === session.role) {
    return NextResponse.next()
  }

  if (session) {
    return NextResponse.redirect(new URL(rolePath(session.role), request.url))
  }

  if (hasSupabaseBrowserEnv()) {
    const { claims, response } = await updateSupabaseSession(request)

    if (claims) {
      return response
    }
  }

  const loginUrl = new URL('/login', request.url)
  loginUrl.searchParams.set('next', pathname)

  return NextResponse.redirect(loginUrl)
}

export const config = {
  matcher: ['/student/:path*', '/teacher/:path*', '/admin/:path*', '/guardian/:path*'],
}
