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

async function tryEndpoints() {
  const sql = fs.readFileSync(
    path.resolve(__dirname, '..', 'supabase/migrations/20260216000000_skill_tree.sql'),
    'utf-8'
  )

  // Try various Supabase SQL endpoints
  const endpoints = [
    { url: `${supabaseUrl}/pg/query`, body: { query: sql } },
    { url: `${supabaseUrl}/pg`, body: { query: sql } },
    { url: `${supabaseUrl}/rest/v1/rpc/exec_sql`, body: { sql_string: sql } },
  ]

  for (const endpoint of endpoints) {
    console.log(`Trying: ${endpoint.url}`)
    try {
      const res = await fetch(endpoint.url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
          'apikey': serviceKey,
          'Authorization': `Bearer ${serviceKey}`,
        },
        body: JSON.stringify(endpoint.body),
      })
      const text = await res.text()
      console.log(`  Status: ${res.status}`)
      console.log(`  Response: ${text.substring(0, 200)}`)
      if (res.ok) {
        console.log('  SUCCESS!')
        return
      }
    } catch (err: any) {
      console.log(`  Error: ${err.message}`)
    }
    console.log('')
  }

  // Try the Management API with the service role key as bearer
  const projectRef = 'yhxesebykwhlpsmxxiqo'
  console.log(`Trying Management API: https://api.supabase.com/v1/projects/${projectRef}/database/query`)
  try {
    const res = await fetch(`https://api.supabase.com/v1/projects/${projectRef}/database/query`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Authorization': `Bearer ${serviceKey}`,
      },
      body: JSON.stringify({ query: sql }),
    })
    const text = await res.text()
    console.log(`  Status: ${res.status}`)
    console.log(`  Response: ${text.substring(0, 200)}`)
    if (res.ok) console.log('  SUCCESS!')
  } catch (err: any) {
    console.log(`  Error: ${err.message}`)
  }
}

tryEndpoints()
