import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import {
  HIGH_RISK_SECURITY_DEFINER_RPCS,
  LAUNCH_SENSITIVE_TABLES,
  PUBLIC_STORAGE_BUCKETS_REQUIRING_REVIEW,
  SECURITY_INVOKER_VIEWS,
  buildLaunchSecurityChecks,
} from '@/lib/supabase/launch-security-checks'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(__dirname, '..')
const rpcMigrationPath = path.join(
  repoRoot,
  'supabase/migrations/20260507141641_restrict_security_definer_rpc_surface.sql'
)
const anonMigrationPath = path.join(repoRoot, 'supabase/migrations/20260507064310_launch_lock_down_anon_data_api.sql')
const storageMigrationPath = path.join(
  repoRoot,
  'supabase/migrations/20260507151313_restrict_public_storage_buckets.sql'
)
const storagePolicyMigrationPath = path.join(
  repoRoot,
  'supabase/migrations/20260507151449_drop_public_storage_listing_policy.sql'
)
const envExamplePath = path.join(repoRoot, '.env.example')

describe('Supabase launch security invariants', () => {
  it('tracks the sensitive school tables that must not be anonymously readable', () => {
    expect(LAUNCH_SENSITIVE_TABLES).toEqual(
      expect.arrayContaining([
        'profiles',
        'tenant_memberships',
        'course_enrollments',
        'assignments',
        'submissions',
        'grades',
        'attendance_records',
        'messages',
        'notifications',
        'student_parents',
        'audit_logs',
        'data_deletion_requests',
        'student_companion_profiles',
      ])
    )
  })

  it('builds database checks for anonymous grants, security invoker views, RPC exposure, and storage listing', () => {
    const checks = buildLaunchSecurityChecks()
    const ids = checks.map((check) => check.id)

    expect(ids).toEqual([
      'anon_sensitive_table_select',
      'anon_public_function_execute',
      'security_invoker_views',
      'authenticated_high_risk_security_definer_rpc_execute',
      'public_storage_bucket_listing',
      'course_materials_insert_tenant_scoped',
      'lesson_attachment_insert_allows_assigned_teachers',
    ])

    for (const table of LAUNCH_SENSITIVE_TABLES) {
      expect(checks[0].sql).toContain(table)
    }

    for (const view of SECURITY_INVOKER_VIEWS) {
      expect(checks[2].sql).toContain(view)
    }

    for (const rpc of HIGH_RISK_SECURITY_DEFINER_RPCS) {
      expect(checks[3].sql).toContain(rpc.name)
    }

    for (const bucket of PUBLIC_STORAGE_BUCKETS_REQUIRING_REVIEW) {
      expect(checks[4].sql).toContain(bucket)
    }

    expect(checks[5].sql).toContain('course_materials_teacher_insert')
    expect(checks[6].sql).toContain('course_enrollments')
  })

  it('has a migration that revokes direct execute on high-risk security-definer RPCs', () => {
    expect(existsSync(rpcMigrationPath)).toBe(true)
    const migration = readFileSync(rpcMigrationPath, 'utf8').toLowerCase()

    for (const rpc of HIGH_RISK_SECURITY_DEFINER_RPCS) {
      const signature = `${rpc.name}(${rpc.arguments})`.toLowerCase()

      expect(migration).toContain(`revoke execute on function public.${signature} from anon`)
      expect(migration).toContain(`revoke execute on function public.${signature} from authenticated`)
      expect(migration).toContain(`revoke execute on function public.${signature} from public`)
    }
  })

  it('has a migration that locks down anonymous Data API access and security-invoker views', () => {
    expect(existsSync(anonMigrationPath)).toBe(true)
    const migration = readFileSync(anonMigrationPath, 'utf8').toLowerCase()

    expect(migration).toContain('revoke select, insert, update, delete on all tables in schema public from anon')
    expect(migration).toContain('revoke execute on all functions in schema public from anon')

    for (const view of SECURITY_INVOKER_VIEWS) {
      expect(migration).toContain(`alter view if exists public.${view} set (security_invoker = true)`)
    }
  })

  it('has migrations that make reviewed storage buckets private and remove public listing policy', () => {
    expect(existsSync(storageMigrationPath)).toBe(true)
    expect(existsSync(storagePolicyMigrationPath)).toBe(true)

    const storageMigration = readFileSync(storageMigrationPath, 'utf8').toLowerCase()
    const policyMigration = readFileSync(storagePolicyMigrationPath, 'utf8').toLowerCase()

    for (const bucket of PUBLIC_STORAGE_BUCKETS_REQUIRING_REVIEW) {
      expect(storageMigration).toContain(bucket)
      expect(policyMigration).toContain(bucket)
    }

    expect(storageMigration).toContain('set public = false')
    expect(policyMigration).toContain('drop policy if exists "anyone can view course thumbnails" on storage.objects')
    expect(policyMigration).toContain('set public = false')
  })

  it('documents the database credential needed for live launch-security validation', () => {
    const envExample = readFileSync(envExamplePath, 'utf8')

    expect(envExample).toContain('SUPABASE_DB_URL=')
    expect(envExample).toContain('SUPABASE_DB_PASSWORD=')
    expect(envExample).toContain('npm run security:supabase')
  })
})
