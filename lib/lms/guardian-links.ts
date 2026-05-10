import type { SupabaseClient } from '@supabase/supabase-js'
import { LmsMutationError } from '@/lib/lms/mutations'

type Row = Record<string, unknown>
type GuardianRelationship = 'mother' | 'father' | 'guardian' | 'grandparent' | 'other'

const relationships = new Set<GuardianRelationship>(['mother', 'father', 'guardian', 'grandparent', 'other'])

function text(value: unknown, fallback = '') {
  return typeof value === 'string' && value.trim() ? value.trim() : fallback
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

function normalizeRelationship(value: unknown): GuardianRelationship {
  const relationship = text(value, 'guardian').toLowerCase()

  return relationships.has(relationship as GuardianRelationship) ? (relationship as GuardianRelationship) : 'guardian'
}

export function normalizeGuardianLinkDraft(input: { studentId: unknown; guardianId: unknown; relationship?: unknown }) {
  const studentId = id(input.studentId, 'student_id')
  const guardianId = id(input.guardianId, 'guardian_id')

  if (studentId === guardianId) {
    throw new LmsMutationError('A guardian cannot be linked to themself as a student.', 'self_guardian_link')
  }

  return {
    studentId,
    guardianId,
    relationship: normalizeRelationship(input.relationship),
  }
}

export function normalizeGuardianUnlinkDraft(input: { studentId: unknown; guardianId: unknown }) {
  const studentId = id(input.studentId, 'student_id')
  const guardianId = id(input.guardianId, 'guardian_id')

  if (studentId === guardianId) {
    throw new LmsMutationError('A guardian cannot be linked to themself as a student.', 'self_guardian_link')
  }

  return {
    studentId,
    guardianId,
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
    throw new LmsMutationError('Only school admins can link guardians.', 'admin_role_required')
  }

  return {
    userId: user.id,
    tenantId: id(membership.tenant_id, 'tenant_id'),
  }
}

async function requireTenantRole(
  supabase: SupabaseClient,
  input: { tenantId: string; userId: string; role: 'student' | 'parent'; errorCode: string; label: string }
) {
  const { data, error } = await supabase
    .from('tenant_memberships')
    .select('tenant_id,user_id,role,status')
    .eq('tenant_id', input.tenantId)
    .eq('user_id', input.userId)
    .eq('role', input.role)
    .eq('status', 'active')
    .limit(1)

  if (error) {
    throw new LmsMutationError(`Unable to verify ${input.label}: ${error.message}`, 'membership_lookup_failed')
  }

  if (rows(data).length === 0) {
    throw new LmsMutationError(`${input.label} is not active in this school.`, input.errorCode)
  }
}

export async function linkGuardianToStudent(
  supabase: SupabaseClient,
  input: { studentId: unknown; guardianId: unknown; relationship?: unknown }
) {
  const admin = await requireSchoolAdmin(supabase)
  const draft = normalizeGuardianLinkDraft(input)

  await requireTenantRole(supabase, {
    tenantId: admin.tenantId,
    userId: draft.studentId,
    role: 'student',
    errorCode: 'student_membership_required',
    label: 'Student',
  })
  await requireTenantRole(supabase, {
    tenantId: admin.tenantId,
    userId: draft.guardianId,
    role: 'parent',
    errorCode: 'guardian_membership_required',
    label: 'Guardian',
  })

  const { data: link, error: linkError } = await supabase
    .from('student_parents')
    .upsert(
      {
        tenant_id: admin.tenantId,
        student_id: draft.studentId,
        parent_id: draft.guardianId,
        relationship: draft.relationship,
        status: 'active',
      },
      { onConflict: 'tenant_id,student_id,parent_id' }
    )
    .select('id')
    .single()

  if (linkError) {
    throw new LmsMutationError(`Unable to link guardian: ${linkError.message}`, 'guardian_link_failed')
  }

  const linkId = id((link as Row | null)?.id, 'student_parent_id')

  await supabase.from('audit_logs').insert({
    tenant_id: admin.tenantId,
    user_id: admin.userId,
    action: 'guardian.linked',
    resource_type: 'student_parent',
    resource_id: linkId,
    details: {
      student_id: draft.studentId,
      guardian_id: draft.guardianId,
      relationship: draft.relationship,
    },
  })

  return {
    linkId,
    studentId: draft.studentId,
    guardianId: draft.guardianId,
  }
}

export async function unlinkGuardianFromStudent(
  supabase: SupabaseClient,
  input: { studentId: unknown; guardianId: unknown }
) {
  const admin = await requireSchoolAdmin(supabase)
  const draft = normalizeGuardianUnlinkDraft(input)

  const { data: links, error: linkError } = await supabase
    .from('student_parents')
    .update({ status: 'inactive' })
    .eq('tenant_id', admin.tenantId)
    .eq('student_id', draft.studentId)
    .eq('parent_id', draft.guardianId)
    .eq('status', 'active')
    .select('id')

  if (linkError) {
    throw new LmsMutationError(`Unable to unlink guardian: ${linkError.message}`, 'guardian_unlink_failed')
  }

  const link = rows(links)[0]
  if (!link) {
    throw new LmsMutationError('Active guardian link was not found.', 'guardian_link_not_found')
  }

  const linkId = id(link.id, 'student_parent_id')

  await supabase.from('audit_logs').insert({
    tenant_id: admin.tenantId,
    user_id: admin.userId,
    action: 'guardian.unlinked',
    resource_type: 'student_parent',
    resource_id: linkId,
    details: {
      student_id: draft.studentId,
      guardian_id: draft.guardianId,
    },
  })

  return {
    linkId,
    studentId: draft.studentId,
    guardianId: draft.guardianId,
  }
}
