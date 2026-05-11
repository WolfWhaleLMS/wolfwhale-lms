import { NextRequest, NextResponse } from 'next/server'
import { localPathWithParams, localRedirect } from '@/lib/http/redirects'
import { buildMessagesCsv } from '@/lib/lms/exports'
import { loadDashboardForCurrentUser } from '@/lib/lms/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest) {
  try {
    const dashboard = await loadDashboardForCurrentUser(await createClient())
    const messages = dashboard.role === 'admin' ? dashboard.views.admin.messages : dashboard.role === 'teacher' ? dashboard.views.teacher.messages : null

    if (!messages) {
      return NextResponse.json({ error: 'message_export_not_allowed' }, { status: 403 })
    }

    return new NextResponse(buildMessagesCsv(messages), {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="wolfwhale-messages.csv"',
      },
    })
  } catch {
    return localRedirect(localPathWithParams('/login', { next: '/admin' }), 303)
  }
}
