import { redirect, notFound } from 'next/navigation';
import { requireRole, getUser, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { CourseDetailClient } from './CourseDetailClient';

export default async function TeacherCourseDetailPage({
  params,
}: {
  params: { courseId: string };
}) {
  await requireRole(['teacher', 'admin']);
  const user = await getUser();
  const tenantId = await getUserTenantId();

  if (!user || !tenantId) {
    redirect('/login');
  }

  const supabase = await createClient();
  const { courseId } = params;

  // Fetch course details
  const { data: course, error: courseError } = await supabase
    .from('courses')
    .select('*')
    .eq('id', courseId)
    .eq('tenant_id', tenantId)
    .single();

  if (courseError || !course) {
    notFound();
  }

  // Fetch enrolled students with profiles
  const { data: enrollments } = await supabase
    .from('course_enrollments')
    .select('student_id, status, enrolled_at')
    .eq('course_id', courseId)
    .eq('tenant_id', tenantId)
    .eq('status', 'active');

  const studentIds = (enrollments || []).map((e) => e.student_id);
  let students: Array<{
    id: string;
    name: string;
    email: string;
    currentGrade: number;
    status: string;
    attendanceRate: number;
  }> = [];

  if (studentIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name')
      .in('id', studentIds);

    // Get grades for each student in this course
    const { data: grades } = await supabase
      .from('grades')
      .select('student_id, percentage')
      .eq('tenant_id', tenantId)
      .eq('course_id', courseId);

    const gradesByStudent: Record<string, number[]> = {};
    (grades || []).forEach((g) => {
      if (!gradesByStudent[g.student_id]) gradesByStudent[g.student_id] = [];
      gradesByStudent[g.student_id].push(g.percentage || 0);
    });

    // Get attendance for each student in this course
    const { data: attendance } = await supabase
      .from('attendance_records')
      .select('student_id, status')
      .eq('tenant_id', tenantId)
      .eq('course_id', courseId);

    const attendanceByStudent: Record<string, { total: number; present: number }> = {};
    (attendance || []).forEach((a) => {
      if (!attendanceByStudent[a.student_id]) {
        attendanceByStudent[a.student_id] = { total: 0, present: 0 };
      }
      attendanceByStudent[a.student_id].total++;
      if (a.status === 'present' || a.status === 'tardy') {
        attendanceByStudent[a.student_id].present++;
      }
    });

    const profileMap = Object.fromEntries((profiles || []).map((p) => [p.id, p]));

    students = studentIds.map((sid) => {
      const profile = profileMap[sid];
      const studentGrades = gradesByStudent[sid] || [];
      const avgGrade = studentGrades.length > 0
        ? Math.round(studentGrades.reduce((a, b) => a + b, 0) / studentGrades.length)
        : 0;
      const att = attendanceByStudent[sid];
      const attendanceRate = att && att.total > 0
        ? Math.round((att.present / att.total) * 100)
        : 100;

      return {
        id: sid,
        name: profile ? `${profile.first_name} ${profile.last_name}` : 'Unknown',
        email: '',
        currentGrade: avgGrade,
        status: 'active',
        attendanceRate,
      };
    });
  }

  // Fetch lessons
  const { data: lessons } = await supabase
    .from('lessons')
    .select('id, title, description, order_index, status')
    .eq('course_id', courseId)
    .eq('tenant_id', tenantId)
    .order('order_index');

  // Fetch assignments
  const { data: assignments } = await supabase
    .from('assignments')
    .select('id, title, due_date, max_points, status')
    .eq('course_id', courseId)
    .eq('tenant_id', tenantId)
    .order('due_date');

  // Get submission counts per assignment
  const assignmentIds = (assignments || []).map((a) => a.id);
  let submissionCounts: Record<string, number> = {};
  if (assignmentIds.length > 0) {
    const { data: submissions } = await supabase
      .from('submissions')
      .select('assignment_id')
      .eq('tenant_id', tenantId)
      .in('assignment_id', assignmentIds);

    (submissions || []).forEach((s) => {
      submissionCounts[s.assignment_id] = (submissionCounts[s.assignment_id] || 0) + 1;
    });
  }

  const courseData = {
    id: course.id,
    name: course.name,
    term: course.semester || '',
    description: course.description || '',
    subject: course.subject || '',
    gradeLevel: course.grade_level || '',
    startDate: course.start_date || '',
    endDate: course.end_date || '',
  };

  const lessonsData = (lessons || []).map((l) => ({
    id: l.id,
    title: l.title,
    description: l.description || '',
    orderIndex: l.order_index,
    status: l.status,
  }));

  const assignmentsData = (assignments || []).map((a) => ({
    id: a.id,
    title: a.title,
    dueDate: a.due_date,
    pointsPossible: a.max_points,
    submissionCount: submissionCounts[a.id] || 0,
    studentCount: students.length,
    status: a.status,
  }));

  return (
    <CourseDetailClient
      course={courseData}
      students={students}
      lessons={lessonsData}
      assignments={assignmentsData}
    />
  );
}
