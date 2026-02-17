/**
 * Apply SQL migration via Supabase SQL API
 * Uses the service role key to execute DDL statements
 */
import * as fs from 'fs'
import * as path from 'path'

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    if (!process.env[key]) process.env[key] = value
  }
}

loadEnvFile(path.resolve(__dirname, '..', '.env.local'))

const supabaseUrl = process.env.NEXT_PUBLIC_SUPABASE_URL!
const serviceKey = process.env.SUPABASE_SERVICE_ROLE_KEY!

async function applyMigration() {
  const sqlFile = process.argv[2] || 'supabase/migrations/20260216000000_skill_tree.sql'
  const sql = fs.readFileSync(path.resolve(__dirname, '..', sqlFile), 'utf-8')

  console.log(`Applying migration: ${sqlFile}`)

  // Split SQL into individual statements and filter out comments/empty
  const statements = sql
    .split(';')
    .map(s => s.trim())
    .filter(s => s.length > 0 && !s.startsWith('--'))

  console.log(`Found ${statements.length} SQL statements`)

  let success = 0
  let skipped = 0
  let failed = 0

  for (const stmt of statements) {
    // Skip pure comment blocks
    const cleaned = stmt.replace(/--[^\n]*/g, '').trim()
    if (!cleaned) {
      skipped++
      continue
    }

    try {
      const response = await fetch(`${supabaseUrl}/rest/v1/rpc/exec_sql`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify({ sql_string: cleaned + ';' }),
      })

      if (response.ok) {
        success++
        const firstLine = cleaned.split('\n')[0].substring(0, 60)
        console.log(`  ✓ ${firstLine}...`)
      } else {
        const errText = await response.text()
        if (errText.includes('already exists') || errText.includes('duplicate')) {
          skipped++
          const firstLine = cleaned.split('\n')[0].substring(0, 60)
          console.log(`  ~ ${firstLine}... (already exists)`)
        } else if (errText.includes('Could not find the function')) {
          // exec_sql RPC doesn't exist - try alternative approach
          console.log('  exec_sql function not available, trying pg_query...')
          failed++
        } else {
          failed++
          const firstLine = cleaned.split('\n')[0].substring(0, 60)
          console.log(`  ✗ ${firstLine}...`)
          console.log(`    Error: ${errText.substring(0, 200)}`)
        }
      }
    } catch (err: any) {
      failed++
      console.log(`  ✗ Error: ${err.message}`)
    }
  }

  console.log('')
  console.log(`Results: ${success} succeeded, ${skipped} skipped, ${failed} failed`)

  if (failed > 0) {
    console.log('')
    console.log('Some statements failed. You may need to apply the migration manually.')
    console.log('Go to: https://supabase.com/dashboard/project/yhxesebykwhlpsmxxiqo/sql/new')
    console.log(`And paste the contents of: ${sqlFile}`)
  }
}

applyMigration()
