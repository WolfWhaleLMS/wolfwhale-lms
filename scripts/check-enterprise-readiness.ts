import { existsSync, readFileSync } from 'node:fs'

const requiredFiles = [
  'AUDIT_REPORT.md',
  'LAUNCH_BLOCKERS.md',
  'FIX_LOG.md',
  'TEST_EVIDENCE.md',
  'SCHOOL_LAUNCH_READINESS_ROADMAP.md',
  'ENTERPRISE_LAUNCH_READINESS.md',
  'SUPPORT_RUNBOOK.md',
  'DATA_PROCESSING_CHECKLIST.md',
  'INCIDENT_RESPONSE_RUNBOOK.md',
  'fixtures/district/canvas-replacement-demo.json',
  'lib/lms/oneroster.ts',
  'lib/lms/exports.ts',
  'lib/lms/sso.ts',
  'lib/lms/district-proof.ts',
  'app/api/lms/exports/gradebook/route.ts',
  'app/api/lms/exports/attendance/route.ts',
  'app/api/lms/exports/sis/route.ts',
  'app/api/lms/resources/route.ts',
  'app/api/companion/profile/route.ts',
  'docs/ops/production-promotion-checklist.md',
  'docs/ops/restore-drill-evidence.md',
  'fixtures/ops/restore-drill-evidence.example.json',
  'lib/ops/evidence.ts',
  'scripts/check-ops-evidence.ts',
  'supabase/migrations/20260508180000_student_companion_profiles.sql',
  'supabase/migrations/20260508181000_course_resource_upload_rls.sql',
]

const requiredEnvExampleKeys = [
  'NEXT_PUBLIC_SUPABASE_URL',
  'NEXT_PUBLIC_SUPABASE_ANON_KEY',
  'SUPABASE_SERVICE_ROLE_KEY',
  'SUPABASE_COURSE_RESOURCE_BUCKET',
  'SUPABASE_DB_URL',
  'RESTORE_DRILL_DB_URL',
  'SSO_PROVIDER_TYPE',
  'OIDC_ISSUER',
  'OIDC_CLIENT_ID',
  'OIDC_CLIENT_SECRET',
  'SAML_METADATA_URL',
  'ONEROSTER_IMPORT_MODE',
  'SUPPORT_ESCALATION_EMAIL',
  'INCIDENT_COMMANDER_EMAIL',
]

const requiredPackageScripts = [
  'launch:verify',
  'security:supabase',
  'scale:check',
  'load:smoke',
  'ops:evidence',
  'district:proof',
  'district:verify',
  'test:a11y',
  'db:backup',
  'db:restore-drill',
]

function fail(message: string) {
  console.error(message)
  process.exitCode = 1
}

for (const file of requiredFiles) {
  if (!existsSync(file)) {
    fail(`Missing enterprise readiness file: ${file}`)
  }
}

const envExample = existsSync('.env.example') ? readFileSync('.env.example', 'utf8') : ''
for (const key of requiredEnvExampleKeys) {
  if (!envExample.includes(`${key}=`)) {
    fail(`.env.example is missing ${key}.`)
  }
}

const packageJson = JSON.parse(readFileSync('package.json', 'utf8')) as { scripts?: Record<string, string> }
for (const script of requiredPackageScripts) {
  if (!packageJson.scripts?.[script]) {
    fail(`package.json is missing script ${script}.`)
  }
}

if (process.exitCode) {
  process.exit(process.exitCode)
}

console.log('Enterprise readiness gate passed: docs, env contract, and verification scripts are present.')
