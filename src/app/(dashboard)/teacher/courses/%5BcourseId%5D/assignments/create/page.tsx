import { redirect, notFound } from 'next/navigation';
import { requireRole, getUser, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { AssignmentCreatorClient } from './AssignmentCreatorClient';

export default async function AssignmentCreatorPage({
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

  // Verify teacher owns this course
  const { data: course, error } = await supabase
    .from('courses')
    .select('id, name')
    .eq('id', params.courseId)
    .eq('tenant_id', tenantId)
    .single();

  if (error || !course) {
    notFound();
  }

  return (
    <AssignmentCreatorClient
      courseId={params.courseId}
      courseName={course.name}
      tenantId={tenantId}
      teacherId={user.id}
    />
  );
}
