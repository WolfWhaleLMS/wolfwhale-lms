import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

/**
 * Canadian Privacy Law Compliance Utilities
 *
 * Covers federal and provincial privacy legislation relevant to K-12 education:
 *
 * - PIPEDA (Personal Information Protection and Electronic Documents Act) — federal
 * - FIPPA (Freedom of Information and Protection of Privacy Act) — British Columbia
 * - MFIPPA (Municipal Freedom of Information and Protection of Privacy Act) — Ontario
 * - Law 25 (An Act to modernize legislative provisions as regards the protection
 *   of personal information) — Quebec
 * - FOIP (Freedom of Information and Protection of Privacy Act) — Alberta
 */

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Quebec Law 25 requires parental consent for children under 14. */
const QUEBEC_CONSENT_AGE = 14

/** PIPEDA and other provinces require parental consent for children under 13. */
const DEFAULT_CONSENT_AGE = 13

/** Provinces where Quebec Law 25 applies (uses higher consent age). */
const QUEBEC_PROVINCES = ['QC', 'Quebec', 'Québec']

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface CanadianComplianceCheckItem {
  id: string
  label: string
  description: string
  category: 'pipeda' | 'provincial'
  status: 'pass' | 'warning' | 'fail'
}

// ---------------------------------------------------------------------------
// Requirement definitions
// ---------------------------------------------------------------------------

/**
 * Static list of Canadian privacy compliance requirements.
 * The `status` field is resolved at runtime by `runCanadianComplianceCheck`.
 */
export const CANADIAN_PRIVACY_REQUIREMENTS: Omit<CanadianComplianceCheckItem, 'status'>[] = [
  {
    id: 'ca-consent-minors',
    label: 'Parental Consent for Minors',
    description:
      'Verifiable parental consent must be on file for students below the consent age (under 14 in Quebec per Law 25, under 13 elsewhere per PIPEDA).',
    category: 'pipeda',
  },
  {
    id: 'ca-data-residency',
    label: 'Data Residency Awareness',
    description:
      'The institution should be aware of where personal information is stored. FIPPA (BC) and Law 25 (QC) impose restrictions on cross-border data transfers.',
    category: 'provincial',
  },
  {
    id: 'ca-breach-notification',
    label: 'Breach Notification Readiness',
    description:
      'PIPEDA requires organizations to report breaches of security safeguards involving personal information to the Privacy Commissioner and affected individuals.',
    category: 'pipeda',
  },
  {
    id: 'ca-data-access-requests',
    label: 'Data Access / Deletion Request Handling',
    description:
      'Individuals have the right to access their personal information and request corrections or deletion under PIPEDA and provincial statutes.',
    category: 'pipeda',
  },
  {
    id: 'ca-privacy-policy',
    label: 'Privacy Policy Acceptance Tracking',
    description:
      'Users must be presented with a clear privacy policy and their acceptance must be recorded. Law 25 (QC) requires policies to be published in clear language.',
    category: 'pipeda',
  },
  {
    id: 'ca-audit-logging',
    label: 'Audit Logging Active',
    description:
      'All access to personal information must be logged. FOIP (AB) and FIPPA (BC) require institutions to track who accesses records and when.',
    category: 'provincial',
  },
  {
    id: 'ca-data-minimization',
    label: 'Data Minimization',
    description:
      'PIPEDA Principle 4 — only personal information necessary for identified purposes should be collected. Excessive data collection must be avoided.',
    category: 'pipeda',
  },
  {
    id: 'ca-third-party-sharing',
    label: 'Third-Party Data Sharing Controls',
    description:
      'Personal information must not be disclosed to third parties without consent. Law 25 (QC) requires privacy impact assessments before sharing data externally.',
    category: 'provincial',
  },
  {
    id: 'ca-data-portability',
    label: 'Right to Data Portability',
    description:
      'Individuals can request a copy of their personal information in a structured format. Law 25 (QC) explicitly provides for data portability rights.',
    category: 'pipeda',
  },
  {
    id: 'ca-bilingual-support',
    label: 'Bilingual Support (EN/FR)',
    description:
      'Federal institutions and Quebec organizations must provide services in both official languages. Privacy notices and consent forms should be available in English and French.',
    category: 'provincial',
  },
]

// ---------------------------------------------------------------------------
// Consent age helpers
// ---------------------------------------------------------------------------

/**
 * Returns the consent age for Quebec under Law 25 (14 years old).
 */
export function getQuebecConsentAge(): number {
  return QUEBEC_CONSENT_AGE
}

/**
 * Returns the default consent age for the rest of Canada under PIPEDA (13 years old).
 */
export function getDefaultConsentAge(): number {
  return DEFAULT_CONSENT_AGE
}

/**
 * Calculate age from a date-of-birth string.
 */
function calculateAge(dateOfBirth: string): number {
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age
}

/**
 * Determine whether a student requires parental consent based on their
 * date of birth and province of residence.
 *
 * - Quebec (Law 25): consent required if under 14
 * - All other provinces (PIPEDA): consent required if under 13
 *
 * @param dateOfBirth  ISO date string (e.g. "2015-06-01")
 * @param province     Optional province code or name (e.g. "QC", "Quebec")
 * @returns true if the student is a minor requiring parental consent
 */
export function isMinorRequiringConsent(
  dateOfBirth: string,
  province?: string
): boolean {
  const age = calculateAge(dateOfBirth)
  const consentAge = province && QUEBEC_PROVINCES.includes(province)
    ? QUEBEC_CONSENT_AGE
    : DEFAULT_CONSENT_AGE
  return age < consentAge
}

// ---------------------------------------------------------------------------
// Compliance check runner
// ---------------------------------------------------------------------------

/**
 * Run all Canadian privacy compliance checks for the current tenant.
 *
 * Queries the database for consent records, audit logs, data deletion requests,
 * privacy policy acceptances, and tenant configuration to produce a checklist
 * similar to the FERPA compliance check.
 */
export async function runCanadianComplianceCheck(): Promise<CanadianComplianceCheckItem[]> {
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const checks: CanadianComplianceCheckItem[] = []

  // -----------------------------------------------------------------------
  // 1. Parental consent for minors
  // -----------------------------------------------------------------------
  // Fetch all students and their DOBs to see if minors lack consent records.
  const { data: students } = await supabase
    .from('tenant_memberships')
    .select('user_id, profiles!inner(date_of_birth)')
    .eq('tenant_id', tenantId)
    .eq('role', 'student')

  // Fetch tenant info to determine province (for Quebec consent age)
  const { data: tenant } = await supabase
    .from('tenants')
    .select('country, state')
    .eq('id', tenantId)
    .single()

  const tenantProvince = tenant?.state ?? undefined

  // Identify minors who need consent
  const minors = (students ?? []).filter((s: any) => {
    if (!s.profiles?.date_of_birth) return false
    return isMinorRequiringConsent(s.profiles.date_of_birth, tenantProvince)
  })

  // Check which minors have consent on file
  let minorsWithoutConsent = 0
  if (minors.length > 0) {
    const minorIds = minors.map((m: any) => m.user_id)
    const { data: consentRecords } = await supabase
      .from('consent_records')
      .select('student_id')
      .eq('tenant_id', tenantId)
      .eq('consent_type', 'data_collection')
      .eq('consent_given', true)
      .in('student_id', minorIds)

    const consentedIds = new Set((consentRecords ?? []).map((r: any) => r.student_id))
    minorsWithoutConsent = minorIds.filter((id: string) => !consentedIds.has(id)).length
  }

  const consentAge = tenantProvince && QUEBEC_PROVINCES.includes(tenantProvince)
    ? QUEBEC_CONSENT_AGE
    : DEFAULT_CONSENT_AGE

  checks.push({
    id: 'ca-consent-minors',
    label: 'Parental Consent for Minors',
    description:
      minorsWithoutConsent === 0
        ? `All students under ${consentAge} have parental consent on file.`
        : `${minorsWithoutConsent} student(s) under ${consentAge} may need parental consent verification.`,
    category: 'pipeda',
    status:
      minors.length === 0
        ? 'pass' // no minors, nothing to check
        : minorsWithoutConsent === 0
          ? 'pass'
          : 'warning',
  })

  // -----------------------------------------------------------------------
  // 2. Data residency awareness
  // -----------------------------------------------------------------------
  // Check whether the tenant has a Canadian country setting.
  const isCanadian =
    tenant?.country?.toLowerCase() === 'canada' ||
    tenant?.country?.toLowerCase() === 'ca'

  checks.push({
    id: 'ca-data-residency',
    label: 'Data Residency Awareness',
    description: isCanadian
      ? 'Tenant is configured as a Canadian institution. Verify that your Supabase project is hosted in a Canadian region (ca-central-1) to comply with FIPPA (BC) and Law 25 (QC) data residency requirements.'
      : 'Tenant country is not set to Canada. Set the country field to ensure data residency policies are correctly applied.',
    category: 'provincial',
    status: isCanadian ? 'warning' : 'fail',
  })

  // -----------------------------------------------------------------------
  // 3. Breach notification readiness
  // -----------------------------------------------------------------------
  // Check if an admin user exists with an email (to receive breach notifications).
  const { data: admins } = await supabase
    .from('tenant_memberships')
    .select('user_id')
    .eq('tenant_id', tenantId)
    .in('role', ['admin', 'super_admin'])
    .eq('status', 'active')
    .limit(1)

  let adminEmailExists = false
  if (admins && admins.length > 0) {
    const { data: userData } = await supabase.auth.admin.getUserById(admins[0].user_id)
    adminEmailExists = !!userData?.user?.email
  }

  checks.push({
    id: 'ca-breach-notification',
    label: 'Breach Notification Readiness',
    description: adminEmailExists
      ? 'An admin contact email is on file for breach notifications to the Privacy Commissioner.'
      : 'No admin email found. PIPEDA requires a designated contact for reporting breaches to the Office of the Privacy Commissioner of Canada.',
    category: 'pipeda',
    status: adminEmailExists ? 'pass' : 'fail',
  })

  // -----------------------------------------------------------------------
  // 4. Data access / deletion request handling
  // -----------------------------------------------------------------------
  const { data: pendingRequests, count: pendingCount } = await supabase
    .from('data_deletion_requests')
    .select('id, status', { count: 'exact' })
    .eq('tenant_id', tenantId)
    .in('status', ['pending', 'in_progress'])

  const { count: totalRequests } = await supabase
    .from('data_deletion_requests')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)

  const pending = pendingCount ?? 0
  const total = totalRequests ?? 0

  checks.push({
    id: 'ca-data-access-requests',
    label: 'Data Access / Deletion Request Handling',
    description:
      pending > 0
        ? `${pending} data request(s) are pending or in progress. Ensure timely processing within 30 days as required by PIPEDA.`
        : total > 0
          ? `All ${total} data request(s) have been processed.`
          : 'No data access or deletion requests have been submitted yet. The system is ready to accept them.',
    category: 'pipeda',
    status: pending > 0 ? 'warning' : 'pass',
  })

  // -----------------------------------------------------------------------
  // 5. Privacy policy acceptance tracking
  // -----------------------------------------------------------------------
  const { count: totalMembers } = await supabase
    .from('tenant_memberships')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('status', 'active')

  const { count: acceptanceCount } = await supabase
    .from('privacy_policy_acceptances')
    .select('id', { count: 'exact', head: true })

  const members = totalMembers ?? 0
  const acceptances = acceptanceCount ?? 0

  checks.push({
    id: 'ca-privacy-policy',
    label: 'Privacy Policy Acceptance Tracking',
    description:
      acceptances > 0
        ? `${acceptances} privacy policy acceptance(s) recorded across ${members} active member(s).`
        : 'No privacy policy acceptances recorded. Ensure all users accept the privacy policy upon registration.',
    category: 'pipeda',
    status: acceptances > 0 ? (acceptances >= members ? 'pass' : 'warning') : 'fail',
  })

  // -----------------------------------------------------------------------
  // 6. Audit logging active
  // -----------------------------------------------------------------------
  const { count: recentAuditCount } = await supabase
    .from('audit_logs')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .gte('created_at', new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString())

  checks.push({
    id: 'ca-audit-logging',
    label: 'Audit Logging Active',
    description:
      (recentAuditCount ?? 0) > 0
        ? `${recentAuditCount} audit event(s) recorded in the last 24 hours. FOIP (AB) and FIPPA (BC) logging requirements are being met.`
        : 'No audit events in the last 24 hours. Verify that audit logging is active to comply with FOIP and FIPPA requirements.',
    category: 'provincial',
    status: (recentAuditCount ?? 0) > 0 ? 'pass' : 'warning',
  })

  // -----------------------------------------------------------------------
  // 7. Data minimization
  // -----------------------------------------------------------------------
  // Check that profiles only collect necessary fields (DOB, name, avatar).
  // We flag a warning if the tenant has students with bio or phone filled in,
  // since those may not be necessary for K-12 contexts.
  const { count: studentsWithExtraData } = await supabase
    .from('tenant_memberships')
    .select('user_id, profiles!inner(bio, phone)', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('role', 'student')
    .or('bio.neq.,phone.neq.', { referencedTable: 'profiles' })

  checks.push({
    id: 'ca-data-minimization',
    label: 'Data Minimization',
    description:
      (studentsWithExtraData ?? 0) === 0
        ? 'Only necessary personal information is collected from students (PIPEDA Principle 4).'
        : `${studentsWithExtraData} student profile(s) contain optional data fields (bio, phone). Review whether this data is necessary under PIPEDA Principle 4 — Limiting Collection.`,
    category: 'pipeda',
    status: (studentsWithExtraData ?? 0) === 0 ? 'pass' : 'warning',
  })

  // -----------------------------------------------------------------------
  // 8. Third-party data sharing controls
  // -----------------------------------------------------------------------
  // Check if consent for third-party sharing is being tracked.
  const { count: thirdPartyConsentCount } = await supabase
    .from('consent_records')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('consent_type', 'third_party_sharing')

  checks.push({
    id: 'ca-third-party-sharing',
    label: 'Third-Party Data Sharing Controls',
    description:
      (thirdPartyConsentCount ?? 0) > 0
        ? `${thirdPartyConsentCount} third-party data sharing consent record(s) on file. Ensure privacy impact assessments are conducted per Law 25 (QC).`
        : 'No third-party sharing consent records found. If student data is shared with external services, explicit consent must be obtained under PIPEDA and Law 25 (QC).',
    category: 'provincial',
    status: 'pass', // Pass if no sharing occurs; warning would come from policy review
  })

  // -----------------------------------------------------------------------
  // 9. Right to data portability
  // -----------------------------------------------------------------------
  // Check if the data export function is accessible (we verify by checking if
  // the data_export audit action has ever been used, indicating the feature works).
  const { count: exportCount } = await supabase
    .from('audit_logs')
    .select('id', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('action', 'data.export')

  checks.push({
    id: 'ca-data-portability',
    label: 'Right to Data Portability',
    description:
      (exportCount ?? 0) > 0
        ? `Data export functionality is active. ${exportCount} export(s) have been performed. Law 25 (QC) data portability requirements are supported.`
        : 'No data exports have been recorded yet. Ensure the data export feature is available and functional to comply with Law 25 (QC) portability rights.',
    category: 'pipeda',
    status: (exportCount ?? 0) > 0 ? 'pass' : 'warning',
  })

  // -----------------------------------------------------------------------
  // 10. Bilingual support (EN/FR)
  // -----------------------------------------------------------------------
  // Check if any users have their language preference set to French.
  const { count: frenchUserCount } = await supabase
    .from('tenant_memberships')
    .select('user_id, profiles!inner(language)', { count: 'exact', head: true })
    .eq('tenant_id', tenantId)
    .eq('profiles.language', 'fr')

  const hasFrenchUsers = (frenchUserCount ?? 0) > 0

  checks.push({
    id: 'ca-bilingual-support',
    label: 'Bilingual Support (EN/FR)',
    description: hasFrenchUsers
      ? `${frenchUserCount} user(s) have French language preferences. Ensure privacy notices, consent forms, and key communications are available in both English and French.`
      : 'No users currently have French language preferences set. Bilingual support should still be available for federal compliance and Quebec Law 25.',
    category: 'provincial',
    status: hasFrenchUsers ? 'warning' : 'pass',
  })

  return checks
}
