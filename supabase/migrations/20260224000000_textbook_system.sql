-- ============================================================================
-- Digital Textbook Replacement System
-- Tables: textbooks, textbook_units, textbook_chapters, curriculum_outcomes,
--         chapter_outcome_map, textbook_flashcards, student_textbook_assignments,
--         student_reading_progress, student_flashcard_progress
-- ============================================================================

-- ============================================================================
-- 1. TABLES
-- ============================================================================

-- Textbooks: top-level container for a digital textbook
CREATE TABLE textbooks (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  subject     VARCHAR(100) NOT NULL,
  grade_level VARCHAR(20)  NOT NULL,
  description TEXT,
  cover_image_url TEXT,
  status      VARCHAR(20) NOT NULL DEFAULT 'draft'
    CONSTRAINT valid_textbook_status CHECK (status IN ('draft', 'published', 'archived')),
  created_by  UUID NOT NULL REFERENCES profiles(id),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Textbook Units: sections/modules within a textbook
CREATE TABLE textbook_units (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  textbook_id UUID NOT NULL REFERENCES textbooks(id) ON DELETE CASCADE,
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  description TEXT,
  order_index INT NOT NULL DEFAULT 0
    CONSTRAINT chk_unit_order_nonneg CHECK (order_index >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Textbook Chapters: individual chapters within a unit
CREATE TABLE textbook_chapters (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  unit_id     UUID NOT NULL REFERENCES textbook_units(id) ON DELETE CASCADE,
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  title       VARCHAR(255) NOT NULL,
  content     JSONB NOT NULL DEFAULT '[]'::jsonb,
  order_index INT NOT NULL DEFAULT 0
    CONSTRAINT chk_chapter_order_nonneg CHECK (order_index >= 0),
  estimated_reading_minutes INT
    CONSTRAINT chk_reading_minutes_nonneg CHECK (estimated_reading_minutes >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Curriculum Outcomes: learning objectives that chapters map to
CREATE TABLE curriculum_outcomes (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  code        VARCHAR(50) NOT NULL,
  description TEXT NOT NULL,
  subject     VARCHAR(100) NOT NULL,
  grade_level VARCHAR(20)  NOT NULL,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (tenant_id, code)
);

-- Chapter-Outcome Map: many-to-many link between chapters and outcomes
CREATE TABLE chapter_outcome_map (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id  UUID NOT NULL REFERENCES textbook_chapters(id) ON DELETE CASCADE,
  outcome_id  UUID NOT NULL REFERENCES curriculum_outcomes(id) ON DELETE CASCADE,
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (chapter_id, outcome_id)
);

-- Textbook Flashcards: flashcards tied to a specific chapter
CREATE TABLE textbook_flashcards (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  chapter_id  UUID NOT NULL REFERENCES textbook_chapters(id) ON DELETE CASCADE,
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  front_text  TEXT NOT NULL
    CONSTRAINT chk_front_not_empty CHECK (front_text <> ''),
  back_text   TEXT NOT NULL
    CONSTRAINT chk_back_not_empty CHECK (back_text <> ''),
  hint        TEXT,
  order_index INT NOT NULL DEFAULT 0
    CONSTRAINT chk_flashcard_order_nonneg CHECK (order_index >= 0),
  created_at  TIMESTAMPTZ NOT NULL DEFAULT NOW()
);

-- Student Textbook Assignments: which students are assigned which textbooks
CREATE TABLE student_textbook_assignments (
  id          UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id  UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  textbook_id UUID NOT NULL REFERENCES textbooks(id) ON DELETE CASCADE,
  tenant_id   UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  assigned_by UUID REFERENCES profiles(id),
  assigned_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  due_date    TIMESTAMPTZ,
  status      VARCHAR(20) NOT NULL DEFAULT 'active'
    CONSTRAINT valid_assignment_status CHECK (status IN ('active', 'completed', 'dropped')),
  UNIQUE (student_id, textbook_id)
);

-- Student Reading Progress: tracks per-chapter reading progress
CREATE TABLE student_reading_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  chapter_id      UUID NOT NULL REFERENCES textbook_chapters(id) ON DELETE CASCADE,
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  progress_pct    INT NOT NULL DEFAULT 0
    CONSTRAINT chk_reading_progress_range CHECK (progress_pct BETWEEN 0 AND 100),
  time_spent_seconds INT NOT NULL DEFAULT 0
    CONSTRAINT chk_time_spent_nonneg CHECK (time_spent_seconds >= 0),
  completed_at    TIMESTAMPTZ,
  last_read_at    TIMESTAMPTZ DEFAULT NOW(),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, chapter_id)
);

-- Student Flashcard Progress: SM-2 spaced repetition per flashcard
CREATE TABLE student_flashcard_progress (
  id              UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  student_id      UUID NOT NULL REFERENCES profiles(id) ON DELETE CASCADE,
  flashcard_id    UUID NOT NULL REFERENCES textbook_flashcards(id) ON DELETE CASCADE,
  tenant_id       UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  ease_factor     NUMERIC(4,2) NOT NULL DEFAULT 2.50
    CONSTRAINT chk_ease_factor_range CHECK (ease_factor >= 1.30),
  interval_days   INT NOT NULL DEFAULT 0
    CONSTRAINT chk_interval_nonneg CHECK (interval_days >= 0),
  repetitions     INT NOT NULL DEFAULT 0
    CONSTRAINT chk_repetitions_nonneg CHECK (repetitions >= 0),
  next_review_at  TIMESTAMPTZ DEFAULT NOW(),
  last_quality    INT
    CONSTRAINT chk_quality_range CHECK (last_quality BETWEEN 0 AND 5),
  created_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at      TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  UNIQUE (student_id, flashcard_id)
);


-- ============================================================================
-- 2. INDEXES
-- ============================================================================

-- Tenant scoping
CREATE INDEX idx_textbooks_tenant           ON textbooks(tenant_id);
CREATE INDEX idx_textbook_units_tenant      ON textbook_units(tenant_id);
CREATE INDEX idx_textbook_chapters_tenant   ON textbook_chapters(tenant_id);
CREATE INDEX idx_curriculum_outcomes_tenant  ON curriculum_outcomes(tenant_id);
CREATE INDEX idx_chapter_outcome_map_tenant ON chapter_outcome_map(tenant_id);
CREATE INDEX idx_textbook_flashcards_tenant ON textbook_flashcards(tenant_id);
CREATE INDEX idx_student_textbook_assignments_tenant ON student_textbook_assignments(tenant_id);
CREATE INDEX idx_student_reading_progress_tenant     ON student_reading_progress(tenant_id);
CREATE INDEX idx_student_flashcard_progress_tenant   ON student_flashcard_progress(tenant_id);

-- Foreign key lookups
CREATE INDEX idx_textbook_units_textbook       ON textbook_units(textbook_id);
CREATE INDEX idx_textbook_chapters_unit        ON textbook_chapters(unit_id);
CREATE INDEX idx_chapter_outcome_map_chapter   ON chapter_outcome_map(chapter_id);
CREATE INDEX idx_chapter_outcome_map_outcome   ON chapter_outcome_map(outcome_id);
CREATE INDEX idx_textbook_flashcards_chapter   ON textbook_flashcards(chapter_id);
CREATE INDEX idx_student_textbook_assignments_student  ON student_textbook_assignments(student_id);
CREATE INDEX idx_student_textbook_assignments_textbook ON student_textbook_assignments(textbook_id);
CREATE INDEX idx_student_reading_progress_student      ON student_reading_progress(student_id);
CREATE INDEX idx_student_reading_progress_chapter      ON student_reading_progress(chapter_id);
CREATE INDEX idx_student_flashcard_progress_student    ON student_flashcard_progress(student_id);
CREATE INDEX idx_student_flashcard_progress_flashcard  ON student_flashcard_progress(flashcard_id);

-- Status / filter
CREATE INDEX idx_textbooks_status           ON textbooks(status);
CREATE INDEX idx_textbooks_subject_grade    ON textbooks(subject, grade_level);
CREATE INDEX idx_curriculum_outcomes_subject ON curriculum_outcomes(subject, grade_level);
CREATE INDEX idx_student_flashcard_progress_review ON student_flashcard_progress(student_id, next_review_at)
  WHERE next_review_at <= NOW();


-- ============================================================================
-- 3. UPDATED_AT TRIGGERS
-- ============================================================================

CREATE TRIGGER set_updated_at_textbooks
  BEFORE UPDATE ON textbooks
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_textbook_units
  BEFORE UPDATE ON textbook_units
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_textbook_chapters
  BEFORE UPDATE ON textbook_chapters
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_student_reading_progress
  BEFORE UPDATE ON student_reading_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();

CREATE TRIGGER set_updated_at_student_flashcard_progress
  BEFORE UPDATE ON student_flashcard_progress
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();


-- ============================================================================
-- 4. ROW-LEVEL SECURITY
-- ============================================================================

ALTER TABLE textbooks                    ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbook_units               ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbook_chapters            ENABLE ROW LEVEL SECURITY;
ALTER TABLE curriculum_outcomes          ENABLE ROW LEVEL SECURITY;
ALTER TABLE chapter_outcome_map          ENABLE ROW LEVEL SECURITY;
ALTER TABLE textbook_flashcards          ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_textbook_assignments ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_reading_progress     ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_flashcard_progress   ENABLE ROW LEVEL SECURITY;

-- --------------------------------------------------------------------------
-- textbooks
-- --------------------------------------------------------------------------
-- SELECT: tenant members can view published textbooks; teachers/admins see all
CREATE POLICY textbooks_select ON textbooks FOR SELECT USING (
  (status = 'published' AND is_tenant_member(tenant_id))
  OR tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

-- INSERT: teachers and admins
CREATE POLICY textbooks_insert ON textbooks FOR INSERT WITH CHECK (
  created_by = auth.uid()
  AND tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

-- UPDATE: creator or admin
CREATE POLICY textbooks_update ON textbooks FOR UPDATE USING (
  created_by = auth.uid()
  OR tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

-- DELETE: admin only
CREATE POLICY textbooks_delete ON textbooks FOR DELETE USING (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

-- --------------------------------------------------------------------------
-- textbook_units
-- --------------------------------------------------------------------------
CREATE POLICY textbook_units_select ON textbook_units FOR SELECT USING (
  is_tenant_member(tenant_id)
);

CREATE POLICY textbook_units_insert ON textbook_units FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

CREATE POLICY textbook_units_update ON textbook_units FOR UPDATE USING (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

CREATE POLICY textbook_units_delete ON textbook_units FOR DELETE USING (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

-- --------------------------------------------------------------------------
-- textbook_chapters
-- --------------------------------------------------------------------------
CREATE POLICY textbook_chapters_select ON textbook_chapters FOR SELECT USING (
  is_tenant_member(tenant_id)
);

CREATE POLICY textbook_chapters_insert ON textbook_chapters FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

CREATE POLICY textbook_chapters_update ON textbook_chapters FOR UPDATE USING (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

CREATE POLICY textbook_chapters_delete ON textbook_chapters FOR DELETE USING (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

-- --------------------------------------------------------------------------
-- curriculum_outcomes
-- --------------------------------------------------------------------------
CREATE POLICY curriculum_outcomes_select ON curriculum_outcomes FOR SELECT USING (
  is_tenant_member(tenant_id)
);

CREATE POLICY curriculum_outcomes_insert ON curriculum_outcomes FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

CREATE POLICY curriculum_outcomes_update ON curriculum_outcomes FOR UPDATE USING (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

CREATE POLICY curriculum_outcomes_delete ON curriculum_outcomes FOR DELETE USING (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

-- --------------------------------------------------------------------------
-- chapter_outcome_map
-- --------------------------------------------------------------------------
CREATE POLICY chapter_outcome_map_select ON chapter_outcome_map FOR SELECT USING (
  is_tenant_member(tenant_id)
);

CREATE POLICY chapter_outcome_map_insert ON chapter_outcome_map FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

CREATE POLICY chapter_outcome_map_delete ON chapter_outcome_map FOR DELETE USING (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

-- --------------------------------------------------------------------------
-- textbook_flashcards
-- --------------------------------------------------------------------------
CREATE POLICY textbook_flashcards_select ON textbook_flashcards FOR SELECT USING (
  is_tenant_member(tenant_id)
);

CREATE POLICY textbook_flashcards_insert ON textbook_flashcards FOR INSERT WITH CHECK (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

CREATE POLICY textbook_flashcards_update ON textbook_flashcards FOR UPDATE USING (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('teacher', 'admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

CREATE POLICY textbook_flashcards_delete ON textbook_flashcards FOR DELETE USING (
  tenant_id IN (
    SELECT tm.tenant_id FROM tenant_memberships tm
    WHERE tm.user_id = auth.uid()
      AND tm.role IN ('admin', 'super_admin')
      AND tm.status IN ('active', 'invited')
  )
);

-- --------------------------------------------------------------------------
-- student_textbook_assignments
-- --------------------------------------------------------------------------
-- SELECT: students see own, teachers/admins see all in tenant,
--         parents see linked children
CREATE POLICY student_textbook_assignments_select ON student_textbook_assignments
  FOR SELECT USING (
    student_id = auth.uid()
    OR tenant_id IN (
      SELECT tm.tenant_id FROM tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.role IN ('teacher', 'admin', 'super_admin')
        AND tm.status IN ('active', 'invited')
    )
    OR student_id IN (
      SELECT sp.student_id FROM student_parents sp
      WHERE sp.parent_id = auth.uid() AND sp.status = 'active'
    )
  );

-- INSERT: teachers/admins assign textbooks
CREATE POLICY student_textbook_assignments_insert ON student_textbook_assignments
  FOR INSERT WITH CHECK (
    tenant_id IN (
      SELECT tm.tenant_id FROM tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.role IN ('teacher', 'admin', 'super_admin')
        AND tm.status IN ('active', 'invited')
    )
  );

-- UPDATE: teachers/admins update status/due_date
CREATE POLICY student_textbook_assignments_update ON student_textbook_assignments
  FOR UPDATE USING (
    tenant_id IN (
      SELECT tm.tenant_id FROM tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.role IN ('teacher', 'admin', 'super_admin')
        AND tm.status IN ('active', 'invited')
    )
  );

-- DELETE: admins only
CREATE POLICY student_textbook_assignments_delete ON student_textbook_assignments
  FOR DELETE USING (
    tenant_id IN (
      SELECT tm.tenant_id FROM tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'super_admin')
        AND tm.status IN ('active', 'invited')
    )
  );

-- --------------------------------------------------------------------------
-- student_reading_progress
-- --------------------------------------------------------------------------
-- SELECT: students see own, teachers/admins see tenant, parents see children
CREATE POLICY student_reading_progress_select ON student_reading_progress
  FOR SELECT USING (
    student_id = auth.uid()
    OR tenant_id IN (
      SELECT tm.tenant_id FROM tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.role IN ('teacher', 'admin', 'super_admin')
        AND tm.status IN ('active', 'invited')
    )
    OR student_id IN (
      SELECT sp.student_id FROM student_parents sp
      WHERE sp.parent_id = auth.uid() AND sp.status = 'active'
    )
  );

-- INSERT: students can track own progress
CREATE POLICY student_reading_progress_insert ON student_reading_progress
  FOR INSERT WITH CHECK (
    student_id = auth.uid() AND is_tenant_member(tenant_id)
  );

-- UPDATE: students update own progress
CREATE POLICY student_reading_progress_update ON student_reading_progress
  FOR UPDATE USING (
    student_id = auth.uid()
  );

-- DELETE: admins only
CREATE POLICY student_reading_progress_delete ON student_reading_progress
  FOR DELETE USING (
    tenant_id IN (
      SELECT tm.tenant_id FROM tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'super_admin')
        AND tm.status IN ('active', 'invited')
    )
  );

-- --------------------------------------------------------------------------
-- student_flashcard_progress
-- --------------------------------------------------------------------------
-- SELECT: students see own, teachers/admins see tenant, parents see children
CREATE POLICY student_flashcard_progress_select ON student_flashcard_progress
  FOR SELECT USING (
    student_id = auth.uid()
    OR tenant_id IN (
      SELECT tm.tenant_id FROM tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.role IN ('teacher', 'admin', 'super_admin')
        AND tm.status IN ('active', 'invited')
    )
    OR student_id IN (
      SELECT sp.student_id FROM student_parents sp
      WHERE sp.parent_id = auth.uid() AND sp.status = 'active'
    )
  );

-- INSERT: students can track own progress
CREATE POLICY student_flashcard_progress_insert ON student_flashcard_progress
  FOR INSERT WITH CHECK (
    student_id = auth.uid() AND is_tenant_member(tenant_id)
  );

-- UPDATE: students update own progress
CREATE POLICY student_flashcard_progress_update ON student_flashcard_progress
  FOR UPDATE USING (
    student_id = auth.uid()
  );

-- DELETE: admins only
CREATE POLICY student_flashcard_progress_delete ON student_flashcard_progress
  FOR DELETE USING (
    tenant_id IN (
      SELECT tm.tenant_id FROM tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.role IN ('admin', 'super_admin')
        AND tm.status IN ('active', 'invited')
    )
  );


-- ============================================================================
-- 5. AUTO-ASSIGNMENT TRIGGER
-- When a textbook is published, automatically assign it to all active students
-- in the same tenant.
-- ============================================================================

CREATE OR REPLACE FUNCTION auto_assign_published_textbook()
RETURNS TRIGGER AS $$
BEGIN
  -- Only fire when status changes to 'published'
  IF NEW.status = 'published' AND (OLD.status IS NULL OR OLD.status <> 'published') THEN
    INSERT INTO student_textbook_assignments (student_id, textbook_id, tenant_id, assigned_by)
    SELECT
      tm.user_id,
      NEW.id,
      NEW.tenant_id,
      NEW.created_by
    FROM tenant_memberships tm
    WHERE tm.tenant_id = NEW.tenant_id
      AND tm.role = 'student'
      AND tm.status = 'active'
    ON CONFLICT (student_id, textbook_id) DO NOTHING;
  END IF;

  RETURN NEW;
END;
$$ LANGUAGE plpgsql SECURITY DEFINER;

CREATE TRIGGER trg_auto_assign_textbook
  AFTER INSERT OR UPDATE OF status ON textbooks
  FOR EACH ROW
  EXECUTE FUNCTION auto_assign_published_textbook();
