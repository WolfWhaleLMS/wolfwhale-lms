import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'
import { rateLimit } from '@/lib/rate-limit'
import { headers } from 'next/headers'

export const dynamic = 'force-dynamic'

export async function GET() {
  // Rate limit by IP to prevent abuse
  const headersList = await headers()
  const ip = headersList.get('x-forwarded-for')?.split(',')[0] ?? 'anonymous'
  const rl = await rateLimit(ip, 'api')
  if (!rl.success) {
    return NextResponse.json(
      { status: 'rate_limited', message: 'Too many requests' },
      { status: 429 }
    )
  }

  const start = Date.now()
  const checks: Record<string, { status: string; latency?: number }> = {}

  // Check Supabase connectivity
  try {
    const supabase = createClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )
    const dbStart = Date.now()
    const { error } = await supabase.from('tenants').select('id').limit(1)
    checks.database = {
      status: error ? 'unhealthy' : 'healthy',
      latency: Date.now() - dbStart,
    }
  } catch {
    checks.database = { status: 'unhealthy' }
  }

  const allHealthy = Object.values(checks).every((c) => c.status === 'healthy')

  return NextResponse.json(
    {
      status: allHealthy ? 'healthy' : 'degraded',
      timestamp: new Date().toISOString(),
      uptime: process.uptime(),
      latency: Date.now() - start,
      checks,
    },
    { status: allHealthy ? 200 : 503 }
  )
}
