import { loadEnvConfig } from '@next/env'
import { createClient as createSupabaseClient, type SupabaseClient } from '@supabase/supabase-js'

import { loadLmsRecordsForUser } from '@/lib/lms/queries'
import { getSupabaseBrowserEnv } from '@/lib/supabase/env'

export const lmsSmokeRoles = ['student', 'teacher', 'admin', 'guardian'] as const

export type LmsSmokeRole = (typeof lmsSmokeRoles)[number]

type EnvMap = Record<string, string | undefined>

type AuthUser = {
  id: string
}

type SmokeSupabaseClient = {
  auth: {
    signInWithPassword(credentials: { email: string; password: string }): Promise<{
      data: { user: AuthUser | null }
      error: { message: string } | null
    }>
    signOut(): Promise<unknown> | unknown
  }
}

type SmokeRecordCounts = {
  memberships?: unknown[]
  courses?: unknown[]
  assignments?: unknown[]
}

export type LmsSmokeReadinessResult = {
  role: LmsSmokeRole
  userId: string
  memberships: number
  courses: number
  assignments: number
}

type ReadinessDependencies = {
  env?: EnvMap
  createClient?: () => SmokeSupabaseClient
  loadRecords?: (client: SmokeSupabaseClient, userId: string) => Promise<SmokeRecordCounts>
}

const defaultCredentials: Record<LmsSmokeRole, { email: string; password: string }> = {
  student: {
    email: 'student@wolfwhale.ca',
    password: 'WolfWhale-Student-2026',
  },
  teacher: {
    email: 'teacher@wolfwhale.ca',
    password: 'WolfWhale-Teacher-2026',
  },
  admin: {
    email: 'admin@wolfwhale.ca',
    password: 'WolfWhale-Admin-2026',
  },
  guardian: {
    email: 'parent@wolfwhale.ca',
    password: 'WolfWhale-Parent-2026',
  },
}

const envKeys: Record<LmsSmokeRole, { email: string; password: string }> = {
  student: {
    email: 'LMS_SMOKE_STUDENT_EMAIL',
    password: 'LMS_SMOKE_STUDENT_PASSWORD',
  },
  teacher: {
    email: 'LMS_SMOKE_TEACHER_EMAIL',
    password: 'LMS_SMOKE_TEACHER_PASSWORD',
  },
  admin: {
    email: 'LMS_SMOKE_ADMIN_EMAIL',
    password: 'LMS_SMOKE_ADMIN_PASSWORD',
  },
  guardian: {
    email: 'LMS_SMOKE_GUARDIAN_EMAIL',
    password: 'LMS_SMOKE_GUARDIAN_PASSWORD',
  },
}

function countRows(value: unknown[] | undefined) {
  return Array.isArray(value) ? value.length : 0
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : String(error)
}

function createSupabaseSmokeClient() {
  loadEnvConfig(process.cwd())
  const { url, key } = getSupabaseBrowserEnv()

  return createSupabaseClient(url, key) as SmokeSupabaseClient
}

async function loadDefaultRecords(client: SmokeSupabaseClient, userId: string) {
  return loadLmsRecordsForUser(client as SupabaseClient, userId)
}

export function credentialsForSmokeRole(role: LmsSmokeRole, env: EnvMap = process.env) {
  const keys = envKeys[role]

  return {
    email: env[keys.email]?.trim() || defaultCredentials[role].email,
    password: env[keys.password] || defaultCredentials[role].password,
  }
}

export function formatSmokeReadinessFailure(role: LmsSmokeRole, error: unknown) {
  return [
    `LMS smoke readiness failed for ${role}: ${errorMessage(error)}.`,
    'Apply pending Supabase migrations and rerun seed test accounts before browser smoke.',
  ].join(' ')
}

export async function checkLmsSmokeRoleReadiness(
  role: LmsSmokeRole,
  dependencies: ReadinessDependencies = {},
): Promise<LmsSmokeReadinessResult> {
  const client = dependencies.createClient?.() ?? createSupabaseSmokeClient()
  const credentials = credentialsForSmokeRole(role, dependencies.env ?? process.env)
  let signedIn = false

  try {
    const { data, error } = await client.auth.signInWithPassword(credentials)
    if (error || !data.user) {
      throw new Error(`Supabase auth failed: ${error?.message ?? 'no user returned'}`)
    }

    signedIn = true

    const records = await (dependencies.loadRecords ?? loadDefaultRecords)(client, data.user.id)

    return {
      role,
      userId: data.user.id,
      memberships: countRows(records.memberships),
      courses: countRows(records.courses),
      assignments: countRows(records.assignments),
    }
  } catch (error) {
    throw new Error(formatSmokeReadinessFailure(role, error))
  } finally {
    if (signedIn) {
      await client.auth.signOut()
    }
  }
}

export async function checkLmsSmokeReadiness(roles: readonly LmsSmokeRole[] = lmsSmokeRoles) {
  const results: LmsSmokeReadinessResult[] = []

  for (const role of roles) {
    results.push(await checkLmsSmokeRoleReadiness(role))
  }

  return results
}

async function main() {
  const results = await checkLmsSmokeReadiness()

  for (const result of results) {
    console.log(
      `${result.role}: auth/read-model ready (${result.memberships} memberships, ${result.courses} courses, ${result.assignments} assignments)`,
    )
  }

  console.log('LMS smoke readiness passed.')
}

if (process.argv[1]?.endsWith('check-lms-smoke-readiness.ts')) {
  main().catch((error: unknown) => {
    console.error(errorMessage(error))
    process.exit(1)
  })
}
