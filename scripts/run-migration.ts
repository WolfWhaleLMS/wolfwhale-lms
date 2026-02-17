/**
 * Run SQL migration using pg package
 */
import * as fs from 'fs'
import * as path from 'path'
import pg from 'pg'

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

async function run() {
  const sqlFile = process.argv[2] || 'supabase/migrations/20260216000000_skill_tree.sql'
  const sql = fs.readFileSync(path.resolve(__dirname, '..', sqlFile), 'utf-8')

  // Try connecting with the transaction pooler
  // The password needs to be provided via SUPABASE_DB_PASSWORD env var
  const password = process.env.SUPABASE_DB_PASSWORD
  if (!password) {
    console.log('No SUPABASE_DB_PASSWORD found in .env.local')
    console.log('')
    console.log('To apply the migration, either:')
    console.log('1. Add SUPABASE_DB_PASSWORD=your-password to .env.local, then re-run this script')
    console.log('2. Go to https://supabase.com/dashboard/project/yhxesebykwhlpsmxxiqo/sql/new')
    console.log('   and paste the contents of:', sqlFile)
    console.log('3. Run: npx supabase db push  (enter password when prompted)')
    return
  }

  const client = new pg.Client({
    host: 'aws-1-ca-central-1.pooler.supabase.com',
    port: 5432,
    database: 'postgres',
    user: 'postgres.yhxesebykwhlpsmxxiqo',
    password,
    ssl: { rejectUnauthorized: false },
  })

  try {
    await client.connect()
    console.log('Connected to database')
    await client.query(sql)
    console.log('Migration applied successfully!')
  } catch (err: any) {
    console.error('Error:', err.message)
  } finally {
    await client.end()
  }
}

run()
