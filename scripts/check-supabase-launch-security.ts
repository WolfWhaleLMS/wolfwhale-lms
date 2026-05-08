import { Client } from 'pg'
import { buildLaunchSecurityChecks } from '@/lib/supabase/launch-security-checks'
import {
  describeMissingSupabaseDbCredentials,
  resolveSupabaseDbUrl,
  resolveSupabaseProjectRef,
  resolveSupabaseScriptEnv,
} from './resolve-supabase-db-url'

type Failure = { id: string; rows: unknown[] }

function rowsFromManagementPayload(payload: unknown): unknown[] {
  if (Array.isArray(payload)) return payload
  if (!payload || typeof payload !== 'object') return []

  const objectPayload = payload as Record<string, unknown>
  for (const key of ['result', 'data', 'rows']) {
    if (Array.isArray(objectPayload[key])) return objectPayload[key]
  }

  return []
}

async function runChecksWithPostgres(connectionString: string) {
  const client = new Client({ connectionString })
  const checks = buildLaunchSecurityChecks()
  const failures: Failure[] = []

  await client.connect()

  try {
    for (const check of checks) {
      const result = await client.query(check.sql)
      if (result.rows.length > 0) {
        failures.push({ id: check.id, rows: result.rows })
      }
    }
  } finally {
    await client.end()
  }

  return { checkCount: checks.length, failures }
}

async function runChecksWithManagementApi(accessToken: string, projectRef: string) {
  const checks = buildLaunchSecurityChecks()
  const failures: Failure[] = []

  for (const check of checks) {
    const response = await fetch(
      `https://api.supabase.com/v1/projects/${projectRef}/database/query/read-only`,
      {
        method: 'POST',
        headers: {
          Authorization: `Bearer ${accessToken}`,
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ query: check.sql }),
      },
    )

    if (!response.ok) {
      const body = await response.text()
      throw new Error(
        `Supabase Management API query failed for ${check.id}: ${response.status} ${body}`,
      )
    }

    const payload = (await response.json()) as unknown
    const rows = rowsFromManagementPayload(payload)
    if (rows.length > 0) {
      failures.push({ id: check.id, rows })
    }
  }

  return { checkCount: checks.length, failures }
}

async function main() {
  const env = resolveSupabaseScriptEnv()
  const connectionString = resolveSupabaseDbUrl()
  const accessToken = env.SUPABASE_ACCESS_TOKEN || env.SUPABASE_MANAGEMENT_ACCESS_TOKEN
  const projectRef = resolveSupabaseProjectRef({ env })

  if (!connectionString && (!accessToken || !projectRef)) {
    console.error(
      `${describeMissingSupabaseDbCredentials()} Or set SUPABASE_ACCESS_TOKEN with database_read permission plus SUPABASE_PROJECT_REF for the Supabase Management API read-only query path.`,
    )
    process.exit(2)
  }

  const { checkCount, failures } = connectionString
    ? await runChecksWithPostgres(connectionString)
    : await runChecksWithManagementApi(accessToken!, projectRef!)

  if (failures.length > 0) {
    console.error('Supabase launch security checks failed:')
    for (const failure of failures) {
      console.error(`\n${failure.id}`)
      console.error(JSON.stringify(failure.rows, null, 2))
    }
    process.exit(1)
  }

  console.log(`Supabase launch security checks passed (${checkCount} checks).`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
