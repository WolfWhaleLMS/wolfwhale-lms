-- Scheduled Posts system for Wolf Whale EdTech
-- Supports automatic posting of engaging content about LMS features and Indigenous Education

CREATE TABLE IF NOT EXISTS scheduled_posts (
  id uuid PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id uuid NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  created_by uuid REFERENCES auth.users(id) ON DELETE SET NULL,

  -- Content
  title text NOT NULL,
  content text NOT NULL,
  category text NOT NULL CHECK (category IN ('lms_feature', 'indigenous_education', 'community', 'tip')),

  -- Scheduling
  scheduled_for timestamptz NOT NULL,
  published_at timestamptz,
  status text NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'published', 'cancelled')),

  -- Linking: when published, the resulting announcement ID
  announcement_id uuid REFERENCES announcements(id) ON DELETE SET NULL,

  -- Metadata
  is_recurring boolean NOT NULL DEFAULT false,
  recurrence_rule text, -- e.g. 'weekly', 'biweekly', 'monthly'

  created_at timestamptz NOT NULL DEFAULT now(),
  updated_at timestamptz NOT NULL DEFAULT now()
);

-- Index for the cron job: find due posts quickly
CREATE INDEX idx_scheduled_posts_pending ON scheduled_posts (scheduled_for)
  WHERE status = 'pending';

CREATE INDEX idx_scheduled_posts_tenant ON scheduled_posts (tenant_id, status);

-- RLS
ALTER TABLE scheduled_posts ENABLE ROW LEVEL SECURITY;

-- Admins and teachers can read scheduled posts for their tenant
CREATE POLICY "Tenant members can view scheduled posts"
  ON scheduled_posts FOR SELECT
  USING (
    tenant_id IN (
      SELECT tm.tenant_id FROM tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.status = 'active'
        AND tm.role IN ('teacher', 'admin', 'super_admin')
    )
  );

-- Only admins can insert/update/delete
CREATE POLICY "Admins can manage scheduled posts"
  ON scheduled_posts FOR ALL
  USING (
    tenant_id IN (
      SELECT tm.tenant_id FROM tenant_memberships tm
      WHERE tm.user_id = auth.uid()
        AND tm.status = 'active'
        AND tm.role IN ('admin', 'super_admin')
    )
  );
