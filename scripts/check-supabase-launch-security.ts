import { Client } from 'pg'
import { buildLaunchSecurityChecks } from '@/lib/supabase/launch-security-checks'

async function main() {
  const connectionString = process.env.SUPABASE_DB_URL ?? process.env.DATABASE_URL

  if (!connectionString) {
    console.error('Set SUPABASE_DB_URL or DATABASE_URL to run launch security checks.')
    process.exit(2)
  }

  const client = new Client({ connectionString })
  const checks = buildLaunchSecurityChecks()
  const failures: Array<{ id: string; rows: unknown[] }> = []

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

  if (failures.length > 0) {
    console.error('Supabase launch security checks failed:')
    for (const failure of failures) {
      console.error(`\n${failure.id}`)
      console.error(JSON.stringify(failure.rows, null, 2))
    }
    process.exit(1)
  }

  console.log(`Supabase launch security checks passed (${checks.length} checks).`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
