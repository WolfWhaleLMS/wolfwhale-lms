import type { SupabaseClient } from '@supabase/supabase-js'
import {
  XP_EVENT_AMOUNTS,
  awardCompanionXp,
  createStarterCompanion,
  parseCompanionProfile,
  type CompanionXpSource,
  type StudentCompanionProfile,
} from '@/lib/companion/fish-companion'

type Row = Record<string, unknown>

interface ServerCompanionXpInput {
  tenantId: string
  studentId: string
  source: CompanionXpSource
  label: string
  occurredAt?: string
}

function text(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function numericVersion(value: unknown) {
  const version = Number(value)

  return Number.isInteger(version) && version > 0 ? version : 1
}

function isMissingCompanionProfilesTableError(error: unknown) {
  if (!error || typeof error !== 'object') return false

  const row = error as { code?: unknown; message?: unknown; details?: unknown }
  const code = typeof row.code === 'string' ? row.code : ''
  const message = [row.message, row.details].filter((value) => typeof value === 'string').join(' ')

  return (
    code === '42P01' ||
    code === 'PGRST205' ||
    message.includes('student_companion_profiles') ||
    message.includes('Could not find the table')
  )
}

function profileFromRow(row: Row | null, input: ServerCompanionXpInput) {
  const parsed =
    row?.profile && typeof row.profile === 'object'
      ? parseCompanionProfile(JSON.stringify(row.profile))
      : parseCompanionProfile(typeof row?.profile === 'string' ? row.profile : null)

  return (
    parsed ??
    createStarterCompanion({
      species: 'clownfish',
      petName: 'Bubbles',
      now: input.occurredAt,
    })
  )
}

function companionProfilePayload(
  profile: StudentCompanionProfile,
  input: ServerCompanionXpInput,
  version: number
) {
  return {
    tenant_id: input.tenantId,
    student_id: input.studentId,
    species: profile.species,
    pet_name: profile.petName,
    hatch_stage: profile.hatchStage,
    level: profile.level,
    xp: profile.xp,
    version,
    profile,
    updated_at: profile.updatedAt,
  }
}

export async function awardServerCompanionXp(supabase: SupabaseClient, input: ServerCompanionXpInput) {
  const { data, error } = await supabase
    .from('student_companion_profiles')
    .select('id,profile,version')
    .eq('tenant_id', input.tenantId)
    .eq('student_id', input.studentId)
    .maybeSingle()

  if (error) {
    if (isMissingCompanionProfilesTableError(error)) {
      return { awarded: false, reason: 'companion_profiles_unavailable' as const }
    }

    throw error
  }

  const existingRow = (data as Row | null) ?? null
  const existingVersion = existingRow ? numericVersion(existingRow.version) : 0
  const profile = awardCompanionXp(profileFromRow(existingRow, input), {
    amount: XP_EVENT_AMOUNTS[input.source],
    source: input.source,
    label: input.label,
    occurredAt: input.occurredAt,
  })
  const nextVersion = existingVersion + 1
  const payload = companionProfilePayload(profile, input, nextVersion)
  const saveQuery = existingRow
    ? supabase
        .from('student_companion_profiles')
        .update(payload)
        .eq('id', text(existingRow.id))
        .eq('version', existingVersion)
        .select('id')
        .maybeSingle()
    : supabase.from('student_companion_profiles').insert(payload).select('id').maybeSingle()

  const { data: saved, error: saveError } = await saveQuery

  if (saveError) throw saveError
  if (!saved) {
    return { awarded: false, reason: 'companion_profile_conflict' as const }
  }

  return { awarded: true, xp: profile.xp, level: profile.level }
}

export async function tryAwardServerCompanionXp(supabase: SupabaseClient, input: ServerCompanionXpInput) {
  try {
    return await awardServerCompanionXp(supabase, input)
  } catch {
    return { awarded: false, reason: 'companion_xp_failed' as const }
  }
}
