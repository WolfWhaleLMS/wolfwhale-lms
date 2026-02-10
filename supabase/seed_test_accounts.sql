-- =============================================================================
-- Wolf Whale LMS - Test Account Setup
-- Creates the Wolf Whale School tenant and 5 user accounts for testing.
--
-- STEP 1: Cleans up any stale demo-* accounts
-- STEP 2: Creates/ensures 5 proper accounts with correct roles
--
-- Accounts:
--   student@wolfwhale.ca      (student)       Password: WolfWhale-Student-2026
--   teacher@wolfwhale.ca      (teacher)       Password: WolfWhale-Teacher-2026
--   parent@wolfwhale.ca       (parent)        Password: WolfWhale-Parent-2026
--   admin@wolfwhale.ca        (admin)         Password: WolfWhale-Admin-2026
--   superadmin@wolfwhale.ca   (super_admin)   Password: WolfWhale-Super-2026
--
-- Idempotent: safe to run multiple times.
-- Requires: pgcrypto extension (enabled by default in Supabase).
-- =============================================================================

DO $$
DECLARE
  v_tenant_id     UUID;
  v_student_id    UUID;
  v_teacher_id    UUID;
  v_parent_id     UUID;
  v_admin_id      UUID;
  v_superadmin_id UUID;
BEGIN

  -- ===========================================================================
  -- 1. CLEAN UP STALE DEMO ACCOUNTS
  --    Remove any accounts with "demo-" or "demo_" prefix emails that were
  --    created through signup instead of the seed.
  -- ===========================================================================

  DELETE FROM auth.users WHERE email LIKE 'demo-%@%' OR email LIKE 'demo_%@%';

  -- ===========================================================================
  -- 2. CREATE / ENSURE TENANT
  -- ===========================================================================

  INSERT INTO tenants (name, slug, website_url, settings)
  VALUES (
    'Wolf Whale School',
    'demo',
    'wolfwhale.ca',
    '{"grade_scale": "traditional", "gamification_enabled": true, "domain": "wolfwhale.ca"}'::jsonb
  )
  ON CONFLICT (slug) DO UPDATE SET
    name = EXCLUDED.name,
    website_url = EXCLUDED.website_url,
    settings = EXCLUDED.settings
  RETURNING id INTO v_tenant_id;

  -- ===========================================================================
  -- 3. DISABLE the handle_new_user trigger temporarily
  -- ===========================================================================

  ALTER TABLE auth.users DISABLE TRIGGER on_auth_user_created;

  -- ===========================================================================
  -- 4. CREATE AUTH USERS (upsert — fixes passwords/metadata if re-run)
  -- ===========================================================================

  -- Try to fetch existing IDs first
  SELECT id INTO v_student_id FROM auth.users WHERE email = 'student@wolfwhale.ca';
  SELECT id INTO v_teacher_id FROM auth.users WHERE email = 'teacher@wolfwhale.ca';
  SELECT id INTO v_parent_id FROM auth.users WHERE email = 'parent@wolfwhale.ca';
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@wolfwhale.ca';
  SELECT id INTO v_superadmin_id FROM auth.users WHERE email = 'superadmin@wolfwhale.ca';

  -- Generate new UUIDs only for accounts that don't exist yet
  IF v_student_id IS NULL THEN v_student_id := gen_random_uuid(); END IF;
  IF v_teacher_id IS NULL THEN v_teacher_id := gen_random_uuid(); END IF;
  IF v_parent_id IS NULL THEN v_parent_id := gen_random_uuid(); END IF;
  IF v_admin_id IS NULL THEN v_admin_id := gen_random_uuid(); END IF;
  IF v_superadmin_id IS NULL THEN v_superadmin_id := gen_random_uuid(); END IF;

  -- ---- Student ----
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_sent_at, confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_student_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'student@wolfwhale.ca',
    crypt('WolfWhale-Student-2026', gen_salt('bf')),
    now(), now(), now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Alex Student", "first_name": "Alex", "last_name": "Student"}'::jsonb,
    now(), now()
  )
  ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = COALESCE(auth.users.email_confirmed_at, now()),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- ---- Teacher ----
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_sent_at, confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_teacher_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'teacher@wolfwhale.ca',
    crypt('WolfWhale-Teacher-2026', gen_salt('bf')),
    now(), now(), now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Jordan Teacher", "first_name": "Jordan", "last_name": "Teacher"}'::jsonb,
    now(), now()
  )
  ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = COALESCE(auth.users.email_confirmed_at, now()),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- ---- Parent ----
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_sent_at, confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_parent_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'parent@wolfwhale.ca',
    crypt('WolfWhale-Parent-2026', gen_salt('bf')),
    now(), now(), now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Morgan Parent", "first_name": "Morgan", "last_name": "Parent"}'::jsonb,
    now(), now()
  )
  ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = COALESCE(auth.users.email_confirmed_at, now()),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- ---- School Admin ----
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_sent_at, confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_admin_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'admin@wolfwhale.ca',
    crypt('WolfWhale-Admin-2026', gen_salt('bf')),
    now(), now(), now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Sam Admin", "first_name": "Sam", "last_name": "Admin"}'::jsonb,
    now(), now()
  )
  ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = COALESCE(auth.users.email_confirmed_at, now()),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- ---- Super Admin ----
  INSERT INTO auth.users (
    id, instance_id, aud, role, email, encrypted_password,
    email_confirmed_at, confirmation_sent_at, confirmed_at,
    raw_app_meta_data, raw_user_meta_data, created_at, updated_at
  ) VALUES (
    v_superadmin_id,
    '00000000-0000-0000-0000-000000000000',
    'authenticated', 'authenticated',
    'superadmin@wolfwhale.ca',
    crypt('WolfWhale-Super-2026', gen_salt('bf')),
    now(), now(), now(),
    '{"provider": "email", "providers": ["email"]}'::jsonb,
    '{"full_name": "Taylor SuperAdmin", "first_name": "Taylor", "last_name": "SuperAdmin"}'::jsonb,
    now(), now()
  )
  ON CONFLICT (email) DO UPDATE SET
    encrypted_password = EXCLUDED.encrypted_password,
    email_confirmed_at = COALESCE(auth.users.email_confirmed_at, now()),
    raw_user_meta_data = EXCLUDED.raw_user_meta_data;

  -- Re-fetch IDs (in case ON CONFLICT matched existing rows)
  SELECT id INTO v_student_id FROM auth.users WHERE email = 'student@wolfwhale.ca';
  SELECT id INTO v_teacher_id FROM auth.users WHERE email = 'teacher@wolfwhale.ca';
  SELECT id INTO v_parent_id FROM auth.users WHERE email = 'parent@wolfwhale.ca';
  SELECT id INTO v_admin_id FROM auth.users WHERE email = 'admin@wolfwhale.ca';
  SELECT id INTO v_superadmin_id FROM auth.users WHERE email = 'superadmin@wolfwhale.ca';

  -- ===========================================================================
  -- 5. RE-ENABLE the handle_new_user trigger
  -- ===========================================================================

  ALTER TABLE auth.users ENABLE TRIGGER on_auth_user_created;

  -- ===========================================================================
  -- 6. CREATE / UPDATE PROFILES
  -- ===========================================================================

  INSERT INTO profiles (id, first_name, last_name, avatar_url, grade_level)
  VALUES (v_student_id, 'Alex', 'Student', NULL, '8')
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

  INSERT INTO profiles (id, first_name, last_name, avatar_url)
  VALUES (v_teacher_id, 'Jordan', 'Teacher', NULL)
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

  INSERT INTO profiles (id, first_name, last_name, avatar_url)
  VALUES (v_parent_id, 'Morgan', 'Parent', NULL)
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

  INSERT INTO profiles (id, first_name, last_name, avatar_url)
  VALUES (v_admin_id, 'Sam', 'Admin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

  INSERT INTO profiles (id, first_name, last_name, avatar_url)
  VALUES (v_superadmin_id, 'Taylor', 'SuperAdmin', NULL)
  ON CONFLICT (id) DO UPDATE SET
    first_name = EXCLUDED.first_name,
    last_name = EXCLUDED.last_name;

  -- ===========================================================================
  -- 7. CREATE / FIX TENANT MEMBERSHIPS (upsert to fix wrong roles)
  -- ===========================================================================

  INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
  VALUES (v_tenant_id, v_student_id, 'student', 'active')
  ON CONFLICT (tenant_id, user_id) DO UPDATE SET role = 'student', status = 'active';

  INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
  VALUES (v_tenant_id, v_teacher_id, 'teacher', 'active')
  ON CONFLICT (tenant_id, user_id) DO UPDATE SET role = 'teacher', status = 'active';

  INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
  VALUES (v_tenant_id, v_parent_id, 'parent', 'active')
  ON CONFLICT (tenant_id, user_id) DO UPDATE SET role = 'parent', status = 'active';

  INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
  VALUES (v_tenant_id, v_admin_id, 'admin', 'active')
  ON CONFLICT (tenant_id, user_id) DO UPDATE SET role = 'admin', status = 'active';

  INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
  VALUES (v_tenant_id, v_superadmin_id, 'super_admin', 'active')
  ON CONFLICT (tenant_id, user_id) DO UPDATE SET role = 'super_admin', status = 'active';

  -- ===========================================================================
  -- 8. LINK PARENT TO STUDENT
  -- ===========================================================================

  INSERT INTO student_parents (tenant_id, student_id, parent_id, relationship, is_primary_contact)
  VALUES (v_tenant_id, v_student_id, v_parent_id, 'guardian', true)
  ON CONFLICT (tenant_id, student_id, parent_id) DO NOTHING;

  -- ===========================================================================
  -- Done
  -- ===========================================================================

  RAISE NOTICE '=== Wolf Whale Accounts Ready ===';
  RAISE NOTICE 'Tenant:     % (Wolf Whale School)', v_tenant_id;
  RAISE NOTICE 'Student:    % (student@wolfwhale.ca)',    v_student_id;
  RAISE NOTICE 'Teacher:    % (teacher@wolfwhale.ca)',    v_teacher_id;
  RAISE NOTICE 'Parent:     % (parent@wolfwhale.ca)',     v_parent_id;
  RAISE NOTICE 'Admin:      % (admin@wolfwhale.ca)',      v_admin_id;
  RAISE NOTICE 'SuperAdmin: % (superadmin@wolfwhale.ca)', v_superadmin_id;

END $$;
