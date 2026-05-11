-- ============================================================================
-- WolfWhale Digital Textbook System
-- Migration: 20260303000000_textbook_system.sql
--
-- Replaces 19 Maxwell-lineage textbooks (Nelson, McGraw-Hill Ryerson, Glencoe)
-- in Saskatchewan K-12 classrooms with original curriculum-aligned content.
--
-- Tables created:
--   1.  textbooks                          - Top-level textbook entity
--   2.  textbook_units                     - Groups chapters into units
--   3.  textbook_chapters                  - Chapter content (JSONB blocks)
--   4.  curriculum_outcomes                - Canadian K-12 learning outcomes
--   5.  chapter_outcome_map                - Many-to-many chapter<->outcome
--   6.  textbook_flashcards                - Spaced repetition cards per chapter
--   7.  student_textbook_assignments       - Auto + manual textbook access
--   8.  student_reading_progress           - Per-chapter reading progress
--   9.  student_textbook_flashcard_progress - SM-2 spaced repetition per card
--
-- Also includes: indexes, RLS policies, triggers, auto-assignment function
-- ============================================================================


-- ===================================================================
-- 1. TEXTBOOKS (top-level entity)
-- ===================================================================

CREATE TABLE textbooks (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  subject VARCHAR(100) NOT NULL,
  grade_level VARCHAR(50) NOT NULL,
  sk_course_name VARCHAR(255),
  curriculum_url TEXT,
  province VARCHAR(50) NOT NULL DEFAULT 'SK',
  curriculum_framework VARCHAR(50) NOT NULL DEFAULT 'WNCP',
  description TEXT,
  cover_image_url TEXT,
  replaces_textbooks JSONB DEFAULT '[]'::jsonb,
  is_published BOOLEAN NOT NULL DEFAULT false,
  chapter_count INT NOT NULL DEFAULT 0,
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, slug),
  CONSTRAINT valid_textbook_subject CHECK (subject IN ('math', 'science', 'physics', 'chemistry', 'biology', 'ela'))
);


-- ===================================================================
-- 2. TEXTBOOK_UNITS (groups chapters into units)
-- ===================================================================

CREATE TABLE textbook_units (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  textbook_id UUID NOT NULL REFERENCES textbooks(id) ON DELETE CASCADE,
  unit_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  description TEXT,
  big_idea TEXT,
  essential_question TEXT,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(textbook_id, unit_number)
);


-- ===================================================================
-- 3. TEXTBOOK_CHAPTERS (content lives here)
-- ===================================================================

CREATE TABLE textbook_chapters (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  textbook_id UUID NOT NULL REFERENCES textbooks(id) ON DELETE CASCADE,
  unit_id UUID REFERENCES textbook_units(id) ON DELETE SET NULL,
  chapter_number INT NOT NULL,
  title VARCHAR(255) NOT NULL,
  slug VARCHAR(255) NOT NULL,
  description TEXT,
  content JSONB DEFAULT '[]'::jsonb,
  key_terms JSONB DEFAULT '[]'::jsonb,
  indigenous_connection TEXT,
  estimated_minutes INT,
  is_published BOOLEAN NOT NULL DEFAULT false,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(textbook_id, chapter_number),
  UNIQUE(textbook_id, slug)
);


-- ===================================================================
-- 4. CURRICULUM_OUTCOMES (Canadian K-12 curriculum learning outcomes)
-- ===================================================================

CREATE TABLE curriculum_outcomes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  province VARCHAR(50) NOT NULL DEFAULT 'SK',
  framework VARCHAR(50) NOT NULL DEFAULT 'WNCP',
  subject VARCHAR(100) NOT NULL,
  grade_level VARCHAR(50) NOT NULL,
  outcome_code VARCHAR(50) NOT NULL,
  strand VARCHAR(100),
  description TEXT NOT NULL,
  indicator_codes JSONB,
  tags TEXT[] DEFAULT '{}',
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(province, outcome_code)
);


-- ===================================================================
-- 5. CHAPTER_OUTCOME_MAP (many-to-many)
-- ===================================================================

CREATE TABLE chapter_outcome_map (
  chapter_id UUID NOT NULL REFERENCES textbook_chapters(id) ON DELETE CASCADE,
  outcome_id UUID NOT NULL REFERENCES curriculum_outcomes(id) ON DELETE CASCADE,
  PRIMARY KEY (chapter_id, outcome_id)
);


-- ===================================================================
-- 6. TEXTBOOK_FLASHCARDS (spaced repetition cards per chapter)
-- ===================================================================

CREATE TABLE textbook_flashcards (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES textbook_chapters(id) ON DELETE CASCADE,
  front_text TEXT NOT NULL,
  back_text TEXT NOT NULL,
  hint TEXT,
  difficulty INT NOT NULL DEFAULT 3,
  tags TEXT[] DEFAULT '{}',
  key_term_ref VARCHAR(255),
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_textbook_flashcard_difficulty CHECK (difficulty >= 1 AND difficulty <= 5)
);


-- ===================================================================
-- 7. STUDENT_TEXTBOOK_ASSIGNMENTS (auto-assignment + manual access)
-- ===================================================================

CREATE TABLE student_textbook_assignments (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  textbook_id UUID NOT NULL REFERENCES textbooks(id) ON DELETE CASCADE,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  auto_assigned BOOLEAN NOT NULL DEFAULT false,
  manually_added BOOLEAN NOT NULL DEFAULT false,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, student_id, textbook_id)
);


-- ===================================================================
-- 8. STUDENT_READING_PROGRESS (per-chapter progress)
-- ===================================================================

CREATE TABLE student_reading_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES textbook_chapters(id) ON DELETE CASCADE,
  textbook_id UUID NOT NULL REFERENCES textbooks(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'not_started',
  scroll_position FLOAT DEFAULT 0,
  time_spent_seconds INT NOT NULL DEFAULT 0,
  started_at TIMESTAMPTZ,
  completed_at TIMESTAMPTZ,
  last_accessed_at TIMESTAMPTZ DEFAULT NOW(),
  bookmarks JSONB DEFAULT '[]'::jsonb,
  notes JSONB DEFAULT '[]'::jsonb,

  UNIQUE(tenant_id, student_id, chapter_id),
  CONSTRAINT valid_textbook_reading_status CHECK (status IN ('not_started', 'in_progress', 'completed'))
);


-- ===================================================================
-- 9. STUDENT_TEXTBOOK_FLASHCARD_PROGRESS (SM-2 spaced repetition)
-- ===================================================================

CREATE TABLE student_textbook_flashcard_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  flashcard_id UUID NOT NULL REFERENCES textbook_flashcards(id) ON DELETE CASCADE,
  chapter_id UUID NOT NULL REFERENCES textbook_chapters(id) ON DELETE CASCADE,
  ease_factor NUMERIC(4,2) NOT NULL DEFAULT 2.50,
  interval_days INT NOT NULL DEFAULT 0,
  repetitions INT NOT NULL DEFAULT 0,
  next_review_at TIMESTAMPTZ DEFAULT NOW(),
  last_quality INT,
  last_reviewed_at TIMESTAMPTZ,
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, student_id, flashcard_id)
);


-- ===================================================================
-- INDEXES
-- ===================================================================

-- Textbooks
CREATE INDEX idx_textbooks_tenant ON textbooks(tenant_id);
CREATE INDEX idx_textbooks_subject ON textbooks(tenant_id, subject, grade_level);

-- Textbook Units
CREATE INDEX idx_units_textbook ON textbook_units(textbook_id);

-- Textbook Chapters
CREATE INDEX idx_chapters_textbook ON textbook_chapters(textbook_id, chapter_number);
CREATE INDEX idx_chapters_unit ON textbook_chapters(unit_id);

-- Curriculum Outcomes
CREATE INDEX idx_outcomes_province ON curriculum_outcomes(province, subject, grade_level);

-- Textbook Flashcards
CREATE INDEX idx_flashcards_chapter ON textbook_flashcards(chapter_id);

-- Student Textbook Assignments
CREATE INDEX idx_assignments_student ON student_textbook_assignments(tenant_id, student_id);

-- Student Reading Progress
CREATE INDEX idx_reading_progress_student ON student_reading_progress(tenant_id, student_id, textbook_id);

-- Student Textbook Flashcard Progress
CREATE INDEX idx_textbook_flashcard_progress_student ON student_textbook_flashcard_progress(tenant_id, student_id);
CREATE INDEX idx_textbook_flashcard_progress_review ON student_textbook_flashcard_progress(student_id, next_review_at);


-- ===================================================================
-- ROW LEVEL SECURITY
-- ===================================================================

ALTER TABLE textbooks ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbook_units ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbook_chapters ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_outcomes ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_outcome_map ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbook_flashcards ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_textbook_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_reading_progress ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_textbook_flashcard_progress ENABLE ROW LEVEL SECURITY;


-- ===================================================================
-- RLS POLICIES: CONTENT TABLES
-- (textbooks, textbook_units, textbook_chapters, curriculum_outcomes,
--  textbook_flashcards, chapter_outcome_map)
--
-- SELECT: tenant members can read
-- INSERT/UPDATE/DELETE: teacher, admin, super_admin roles only
-- ===================================================================

-- ----- TEXTBOOKS -----

CREATE POLICY textbooks_select_tenant
  ON textbooks FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status IN ('active', 'invited')
    )
  );

CREATE POLICY textbooks_insert_teacher
  ON textbooks FOR INSERT
  WITH CHECK (
    created_by = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY textbooks_update_teacher
  ON textbooks FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY textbooks_delete_teacher
  ON textbooks FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );


-- ----- TEXTBOOK_UNITS -----

CREATE POLICY textbook_units_select_tenant
  ON textbook_units FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status IN ('active', 'invited')
    )
  );

CREATE POLICY textbook_units_insert_teacher
  ON textbook_units FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY textbook_units_update_teacher
  ON textbook_units FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY textbook_units_delete_teacher
  ON textbook_units FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );


-- ----- TEXTBOOK_CHAPTERS -----

CREATE POLICY textbook_chapters_select_tenant
  ON textbook_chapters FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status IN ('active', 'invited')
    )
  );

CREATE POLICY textbook_chapters_insert_teacher
  ON textbook_chapters FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY textbook_chapters_update_teacher
  ON textbook_chapters FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY textbook_chapters_delete_teacher
  ON textbook_chapters FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );


-- ----- CURRICULUM_OUTCOMES -----
-- No tenant_id on this table — it's a shared reference table.
-- All authenticated tenant members can read; only teachers/admins can write.

CREATE POLICY curriculum_outcomes_select_authenticated
  ON curriculum_outcomes FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tenant_memberships
      WHERE user_id = auth.uid() AND status IN ('active', 'invited')
    )
  );

CREATE POLICY curriculum_outcomes_insert_teacher
  ON curriculum_outcomes FOR INSERT
  WITH CHECK (
    EXISTS (
      SELECT 1 FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY curriculum_outcomes_update_teacher
  ON curriculum_outcomes FOR UPDATE
  USING (
    EXISTS (
      SELECT 1 FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY curriculum_outcomes_delete_teacher
  ON curriculum_outcomes FOR DELETE
  USING (
    EXISTS (
      SELECT 1 FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );


-- ----- CHAPTER_OUTCOME_MAP -----
-- No tenant_id on this join table — access derived from chapter membership.

CREATE POLICY chapter_outcome_map_select_tenant
  ON chapter_outcome_map FOR SELECT
  USING (
    chapter_id IN (
      SELECT id FROM textbook_chapters
      WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_memberships
        WHERE user_id = auth.uid() AND status IN ('active', 'invited')
      )
    )
  );

CREATE POLICY chapter_outcome_map_insert_teacher
  ON chapter_outcome_map FOR INSERT
  WITH CHECK (
    chapter_id IN (
      SELECT id FROM textbook_chapters
      WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_memberships
        WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
      )
    )
  );

CREATE POLICY chapter_outcome_map_update_teacher
  ON chapter_outcome_map FOR UPDATE
  USING (
    chapter_id IN (
      SELECT id FROM textbook_chapters
      WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_memberships
        WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
      )
    )
  );

CREATE POLICY chapter_outcome_map_delete_teacher
  ON chapter_outcome_map FOR DELETE
  USING (
    chapter_id IN (
      SELECT id FROM textbook_chapters
      WHERE tenant_id IN (
        SELECT tenant_id FROM tenant_memberships
        WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
      )
    )
  );


-- ----- TEXTBOOK_FLASHCARDS -----

CREATE POLICY textbook_flashcards_select_tenant
  ON textbook_flashcards FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status IN ('active', 'invited')
    )
  );

CREATE POLICY textbook_flashcards_insert_teacher
  ON textbook_flashcards FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY textbook_flashcards_update_teacher
  ON textbook_flashcards FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY textbook_flashcards_delete_teacher
  ON textbook_flashcards FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- RLS POLICIES: STUDENT DATA TABLES
-- (student_textbook_assignments, student_reading_progress,
--  student_textbook_flashcard_progress)
--
-- SELECT: student reads own + teachers read students in their courses
--         + admins read all in tenant
-- INSERT/UPDATE: student manages own records
-- DELETE: admin only
-- ===================================================================

-- ----- STUDENT_TEXTBOOK_ASSIGNMENTS -----

CREATE POLICY sta_select_relevant
  ON student_textbook_assignments FOR SELECT
  USING (
    -- Students can read their own assignments
    student_id = auth.uid()
    OR
    -- Teachers can read assignments for students in their courses
    student_id IN (
      SELECT ce.student_id FROM course_enrollments ce
      WHERE ce.teacher_id = auth.uid() AND ce.status = 'active'
    )
    OR
    -- Admins can read all assignments in their tenant
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY sta_insert_student
  ON student_textbook_assignments FOR INSERT
  WITH CHECK (
    student_id = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY sta_update_student
  ON student_textbook_assignments FOR UPDATE
  USING (
    student_id = auth.uid()
  );

CREATE POLICY sta_delete_admin
  ON student_textbook_assignments FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ----- STUDENT_READING_PROGRESS -----

CREATE POLICY srp_select_relevant
  ON student_reading_progress FOR SELECT
  USING (
    -- Students can read their own progress
    student_id = auth.uid()
    OR
    -- Teachers can read progress for students in their courses
    student_id IN (
      SELECT ce.student_id FROM course_enrollments ce
      WHERE ce.teacher_id = auth.uid() AND ce.status = 'active'
    )
    OR
    -- Admins can read all progress in their tenant
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY srp_insert_student
  ON student_reading_progress FOR INSERT
  WITH CHECK (
    student_id = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY srp_update_student
  ON student_reading_progress FOR UPDATE
  USING (
    student_id = auth.uid()
  );

CREATE POLICY srp_delete_admin
  ON student_reading_progress FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ----- STUDENT_TEXTBOOK_FLASHCARD_PROGRESS -----

CREATE POLICY stfp_select_relevant
  ON student_textbook_flashcard_progress FOR SELECT
  USING (
    -- Students can read their own flashcard progress
    student_id = auth.uid()
    OR
    -- Teachers can read progress for students in their courses
    student_id IN (
      SELECT ce.student_id FROM course_enrollments ce
      WHERE ce.teacher_id = auth.uid() AND ce.status = 'active'
    )
    OR
    -- Admins can read all progress in their tenant
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

CREATE POLICY stfp_insert_student
  ON student_textbook_flashcard_progress FOR INSERT
  WITH CHECK (
    student_id = auth.uid() AND
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND status = 'active'
    )
  );

CREATE POLICY stfp_update_student
  ON student_textbook_flashcard_progress FOR UPDATE
  USING (
    student_id = auth.uid()
  );

CREATE POLICY stfp_delete_admin
  ON student_textbook_flashcard_progress FOR DELETE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );


-- ===================================================================
-- TRIGGERS: updated_at
-- ===================================================================

-- Textbooks updated_at trigger
CREATE OR REPLACE FUNCTION update_textbook_updated_at()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_textbooks_updated_at
  BEFORE UPDATE ON textbooks
  FOR EACH ROW
  EXECUTE FUNCTION update_textbook_updated_at();

-- Textbook units updated_at trigger
CREATE TRIGGER trg_textbook_units_updated_at
  BEFORE UPDATE ON textbook_units
  FOR EACH ROW
  EXECUTE FUNCTION update_textbook_updated_at();

-- Textbook chapters updated_at trigger
CREATE TRIGGER trg_textbook_chapters_updated_at
  BEFORE UPDATE ON textbook_chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_textbook_updated_at();

-- Student textbook flashcard progress updated_at trigger
CREATE TRIGGER trg_stfp_updated_at
  BEFORE UPDATE ON student_textbook_flashcard_progress
  FOR EACH ROW
  EXECUTE FUNCTION update_textbook_updated_at();

-- Cascade: when a chapter is updated, bump the parent textbook's updated_at
CREATE OR REPLACE FUNCTION update_textbook_on_chapter_change()
RETURNS TRIGGER AS $$
BEGIN
  UPDATE public.textbooks
  SET updated_at = NOW()
  WHERE id = NEW.textbook_id;
  RETURN NEW;
END;
$$ LANGUAGE plpgsql SET search_path = public;

CREATE TRIGGER trg_chapter_update_textbook
  AFTER INSERT OR UPDATE ON textbook_chapters
  FOR EACH ROW
  EXECUTE FUNCTION update_textbook_on_chapter_change();


-- ===================================================================
-- AUTO-ASSIGNMENT FUNCTION
-- Fires AFTER INSERT on course_enrollments.
-- Finds published textbooks matching the course's subject + grade_level
-- in the same tenant and auto-assigns them to the newly enrolled student.
-- ===================================================================

CREATE OR REPLACE FUNCTION auto_assign_textbooks_on_enrollment()
RETURNS TRIGGER AS $$
DECLARE
  v_subject VARCHAR(100);
  v_grade_level VARCHAR(50);
  v_tenant_id UUID;
BEGIN
  -- Get the course's subject, grade_level, and tenant_id
  SELECT c.subject, c.grade_level, c.tenant_id
  INTO v_subject, v_grade_level, v_tenant_id
  FROM courses c
  WHERE c.id = NEW.course_id;

  -- Only proceed if the course has both subject and grade_level set
  IF v_subject IS NOT NULL AND v_grade_level IS NOT NULL THEN
    INSERT INTO student_textbook_assignments (
      tenant_id,
      student_id,
      textbook_id,
      course_id,
      auto_assigned
    )
    SELECT
      v_tenant_id,
      NEW.student_id,
      t.id,
      NEW.course_id,
      true
    FROM textbooks t
    WHERE t.tenant_id = v_tenant_id
      AND t.subject = v_subject
      AND t.grade_level = v_grade_level
      AND t.is_published = true
    ON CONFLICT (tenant_id, student_id, textbook_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER SET search_path = public;

CREATE TRIGGER trg_auto_assign_textbooks
  AFTER INSERT ON course_enrollments
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_textbooks_on_enrollment();

REVOKE ALL ON FUNCTION update_textbook_updated_at() FROM PUBLIC;
REVOKE ALL ON FUNCTION update_textbook_updated_at() FROM anon;
REVOKE ALL ON FUNCTION update_textbook_updated_at() FROM authenticated;

REVOKE ALL ON FUNCTION update_textbook_on_chapter_change() FROM PUBLIC;
REVOKE ALL ON FUNCTION update_textbook_on_chapter_change() FROM anon;
REVOKE ALL ON FUNCTION update_textbook_on_chapter_change() FROM authenticated;

REVOKE ALL ON FUNCTION auto_assign_textbooks_on_enrollment() FROM PUBLIC;
REVOKE ALL ON FUNCTION auto_assign_textbooks_on_enrollment() FROM anon;
REVOKE ALL ON FUNCTION auto_assign_textbooks_on_enrollment() FROM authenticated;
