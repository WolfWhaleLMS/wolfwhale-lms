import { mkdtempSync, rmSync, writeFileSync } from 'node:fs'
import { tmpdir } from 'node:os'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

import {
  resolveSupabaseDbUrl,
  resolveSupabaseScriptEnv,
  resolveSupabaseProjectRef,
} from '@/scripts/resolve-supabase-db-url'

describe('resolveSupabaseDbUrl', () => {
  it('prefers an explicit Supabase database URL', () => {
    expect(
      resolveSupabaseDbUrl({
        cwd: '/tmp/does-not-exist',
        env: {
          SUPABASE_DB_URL: 'postgresql://explicit.example/postgres',
          SUPABASE_DB_PASSWORD: 'ignored',
          NEXT_PUBLIC_SUPABASE_URL: 'https://abc.supabase.co',
        },
      }),
    ).toBe('postgresql://explicit.example/postgres')
  })

  it('builds a direct database URL from a project ref and password', () => {
    expect(
      resolveSupabaseDbUrl({
        cwd: '/tmp/does-not-exist',
        env: {
          SUPABASE_PROJECT_REF: 'projectref',
          SUPABASE_DB_PASSWORD: 'pa ss/word',
        },
      }),
    ).toBe('postgresql://postgres:pa%20ss%2Fword@db.projectref.supabase.co:5432/postgres?sslmode=require')
  })

  it('fills the linked pooler URL with the database password', () => {
    expect(
      resolveSupabaseDbUrl({
        cwd: '/tmp/does-not-exist',
        env: {
          SUPABASE_POOLER_URL: 'postgresql://postgres.projectref@aws-1-ca-central-1.pooler.supabase.com:5432/postgres',
          SUPABASE_DB_PASSWORD: 'secret',
        },
      }),
    ).toBe('postgresql://postgres.projectref:secret@aws-1-ca-central-1.pooler.supabase.com:5432/postgres?sslmode=require')
  })

  it('resolves the Supabase project ref from the public Supabase URL', () => {
    expect(
      resolveSupabaseProjectRef({
        cwd: '/tmp/does-not-exist',
        env: {
          NEXT_PUBLIC_SUPABASE_URL: 'https://projectref.supabase.co',
        },
      }),
    ).toBe('projectref')
  })

  it('normalizes Vercel-exported newline escapes from local env files', () => {
    const cwd = mkdtempSync(path.join(tmpdir(), 'wolfwhale-env-'))

    try {
      writeFileSync(
        path.join(cwd, '.env.local'),
        [
          'NEXT_PUBLIC_SUPABASE_URL="https://projectref.supabase.co\\n"',
          'SUPABASE_DB_PASSWORD="secret\\n"',
        ].join('\n'),
      )

      expect(resolveSupabaseScriptEnv({ cwd, env: {} })).toMatchObject({
        NEXT_PUBLIC_SUPABASE_URL: 'https://projectref.supabase.co',
        SUPABASE_DB_PASSWORD: 'secret',
      })
      expect(resolveSupabaseProjectRef({ cwd, env: {} })).toBe('projectref')
    } finally {
      rmSync(cwd, { recursive: true, force: true })
    }
  })
})
