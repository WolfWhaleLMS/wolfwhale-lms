import { NextRequest, NextResponse } from 'next/server'
import { parseCompanionProfile, type StudentCompanionProfile } from '@/lib/companion/ice-age-companion'
import { checkRateLimit, rateLimitKey } from '@/lib/security/rate-limit'
import { createClient } from '@/lib/supabase/server'

type Row = Record<string, unknown>

function text(value: unknown) {
  return typeof value === 'string' ? value : ''
}

function rows(data: unknown) {
  return (data ?? []) as Row[]
}

function jsonError(message: string, status: number) {
  return NextResponse.json({ error: message }, { status })
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

async function requireStudentMembership() {
  const supabase = await createClient()
  const {
    data: { user },
    error: userError,
  } = await supabase.auth.getUser()

  if (userError || !user) {
    return { error: jsonError('Authentication is required.', 401) }
  }

  const { data, error } = await supabase
    .from('tenant_memberships')
    .select('tenant_id,user_id,role,status')
    .eq('user_id', user.id)
    .eq('role', 'student')
    .eq('status', 'active')

  if (error) {
    return { error: jsonError(`Unable to verify school membership: ${error.message}`, 500) }
  }

  const membership = rows(data)[0]
  const tenantId = text(membership?.tenant_id)
  if (!tenantId) {
    return { error: jsonError('A student school membership is required.', 403) }
  }

  return { supabase, tenantId, userId: user.id }
}

function profileFromBody(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null

  return parseCompanionProfile(JSON.stringify((body as { profile?: unknown }).profile ?? null))
}

function versionFromBody(body: unknown) {
  if (!body || typeof body !== 'object' || Array.isArray(body)) return null

  const version = Number((body as { version?: unknown }).version)

  return Number.isInteger(version) && version > 0 ? version : null
}

function rowVersion(row: Row | null) {
  const version = Number(row?.version)

  return Number.isInteger(version) && version > 0 ? version : 1
}

function companionProfilePayload(profile: StudentCompanionProfile, tenantId: string, userId: string, version: number) {
  return {
    tenant_id: tenantId,
    student_id: userId,
    species: profile.species,
    pet_name: profile.petName,
    hatch_stage: profile.hatchStage,
    level: profile.level,
    xp: profile.xp,
    version,
    profile,
    updated_at: new Date().toISOString(),
  }
}

export async function GET() {
  const session = await requireStudentMembership()
  if ('error' in session) return session.error

  const { data, error } = await session.supabase
    .from('student_companion_profiles')
    .select('profile,version')
    .eq('tenant_id', session.tenantId)
    .eq('student_id', session.userId)
    .maybeSingle()

  if (error) {
    if (isMissingCompanionProfilesTableError(error)) {
      return NextResponse.json({
        profile: null,
        version: null,
        persistence: 'local-fallback',
      })
    }

    return jsonError(`Unable to load companion profile: ${error.message}`, 500)
  }

  const row = (data as Row | null) ?? null

  return NextResponse.json({
    profile: parseCompanionProfile(JSON.stringify(row?.profile ?? null)),
    version: rowVersion(row),
  })
}

export async function PUT(request: NextRequest) {
  const session = await requireStudentMembership()
  if ('error' in session) return session.error

  const rateLimit = await checkRateLimit(
    { id: 'companion:profile', limit: 60, window: '1 m' },
    rateLimitKey(request, [session.userId])
  )

  if (!rateLimit.success) {
    return jsonError('Too many companion profile saves. Please wait and try again.', 429)
  }

  const body = await request.json().catch(() => null)
  const profile = profileFromBody(body)
  const expectedVersion = versionFromBody(body)
  if (!profile) {
    return jsonError('A valid companion profile is required.', 400)
  }

  const { data: existing, error: existingError } = await session.supabase
    .from('student_companion_profiles')
    .select('id,profile,version')
    .eq('tenant_id', session.tenantId)
    .eq('student_id', session.userId)
    .maybeSingle()

  if (existingError) {
    if (isMissingCompanionProfilesTableError(existingError)) {
      return NextResponse.json({
        profile,
        version: null,
        persistence: 'local-fallback',
      })
    }

    return jsonError(`Unable to save companion profile: ${existingError.message}`, 500)
  }

  const existingRow = (existing as Row | null) ?? null
  const existingVersion = rowVersion(existingRow)

  if (existingRow && expectedVersion && expectedVersion !== existingVersion) {
    return NextResponse.json(
      {
        error: 'companion_profile_conflict',
        profile: parseCompanionProfile(JSON.stringify(existingRow.profile ?? null)),
        version: existingVersion,
      },
      { status: 409 }
    )
  }

  const nextVersion = existingRow ? existingVersion + 1 : 1
  const payload = companionProfilePayload(profile, session.tenantId, session.userId, nextVersion)
  const saveQuery = existingRow
    ? session.supabase
        .from('student_companion_profiles')
        .update(payload)
        .eq('id', text(existingRow.id))
        .eq('version', existingVersion)
        .select('profile,version')
        .maybeSingle()
    : session.supabase.from('student_companion_profiles').insert(payload).select('profile,version').maybeSingle()

  const { data, error } = await saveQuery

  if (error) {
    if (isMissingCompanionProfilesTableError(error)) {
      return NextResponse.json({
        profile,
        version: null,
        persistence: 'local-fallback',
      })
    }

    return jsonError(`Unable to save companion profile: ${error.message}`, 500)
  }
  if (!data) {
    const { data: current } = await session.supabase
      .from('student_companion_profiles')
      .select('profile,version')
      .eq('tenant_id', session.tenantId)
      .eq('student_id', session.userId)
      .maybeSingle()

    const currentRow = (current as Row | null) ?? null

    return NextResponse.json(
      {
        error: 'companion_profile_conflict',
        profile: parseCompanionProfile(JSON.stringify(currentRow?.profile ?? null)),
        version: rowVersion(currentRow),
      },
      { status: 409 }
    )
  }

  const saved = data as Row

  return NextResponse.json({
    profile: parseCompanionProfile(JSON.stringify(saved.profile)),
    version: rowVersion(saved),
  })
}
