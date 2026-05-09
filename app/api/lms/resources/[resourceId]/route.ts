import { NextRequest, NextResponse } from 'next/server'
import {
  courseResourceAccessDecision,
  isMissingResourceSecurityTableError,
  type CourseResourceSecurityReview,
} from '@/lib/lms/resource-security'
import { getCourseResourceBucket } from '@/lib/lms/resource-storage'
import { LmsMutationError } from '@/lib/lms/mutations'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/admin'
import { createClient } from '@/lib/supabase/server'

type RouteContext = {
  params: Promise<{ resourceId: string }>
}

function notFound() {
  return NextResponse.json({ error: 'resource_not_found' }, { status: 404 })
}

function rows(data: unknown) {
  return (data ?? []) as Record<string, unknown>[]
}

function text(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function scanStatus(value: FormDataEntryValue | null) {
  if (value === 'pending' || value === 'clean' || value === 'blocked' || value === 'error') return value

  throw new LmsMutationError('Invalid resource scan status.', 'invalid_scan_status')
}

function limitedReason(value: FormDataEntryValue | null) {
  const normalized = typeof value === 'string' ? value.trim() : ''
  if (normalized.length > 500) {
    throw new LmsMutationError('Quarantine note must be 500 characters or fewer.', 'quarantine_note_too_long')
  }

  return normalized
}

export async function GET(_request: NextRequest, context: RouteContext) {
  const { resourceId } = await context.params
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return NextResponse.json({ error: 'auth_required' }, { status: 401 })
  }

  const { data: resource, error } = await supabase
    .from('lesson_attachments')
    .select('id,file_path')
    .eq('id', resourceId)
    .single()

  if (error || !resource?.file_path) {
    return notFound()
  }

  const { data: review, error: reviewError } = await supabase
    .from('course_resource_security_reviews')
    .select('scan_status,retention_expires_at,legal_hold')
    .eq('resource_id', resourceId)
    .maybeSingle()

  if (reviewError && !isMissingResourceSecurityTableError(reviewError)) {
    return NextResponse.json({ error: 'resource_security_review_failed' }, { status: 502 })
  }

  const decision = courseResourceAccessDecision(
    reviewError ? null : ((review ?? null) as CourseResourceSecurityReview | null),
    { requireCleanScan: process.env.COURSE_RESOURCE_REQUIRE_CLEAN_SCAN === 'true' }
  )

  if (!decision.allowed) {
    return NextResponse.json({ error: decision.code }, { status: decision.status })
  }

  const storageClient = hasSupabaseAdminEnv() ? createAdminClient() : supabase
  const { data: signed, error: signedError } = await storageClient.storage
    .from(getCourseResourceBucket())
    .createSignedUrl(String(resource.file_path), 300)

  if (signedError || !signed?.signedUrl) {
    return NextResponse.json({ error: 'resource_signing_failed' }, { status: 502 })
  }

  return NextResponse.redirect(signed.signedUrl, { status: 302 })
}

export async function POST(request: NextRequest, context: RouteContext) {
  const { resourceId } = await context.params
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'resource-review', { limit: 20, window: '10 m' })

    const supabase = await createClient()
    const {
      data: { user },
      error: userError,
    } = await supabase.auth.getUser()

    if (userError || !user) {
      throw new LmsMutationError('Authentication is required.', 'auth_required')
    }

    const { data: memberships, error: membershipError } = await supabase
      .from('tenant_memberships')
      .select('tenant_id,role,status')
      .eq('user_id', user.id)
      .eq('status', 'active')
      .in('role', ['admin', 'super_admin'])

    if (membershipError) {
      throw new LmsMutationError(`Unable to verify admin membership: ${membershipError.message}`, 'membership_lookup_failed')
    }

    const adminTenantIds = new Set(rows(memberships).map((membership) => text(membership.tenant_id)).filter(Boolean))
    if (adminTenantIds.size === 0) {
      throw new LmsMutationError('Admin access is required to review course resources.', 'role_required')
    }

    const { data: review, error: reviewError } = await supabase
      .from('course_resource_security_reviews')
      .select('id,tenant_id')
      .eq('resource_id', resourceId)
      .maybeSingle()

    if (reviewError) {
      if (isMissingResourceSecurityTableError(reviewError)) {
        throw new LmsMutationError('Course resource security reviews are not available until the migration is applied.', 'resource_security_unavailable')
      }
      throw new LmsMutationError(`Unable to load resource review: ${reviewError.message}`, 'resource_security_review_failed')
    }

    const reviewRow = review as Record<string, unknown> | null
    const tenantId = text(reviewRow?.tenant_id)
    const reviewId = text(reviewRow?.id)
    if (!reviewId || !tenantId) {
      throw new LmsMutationError('This resource does not have a security review row yet.', 'resource_security_review_required')
    }
    if (!adminTenantIds.has(tenantId)) {
      throw new LmsMutationError('Admin access for this school is required.', 'tenant_mismatch')
    }

    const status = scanStatus(formData.get('scanStatus'))
    const { error: updateError } = await supabase
      .from('course_resource_security_reviews')
      .update({
        scan_status: status,
        legal_hold: formData.get('legalHold') === 'on',
        quarantine_reason: limitedReason(formData.get('quarantineReason')),
        scan_checked_at: status === 'clean' ? new Date().toISOString() : null,
        updated_at: new Date().toISOString(),
      })
      .eq('id', reviewId)

    if (updateError) {
      throw new LmsMutationError(`Unable to update resource review: ${updateError.message}`, 'resource_security_review_failed')
    }

    return lmsRedirect(request, '/admin', { saved: 'resource-review' })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
