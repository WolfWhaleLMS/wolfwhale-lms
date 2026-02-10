import { redirect } from 'next/navigation';
import { requireRole, getUser, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { TeacherAssignmentsClient } from './TeacherAssignmentsClient';

export default async function TeacherAssignmentsPage() {
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
    .select('id, name')
    .eq('tenant_id', tenantId)
    .eq('created_by', user.id)
    .eq('status', 'active');

  const courseList = courses || [];
  const courseIds = courseList.map((c) => c.id);
  const courseMap = Object.fromEntries(courseList.map((c) => [c.id, c.name]));

  if (courseIds.length === 0) {
    return (
      <TeacherAssignmentsClient
        assignments={[]}
      />
    );
  }

  // Fetch all assignments for teacher's courses
  const { data: assignments } = await supabase
    .from('assignments')
    .select('*')
    .eq('tenant_id', tenantId)
    .in('course_id', courseIds)
    .order('due_date', { ascending: false });

  const assignmentList = assignments || [];
  const assignmentIds = assignmentList.map((a) => a.id);

  // Fetch submission counts per assignment
  let submissionCounts: Record<string, { total: number; graded: number }> = {};
  if (assignmentIds.length > 0) {
    const { data: submissions } = await supabase
      .from('submissions')
      .select('assignment_id, status')
      .eq('tenant_id', tenantId)
      .in('assignment_id', assignmentIds);

    (submissions || []).forEach((s) => {
      if (!submissionCounts[s.assignment_id]) {
        submissionCounts[s.assignment_id] = { total: 0, graded: 0 };
      }
      submissionCounts[s.assignment_id].total++;
      if (s.status === 'graded') {
        submissionCounts[s.assignment_id].graded++;
      }
    });
  }

  // Build assignment data for client
  const assignmentData = assignmentList.map((a) => ({
    id: a.id,
    courseId: a.course_id,
    courseName: courseMap[a.course_id] || 'Unknown Course',
    title: a.title,
    description: a.description || '',
    instructions: a.instructions || '',
    type: (a.type || 'homework') as 'homework' | 'quiz' | 'project' | 'exam' | 'discussion',
    dueDate: a.due_date,
    maxPoints: Number(a.max_points) || 100,
    submissionType: (a.submission_type || 'text') as 'text' | 'file' | 'link' | 'discussion',
    allowLateSubmission: a.allow_late_submission ?? true,
    lateSubmissionDays: a.late_submission_days ?? 0,
    status: a.status === 'assigned' ? 'published' as const : (a.status || 'draft') as 'draft' | 'published' | 'archived',
    createdAt: a.created_at,
    totalSubmissions: submissionCounts[a.id]?.total || 0,
    gradedSubmissions: submissionCounts[a.id]?.graded || 0,
  }));

  return (
    <TeacherAssignmentsClient
      assignments={assignmentData}
    />
  );
}
