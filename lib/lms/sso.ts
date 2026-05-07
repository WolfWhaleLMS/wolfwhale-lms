export type SsoProvider = 'none' | 'oidc' | 'saml'

export interface SsoConfigValidation {
  ok: boolean
  provider: SsoProvider
  errors: string[]
}

function provider(value: unknown): SsoProvider {
  if (value === 'oidc' || value === 'saml') return value
  return 'none'
}

function required(env: Record<string, unknown>, key: string, label: string, errors: string[]) {
  if (typeof env[key] !== 'string' || !env[key].trim()) {
    errors.push(`${key} is required when SSO_PROVIDER_TYPE=${label}.`)
  }
}

export function validateSsoConfig(env: Record<string, unknown>): SsoConfigValidation {
  const selectedProvider = provider(env.SSO_PROVIDER_TYPE)
  const errors: string[] = []

  if (selectedProvider === 'oidc') {
    required(env, 'OIDC_ISSUER', 'oidc', errors)
    required(env, 'OIDC_CLIENT_ID', 'oidc', errors)
    required(env, 'OIDC_CLIENT_SECRET', 'oidc', errors)
  }

  if (selectedProvider === 'saml') {
    required(env, 'SAML_METADATA_URL', 'saml', errors)
    required(env, 'SAML_ENTITY_ID', 'saml', errors)
    required(env, 'SAML_ACS_URL', 'saml', errors)
  }

  return {
    ok: errors.length === 0,
    provider: selectedProvider,
    errors,
  }
}
