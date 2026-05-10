import { NextRequest, NextResponse } from 'next/server'
import { localPathWithParams, localRedirect } from '@/lib/http/redirects'
import { buildGradebookCsv } from '@/lib/lms/exports'
import { loadDashboardForCurrentUser } from '@/lib/lms/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest) {
  try {
    const dashboard = await loadDashboardForCurrentUser(await createClient())
    const gradebook = dashboard.role === 'admin' ? dashboard.views.admin.gradebook : dashboard.role === 'teacher' ? dashboard.views.teacher.gradebook : null

    if (!gradebook) {
      return NextResponse.json({ error: 'gradebook_export_not_allowed' }, { status: 403 })
    }

    return new NextResponse(buildGradebookCsv(gradebook), {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="wolfwhale-gradebook.csv"',
      },
    })
  } catch {
    return localRedirect(localPathWithParams('/login', { next: '/admin' }), 303)
  }
}
