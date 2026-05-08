import {
  parseCompanionProfile,
  saveCompanionProfile,
  type StudentCompanionProfile,
} from '@/lib/companion/ice-age-companion'

interface CompanionProfileResponse {
  profile?: unknown
}

export async function loadCompanionProfileFromServer() {
  try {
    const response = await fetch('/api/companion/profile', { cache: 'no-store' })
    if (response.status === 401 || response.status === 403 || response.status === 404) return null
    if (!response.ok) return null

    const body = (await response.json()) as CompanionProfileResponse

    return parseCompanionProfile(JSON.stringify(body.profile ?? null))
  } catch {
    return null
  }
}

export async function saveCompanionProfileToServer(profile: StudentCompanionProfile) {
  try {
    const response = await fetch('/api/companion/profile', {
      method: 'PUT',
      headers: {
        'content-type': 'application/json',
      },
      body: JSON.stringify({ profile }),
    })

    return response.ok || response.status === 401 || response.status === 403
  } catch {
    return false
  }
}

export function saveCompanionProfileEverywhere(profile: StudentCompanionProfile) {
  saveCompanionProfile(profile)
  void saveCompanionProfileToServer(profile)
}
