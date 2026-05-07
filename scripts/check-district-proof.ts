import { readFileSync } from 'node:fs'
import { validateDistrictProofProfile, type DistrictProofProfile } from '@/lib/lms/district-proof'

const profilePath = process.env.DISTRICT_PROOF_PROFILE ?? 'fixtures/district/canvas-replacement-demo.json'
const profile = JSON.parse(readFileSync(profilePath, 'utf8')) as DistrictProofProfile
const result = validateDistrictProofProfile(profile)

if (!result.ok) {
  console.error(`District proof failed for ${profilePath}:`)
  for (const error of result.errors) {
    console.error(`- ${error}`)
  }
  process.exit(1)
}

console.log(`District proof passed for ${profile.districtName}.`)
for (const item of result.evidence) {
  console.log(`- ${item}`)
}
