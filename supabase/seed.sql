-- ============================================================================
-- Wolf Whale LMS - Comprehensive Seed Data
-- Demo School: Wolf Whale Demo School (K-5 Elementary)
-- ============================================================================
--
-- IMPORTANT: This seed file assumes auth.users have already been created
-- via the Supabase Auth Admin API (see scripts/seed-db.ts).
-- The UUIDs below are deterministic placeholders. The seed-db.ts script
-- creates auth users and then runs this SQL, replacing UUIDs as needed.
--
-- ============================================================================
-- DEMO USER ACCOUNTS (create via Supabase Auth API or Dashboard first)
-- ============================================================================
--
-- ADMIN:
--   Dr. Michael Thompson (Principal)
--   Email: admin@wolfwhale.demo    Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000001
--
-- TEACHERS:
--   Ms. Sarah Johnson (Math, Grades 3-5)
--   Email: sarah.johnson@wolfwhale.demo    Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000002
--
--   Mr. David Chen (Science, Grades 3-5)
--   Email: david.chen@wolfwhale.demo       Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000003
--
--   Ms. Emily Rodriguez (English, Grades K-2)
--   Email: emily.rodriguez@wolfwhale.demo  Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000004
--
-- STUDENTS (K-2):
--   Lily Parker (Grade K)
--   Email: lily.parker@wolfwhale.demo      Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000010
--
--   Ethan Brooks (Grade K)
--   Email: ethan.brooks@wolfwhale.demo     Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000011
--
--   Chloe Martinez (Grade 1)
--   Email: chloe.martinez@wolfwhale.demo   Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000012
--
--   Aiden Nguyen (Grade 1)
--   Email: aiden.nguyen@wolfwhale.demo     Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000013
--
--   Mia Washington (Grade 2)
--   Email: mia.washington@wolfwhale.demo   Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000014
--
-- STUDENTS (Grades 3-4):
--   Noah Kim (Grade 3)
--   Email: noah.kim@wolfwhale.demo         Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000015
--
--   Sophia Patel (Grade 3)
--   Email: sophia.patel@wolfwhale.demo     Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000016
--
--   Jackson Lee (Grade 3)
--   Email: jackson.lee@wolfwhale.demo      Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000017
--
--   Olivia Turner (Grade 4)
--   Email: olivia.turner@wolfwhale.demo    Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000018
--
--   Lucas Garcia (Grade 4)
--   Email: lucas.garcia@wolfwhale.demo     Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000019
--
-- STUDENTS (Grade 5):
--   Emma Wilson (Grade 5)
--   Email: emma.wilson@wolfwhale.demo      Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000020
--
--   James Brown (Grade 5)
--   Email: james.brown@wolfwhale.demo      Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000021
--
--   Ava Davis (Grade 5)
--   Email: ava.davis@wolfwhale.demo        Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000022
--
--   Benjamin Harris (Grade 5)
--   Email: benjamin.harris@wolfwhale.demo  Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000023
--
--   Isabella Clark (Grade 5)
--   Email: isabella.clark@wolfwhale.demo   Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000024
--
-- PARENTS:
--   Robert Parker (father of Lily Parker, Ethan Brooks)
--   Email: robert.parker@wolfwhale.demo    Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000030
--
--   Maria Martinez (mother of Chloe Martinez, Aiden Nguyen, Mia Washington)
--   Email: maria.martinez@wolfwhale.demo   Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000031
--
--   Jennifer Kim (mother of Noah Kim, Sophia Patel)
--   Email: jennifer.kim@wolfwhale.demo     Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000032
--
--   David Wilson (father of Emma Wilson, James Brown)
--   Email: david.wilson@wolfwhale.demo     Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000033
--
--   Susan Harris (mother of Benjamin Harris, Isabella Clark)
--   Email: susan.harris@wolfwhale.demo     Password: WolfWhale2026!
--   UUID: a0000000-0000-0000-0000-000000000034
--
-- ============================================================================

BEGIN;

-- ============================================================================
-- 1. UPDATE DEMO TENANT
-- ============================================================================
UPDATE tenants
SET
  name = 'Wolf Whale Demo School',
  description = 'A vibrant K-5 elementary school committed to nurturing curious minds through innovative, technology-enhanced learning. Our school blends traditional teaching with modern digital tools to create an engaging educational experience.',
  logo_url = 'https://ui-avatars.com/api/?name=Wolf+Whale&background=1E40AF&color=fff&size=256',
  website_url = 'https://wolfwhale.demo',
  address = '1234 Ocean Blvd',
  city = 'Santa Monica',
  state = 'California',
  postal_code = '90401',
  country = 'United States',
  phone = '(310) 555-0142',
  subscription_plan = 'growth',
  status = 'active',
  updated_at = NOW()
WHERE slug = 'wolf-whale-demo';

-- ============================================================================
-- 2. PROFILES
-- ============================================================================

-- Admin
INSERT INTO profiles (id, first_name, last_name, avatar_url, phone, bio, timezone)
VALUES (
  'a0000000-0000-0000-0000-000000000001',
  'Michael', 'Thompson',
  'https://ui-avatars.com/api/?name=Michael+Thompson&background=6366F1&color=fff',
  '(310) 555-0100',
  'Principal of Wolf Whale Demo School with 20 years of experience in elementary education. Ed.D. in Educational Leadership from UCLA.',
  'America/Los_Angeles'
);

-- Teachers
INSERT INTO profiles (id, first_name, last_name, avatar_url, phone, bio, timezone)
VALUES
  ('a0000000-0000-0000-0000-000000000002', 'Sarah', 'Johnson',
   'https://ui-avatars.com/api/?name=Sarah+Johnson&background=EC4899&color=fff',
   '(310) 555-0201',
   'Math teacher for grades 3-5. M.Ed. in Mathematics Education. Passionate about making math fun and accessible for every student.',
   'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000003', 'David', 'Chen',
   'https://ui-avatars.com/api/?name=David+Chen&background=10B981&color=fff',
   '(310) 555-0202',
   'Science teacher for grades 3-5. M.S. in Biology. Loves hands-on experiments and outdoor learning.',
   'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000004', 'Emily', 'Rodriguez',
   'https://ui-avatars.com/api/?name=Emily+Rodriguez&background=F59E0B&color=fff',
   '(310) 555-0203',
   'English and Language Arts teacher for grades K-2. M.A. in Early Childhood Education. Believer in the power of storytelling.',
   'America/Los_Angeles');

-- Students K-2
INSERT INTO profiles (id, first_name, last_name, avatar_url, date_of_birth, timezone)
VALUES
  ('a0000000-0000-0000-0000-000000000010', 'Lily', 'Parker',
   'https://ui-avatars.com/api/?name=Lily+Parker&background=A78BFA&color=fff',
   '2020-04-15', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000011', 'Ethan', 'Brooks',
   'https://ui-avatars.com/api/?name=Ethan+Brooks&background=60A5FA&color=fff',
   '2020-08-22', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000012', 'Chloe', 'Martinez',
   'https://ui-avatars.com/api/?name=Chloe+Martinez&background=F472B6&color=fff',
   '2019-02-10', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000013', 'Aiden', 'Nguyen',
   'https://ui-avatars.com/api/?name=Aiden+Nguyen&background=34D399&color=fff',
   '2019-06-30', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000014', 'Mia', 'Washington',
   'https://ui-avatars.com/api/?name=Mia+Washington&background=FBBF24&color=fff',
   '2018-11-05', 'America/Los_Angeles');

-- Students 3-4
INSERT INTO profiles (id, first_name, last_name, avatar_url, date_of_birth, timezone)
VALUES
  ('a0000000-0000-0000-0000-000000000015', 'Noah', 'Kim',
   'https://ui-avatars.com/api/?name=Noah+Kim&background=818CF8&color=fff',
   '2017-03-18', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000016', 'Sophia', 'Patel',
   'https://ui-avatars.com/api/?name=Sophia+Patel&background=FB923C&color=fff',
   '2017-07-25', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000017', 'Jackson', 'Lee',
   'https://ui-avatars.com/api/?name=Jackson+Lee&background=2DD4BF&color=fff',
   '2017-01-12', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000018', 'Olivia', 'Turner',
   'https://ui-avatars.com/api/?name=Olivia+Turner&background=E879F9&color=fff',
   '2016-05-20', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000019', 'Lucas', 'Garcia',
   'https://ui-avatars.com/api/?name=Lucas+Garcia&background=4ADE80&color=fff',
   '2016-09-08', 'America/Los_Angeles');

-- Students Grade 5
INSERT INTO profiles (id, first_name, last_name, avatar_url, date_of_birth, timezone)
VALUES
  ('a0000000-0000-0000-0000-000000000020', 'Emma', 'Wilson',
   'https://ui-avatars.com/api/?name=Emma+Wilson&background=F87171&color=fff',
   '2015-01-28', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000021', 'James', 'Brown',
   'https://ui-avatars.com/api/?name=James+Brown&background=38BDF8&color=fff',
   '2015-06-14', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000022', 'Ava', 'Davis',
   'https://ui-avatars.com/api/?name=Ava+Davis&background=C084FC&color=fff',
   '2015-03-09', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000023', 'Benjamin', 'Harris',
   'https://ui-avatars.com/api/?name=Benjamin+Harris&background=FB7185&color=fff',
   '2015-10-31', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000024', 'Isabella', 'Clark',
   'https://ui-avatars.com/api/?name=Isabella+Clark&background=A3E635&color=fff',
   '2015-12-19', 'America/Los_Angeles');

-- Parents
INSERT INTO profiles (id, first_name, last_name, avatar_url, phone, timezone)
VALUES
  ('a0000000-0000-0000-0000-000000000030', 'Robert', 'Parker',
   'https://ui-avatars.com/api/?name=Robert+Parker&background=6B7280&color=fff',
   '(310) 555-0301', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000031', 'Maria', 'Martinez',
   'https://ui-avatars.com/api/?name=Maria+Martinez&background=6B7280&color=fff',
   '(310) 555-0302', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000032', 'Jennifer', 'Kim',
   'https://ui-avatars.com/api/?name=Jennifer+Kim&background=6B7280&color=fff',
   '(310) 555-0303', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000033', 'David', 'Wilson',
   'https://ui-avatars.com/api/?name=David+Wilson&background=6B7280&color=fff',
   '(310) 555-0304', 'America/Los_Angeles'),
  ('a0000000-0000-0000-0000-000000000034', 'Susan', 'Harris',
   'https://ui-avatars.com/api/?name=Susan+Harris&background=6B7280&color=fff',
   '(310) 555-0305', 'America/Los_Angeles');

-- ============================================================================
-- 3. TENANT MEMBERSHIPS
-- ============================================================================

INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
SELECT t.id, 'a0000000-0000-0000-0000-000000000001'::uuid, 'admin', 'active'
FROM tenants t WHERE t.slug = 'wolf-whale-demo';

INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
SELECT t.id, u.uid, 'teacher', 'active'
FROM tenants t, (VALUES
  ('a0000000-0000-0000-0000-000000000002'::uuid),
  ('a0000000-0000-0000-0000-000000000003'::uuid),
  ('a0000000-0000-0000-0000-000000000004'::uuid)
) AS u(uid)
WHERE t.slug = 'wolf-whale-demo';

INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
SELECT t.id, u.uid, 'student', 'active'
FROM tenants t, (VALUES
  ('a0000000-0000-0000-0000-000000000010'::uuid),
  ('a0000000-0000-0000-0000-000000000011'::uuid),
  ('a0000000-0000-0000-0000-000000000012'::uuid),
  ('a0000000-0000-0000-0000-000000000013'::uuid),
  ('a0000000-0000-0000-0000-000000000014'::uuid),
  ('a0000000-0000-0000-0000-000000000015'::uuid),
  ('a0000000-0000-0000-0000-000000000016'::uuid),
  ('a0000000-0000-0000-0000-000000000017'::uuid),
  ('a0000000-0000-0000-0000-000000000018'::uuid),
  ('a0000000-0000-0000-0000-000000000019'::uuid),
  ('a0000000-0000-0000-0000-000000000020'::uuid),
  ('a0000000-0000-0000-0000-000000000021'::uuid),
  ('a0000000-0000-0000-0000-000000000022'::uuid),
  ('a0000000-0000-0000-0000-000000000023'::uuid),
  ('a0000000-0000-0000-0000-000000000024'::uuid)
) AS u(uid)
WHERE t.slug = 'wolf-whale-demo';

INSERT INTO tenant_memberships (tenant_id, user_id, role, status)
SELECT t.id, u.uid, 'parent', 'active'
FROM tenants t, (VALUES
  ('a0000000-0000-0000-0000-000000000030'::uuid),
  ('a0000000-0000-0000-0000-000000000031'::uuid),
  ('a0000000-0000-0000-0000-000000000032'::uuid),
  ('a0000000-0000-0000-0000-000000000033'::uuid),
  ('a0000000-0000-0000-0000-000000000034'::uuid)
) AS u(uid)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 4. STUDENT-PARENT RELATIONSHIPS
-- ============================================================================

INSERT INTO student_parents (tenant_id, student_id, parent_id, relationship, status)
SELECT t.id, r.student_id, r.parent_id, r.rel, 'active'
FROM tenants t, (VALUES
  -- Robert Parker -> Lily Parker, Ethan Brooks
  ('a0000000-0000-0000-0000-000000000010'::uuid, 'a0000000-0000-0000-0000-000000000030'::uuid, 'father'),
  ('a0000000-0000-0000-0000-000000000011'::uuid, 'a0000000-0000-0000-0000-000000000030'::uuid, 'father'),
  -- Maria Martinez -> Chloe Martinez, Aiden Nguyen, Mia Washington
  ('a0000000-0000-0000-0000-000000000012'::uuid, 'a0000000-0000-0000-0000-000000000031'::uuid, 'mother'),
  ('a0000000-0000-0000-0000-000000000013'::uuid, 'a0000000-0000-0000-0000-000000000031'::uuid, 'mother'),
  ('a0000000-0000-0000-0000-000000000014'::uuid, 'a0000000-0000-0000-0000-000000000031'::uuid, 'mother'),
  -- Jennifer Kim -> Noah Kim, Sophia Patel
  ('a0000000-0000-0000-0000-000000000015'::uuid, 'a0000000-0000-0000-0000-000000000032'::uuid, 'mother'),
  ('a0000000-0000-0000-0000-000000000016'::uuid, 'a0000000-0000-0000-0000-000000000032'::uuid, 'guardian'),
  -- David Wilson -> Emma Wilson, James Brown
  ('a0000000-0000-0000-0000-000000000020'::uuid, 'a0000000-0000-0000-0000-000000000033'::uuid, 'father'),
  ('a0000000-0000-0000-0000-000000000021'::uuid, 'a0000000-0000-0000-0000-000000000033'::uuid, 'father'),
  -- Susan Harris -> Benjamin Harris, Isabella Clark
  ('a0000000-0000-0000-0000-000000000023'::uuid, 'a0000000-0000-0000-0000-000000000034'::uuid, 'mother'),
  ('a0000000-0000-0000-0000-000000000024'::uuid, 'a0000000-0000-0000-0000-000000000034'::uuid, 'guardian')
) AS r(student_id, parent_id, rel)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 5. COURSES (6 courses)
-- ============================================================================

INSERT INTO courses (id, tenant_id, name, description, subject, grade_level, created_by, semester, start_date, end_date, status)
SELECT
  c.cid, t.id, c.cname, c.cdesc, c.csubject, c.cgrade, c.cteacher, c.csemester, c.cstart, c.cend, 'active'
FROM tenants t, (VALUES
  ('c0000000-0000-0000-0000-000000000001'::uuid,
   'Math 3A', 'Third grade mathematics covering multiplication, division, fractions introduction, and basic geometry. Students will build number sense and problem-solving skills.',
   'Mathematics', '3', 'a0000000-0000-0000-0000-000000000002'::uuid,
   'Spring 2026', '2026-01-12'::date, '2026-06-12'::date),
  ('c0000000-0000-0000-0000-000000000002'::uuid,
   'Math 4A', 'Fourth grade mathematics covering multi-digit multiplication, long division, fractions, decimals, and measurement. Emphasis on real-world application.',
   'Mathematics', '4', 'a0000000-0000-0000-0000-000000000002'::uuid,
   'Spring 2026', '2026-01-12'::date, '2026-06-12'::date),
  ('c0000000-0000-0000-0000-000000000003'::uuid,
   'Math 5A', 'Fifth grade mathematics covering advanced fractions, decimals, percentages, volume, and coordinate graphing. Prepares students for middle school math.',
   'Mathematics', '5', 'a0000000-0000-0000-0000-000000000002'::uuid,
   'Spring 2026', '2026-01-12'::date, '2026-06-12'::date),
  ('c0000000-0000-0000-0000-000000000004'::uuid,
   'Science 3A', 'Third grade science exploring life cycles, weather and climate, forces and motion, and the engineering design process through hands-on experiments.',
   'Science', '3', 'a0000000-0000-0000-0000-000000000003'::uuid,
   'Spring 2026', '2026-01-12'::date, '2026-06-12'::date),
  ('c0000000-0000-0000-0000-000000000005'::uuid,
   'Science 5A', 'Fifth grade science covering ecosystems, Earth systems, matter and its properties, and energy transfer. Includes weekly lab activities.',
   'Science', '5', 'a0000000-0000-0000-0000-000000000003'::uuid,
   'Spring 2026', '2026-01-12'::date, '2026-06-12'::date),
  ('c0000000-0000-0000-0000-000000000006'::uuid,
   'English K-2', 'Early literacy and language arts for grades K-2. Covers phonics, sight words, reading comprehension, creative writing, and storytelling.',
   'English Language Arts', 'K-2', 'a0000000-0000-0000-0000-000000000004'::uuid,
   'Spring 2026', '2026-01-12'::date, '2026-06-12'::date)
) AS c(cid, cname, cdesc, csubject, cgrade, cteacher, csemester, cstart, cend)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 6. COURSE ENROLLMENTS
-- ============================================================================

-- Math 3A: Noah Kim, Sophia Patel, Jackson Lee (grade 3)
INSERT INTO course_enrollments (tenant_id, course_id, student_id, teacher_id, status)
SELECT t.id, 'c0000000-0000-0000-0000-000000000001'::uuid, s.sid, 'a0000000-0000-0000-0000-000000000002'::uuid, 'active'
FROM tenants t, (VALUES
  ('a0000000-0000-0000-0000-000000000015'::uuid),
  ('a0000000-0000-0000-0000-000000000016'::uuid),
  ('a0000000-0000-0000-0000-000000000017'::uuid)
) AS s(sid)
WHERE t.slug = 'wolf-whale-demo';

-- Math 4A: Olivia Turner, Lucas Garcia (grade 4)
INSERT INTO course_enrollments (tenant_id, course_id, student_id, teacher_id, status)
SELECT t.id, 'c0000000-0000-0000-0000-000000000002'::uuid, s.sid, 'a0000000-0000-0000-0000-000000000002'::uuid, 'active'
FROM tenants t, (VALUES
  ('a0000000-0000-0000-0000-000000000018'::uuid),
  ('a0000000-0000-0000-0000-000000000019'::uuid)
) AS s(sid)
WHERE t.slug = 'wolf-whale-demo';

-- Math 5A: Emma Wilson, James Brown, Ava Davis, Benjamin Harris, Isabella Clark (grade 5)
INSERT INTO course_enrollments (tenant_id, course_id, student_id, teacher_id, status)
SELECT t.id, 'c0000000-0000-0000-0000-000000000003'::uuid, s.sid, 'a0000000-0000-0000-0000-000000000002'::uuid, 'active'
FROM tenants t, (VALUES
  ('a0000000-0000-0000-0000-000000000020'::uuid),
  ('a0000000-0000-0000-0000-000000000021'::uuid),
  ('a0000000-0000-0000-0000-000000000022'::uuid),
  ('a0000000-0000-0000-0000-000000000023'::uuid),
  ('a0000000-0000-0000-0000-000000000024'::uuid)
) AS s(sid)
WHERE t.slug = 'wolf-whale-demo';

-- Science 3A: Noah Kim, Sophia Patel, Jackson Lee (grade 3)
INSERT INTO course_enrollments (tenant_id, course_id, student_id, teacher_id, status)
SELECT t.id, 'c0000000-0000-0000-0000-000000000004'::uuid, s.sid, 'a0000000-0000-0000-0000-000000000003'::uuid, 'active'
FROM tenants t, (VALUES
  ('a0000000-0000-0000-0000-000000000015'::uuid),
  ('a0000000-0000-0000-0000-000000000016'::uuid),
  ('a0000000-0000-0000-0000-000000000017'::uuid)
) AS s(sid)
WHERE t.slug = 'wolf-whale-demo';

-- Science 5A: Emma Wilson, James Brown, Ava Davis, Benjamin Harris, Isabella Clark (grade 5)
INSERT INTO course_enrollments (tenant_id, course_id, student_id, teacher_id, status)
SELECT t.id, 'c0000000-0000-0000-0000-000000000005'::uuid, s.sid, 'a0000000-0000-0000-0000-000000000003'::uuid, 'active'
FROM tenants t, (VALUES
  ('a0000000-0000-0000-0000-000000000020'::uuid),
  ('a0000000-0000-0000-0000-000000000021'::uuid),
  ('a0000000-0000-0000-0000-000000000022'::uuid),
  ('a0000000-0000-0000-0000-000000000023'::uuid),
  ('a0000000-0000-0000-0000-000000000024'::uuid)
) AS s(sid)
WHERE t.slug = 'wolf-whale-demo';

-- English K-2: Lily Parker, Ethan Brooks, Chloe Martinez, Aiden Nguyen, Mia Washington
INSERT INTO course_enrollments (tenant_id, course_id, student_id, teacher_id, status)
SELECT t.id, 'c0000000-0000-0000-0000-000000000006'::uuid, s.sid, 'a0000000-0000-0000-0000-000000000004'::uuid, 'active'
FROM tenants t, (VALUES
  ('a0000000-0000-0000-0000-000000000010'::uuid),
  ('a0000000-0000-0000-0000-000000000011'::uuid),
  ('a0000000-0000-0000-0000-000000000012'::uuid),
  ('a0000000-0000-0000-0000-000000000013'::uuid),
  ('a0000000-0000-0000-0000-000000000014'::uuid)
) AS s(sid)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 7. LESSONS (3-5 per course, all published)
-- ============================================================================

-- Math 3A Lessons
INSERT INTO lessons (id, tenant_id, course_id, title, description, content, order_index, created_by, status, published_at)
SELECT l.lid, t.id, 'c0000000-0000-0000-0000-000000000001'::uuid, l.ltitle, l.ldesc, l.lcontent, l.lorder, 'a0000000-0000-0000-0000-000000000002'::uuid, 'published', NOW() - INTERVAL '14 days'
FROM tenants t, (VALUES
  ('d0000000-0000-0000-0001-000000000001'::uuid, 'Chapter 1: Multiplication Basics', 'Understanding multiplication as repeated addition and arrays.', 'In this lesson, we will explore multiplication as a way of adding equal groups together. For example, 3 x 4 means 3 groups of 4, which is the same as 4 + 4 + 4 = 12. We will use arrays (rows and columns of objects) to visualize multiplication facts.', 1),
  ('d0000000-0000-0000-0001-000000000002'::uuid, 'Chapter 2: Multiplication Facts to 12', 'Memorizing multiplication tables and identifying patterns.', 'Practice your multiplication facts from 1 through 12. Look for patterns: any number times 1 is itself, any number times 0 is 0, and multiplying by 10 just adds a zero. We will use flashcards, games, and timed drills.', 2),
  ('d0000000-0000-0000-0001-000000000003'::uuid, 'Chapter 3: Introduction to Division', 'Understanding division as equal sharing and grouping.', 'Division is the opposite of multiplication. When we divide 12 by 3, we are asking: how many groups of 3 fit into 12? Or, if we share 12 objects among 3 friends, how many does each person get? The answer is 4.', 3),
  ('d0000000-0000-0000-0001-000000000004'::uuid, 'Chapter 4: Fractions Introduction', 'Learning about halves, thirds, and fourths.', 'A fraction represents a part of a whole. The bottom number (denominator) tells us how many equal parts the whole is divided into. The top number (numerator) tells us how many of those parts we have. For example, 1/2 means one out of two equal parts.', 4)
) AS l(lid, ltitle, ldesc, lcontent, lorder)
WHERE t.slug = 'wolf-whale-demo';

-- Math 4A Lessons
INSERT INTO lessons (id, tenant_id, course_id, title, description, content, order_index, created_by, status, published_at)
SELECT l.lid, t.id, 'c0000000-0000-0000-0000-000000000002'::uuid, l.ltitle, l.ldesc, l.lcontent, l.lorder, 'a0000000-0000-0000-0000-000000000002'::uuid, 'published', NOW() - INTERVAL '14 days'
FROM tenants t, (VALUES
  ('d0000000-0000-0000-0002-000000000001'::uuid, 'Chapter 1: Multi-Digit Multiplication', 'Multiplying 2-digit and 3-digit numbers using the standard algorithm.', 'We will learn the step-by-step process for multiplying large numbers. Start by multiplying the ones digit, then the tens digit, and add the partial products together. Always line up your place values carefully.', 1),
  ('d0000000-0000-0000-0002-000000000002'::uuid, 'Chapter 2: Long Division', 'Dividing multi-digit numbers with remainders.', 'Long division follows four steps: Divide, Multiply, Subtract, Bring Down. We use the mnemonic Does McDonalds Sell Burgers to remember. We will practice with and without remainders.', 2),
  ('d0000000-0000-0000-0002-000000000003'::uuid, 'Chapter 3: Equivalent Fractions', 'Finding equivalent fractions and simplifying.', 'Equivalent fractions look different but represent the same amount. You can find equivalent fractions by multiplying or dividing both the numerator and denominator by the same number. For example, 1/2 = 2/4 = 3/6.', 3)
) AS l(lid, ltitle, ldesc, lcontent, lorder)
WHERE t.slug = 'wolf-whale-demo';

-- Math 5A Lessons
INSERT INTO lessons (id, tenant_id, course_id, title, description, content, order_index, created_by, status, published_at)
SELECT l.lid, t.id, 'c0000000-0000-0000-0000-000000000003'::uuid, l.ltitle, l.ldesc, l.lcontent, l.lorder, 'a0000000-0000-0000-0000-000000000002'::uuid, 'published', NOW() - INTERVAL '14 days'
FROM tenants t, (VALUES
  ('d0000000-0000-0000-0003-000000000001'::uuid, 'Chapter 1: Adding and Subtracting Fractions', 'Working with fractions that have unlike denominators.', 'To add or subtract fractions with different denominators, we first find the least common denominator (LCD). Convert each fraction to an equivalent fraction with the LCD, then add or subtract the numerators. Simplify the result.', 1),
  ('d0000000-0000-0000-0003-000000000002'::uuid, 'Chapter 2: Multiplying Fractions', 'Multiplying fractions and mixed numbers.', 'To multiply fractions, multiply the numerators together and the denominators together. For mixed numbers, first convert to improper fractions. Simplify your answer. For example, 2/3 x 3/4 = 6/12 = 1/2.', 2),
  ('d0000000-0000-0000-0003-000000000003'::uuid, 'Chapter 3: Decimals and Percentages', 'Converting between fractions, decimals, and percentages.', 'Fractions, decimals, and percentages are all ways to represent parts of a whole. To convert a fraction to a decimal, divide the numerator by the denominator. To convert a decimal to a percent, multiply by 100.', 3),
  ('d0000000-0000-0000-0003-000000000004'::uuid, 'Chapter 4: Volume and Measurement', 'Calculating volume of rectangular prisms.', 'Volume measures the space inside a 3D shape. For a rectangular prism, Volume = length x width x height. We measure volume in cubic units like cubic centimeters or cubic inches.', 4),
  ('d0000000-0000-0000-0003-000000000005'::uuid, 'Chapter 5: Coordinate Graphing', 'Plotting points on the coordinate plane.', 'The coordinate plane has two axes: the x-axis (horizontal) and the y-axis (vertical). A point is described by an ordered pair (x, y). The first number tells how far to go right, and the second tells how far to go up.', 5)
) AS l(lid, ltitle, ldesc, lcontent, lorder)
WHERE t.slug = 'wolf-whale-demo';

-- Science 3A Lessons
INSERT INTO lessons (id, tenant_id, course_id, title, description, content, order_index, created_by, status, published_at)
SELECT l.lid, t.id, 'c0000000-0000-0000-0000-000000000004'::uuid, l.ltitle, l.ldesc, l.lcontent, l.lorder, 'a0000000-0000-0000-0000-000000000003'::uuid, 'published', NOW() - INTERVAL '14 days'
FROM tenants t, (VALUES
  ('d0000000-0000-0000-0004-000000000001'::uuid, 'Life Cycles: From Egg to Butterfly', 'Exploring the stages of a butterfly life cycle.', 'Butterflies go through four stages: egg, larva (caterpillar), pupa (chrysalis), and adult butterfly. This process is called complete metamorphosis. We will observe real caterpillars in class and document each stage.', 1),
  ('d0000000-0000-0000-0004-000000000002'::uuid, 'Weather Patterns and Climate', 'Understanding weather instruments and forecasting.', 'Weather is the condition of the atmosphere at a specific time and place. We use thermometers to measure temperature, rain gauges for precipitation, wind vanes for direction, and anemometers for wind speed.', 2),
  ('d0000000-0000-0000-0004-000000000003'::uuid, 'Forces and Motion', 'Investigating pushes, pulls, and friction.', 'A force is a push or pull that can change the speed, direction, or shape of an object. Friction is a force that slows down moving objects. Gravity is the force that pulls everything toward Earth.', 3),
  ('d0000000-0000-0000-0004-000000000004'::uuid, 'Simple Machines Around Us', 'Identifying levers, pulleys, and inclined planes.', 'Simple machines make work easier by changing the direction or amount of force needed. The six simple machines are: lever, wheel and axle, pulley, inclined plane, wedge, and screw. Can you find examples in our classroom?', 4)
) AS l(lid, ltitle, ldesc, lcontent, lorder)
WHERE t.slug = 'wolf-whale-demo';

-- Science 5A Lessons
INSERT INTO lessons (id, tenant_id, course_id, title, description, content, order_index, created_by, status, published_at)
SELECT l.lid, t.id, 'c0000000-0000-0000-0000-000000000005'::uuid, l.ltitle, l.ldesc, l.lcontent, l.lorder, 'a0000000-0000-0000-0000-000000000003'::uuid, 'published', NOW() - INTERVAL '14 days'
FROM tenants t, (VALUES
  ('d0000000-0000-0000-0005-000000000001'::uuid, 'Ecosystems and Food Webs', 'Understanding producers, consumers, and decomposers.', 'An ecosystem is a community of living organisms interacting with their environment. Energy flows from the sun to producers (plants), then to consumers (animals), and finally to decomposers. A food web shows all the feeding relationships in an ecosystem.', 1),
  ('d0000000-0000-0000-0005-000000000002'::uuid, 'Earth''s Water Cycle', 'Tracing water through evaporation, condensation, and precipitation.', 'The water cycle is the continuous movement of water on, above, and below the Earth''s surface. Water evaporates from oceans and lakes, condenses into clouds, falls as precipitation, and flows back into bodies of water.', 2),
  ('d0000000-0000-0000-0005-000000000003'::uuid, 'Properties of Matter', 'Exploring physical and chemical properties of materials.', 'Matter is anything that has mass and takes up space. Physical properties include color, shape, size, and density. Chemical properties describe how matter can change into new substances through reactions.', 3),
  ('d0000000-0000-0000-0005-000000000004'::uuid, 'Energy Transfer and Heat', 'Investigating conduction, convection, and radiation.', 'Heat energy can transfer in three ways: conduction (through direct contact), convection (through moving fluids), and radiation (through electromagnetic waves). The sun heats the Earth through radiation.', 4),
  ('d0000000-0000-0000-0005-000000000005'::uuid, 'Mixtures and Solutions', 'Separating mixtures and understanding solubility.', 'A mixture is a combination of substances that can be separated by physical means. A solution is a special type of mixture where one substance dissolves in another. We will experiment with dissolving different substances in water.', 5)
) AS l(lid, ltitle, ldesc, lcontent, lorder)
WHERE t.slug = 'wolf-whale-demo';

-- English K-2 Lessons
INSERT INTO lessons (id, tenant_id, course_id, title, description, content, order_index, created_by, status, published_at)
SELECT l.lid, t.id, 'c0000000-0000-0000-0000-000000000006'::uuid, l.ltitle, l.ldesc, l.lcontent, l.lorder, 'a0000000-0000-0000-0000-000000000004'::uuid, 'published', NOW() - INTERVAL '14 days'
FROM tenants t, (VALUES
  ('d0000000-0000-0000-0006-000000000001'::uuid, 'Letter Sounds: A Through M', 'Practicing letter sounds and beginning phonics.', 'Today we will practice the sounds that letters A through M make. Each letter has at least one sound. Some letters, like the vowels A and E, can make more than one sound. Listen carefully and repeat after me!', 1),
  ('d0000000-0000-0000-0006-000000000002'::uuid, 'Sight Words: Set 1', 'Learning our first 20 high-frequency words.', 'Sight words are words we see so often that we should recognize them instantly. Our first set includes: the, and, is, it, you, that, was, for, are, with, his, they, at, be, this, from, or, one, had, by.', 2),
  ('d0000000-0000-0000-0006-000000000003'::uuid, 'Story Time: Beginning, Middle, and End', 'Understanding story structure with picture books.', 'Every story has three parts: the beginning introduces the characters and setting, the middle presents a problem or adventure, and the end shows how the problem is solved. Let us read "The Very Hungry Caterpillar" and identify each part.', 3),
  ('d0000000-0000-0000-0006-000000000004'::uuid, 'Writing Our Names and Simple Sentences', 'Practicing handwriting and sentence structure.', 'A sentence is a group of words that tells a complete thought. Every sentence starts with a capital letter and ends with a period, question mark, or exclamation point. Today we will write sentences about our favorite animals.', 4),
  ('d0000000-0000-0000-0006-000000000005'::uuid, 'Show and Tell: Speaking and Listening', 'Building confidence in oral communication.', 'Good speakers talk clearly, make eye contact, and share interesting details. Good listeners sit quietly, look at the speaker, and ask questions. Today, each student will share something special and practice both roles.', 5)
) AS l(lid, ltitle, ldesc, lcontent, lorder)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 8. ASSIGNMENTS (2-3 per course, mix of past-due and upcoming)
-- ============================================================================

INSERT INTO assignments (id, tenant_id, course_id, title, description, instructions, type, created_by, due_date, available_date, max_points, submission_type, allow_late_submission, late_submission_days, status)
SELECT a.aid, t.id, a.acourse, a.atitle, a.adesc, a.ainstr, a.atype, a.ateacher, a.adue, a.aavail, a.apoints, a.asubtype, a.alate, a.alatedays, a.astatus
FROM tenants t, (VALUES
  -- Math 3A assignments
  ('e0000000-0000-0000-0001-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid,
   'Multiplication Tables Quiz', 'Test your knowledge of multiplication facts 1-12.',
   'Complete all 30 multiplication problems. Show your work for any problem where you need to use a strategy.',
   'quiz', 'a0000000-0000-0000-0000-000000000002'::uuid,
   (NOW() - INTERVAL '5 days')::timestamptz, (NOW() - INTERVAL '12 days')::timestamptz,
   30.00, 'text', true, 3, 'assigned'),
  ('e0000000-0000-0000-0001-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid,
   'Division Word Problems Worksheet', 'Solve real-world division problems.',
   'Read each word problem carefully. Draw a picture or diagram to help you solve it. Write a complete number sentence for each answer.',
   'homework', 'a0000000-0000-0000-0000-000000000002'::uuid,
   (NOW() + INTERVAL '5 days')::timestamptz, (NOW() - INTERVAL '2 days')::timestamptz,
   50.00, 'file', true, 2, 'assigned'),
  ('e0000000-0000-0000-0001-000000000003'::uuid, 'c0000000-0000-0000-0000-000000000001'::uuid,
   'Fractions Exploration Project', 'Create a poster showing fractions in everyday life.',
   'Find at least 5 examples of fractions in your daily life (cooking, sports, sharing, etc.). Create a colorful poster showing each example with pictures and labels.',
   'project', 'a0000000-0000-0000-0000-000000000002'::uuid,
   (NOW() + INTERVAL '14 days')::timestamptz, NOW()::timestamptz,
   100.00, 'file', true, 5, 'assigned'),

  -- Math 4A assignments
  ('e0000000-0000-0000-0002-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid,
   'Multi-Digit Multiplication Practice', 'Practice multiplying 2-digit by 2-digit numbers.',
   'Complete problems 1-20 in the workbook. Show all your work using the standard algorithm. Circle your final answer.',
   'homework', 'a0000000-0000-0000-0000-000000000002'::uuid,
   (NOW() - INTERVAL '3 days')::timestamptz, (NOW() - INTERVAL '10 days')::timestamptz,
   40.00, 'file', true, 2, 'assigned'),
  ('e0000000-0000-0000-0002-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000002'::uuid,
   'Long Division Challenge', 'Demonstrate mastery of the long division algorithm.',
   'Solve 15 long division problems. Show all four steps (Divide, Multiply, Subtract, Bring Down) for each problem. Check your work using multiplication.',
   'homework', 'a0000000-0000-0000-0000-000000000002'::uuid,
   (NOW() + INTERVAL '7 days')::timestamptz, NOW()::timestamptz,
   60.00, 'file', true, 3, 'assigned'),

  -- Math 5A assignments
  ('e0000000-0000-0000-0003-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid,
   'Chapter 1: Fractions Worksheet', 'Practice adding and subtracting fractions with unlike denominators.',
   'Complete all 25 problems. For each problem, find the LCD, convert both fractions, add or subtract, and simplify your answer.',
   'homework', 'a0000000-0000-0000-0000-000000000002'::uuid,
   (NOW() - INTERVAL '7 days')::timestamptz, (NOW() - INTERVAL '14 days')::timestamptz,
   50.00, 'file', true, 2, 'assigned'),
  ('e0000000-0000-0000-0003-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid,
   'Decimals and Percentages Conversion Quiz', 'Convert between fractions, decimals, and percentages.',
   'This quiz has 20 questions. Convert each number to the other two forms. Example: 1/4 = 0.25 = 25%.',
   'quiz', 'a0000000-0000-0000-0000-000000000002'::uuid,
   (NOW() + INTERVAL '3 days')::timestamptz, (NOW() - INTERVAL '1 day')::timestamptz,
   40.00, 'text', false, 0, 'assigned'),
  ('e0000000-0000-0000-0003-000000000003'::uuid, 'c0000000-0000-0000-0000-000000000003'::uuid,
   'Volume and Measurement Lab Report', 'Calculate the volume of various classroom objects.',
   'Measure 5 rectangular objects in the classroom. Record length, width, and height in centimeters. Calculate the volume of each. Present your findings in a neat table.',
   'project', 'a0000000-0000-0000-0000-000000000002'::uuid,
   (NOW() + INTERVAL '10 days')::timestamptz, NOW()::timestamptz,
   80.00, 'file', true, 3, 'assigned'),

  -- Science 3A assignments
  ('e0000000-0000-0000-0004-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000004'::uuid,
   'Butterfly Life Cycle Project', 'Document the four stages of butterfly metamorphosis.',
   'Create a poster or diorama showing all four stages of the butterfly life cycle. Label each stage and write 2-3 sentences describing what happens.',
   'project', 'a0000000-0000-0000-0000-000000000003'::uuid,
   (NOW() - INTERVAL '4 days')::timestamptz, (NOW() - INTERVAL '14 days')::timestamptz,
   100.00, 'file', true, 5, 'assigned'),
  ('e0000000-0000-0000-0004-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000004'::uuid,
   'Weather Journal: 5-Day Forecast', 'Record and predict weather over five days.',
   'Each day for five days, record the temperature, cloud cover, wind, and precipitation. On day 5, predict the weather for the next two days based on patterns you observed.',
   'homework', 'a0000000-0000-0000-0000-000000000003'::uuid,
   (NOW() + INTERVAL '8 days')::timestamptz, NOW()::timestamptz,
   50.00, 'file', true, 2, 'assigned'),

  -- Science 5A assignments
  ('e0000000-0000-0000-0005-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000005'::uuid,
   'Ecosystem Food Web Diagram', 'Create a detailed food web for a chosen ecosystem.',
   'Choose one ecosystem (forest, ocean, desert, or grassland). Research at least 10 organisms. Draw a food web showing the energy flow between producers, consumers, and decomposers.',
   'project', 'a0000000-0000-0000-0000-000000000003'::uuid,
   (NOW() - INTERVAL '6 days')::timestamptz, (NOW() - INTERVAL '20 days')::timestamptz,
   100.00, 'file', true, 3, 'assigned'),
  ('e0000000-0000-0000-0005-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000005'::uuid,
   'Water Cycle Lab Experiment Report', 'Conduct the evaporation and condensation experiment.',
   'Follow the lab procedure to create a mini water cycle in a zip-lock bag. Observe for 3 days. Record your observations and explain each stage of the water cycle you observe.',
   'homework', 'a0000000-0000-0000-0000-000000000003'::uuid,
   (NOW() + INTERVAL '6 days')::timestamptz, (NOW() - INTERVAL '1 day')::timestamptz,
   75.00, 'file', true, 2, 'assigned'),
  ('e0000000-0000-0000-0005-000000000003'::uuid, 'c0000000-0000-0000-0000-000000000005'::uuid,
   'Properties of Matter Quiz', 'Identify physical and chemical properties of various materials.',
   'This quiz covers physical and chemical properties. Define key terms, classify examples, and explain why certain changes are physical or chemical.',
   'quiz', 'a0000000-0000-0000-0000-000000000003'::uuid,
   (NOW() + INTERVAL '12 days')::timestamptz, (NOW() + INTERVAL '5 days')::timestamptz,
   40.00, 'text', false, 0, 'assigned'),

  -- English K-2 assignments
  ('e0000000-0000-0000-0006-000000000001'::uuid, 'c0000000-0000-0000-0000-000000000006'::uuid,
   'My Favorite Animal Drawing and Sentence', 'Draw your favorite animal and write a sentence about it.',
   'Draw a picture of your favorite animal using crayons or markers. Write one or two sentences telling us what the animal is and why you like it. Remember to start with a capital letter and end with a period!',
   'homework', 'a0000000-0000-0000-0000-000000000004'::uuid,
   (NOW() - INTERVAL '3 days')::timestamptz, (NOW() - INTERVAL '10 days')::timestamptz,
   20.00, 'file', true, 5, 'assigned'),
  ('e0000000-0000-0000-0006-000000000002'::uuid, 'c0000000-0000-0000-0000-000000000006'::uuid,
   'Sight Words Practice Sheet: Set 1', 'Practice writing and reading our first 20 sight words.',
   'Trace each sight word three times. Then write it on your own one time. Practice reading each word aloud to a family member.',
   'homework', 'a0000000-0000-0000-0000-000000000004'::uuid,
   (NOW() + INTERVAL '4 days')::timestamptz, NOW()::timestamptz,
   20.00, 'file', true, 3, 'assigned'),
  ('e0000000-0000-0000-0006-000000000003'::uuid, 'c0000000-0000-0000-0000-000000000006'::uuid,
   'Story Retelling: The Very Hungry Caterpillar', 'Retell the story in your own words with illustrations.',
   'Draw three pictures: one for the beginning, one for the middle, and one for the end of the story. Write a sentence under each picture retelling what happened.',
   'project', 'a0000000-0000-0000-0000-000000000004'::uuid,
   (NOW() + INTERVAL '11 days')::timestamptz, (NOW() + INTERVAL '2 days')::timestamptz,
   50.00, 'file', true, 5, 'assigned')
) AS a(aid, acourse, atitle, adesc, ainstr, atype, ateacher, adue, aavail, apoints, asubtype, alate, alatedays, astatus)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 9. SUBMISSIONS AND GRADES (for past-due assignments)
-- ============================================================================

-- Submissions for Math 3A - Multiplication Tables Quiz (past due)
INSERT INTO submissions (id, tenant_id, assignment_id, student_id, submission_text, status, submitted_at, submitted_late)
SELECT s.sid, t.id, 'e0000000-0000-0000-0001-000000000001'::uuid, s.student, s.stext, s.sstatus, s.sdate, s.slate
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0001-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000015'::uuid, 'Completed all 30 problems. I got stuck on 7x8 but figured it out!', 'graded', (NOW() - INTERVAL '6 days')::timestamptz, false),
  ('f0000000-0000-0000-0001-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000016'::uuid, 'Finished the quiz. The 9s times table was easy because of the finger trick.', 'graded', (NOW() - INTERVAL '6 days')::timestamptz, false),
  ('f0000000-0000-0000-0001-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000017'::uuid, 'Done! I used arrays to help me with the harder ones.', 'graded', (NOW() - INTERVAL '4 days')::timestamptz, true)
) AS s(sid, student, stext, sstatus, sdate, slate)
WHERE t.slug = 'wolf-whale-demo';

-- Submissions for Math 5A - Fractions Worksheet (past due)
INSERT INTO submissions (id, tenant_id, assignment_id, student_id, submission_text, status, submitted_at, submitted_late)
SELECT s.sid, t.id, 'e0000000-0000-0000-0003-000000000001'::uuid, s.student, s.stext, s.sstatus, s.sdate, s.slate
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0003-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000020'::uuid, 'All 25 problems completed. I found finding the LCD challenging for some.', 'graded', (NOW() - INTERVAL '8 days')::timestamptz, false),
  ('f0000000-0000-0000-0003-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000021'::uuid, 'Finished! I double-checked my work on the subtraction problems.', 'graded', (NOW() - INTERVAL '8 days')::timestamptz, false),
  ('f0000000-0000-0000-0003-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000022'::uuid, 'Completed all problems. The last five were tricky with mixed numbers.', 'graded', (NOW() - INTERVAL '7 days')::timestamptz, false),
  ('f0000000-0000-0000-0003-000000000004'::uuid, 'a0000000-0000-0000-0000-000000000023'::uuid, 'All done. I think I need more practice on simplifying fractions.', 'submitted', (NOW() - INTERVAL '7 days')::timestamptz, false),
  ('f0000000-0000-0000-0003-000000000005'::uuid, 'a0000000-0000-0000-0000-000000000024'::uuid, 'Finished the worksheet. Used the fraction strips to help visualize.', 'graded', (NOW() - INTERVAL '9 days')::timestamptz, false)
) AS s(sid, student, stext, sstatus, sdate, slate)
WHERE t.slug = 'wolf-whale-demo';

-- Submissions for Science 5A - Ecosystem Food Web (past due)
INSERT INTO submissions (id, tenant_id, assignment_id, student_id, submission_text, status, submitted_at, submitted_late)
SELECT s.sid, t.id, 'e0000000-0000-0000-0005-000000000001'::uuid, s.student, s.stext, s.sstatus, s.sdate, s.slate
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0005-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000020'::uuid, 'I chose the ocean ecosystem. Included 12 organisms from plankton to orca whales.', 'graded', (NOW() - INTERVAL '7 days')::timestamptz, false),
  ('f0000000-0000-0000-0005-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000021'::uuid, 'Forest ecosystem with 10 organisms. Showed how a fallen tree feeds the whole web.', 'graded', (NOW() - INTERVAL '7 days')::timestamptz, false),
  ('f0000000-0000-0000-0005-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000022'::uuid, 'Desert ecosystem food web. It was hard to find 10 organisms but I did it!', 'submitted', (NOW() - INTERVAL '5 days')::timestamptz, true)
) AS s(sid, student, stext, sstatus, sdate, slate)
WHERE t.slug = 'wolf-whale-demo';

-- Submissions for Science 3A - Butterfly Life Cycle (past due)
INSERT INTO submissions (id, tenant_id, assignment_id, student_id, submission_text, status, submitted_at, submitted_late)
SELECT s.sid, t.id, 'e0000000-0000-0000-0004-000000000001'::uuid, s.student, s.stext, s.sstatus, s.sdate, s.slate
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0004-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000015'::uuid, 'Made a diorama with all 4 stages. Used real leaves and cotton balls!', 'graded', (NOW() - INTERVAL '5 days')::timestamptz, false),
  ('f0000000-0000-0000-0004-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000016'::uuid, 'Drew a colorful poster with labels for egg, caterpillar, chrysalis, and butterfly.', 'graded', (NOW() - INTERVAL '5 days')::timestamptz, false)
) AS s(sid, student, stext, sstatus, sdate, slate)
WHERE t.slug = 'wolf-whale-demo';

-- Submissions for English K-2 - My Favorite Animal (past due)
INSERT INTO submissions (id, tenant_id, assignment_id, student_id, submission_text, status, submitted_at, submitted_late)
SELECT s.sid, t.id, 'e0000000-0000-0000-0006-000000000001'::uuid, s.student, s.stext, s.sstatus, s.sdate, s.slate
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0006-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000010'::uuid, 'I drew a cat. I like cats because they are soft.', 'graded', (NOW() - INTERVAL '4 days')::timestamptz, false),
  ('f0000000-0000-0000-0006-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000011'::uuid, 'My favorit animl is a dog. Dogs are fun to play with.', 'graded', (NOW() - INTERVAL '4 days')::timestamptz, false),
  ('f0000000-0000-0000-0006-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000012'::uuid, 'I drew a horse. Horses are big and beautiful.', 'graded', (NOW() - INTERVAL '3 days')::timestamptz, false),
  ('f0000000-0000-0000-0006-000000000004'::uuid, 'a0000000-0000-0000-0000-000000000013'::uuid, 'I like dolphins because they swim fast and jump.', 'graded', (NOW() - INTERVAL '4 days')::timestamptz, false),
  ('f0000000-0000-0000-0006-000000000005'::uuid, 'a0000000-0000-0000-0000-000000000014'::uuid, 'My favrit animal is a bunny. Bunnies hop!', 'graded', (NOW() - INTERVAL '3 days')::timestamptz, false)
) AS s(sid, student, stext, sstatus, sdate, slate)
WHERE t.slug = 'wolf-whale-demo';

-- Submissions for Math 4A - Multi-Digit Multiplication (past due)
INSERT INTO submissions (id, tenant_id, assignment_id, student_id, submission_text, status, submitted_at, submitted_late)
SELECT s.sid, t.id, 'e0000000-0000-0000-0002-000000000001'::uuid, s.student, s.stext, s.sstatus, s.sdate, s.slate
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0002-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000018'::uuid, 'Completed all 20 problems with work shown.', 'graded', (NOW() - INTERVAL '4 days')::timestamptz, false),
  ('f0000000-0000-0000-0002-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000019'::uuid, 'All problems done. I checked my answers with a calculator.', 'graded', (NOW() - INTERVAL '4 days')::timestamptz, false)
) AS s(sid, student, stext, sstatus, sdate, slate)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- GRADES for graded submissions
-- ============================================================================

-- Math 3A Multiplication Quiz grades
INSERT INTO grades (tenant_id, submission_id, assignment_id, student_id, course_id, points_earned, percentage, letter_grade, feedback, graded_by)
SELECT t.id, g.gsub, g.gassign, g.gstudent, 'c0000000-0000-0000-0000-000000000001'::uuid, g.gpoints, g.gpct, g.gletter, g.gfeedback, 'a0000000-0000-0000-0000-000000000002'::uuid
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0001-000000000001'::uuid, 'e0000000-0000-0000-0001-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000015'::uuid, 27.00, 90.00, 'A-', 'Excellent work, Noah! You only missed 3 problems. Keep practicing those 7s and 8s.'),
  ('f0000000-0000-0000-0001-000000000002'::uuid, 'e0000000-0000-0000-0001-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000016'::uuid, 28.50, 95.00, 'A', 'Outstanding, Sophia! The finger trick for 9s is a great strategy.'),
  ('f0000000-0000-0000-0001-000000000003'::uuid, 'e0000000-0000-0000-0001-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000017'::uuid, 22.50, 75.00, 'C+', 'Good effort, Jackson. Note: 3 points deducted for late submission. Let us review the 6s and 8s together.')
) AS g(gsub, gassign, gstudent, gpoints, gpct, gletter, gfeedback)
WHERE t.slug = 'wolf-whale-demo';

-- Math 5A Fractions Worksheet grades
INSERT INTO grades (tenant_id, submission_id, assignment_id, student_id, course_id, points_earned, percentage, letter_grade, feedback, graded_by)
SELECT t.id, g.gsub, g.gassign, g.gstudent, 'c0000000-0000-0000-0000-000000000003'::uuid, g.gpoints, g.gpct, g.gletter, g.gfeedback, 'a0000000-0000-0000-0000-000000000002'::uuid
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0003-000000000001'::uuid, 'e0000000-0000-0000-0003-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000020'::uuid, 46.00, 92.00, 'A-', 'Great job, Emma! Your LCD work is solid. Just watch the simplification on #18 and #22.'),
  ('f0000000-0000-0000-0003-000000000002'::uuid, 'e0000000-0000-0000-0003-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000021'::uuid, 43.50, 87.00, 'B+', 'Nice work, James! Good job double-checking. Review the mixed number subtraction problems.'),
  ('f0000000-0000-0000-0003-000000000003'::uuid, 'e0000000-0000-0000-0003-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000022'::uuid, 41.00, 82.00, 'B-', 'Good effort, Ava. The mixed number problems need more practice. See me for extra help.'),
  ('f0000000-0000-0000-0003-000000000005'::uuid, 'e0000000-0000-0000-0003-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000024'::uuid, 48.00, 96.00, 'A', 'Excellent, Isabella! Using fraction strips was a smart strategy. Nearly perfect work!')
) AS g(gsub, gassign, gstudent, gpoints, gpct, gletter, gfeedback)
WHERE t.slug = 'wolf-whale-demo';

-- Science 5A Ecosystem Food Web grades
INSERT INTO grades (tenant_id, submission_id, assignment_id, student_id, course_id, points_earned, percentage, letter_grade, feedback, graded_by)
SELECT t.id, g.gsub, g.gassign, g.gstudent, 'c0000000-0000-0000-0000-000000000005'::uuid, g.gpoints, g.gpct, g.gletter, g.gfeedback, 'a0000000-0000-0000-0000-000000000003'::uuid
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0005-000000000001'::uuid, 'e0000000-0000-0000-0005-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000020'::uuid, 95.00, 95.00, 'A', 'Fantastic ocean food web, Emma! The orca to plankton chain was very well researched. I loved the detail on the decomposers.'),
  ('f0000000-0000-0000-0005-000000000002'::uuid, 'e0000000-0000-0000-0005-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000021'::uuid, 88.00, 88.00, 'B+', 'Great forest food web, James! Try to include more secondary consumers next time. The fallen tree connection was creative.')
) AS g(gsub, gassign, gstudent, gpoints, gpct, gletter, gfeedback)
WHERE t.slug = 'wolf-whale-demo';

-- Science 3A Butterfly Project grades
INSERT INTO grades (tenant_id, submission_id, assignment_id, student_id, course_id, points_earned, percentage, letter_grade, feedback, graded_by)
SELECT t.id, g.gsub, g.gassign, g.gstudent, 'c0000000-0000-0000-0000-000000000004'::uuid, g.gpoints, g.gpct, g.gletter, g.gfeedback, 'a0000000-0000-0000-0000-000000000003'::uuid
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0004-000000000001'::uuid, 'e0000000-0000-0000-0004-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000015'::uuid, 92.00, 92.00, 'A-', 'Wonderful diorama, Noah! The real leaves added a nice touch. Your descriptions of each stage were very accurate.'),
  ('f0000000-0000-0000-0004-000000000002'::uuid, 'e0000000-0000-0000-0004-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000016'::uuid, 88.00, 88.00, 'B+', 'Beautiful poster, Sophia! Your butterfly drawing is amazing. Add a few more details about the chrysalis stage next time.')
) AS g(gsub, gassign, gstudent, gpoints, gpct, gletter, gfeedback)
WHERE t.slug = 'wolf-whale-demo';

-- English K-2 My Favorite Animal grades
INSERT INTO grades (tenant_id, submission_id, assignment_id, student_id, course_id, points_earned, percentage, letter_grade, feedback, graded_by)
SELECT t.id, g.gsub, g.gassign, g.gstudent, 'c0000000-0000-0000-0000-000000000006'::uuid, g.gpoints, g.gpct, g.gletter, g.gfeedback, 'a0000000-0000-0000-0000-000000000004'::uuid
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0006-000000000001'::uuid, 'e0000000-0000-0000-0006-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000010'::uuid, 18.00, 90.00, 'A-', 'Lovely cat drawing, Lily! Great sentence with a capital letter and period. Keep it up!'),
  ('f0000000-0000-0000-0006-000000000002'::uuid, 'e0000000-0000-0000-0006-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000011'::uuid, 16.00, 80.00, 'B-', 'Nice dog drawing, Ethan! Remember to check spelling: "favorite" and "animal". Good effort on your sentence.'),
  ('f0000000-0000-0000-0006-000000000003'::uuid, 'e0000000-0000-0000-0006-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000012'::uuid, 19.00, 95.00, 'A', 'Beautiful horse drawing, Chloe! Wonderful adjectives: "big" and "beautiful". You are a great writer!'),
  ('f0000000-0000-0000-0006-000000000004'::uuid, 'e0000000-0000-0000-0006-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000013'::uuid, 17.00, 85.00, 'B', 'Great dolphin picture, Aiden! I love that you used two describing words. Nice sentence!'),
  ('f0000000-0000-0000-0006-000000000005'::uuid, 'e0000000-0000-0000-0006-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000014'::uuid, 18.00, 90.00, 'A-', 'Adorable bunny drawing, Mia! I like how you described what bunnies do. Work on spelling "favorite".')
) AS g(gsub, gassign, gstudent, gpoints, gpct, gletter, gfeedback)
WHERE t.slug = 'wolf-whale-demo';

-- Math 4A Multi-Digit Multiplication grades
INSERT INTO grades (tenant_id, submission_id, assignment_id, student_id, course_id, points_earned, percentage, letter_grade, feedback, graded_by)
SELECT t.id, g.gsub, g.gassign, g.gstudent, 'c0000000-0000-0000-0000-000000000002'::uuid, g.gpoints, g.gpct, g.gletter, g.gfeedback, 'a0000000-0000-0000-0000-000000000002'::uuid
FROM tenants t, (VALUES
  ('f0000000-0000-0000-0002-000000000001'::uuid, 'e0000000-0000-0000-0002-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000018'::uuid, 36.00, 90.00, 'A-', 'Great work, Olivia! Your partial products are very neat. Small carrying error on #14.'),
  ('f0000000-0000-0000-0002-000000000002'::uuid, 'e0000000-0000-0000-0002-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000019'::uuid, 34.00, 85.00, 'B', 'Good job, Lucas! Using a calculator to check is smart. Review the carrying step for problems with three partial products.')
) AS g(gsub, gassign, gstudent, gpoints, gpct, gletter, gfeedback)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 10. ATTENDANCE RECORDS (current week Mon-Fri)
-- ============================================================================

-- Helper: We use date arithmetic relative to today for the current week
-- Monday of current week
INSERT INTO attendance_records (tenant_id, course_id, student_id, attendance_date, status, notes, marked_by)
SELECT t.id, a.acourse, a.astudent, a.adate, a.astatus, a.anotes, a.amarker
FROM tenants t, (VALUES
  -- Monday Math 3A
  ('c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000015'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000016'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000017'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'tardy', 'Arrived 10 minutes late - bus delay', 'a0000000-0000-0000-0000-000000000002'::uuid),

  -- Monday Math 5A
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000020'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000021'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000022'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'absent', 'Parent called - dentist appointment', 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000023'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000024'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),

  -- Monday Science 3A
  ('c0000000-0000-0000-0000-000000000004'::uuid, 'a0000000-0000-0000-0000-000000000015'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000003'::uuid),
  ('c0000000-0000-0000-0000-000000000004'::uuid, 'a0000000-0000-0000-0000-000000000016'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000003'::uuid),
  ('c0000000-0000-0000-0000-000000000004'::uuid, 'a0000000-0000-0000-0000-000000000017'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000003'::uuid),

  -- Monday English K-2
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000010'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000004'::uuid),
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000011'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000004'::uuid),
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000012'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000004'::uuid),
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000013'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'excused', 'Family emergency', 'a0000000-0000-0000-0000-000000000004'::uuid),
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000014'::uuid, (date_trunc('week', CURRENT_DATE))::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000004'::uuid),

  -- Tuesday Math 3A
  ('c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000015'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000016'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000001'::uuid, 'a0000000-0000-0000-0000-000000000017'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),

  -- Tuesday Math 5A
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000020'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000021'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000022'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000023'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000003'::uuid, 'a0000000-0000-0000-0000-000000000024'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'tardy', 'Arrived 5 minutes late', 'a0000000-0000-0000-0000-000000000002'::uuid),

  -- Tuesday English K-2
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000010'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000004'::uuid),
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000011'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'absent', 'No call from parent', 'a0000000-0000-0000-0000-000000000004'::uuid),
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000012'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000004'::uuid),
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000013'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000004'::uuid),
  ('c0000000-0000-0000-0000-000000000006'::uuid, 'a0000000-0000-0000-0000-000000000014'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '1 day')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000004'::uuid),

  -- Wednesday Science 5A
  ('c0000000-0000-0000-0000-000000000005'::uuid, 'a0000000-0000-0000-0000-000000000020'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '2 days')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000003'::uuid),
  ('c0000000-0000-0000-0000-000000000005'::uuid, 'a0000000-0000-0000-0000-000000000021'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '2 days')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000003'::uuid),
  ('c0000000-0000-0000-0000-000000000005'::uuid, 'a0000000-0000-0000-0000-000000000022'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '2 days')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000003'::uuid),
  ('c0000000-0000-0000-0000-000000000005'::uuid, 'a0000000-0000-0000-0000-000000000023'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '2 days')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000003'::uuid),
  ('c0000000-0000-0000-0000-000000000005'::uuid, 'a0000000-0000-0000-0000-000000000024'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '2 days')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000003'::uuid),

  -- Wednesday Math 4A
  ('c0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000018'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '2 days')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid),
  ('c0000000-0000-0000-0000-000000000002'::uuid, 'a0000000-0000-0000-0000-000000000019'::uuid, (date_trunc('week', CURRENT_DATE) + INTERVAL '2 days')::date, 'present', NULL, 'a0000000-0000-0000-0000-000000000002'::uuid)
) AS a(acourse, astudent, adate, astatus, anotes, amarker)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 11. ANNOUNCEMENTS
-- ============================================================================

-- School-wide announcements
INSERT INTO announcements (tenant_id, course_id, title, content, created_by, published_at, status)
SELECT t.id, NULL, a.atitle, a.acontent, a.aauthor, a.apub, 'published'
FROM tenants t, (VALUES
  ('Welcome to Spring Semester 2026!',
   'Dear Wolf Whale families, welcome back to an exciting spring semester! We have many wonderful activities planned, including our annual Science Fair on March 20th, a school-wide Reading Challenge, and Field Day in May. Please check the school calendar for all important dates. We look forward to a great semester of learning together!',
   'a0000000-0000-0000-0000-000000000001'::uuid, (NOW() - INTERVAL '30 days')::timestamptz),
  ('Science Fair 2026 - Registration Open',
   'Registration for the Wolf Whale Demo School Annual Science Fair is now open! Students in grades 3-5 are encouraged to participate. Projects must relate to one of the following categories: Life Science, Physical Science, Earth Science, or Engineering. Registration deadline is February 28th. See Mr. Chen for project ideas and guidelines.',
   'a0000000-0000-0000-0000-000000000001'::uuid, (NOW() - INTERVAL '7 days')::timestamptz),
  ('Early Dismissal - February 14th',
   'Please be advised that school will dismiss at 12:30 PM on Friday, February 14th for a teacher professional development day. After-school care will still be available until 5:00 PM. Please make arrangements for early pickup if needed.',
   'a0000000-0000-0000-0000-000000000001'::uuid, (NOW() - INTERVAL '2 days')::timestamptz)
) AS a(atitle, acontent, aauthor, apub)
WHERE t.slug = 'wolf-whale-demo';

-- Course-specific announcements
INSERT INTO announcements (tenant_id, course_id, title, content, created_by, published_at, status)
SELECT t.id, a.acourse, a.atitle, a.acontent, a.aauthor, a.apub, 'published'
FROM tenants t, (VALUES
  ('c0000000-0000-0000-0000-000000000003'::uuid,
   'Math 5A: Fractions Test Next Week',
   'Hi everyone! Just a reminder that our Unit 1 Fractions Test will be next Wednesday. Please review Chapters 1-3 and complete the practice problems on pages 45-47 in your workbook. We will have a review session on Tuesday. Bring your questions!',
   'a0000000-0000-0000-0000-000000000002'::uuid, (NOW() - INTERVAL '1 day')::timestamptz),
  ('c0000000-0000-0000-0000-000000000004'::uuid,
   'Science 3A: Caterpillar Observation Kits',
   'Exciting news! Our Painted Lady caterpillar observation kits have arrived! Starting Monday, we will be documenting the metamorphosis process in our science journals. Make sure to bring your journals and colored pencils every day this week.',
   'a0000000-0000-0000-0000-000000000003'::uuid, (NOW() - INTERVAL '3 days')::timestamptz),
  ('c0000000-0000-0000-0000-000000000006'::uuid,
   'English K-2: Reading Log Reminder',
   'Hi families! Please remember to fill out your child''s nightly reading log. Students should read (or be read to) for at least 15 minutes each night. We will be celebrating our reading milestones every Friday with special stickers and certificates!',
   'a0000000-0000-0000-0000-000000000004'::uuid, (NOW() - INTERVAL '5 days')::timestamptz),
  ('c0000000-0000-0000-0000-000000000005'::uuid,
   'Science 5A: Lab Safety Reminder',
   'As we begin our Properties of Matter unit, please remember to follow all lab safety rules. Safety goggles must be worn during all experiments. Long hair must be tied back. Report any spills immediately. Safety is our top priority!',
   'a0000000-0000-0000-0000-000000000003'::uuid, (NOW() - INTERVAL '1 day')::timestamptz)
) AS a(acourse, atitle, acontent, aauthor, apub)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 12. NOTIFICATIONS
-- ============================================================================

INSERT INTO notifications (tenant_id, user_id, type, title, message, action_url, course_id, assignment_id, read, created_at)
SELECT t.id, n.nuser, n.ntype, n.ntitle, n.nmessage, n.nurl, n.ncourse, n.nassignment, n.nread, n.ncreated
FROM tenants t, (VALUES
  -- Student notifications
  ('a0000000-0000-0000-0000-000000000020'::uuid, 'grade_posted', 'Grade Posted: Fractions Worksheet',
   'Your Chapter 1: Fractions Worksheet has been graded. You earned 46/50 (92%).',
   '/courses/c0000000-0000-0000-0000-000000000003/grades',
   'c0000000-0000-0000-0000-000000000003'::uuid, 'e0000000-0000-0000-0003-000000000001'::uuid,
   true, (NOW() - INTERVAL '5 days')::timestamptz),
  ('a0000000-0000-0000-0000-000000000020'::uuid, 'assignment_due', 'Assignment Due Soon: Decimals Quiz',
   'Reminder: Decimals and Percentages Conversion Quiz is due in 3 days.',
   '/courses/c0000000-0000-0000-0000-000000000003/assignments/e0000000-0000-0000-0003-000000000002',
   'c0000000-0000-0000-0000-000000000003'::uuid, 'e0000000-0000-0000-0003-000000000002'::uuid,
   false, (NOW() - INTERVAL '1 hour')::timestamptz),
  ('a0000000-0000-0000-0000-000000000020'::uuid, 'new_announcement', 'New Announcement in Science 5A',
   'Mr. Chen posted: Lab Safety Reminder',
   '/courses/c0000000-0000-0000-0000-000000000005/announcements',
   'c0000000-0000-0000-0000-000000000005'::uuid, NULL,
   false, (NOW() - INTERVAL '1 day')::timestamptz),

  ('a0000000-0000-0000-0000-000000000021'::uuid, 'grade_posted', 'Grade Posted: Fractions Worksheet',
   'Your Chapter 1: Fractions Worksheet has been graded. You earned 43.5/50 (87%).',
   '/courses/c0000000-0000-0000-0000-000000000003/grades',
   'c0000000-0000-0000-0000-000000000003'::uuid, 'e0000000-0000-0000-0003-000000000001'::uuid,
   true, (NOW() - INTERVAL '5 days')::timestamptz),
  ('a0000000-0000-0000-0000-000000000021'::uuid, 'assignment_due', 'Assignment Due Soon: Decimals Quiz',
   'Reminder: Decimals and Percentages Conversion Quiz is due in 3 days.',
   '/courses/c0000000-0000-0000-0000-000000000003/assignments/e0000000-0000-0000-0003-000000000002',
   'c0000000-0000-0000-0000-000000000003'::uuid, 'e0000000-0000-0000-0003-000000000002'::uuid,
   false, (NOW() - INTERVAL '1 hour')::timestamptz),

  ('a0000000-0000-0000-0000-000000000015'::uuid, 'grade_posted', 'Grade Posted: Multiplication Quiz',
   'Your Multiplication Tables Quiz has been graded. You earned 27/30 (90%).',
   '/courses/c0000000-0000-0000-0000-000000000001/grades',
   'c0000000-0000-0000-0000-000000000001'::uuid, 'e0000000-0000-0000-0001-000000000001'::uuid,
   false, (NOW() - INTERVAL '3 days')::timestamptz),
  ('a0000000-0000-0000-0000-000000000015'::uuid, 'grade_posted', 'Grade Posted: Butterfly Life Cycle',
   'Your Butterfly Life Cycle Project has been graded. You earned 92/100 (92%).',
   '/courses/c0000000-0000-0000-0000-000000000004/grades',
   'c0000000-0000-0000-0000-000000000004'::uuid, 'e0000000-0000-0000-0004-000000000001'::uuid,
   true, (NOW() - INTERVAL '2 days')::timestamptz),

  -- Parent notifications
  ('a0000000-0000-0000-0000-000000000033'::uuid, 'grade_posted', 'Grade Posted for Emma Wilson',
   'Emma received 92% on Chapter 1: Fractions Worksheet in Math 5A.',
   '/courses/c0000000-0000-0000-0000-000000000003/grades',
   'c0000000-0000-0000-0000-000000000003'::uuid, 'e0000000-0000-0000-0003-000000000001'::uuid,
   true, (NOW() - INTERVAL '5 days')::timestamptz),
  ('a0000000-0000-0000-0000-000000000033'::uuid, 'new_announcement', 'School-Wide Announcement',
   'Dr. Thompson posted: Early Dismissal - February 14th',
   '/announcements',
   NULL, NULL,
   false, (NOW() - INTERVAL '2 days')::timestamptz),

  ('a0000000-0000-0000-0000-000000000032'::uuid, 'grade_posted', 'Grade Posted for Noah Kim',
   'Noah received 90% on Multiplication Tables Quiz in Math 3A.',
   '/courses/c0000000-0000-0000-0000-000000000001/grades',
   'c0000000-0000-0000-0000-000000000001'::uuid, 'e0000000-0000-0000-0001-000000000001'::uuid,
   false, (NOW() - INTERVAL '3 days')::timestamptz),

  -- Teacher notifications
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'system_alert', 'New Submission: Division Word Problems',
   '3 students have not yet submitted Division Word Problems Worksheet (due in 5 days).',
   '/courses/c0000000-0000-0000-0000-000000000001/assignments/e0000000-0000-0000-0001-000000000002',
   'c0000000-0000-0000-0000-000000000001'::uuid, 'e0000000-0000-0000-0001-000000000002'::uuid,
   false, (NOW() - INTERVAL '2 hours')::timestamptz),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'system_alert', 'Ungraded Submission',
   'Ava Davis submitted Ecosystem Food Web Diagram 5 days ago and it has not been graded yet.',
   '/courses/c0000000-0000-0000-0000-000000000005/submissions',
   'c0000000-0000-0000-0000-000000000005'::uuid, 'e0000000-0000-0000-0005-000000000001'::uuid,
   false, (NOW() - INTERVAL '6 hours')::timestamptz),

  -- Admin notification
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'system_alert', 'Weekly Usage Report',
   'Wolf Whale Demo School: 15 active students, 3 active teachers, 6 active courses this week.',
   '/admin/reports',
   NULL, NULL,
   false, (NOW() - INTERVAL '12 hours')::timestamptz)
) AS n(nuser, ntype, ntitle, nmessage, nurl, ncourse, nassignment, nread, ncreated)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 13. AUDIT LOGS (sample entries)
-- ============================================================================

INSERT INTO audit_logs (tenant_id, user_id, action, resource_type, resource_id, details)
SELECT t.id, a.auser, a.aaction, a.arestype, a.aresid, a.adetails
FROM tenants t, (VALUES
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'tenant.updated', 'tenant', NULL, '{"field": "description", "action": "Updated school description"}'::jsonb),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'course.created', 'course', 'c0000000-0000-0000-0000-000000000001'::uuid, '{"name": "Math 3A", "grade_level": "3"}'::jsonb),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'course.created', 'course', 'c0000000-0000-0000-0000-000000000003'::uuid, '{"name": "Math 5A", "grade_level": "5"}'::jsonb),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'course.created', 'course', 'c0000000-0000-0000-0000-000000000004'::uuid, '{"name": "Science 3A", "grade_level": "3"}'::jsonb),
  ('a0000000-0000-0000-0000-000000000004'::uuid, 'course.created', 'course', 'c0000000-0000-0000-0000-000000000006'::uuid, '{"name": "English K-2", "grade_level": "K-2"}'::jsonb),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'assignment.created', 'assignment', 'e0000000-0000-0000-0003-000000000001'::uuid, '{"title": "Chapter 1: Fractions Worksheet", "max_points": 50}'::jsonb),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'submission.graded', 'submission', 'f0000000-0000-0000-0003-000000000001'::uuid, '{"student": "Emma Wilson", "grade": "92%", "letter": "A-"}'::jsonb),
  ('a0000000-0000-0000-0000-000000000003'::uuid, 'submission.graded', 'submission', 'f0000000-0000-0000-0005-000000000001'::uuid, '{"student": "Emma Wilson", "grade": "95%", "letter": "A"}'::jsonb),
  ('a0000000-0000-0000-0000-000000000001'::uuid, 'announcement.created', 'announcement', NULL, '{"title": "Welcome to Spring Semester 2026!", "scope": "school-wide"}'::jsonb),
  ('a0000000-0000-0000-0000-000000000002'::uuid, 'attendance.recorded', 'attendance', NULL, '{"course": "Math 5A", "date": "Monday", "present": 4, "absent": 1}'::jsonb)
) AS a(auser, aaction, arestype, aresid, adetails)
WHERE t.slug = 'wolf-whale-demo';

-- ============================================================================
-- 14. SUBSCRIPTION USAGE (sample billing record)
-- ============================================================================

INSERT INTO subscription_usage (tenant_id, billing_period_start, billing_period_end, active_students, active_teachers, total_users, storage_used_gb, api_calls)
SELECT t.id, '2026-02-01'::date, '2026-02-28'::date, 15, 3, 24, 2.45, 12580
FROM tenants t
WHERE t.slug = 'wolf-whale-demo';

INSERT INTO invoices (tenant_id, amount, amount_paid, status, due_date, paid_at)
SELECT t.id, 149.00, 149.00, 'paid', '2026-02-01'::date, '2026-01-30 10:00:00'::timestamptz
FROM tenants t
WHERE t.slug = 'wolf-whale-demo';

COMMIT;

-- ============================================================================
-- END OF SEED DATA
-- Wolf Whale Demo School - K-5 Elementary
-- 1 Admin, 3 Teachers, 15 Students, 5 Parents
-- 6 Courses, 27 Lessons, 17 Assignments
-- Submissions, Grades, Attendance, Announcements, Notifications
-- ============================================================================
