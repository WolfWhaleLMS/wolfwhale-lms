import { NextRequest, NextResponse } from 'next/server'
import { getTeacherClassReport } from '@/app/actions/reports'
import { arrayToCSV } from '@/lib/export/csv'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const report = await getTeacherClassReport(courseId)

    // Build CSV columns: Student, each assignment, Overall
    const columns = [
      { key: 'name', header: 'Student' },
      ...report.assignments.map((a) => ({
        key: `a_${a.id}`,
        header: `${a.title} (/${a.max_points})`,
      })),
      { key: 'overall_pct', header: 'Overall %' },
      { key: 'overall_letter', header: 'Overall Grade' },
    ]

    const data = report.students.map((s) => {
      const row: Record<string, unknown> = { name: s.name }
      for (const a of report.assignments) {
        const g = s.grades[a.id]
        row[`a_${a.id}`] = g ? `${g.points}/${a.max_points} (${Math.round(g.pct)}%)` : 'N/A'
      }
      row.overall_pct = s.overallPct != null ? `${s.overallPct}%` : 'N/A'
      row.overall_letter = s.overallLetter || 'N/A'
      return row
    })

    const csv = arrayToCSV(data, columns)
    const filename = `${report.course.name.replace(/[^a-zA-Z0-9]/g, '_')}_gradebook.csv`

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
