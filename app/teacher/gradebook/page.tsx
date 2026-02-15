import { createClient } from '@/lib/supabase/server'
import { getGradebook } from '@/app/actions/grades'
import GradebookClient from './GradebookClient'

export default async function TeacherGradebookPage() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()

  let courses: { id: string; name: string }[] = []
  let initialGradebook = null
  let initialError: string | null = null

  if (user) {
    // Fetch teacher's courses server-side (eliminates first waterfall)
    const { data } = await supabase
      .from('courses')
      .select('id, name')
      .eq('created_by', user.id)
      .order('name')

    courses = data ?? []

    // Pre-fetch gradebook for the first course (eliminates second waterfall)
    if (courses.length > 0) {
      const result = await getGradebook(courses[0].id)
      if (result.error) {
        initialError = result.error
      } else {
        initialGradebook = result.data ?? null
      }
    }
  }

  return (
    <GradebookClient
      courses={courses}
      initialGradebook={initialGradebook as any}
      initialError={initialError}
    />
  )
}
