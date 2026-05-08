import { existsSync, readFileSync } from 'node:fs'
import { validateRestoreDrillEvidence } from '@/lib/ops/evidence'

const defaultEvidencePath = 'fixtures/ops/restore-drill-evidence.example.json'
const evidencePath = process.env.RESTORE_DRILL_EVIDENCE_PATH ?? defaultEvidencePath
const requireCompletedDrill = process.env.ENFORCE_REAL_OPS_EVIDENCE === '1'

if (!existsSync(evidencePath)) {
  console.error(`Missing restore drill evidence file: ${evidencePath}`)
  process.exit(1)
}

const evidence = JSON.parse(readFileSync(evidencePath, 'utf8')) as unknown
const result = validateRestoreDrillEvidence(evidence, { requireCompletedDrill })

if (requireCompletedDrill && evidencePath === defaultEvidencePath) {
  result.errors.push('Set RESTORE_DRILL_EVIDENCE_PATH to a real completed-drill evidence file.')
}

if (!result.ok || result.errors.length > 0) {
  console.error(`Restore drill evidence check failed for ${evidencePath}:`)
  for (const error of result.errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`Restore drill evidence contract passed for ${evidencePath}.`)
if (!requireCompletedDrill && evidencePath === defaultEvidencePath) {
  console.log('Note: default example evidence passed. Set ENFORCE_REAL_OPS_EVIDENCE=1 with RESTORE_DRILL_EVIDENCE_PATH for production proof.')
}
