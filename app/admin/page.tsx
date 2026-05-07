import type { Metadata } from 'next'
import { AdminDashboard } from '@/components/lms/AdminDashboard'
import { loadLmsDashboardView } from '@/lib/lms/server'

export const metadata: Metadata = {
  title: 'Admin LMS Console',
  description: 'Supabase-backed school operations, roster, course, assignment, and audit dashboard.',
}

export const dynamic = 'force-dynamic'

export default async function AdminPage() {
  const view = await loadLmsDashboardView('admin')

  return <AdminDashboard view={view} />
}
