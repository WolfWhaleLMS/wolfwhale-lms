import { createClient } from '@supabase/supabase-js'
import { NextResponse } from 'next/server'

export const dynamic = 'force-dynamic'

export async function GET() {
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
