import { describe, expect, it } from 'vitest'
import {
  courseResourceAccessDecision,
  courseResourceRetentionExpiresAt,
  courseResourceUploadScanVerdict,
  isMissingResourceSecurityTableError,
  sha256ForUploadFile,
} from '@/lib/lms/resource-security'

describe('course resource security controls', () => {
  it('hashes uploaded files for audit and quarantine workflows', async () => {
    const bytes = Uint8Array.from([97, 98, 99])
    const file = {
      arrayBuffer: async () => bytes.buffer.slice(bytes.byteOffset, bytes.byteOffset + bytes.byteLength),
    } as File

    await expect(sha256ForUploadFile(file)).resolves.toBe(
      'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'
    )
  })

  it('automatically quarantines configured SHA-256 denylist matches', () => {
    const verdict = courseResourceUploadScanVerdict({
      fileSha256: 'BA7816BF8F01CFEA414140DE5DAE2223B00361A396177A9CB410FF61F20015AD',
      blockedSha256: ['ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad'],
      now: new Date('2026-05-08T12:00:00.000Z'),
    })

    expect(verdict).toEqual({
      scanStatus: 'blocked',
      scanProvider: 'mime-allowlist-sha256',
      scanCheckedAt: '2026-05-08T12:00:00.000Z',
      quarantineReason: 'SHA-256 denylist match',
    })
  })

  it('marks non-blocklisted uploads clean or pending based on launch policy', () => {
    expect(
      courseResourceUploadScanVerdict({
        fileSha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
        blockedSha256: [],
        requireCleanScan: false,
        now: new Date('2026-05-08T12:00:00.000Z'),
      })
    ).toMatchObject({
      scanStatus: 'clean',
      scanCheckedAt: '2026-05-08T12:00:00.000Z',
      quarantineReason: '',
    })

    expect(
      courseResourceUploadScanVerdict({
        fileSha256: 'ba7816bf8f01cfea414140de5dae2223b00361a396177a9cb410ff61f20015ad',
        blockedSha256: [],
        requireCleanScan: true,
        now: new Date('2026-05-08T12:00:00.000Z'),
      })
    ).toMatchObject({
      scanStatus: 'pending',
      scanCheckedAt: null,
      quarantineReason: '',
    })
  })

  it('blocks quarantined, errored, pending, and expired resources when policy requires it', () => {
    const now = new Date('2026-05-08T12:00:00.000Z')

    expect(courseResourceAccessDecision(null, { requireCleanScan: true, now })).toMatchObject({
      allowed: false,
      code: 'resource_security_review_required',
      status: 423,
    })
    expect(courseResourceAccessDecision({ scan_status: 'blocked' }, { now })).toMatchObject({
      allowed: false,
      code: 'resource_quarantined',
      status: 403,
    })
    expect(courseResourceAccessDecision({ scan_status: 'pending' }, { requireCleanScan: true, now })).toMatchObject({
      allowed: false,
      code: 'resource_scan_pending',
      status: 423,
    })
    expect(
      courseResourceAccessDecision(
        { scan_status: 'clean', retention_expires_at: '2026-05-07T12:00:00.000Z', legal_hold: false },
        { now }
      )
    ).toMatchObject({ allowed: false, code: 'resource_retention_expired', status: 410 })
  })

  it('allows clean resources and legal holds past retention expiry', () => {
    const now = new Date('2026-05-08T12:00:00.000Z')

    expect(
      courseResourceAccessDecision(
        { scan_status: 'clean', retention_expires_at: '2026-05-07T12:00:00.000Z', legal_hold: true },
        { requireCleanScan: true, now }
      )
    ).toMatchObject({ allowed: true })
  })

  it('calculates retention expiry from the configured launch policy window', () => {
    expect(courseResourceRetentionExpiresAt(new Date('2026-05-08T00:00:00.000Z'), 1)).toBe('2026-05-09T00:00:00.000Z')
  })

  it('detects missing security review table errors for backwards-compatible rollout', () => {
    expect(isMissingResourceSecurityTableError({ code: 'PGRST205', message: 'Could not find the table' })).toBe(true)
    expect(isMissingResourceSecurityTableError({ code: '23505', message: 'duplicate key value violates unique constraint' })).toBe(false)
  })
})
