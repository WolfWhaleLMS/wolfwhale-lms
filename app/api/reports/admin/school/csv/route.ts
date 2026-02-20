export const maxDuration = 30

import { NextResponse } from 'next/server'
import { getAdminSchoolReport } from '@/app/actions/reports'
import { arrayToCSV } from '@/lib/export/csv'
import { apiErrorResponse, rateLimitRoute, REPORT_DOWNLOAD_HEADERS } from '@/lib/api-route-helpers'

export async function GET() {
  const blocked = await rateLimitRoute('admin-school-csv', 'report')
  if (blocked) return blocked

  try {
    const report = await getAdminSchoolReport()

    const columns = [
      { key: 'name', header: 'Course Name' },
      { key: 'teacher', header: 'Teacher' },
      { key: 'students', header: 'Students' },
      { key: 'status', header: 'Status' },
      { key: 'createdAt', header: 'Created' },
    ]

    const csv = arrayToCSV(report.courses, columns)

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': 'attachment; filename="school_report.csv"',
        ...REPORT_DOWNLOAD_HEADERS,
      },
    })
  } catch (error: unknown) {
    return apiErrorResponse(error)
  }
}
