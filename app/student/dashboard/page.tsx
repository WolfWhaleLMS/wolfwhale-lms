import { redirect } from 'next/navigation'
import { Suspense } from 'react'
import { createClient } from '@/lib/supabase/server'
import { HubScreen } from '@/components/hub/HubScreen'
import { AnnouncementBanner } from '@/components/announcements/AnnouncementBanner'

export default async function StudentDashboardPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  // Fetch student profile for greeting
  const { data: profile } = await supabase
    .from('profiles')
    .select('first_name, last_name, full_name')
    .eq('id', user.id)
    .single()

  const studentName =
    profile?.full_name ||
    [profile?.first_name, profile?.last_name].filter(Boolean).join(' ') ||
    'Student'

  // Time-of-day greeting
  const hour = new Date().getHours()
  const greeting =
    hour < 12 ? 'Good morning' : hour < 18 ? 'Good afternoon' : 'Good evening'

  return (
    <div className="space-y-4 sm:space-y-6">
      <Suspense fallback={null}>
        <AnnouncementBanner />
      </Suspense>
      <HubScreen role="student" userName={studentName} greeting={greeting} />
    </div>
  )
}
