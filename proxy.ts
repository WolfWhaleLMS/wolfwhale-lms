import { NextRequest, NextResponse } from 'next/server'
import { absoluteLocalRedirectUrl, localPathWithParams } from '@/lib/http/redirects'
import { PILOT_SESSION_COOKIE, readPilotSessionCookieValue, roleFromProtectedPath, rolePath } from '@/lib/pilot/session'
import { hasSupabaseBrowserEnv } from '@/lib/supabase/env'
import { updateSupabaseSession } from '@/lib/supabase/proxy'

const PROTECTED_ROLE_PREFIXES = ['/student', '/teacher', '/admin', '/guardian']
const CANONICAL_ROLE_PATHS: Record<string, string> = {
  '/student/dashboard': '/student',
}

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  if (CANONICAL_ROLE_PATHS[pathname]) {
    return NextResponse.redirect(absoluteLocalRedirectUrl(request, CANONICAL_ROLE_PATHS[pathname]))
  }

  const isProtectedRoleRoute = PROTECTED_ROLE_PREFIXES.some(
    (prefix) => pathname === prefix || pathname.startsWith(`${prefix}/`)
  )

  if (!isProtectedRoleRoute) {
    return NextResponse.next()
  }

  const requestedRole = roleFromProtectedPath(pathname)

  if (hasSupabaseBrowserEnv()) {
    const { claims, response } = await updateSupabaseSession(request)

    if (claims) {
      return response
    }

    return NextResponse.redirect(absoluteLocalRedirectUrl(request, localPathWithParams('/login', { next: pathname })))
  }

  const session = await readPilotSessionCookieValue(request.cookies.get(PILOT_SESSION_COOKIE)?.value)

  if (session && requestedRole === session.role) {
    return NextResponse.next()
  }

  if (session) {
    return NextResponse.redirect(absoluteLocalRedirectUrl(request, rolePath(session.role)))
  }

  return NextResponse.redirect(absoluteLocalRedirectUrl(request, localPathWithParams('/login', { next: pathname })))
}

export const config = {
  matcher: ['/student/:path*', '/teacher/:path*', '/admin/:path*', '/guardian/:path*'],
}
