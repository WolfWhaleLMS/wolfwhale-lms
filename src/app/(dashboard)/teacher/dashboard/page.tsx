import { redirect } from 'next/navigation';
import { requireRole } from '@/lib/auth';
import { getUser, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { TeacherDashboardClient } from './TeacherDashboardClient';

export default async function TeacherDashboardPage() {
  await requireRole(['teacher', 'admin']);
  const user = await getUser();
  const tenantId = await getUserTenantId();

  if (!user || !tenantId) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Fetch courses taught by this teacher
  const { data: courses } = await supabase
    .from('courses')
    .select('*')
    .eq('tenant_id', tenantId)
    .eq('created_by', user.id)
    .eq('status', 'active')
    .order('name');

  const courseList = courses || [];
  const courseIds = courseList.map((c) => c.id);

  // Fetch total enrolled students across all courses
  let totalStudents = 0;
  let enrollmentsByCoursId: Record<string, number> = {};
  if (courseIds.length > 0) {
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('id, course_id')
      .eq('tenant_id', tenantId)
      .in('course_id', courseIds)
      .eq('status', 'active');

    if (enrollments) {
      totalStudents = enrollments.length;
      enrollments.forEach((e) => {
        enrollmentsByCoursId[e.course_id] = (enrollmentsByCoursId[e.course_id] || 0) + 1;
      });
    }
  }

  // Fetch recent submissions needing grading across teacher's courses
  let recentSubmissions: Array<{
    id: string;
    studentName: string;
    assignmentTitle: string;
    submittedAt: string;
    status: 'pending' | 'reviewed';
    courseName: string;
  }> = [];

  if (courseIds.length > 0) {
    const { data: assignments } = await supabase
      .from('assignments')
      .select('id, title, course_id')
      .eq('tenant_id', tenantId)
      .in('course_id', courseIds);

    const assignmentList = assignments || [];
    const assignmentIds = assignmentList.map((a) => a.id);
    const assignmentMap = Object.fromEntries(assignmentList.map((a) => [a.id, a]));

    if (assignmentIds.length > 0) {
      const { data: submissions } = await supabase
        .from('submissions')
        .select('id, assignment_id, student_id, status, submitted_at')
        .eq('tenant_id', tenantId)
        .in('assignment_id', assignmentIds)
        .order('submitted_at', { ascending: false })
        .limit(10);

      if (submissions && submissions.length > 0) {
        const studentIds = [...new Set(submissions.map((s) => s.student_id))];
        const { data: profiles } = await supabase
          .from('profiles')
          .select('id, first_name, last_name')
          .in('id', studentIds);

        const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));
        const courseMap = Object.fromEntries(courseList.map((c) => [c.id, c]));

        recentSubmissions = submissions.map((s) => {
          const profile = profileMap[s.student_id];
          const assignment = assignmentMap[s.assignment_id];
          const course = assignment ? courseMap[assignment.course_id] : null;
          return {
            id: s.id,
            studentName: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
            assignmentTitle: assignment?.title || 'Unknown',
            submittedAt: s.submitted_at,
            status: (s.status === 'graded' ? 'reviewed' : 'pending') as 'pending' | 'reviewed',
            courseName: course?.name || '',
          };
        });
      }
    }
  }

  // Fetch pending (ungraded) submission count
  let pendingGradesCount = 0;
  if (courseIds.length > 0) {
    const { data: assignmentsForCount } = await supabase
      .from('assignments')
      .select('id')
      .eq('tenant_id', tenantId)
      .in('course_id', courseIds);

    const aIds = (assignmentsForCount || []).map((a) => a.id);
    if (aIds.length > 0) {
      const { count } = await supabase
        .from('submissions')
        .select('id', { count: 'exact', head: true })
        .eq('tenant_id', tenantId)
        .in('assignment_id', aIds)
        .eq('status', 'submitted');

      pendingGradesCount = count || 0;
    }
  }

  // Compute per-course stats: average grade + attendance rate
  const classStats: Array<{
    classId: string;
    className: string;
    enrollment: number;
    averageGrade: number;
    attendanceRate: number;
  }> = [];

  for (const course of courseList) {
    const enrollment = enrollmentsByCoursId[course.id] || 0;

    // Avg grade from grades table
    const { data: grades } = await supabase
      .from('grades')
      .select('percentage')
      .eq('tenant_id', tenantId)
      .eq('course_id', course.id);

    let averageGrade = 0;
    if (grades && grades.length > 0) {
      const sum = grades.reduce((acc, g) => acc + (g.percentage || 0), 0);
      averageGrade = Math.round(sum / grades.length);
    }

    // Attendance rate
    const { data: attendanceAll } = await supabase
      .from('attendance_records')
      .select('status')
      .eq('tenant_id', tenantId)
      .eq('course_id', course.id);

    let attendanceRate = 100;
    if (attendanceAll && attendanceAll.length > 0) {
      const presentCount = attendanceAll.filter(
        (a) => a.status === 'present' || a.status === 'tardy'
      ).length;
      attendanceRate = Math.round((presentCount / attendanceAll.length) * 100);
    }

    classStats.push({
      classId: course.id,
      className: course.name,
      enrollment,
      averageGrade,
      attendanceRate,
    });
  }

  // Grade distribution across all courses
  const gradeDistribution = { A: 0, B: 0, C: 0, D: 0, F: 0 };
  if (courseIds.length > 0) {
    const { data: allGrades } = await supabase
      .from('grades')
      .select('percentage')
      .eq('tenant_id', tenantId)
      .in('course_id', courseIds);

    (allGrades || []).forEach((g) => {
      const pct = g.percentage || 0;
      if (pct >= 90) gradeDistribution.A++;
      else if (pct >= 80) gradeDistribution.B++;
      else if (pct >= 70) gradeDistribution.C++;
      else if (pct >= 60) gradeDistribution.D++;
      else gradeDistribution.F++;
    });
  }

  const teacherName = user.first_name
    ? `${user.first_name} ${user.last_name || ''}`
    : 'Teacher';

  return (
    <TeacherDashboardClient
      teacherName={teacherName}
      totalStudents={totalStudents}
      pendingGrades={pendingGradesCount}
      classStats={classStats}
      recentSubmissions={recentSubmissions}
      gradeDistribution={Object.entries(gradeDistribution).map(([grade, count]) => ({
        grade,
        count,
      }))}
    />
  );
}
