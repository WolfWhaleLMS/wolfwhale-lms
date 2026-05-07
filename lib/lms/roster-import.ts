import type { SupabaseClient } from '@supabase/supabase-js'
import { LmsMutationError } from '@/lib/lms/mutations'
import { parseRosterCsv } from '@/lib/lms/roster'
import { createAdminClient, hasSupabaseAdminEnv } from '@/lib/supabase/admin'

type Row = Record<string, unknown>

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

export async function importRosterWithInvites(supabase: SupabaseClient, input: { rosterCsv: unknown }) {
  const rosterCsv = text(input.rosterCsv)
  if (!rosterCsv) {
    throw new LmsMutationError('Roster CSV is required.', 'missing_roster_csv')
  }

  const parsed = parseRosterCsv(rosterCsv)
  if (parsed.errors.length > 0) {
    throw new LmsMutationError(parsed.errors.join(' '), 'invalid_roster_csv')
  }

  if (!hasSupabaseAdminEnv()) {
    throw new LmsMutationError('SUPABASE_SERVICE_ROLE_KEY is required for roster imports.', 'service_role_required')
  }

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
    throw new LmsMutationError('Only school admins can import rosters.', 'admin_role_required')
  }

  const tenantId = id(membership.tenant_id, 'tenant_id')
  const admin = createAdminClient()
  const importedUserIds: string[] = []

  for (const row of parsed.rows) {
    const invite = await admin.auth.admin.inviteUserByEmail(row.email, {
      data: {
        first_name: row.firstName,
        last_name: row.lastName,
        role: row.role,
        tenant_id: tenantId,
      },
    })

    if (invite.error) {
      throw new LmsMutationError(`Unable to invite ${row.email}: ${invite.error.message}`, 'roster_invite_failed')
    }

    const invitedUserId = id(invite.data.user?.id, 'user_id')
    importedUserIds.push(invitedUserId)

    const profile = await admin.from('profiles').upsert(
      {
        id: invitedUserId,
        first_name: row.firstName,
        last_name: row.lastName,
        grade_level: row.gradeLevel || null,
      },
      { onConflict: 'id' }
    )
    if (profile.error) {
      throw new LmsMutationError(`Unable to save profile for ${row.email}: ${profile.error.message}`, 'profile_upsert_failed')
    }

    const membershipUpsert = await admin.from('tenant_memberships').upsert(
      {
        tenant_id: tenantId,
        user_id: invitedUserId,
        role: row.role,
        status: 'active',
        invited_at: new Date().toISOString(),
        invited_by: user.id,
      },
      { onConflict: 'tenant_id,user_id' }
    )
    if (membershipUpsert.error) {
      throw new LmsMutationError(`Unable to save membership for ${row.email}: ${membershipUpsert.error.message}`, 'membership_upsert_failed')
    }
  }

  await admin.from('audit_logs').insert({
    tenant_id: tenantId,
    user_id: user.id,
    action: 'roster.imported',
    resource_type: 'tenant_membership',
    details: {
      imported_count: importedUserIds.length,
      roles: parsed.rows.reduce<Record<string, number>>((counts, row) => {
        counts[row.role] = (counts[row.role] ?? 0) + 1
        return counts
      }, {}),
    },
  })

  return {
    importedCount: importedUserIds.length,
  }
}
