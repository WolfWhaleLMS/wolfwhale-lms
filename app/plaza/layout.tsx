import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

export default async function PlazaLayout({
  children,
}: {
  children: React.ReactNode
}) {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  // Fetch profile and tenant data for plaza context
  const [profileResult, tenantResult] = await Promise.all([
    supabase
      .from('profiles')
      .select('first_name, last_name, full_name, avatar_url, grade_level')
      .eq('id', user.id)
      .single(),
    tenantId
      ? supabase
          .from('tenants')
          .select('name, branding')
          .eq('id', tenantId)
          .single()
      : null,
  ])

  const profile = profileResult.data
  const tenant = tenantResult?.data

  return (
    <div
      className="flex h-screen flex-col overflow-hidden bg-background"
      data-role="student"
    >
      {/* Minimal plaza header */}
      <header className="flex items-center justify-between border-b border-border bg-card px-4 py-2">
        <div className="flex items-center gap-3">
          <img src="/logo.png" alt="Wolf Whale" className="h-10 w-10 rounded-full object-cover" />
          <span className="text-sm font-semibold text-foreground">
            {tenant?.name ?? 'Wolf Whale'} Plaza
          </span>
        </div>
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          <span>
            {profile?.full_name?.trim() ||
              [profile?.first_name, profile?.last_name]
                .filter(Boolean)
                .join(' ') ||
              'Student'}
          </span>
        </div>
      </header>

      {/* Full-screen canvas area */}
      <main className="flex-1 overflow-y-auto">{children}</main>
    </div>
  )
}
