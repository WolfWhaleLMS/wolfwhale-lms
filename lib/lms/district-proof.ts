import { existsSync } from 'node:fs'
import { parseOneRosterBundle, type OneRosterBundleInput } from '@/lib/lms/oneroster'
import { validateScaleBudget, type ScaleBudgetInput } from '@/lib/lms/roster'
import { validateSsoConfig } from '@/lib/lms/sso'

export interface DistrictProofProfile {
  districtName: string
  districtId: string
  launchDate: string
  sso: {
    env: Record<string, unknown>
  }
  sis: {
    oneRoster: OneRosterBundleInput
  }
  loadProfile: ScaleBudgetInput
  legal: {
    dataProcessingChecklist: string
    supportRunbook: string
    incidentRunbook: string
    enterpriseReadiness: string
  }
  restore: {
    mode: string
    command: string
  }
}

export interface DistrictProofResult {
  ok: boolean
  errors: string[]
  evidence: string[]
}

function requiredText(value: unknown, field: string, errors: string[]) {
  if (typeof value !== 'string' || !value.trim()) {
    errors.push(`${field} is required.`)
  }
}

function requireExistingFile(path: string, field: string, errors: string[]) {
  requiredText(path, field, errors)
  if (path && !existsSync(path)) {
    errors.push(`${field} points to a missing file: ${path}.`)
  }
}

export function validateDistrictProofProfile(profile: DistrictProofProfile): DistrictProofResult {
  const errors: string[] = []
  const evidence: string[] = []

  requiredText(profile.districtName, 'districtName', errors)
  requiredText(profile.districtId, 'districtId', errors)
  requiredText(profile.launchDate, 'launchDate', errors)

  const sso = validateSsoConfig(profile.sso?.env ?? {})
  if (!sso.ok) {
    errors.push(...sso.errors)
  } else {
    evidence.push(`SSO profile validated for provider ${sso.provider}.`)
  }

  const oneRoster = parseOneRosterBundle(profile.sis?.oneRoster)
  if (oneRoster.errors.length > 0) {
    errors.push(...oneRoster.errors)
  } else {
    evidence.push(
      `OneRoster bundle validated: ${oneRoster.summary.orgs} orgs, ${oneRoster.summary.users} users, ${oneRoster.summary.courses} courses, ${oneRoster.summary.classes} classes, ${oneRoster.summary.enrollments} enrollments.`
    )
  }

  const scale = validateScaleBudget(profile.loadProfile)
  if (!scale.ok) {
    errors.push(...scale.warnings)
  } else {
    evidence.push(
      `Load profile is inside verified envelope: ${profile.loadProfile.activeStudents} students, ${profile.loadProfile.activeTeachers} teachers, ${profile.loadProfile.activeCourses} courses, ${profile.loadProfile.activeEnrollments} enrollments.`
    )
  }

  requireExistingFile(profile.legal?.dataProcessingChecklist, 'legal.dataProcessingChecklist', errors)
  requireExistingFile(profile.legal?.supportRunbook, 'legal.supportRunbook', errors)
  requireExistingFile(profile.legal?.incidentRunbook, 'legal.incidentRunbook', errors)
  requireExistingFile(profile.legal?.enterpriseReadiness, 'legal.enterpriseReadiness', errors)
  if (errors.length === 0) {
    evidence.push('Legal/support/incident/data-processing evidence files are present.')
  }

  if (profile.restore?.mode !== 'disposable-non-production') {
    errors.push('restore.mode must be disposable-non-production.')
  }
  if (!profile.restore?.command?.includes('RESTORE_DRILL_CONFIRM=restore-non-production')) {
    errors.push('restore.command must include RESTORE_DRILL_CONFIRM=restore-non-production.')
  }
  if (!profile.restore?.command?.includes('RESTORE_DRILL_DB_URL=')) {
    errors.push('restore.command must include RESTORE_DRILL_DB_URL.')
  }
  if (errors.length === 0) {
    evidence.push('Restore drill command is guarded for disposable non-production restore.')
  }

  return {
    ok: errors.length === 0,
    errors,
    evidence,
  }
}
