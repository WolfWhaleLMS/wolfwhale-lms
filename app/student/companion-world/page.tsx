import type { Metadata } from 'next'
import { SeaWorldClient } from '@/components/companion/SeaWorldClient'
import { companionSummaryFromStudentView } from '@/components/companion/companion-summary'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Fish Companion World',
  description: 'Single-player WolfWhale fish companion learning world prototype.',
}

export const dynamic = 'force-dynamic'

export default async function StudentCompanionWorldPage() {
  const view = await loadLmsDashboardView('student')

  return <SeaWorldClient summary={companionSummaryFromStudentView(view)} />
}
