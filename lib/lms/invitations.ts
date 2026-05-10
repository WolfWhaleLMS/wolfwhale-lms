import type { SupabaseClient } from '@supabase/supabase-js'
import { LmsMutationError } from '@/lib/lms/mutations'

type Row = Record<string, unknown>

const inviteRoles = new Set(['student', 'teacher', 'parent', 'admin'])

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
}

function optionalLimitedText(value: unknown, maxLength: number) {
  const normalized = text(value)

  return normalized.length > maxLength ? normalized.slice(0, maxLength) : normalized
}

function id(value: unknown, field: string) {
  const normalized = text(value)
  if (!normalized) {
    throw new LmsMutationError(`${field} is required`, `missing_${field}`)
  }

  return normalized
}

function rows(data: unknown) {
  return (data ?? []) as Row[]
}

function normalizeInviteRole(value: unknown) {
  const role = text(value).toLowerCase()
  if (!inviteRoles.has(role)) {
    throw new LmsMutationError('Role must be student, teacher, parent, or admin.', 'invalid_invite_role')
  }

  return role as 'student' | 'teacher' | 'parent' | 'admin'
}

export function normalizeInviteDraft(input: {
  email: unknown
  firstName?: unknown
  lastName?: unknown
  role: unknown
  gradeLevel?: unknown
}) {
  const email = text(input.email).toLowerCase()
  if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) {
    throw new LmsMutationError('A valid email address is required.', 'invalid_invite_email')
  }

  return {
    email,
    firstName: optionalLimitedText(input.firstName, 100),
    lastName: optionalLimitedText(input.lastName, 100),
    role: normalizeInviteRole(input.role),
    gradeLevel: optionalLimitedText(input.gradeLevel, 50),
  }
}

async function requireSchoolAdmin(supabase: SupabaseClient) {
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    throw new LmsMutationError('Authentication is required.', 'auth_required')
  }

  const { data: memberships, error: membershipError } = await supabase
    .from('tenant_memberships')
    .select('tenant_id,user_id,role,status')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .in('role', ['admin', 'super_admin'])

  if (membershipError) {
    throw new LmsMutationError(`Unable to verify school admin membership: ${membershipError.message}`, 'membership_lookup_failed')
  }

  const membership = rows(memberships)[0]
  if (!membership) {
    throw new LmsMutationError('Only school admins can invite users.', 'admin_role_required')
  }

  return {
    userId: user.id,
    tenantId: id(membership.tenant_id, 'tenant_id'),
  }
}

export async function inviteUserToSchool(
  supabase: SupabaseClient,
  input: { email: unknown; firstName?: unknown; lastName?: unknown; role: unknown; gradeLevel?: unknown }
) {
  const { createAdminClient, hasSupabaseAdminEnv } = await import('@/lib/supabase/admin')

  if (!hasSupabaseAdminEnv()) {
    throw new LmsMutationError('SUPABASE_SERVICE_ROLE_KEY is required for direct invitations.', 'service_role_required')
  }

  const adminContext = await requireSchoolAdmin(supabase)
  const draft = normalizeInviteDraft(input)
  const admin = createAdminClient()
  const invite = await admin.auth.admin.inviteUserByEmail(draft.email, {
    data: {
      first_name: draft.firstName,
      last_name: draft.lastName,
      role: draft.role,
      tenant_id: adminContext.tenantId,
      grade_level: draft.gradeLevel,
    },
  })

  if (invite.error) {
    throw new LmsMutationError(`Unable to invite ${draft.email}: ${invite.error.message}`, 'invite_failed')
  }

  const invitedUserId = id(invite.data.user?.id, 'user_id')

  const profile = await admin.from('profiles').upsert(
    {
      id: invitedUserId,
      first_name: draft.firstName,
      last_name: draft.lastName,
      grade_level: draft.gradeLevel || null,
    },
    { onConflict: 'id' }
  )
  if (profile.error) {
    throw new LmsMutationError(`Unable to save profile for ${draft.email}: ${profile.error.message}`, 'profile_upsert_failed')
  }

  const membership = await admin.from('tenant_memberships').upsert(
    {
      tenant_id: adminContext.tenantId,
      user_id: invitedUserId,
      role: draft.role,
      status: 'active',
      invited_at: new Date().toISOString(),
      invited_by: adminContext.userId,
    },
    { onConflict: 'tenant_id,user_id' }
  )
  if (membership.error) {
    throw new LmsMutationError(`Unable to save membership for ${draft.email}: ${membership.error.message}`, 'membership_upsert_failed')
  }

  await admin.from('audit_logs').insert({
    tenant_id: adminContext.tenantId,
    user_id: adminContext.userId,
    action: 'user.invited',
    resource_type: 'tenant_membership',
    resource_id: invitedUserId,
    details: {
      email: draft.email,
      role: draft.role,
      grade_level: draft.gradeLevel,
    },
  })

  return {
    invitedUserId,
    role: draft.role,
  }
}
