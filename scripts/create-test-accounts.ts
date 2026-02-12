/**
 * WolfWhale Learning Management System - Create Test Accounts
 *
 * Creates a demo tenant, 5 test user accounts, profiles, tenant memberships,
 * a parent-student link, a sample course, and a course enrollment.
 *
 * Idempotent: safe to run multiple times. Uses upserts and existence checks.
 *
 * Prerequisites:
 *   - Set NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *   - Database migrations must be applied first
 *
 * Usage:
 *   npx tsx scripts/create-test-accounts.ts
 *
 * Accounts created:
 *   student@wolfwhale.ca     / demo123  (student)
 *   teacher@wolfwhale.ca     / demo123  (teacher)
 *   parent@wolfwhale.ca      / demo123  (parent)
 *   admin@wolfwhale.ca       / demo123  (admin)
 *   superadmin@wolfwhale.ca  / demo123  (super_admin / platform owner only)
 */

import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import * as fs from 'fs'

// ---------------------------------------------------------------------------
// Load environment variables from .env.local
// ---------------------------------------------------------------------------

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile(path.resolve(__dirname, '../.env.local'))

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.error(
    'ERROR: NEXT_PUBLIC_SUPABASE_URL is required.\n' +
      'Set it in .env.local or pass it as an environment variable.'
  )
  process.exit(1)
}

if (!SUPABASE_SERVICE_KEY) {
  console.error(
    'ERROR: SUPABASE_SERVICE_ROLE_KEY is required.\n' +
      'Set it in .env.local or pass it as an environment variable.\n' +
      'You can find it in your Supabase project dashboard under Settings > API > service_role key.'
  )
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// ---------------------------------------------------------------------------
// Test account definitions
// ---------------------------------------------------------------------------

interface TestAccount {
  email: string
  password: string
  firstName: string
  lastName: string
  role: 'student' | 'teacher' | 'parent' | 'admin' | 'super_admin'
}

const TEST_ACCOUNTS: TestAccount[] = [
  {
    email: 'student@wolfwhale.ca',
    password: 'demo123',
    firstName: 'Alex',
    lastName: 'Student',
    role: 'student',
  },
  {
    email: 'teacher@wolfwhale.ca',
    password: 'demo123',
    firstName: 'Jordan',
    lastName: 'Teacher',
    role: 'teacher',
  },
  {
    email: 'parent@wolfwhale.ca',
    password: 'demo123',
    firstName: 'Morgan',
    lastName: 'Parent',
    role: 'parent',
  },
  {
    email: 'admin@wolfwhale.ca',
    password: 'demo123',
    firstName: 'Sam',
    lastName: 'Admin',
    role: 'admin',
  },
  {
    email: 'superadmin@wolfwhale.ca',
    password: 'demo123',
    firstName: 'Taylor',
    lastName: 'SuperAdmin',
    role: 'super_admin',
  },
]

// ---------------------------------------------------------------------------
// Helper: find or create an auth user
// ---------------------------------------------------------------------------

async function findOrCreateUser(
  account: TestAccount
): Promise<string> {
  // Check if user already exists by listing all users and searching by email
  const { data: listData, error: listError } =
    await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })

  if (listError) {
    throw new Error(`Failed to list users: ${listError.message}`)
  }

  const existing = listData?.users?.find((u) => u.email === account.email)
  if (existing) {
    console.log(`  [EXISTS]  ${account.email} => ${existing.id}`)

    // Update password and metadata to keep idempotent
    const { error: updateError } = await supabase.auth.admin.updateUserById(
      existing.id,
      {
        password: account.password,
        email_confirm: true,
        user_metadata: {
          first_name: account.firstName,
          last_name: account.lastName,
          full_name: `${account.firstName} ${account.lastName}`,
        },
      }
    )
    if (updateError) {
      console.warn(`  [WARN]    Could not update ${account.email}: ${updateError.message}`)
    }

    return existing.id
  }

  // Create new user
  const { data, error } = await supabase.auth.admin.createUser({
    email: account.email,
    password: account.password,
    email_confirm: true,
    user_metadata: {
      first_name: account.firstName,
      last_name: account.lastName,
      full_name: `${account.firstName} ${account.lastName}`,
    },
  })

  if (error) {
    throw new Error(`Failed to create user ${account.email}: ${error.message}`)
  }

  if (!data.user) {
    throw new Error(`No user object returned for ${account.email}`)
  }

  console.log(`  [CREATED] ${account.email} => ${data.user.id}`)
  return data.user.id
}

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('====================================================================')
  console.log('WolfWhale Learning Management System - Create Test Accounts')
  console.log('====================================================================')
  console.log(`Supabase URL: ${SUPABASE_URL}`)
  console.log('')

  // =========================================================================
  // Step 1: Create or update the demo tenant
  // =========================================================================
  console.log('Step 1: Creating demo tenant...')
  console.log('--------------------------------------------------------------------')

  const { data: tenantData, error: tenantError } = await supabase
    .from('tenants')
    .upsert(
      {
        slug: 'demo',
        name: 'WolfWhale Learning Management System',
        subscription_plan: 'enterprise',
        max_users: 100,
        status: 'active',
        settings: {
          max_storage_gb: 10,
          grade_scale: 'traditional',
          gamification_enabled: true,
          domain: 'wolfwhale.ca',
        },
      },
      { onConflict: 'slug' }
    )
    .select('id')
    .single()

  if (tenantError) {
    console.error(`  [ERROR] Failed to create tenant: ${tenantError.message}`)
    process.exit(1)
  }

  const tenantId = tenantData.id
  console.log(`  [OK] Demo tenant: ${tenantId} (WolfWhale Learning Management System)`)
  console.log('')

  // =========================================================================
  // Step 2: Create auth users via Supabase Admin API
  // =========================================================================
  console.log('Step 2: Creating auth users...')
  console.log('--------------------------------------------------------------------')

  const userIds: Record<string, string> = {}

  for (const account of TEST_ACCOUNTS) {
    try {
      const userId = await findOrCreateUser(account)
      userIds[account.role] = userId
    } catch (err) {
      console.error(`  [ERROR] ${account.email}: ${err}`)
      process.exit(1)
    }
    // Small delay to avoid rate limits
    await new Promise((r) => setTimeout(r, 250))
  }

  console.log('')

  // =========================================================================
  // Step 3: Ensure profiles exist for each user
  // =========================================================================
  console.log('Step 3: Upserting profiles...')
  console.log('--------------------------------------------------------------------')

  for (const account of TEST_ACCOUNTS) {
    const userId = userIds[account.role]
    const profilePayload: Record<string, unknown> = {
      id: userId,
      first_name: account.firstName,
      last_name: account.lastName,
    }
    // Give the student a grade_level
    if (account.role === 'student') {
      profilePayload.grade_level = '8'
    }

    const { error: profileError } = await supabase
      .from('profiles')
      .upsert(profilePayload, { onConflict: 'id' })

    if (profileError) {
      // The handle_new_user trigger may have already created a profile;
      // try an update instead
      console.warn(
        `  [WARN] Upsert failed for ${account.email} profile: ${profileError.message}. Trying update...`
      )
      const { error: updateError } = await supabase
        .from('profiles')
        .update({
          first_name: account.firstName,
          last_name: account.lastName,
          ...(account.role === 'student' ? { grade_level: '8' } : {}),
        })
        .eq('id', userId)

      if (updateError) {
        console.error(
          `  [ERROR] Could not update profile for ${account.email}: ${updateError.message}`
        )
      } else {
        console.log(`  [UPDATED] Profile for ${account.email}`)
      }
    } else {
      console.log(`  [OK]      Profile for ${account.email}`)
    }
  }

  console.log('')

  // =========================================================================
  // Step 4: Create tenant memberships
  // =========================================================================
  console.log('Step 4: Upserting tenant memberships...')
  console.log('--------------------------------------------------------------------')

  for (const account of TEST_ACCOUNTS) {
    const userId = userIds[account.role]

    const { error: memberError } = await supabase
      .from('tenant_memberships')
      .upsert(
        {
          tenant_id: tenantId,
          user_id: userId,
          role: account.role,
          status: 'active',
        },
        { onConflict: 'tenant_id,user_id' }
      )

    if (memberError) {
      console.error(
        `  [ERROR] Membership for ${account.email}: ${memberError.message}`
      )
    } else {
      console.log(`  [OK]    ${account.role.padEnd(12)} ${account.email}`)
    }
  }

  console.log('')

  // =========================================================================
  // Step 5: Link parent to student
  // =========================================================================
  console.log('Step 5: Linking parent to student...')
  console.log('--------------------------------------------------------------------')

  const { error: parentLinkError } = await supabase
    .from('student_parents')
    .upsert(
      {
        tenant_id: tenantId,
        student_id: userIds.student,
        parent_id: userIds.parent,
        relationship: 'guardian',
        is_primary_contact: true,
        status: 'active',
      },
      { onConflict: 'tenant_id,student_id,parent_id' }
    )

  if (parentLinkError) {
    console.error(`  [ERROR] Parent-student link: ${parentLinkError.message}`)
  } else {
    console.log(
      `  [OK] parent@wolfwhale.ca linked to student@wolfwhale.ca as guardian`
    )
  }

  console.log('')

  // =========================================================================
  // Step 6: Create a sample course
  // =========================================================================
  console.log('Step 6: Creating sample course...')
  console.log('--------------------------------------------------------------------')

  // Check if the course already exists by name + tenant
  const { data: existingCourse } = await supabase
    .from('courses')
    .select('id')
    .eq('tenant_id', tenantId)
    .eq('name', 'Introduction to Science')
    .maybeSingle()

  let courseId: string

  if (existingCourse?.id) {
    courseId = existingCourse.id
    console.log(`  [EXISTS] Course "Introduction to Science" => ${courseId}`)

    // Update the course to ensure correct state
    await supabase
      .from('courses')
      .update({
        created_by: userIds.teacher,
        subject: 'Science',
        grade_level: '8',
        status: 'active',
        description:
          'An introductory science course covering the fundamentals of scientific inquiry, the scientific method, and basic concepts in biology, chemistry, and physics.',
      })
      .eq('id', courseId)
  } else {
    const { data: newCourse, error: courseError } = await supabase
      .from('courses')
      .insert({
        tenant_id: tenantId,
        name: 'Introduction to Science',
        description:
          'An introductory science course covering the fundamentals of scientific inquiry, the scientific method, and basic concepts in biology, chemistry, and physics.',
        subject: 'Science',
        grade_level: '8',
        created_by: userIds.teacher,
        status: 'active',
      })
      .select('id')
      .single()

    if (courseError) {
      console.error(`  [ERROR] Create course: ${courseError.message}`)
      process.exit(1)
    }

    courseId = newCourse.id
    console.log(
      `  [CREATED] Course "Introduction to Science" => ${courseId}`
    )
  }

  console.log('')

  // =========================================================================
  // Step 7: Enroll student in the sample course
  // =========================================================================
  console.log('Step 7: Enrolling student in sample course...')
  console.log('--------------------------------------------------------------------')

  const { error: enrollError } = await supabase
    .from('course_enrollments')
    .upsert(
      {
        tenant_id: tenantId,
        course_id: courseId,
        student_id: userIds.student,
        teacher_id: userIds.teacher,
        status: 'active',
      },
      { onConflict: 'course_id,student_id' }
    )

  if (enrollError) {
    console.error(`  [ERROR] Enrollment: ${enrollError.message}`)
  } else {
    console.log(
      `  [OK] student@wolfwhale.ca enrolled in "Introduction to Science"`
    )
  }

  console.log('')

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('====================================================================')
  console.log('TEST ACCOUNTS READY')
  console.log('====================================================================')
  console.log('')
  console.log('  Tenant:  WolfWhale Learning Management System (slug: demo)')
  console.log(`  ID:      ${tenantId}`)
  console.log('')
  console.log('  Email                       Password                   Role')
  console.log('  -------------------------   -------------------------  -----------')
  for (const account of TEST_ACCOUNTS) {
    const email = account.email.padEnd(27)
    const pass = account.password.padEnd(25)
    const role = account.role
    console.log(`  ${email}   ${pass}  ${role}`)
  }
  console.log('')
  console.log(`  Course: "Introduction to Science" (${courseId})`)
  console.log(`  Student enrolled: student@wolfwhale.ca`)
  console.log(`  Parent linked:    parent@wolfwhale.ca -> student@wolfwhale.ca`)
  console.log('')
  console.log('====================================================================')
  console.log('Done! You can now sign in at http://localhost:3000')
  console.log('====================================================================')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
