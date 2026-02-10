import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';

function getConversationId(req: NextRequest): string {
  const segments = req.nextUrl.pathname.split('/');
  return segments[segments.length - 1];
}

/**
 * GET /api/messages/[conversationId]
 */
export const GET = withAuth(async (req, opts) => {
  try {
    const supabase = await createClient();
    const conversationId = getConversationId(req);
    const { page, pageSize, sortBy = 'created_at', sortOrder } = getPaginationParams(req);

    const { data: participant } = await supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('user_id', opts.userId)
      .single();

    if (!participant) {
      return apiError('Access denied', 403, 'FORBIDDEN');
    }

    const { data: messages, count, error } = await supabase
      .from('messages')
      .select('*', { count: 'exact' })
      .eq('conversation_id', conversationId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw error;
    }

    await supabase
      .from('message_reads')
      .upsert(
        messages?.map((msg) => ({
          message_id: msg.id,
          user_id: opts.userId,
          read_at: new Date().toISOString(),
        })) || []
      );

    return apiResponse({
      messages: messages || [],
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching messages:', error);
    return apiError('Failed to fetch messages', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/messages/[conversationId]
 */
export const POST = withAuth(async (req, opts) => {
  try {
    const supabase = await createClient();
    const conversationId = getConversationId(req);
    const { content, attachments } = await req.json();

    if (!content || content.trim().length === 0) {
      return apiError('Message content is required', 400, 'VALIDATION_ERROR');
    }

    if (content.length > 5000) {
      return apiError('Message exceeds maximum length', 400, 'VALIDATION_ERROR');
    }

    const { data: participant } = await supabase
      .from('conversation_participants')
      .select('id')
      .eq('conversation_id', conversationId)
      .eq('user_id', opts.userId)
      .single();

    if (!participant) {
      return apiError('Access denied', 403, 'FORBIDDEN');
    }

    const { data: message, error } = await supabase
      .from('messages')
      .insert({
        conversation_id: conversationId,
        sender_id: opts.userId,
        content: content.trim(),
        attachments: attachments || [],
        created_at: new Date().toISOString(),
      })
      .select()
      .single();

    if (error) {
      throw error;
    }

    return apiResponse(message, 201);
  } catch (error) {
    console.error('Error sending message:', error);
    return apiError('Failed to send message', 500, 'SEND_ERROR');
  }
});
