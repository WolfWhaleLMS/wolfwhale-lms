-- ============================================================================
-- AI Tutor System
-- Users (students & teachers) can chat with on-device AI tutor
-- Conversations are scoped per user, optionally linked to course/lesson
-- ============================================================================

-- ---------------------------------------------------------------------------
-- tutor_conversations
-- ---------------------------------------------------------------------------

CREATE TABLE tutor_conversations (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  user_role VARCHAR(20) NOT NULL DEFAULT 'student',
  title VARCHAR(255) NOT NULL DEFAULT 'New Conversation',
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  model_id VARCHAR(100) NOT NULL DEFAULT 'Llama-3.2-3B-Instruct-q4f16_1-MLC',
  message_count INT NOT NULL DEFAULT 0,
  last_message_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tutor_conversations_user ON tutor_conversations(user_id);
CREATE INDEX idx_tutor_conversations_tenant ON tutor_conversations(tenant_id);
CREATE INDEX idx_tutor_conversations_course ON tutor_conversations(course_id);
CREATE INDEX idx_tutor_conversations_updated ON tutor_conversations(updated_at DESC);

-- ---------------------------------------------------------------------------
-- tutor_messages
-- ---------------------------------------------------------------------------

CREATE TABLE tutor_messages (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  conversation_id UUID NOT NULL REFERENCES tutor_conversations(id) ON DELETE CASCADE,
  role VARCHAR(20) NOT NULL CHECK (role IN ('system', 'user', 'assistant')),
  content TEXT NOT NULL,
  token_count INT,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_tutor_messages_conversation ON tutor_messages(conversation_id, created_at ASC);

-- ---------------------------------------------------------------------------
-- RLS
-- ---------------------------------------------------------------------------

ALTER TABLE tutor_conversations ENABLE ROW LEVEL SECURITY;
ALTER TABLE tutor_messages ENABLE ROW LEVEL SECURITY;

-- Conversations: users can read their own
CREATE POLICY tutor_conversations_select_own ON tutor_conversations FOR SELECT USING (
  user_id = auth.uid()
);

-- Conversations: teachers can read conversations for students in their courses
CREATE POLICY tutor_conversations_select_teacher ON tutor_conversations FOR SELECT USING (
  course_id IN (
    SELECT id FROM courses WHERE created_by = auth.uid()
  )
);

-- Conversations: parents can read their children's conversations
CREATE POLICY tutor_conversations_select_parent ON tutor_conversations FOR SELECT USING (
  user_id IN (
    SELECT student_id FROM student_parents WHERE parent_id = auth.uid()
  )
);

-- Conversations: users can insert their own
CREATE POLICY tutor_conversations_insert ON tutor_conversations FOR INSERT WITH CHECK (
  user_id = auth.uid() AND
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

-- Conversations: users can update their own
CREATE POLICY tutor_conversations_update ON tutor_conversations FOR UPDATE USING (
  user_id = auth.uid()
);

-- Conversations: users can delete their own
CREATE POLICY tutor_conversations_delete ON tutor_conversations FOR DELETE USING (
  user_id = auth.uid()
);

-- Messages: accessible if you can access the parent conversation
CREATE POLICY tutor_messages_select ON tutor_messages FOR SELECT USING (
  conversation_id IN (
    SELECT id FROM tutor_conversations
    WHERE user_id = auth.uid()
       OR course_id IN (SELECT id FROM courses WHERE created_by = auth.uid())
       OR user_id IN (SELECT student_id FROM student_parents WHERE parent_id = auth.uid())
  )
);

-- Messages: only the conversation owner can insert
CREATE POLICY tutor_messages_insert ON tutor_messages FOR INSERT WITH CHECK (
  conversation_id IN (
    SELECT id FROM tutor_conversations WHERE user_id = auth.uid()
  )
);

-- Messages: only the conversation owner can delete (cascade handles conversation deletion)
CREATE POLICY tutor_messages_delete ON tutor_messages FOR DELETE USING (
  conversation_id IN (
    SELECT id FROM tutor_conversations WHERE user_id = auth.uid()
  )
);
