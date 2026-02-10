const TURNSTILE_SECRET_KEY = process.env.TURNSTILE_SECRET_KEY

export async function verifyTurnstileToken(token: string): Promise<boolean> {
  if (!TURNSTILE_SECRET_KEY) return true // Skip verification if not configured

  const response = await fetch(
    'https://challenges.cloudflare.com/turnstile/v0/siteverify',
    {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        secret: TURNSTILE_SECRET_KEY,
        response: token,
      }),
    }
  )

  const data = await response.json()
  return data.success === true
}
