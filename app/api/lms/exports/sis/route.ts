import { NextRequest, NextResponse } from 'next/server'
import { buildSisExportPackage } from '@/lib/lms/exports'
import { loadDashboardForCurrentUser } from '@/lib/lms/server'
import { createClient } from '@/lib/supabase/server'

export async function GET(request: NextRequest) {
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
    const destination = new URL('/login', request.url)
    destination.searchParams.set('next', '/admin')
    return NextResponse.redirect(destination, { status: 303 })
  }
}
