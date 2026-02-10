import { getStudentGamificationData } from '@/lib/queries/student';
import { AchievementsPageClient } from './AchievementsPageClient';

export default async function AchievementsPage() {
  const gamificationData = await getStudentGamificationData();

  return <AchievementsPageClient gamificationData={gamificationData} />;
}
