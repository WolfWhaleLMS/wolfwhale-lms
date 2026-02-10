import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

const ROLE_DASHBOARDS: Record<string, string> = {
  student: '/student/dashboard',
  teacher: '/teacher/dashboard',
  parent: '/parent/dashboard',
  admin: '/admin/dashboard',
  super_admin: '/admin/dashboard',
}

export default async function DashboardRedirectPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const role = headersList.get('x-user-role')

  if (role && ROLE_DASHBOARDS[role]) {
    redirect(ROLE_DASHBOARDS[role])
  }

  // Fallback: query tenant_memberships directly
  const { data: membership } = await supabase
    .from('tenant_memberships')
    .select('role')
    .eq('user_id', user.id)
    .eq('status', 'active')
    .limit(1)
    .maybeSingle()

  if (membership?.role && ROLE_DASHBOARDS[membership.role]) {
    redirect(ROLE_DASHBOARDS[membership.role])
  }

  // Last resort: default to student
  redirect('/student/dashboard')
}
