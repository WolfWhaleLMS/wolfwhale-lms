-- =============================================================================
-- Wolf Whale LMS - Test Account Seed Data
-- Creates a demo tenant and 5 test user accounts for development/testing.
--
-- Accounts created:
--   student@wolfwhale.ca  (student)       - WolfWhale-Student-2026
--   teacher@wolfwhale.ca  (teacher)       - WolfWhale-Teacher-2026
--   parent@wolfwhale.ca   (parent)        - WolfWhale-Parent-2026
--   admin@wolfwhale.ca    (admin)         - WolfWhale-Admin-2026
--   superadmin@wolfwhale.ca (super_admin) - WolfWhale-Super-2026
--
-- Idempotent: safe to run multiple times (uses ON CONFLICT DO NOTHING).
-- Requires: pgcrypto extension (enabled by default in Supabase).
-- Date: 2026-02-09
-- =============================================================================

DO $$
DECLARE
  v_tenant_id     UUID;
  v_student_id    UUID := gen_random_uuid();
  v_teacher_id    UUID := gen_random_uuid();
  v_parent_id     UUID := gen_random_uuid();
  v_admin_id      UUID := gen_random_uuid();
  v_superadmin_id UUID := gen_random_uuid();
BEGIN

  -- ===========================================================================
  -- 1. CREATE DEMO TENANT
  -- ===========================================================================

  INSERT INTO tenants (name, slug, website_url, settings)
  VALUES (
    'Wolf Whale Demo School',
    'demo',
    'demo.wolfwhale.ca',
    '{"grade_scale": "traditional", "gamification_enabled": true, "domain": "demo.wolfwhale.ca"}'::jsonb
  )
  ON CONFLICT (slug) DO NOTHING
  RETURNING id INTO v_tenant_id;

  -- If the tenant already existed, fetch its id
  IF v_tenant_id IS NULL THEN
    SELECT id INTO v_tenant_id FROM tenants WHERE slug = 'demo';
  END IF;

  -- ===========================================================================
  -- 2. DISABLE the handle_new_user trigger temporarily
  --    The trigger auto-creates a profile row on auth.users INSERT, but we
  --    need to control the profile data ourselves (first_name, last_name,
  --    grade_level, etc.). We disable it, insert our users and profiles
  --    manually, then re-enable it.
  -- ===========================================================================

  ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

  -- ===========================================================================
  -- 3. CREATE AUTH USERS
  -- ===========================================================================

  -- ---- Student ----
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_student_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'student@wolfwhale.ca',
    crypt('WolfWhale-Student-2026', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Test Student", "first_name": "Test", "last_name": "Student"}'::jsonb,
    now(),
    now()
  )
  ON CONFLICT (email) DO NOTHING;

  -- If user already existed, fetch the existing id
  IF NOT FOUND THEN
    SELECT id INTO v_student_id FROM auth.users WHERE email = 'student@wolfwhale.ca';
  END IF;

  -- ---- Teacher ----
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_teacher_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'teacher@wolfwhale.ca',
    crypt('WolfWhale-Teacher-2026', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Test Teacher", "first_name": "Test", "last_name": "Teacher"}'::jsonb,
    now(),
    now()
  )
  ON CONFLICT (email) DO NOTHING;

  IF NOT FOUND THEN
    SELECT id INTO v_teacher_id FROM auth.users WHERE email = 'teacher@wolfwhale.ca';
  END IF;

  -- ---- Parent ----
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_parent_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'parent@wolfwhale.ca',
    crypt('WolfWhale-Parent-2026', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Test Parent", "first_name": "Test", "last_name": "Parent"}'::jsonb,
    now(),
    now()
  )
  ON CONFLICT (email) DO NOTHING;

  IF NOT FOUND THEN
    SELECT id INTO v_parent_id FROM auth.users WHERE email = 'parent@wolfwhale.ca';
  END IF;

  -- ---- School Admin ----
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'admin@wolfwhale.ca',
    crypt('WolfWhale-Admin-2026', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "School Admin", "first_name": "School", "last_name": "Admin"}'::jsonb,
    now(),
    now()
  )
  ON CONFLICT (email) DO NOTHING;

  IF NOT FOUND THEN
    SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@wolfwhale.ca';
  END IF;

  -- ---- Super Admin ----
  INSERT INTO auth.users (
    id,
    instance_id,
    aud,
    role,
    email,
    encrypted_password,
    email_confirmed_at,
    confirmation_sent_at,
    confirmed_at,
    raw_app_meta_data,
    raw_user_meta_data,
    created_at,
    updated_at
  ) VALUES (
    v_superadmin_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated',
    'authenticated',
    'superadmin@wolfwhale.ca',
    crypt('WolfWhale-Super-2026', gen_salt('bf')),
    now(),
    now(),
    now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Super Admin", "first_name": "Super", "last_name": "Admin"}'::jsonb,
    now(),
    now()
  )
  ON CONFLICT (email) DO NOTHING;

  IF NOT FOUND THEN
    SELECT id INTO v_superadmin_id FROM auth.users WHERE email = 'superadmin@wolfwhale.ca';
  END IF;

  -- ===========================================================================
  -- 4. RE-ENABLE the handle_new_user trigger
  -- ===========================================================================

  ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

  -- ===========================================================================
  -- 5. CREATE PROFILES
  --    The blueprint profiles table uses: id (FK to auth.users), first_name,
  --    last_name, avatar_url, grade_level (VARCHAR).
  -- ===========================================================================

  -- Student profile (grade 8)
  INSERT INTO profiles (id, first_name, last_name, avatar_url, grade_level)
  VALUES (v_student_id, 'Test', 'Student', NULL, '8')
  ON CONFLICT (id) DO NOTHING;

  -- Teacher profile
  INSERT INTO profiles (id, first_name, last_name, avatar_url, grade_level)
  VALUES (v_teacher_id, 'Test', 'Teacher', NULL, NULL)
  ON CONFLICT (id) DO NOTHING;

  -- Parent profile
  INSERT INTO profiles (id, first_name, last_name, avatar_url, grade_level)
  VALUES (v_parent_id, 'Test', 'Parent', NULL, NULL)
  ON CONFLICT (id) DO NOTHING;

  -- School Admin profile
  INSERT INTO profiles (id, first_name, last_name, avatar_url, grade_level)
  VALUES (v_admin_id, 'School', 'Admin', NULL, NULL)
  ON CONFLICT (id) DO NOTHING;

  -- Super Admin profile
  INSERT INTO profiles (id, first_name, last_name, avatar_url, grade_level)
  VALUES (v_superadmin_id, 'Super', 'Admin', NULL, NULL)
  ON CONFLICT (id) DO NOTHING;

  -- ===========================================================================
  -- 6. CREATE TENANT MEMBERSHIPS
  --    Maps each user to the demo tenant with their respective role.
  --    Valid roles: 'student', 'teacher', 'parent', 'admin', 'super_admin'
  -- ===========================================================================

  INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
  VALUES (v_tenant_id, v_student_id, 'student', 'active')
  ON CONFLICT (tenant_id, user_id) DO NOTHING;

  INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
  VALUES (v_tenant_id, v_teacher_id, 'teacher', 'active')
  ON CONFLICT (tenant_id, user_id) DO NOTHING;

  INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
  VALUES (v_tenant_id, v_parent_id, 'parent', 'active')
  ON CONFLICT (tenant_id, user_id) DO NOTHING;

  INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
  VALUES (v_tenant_id, v_admin_id, 'admin', 'active')
  ON CONFLICT (tenant_id, user_id) DO NOTHING;

  INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
  VALUES (v_tenant_id, v_superadmin_id, 'super_admin', 'active')
  ON CONFLICT (tenant_id, user_id) DO NOTHING;

  -- ===========================================================================
  -- 7. LINK PARENT TO STUDENT
  --    The student_parents table enforces relationship IN
  --    ('mother', 'father', 'guardian', 'grandparent', 'other').
  --    Using 'guardian' as the closest match for a generic parent test account.
  -- ===========================================================================

  INSERT INTO student_parents (tenant_id, student_id, parent_id, relationship, is_primary_contact)
  VALUES (v_tenant_id, v_student_id, v_parent_id, 'guardian', true)
  ON CONFLICT (tenant_id, student_id, parent_id) DO NOTHING;

  -- ===========================================================================
  -- Done. Log a notice for confirmation.
  -- ===========================================================================

  RAISE NOTICE '=== Wolf Whale Demo Accounts Created ===';
  RAISE NOTICE 'Tenant ID:     %', v_tenant_id;
  RAISE NOTICE 'Student ID:    % (student@wolfwhale.ca)',    v_student_id;
  RAISE NOTICE 'Teacher ID:    % (teacher@wolfwhale.ca)',    v_teacher_id;
  RAISE NOTICE 'Parent ID:     % (parent@wolfwhale.ca)',     v_parent_id;
  RAISE NOTICE 'Admin ID:      % (admin@wolfwhale.ca)',      v_admin_id;
  RAISE NOTICE 'SuperAdmin ID: % (superadmin@wolfwhale.ca)', v_superadmin_id;

END $$;
