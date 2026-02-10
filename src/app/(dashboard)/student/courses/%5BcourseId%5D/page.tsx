import { getStudentCourseDetail } from '@/lib/queries/student';
import { notFound } from 'next/navigation';
import { CourseDetailClient } from './CourseDetailClient';

interface PageProps {
  params: Promise<{ courseId: string }>;
}

export default async function CourseDetailPage({ params }: PageProps) {
  const { courseId } = await params;
  const data = await getStudentCourseDetail(courseId);

  if (!data) {
    notFound();
  }

  return <CourseDetailClient data={data} />;
}
