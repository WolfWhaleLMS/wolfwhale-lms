-- ============================================================================
-- Skill Tree System
-- Interactive tree/branch diagrams for student learning progression
-- ============================================================================

-- Skill Trees (one per subject per tenant)
CREATE TABLE skill_trees (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  subject VARCHAR(100) NOT NULL,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  status VARCHAR(50) DEFAULT 'published',
  created_by UUID NOT NULL REFERENCES auth.users(id),
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, subject),
  CONSTRAINT valid_skill_tree_status CHECK (status IN ('draft', 'published', 'archived'))
);

CREATE INDEX idx_skill_trees_tenant ON skill_trees(tenant_id);
CREATE INDEX idx_skill_trees_subject ON skill_trees(subject);

-- Skill Nodes (each node = a skill on the tree)
CREATE TABLE skill_nodes (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  skill_tree_id UUID NOT NULL REFERENCES skill_trees(id) ON DELETE CASCADE,
  name VARCHAR(255) NOT NULL,
  description TEXT,
  icon VARCHAR(100),
  node_type VARCHAR(50) NOT NULL DEFAULT 'skill',
  xp_reward INT NOT NULL DEFAULT 10,
  position_x FLOAT NOT NULL DEFAULT 0,
  position_y FLOAT NOT NULL DEFAULT 0,
  tier INT NOT NULL DEFAULT 0,
  course_id UUID REFERENCES courses(id) ON DELETE SET NULL,
  lesson_id UUID REFERENCES lessons(id) ON DELETE SET NULL,
  order_index INT NOT NULL DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  CONSTRAINT valid_node_type CHECK (node_type IN ('root', 'skill', 'milestone', 'capstone'))
);

CREATE INDEX idx_skill_nodes_tree ON skill_nodes(skill_tree_id);
CREATE INDEX idx_skill_nodes_tenant ON skill_nodes(tenant_id);
CREATE INDEX idx_skill_nodes_tier ON skill_nodes(tier);

-- Skill Connections (edges between nodes)
CREATE TABLE skill_connections (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  skill_tree_id UUID NOT NULL REFERENCES skill_trees(id) ON DELETE CASCADE,
  from_node_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  to_node_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  created_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(from_node_id, to_node_id)
);

CREATE INDEX idx_skill_connections_tree ON skill_connections(skill_tree_id);
CREATE INDEX idx_skill_connections_from ON skill_connections(from_node_id);
CREATE INDEX idx_skill_connections_to ON skill_connections(to_node_id);

-- Student Skill Progress (tracks which nodes a student has completed)
CREATE TABLE student_skill_progress (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  tenant_id UUID NOT NULL REFERENCES tenants(id) ON DELETE CASCADE,
  student_id UUID NOT NULL REFERENCES auth.users(id) ON DELETE CASCADE,
  node_id UUID NOT NULL REFERENCES skill_nodes(id) ON DELETE CASCADE,
  skill_tree_id UUID NOT NULL REFERENCES skill_trees(id) ON DELETE CASCADE,
  status VARCHAR(50) NOT NULL DEFAULT 'locked',
  progress_pct INT NOT NULL DEFAULT 0,
  completed_at TIMESTAMPTZ,
  created_at TIMESTAMPTZ DEFAULT NOW(),
  updated_at TIMESTAMPTZ DEFAULT NOW(),

  UNIQUE(tenant_id, student_id, node_id),
  CONSTRAINT valid_skill_progress_status CHECK (status IN ('locked', 'available', 'in_progress', 'completed')),
  CONSTRAINT valid_progress_pct CHECK (progress_pct >= 0 AND progress_pct <= 100)
);

CREATE INDEX idx_skill_progress_student ON student_skill_progress(student_id);
CREATE INDEX idx_skill_progress_tree ON student_skill_progress(skill_tree_id);
CREATE INDEX idx_skill_progress_node ON student_skill_progress(node_id);

-- RLS
ALTER TABLE skill_trees ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_nodes ENABLE ROW LEVEL SECURITY;
ALTER TABLE skill_connections ENABLE ROW LEVEL SECURITY;
ALTER TABLE student_skill_progress ENABLE ROW LEVEL SECURITY;

-- Policies: Everyone in tenant can read trees, nodes, connections
CREATE POLICY "Tenant members can read skill trees"
  ON skill_trees FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers and admins can manage skill trees"
  ON skill_trees FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY "Tenant members can read skill nodes"
  ON skill_nodes FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers and admins can manage skill nodes"
  ON skill_nodes FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY "Tenant members can read skill connections"
  ON skill_connections FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers and admins can manage skill connections"
  ON skill_connections FOR ALL
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );

CREATE POLICY "Students can read own skill progress"
  ON student_skill_progress FOR SELECT
  USING (student_id = auth.uid());

CREATE POLICY "Students can update own skill progress"
  ON student_skill_progress FOR UPDATE
  USING (student_id = auth.uid());

CREATE POLICY "System can insert skill progress"
  ON student_skill_progress FOR INSERT
  WITH CHECK (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships WHERE user_id = auth.uid()
    )
  );

CREATE POLICY "Teachers and admins can read all skill progress"
  ON student_skill_progress FOR SELECT
  USING (
    tenant_id IN (
      SELECT tenant_id FROM tenant_memberships
      WHERE user_id = auth.uid() AND role IN ('teacher', 'admin', 'super_admin')
    )
  );
