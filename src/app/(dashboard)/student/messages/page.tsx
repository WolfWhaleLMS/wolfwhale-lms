import { getStudentConversations } from '@/lib/queries/student';
import { MessagesPageClient } from './MessagesPageClient';

export default async function StudentMessagesPage() {
  const conversationData = await getStudentConversations();

  return <MessagesPageClient initialData={conversationData} />;
}
