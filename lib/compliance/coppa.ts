'use server'

import { createClient } from '@/lib/supabase/server'
import { headers } from 'next/headers'

/**
 * COPPA Compliance Utilities
 * Children under 13 require verifiable parental consent before
 * their data can be collected or used.
 */

export interface ConsentRecord {
  studentId: string
  parentId: string
  consentGiven: boolean
  consentDate: string | null
  method: 'email' | 'signed_form' | 'electronic' | null
  studentAge: number | null
}

/**
 * Check if a student is under 13 (requires COPPA consent).
 */
export function isUnder13(dateOfBirth: string | null): boolean {
  if (!dateOfBirth) return false
  const dob = new Date(dateOfBirth)
  const today = new Date()
  let age = today.getFullYear() - dob.getFullYear()
  const monthDiff = today.getMonth() - dob.getMonth()
  if (monthDiff < 0 || (monthDiff === 0 && today.getDate() < dob.getDate())) {
    age--
  }
  return age < 13
}

/**
 * Check if a student has parental consent on file.
 */
export async function hasParentalConsent(studentId: string): Promise<boolean> {
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data } = await supabase
    .from('student_parents')
    .select('consent_given')
    .eq('student_id', studentId)
    .eq('tenant_id', tenantId)
    .limit(1)

  if (!data || data.length === 0) return false
  return data.some((r) => r.consent_given === true)
}

/**
 * Get all consent records for a tenant (admin view).
 */
export async function getConsentRecords(): Promise<ConsentRecord[]> {
  const supabase = await createClient()
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  const { data, error } = await supabase
    .from('student_parents')
    .select(`
      student_id,
      parent_id,
      consent_given,
      created_at,
      profiles!student_parents_student_id_fkey(date_of_birth)
    `)
    .eq('tenant_id', tenantId)

  if (error || !data) return []

  return data.map((r: any) => ({
    studentId: r.student_id,
    parentId: r.parent_id,
    consentGiven: r.consent_given ?? false,
    consentDate: r.consent_given ? r.created_at : null,
    method: r.consent_given ? 'electronic' : null,
    studentAge: r.profiles?.date_of_birth
      ? calculateAge(r.profiles.date_of_birth)
      : null,
  }))
}

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
