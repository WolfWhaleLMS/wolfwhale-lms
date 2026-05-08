import { NextRequest, NextResponse } from 'next/server'
import { parseCompanionProfile, type StudentCompanionProfile } from '@/lib/companion/ice-age-companion'
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

function companionProfilePayload(profile: StudentCompanionProfile, tenantId: string, userId: string) {
  return {
    tenant_id: tenantId,
    student_id: userId,
    species: profile.species,
    pet_name: profile.petName,
    hatch_stage: profile.hatchStage,
    level: profile.level,
    xp: profile.xp,
    profile,
    updated_at: new Date().toISOString(),
  }
}

export async function GET() {
  const session = await requireStudentMembership()
  if ('error' in session) return session.error

  const { data, error } = await session.supabase
    .from('student_companion_profiles')
    .select('profile')
    .eq('tenant_id', session.tenantId)
    .eq('student_id', session.userId)
    .maybeSingle()

  if (error) {
    return jsonError(`Unable to load companion profile: ${error.message}`, 500)
  }

  return NextResponse.json({ profile: parseCompanionProfile(JSON.stringify((data as Row | null)?.profile ?? null)) })
}

export async function PUT(request: NextRequest) {
  const session = await requireStudentMembership()
  if ('error' in session) return session.error

  const body = await request.json().catch(() => null)
  const profile = profileFromBody(body)
  if (!profile) {
    return jsonError('A valid companion profile is required.', 400)
  }

  const { data, error } = await session.supabase
    .from('student_companion_profiles')
    .upsert(companionProfilePayload(profile, session.tenantId, session.userId), { onConflict: 'tenant_id,student_id' })
    .select('profile')
    .single()

  if (error) {
    return jsonError(`Unable to save companion profile: ${error.message}`, 500)
  }

  return NextResponse.json({ profile: parseCompanionProfile(JSON.stringify((data as Row).profile)) })
}
