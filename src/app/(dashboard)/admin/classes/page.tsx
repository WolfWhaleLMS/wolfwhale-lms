import { requireRole, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import AdminClassesClient from './AdminClassesClient';

export default async function AdminClassesPage() {
  await requireRole(['admin', 'super_admin']);
  const tenantId = await getUserTenantId();
  const supabase = await createClient();

  if (!tenantId) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <p className="text-slate-600 dark:text-slate-400">No school found for your account.</p>
      </div>
    );
  }

  // Fetch all courses for this tenant with teacher profiles
  const { data: courses } = await supabase
    .from('courses')
    .select(`
      id,
      name,
      description,
      subject,
      grade_level,
      status,
      semester,
      start_date,
      end_date,
      created_by,
      created_at,
      profiles:created_by (
        id,
        first_name,
        last_name
      )
    `)
    .eq('tenant_id', tenantId)
    .order('created_at', { ascending: false });

  // Fetch enrollment counts per course
  const courseIds = (courses || []).map((c) => c.id);
  const enrollmentCounts = new Map<string, number>();

  if (courseIds.length > 0) {
    // Get enrollment counts using a single query
    const { data: enrollments } = await supabase
      .from('course_enrollments')
      .select('course_id')
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .in('course_id', courseIds);

    if (enrollments) {
      for (const e of enrollments) {
        enrollmentCounts.set(e.course_id, (enrollmentCounts.get(e.course_id) || 0) + 1);
      }
    }
  }

  // Transform into client-friendly format
  const classes = (courses || []).map((c) => {
    const teacher = c.profiles as unknown as {
      id: string;
      first_name: string | null;
      last_name: string | null;
    } | null;

    return {
      id: c.id,
      name: c.name,
      subject: c.subject || 'General',
      gradeLevel: c.grade_level || '',
      status: c.status as 'active' | 'archived' | 'draft',
      semester: c.semester || '',
      teacherName: teacher
        ? `${teacher.first_name || ''} ${teacher.last_name || ''}`.trim()
        : 'Unassigned',
      teacherId: c.created_by,
      studentCount: enrollmentCounts.get(c.id) || 0,
      startDate: c.start_date,
      endDate: c.end_date,
    };
  });

  return <AdminClassesClient classes={classes} />;
}
