import { NextRequest, NextResponse } from 'next/server'
import { localPathWithParams, localRedirect } from '@/lib/http/redirects'
import { buildSisExportPackage } from '@/lib/lms/exports'
import { loadDashboardForCurrentUser } from '@/lib/lms/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(_request: NextRequest) {
  try {
    const dashboard = await loadDashboardForCurrentUser(await createClient())
    if (dashboard.role !== 'admin') {
      return NextResponse.json({ error: 'sis_export_not_allowed' }, { status: 403 })
    }

    return NextResponse.json(buildSisExportPackage(dashboard.records, dashboard.views.admin), {
      headers: {
        'content-disposition': 'attachment; filename="wolfwhale-sis-export.json"',
      },
    })
  } catch {
    return localRedirect(localPathWithParams('/login', { next: '/admin' }), 303)
  }
}
