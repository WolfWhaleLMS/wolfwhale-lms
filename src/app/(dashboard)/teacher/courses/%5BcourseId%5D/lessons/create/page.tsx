import { redirect, notFound } from 'next/navigation';
import { requireRole, getUser, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { LessonCreatorClient } from './LessonCreatorClient';

export default async function LessonCreatorPage({
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

  // Get current max order_index for this course's lessons
  const { data: existingLessons } = await supabase
    .from('lessons')
    .select('order_index')
    .eq('course_id', params.courseId)
    .eq('tenant_id', tenantId)
    .order('order_index', { ascending: false })
    .limit(1);

  const nextOrderIndex = existingLessons && existingLessons.length > 0
    ? existingLessons[0].order_index + 1
    : 1;

  return (
    <LessonCreatorClient
      courseId={params.courseId}
      courseName={course.name}
      tenantId={tenantId}
      teacherId={user.id}
      nextOrderIndex={nextOrderIndex}
    />
  );
}
