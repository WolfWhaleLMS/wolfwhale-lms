export const dynamic = 'force-dynamic'

import { getStudentDashboardData } from './dashboard-data'
import { StudentDashboardView } from './dashboard-view'

export default async function StudentDashboardPage() {
  const dashboardData = await getStudentDashboardData()

  return <StudentDashboardView data={dashboardData} />
}
