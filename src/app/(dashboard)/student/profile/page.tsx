import { getStudentProfile } from '@/lib/queries/student';
import { ProfilePageClient } from './ProfilePageClient';

export default async function StudentProfilePage() {
  const profile = await getStudentProfile();

  return <ProfilePageClient profile={profile} />;
}
