import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withRole } from '@/lib/api';
import { apiResponse, apiError } from '@/lib/api';

type ReportType = 'enrollment' | 'grades' | 'attendance' | 'engagement';

/**
 * GET /api/admin/reports
 * Fetch school-wide reports (admin only)
 */
export const GET = withRole(['admin', 'super_admin'], async (req, opts) => {
  try {
    const supabase = await createClient();
    const searchParams = req.nextUrl.searchParams;
    const reportType = searchParams.get('type') as ReportType;
    const startDate = searchParams.get('startDate');
    const endDate = searchParams.get('endDate');
    const classId = searchParams.get('classId');

    let report: any = {};

    switch (reportType) {
      case 'enrollment': {
        // Enrollment statistics
        const { data: totalStudents } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', opts.tenantId)
          .eq('role', 'student');

        const { data: totalTeachers } = await supabase
          .from('user_profiles')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', opts.tenantId)
          .eq('role', 'teacher');

        const { data: totalClasses } = await supabase
          .from('classes')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', opts.tenantId);

        const { data: enrollmentsByGrade } = await supabase
          .from('user_profiles')
          .select('grade_level')
          .eq('tenant_id', opts.tenantId)
          .eq('role', 'student');

        // Group by grade level
        const gradeGrouped: Record<number, number> = {};
        enrollmentsByGrade?.forEach((student) => {
          const grade = student.grade_level || 0;
          gradeGrouped[grade] = (gradeGrouped[grade] || 0) + 1;
        });

        report = {
          totalStudents: totalStudents?.length || 0,
          totalTeachers: totalTeachers?.length || 0,
          totalClasses: totalClasses?.length || 0,
          enrollmentsByGrade: Object.entries(gradeGrouped).map(([grade, count]) => ({
            grade: parseInt(grade),
            count,
          })),
        };
        break;
      }

      case 'grades': {
        // Grade distribution report
        const { data: grades } = await supabase
          .from('grades')
          .select('score')
          .eq('tenant_id', opts.tenantId);

        if (classId) {
          // Filter by class
          const { data: classGrades } = await supabase
            .from('grades')
            .select('score')
            .eq('class_id', classId)
            .eq('tenant_id', opts.tenantId);

          const distribution = calculateGradeDistribution(classGrades || []);
          report = {
            classId,
            distribution,
            average: (classGrades ?? []).reduce((sum, g) => sum + g.score, 0) / (classGrades?.length || 1) || 0,
            count: classGrades?.length || 0,
          };
        } else {
          const distribution = calculateGradeDistribution(grades || []);
          report = {
            distribution,
            average: (grades ?? []).reduce((sum, g) => sum + g.score, 0) / (grades?.length || 1) || 0,
            count: grades?.length || 0,
          };
        }
        break;
      }

      case 'attendance': {
        // Attendance report
        let query = supabase
          .from('attendance')
          .select('status')
          .eq('tenant_id', opts.tenantId);

        if (startDate) {
          query = query.gte('record_date', startDate);
        }

        if (endDate) {
          query = query.lte('record_date', endDate);
        }

        if (classId) {
          query = query.eq('class_id', classId);
        }

        const { data: attendance } = await query;

        const statusCounts = { present: 0, absent: 0, late: 0, excused: 0 };
        attendance?.forEach((record) => {
          statusCounts[record.status as keyof typeof statusCounts] =
            (statusCounts[record.status as keyof typeof statusCounts] || 0) + 1;
        });

        const totalRecords = attendance?.length || 1;
        const attendanceRate =
          ((statusCounts.present + statusCounts.late) / totalRecords) * 100 || 0;

        report = {
          statusCounts,
          attendanceRate: Math.round(attendanceRate),
          totalRecords,
          dateRange: { startDate, endDate },
        };
        break;
      }

      case 'engagement': {
        // Engagement and XP report
        const { data: xpData } = await supabase
          .from('student_xp')
          .select('total_xp, student_id')
          .eq('tenant_id', opts.tenantId);

        const { data: submissions } = await supabase
          .from('assignment_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', opts.tenantId);

        const { count: completedCount } = await supabase
          .from('assignment_submissions')
          .select('*', { count: 'exact', head: true })
          .eq('tenant_id', opts.tenantId)
          .eq('status', 'graded');

        const avgXP = (xpData ?? []).reduce((sum, u) => sum + u.total_xp, 0) / (xpData?.length || 1) || 0;
        const completionRate =
          ((completedCount || 0) / (submissions?.length || 1)) * 100 || 0;

        report = {
          averageXP: Math.round(avgXP),
          totalAssignmentsSubmitted: submissions?.length || 0,
          completedAssignments: completedCount || 0,
          completionRate: Math.round(completionRate),
          topStudents: (xpData || [])
            .sort((a, b) => b.total_xp - a.total_xp)
            .slice(0, 10),
        };
        break;
      }

      default:
        return apiError('Invalid report type', 400, 'INVALID_TYPE');
    }

    return apiResponse({
      type: reportType,
      generatedAt: new Date().toISOString(),
      ...report,
    });
  } catch (error) {
    console.error('Error generating report:', error);
    return apiError('Failed to generate report', 500, 'REPORT_ERROR');
  }
});

/**
 * Helper function to calculate grade distribution
 */
function calculateGradeDistribution(
  grades: Array<{ score: number }>
): Record<string, number> {
  const distribution: Record<string, number> = {
    'A (90-100)': 0,
    'B (80-89)': 0,
    'C (70-79)': 0,
    'D (60-69)': 0,
    'F (Below 60)': 0,
  };

  grades.forEach((grade) => {
    if (grade.score >= 90) {
      distribution['A (90-100)']++;
    } else if (grade.score >= 80) {
      distribution['B (80-89)']++;
    } else if (grade.score >= 70) {
      distribution['C (70-79)']++;
    } else if (grade.score >= 60) {
      distribution['D (60-69)']++;
    } else {
      distribution['F (Below 60)']++;
    }
  });

  return distribution;
}
