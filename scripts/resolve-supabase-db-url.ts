import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'

type EnvMap = Record<string, string | undefined>

type ResolveSupabaseDbUrlOptions = {
  cwd?: string
  env?: EnvMap
}

const ENV_FILES = ['.env', '.env.local', '.env.production.local']

function parseEnvFile(filePath: string): EnvMap {
  if (!existsSync(filePath)) return {}

  const parsed: EnvMap = {}
  for (const rawLine of readFileSync(filePath, 'utf8').split(/\r?\n/)) {
    const line = rawLine.trim()
    if (!line || line.startsWith('#')) continue

    const separatorIndex = line.indexOf('=')
    if (separatorIndex === -1) continue

    const key = line.slice(0, separatorIndex).trim()
    let value = line.slice(separatorIndex + 1).trim()
    if (
      (value.startsWith('"') && value.endsWith('"')) ||
      (value.startsWith("'") && value.endsWith("'"))
    ) {
      value = value.slice(1, -1)
    }
    parsed[key] = value
  }

  return parsed
}

function loadScriptEnv(cwd: string, env: EnvMap): EnvMap {
  const fileEnv = ENV_FILES.reduce<EnvMap>(
    (merged, file) => ({ ...merged, ...parseEnvFile(path.join(cwd, file)) }),
    {},
  )

  return { ...fileEnv, ...env }
}

export function projectRefFromSupabaseUrl(value?: string) {
  if (!value) return undefined

  try {
    const hostname = new URL(value).hostname
    const [projectRef, supabaseDomain] = hostname.split('.')
    return supabaseDomain === 'supabase' ? projectRef : undefined
  } catch {
    return undefined
  }
}

export function resolveSupabaseScriptEnv(options: ResolveSupabaseDbUrlOptions = {}) {
  return loadScriptEnv(options.cwd ?? process.cwd(), options.env ?? process.env)
}

export function resolveSupabaseProjectRef(options: ResolveSupabaseDbUrlOptions = {}) {
  const cwd = options.cwd ?? process.cwd()
  const env = loadScriptEnv(cwd, options.env ?? process.env)

  return env.SUPABASE_PROJECT_REF || projectRefFromSupabaseUrl(env.NEXT_PUBLIC_SUPABASE_URL)
}

function readLinkedPoolerUrl(cwd: string) {
  const filePath = path.join(cwd, 'supabase/.temp/pooler-url')
  if (!existsSync(filePath)) return undefined

  const value = readFileSync(filePath, 'utf8').trim()
  return value || undefined
}

function withPasswordAndSsl(connectionString: string, password: string) {
  const url = new URL(connectionString)
  url.password = password

  if (!url.searchParams.has('sslmode')) {
    url.searchParams.set('sslmode', 'require')
  }

  return url.toString()
}

export function resolveSupabaseDbUrl(options: ResolveSupabaseDbUrlOptions = {}) {
  const cwd = options.cwd ?? process.cwd()
  const env = resolveSupabaseScriptEnv({ cwd, env: options.env ?? process.env })

  const explicitUrl = env.SUPABASE_DB_URL || env.DATABASE_URL
  if (explicitUrl) return explicitUrl

  const password = env.SUPABASE_DB_PASSWORD
  if (!password) return undefined

  const poolerUrl = env.SUPABASE_POOLER_URL || readLinkedPoolerUrl(cwd)
  if (poolerUrl) {
    return withPasswordAndSsl(poolerUrl, password)
  }

  const projectRef = resolveSupabaseProjectRef({ cwd, env })
  if (!projectRef) return undefined

  const host = env.SUPABASE_DB_HOST || `db.${projectRef}.supabase.co`
  const port = env.SUPABASE_DB_PORT || '5432'
  const database = env.SUPABASE_DB_NAME || 'postgres'
  const user = env.SUPABASE_DB_USER || 'postgres'
  const sslMode = env.SUPABASE_DB_SSLMODE || 'require'

  return `postgresql://${encodeURIComponent(user)}:${encodeURIComponent(password)}@${host}:${port}/${encodeURIComponent(database)}?sslmode=${encodeURIComponent(sslMode)}`
}

export function describeMissingSupabaseDbCredentials() {
  return [
    'Set SUPABASE_DB_URL or DATABASE_URL to run launch security checks.',
    'Alternatively set SUPABASE_DB_PASSWORD; the script will infer the linked Supabase project from NEXT_PUBLIC_SUPABASE_URL, SUPABASE_PROJECT_REF, or supabase/.temp/pooler-url.',
  ].join(' ')
}
