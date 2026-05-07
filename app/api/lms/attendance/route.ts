import { NextRequest } from 'next/server'
import { markAttendance } from '@/lib/lms/mutations'
import { lmsMutationErrorCode, lmsRedirect } from '@/lib/lms/route-helpers'
import { createClient } from '@/lib/supabase/server'

export async function POST(request: NextRequest) {
  const formData = await request.formData()

  try {
    await markAttendance(await createClient(), {
      courseId: formData.get('courseId'),
      studentId: formData.get('studentId'),
      attendanceDate: formData.get('attendanceDate'),
      status: formData.get('status'),
      notes: formData.get('notes'),
    })

    return lmsRedirect(request, '/teacher', { saved: 'attendance' })
  } catch (error) {
    return lmsRedirect(request, '/teacher', { error: lmsMutationErrorCode(error) })
  }
}
