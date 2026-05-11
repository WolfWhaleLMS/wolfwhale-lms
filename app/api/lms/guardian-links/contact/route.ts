import { NextRequest } from 'next/server'
import { updateGuardianContactDetails } from '@/lib/lms/guardian-links'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'guardian-contact', { limit: 30, window: '10 m' })
    await updateGuardianContactDetails(await createClient(), {
      studentId: formData.get('studentId'),
      guardianId: formData.get('guardianId'),
      primaryContact: formData.get('primaryContact'),
      consentGiven: formData.get('consentGiven'),
      consentMethod: formData.get('consentMethod'),
      consentNotes: formData.get('consentNotes'),
      custodyNotes: formData.get('custodyNotes'),
    })

    return lmsRedirect(request, '/admin', { saved: 'guardian-contact' })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
