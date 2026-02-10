import { redirect } from 'next/navigation';
import { requireAuth, getUser, getUserTenantId } from '@/lib/auth';
import { createClient } from '@/lib/supabase/server';
import { SharedMessagingClient } from './SharedMessagingClient';

export default async function MessagingPage() {
  await requireAuth();
  const user = await getUser();
  const tenantId = await getUserTenantId();

  if (!user || !tenantId) {
    redirect('/login');
  }

  const supabase = await createClient();

  // Fetch conversations where the user is a member
  const { data: memberships } = await supabase
    .from('conversation_members')
    .select('conversation_id')
    .eq('user_id', user.id);

  const conversationIds = (memberships || []).map((m) => m.conversation_id);

  if (conversationIds.length === 0) {
    return (
      <SharedMessagingClient
        conversations={[]}
        currentUserId={user.id}
        tenantId={tenantId}
      />
    );
  }

  // Fetch conversations
  const { data: conversations } = await supabase
    .from('conversations')
    .select('id, type, subject, created_at, updated_at')
    .in('id', conversationIds)
    .order('updated_at', { ascending: false });

  const conversationList = conversations || [];

  // Fetch all members of these conversations
  const { data: allMembers } = await supabase
    .from('conversation_members')
    .select('conversation_id, user_id')
    .in('conversation_id', conversationIds);

  const membersByConv: Record<string, string[]> = {};
  (allMembers || []).forEach((m) => {
    if (!membersByConv[m.conversation_id]) membersByConv[m.conversation_id] = [];
    membersByConv[m.conversation_id].push(m.user_id);
  });

  // Fetch the latest message for each conversation
  const latestMessages: Record<string, { content: string; sender_id: string; created_at: string }> = {};
  for (const conv of conversationList) {
    const { data: msgs } = await supabase
      .from('messages')
      .select('content, sender_id, created_at')
      .eq('conversation_id', conv.id)
      .order('created_at', { ascending: false })
      .limit(1);

    if (msgs && msgs.length > 0) {
      latestMessages[conv.id] = msgs[0];
    }
  }

  // Fetch unread count per conversation
  const { data: readReceipts } = await supabase
    .from('message_read_receipts')
    .select('message_id')
    .eq('user_id', user.id);

  const readMessageIds = new Set((readReceipts || []).map((r) => r.message_id));

  // Fetch all messages in conversations not sent by current user to check unread
  const { data: allMessages } = await supabase
    .from('messages')
    .select('id, conversation_id, sender_id')
    .in('conversation_id', conversationIds)
    .neq('sender_id', user.id);

  const unreadByConv: Record<string, number> = {};
  (allMessages || []).forEach((m) => {
    if (!readMessageIds.has(m.id)) {
      unreadByConv[m.conversation_id] = (unreadByConv[m.conversation_id] || 0) + 1;
    }
  });

  // Fetch profiles of all participants
  const allParticipantIds = [...new Set(Object.values(membersByConv).flat())];
  let profileMap: Record<string, { first_name: string; last_name: string; avatar_url: string | null }> = {};
  if (allParticipantIds.length > 0) {
    const { data: profiles } = await supabase
      .from('profiles')
      .select('id, first_name, last_name, avatar_url')
      .in('id', allParticipantIds);

    (profiles || []).forEach((p) => {
      profileMap[p.id] = {
        first_name: p.first_name,
        last_name: p.last_name,
        avatar_url: p.avatar_url,
      };
    });
  }

  // Build conversation data for client
  const conversationData = conversationList.map((conv) => {
    const members = membersByConv[conv.id] || [];
    const otherMembers = members.filter((uid) => uid !== user.id);
    const latestMsg = latestMessages[conv.id];

    // For direct conversations, use the other person's name; for groups, use subject
    const displayName = conv.subject
      || otherMembers.map((uid) => {
          const p = profileMap[uid];
          return p ? `${p.first_name} ${p.last_name}` : 'Unknown';
        }).join(', ')
      || 'Conversation';

    return {
      id: conv.id,
      name: displayName,
      lastMessage: latestMsg?.content || '',
      timestamp: latestMsg?.created_at || conv.created_at,
      unreadCount: unreadByConv[conv.id] || 0,
    };
  });

  return (
    <SharedMessagingClient
      conversations={conversationData}
      currentUserId={user.id}
      tenantId={tenantId}
    />
  );
}
