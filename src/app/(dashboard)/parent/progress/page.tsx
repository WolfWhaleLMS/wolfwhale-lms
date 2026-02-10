import { createClient } from '@/lib/supabase/server';
import { requireRole, getSupabaseUser, getUserTenantId } from '@/lib/auth';
import ParentProgressClient from './ParentProgressClient';

export default async function ParentProgressPage() {
  await requireRole(['parent']);
  const user = await getSupabaseUser();
  const tenantId = await getUserTenantId();
  const supabase = await createClient();

  if (!user || !tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Unable to load data.</p>
      </div>
    );
  }

  // Get linked children
  const { data: studentLinks } = await supabase
    .from('student_parents')
    .select('student_id')
    .eq('parent_id', user.id)
    .eq('tenant_id', tenantId);

  const studentIds = (studentLinks || []).map((l) => l.student_id);

  if (studentIds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">Academic Progress</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">No children linked to your account.</p>
        </div>
      </div>
    );
  }

  // Get profiles
  const { data: childProfiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .in('id', studentIds);

  // Get enrollments with course data
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('student_id, course_id, grade_numeric, teacher_id, courses(id, name, subject, grade_level)')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds)
    .eq('status', 'active');

  // Get grades
  const { data: grades } = await supabase
    .from('grades')
    .select('student_id, course_id, percentage, letter_grade, assignment_id')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds);

  // Get attendance
  const { data: attendanceRecords } = await supabase
    .from('attendance_records')
    .select('student_id, status, attendance_date')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds);

  // Get assignments
  const courseIds = [...new Set((enrollments || []).map((e) => e.course_id))];
  const { data: allAssignments } = courseIds.length > 0
    ? await supabase
        .from('assignments')
        .select('id, title, due_date, course_id, max_points, status')
        .eq('tenant_id', tenantId)
        .in('course_id', courseIds)
        .order('due_date', { ascending: false })
    : { data: [] };

  // Get submissions
  const { data: submissions } = courseIds.length > 0
    ? await supabase
        .from('submissions')
        .select('student_id, assignment_id, status')
        .eq('tenant_id', tenantId)
        .in('student_id', studentIds)
    : { data: [] };

  // Get teacher profiles
  const teacherIds = [...new Set((enrollments || []).map((e) => e.teacher_id).filter(Boolean))];
  const { data: teacherProfiles } = teacherIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', teacherIds)
    : { data: [] };

  // Build child options
  const childOptions = (childProfiles || []).map((profile) => {
    const childGrades = (grades || []).filter((g) => g.student_id === profile.id);
    const gradeValues = childGrades.map((g) => g.percentage).filter((p): p is number => p !== null);
    const avgPercentage = gradeValues.length > 0
      ? gradeValues.reduce((sum, g) => sum + g, 0) / gradeValues.length
      : 0;
    const gpa = avgPercentage >= 93 ? 4.0 : avgPercentage >= 90 ? 3.7 : avgPercentage >= 87 ? 3.3 : avgPercentage >= 83 ? 3.0 : avgPercentage >= 80 ? 2.7 : avgPercentage >= 77 ? 2.3 : avgPercentage >= 73 ? 2.0 : avgPercentage >= 70 ? 1.7 : avgPercentage >= 60 ? 1.0 : 0;

    const childEnrollments = (enrollments || []).filter((e) => e.student_id === profile.id);
    const gradeLevel = childEnrollments[0]
      ? (childEnrollments[0] as any).courses?.grade_level || ''
      : '';

    return {
      id: profile.id,
      firstName: profile.first_name || '',
      lastName: profile.last_name || '',
      gradeLevel,
      avatarUrl: profile.avatar_url,
      gpa: Math.round(gpa * 10) / 10,
    };
  });

  // Build classes data per child
  const classesByChild: Record<string, any[]> = {};
  for (const profile of (childProfiles || [])) {
    const childEnrollments = (enrollments || []).filter((e) => e.student_id === profile.id);
    const childGrades = (grades || []).filter((g) => g.student_id === profile.id);

    classesByChild[profile.id] = childEnrollments.map((enrollment) => {
      const course = (enrollment as any).courses;
      const courseGrades = childGrades.filter((g) => g.course_id === enrollment.course_id);
      const avgGrade = courseGrades.length > 0
        ? Math.round(courseGrades.reduce((sum, g) => sum + (g.percentage || 0), 0) / courseGrades.length)
        : enrollment.grade_numeric || 0;

      const letterGrade = avgGrade >= 93 ? 'A' : avgGrade >= 90 ? 'A-' : avgGrade >= 87 ? 'B+' : avgGrade >= 83 ? 'B' : avgGrade >= 80 ? 'B-' : avgGrade >= 77 ? 'C+' : avgGrade >= 73 ? 'C' : avgGrade >= 70 ? 'C-' : avgGrade >= 60 ? 'D' : 'F';

      // Get teacher name
      const teacher = (teacherProfiles || []).find((t) => t.id === enrollment.teacher_id);
      const teacherName = teacher
        ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim()
        : 'TBD';

      // Get assignments for this course
      const courseAssignments = (allAssignments || []).filter((a) => a.course_id === enrollment.course_id);
      const assignmentsList = courseAssignments.slice(0, 5).map((a) => {
        const submission = (submissions || []).find(
          (s) => s.assignment_id === a.id && s.student_id === profile.id
        );
        const grade = courseGrades.find((g) => g.assignment_id === a.id);
        return {
          id: a.id,
          title: a.title,
          dueDate: a.due_date,
          maxPoints: a.max_points,
          pointsEarned: grade?.percentage ? Math.round((grade.percentage / 100) * a.max_points) : null,
          percentage: grade?.percentage || null,
          status: submission ? submission.status as string : (new Date(a.due_date) < new Date() ? 'missing' : 'upcoming'),
        };
      });

      return {
        id: enrollment.course_id,
        name: course?.name || 'Unknown',
        teacher: teacherName,
        currentGrade: avgGrade,
        letterGrade,
        trend: 'stable' as const,
        gradeHistory: [avgGrade],
        assignments: assignmentsList,
      };
    });
  }

  // Build attendance data per child
  const attendanceByChild: Record<string, { records: any[]; stats: any }> = {};
  for (const profile of (childProfiles || [])) {
    const childAttendance = (attendanceRecords || []).filter((a) => a.student_id === profile.id);
    const total = childAttendance.length;
    const present = childAttendance.filter((a) => a.status === 'present' || a.status === 'online').length;
    const absent = childAttendance.filter((a) => a.status === 'absent').length;
    const tardy = childAttendance.filter((a) => a.status === 'tardy').length;
    const excused = childAttendance.filter((a) => a.status === 'excused').length;
    const rate = total > 0 ? Math.round((present / total) * 100) : 100;

    attendanceByChild[profile.id] = {
      records: childAttendance.map((a) => ({
        date: a.attendance_date,
        status: a.status || 'present',
      })),
      stats: { total, present, absent, tardy, excused, rate },
    };
  }

  // Build assignments data per child
  const assignmentsByChild: Record<string, any[]> = {};
  for (const profile of (childProfiles || [])) {
    const childEnrollments = (enrollments || []).filter((e) => e.student_id === profile.id);
    const childCourseIds = childEnrollments.map((e) => e.course_id);
    const childAssignments = (allAssignments || []).filter((a) => childCourseIds.includes(a.course_id));
    const childGrades = (grades || []).filter((g) => g.student_id === profile.id);

    assignmentsByChild[profile.id] = childAssignments.map((a) => {
      const submission = (submissions || []).find(
        (s) => s.assignment_id === a.id && s.student_id === profile.id
      );
      const grade = childGrades.find((g) => g.assignment_id === a.id);
      const course = childEnrollments.find((e) => e.course_id === a.course_id);
      const courseName = (course as any)?.courses?.name || 'Unknown';

      let status = 'not_started';
      if (submission) {
        status = submission.status === 'graded' ? 'graded' : 'submitted';
      } else if (new Date(a.due_date) < new Date()) {
        status = 'missing';
      }

      return {
        id: a.id,
        title: a.title,
        className: courseName,
        dueDate: a.due_date,
        status,
        grade: grade ? Math.round((grade.percentage || 0) / 100 * a.max_points) : null,
        maxPoints: a.max_points,
      };
    });
  }

  return (
    <ParentProgressClient
      childOptions={childOptions}
      classesByChild={classesByChild}
      attendanceByChild={attendanceByChild}
      assignmentsByChild={assignmentsByChild}
    />
  );
}
