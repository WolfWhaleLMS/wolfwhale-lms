-- Add optimistic concurrency for companion profiles and a resource security
-- review ledger for uploaded course files.

ALTER TABLE student_companion_profiles
  ADD COLUMN IF NOT EXISTS version INT NOT NULL DEFAULT 1 CHECK (version >= 1);

CREATE TABLE IF NOT EXISTS course_resource_security_reviews (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  course_id UUID NOT NULL REFERENCES courses(id) ON DELETE CASCADE,
  lesson_id UUID NOT NULL REFERENCES lessons(id) ON DELETE CASCADE,
  resource_id UUID NOT NULL REFERENCES lesson_attachments(id) ON DELETE CASCADE,
  uploaded_by UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  file_name TEXT NOT NULL,
  file_type TEXT NOT NULL,
  file_size BIGINT NOT NULL CHECK (file_size > 0),
  file_sha256 TEXT NOT NULL CHECK (file_sha256 ~ '^[a-f0-9]{64}$'),
  scan_status TEXT NOT NULL DEFAULT 'pending' CHECK (scan_status IN ('pending', 'clean', 'blocked', 'error')),
  scan_provider TEXT NOT NULL DEFAULT 'mime-allowlist-sha256',
  scan_checked_at TIMESTAMPTZ,
  quarantine_reason TEXT,
  legal_hold BOOLEAN NOT NULL DEFAULT FALSE,
  retention_expires_at TIMESTAMPTZ NOT NULL,
  created_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),
  updated_at TIMESTAMPTZ NOT NULL DEFAULT NOW(),

  UNIQUE (resource_id)
);

CREATE INDEX IF NOT EXISTS idx_course_resource_reviews_tenant ON course_resource_security_reviews(tenant_id);
CREATE INDEX IF NOT EXISTS idx_course_resource_reviews_course ON course_resource_security_reviews(course_id);
CREATE INDEX IF NOT EXISTS idx_course_resource_reviews_resource ON course_resource_security_reviews(resource_id);
CREATE INDEX IF NOT EXISTS idx_course_resource_reviews_scan ON course_resource_security_reviews(scan_status);
CREATE INDEX IF NOT EXISTS idx_course_resource_reviews_retention ON course_resource_security_reviews(retention_expires_at);

ALTER TABLE course_resource_security_reviews ENABLE ROW LEVEL SECURITY;

DROP POLICY IF EXISTS course_resource_reviews_member_select ON course_resource_security_reviews;
CREATE POLICY course_resource_reviews_member_select
  ON course_resource_security_reviews
  FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.tenant_id = course_resource_security_reviews.tenant_id
        AND tenant_memberships.user_id = auth.uid()
        AND tenant_memberships.status = 'active'
    )
  );

DROP POLICY IF EXISTS course_resource_reviews_staff_insert ON course_resource_security_reviews;
CREATE POLICY course_resource_reviews_staff_insert
  ON course_resource_security_reviews
  FOR INSERT
  TO authenticated
  WITH CHECK (
    uploaded_by = auth.uid()
    AND (
      EXISTS (
        SELECT 1
        FROM tenant_memberships
        WHERE tenant_memberships.tenant_id = course_resource_security_reviews.tenant_id
          AND tenant_memberships.user_id = auth.uid()
          AND tenant_memberships.role IN ('admin', 'super_admin')
          AND tenant_memberships.status = 'active'
      )
      OR EXISTS (
        SELECT 1
        FROM courses
        WHERE courses.id = course_resource_security_reviews.course_id
          AND courses.tenant_id = course_resource_security_reviews.tenant_id
          AND courses.created_by = auth.uid()
      )
      OR EXISTS (
        SELECT 1
        FROM course_enrollments
        WHERE course_enrollments.tenant_id = course_resource_security_reviews.tenant_id
          AND course_enrollments.course_id = course_resource_security_reviews.course_id
          AND course_enrollments.teacher_id = auth.uid()
          AND course_enrollments.status = 'active'
      )
    )
  );

DROP POLICY IF EXISTS course_resource_reviews_admin_update ON course_resource_security_reviews;
CREATE POLICY course_resource_reviews_admin_update
  ON course_resource_security_reviews
  FOR UPDATE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.tenant_id = course_resource_security_reviews.tenant_id
        AND tenant_memberships.user_id = auth.uid()
        AND tenant_memberships.role IN ('admin', 'super_admin')
        AND tenant_memberships.status = 'active'
    )
  )
  WITH CHECK (
    EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.tenant_id = course_resource_security_reviews.tenant_id
        AND tenant_memberships.user_id = auth.uid()
        AND tenant_memberships.role IN ('admin', 'super_admin')
        AND tenant_memberships.status = 'active'
    )
  );

DROP POLICY IF EXISTS course_resource_reviews_admin_delete ON course_resource_security_reviews;
CREATE POLICY course_resource_reviews_admin_delete
  ON course_resource_security_reviews
  FOR DELETE
  TO authenticated
  USING (
    EXISTS (
      SELECT 1
      FROM tenant_memberships
      WHERE tenant_memberships.tenant_id = course_resource_security_reviews.tenant_id
        AND tenant_memberships.user_id = auth.uid()
        AND tenant_memberships.role IN ('admin', 'super_admin')
        AND tenant_memberships.status = 'active'
    )
  );

DROP TRIGGER IF EXISTS set_updated_at_course_resource_security_reviews ON course_resource_security_reviews;
CREATE TRIGGER set_updated_at_course_resource_security_reviews
  BEFORE UPDATE ON course_resource_security_reviews
  FOR EACH ROW EXECUTE FUNCTION update_updated_at();
