import { headers } from 'next/headers'
import { redirect } from 'next/navigation'
import { createClient } from '@/lib/supabase/server'
import AnnouncementsClient from './AnnouncementsClient'

export default async function AnnouncementsPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  const role = headersList.get('x-user-role') || 'student'
  if (!tenantId) redirect('/login')

  const { data: announcements } = await supabase
    .from('announcements')
    .select('*, profiles:created_by(full_name, avatar_url)')
    .eq('tenant_id', tenantId)
    .eq('status', 'published')
    .order('is_pinned', { ascending: false })
    .order('created_at', { ascending: false })
    .limit(50)

  // Get courses for course-specific filters
  const { data: courses } = await supabase
    .from('courses')
    .select('id, name')
    .eq('tenant_id', tenantId)
    .eq('status', 'active')
    .order('name')

  const canCreate = ['teacher', 'admin', 'super_admin'].includes(role)

  return (
    <AnnouncementsClient
      initialAnnouncements={announcements ?? []}
      courses={courses ?? []}
      canCreate={canCreate}
      role={role}
    />
  )
}
