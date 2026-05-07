import type { SchoolRole } from '@/lib/school-launch/role-surfaces'

export const PILOT_SESSION_COOKIE = 'WW_PILOT_SESSION'
export const PILOT_SESSION_TTL_SECONDS = 60 * 60 * 12

const SESSION_VERSION = 1
const encoder = new TextEncoder()
const decoder = new TextDecoder()
const roles = new Set<SchoolRole>(['student', 'teacher', 'admin', 'guardian'])

export interface PilotSession {
  version: number
  role: SchoolRole
  issuedAt: number
  expiresAt: number
}

export function isPilotRole(value: unknown): value is SchoolRole {
  return typeof value === 'string' && roles.has(value as SchoolRole)
}

export function rolePath(role: SchoolRole) {
  return `/${role}`
}

export function roleFromProtectedPath(pathname: string): SchoolRole | null {
  const firstSegment = pathname.split('/').filter(Boolean)[0]
  return isPilotRole(firstSegment) ? firstSegment : null
}

export function getPilotAccessCode() {
  return process.env.PILOT_ACCESS_CODE?.trim() || null
}

function getPilotSessionSecret() {
  return process.env.PILOT_SESSION_SECRET?.trim() || getPilotAccessCode()
}

function bytesToBase64Url(bytes: Uint8Array) {
  let binary = ''
  for (const byte of bytes) {
    binary += String.fromCharCode(byte)
  }

  return btoa(binary).replace(/\+/g, '-').replace(/\//g, '_').replace(/=+$/g, '')
}

function base64UrlToBytes(value: string) {
  const base64 = value.replace(/-/g, '+').replace(/_/g, '/').padEnd(Math.ceil(value.length / 4) * 4, '=')
  const binary = atob(base64)
  const bytes = new Uint8Array(binary.length)

  for (let index = 0; index < binary.length; index += 1) {
    bytes[index] = binary.charCodeAt(index)
  }

  return bytes
}

function textToBase64Url(value: string) {
  return bytesToBase64Url(encoder.encode(value))
}

function base64UrlToText(value: string) {
  return decoder.decode(base64UrlToBytes(value))
}

async function hmacSha256(message: string, secret: string) {
  const key = await crypto.subtle.importKey('raw', encoder.encode(secret), { name: 'HMAC', hash: 'SHA-256' }, false, [
    'sign',
  ])
  const signature = await crypto.subtle.sign('HMAC', key, encoder.encode(message))

  return bytesToBase64Url(new Uint8Array(signature))
}

function signaturesMatch(left: string, right: string) {
  const leftBytes = encoder.encode(left)
  const rightBytes = encoder.encode(right)

  if (leftBytes.length !== rightBytes.length) {
    return false
  }

  let diff = 0
  for (let index = 0; index < leftBytes.length; index += 1) {
    diff |= leftBytes[index] ^ rightBytes[index]
  }

  return diff === 0
}

export async function createPilotSessionCookieValue(role: SchoolRole, now = Date.now()) {
  const secret = getPilotSessionSecret()
  if (!secret) {
    throw new Error('PILOT_SESSION_SECRET or PILOT_ACCESS_CODE is required to create pilot sessions')
  }

  const payload: PilotSession = {
    version: SESSION_VERSION,
    role,
    issuedAt: now,
    expiresAt: now + PILOT_SESSION_TTL_SECONDS * 1000,
  }
  const encodedPayload = textToBase64Url(JSON.stringify(payload))
  const signature = await hmacSha256(encodedPayload, secret)

  return `${encodedPayload}.${signature}`
}

export async function readPilotSessionCookieValue(value: string | undefined, now = Date.now()): Promise<PilotSession | null> {
  const secret = getPilotSessionSecret()
  if (!value || !secret) {
    return null
  }

  const [encodedPayload, signature, extra] = value.split('.')
  if (!encodedPayload || !signature || extra) {
    return null
  }

  const expectedSignature = await hmacSha256(encodedPayload, secret)
  if (!signaturesMatch(signature, expectedSignature)) {
    return null
  }

  try {
    const parsed = JSON.parse(base64UrlToText(encodedPayload)) as Partial<PilotSession>

    if (
      parsed.version !== SESSION_VERSION ||
      !isPilotRole(parsed.role) ||
      typeof parsed.issuedAt !== 'number' ||
      typeof parsed.expiresAt !== 'number' ||
      parsed.expiresAt <= now
    ) {
      return null
    }

    return parsed as PilotSession
  } catch {
    return null
  }
}
