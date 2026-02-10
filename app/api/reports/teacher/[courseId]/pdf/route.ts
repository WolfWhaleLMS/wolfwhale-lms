import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { getTeacherClassReport } from '@/app/actions/reports'
import { ReportDocument, StatRow, Table, renderToBuffer } from '@/lib/export/pdf'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ courseId: string }> }
) {
  try {
    const { courseId } = await params
    const report = await getTeacherClassReport(courseId)

    const columns = [
      { key: 'name', header: 'Student', width: 2 },
      ...report.assignments.map((a) => ({
        key: a.id,
        header: a.title,
        width: 1,
      })),
      { key: 'overall', header: 'Overall', width: 1 },
    ]

    const rows = report.students.map((s) => {
      const row: Record<string, string | number> = { name: s.name }
      for (const a of report.assignments) {
        const g = s.grades[a.id]
        row[a.id] = g ? `${Math.round(g.pct)}%` : '-'
      }
      row.overall = s.overallLetter ? `${s.overallLetter} (${s.overallPct}%)` : '-'
      return row
    })

    const doc = React.createElement(
      ReportDocument,
      {
        title: `Class Report: ${report.course.name}`,
        subtitle: `${report.students.length} students, ${report.assignments.length} assignments`,
      },
      React.createElement(StatRow, {
        stats: [
          { label: 'Students', value: String(report.students.length) },
          { label: 'Assignments', value: String(report.assignments.length) },
          { label: 'Class Average', value: report.classAverage != null ? `${report.classAverage}%` : 'N/A' },
        ],
      }),
      React.createElement(Table, { columns, rows })
    )

    const buffer = await renderToBuffer(doc as any)
    const filename = `${report.course.name.replace(/[^a-zA-Z0-9]/g, '_')}_report.pdf`

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }
}
