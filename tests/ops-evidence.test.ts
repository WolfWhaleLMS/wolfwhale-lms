import { describe, expect, it } from 'vitest'
import { validateRestoreDrillEvidence } from '@/lib/ops/evidence'

describe('operations evidence contract', () => {
  it('accepts completed restore drill evidence', () => {
    const result = validateRestoreDrillEvidence(
      {
        evidenceType: 'completed_drill',
        environment: 'staging-drill',
        backupFile: 'backups/wolfwhale-20260508T000000Z.dump',
        backupSha256: 'abc123  backups/wolfwhale-20260508T000000Z.dump',
        restoredAt: '2026-05-08T00:00:00.000Z',
        verifiedBy: 'ops@example.edu',
        outcome: 'passed',
        verificationQueries: [
          {
            name: 'tenant count',
            sql: 'select count(*) from public.tenants;',
            result: '1',
          },
        ],
      },
      { requireCompletedDrill: true }
    )

    expect(result).toEqual({ ok: true, errors: [] })
  })

  it('rejects template evidence when production proof is required', () => {
    const result = validateRestoreDrillEvidence(
      {
        evidenceType: 'template',
        environment: 'local',
        backupFile: 'backup.dump',
        backupSha256: 'sha',
        restoredAt: '2026-05-08T00:00:00.000Z',
        verifiedBy: 'ops@example.edu',
        outcome: 'passed',
        verificationQueries: [{ name: 'tenant count', sql: 'select 1;', result: '1' }],
      },
      { requireCompletedDrill: true }
    )

    expect(result.ok).toBe(false)
    expect(result.errors).toContain('A completed restore drill evidence file is required.')
  })
})
