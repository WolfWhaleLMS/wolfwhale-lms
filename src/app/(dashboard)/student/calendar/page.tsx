import { getStudentCalendarEvents } from '@/lib/queries/student';
import { CalendarPageClient } from './CalendarPageClient';

export default async function CalendarPage() {
  const events = await getStudentCalendarEvents();

  return <CalendarPageClient events={events} />;
}
