import React from 'react'
import { NextResponse } from 'next/server'
import { getAdminSchoolReport } from '@/app/actions/reports'
import { ReportDocument, StatRow, Table, renderToBuffer } from '@/lib/export/pdf'

export async function GET() {
  try {
    const report = await getAdminSchoolReport()

    const doc = React.createElement(
      ReportDocument,
      { title: 'School Report', subtitle: 'Overview of courses, users, and attendance' },
      React.createElement(StatRow, {
        stats: [
          { label: 'Total Users', value: String(report.summary.totalUsers) },
          { label: 'Active Users', value: String(report.summary.activeUsers) },
          { label: 'Courses', value: String(report.summary.totalCourses) },
          { label: 'Attendance Rate', value: `${report.summary.attendanceRate}%` },
        ],
      }),
      React.createElement(Table, {
        columns: [
          { key: 'name', header: 'Course', width: 2 },
          { key: 'teacher', header: 'Teacher', width: 2 },
          { key: 'students', header: 'Students', width: 1 },
          { key: 'status', header: 'Status', width: 1 },
        ],
        rows: report.courses,
      })
    )

    const buffer = await renderToBuffer(doc as any)

    return new NextResponse(buffer, {
      headers: {
        'Content-Type': 'application/pdf',
        'Content-Disposition': 'attachment; filename="school_report.pdf"',
      },
    })
  } catch (error: any) {
    return NextResponse.json({ error: error.message }, { status: 403 })
  }
}
