import { createHash } from 'node:crypto'

export type CourseResourceScanStatus = 'pending' | 'clean' | 'blocked' | 'error'

export interface CourseResourceSecurityReview {
  scan_status?: unknown
  retention_expires_at?: unknown
  legal_hold?: unknown
}

export interface CourseResourceAccessDecision {
  allowed: boolean
  code: string
  status: number
}

const defaultTenantQuotaBytes = 10 * 1024 * 1024 * 1024
const defaultCourseQuotaBytes = 2 * 1024 * 1024 * 1024
const defaultRetentionDays = 7 * 365

function configuredPositiveInteger(name: string, fallback: number) {
  const value = Number(process.env[name])

  return Number.isInteger(value) && value > 0 ? value : fallback
}

export function courseResourceTenantQuotaBytes() {
  return configuredPositiveInteger('COURSE_RESOURCE_TENANT_QUOTA_BYTES', defaultTenantQuotaBytes)
}

export function courseResourceCourseQuotaBytes() {
  return configuredPositiveInteger('COURSE_RESOURCE_COURSE_QUOTA_BYTES', defaultCourseQuotaBytes)
}

export function courseResourceRetentionDays() {
  return configuredPositiveInteger('COURSE_RESOURCE_RETENTION_DAYS', defaultRetentionDays)
}

export function courseResourceRetentionExpiresAt(now = new Date(), retentionDays = courseResourceRetentionDays()) {
  return new Date(now.getTime() + retentionDays * 24 * 60 * 60 * 1000).toISOString()
}

export async function sha256ForUploadFile(file: File) {
  const uploadFile = file as File & {
    arrayBuffer?: () => Promise<ArrayBuffer>
    text?: () => Promise<string>
  }
  if (typeof uploadFile.arrayBuffer === 'function') {
    return createHash('sha256').update(Buffer.from(await uploadFile.arrayBuffer())).digest('hex')
  }
  if (typeof uploadFile.text === 'function') {
    return createHash('sha256').update(Buffer.from(await uploadFile.text())).digest('hex')
  }

  throw new Error('Uploaded file does not expose readable bytes.')
}

export function courseResourceInitialScanStatus(): CourseResourceScanStatus {
  return process.env.COURSE_RESOURCE_REQUIRE_CLEAN_SCAN === 'true' ? 'pending' : 'clean'
}

export function courseResourceScanProvider() {
  return process.env.COURSE_RESOURCE_SCAN_PROVIDER?.trim() || 'mime-allowlist-sha256'
}

export function isMissingResourceSecurityTableError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const row = error as { code?: unknown; message?: unknown; details?: unknown }
  const code = typeof row.code === 'string' ? row.code : ''
  const message = [row.message, row.details].filter((value) => typeof value === 'string').join(' ')

  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    message.includes('course_resource_security_reviews') ||
    message.includes('Could not find the table')
  )
}

export function courseResourceAccessDecision(
  review: CourseResourceSecurityReview | null,
  options: { requireCleanScan?: boolean; now?: Date } = {}
): CourseResourceAccessDecision {
  if (!review) {
    return options.requireCleanScan
      ? { allowed: false, code: 'resource_security_review_required', status: 423 }
      : { allowed: true, code: 'resource_security_review_missing_allowed', status: 200 }
  }

  const legalHold = review.legal_hold === true
  const retentionExpiresAt = typeof review.retention_expires_at === 'string' ? review.retention_expires_at : ''
  const expiresAt = retentionExpiresAt ? Date.parse(retentionExpiresAt) : Number.NaN
  const now = options.now ?? new Date()

  if (!legalHold && Number.isFinite(expiresAt) && expiresAt <= now.getTime()) {
    return { allowed: false, code: 'resource_retention_expired', status: 410 }
  }

  const scanStatus = typeof review.scan_status === 'string' ? review.scan_status : 'pending'
  if (scanStatus === 'blocked') {
    return { allowed: false, code: 'resource_quarantined', status: 403 }
  }
  if (scanStatus === 'error') {
    return { allowed: false, code: 'resource_scan_error', status: 423 }
  }
  if (scanStatus !== 'clean' && options.requireCleanScan) {
    return { allowed: false, code: 'resource_scan_pending', status: 423 }
  }

  return { allowed: true, code: 'resource_access_allowed', status: 200 }
}
