import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { HubScreen } from '@/components/hub/HubScreen'
import { AnnouncementBanner } from '@/components/announcements/AnnouncementBanner'
import { getChildren } from '@/app/actions/parent'

export default async function ParentDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch parent profile + children count in parallel
  const [profileResult, children] = await Promise.all([
    supabase
      .from('profiles')
      .select('first_name, last_name, full_name')
      .eq('id', user.id)
      .single(),
    getChildren().catch(() => [] as Awaited<ReturnType<typeof getChildren>>),
  ])

  const profile = profileResult.data
  const parentName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    'Parent'

  // Time-of-day greeting
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-4 sm:space-y-6">
      <Suspense fallback={null}>
        <AnnouncementBanner />
      </Suspense>
      <HubScreen
        role="parent"
        userName={parentName}
        greeting={greeting}
        childCount={children.length}
      />
    </div>
  )
}
