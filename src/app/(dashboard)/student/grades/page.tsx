import { getStudentGrades } from '@/lib/queries/student';
import { GradesPageClient } from './GradesPageClient';

export default async function GradesPage() {
  const gradesData = await getStudentGrades();

  return <GradesPageClient gradesData={gradesData} />;
}
