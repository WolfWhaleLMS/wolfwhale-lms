import { NextResponse } from 'next/server'
import { getAdminSchoolReport } from '@/app/actions/reports'
import { arrayToCSV } from '@/lib/export/csv'

export async function GET() {
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
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }
}
