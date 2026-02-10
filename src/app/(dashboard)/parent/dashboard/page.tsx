import { createClient } from '@/lib/supabase/server';
import { requireRole, getSupabaseUser, getUserTenantId } from '@/lib/auth';
import ParentDashboardClient from './ParentDashboardClient';

export default async function ParentDashboardPage() {
  await requireRole(['parent']);
  const user = await getSupabaseUser();
  const tenantId = await getUserTenantId();
  const supabase = await createClient();

  if (!user || !tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">Unable to load parent data.</p>
      </div>
    );
  }

  // Get linked children (students) for this parent
  const { data: studentLinks } = await supabase
    .from('student_parents')
    .select('student_id, relationship')
    .eq('parent_id', user.id)
    .eq('tenant_id', tenantId);

  const studentIds = (studentLinks || []).map((l) => l.student_id);

  if (studentIds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">Parent Dashboard</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">No children linked to your account yet.</p>
        </div>
      </div>
    );
  }

  // Get profiles for all children
  const { data: childProfiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .in('id', studentIds);

  // Get course enrollments with course info for all children
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('student_id, course_id, grade_numeric, grade_letter, courses(id, name, subject, grade_level)')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds)
    .eq('status', 'active');

  // Get attendance records for all children
  const { data: attendanceRecords } = await supabase
    .from('attendance_records')
    .select('student_id, status')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds);

  // Get upcoming assignments for enrolled courses
  const courseIds = [...new Set((enrollments || []).map((e) => e.course_id))];
  const { data: assignments } = courseIds.length > 0
    ? await supabase
        .from('assignments')
        .select('id, title, due_date, course_id, status')
        .eq('tenant_id', tenantId)
        .in('course_id', courseIds)
        .gte('due_date', new Date().toISOString().split('T')[0])
        .order('due_date', { ascending: true })
        .limit(10)
    : { data: [] };

  // Get submissions for children to determine assignment status
  const { data: submissions } = courseIds.length > 0
    ? await supabase
        .from('submissions')
        .select('student_id, assignment_id, status')
        .eq('tenant_id', tenantId)
        .in('student_id', studentIds)
    : { data: [] };

  // Get grades for all children
  const { data: grades } = await supabase
    .from('grades')
    .select('student_id, course_id, percentage, letter_grade, assignment_id')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds);

  // Get teachers for the enrolled courses
  const teacherIds = [...new Set((enrollments || []).map((e: any) => e.courses?.created_by).filter(Boolean))];
  // Also get teacher IDs from course_enrollments teacher_id field
  const enrollmentTeacherIds = [...new Set((enrollments || []).map((e) => (e as any).teacher_id).filter(Boolean))];
  const allTeacherIds = [...new Set([...teacherIds, ...enrollmentTeacherIds])];

  const { data: teacherProfiles } = allTeacherIds.length > 0
    ? await supabase
        .from('profiles')
        .select('id, first_name, last_name')
        .in('id', allTeacherIds)
    : { data: [] };

  // Build children data for the client component
  const children = (childProfiles || []).map((profile) => {
    const childEnrollments = (enrollments || []).filter((e) => e.student_id === profile.id);
    const childGrades = (grades || []).filter((g) => g.student_id === profile.id);
    const childAttendance = (attendanceRecords || []).filter((a) => a.student_id === profile.id);

    const totalAttendance = childAttendance.length;
    const presentCount = childAttendance.filter((a) => a.status === 'present' || a.status === 'online').length;
    const attendanceRate = totalAttendance > 0 ? Math.round((presentCount / totalAttendance) * 100) : 100;

    // Calculate average grade across all courses
    const courseGrades = childEnrollments.map((enrollment) => {
      const courseGradesForCourse = childGrades.filter((g) => g.course_id === enrollment.course_id);
      if (courseGradesForCourse.length > 0) {
        const avg = courseGradesForCourse.reduce((sum, g) => sum + (g.percentage || 0), 0) / courseGradesForCourse.length;
        return avg;
      }
      return enrollment.grade_numeric || null;
    }).filter((g): g is number => g !== null);

    const currentGrade = courseGrades.length > 0
      ? Math.round(courseGrades.reduce((sum, g) => sum + g, 0) / courseGrades.length)
      : 0;

    // Get grade level from first enrollment
    const gradeLevel = childEnrollments[0]
      ? (childEnrollments[0] as any).courses?.grade_level || ''
      : '';

    // Build classes with grades
    const classes = childEnrollments.map((enrollment) => {
      const course = (enrollment as any).courses;
      const courseGradesForCourse = childGrades.filter((g) => g.course_id === enrollment.course_id);
      const avgGrade = courseGradesForCourse.length > 0
        ? Math.round(courseGradesForCourse.reduce((sum, g) => sum + (g.percentage || 0), 0) / courseGradesForCourse.length)
        : enrollment.grade_numeric || 0;
      return {
        name: course?.name || 'Unknown Course',
        grade: avgGrade,
      };
    });

    return {
      id: profile.id,
      name: `${profile.first_name || ''} ${profile.last_name || ''}`.trim() || 'Unknown',
      grade: gradeLevel,
      avatar: profile.avatar_url,
      currentGrade,
      attendanceRate,
      classes,
    };
  });

  // Build assignments data
  const assignmentsData = (assignments || []).map((a) => {
    const hasSubmission = (submissions || []).some(
      (s) => s.assignment_id === a.id && studentIds.includes(s.student_id)
    );
    const dueDate = new Date(a.due_date);
    const now = new Date();
    const diffDays = Math.ceil((dueDate.getTime() - now.getTime()) / (1000 * 60 * 60 * 24));
    let dueDateStr = a.due_date;
    if (diffDays === 0) dueDateStr = 'Today';
    else if (diffDays === 1) dueDateStr = 'Tomorrow';
    else if (diffDays < 7) {
      dueDateStr = dueDate.toLocaleDateString('en-US', { month: 'short', day: 'numeric' });
    }

    return {
      title: a.title,
      dueDate: dueDateStr,
      status: hasSubmission ? 'in_progress' : 'not_started',
    };
  });

  // Build teachers data
  const teachersData = (teacherProfiles || []).map((t) => {
    const teacherCourseNames = (enrollments || [])
      .filter((e: any) => e.teacher_id === t.id || (e as any).courses?.created_by === t.id)
      .map((e: any) => (e as any).courses?.name)
      .filter(Boolean);
    const courseName = teacherCourseNames[0] || '';
    const displayName = `${t.first_name || ''} ${t.last_name || ''}`.trim();
    return courseName ? `${displayName} (${courseName})` : displayName;
  });

  return (
    <ParentDashboardClient
      children={children}
      assignments={assignmentsData}
      teachers={teachersData}
    />
  );
}
