import type { Metadata } from 'next'
import { IceAgeWorldClient } from '@/components/companion/IceAgeWorldClient'
import { companionSummaryFromStudentView } from '@/components/companion/companion-summary'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Ice Age Companion World',
  description: 'Single-player WolfWhale Ice Age Companion learning world prototype.',
}

export const dynamic = 'force-dynamic'

export default async function StudentCompanionWorldPage() {
  const view = await loadLmsDashboardView('student')

  return <IceAgeWorldClient summary={companionSummaryFromStudentView(view)} />
}
