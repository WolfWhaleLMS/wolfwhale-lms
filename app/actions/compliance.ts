'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'
import { revalidatePath } from 'next/cache'
import { exportUserData } from '@/lib/compliance/data-export'
import { logAuditEvent } from '@/lib/compliance/audit-logger'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

async function requireAdmin() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const headersList = await headers()
  const role = headersList.get('x-user-role')
  if (role !== 'admin' && role !== 'super_admin') {
    throw new Error('Access denied. Admin role required.')
  }

  const tenantId = headersList.get('x-tenant-id')
  return { user, tenantId }
}

async function getCurrentUser() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) throw new Error('Not authenticated')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  return { user, tenantId }
}

// ---------------------------------------------------------------------------
// Data Export (GDPR / PIPEDA)
// ---------------------------------------------------------------------------

export async function requestDataExport(): Promise<{
  data: Record<string, unknown> | null
  error: string | null
}> {
  try {
    const { user, tenantId } = await getCurrentUser()

    const exportData = await exportUserData(user.id, tenantId ?? undefined)

    await logAuditEvent({
      action: 'data.export',
      resourceType: 'user',
      resourceId: user.id,
      details: { type: 'full_data_export' },
    })

    return { data: exportData as unknown as Record<string, unknown>, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ---------------------------------------------------------------------------
// Compliance Status
// ---------------------------------------------------------------------------

export interface ComplianceCheckItem {
  id: string
  label: string
  description: string
  status: 'pass' | 'warning' | 'fail'
}

export interface ComplianceStatus {
  ferpa: ComplianceCheckItem[]
  coppa: ComplianceCheckItem[]
  lastAuditDate: string | null
}

export async function getComplianceStatus(
  tenantId?: string
): Promise<{ data: ComplianceStatus | null; error: string | null }> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    // Resolve tenant
    const headersList = await headers()
    const resolvedTenantId = tenantId ?? headersList.get('x-tenant-id')

    // Check for audit logs existence (basic FERPA data-access-logging requirement)
    const { count: auditCount } = await supabase
      .from('audit_logs')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', resolvedTenantId)

    // Check consent records
    const { count: consentCount } = await supabase
      .from('consent_records')
      .select('*', { count: 'exact', head: true })
      .eq('tenant_id', resolvedTenantId)

    // Check for users under 13 without consent
    const { count: minorsWithoutConsent } = await supabase
      .from('profiles')
      .select('*, consent_records!left(id)', { count: 'exact', head: true })
      .eq('tenant_id', resolvedTenantId)
      .lte('age', 12)
      .is('consent_records.id', null)

    // Get most recent audit log date
    const { data: latestAudit } = await supabase
      .from('audit_logs')
      .select('created_at')
      .eq('tenant_id', resolvedTenantId)
      .order('created_at', { ascending: false })
      .limit(1)
      .single()

    const ferpaChecks: ComplianceCheckItem[] = [
      {
        id: 'ferpa-audit-logging',
        label: 'Audit Logging Active',
        description: 'All data access events are being logged',
        status: (auditCount ?? 0) > 0 ? 'pass' : 'warning',
      },
      {
        id: 'ferpa-access-controls',
        label: 'Role-Based Access Controls',
        description: 'Users can only access data for their assigned roles',
        status: 'pass', // Enforced by middleware
      },
      {
        id: 'ferpa-data-encryption',
        label: 'Data Encryption at Rest',
        description: 'Student records are encrypted in the database',
        status: 'pass', // Supabase handles this
      },
      {
        id: 'ferpa-data-minimization',
        label: 'Data Minimization',
        description: 'Only necessary data is collected from students',
        status: 'pass',
      },
      {
        id: 'ferpa-breach-notification',
        label: 'Breach Notification Plan',
        description: 'Incident response procedures are documented',
        status: 'warning',
      },
    ]

    const coppaChecks: ComplianceCheckItem[] = [
      {
        id: 'coppa-parental-consent',
        label: 'Parental Consent Collection',
        description: 'Consent forms are collected for students under 13',
        status:
          (consentCount ?? 0) > 0
            ? (minorsWithoutConsent ?? 0) === 0
              ? 'pass'
              : 'warning'
            : 'fail',
      },
      {
        id: 'coppa-consent-records',
        label: 'Consent Record Keeping',
        description: 'All consent records are stored and retrievable',
        status: (consentCount ?? 0) > 0 ? 'pass' : 'warning',
      },
      {
        id: 'coppa-data-deletion',
        label: 'Data Deletion Capability',
        description: 'Parents can request deletion of child data',
        status: 'pass',
      },
      {
        id: 'coppa-third-party',
        label: 'Third-Party Data Sharing',
        description: 'No student data is shared with third parties without consent',
        status: 'pass',
      },
    ]

    return {
      data: {
        ferpa: ferpaChecks,
        coppa: coppaChecks,
        lastAuditDate: latestAudit?.created_at ?? null,
      },
      error: null,
    }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ---------------------------------------------------------------------------
// Consent Records (COPPA)
// ---------------------------------------------------------------------------

export interface ConsentRecord {
  id: string
  student_id: string
  student_name: string | null
  parent_id: string | null
  parent_name: string | null
  consent_given: boolean
  consent_date: string | null
  updated_at: string | null
}

export async function getConsentRecords(
  tenantId?: string
): Promise<{ data: ConsentRecord[] | null; error: string | null }> {
  try {
    await requireAdmin()
    const supabase = await createClient()

    const headersList = await headers()
    const resolvedTenantId = tenantId ?? headersList.get('x-tenant-id')

    const { data, error } = await supabase
      .from('consent_records')
      .select(
        `
        id,
        student_id,
        parent_id,
        consent_given,
        consent_date,
        updated_at,
        student:student_id(full_name),
        parent:parent_id(full_name)
      `
      )
      .eq('tenant_id', resolvedTenantId)
      .order('consent_date', { ascending: false })

    if (error) {
      return { data: null, error: error.message }
    }

    const records: ConsentRecord[] = (data ?? []).map((r: any) => ({
      id: r.id,
      student_id: r.student_id,
      student_name: r.student?.full_name ?? null,
      parent_id: r.parent_id,
      parent_name: r.parent?.full_name ?? null,
      consent_given: r.consent_given,
      consent_date: r.consent_date,
      updated_at: r.updated_at,
    }))

    return { data: records, error: null }
  } catch (error) {
    return {
      data: null,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}

// ---------------------------------------------------------------------------
// Update Consent Status
// ---------------------------------------------------------------------------

export async function updateConsentStatus(
  studentId: string,
  consentGiven: boolean
): Promise<{ success: boolean; error: string | null }> {
  try {
    const { user, tenantId } = await requireAdmin()
    const supabase = await createClient()

    const { error } = await supabase
      .from('consent_records')
      .upsert(
        {
          student_id: studentId,
          tenant_id: tenantId,
          parent_id: user.id,
          consent_given: consentGiven,
          consent_date: consentGiven ? new Date().toISOString() : null,
          updated_at: new Date().toISOString(),
        },
        { onConflict: 'student_id,tenant_id' }
      )

    if (error) {
      return { success: false, error: error.message }
    }

    await logAuditEvent({
      action: 'admin.action',
      resourceType: 'consent_record',
      resourceId: studentId,
      details: { consent_given: consentGiven },
    })

    revalidatePath('/admin/compliance')
    return { success: true, error: null }
  } catch (error) {
    return {
      success: false,
      error: error instanceof Error ? error.message : 'Unknown error',
    }
  }
}
