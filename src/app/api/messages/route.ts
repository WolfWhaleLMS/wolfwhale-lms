import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth } from '@/lib/api';
import { apiResponse, apiError, getPaginationParams, getPaginationMetadata } from '@/lib/api';
import { messageSchema, createConversationSchema } from '@/lib/validation/schemas';

/**
 * GET /api/messages
 * Fetch conversations for current user
 */
export const GET = withAuth(async (req, opts) => {
  try {
    const supabase = await createClient();
    const { page, pageSize, sortBy, sortOrder } = getPaginationParams(req);

    // Get conversations where user is a participant
    const { data: conversations, count, error } = await supabase
      .from('conversations')
      .select('*, conversation_participants(user_id), last_message:messages(content, created_at)', { count: 'exact' })
      .eq('conversation_participants.user_id', opts.userId)
      .order(sortBy, { ascending: sortOrder === 'asc' })
      .range((page - 1) * pageSize, page * pageSize - 1);

    if (error) {
      throw error;
    }

    return apiResponse({
      conversations: conversations || [],
      pagination: getPaginationMetadata(page, pageSize, count || 0),
    });
  } catch (error) {
    console.error('Error fetching conversations:', error);
    return apiError('Failed to fetch conversations', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/messages
 * Create new conversation or send message
 */
export const POST = withAuth(async (req, opts) => {
  try {
    const body = await req.json();
    const supabase = await createClient();

    if (body.action === 'create_conversation') {
      // Create new conversation
      const validation = createConversationSchema.safeParse(body);
      if (!validation.success) {
        return apiError(
          'Validation failed',
          400,
          'VALIDATION_ERROR',
          validation.error.flatten().fieldErrors
        );
      }

      const data = validation.data;

      // Create conversation
      const { data: conversation, error: convError } = await supabase
        .from('conversations')
        .insert({
          tenant_id: opts.tenantId,
          title: data.title || (data.isGroup ? 'Group Chat' : null),
          is_group: data.isGroup,
          created_by: opts.userId,
        })
        .select()
        .single();

      if (convError) {
        throw convError;
      }

      // Add participants
      const participants = [opts.userId, ...data.participantIds];
      const participantRecords = participants.map((pid) => ({
        conversation_id: conversation.id,
        user_id: pid,
        joined_at: new Date().toISOString(),
      }));

      await supabase.from('conversation_participants').insert(participantRecords);

      return apiResponse(conversation, 201);
    } else {
      // Send message
      const validation = messageSchema.safeParse(body);
      if (!validation.success) {
        return apiError(
          'Validation failed',
          400,
          'VALIDATION_ERROR',
          validation.error.flatten().fieldErrors
        );
      }

      const data = validation.data;

      // Verify conversation exists and user is participant
      const { data: conversation } = await supabase
        .from('conversations')
        .select('id')
        .eq('id', data.conversationId || '')
        .single();

      if (!conversation && data.conversationId) {
        return apiError('Conversation not found', 404, 'NOT_FOUND');
      }

      // If no conversation, create one with recipient
      let conversationId = data.conversationId;

      if (!conversationId) {
        const { data: newConv, error: convError } = await supabase
          .from('conversations')
          .insert({
            tenant_id: opts.tenantId,
            is_group: false,
            created_by: opts.userId,
          })
          .select()
          .single();

        if (convError) throw convError;

        conversationId = newConv.id;

        // Add participants
        await supabase.from('conversation_participants').insert([
          {
            conversation_id: conversationId,
            user_id: opts.userId,
            joined_at: new Date().toISOString(),
          },
          {
            conversation_id: conversationId,
            user_id: data.recipientId,
            joined_at: new Date().toISOString(),
          },
        ]);
      }

      // Create message
      const { data: message, error: msgError } = await supabase
        .from('messages')
        .insert({
          conversation_id: conversationId,
          sender_id: opts.userId,
          content: data.content,
          attachments: data.attachments,
          created_at: new Date().toISOString(),
        })
        .select()
        .single();

      if (msgError) {
        throw msgError;
      }

      return apiResponse(message, 201);
    }
  } catch (error) {
    console.error('Error in messages POST:', error);
    return apiError('Failed to process message', 500, 'MESSAGE_ERROR');
  }
});
