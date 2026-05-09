import { NextRequest } from 'next/server'
import { importRosterWithInvites } from '@/lib/lms/roster-import'
import { enforceLmsMutationRateLimit, lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

async function rosterCsv(formValue: FormDataEntryValue | null) {
  if (typeof formValue === 'string') return formValue
  if (formValue && typeof formValue.text === 'function') return formValue.text()

  return ''
}

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await enforceLmsMutationRateLimit(request, 'roster-import', { limit: 5, window: '10 m' })
    const result = await importRosterWithInvites(await createClient(), {
      rosterCsv: await rosterCsv(formData.get('rosterCsv')),
    })

    return lmsRedirect(request, '/admin', { saved: 'roster', imported: String(result.importedCount) })
  } catch (error) {
    return lmsRedirect(request, '/admin', { error: lmsMutationErrorCode(error) })
  }
}
