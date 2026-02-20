import React from 'react'
import { NextRequest, NextResponse } from 'next/server'
import { getParentProgressReport } from '@/app/actions/reports'
import { ReportDocument, StatRow, Table, renderToBuffer, PDF_MAX_ROWS } from '@/lib/export/pdf'
import { apiErrorResponse, rateLimitRoute, REPORT_DOWNLOAD_HEADERS } from '@/lib/api-route-helpers'

export async function GET(
  _req: NextRequest,
  { params }: { params: Promise<{ studentId: string }> }
) {
  const blocked = await rateLimitRoute('parent-student-pdf', 'report')
  if (blocked) return blocked

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
        rows: report.grades.slice(0, PDF_MAX_ROWS),
      })
    )

    // renderToBuffer expects ReactElement<DocumentProps>; createElement returns a wider type
    // when multiple children are passed — cast through unknown to satisfy the constraint
    const buffer = await renderToBuffer(doc as unknown as React.ReactElement<import('@react-pdf/renderer').DocumentProps>)
    const filename = `${report.student.name.replace(/[^a-zA-Z0-9]/g, '_')}_progress.pdf`

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': `attachment; filename="${filename}"`,
        ...REPORT_DOWNLOAD_HEADERS,
      },
    })
  } catch (error: unknown) {
    return apiErrorResponse(error)
  }
}
