-- ============================================================================
-- Flashcard System
-- Teacher creates decks + cards, students study with SM-2 spaced repetition
-- ============================================================================

CREATE TABLE flashcard_decks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  status VARCHAR(50) NOT NULL DEFAULT 'draft',
  card_count INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_deck_status CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_flashcard_decks_tenant ON flashcard_decks(tenant_id);
CREATE INDEX idx_flashcard_decks_course ON flashcard_decks(course_id);

CREATE TABLE flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  front_image_url TEXT,
  back_image_url TEXT,
  hint TEXT,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW()
);

CREATE INDEX idx_flashcards_deck ON flashcards(deck_id);

CREATE TABLE flashcard_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  card_id UUID NOT NULL REFERENCES flashcards(id) ON DELETE CASCADE,
  deck_id UUID NOT NULL REFERENCES flashcard_decks(id) ON DELETE CASCADE,
  ease_factor NUMERIC(4,2) NOT NULL DEFAULT 2.50,
  interval_days INT NOT NULL DEFAULT 0,
  repetitions INT NOT NULL DEFAULT 0,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_quality INT,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, student_id, card_id)
);

CREATE INDEX idx_flashcard_progress_student ON flashcard_progress(student_id);
CREATE INDEX idx_flashcard_progress_review ON flashcard_progress(next_review_at);

-- RLS
ALTER TABLE flashcard_decks ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE flashcard_progress ENABLE ROW LEVEL SECURITY;

-- Decks: teachers can manage their own, students can read published in enrolled courses
CREATE POLICY flashcard_decks_select ON flashcard_decks FOR SELECT USING (
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND status = 'active'
  )
);

CREATE POLICY flashcard_decks_insert ON flashcard_decks FOR INSERT WITH CHECK (
  created_by = auth.uid() AND
  tenant_id IN (
    SELECT tenant_id FROM tenant_memberships
    WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
  )
);

CREATE POLICY flashcard_decks_update ON flashcard_decks FOR UPDATE USING (
  created_by = auth.uid()
);

CREATE POLICY flashcard_decks_delete ON flashcard_decks FOR DELETE USING (
  created_by = auth.uid()
);

-- Cards: same as deck access
CREATE POLICY flashcards_select ON flashcards FOR SELECT USING (
  deck_id IN (
    SELECT id FROM flashcard_decks
    WHERE tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  )
);

CREATE POLICY flashcards_insert ON flashcards FOR INSERT WITH CHECK (
  deck_id IN (
    SELECT id FROM flashcard_decks WHERE created_by = auth.uid()
  )
);

CREATE POLICY flashcards_update ON flashcards FOR UPDATE USING (
  deck_id IN (
    SELECT id FROM flashcard_decks WHERE created_by = auth.uid()
  )
);

CREATE POLICY flashcards_delete ON flashcards FOR DELETE USING (
  deck_id IN (
    SELECT id FROM flashcard_decks WHERE created_by = auth.uid()
  )
);

-- Progress: students can manage their own
CREATE POLICY flashcard_progress_select ON flashcard_progress FOR SELECT USING (
  student_id = auth.uid()
);

CREATE POLICY flashcard_progress_insert ON flashcard_progress FOR INSERT WITH CHECK (
  student_id = auth.uid()
);

CREATE POLICY flashcard_progress_update ON flashcard_progress FOR UPDATE USING (
  student_id = auth.uid()
);
