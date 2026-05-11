import { NextRequest, NextResponse } from 'next/server'
import { localPathWithParams, localRedirect } from '@/lib/http/redirects'
import { buildAuditLogCsv } from '@/lib/lms/exports'
import { loadDashboardForCurrentUser } from '@/lib/lms/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest) {
  try {
    const dashboard = await loadDashboardForCurrentUser(await createClient())

    if (dashboard.role !== 'admin') {
      return NextResponse.json({ error: 'audit_export_not_allowed' }, { status: 403 })
    }

    return new NextResponse(buildAuditLogCsv(dashboard.views.admin.auditTrail), {
      headers: {
        'content-type': 'text/csv; charset=utf-8',
        'content-disposition': 'attachment; filename="wolfwhale-audit-log.csv"',
      },
    })
  } catch {
    return localRedirect(localPathWithParams('/login', { next: '/admin' }), 303)
  }
}
