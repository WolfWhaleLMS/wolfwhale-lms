import { createClient } from '@/lib/supabase/server';
import { requireRole, getSupabaseUser, getUserTenantId } from '@/lib/auth';
import ParentChildrenClient from './ParentChildrenClient';

export default async function ParentChildrenPage() {
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
    .select('student_id, relationship')
    .eq('parent_id', user.id)
    .eq('tenant_id', tenantId);

  const studentIds = (studentLinks || []).map((l) => l.student_id);

  if (studentIds.length === 0) {
    return (
      <div className="min-h-screen bg-gradient-to-br from-slate-50 via-green-50 to-emerald-50 dark:from-slate-950 dark:via-green-950 dark:to-emerald-950 p-4 md:p-8">
        <div className="max-w-7xl mx-auto">
          <h1 className="text-4xl md:text-5xl font-bold text-slate-900 dark:text-white mb-2">My Children</h1>
          <p className="text-lg text-slate-600 dark:text-slate-400">No children linked to your account yet.</p>
        </div>
      </div>
    );
  }

  // Get profiles
  const { data: childProfiles } = await supabase
    .from('profiles')
    .select('id, first_name, last_name, avatar_url')
    .in('id', studentIds);

  // Get enrollments with grades
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('student_id, course_id, grade_numeric, grade_letter, courses(grade_level)')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds)
    .eq('status', 'active');

  // Get attendance
  const { data: attendanceRecords } = await supabase
    .from('attendance_records')
    .select('student_id, status')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds);

  // Get grades
  const { data: grades } = await supabase
    .from('grades')
    .select('student_id, course_id, percentage')
    .eq('tenant_id', tenantId)
    .in('student_id', studentIds);

  // Get assignments that are missing (past due, no submission)
  const courseIds = [...new Set((enrollments || []).map((e) => e.course_id))];
  const { data: pastDueAssignments } = courseIds.length > 0
    ? await supabase
        .from('assignments')
        .select('id, course_id')
        .eq('tenant_id', tenantId)
        .in('course_id', courseIds)
        .lt('due_date', new Date().toISOString().split('T')[0])
        .eq('status', 'published')
    : { data: [] };

  const { data: submissions } = courseIds.length > 0
    ? await supabase
        .from('submissions')
        .select('student_id, assignment_id')
        .eq('tenant_id', tenantId)
        .in('student_id', studentIds)
    : { data: [] };

  // Build children data
  const children = (childProfiles || []).map((profile) => {
    const childEnrollments = (enrollments || []).filter((e) => e.student_id === profile.id);
    const childGrades = (grades || []).filter((g) => g.student_id === profile.id);
    const childAttendance = (attendanceRecords || []).filter((a) => a.student_id === profile.id);

    // GPA calculation
    const gradeValues = childGrades.map((g) => g.percentage).filter((p): p is number => p !== null);
    const avgPercentage = gradeValues.length > 0
      ? gradeValues.reduce((sum, g) => sum + g, 0) / gradeValues.length
      : 0;
    // Convert percentage to 4.0 GPA scale
    const gpa = avgPercentage >= 93 ? 4.0
      : avgPercentage >= 90 ? 3.7
      : avgPercentage >= 87 ? 3.3
      : avgPercentage >= 83 ? 3.0
      : avgPercentage >= 80 ? 2.7
      : avgPercentage >= 77 ? 2.3
      : avgPercentage >= 73 ? 2.0
      : avgPercentage >= 70 ? 1.7
      : avgPercentage >= 67 ? 1.3
      : avgPercentage >= 60 ? 1.0
      : 0.0;

    // Attendance rate
    const totalAttendance = childAttendance.length;
    const presentCount = childAttendance.filter(
      (a) => a.status === 'present' || a.status === 'online'
    ).length;
    const attendanceRate = totalAttendance > 0
      ? Math.round((presentCount / totalAttendance) * 100)
      : 100;

    // Missing work count
    const childCourseIds = childEnrollments.map((e) => e.course_id);
    const childPastDue = (pastDueAssignments || []).filter((a) => childCourseIds.includes(a.course_id));
    const childSubmissionAssignmentIds = (submissions || [])
      .filter((s) => s.student_id === profile.id)
      .map((s) => s.assignment_id);
    const missingWork = childPastDue.filter((a) => !childSubmissionAssignmentIds.includes(a.id)).length;

    // Grade level from first enrollment
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
      attendanceRate,
      missingWork,
      level: 0,
      xp: 0,
      nextLevelXp: 100,
      petEmoji: '',
      petName: '',
    };
  });

  return <ParentChildrenClient children={children} />;
}
