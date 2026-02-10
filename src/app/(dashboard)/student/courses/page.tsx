import { getStudentCourses } from '@/lib/queries/student';
import { StudentCoursesClient } from './StudentCoursesClient';

export default async function StudentCoursesPage() {
  const courses = await getStudentCourses();

  return <StudentCoursesClient courses={courses} />;
}
