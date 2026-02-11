import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { DashboardLayout } from '@/components/layout/DashboardLayout'
import { AgeVariantProvider } from '@/components/providers/age-variant-provider'
import type { UserRole } from '@/lib/auth/permissions'

export default async function StudentLayout({
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
    <AgeVariantProvider initialGradeLevel={profile?.grade_level}>
      <DashboardLayout
        role={'student' as UserRole}
        userName={profile?.full_name?.trim() || [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') || user.email || 'Student'}
        userAvatar={profile?.avatar_url}
        tenantName={tenant?.name || 'Wolf Whale LMS'}
        tenantLogo={tenant?.branding?.logo_url || null}
        gradeLevel={profile?.grade_level}
      >
        {children}
      </DashboardLayout>
    </AgeVariantProvider>
  )
}
