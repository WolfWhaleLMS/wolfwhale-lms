import { NextRequest, NextResponse } from 'next/server'
import { localPathWithParams, localRedirect } from '@/lib/http/redirects'
import { buildAttendanceCsv } from '@/lib/lms/exports'
import { loadDashboardForCurrentUser } from '@/lib/lms/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest) {
  try {
    const dashboard = await loadDashboardForCurrentUser(await createClient())
    const attendance = dashboard.role === 'admin' ? dashboard.views.admin.attendance : dashboard.role === 'teacher' ? dashboard.views.teacher.attendance : null

    if (!attendance) {
      return NextResponse.json({ error: 'attendance_export_not_allowed' }, { status: 403 })
    }

    return new NextResponse(buildAttendanceCsv(attendance), {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="wolfwhale-attendance.csv"',
      },
    })
  } catch {
    return localRedirect(localPathWithParams('/login', { next: '/admin' }), 303)
  }
}
