import { NextRequest, NextResponse } from 'next/server'
import { getParentProgressReport } from '@/app/actions/reports'
import { arrayToCSV } from '@/lib/export/csv'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params
    const report = await getParentProgressReport(studentId)

    const columns = [
      { key: 'assignment', header: 'Assignment' },
      { key: 'course', header: 'Course' },
      { key: 'score', header: 'Score' },
      { key: 'percentage', header: 'Percentage' },
      { key: 'letter', header: 'Grade' },
      { key: 'date', header: 'Date' },
    ]

    const csv = arrayToCSV(report.grades, columns)
    const filename = `${report.student.name.replace(/[^a-zA-Z0-9]/g, '_')}_progress.csv`

    return new NextResponse(csv, {
      headers: {
        'Content-Type': 'text/csv; charset=utf-8',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }
}
