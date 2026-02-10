import { redirect } from 'next/navigation';
import { requireRole, getUser, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { TeacherCoursesClient } from './TeacherCoursesClient';

export default async function TeacherCoursesPage() {
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
    .order('name');

  const courseList = courses || [];
  const courseIds = courseList.map((c) => c.id);

  // Fetch enrollment counts
  let enrollmentCounts: Record<string, number> = {};
  if (courseIds.length > 0) {
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('course_id')
      .eq('tenant_id', tenantId)
      .in('course_id', courseIds)
      .eq('status', 'active');

    (enrollments || []).forEach((e) => {
      enrollmentCounts[e.course_id] = (enrollmentCounts[e.course_id] || 0) + 1;
    });
  }

  // Fetch average grades per course
  let avgGrades: Record<string, number> = {};
  if (courseIds.length > 0) {
    const { data: grades } = await supabase
      .from('grades')
      .select('course_id, percentage')
      .eq('tenant_id', tenantId)
      .in('course_id', courseIds);

    const gradesByCourse: Record<string, number[]> = {};
    (grades || []).forEach((g) => {
      if (!gradesByCourse[g.course_id]) gradesByCourse[g.course_id] = [];
      gradesByCourse[g.course_id].push(g.percentage || 0);
    });
    Object.entries(gradesByCourse).forEach(([cid, pcts]) => {
      avgGrades[cid] = Math.round(pcts.reduce((a, b) => a + b, 0) / pcts.length);
    });
  }

  // Build course cards data
  const courseCards = courseList.map((course) => ({
    id: course.id,
    name: course.name,
    subject: course.subject || 'General',
    gradeLevel: course.grade_level || '',
    studentCount: enrollmentCounts[course.id] || 0,
    term: course.semester || '',
    status: course.status,
    averageGrade: avgGrades[course.id] || 0,
    description: course.description || '',
  }));

  return <TeacherCoursesClient courses={courseCards} />;
}
