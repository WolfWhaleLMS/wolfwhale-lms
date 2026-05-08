export interface RestoreDrillVerificationQuery {
  name: string
  sql: string
  result: string
}

export interface RestoreDrillEvidence {
  evidenceType: 'template' | 'completed_drill'
  environment: string
  backupFile: string
  backupSha256: string
  restoredAt: string
  verifiedBy: string
  outcome: 'passed' | 'failed'
  verificationQueries: RestoreDrillVerificationQuery[]
  notes?: string
}

export interface RestoreDrillValidationOptions {
  requireCompletedDrill?: boolean
}

function text(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

function isIsoDate(value: string) {
  const parsed = Date.parse(value)

  return Number.isFinite(parsed) && new Date(parsed).toISOString() === value
}

function isQuery(value: unknown): value is RestoreDrillVerificationQuery {
  if (!value || typeof value !== 'object' || Array.isArray(value)) return false
  const row = value as Record<string, unknown>

  return Boolean(text(row.name) && text(row.sql) && text(row.result))
}

export function validateRestoreDrillEvidence(input: unknown, options: RestoreDrillValidationOptions = {}) {
  const errors: string[] = []
  if (!input || typeof input !== 'object' || Array.isArray(input)) {
    return { ok: false, errors: ['Evidence must be a JSON object.'] }
  }

  const evidence = input as Partial<RestoreDrillEvidence>
  if (evidence.evidenceType !== 'template' && evidence.evidenceType !== 'completed_drill') {
    errors.push('evidenceType must be template or completed_drill.')
  }
  if (options.requireCompletedDrill && evidence.evidenceType !== 'completed_drill') {
    errors.push('A completed restore drill evidence file is required.')
  }
  if (!text(evidence.environment)) errors.push('environment is required.')
  if (!text(evidence.backupFile)) errors.push('backupFile is required.')
  if (!text(evidence.backupSha256)) errors.push('backupSha256 is required.')
  if (!text(evidence.verifiedBy)) errors.push('verifiedBy is required.')
  if (!text(evidence.restoredAt) || !isIsoDate(text(evidence.restoredAt))) {
    errors.push('restoredAt must be an ISO timestamp.')
  }
  if (evidence.outcome !== 'passed') {
    errors.push('outcome must be passed.')
  }
  if (!Array.isArray(evidence.verificationQueries) || evidence.verificationQueries.length === 0) {
    errors.push('verificationQueries must include at least one query.')
  } else if (!evidence.verificationQueries.every(isQuery)) {
    errors.push('Every verification query needs name, sql, and result.')
  }

  return { ok: errors.length === 0, errors }
}
