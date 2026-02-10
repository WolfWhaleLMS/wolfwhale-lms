import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { getParentProgressReport } from '@/app/actions/reports'
import { ReportDocument, StatRow, Table, renderToBuffer } from '@/lib/export/pdf'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  try {
    const { studentId } = await params
    const report = await getParentProgressReport(studentId)

    const doc = React.createElement(
      ReportDocument,
      {
        title: `Progress Report: ${report.student.name}`,
        subtitle: report.student.gradeLevel ? `Grade ${report.student.gradeLevel}` : undefined,
      },
      React.createElement(StatRow, {
        stats: [
          { label: 'Overall GPA', value: report.summary.gpa != null ? `${report.summary.gpa}% (${report.summary.gpaLetter})` : 'N/A' },
          { label: 'Active Courses', value: String(report.summary.activeCourses) },
          { label: 'Attendance', value: `${report.summary.attendanceRate}%` },
          { label: 'Assignments Graded', value: String(report.summary.totalGrades) },
        ],
      }),
      React.createElement(Table, {
        columns: [
          { key: 'assignment', header: 'Assignment', width: 2 },
          { key: 'course', header: 'Course', width: 2 },
          { key: 'percentage', header: '%', width: 1 },
          { key: 'letter', header: 'Grade', width: 1 },
          { key: 'date', header: 'Date', width: 1 },
        ],
        rows: report.grades,
      })
    )

    const buffer = await renderToBuffer(doc as any)
    const filename = `${report.student.name.replace(/[^a-zA-Z0-9]/g, '_')}_progress.pdf`

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
