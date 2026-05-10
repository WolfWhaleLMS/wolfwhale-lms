import { NextResponse } from 'next/server'

const LOCAL_REDIRECT_ORIGIN = 'https://wolfwhale.local'
const REDIRECT_STATUSES = new Set([301, 302, 303, 307, 308])
const ALLOWED_REDIRECT_PROTOCOLS = new Set(['http', 'https'])

interface RedirectRequest {
  headers: Headers
  url: string
}

function assertRedirectStatus(status: number) {
  if (!REDIRECT_STATUSES.has(status)) {
    throw new RangeError(`Invalid redirect status: ${status}`)
  }
}

export function localRedirectLocation(location: string) {
  if (!location.startsWith('/') || location.startsWith('//') || /[\r\n]/.test(location)) {
    throw new Error(`Unsafe local redirect location: ${location}`)
  }

  let decodedLocation = location
  try {
    decodedLocation = decodeURIComponent(location)
  } catch {
    throw new Error(`Unsafe local redirect location: ${location}`)
  }

  if (decodedLocation.includes('..')) {
    throw new Error(`Unsafe local redirect location: ${location}`)
  }

  const url = new URL(location, LOCAL_REDIRECT_ORIGIN)

  if (url.origin !== LOCAL_REDIRECT_ORIGIN) {
    throw new Error(`Unsafe local redirect location: ${location}`)
  }

  return `${url.pathname}${url.search}${url.hash}`
}

export function localPathWithParams(pathname: string, params: Record<string, string | null | undefined>) {
  const url = new URL(localRedirectLocation(pathname), LOCAL_REDIRECT_ORIGIN)

  for (const [key, value] of Object.entries(params)) {
    if (value) {
      url.searchParams.set(key, value)
    }
  }

  return `${url.pathname}${url.search}${url.hash}`
}

function firstHeaderValue(value: string | null) {
  return value?.split(',')[0]?.trim() || null
}

export function absoluteLocalRedirectUrl(request: RedirectRequest, location: string) {
  const requestUrl = new URL(request.url)
  const forwardedProto = firstHeaderValue(request.headers.get('x-forwarded-proto'))?.replace(/:$/, '')
  const protocol = forwardedProto && ALLOWED_REDIRECT_PROTOCOLS.has(forwardedProto) ? `${forwardedProto}:` : requestUrl.protocol
  const host = firstHeaderValue(request.headers.get('x-forwarded-host')) ?? request.headers.get('host') ?? requestUrl.host

  if (!host || /[\r\n/]/.test(host)) {
    throw new Error('Unsafe redirect host')
  }

  return new URL(localRedirectLocation(location), `${protocol}//${host}`)
}

export function localRedirect(location: string, init: number | ResponseInit = 307) {
  const status = typeof init === 'number' ? init : (init.status ?? 307)
  assertRedirectStatus(status)

  const initObject = typeof init === 'object' ? init : {}
  const headers = new Headers(initObject.headers)
  headers.set('Location', localRedirectLocation(location))

  return new NextResponse(null, {
    ...initObject,
    headers,
    status,
  })
}
