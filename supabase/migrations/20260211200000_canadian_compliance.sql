-- Canadian Privacy Compliance Migration
-- Adds tables and columns required for PIPEDA, COPPA, and provincial privacy law compliance.
-- Tables: consent_records, data_deletion_requests, privacy_policy_acceptances
-- Alters: student_parents (adds consent_given, consent_date, consent_method)

-- ===================================================================
-- 1. CONSENT RECORDS — tracks parental/guardian consent for minors
-- ===================================================================

CREATE TABLE consent_records (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  parent_id UUID REFERENCES auth.users(id),
  consent_type VARCHAR(50) NOT NULL,
  consent_given BOOLEAN DEFAULT FALSE,
  consent_date TIMESTAMPTZ,
  withdrawal_date TIMESTAMPTZ,
  method VARCHAR(50),
  ip_address INET,
  details JSONB,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT consent_records_unique UNIQUE (tenant_id, student_id, consent_type),
  CONSTRAINT valid_consent_type CHECK (consent_type IN (
    'data_collection', 'marketing', 'third_party_sharing'
  )),
  CONSTRAINT valid_consent_method CHECK (method IS NULL OR method IN (
    'electronic', 'signed_form', 'email', 'in_person'
  ))
);

CREATE INDEX idx_consent_records_tenant ON consent_records(tenant_id);
CREATE INDEX idx_consent_records_student ON consent_records(student_id);
CREATE INDEX idx_consent_records_consent_type ON consent_records(consent_type);
CREATE INDEX idx_consent_records_parent ON consent_records(parent_id);

-- ===================================================================
-- 2. DATA DELETION REQUESTS — tracks PIPEDA data deletion/access requests
-- ===================================================================

CREATE TABLE data_deletion_requests (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  requested_by UUID NOT NULL REFERENCES auth.users(id),
  target_user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  request_type VARCHAR(50) NOT NULL,
  status VARCHAR(50) DEFAULT 'pending',
  reason TEXT,
  admin_notes TEXT,
  processed_by UUID REFERENCES auth.users(id),
  processed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_request_type CHECK (request_type IN (
    'deletion', 'access', 'correction', 'portability'
  )),
  CONSTRAINT valid_request_status CHECK (status IN (
    'pending', 'in_progress', 'completed', 'denied'
  ))
);

CREATE INDEX idx_data_deletion_requests_tenant ON data_deletion_requests(tenant_id);
CREATE INDEX idx_data_deletion_requests_requested_by ON data_deletion_requests(requested_by);
CREATE INDEX idx_data_deletion_requests_target_user ON data_deletion_requests(target_user_id);
CREATE INDEX idx_data_deletion_requests_status ON data_deletion_requests(status);

-- ===================================================================
-- 3. PRIVACY POLICY ACCEPTANCES — tracks when users accept the policy
-- ===================================================================

CREATE TABLE privacy_policy_acceptances (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  user_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  policy_version VARCHAR(50) NOT NULL,
  accepted_at TIMESTAMPTZ DEFAULT NOW(),
  ip_address INET,

  CONSTRAINT privacy_policy_acceptances_unique UNIQUE (user_id, policy_version)
);

CREATE INDEX idx_privacy_policy_acceptances_user ON privacy_policy_acceptances(user_id);
CREATE INDEX idx_privacy_policy_acceptances_version ON privacy_policy_acceptances(policy_version);

-- ===================================================================
-- 4. ALTER student_parents — add consent tracking columns
-- ===================================================================

DO $$ BEGIN
  ALTER TABLE student_parents ADD COLUMN consent_given BOOLEAN DEFAULT FALSE;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE student_parents ADD COLUMN consent_date TIMESTAMPTZ;
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

DO $$ BEGIN
  ALTER TABLE student_parents ADD COLUMN consent_method VARCHAR(50);
EXCEPTION WHEN duplicate_column THEN NULL;
END $$;

-- ===================================================================
-- 5. ENABLE ROW LEVEL SECURITY
-- ===================================================================

ALTER TABLE consent_records ENABLE ROW LEVEL SECURITY;
ALTER TABLE data_deletion_requests ENABLE ROW LEVEL SECURITY;
ALTER TABLE privacy_policy_acceptances ENABLE ROW LEVEL SECURITY;

-- ===================================================================
-- 6. RLS POLICIES — consent_records
-- ===================================================================

-- Admins can read all consent records within their tenant
CREATE POLICY consent_records_select_admin
  ON consent_records FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Admins can insert consent records for their tenant
CREATE POLICY consent_records_insert_admin
  ON consent_records FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Admins can update consent records for their tenant
CREATE POLICY consent_records_update_admin
  ON consent_records FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Parents can read their own consent records
CREATE POLICY consent_records_select_parent
  ON consent_records FOR SELECT
  USING (parent_id = auth.uid());

-- ===================================================================
-- 7. RLS POLICIES — data_deletion_requests
-- ===================================================================

-- Admins can read all requests within their tenant
CREATE POLICY data_deletion_requests_select_admin
  ON data_deletion_requests FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Admins can insert requests for their tenant
CREATE POLICY data_deletion_requests_insert_admin
  ON data_deletion_requests FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Admins can update requests for their tenant
CREATE POLICY data_deletion_requests_update_admin
  ON data_deletion_requests FOR UPDATE
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- Users can read their own data deletion requests (ones they submitted)
CREATE POLICY data_deletion_requests_select_requester
  ON data_deletion_requests FOR SELECT
  USING (requested_by = auth.uid());

-- Users can insert their own data requests (self-service)
CREATE POLICY data_deletion_requests_insert_user
  ON data_deletion_requests FOR INSERT
  WITH CHECK (requested_by = auth.uid());

-- ===================================================================
-- 8. RLS POLICIES — privacy_policy_acceptances
-- ===================================================================

-- Users can read their own policy acceptances
CREATE POLICY privacy_policy_acceptances_select_own
  ON privacy_policy_acceptances FOR SELECT
  USING (user_id = auth.uid());

-- Users can insert their own policy acceptances
CREATE POLICY privacy_policy_acceptances_insert_own
  ON privacy_policy_acceptances FOR INSERT
  WITH CHECK (user_id = auth.uid());

-- Admins can read all policy acceptances (for audit purposes)
CREATE POLICY privacy_policy_acceptances_select_admin
  ON privacy_policy_acceptances FOR SELECT
  USING (
    EXISTS (
      SELECT 1 FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('admin', 'super_admin') AND status = 'active'
    )
  );

-- ===================================================================
-- 9. UPDATED_AT TRIGGER FUNCTION (reuse if exists, create otherwise)
-- ===================================================================

CREATE OR REPLACE FUNCTION update_updated_at_column()
RETURNS TRIGGER AS $$
BEGIN
  NEW.updated_at = NOW();
  RETURN NEW;
END;
$$ LANGUAGE plpgsql;

CREATE TRIGGER consent_records_updated_at
  BEFORE UPDATE ON consent_records
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();

CREATE TRIGGER data_deletion_requests_updated_at
  BEFORE UPDATE ON data_deletion_requests
  FOR EACH ROW
  EXECUTE FUNCTION update_updated_at_column();
