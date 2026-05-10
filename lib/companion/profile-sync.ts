import {
  parseCompanionProfile,
  saveCompanionProfile,
  type StudentCompanionProfile,
} from '@/lib/companion/fish-companion'

interface CompanionProfileResponse {
  profile?: unknown
  version?: unknown
}

let lastServerVersion: number | null = null

function profileVersion(value: unknown) {
  const version = Number(value)

  return Number.isInteger(version) && version > 0 ? version : null
}

export async function loadCompanionProfileFromServer() {
  try {
    const response = await fetch('/api/companion/profile', { cache: 'no-store' })
    if (response.status === 401 || response.status === 403 || response.status === 404) return null
    if (!response.ok) return null

    const body = (await response.json()) as CompanionProfileResponse
    lastServerVersion = profileVersion(body.version)

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
      body: JSON.stringify({ profile, version: lastServerVersion }),
    })

    if (response.status === 409) {
      const body = (await response.json().catch(() => null)) as CompanionProfileResponse | null
      const serverProfile = parseCompanionProfile(JSON.stringify(body?.profile ?? null))
      lastServerVersion = profileVersion(body?.version)
      if (serverProfile) {
        saveCompanionProfile(serverProfile)
      }

      return false
    }

    if (response.ok) {
      const body = (await response.json().catch(() => null)) as CompanionProfileResponse | null
      lastServerVersion = profileVersion(body?.version) ?? lastServerVersion

      return true
    }

    return response.status === 401 || response.status === 403
  } catch {
    return false
  }
}

export function saveCompanionProfileEverywhere(profile: StudentCompanionProfile) {
  saveCompanionProfile(profile)
  void saveCompanionProfileToServer(profile)
}
