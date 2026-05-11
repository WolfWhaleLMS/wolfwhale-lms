import type { SupabaseClient } from '@supabase/supabase-js'
import { LmsMutationError } from '@/lib/lms/mutations'

type Row = Record<string, unknown>

const inviteRoles = new Set(['student', 'teacher', 'parent', 'admin'])
const membershipStatuses = new Set(['active', 'inactive'])

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

export function normalizeMembershipStatusDraft(input: { userId: unknown; status: unknown }) {
  const userId = id(input.userId, 'user_id')
  const status = text(input.status).toLowerCase()
  if (!membershipStatuses.has(status)) {
    throw new LmsMutationError('Status must be active or inactive.', 'invalid_membership_status')
  }

  return {
    userId,
    status: status as 'active' | 'inactive',
  }
}

export function normalizeMembershipRoleDraft(input: { userId: unknown; role: unknown }) {
  return {
    userId: id(input.userId, 'user_id'),
    role: normalizeInviteRole(input.role),
  }
}

export function normalizeInviteResendDraft(input: { userId: unknown }) {
  return {
    userId: id(input.userId, 'user_id'),
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

export async function resendSchoolInvitation(supabase: SupabaseClient, input: { userId: unknown }) {
  const { createAdminClient, hasSupabaseAdminEnv } = await import('@/lib/supabase/admin')

  if (!hasSupabaseAdminEnv()) {
    throw new LmsMutationError('SUPABASE_SERVICE_ROLE_KEY is required for invitation resends.', 'service_role_required')
  }

  const adminContext = await requireSchoolAdmin(supabase)
  const draft = normalizeInviteResendDraft(input)
  const admin = createAdminClient()
  const { data: currentRows, error: membershipError } = await admin
    .from('tenant_memberships')
    .select('tenant_id,user_id,role,status')
    .eq('tenant_id', adminContext.tenantId)
    .eq('user_id', draft.userId)

  if (membershipError) {
    throw new LmsMutationError(`Unable to load membership: ${membershipError.message}`, 'membership_lookup_failed')
  }

  const membership = rows(currentRows)[0]
  if (!membership) {
    throw new LmsMutationError('School membership was not found.', 'membership_not_found')
  }

  const userResult = await admin.auth.admin.getUserById(draft.userId)
  if (userResult.error) {
    throw new LmsMutationError(`Unable to load invited user: ${userResult.error.message}`, 'user_lookup_failed')
  }

  const email = text(userResult.data.user?.email).toLowerCase()
  if (!email) {
    throw new LmsMutationError('Invited user has no email address.', 'missing_invite_email')
  }

  const role = text(membership.role)
  const invite = await admin.auth.admin.inviteUserByEmail(email, {
    data: {
      role,
      tenant_id: adminContext.tenantId,
    },
  })

  if (invite.error) {
    throw new LmsMutationError(`Unable to resend invite to ${email}: ${invite.error.message}`, 'invite_resend_failed')
  }

  const { error: updateError } = await admin
    .from('tenant_memberships')
    .update({
      invited_at: new Date().toISOString(),
      invited_by: adminContext.userId,
    })
    .eq('tenant_id', adminContext.tenantId)
    .eq('user_id', draft.userId)

  if (updateError) {
    throw new LmsMutationError(`Unable to update invite timestamp: ${updateError.message}`, 'membership_invite_update_failed')
  }

  await admin.from('audit_logs').insert({
    tenant_id: adminContext.tenantId,
    user_id: adminContext.userId,
    action: 'user.invite_resent',
    resource_type: 'tenant_membership',
    resource_id: draft.userId,
    details: {
      email,
      role,
      status: text(membership.status, 'active'),
    },
  })

  return {
    invitedUserId: draft.userId,
    email,
    role,
  }
}

export async function updateSchoolMembershipStatus(
  supabase: SupabaseClient,
  input: { userId: unknown; status: unknown }
) {
  const { createAdminClient, hasSupabaseAdminEnv } = await import('@/lib/supabase/admin')

  if (!hasSupabaseAdminEnv()) {
    throw new LmsMutationError('SUPABASE_SERVICE_ROLE_KEY is required for membership status changes.', 'service_role_required')
  }

  const adminContext = await requireSchoolAdmin(supabase)
  const draft = normalizeMembershipStatusDraft(input)
  if (draft.userId === adminContext.userId && draft.status === 'inactive') {
    throw new LmsMutationError('Admins cannot deactivate their own school membership.', 'self_deactivation_not_allowed')
  }

  const admin = createAdminClient()
  const { data: currentRows, error: lookupError } = await admin
    .from('tenant_memberships')
    .select('tenant_id,user_id,role,status')
    .eq('tenant_id', adminContext.tenantId)
    .eq('user_id', draft.userId)

  if (lookupError) {
    throw new LmsMutationError(`Unable to load membership: ${lookupError.message}`, 'membership_lookup_failed')
  }

  const currentMembership = rows(currentRows)[0]
  if (!currentMembership) {
    throw new LmsMutationError('School membership was not found.', 'membership_not_found')
  }

  const role = text(currentMembership.role)
  const previousStatus = text(currentMembership.status, 'active')
  if (role === 'super_admin' && draft.status === 'inactive') {
    throw new LmsMutationError('Super admin memberships cannot be deactivated from school operations.', 'protected_membership')
  }

  const { data: updatedRows, error: updateError } = await admin
    .from('tenant_memberships')
    .update({ status: draft.status })
    .eq('tenant_id', adminContext.tenantId)
    .eq('user_id', draft.userId)
    .select('user_id,role,status')

  if (updateError) {
    throw new LmsMutationError(`Unable to update membership status: ${updateError.message}`, 'membership_status_update_failed')
  }

  const updatedMembership = rows(updatedRows)[0]
  if (!updatedMembership) {
    throw new LmsMutationError('School membership was not updated.', 'membership_not_found')
  }

  await admin.from('audit_logs').insert({
    tenant_id: adminContext.tenantId,
    user_id: adminContext.userId,
    action: draft.status === 'active' ? 'user.reactivated' : 'user.deactivated',
    resource_type: 'tenant_membership',
    resource_id: draft.userId,
    details: {
      role,
      previous_status: previousStatus,
      status: draft.status,
    },
  })

  return {
    userId: draft.userId,
    role,
    status: draft.status,
  }
}

export async function updateSchoolMembershipRole(
  supabase: SupabaseClient,
  input: { userId: unknown; role: unknown }
) {
  const { createAdminClient, hasSupabaseAdminEnv } = await import('@/lib/supabase/admin')

  if (!hasSupabaseAdminEnv()) {
    throw new LmsMutationError('SUPABASE_SERVICE_ROLE_KEY is required for membership role changes.', 'service_role_required')
  }

  const adminContext = await requireSchoolAdmin(supabase)
  const draft = normalizeMembershipRoleDraft(input)
  if (draft.userId === adminContext.userId) {
    throw new LmsMutationError('Admins cannot change their own school role.', 'self_role_change_not_allowed')
  }

  const admin = createAdminClient()
  const { data: currentRows, error: lookupError } = await admin
    .from('tenant_memberships')
    .select('tenant_id,user_id,role,status')
    .eq('tenant_id', adminContext.tenantId)
    .eq('user_id', draft.userId)

  if (lookupError) {
    throw new LmsMutationError(`Unable to load membership: ${lookupError.message}`, 'membership_lookup_failed')
  }

  const currentMembership = rows(currentRows)[0]
  if (!currentMembership) {
    throw new LmsMutationError('School membership was not found.', 'membership_not_found')
  }

  const previousRole = text(currentMembership.role)
  if (previousRole === 'super_admin') {
    throw new LmsMutationError('Super admin memberships cannot be changed from school operations.', 'protected_membership')
  }

  const { data: updatedRows, error: updateError } = await admin
    .from('tenant_memberships')
    .update({ role: draft.role })
    .eq('tenant_id', adminContext.tenantId)
    .eq('user_id', draft.userId)
    .select('user_id,role,status')

  if (updateError) {
    throw new LmsMutationError(`Unable to update membership role: ${updateError.message}`, 'membership_role_update_failed')
  }

  const updatedMembership = rows(updatedRows)[0]
  if (!updatedMembership) {
    throw new LmsMutationError('School membership was not updated.', 'membership_not_found')
  }

  await admin.from('audit_logs').insert({
    tenant_id: adminContext.tenantId,
    user_id: adminContext.userId,
    action: 'user.role_changed',
    resource_type: 'tenant_membership',
    resource_id: draft.userId,
    details: {
      previous_role: previousRole,
      role: draft.role,
      status: text(currentMembership.status, 'active'),
    },
  })

  return {
    userId: draft.userId,
    previousRole,
    role: draft.role,
  }
}
