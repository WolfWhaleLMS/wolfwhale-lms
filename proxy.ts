import { createServerClient } from '@supabase/ssr'
import { NextResponse, type NextRequest } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'

// ---------------------------------------------------------------------------
// Route definitions
// ---------------------------------------------------------------------------

const PUBLIC_PATHS = new Set([
  '/',
  '/login',
  '/signup',
  '/forgot-password',
  '/reset-password',
  '/privacy',
  '/terms',
  '/help',
  '/info',
])

const PUBLIC_PREFIXES = [
  '/auth/callback',
  '/verify/',
  '/tools/',
  '/catalog/',
  '/api/webhooks/',
  '/api/health',
]

const PROTECTED_PREFIXES = [
  '/dashboard',
  '/student',
  '/teacher',
  '/parent',
  '/admin',
  '/messaging',
  '/notifications',
  '/calendar',
  '/study-mode',
  '/api/reports',
]

const AUTH_PATHS = new Set(['/login', '/signup'])
const AUTH_RATE_LIMIT_PATHS = new Set(['/login', '/signup', '/forgot-password'])

// Role -> default dashboard path mapping
const ROLE_DASHBOARDS: Record<string, string> = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  parent: '/parent/dashboard',
  admin: '/admin/dashboard',
  super_admin: '/admin/dashboard',
}

// Role -> allowed route prefixes (which /role/* routes can this role access?)
const ROLE_ALLOWED_PREFIXES: Record<string, string[]> = {
  student: ['/student'],
  teacher: ['/teacher'],
  parent: ['/parent'],
  admin: ['/admin'],
  super_admin: ['/admin', '/teacher'], // super_admin gets teacher features too
}

// All role-specific route prefixes
const ROLE_ROUTE_PREFIXES = ['/student', '/teacher', '/parent', '/admin']

// The root domain for production (subdomains are parsed relative to this)
const ROOT_DOMAIN = process.env.NEXT_PUBLIC_ROOT_DOMAIN || 'wolfwhale.ca'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function isPublicRoute(pathname: string): boolean {
  if (PUBLIC_PATHS.has(pathname)) return true
  return PUBLIC_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isProtectedRoute(pathname: string): boolean {
  return PROTECTED_PREFIXES.some((prefix) => pathname.startsWith(prefix))
}

function isAuthPage(pathname: string): boolean {
  return AUTH_PATHS.has(pathname)
}

const TENANT_SLUG_PATTERN = /^[a-z0-9][a-z0-9-]{0,62}[a-z0-9]?$/

function isValidTenantSlug(slug: string): boolean {
  return TENANT_SLUG_PATTERN.test(slug) && !slug.includes('--')
}

function extractTenantSlug(request: NextRequest): string | null {
  const hostname = request.headers.get('host') || ''

  if (
    hostname.startsWith('localhost') ||
    hostname.startsWith('127.0.0.1') ||
    hostname.startsWith('[::1]')
  ) {
    const paramSlug = request.nextUrl.searchParams.get('tenant')
    if (paramSlug && isValidTenantSlug(paramSlug)) return paramSlug

    const headerSlug = request.headers.get('x-tenant-slug')
    if (headerSlug && isValidTenantSlug(headerSlug)) return headerSlug

    return 'demo'
  }

  const host = hostname.split(':')[0]

  if (!host.endsWith(ROOT_DOMAIN)) {
    return null
  }

  const subdomain = host.slice(0, -(ROOT_DOMAIN.length + 1))

  if (!subdomain || subdomain === '') {
    return 'demo'
  }

  if (!isValidTenantSlug(subdomain)) {
    return null
  }

  return subdomain
}

// ---------------------------------------------------------------------------
// Proxy
// ---------------------------------------------------------------------------

export async function proxy(request: NextRequest) {
  const { pathname } = request.nextUrl

  // ------------------------------------------------------------------
  // 1. Tenant extraction from subdomain / hostname
  // ------------------------------------------------------------------
  const tenantSlug = extractTenantSlug(request)

  // Redirect www -> apex domain (strip www)
  if (tenantSlug === 'www') {
    const url = request.nextUrl.clone()
    url.hostname = ROOT_DOMAIN
    url.port = ''
    return NextResponse.redirect(url, 301)
  }

  // ------------------------------------------------------------------
  // 1b. Rate limiting for auth routes (login, signup, forgot-password)
  // ------------------------------------------------------------------
  if (AUTH_RATE_LIMIT_PATHS.has(pathname)) {
    const ip =
      request.headers.get('x-forwarded-for')?.split(',')[0]?.trim() ||
      request.headers.get('x-real-ip') ||
      'unknown'

    const rateLimitResult = await rateLimit(`${ip}:auth`, 'auth')

    if (!rateLimitResult.success) {
      return NextResponse.json(
        { error: 'Too many requests. Please try again later.' },
        {
          status: 429,
          headers: {
            'Retry-After': String(Math.ceil((rateLimitResult.reset - Date.now()) / 1000)),
            'X-RateLimit-Limit': String(rateLimitResult.limit),
            'X-RateLimit-Remaining': String(rateLimitResult.remaining),
            'X-RateLimit-Reset': String(rateLimitResult.reset),
          },
        }
      )
    }
  }

  // ------------------------------------------------------------------
  // 2. Prepare request headers forwarded to downstream handlers
  // ------------------------------------------------------------------
  const requestHeaders = new Headers(request.headers)
  requestHeaders.set('x-pathname', pathname)

  if (tenantSlug) {
    requestHeaders.set('x-tenant-slug', tenantSlug)
  }

  // ------------------------------------------------------------------
  // 3. Early return for public routes (skip expensive auth for most visitors)
  //
  //    Public routes that are NOT auth pages (/login, /signup) need no
  //    authentication at all. Auth pages need a getUser() check only to
  //    redirect already-authenticated users to their dashboard.
  // ------------------------------------------------------------------
  if (isPublicRoute(pathname) && !isAuthPage(pathname)) {
    return NextResponse.next({
      request: { headers: requestHeaders },
    })
  }

  // ------------------------------------------------------------------
  // 4. Supabase session refresh (protected routes + auth pages only)
  //
  //    We use a mutable `response` variable so the Supabase cookie
  //    callback always writes to the *current* response object, even
  //    if we replace it later (e.g. after injecting role headers).
  // ------------------------------------------------------------------
  let response = NextResponse.next({
    request: { headers: requestHeaders },
  })

  const supabase = createServerClient(
    process.env.NEXT_PUBLIC_SUPABASE_URL!,
    process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
    {
      cookies: {
        getAll() {
          return request.cookies.getAll()
        },
        setAll(cookiesToSet) {
          // Always write to the *current* response reference. This is
          // critical because we may swap `response` after the Supabase
          // client is created (see step 6 below).
          cookiesToSet.forEach(({ name, value, options }) => {
            response.cookies.set(name, value, options)
          })
        },
      },
    }
  )

  // IMPORTANT: getUser() both validates and refreshes the JWT.
  const {
    data: { user },
  } = await supabase.auth.getUser()

  // ------------------------------------------------------------------
  // 4b. Auth page redirect: authenticated users on /login or /signup
  //     should be sent to their role-appropriate dashboard.
  // ------------------------------------------------------------------
  if (isAuthPage(pathname)) {
    if (user) {
      if (tenantSlug) {
        const { data: membership } = await supabase
          .from('tenant_memberships')
          .select('role, tenant_id')
          .eq('user_id', user.id)
          .eq('status', 'active')
          .limit(1)
          .maybeSingle()

        if (membership) {
          const dashboardPath =
            ROLE_DASHBOARDS[membership.role] || '/dashboard'
          return NextResponse.redirect(
            new URL(dashboardPath, request.url)
          )
        }
      }

      // Fallback: send to generic dashboard
      return NextResponse.redirect(new URL('/dashboard', request.url))
    }

    return response
  }

  // ------------------------------------------------------------------
  // 5. Protected route -- require authentication (user is null here)
  // ------------------------------------------------------------------
  if (isProtectedRoute(pathname) && !user) {
    const loginUrl = new URL('/login', request.url)
    if (pathname.startsWith('/')) {
      loginUrl.searchParams.set('redirectTo', pathname)
    }
    return NextResponse.redirect(loginUrl)
  }

  // ------------------------------------------------------------------
  // 6. Role-based header injection for authenticated + tenant requests
  //
  //    Only query tenant_memberships when we have both a user AND a
  //    tenant slug. This avoids unnecessary DB calls for unauthenticated
  //    requests or requests without a tenant context.
  // ------------------------------------------------------------------
  if (user && tenantSlug) {
    // Resolve the tenant and the user's role in a single query by
    // joining through the tenant slug on the tenants table.
    const { data: membership } = await supabase
      .from('tenant_memberships')
      .select('role, tenant_id, tenants!inner(slug)')
      .eq('user_id', user.id)
      .eq('tenants.slug', tenantSlug)
      .eq('status', 'active')
      .limit(1)
      .maybeSingle()

    if (membership) {
      // Inject role and tenant ID into request headers so downstream
      // server components and route handlers can read them via
      // headers().get('x-user-role') / headers().get('x-tenant-id').
      requestHeaders.set('x-user-role', membership.role)
      requestHeaders.set('x-tenant-id', membership.tenant_id)

      // ----------------------------------------------------------------
      // 6b. Role-route enforcement
      //     Redirect users who land on the wrong role's routes.
      //     e.g. a teacher visiting /student/* → redirect to /teacher/dashboard
      // ----------------------------------------------------------------
      const isOnRoleSpecificRoute = ROLE_ROUTE_PREFIXES.find((prefix) =>
        pathname.startsWith(prefix)
      )

      if (isOnRoleSpecificRoute) {
        const allowedPrefixes = ROLE_ALLOWED_PREFIXES[membership.role] || []
        const isAllowed = allowedPrefixes.some((prefix) =>
          pathname.startsWith(prefix)
        )

        if (!isAllowed) {
          const dashboardPath =
            ROLE_DASHBOARDS[membership.role] || '/dashboard'
          return NextResponse.redirect(new URL(dashboardPath, request.url))
        }
      }

      // ----------------------------------------------------------------
      // 6c. Redirect generic /dashboard to role-appropriate dashboard
      // ----------------------------------------------------------------
      if (pathname === '/dashboard') {
        const dashboardPath =
          ROLE_DASHBOARDS[membership.role] || '/student/dashboard'
        return NextResponse.redirect(new URL(dashboardPath, request.url))
      }

      // Build a fresh response with the updated headers. Because the
      // Supabase `setAll` callback captures `response` by reference
      // (not by value), updating this variable ensures that any
      // subsequent cookie writes from Supabase land on the new object.
      response = NextResponse.next({
        request: { headers: requestHeaders },
      })

      // Re-trigger cookie sync so the refreshed session cookies are
      // applied to the newly created response object.
      // Supabase's setAll was already called during getUser(), but
      // those writes went to the previous response. Calling getUser()
      // again would be wasteful; instead we force the cookie setter
      // to run by calling getSession() which reads from cache.
      await supabase.auth.getSession()
    } else if (user && isProtectedRoute(pathname)) {
      // User is authenticated but has no membership in this tenant.
      // Redirect to login with an error message.
      const loginUrl = new URL('/login', request.url)
      loginUrl.searchParams.set('error', 'no_membership')
      return NextResponse.redirect(loginUrl)
    }
  }

  return response
}

// ---------------------------------------------------------------------------
// Config: match all routes except static assets
// ---------------------------------------------------------------------------

export const config = {
  matcher: [
    /*
     * Match all request paths except:
     * - _next/static  (static files)
     * - _next/image   (image optimization files)
     * - favicon.ico
     * - Common static file extensions (svg, png, jpg, jpeg, gif, webp,
     *   ico, woff, woff2, ttf, eot)
     */
    '/((?!_next/static|_next/image|favicon.ico|.*\\.(?:svg|png|jpg|jpeg|gif|webp|ico|woff|woff2|ttf|eot)$).*)',
  ],
}
