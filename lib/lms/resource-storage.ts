export function getCourseResourceBucket() {
  return process.env.SUPABASE_COURSE_RESOURCE_BUCKET?.trim() || 'lesson-resources'
}

export function getSubmissionBucket() {
  return process.env.SUPABASE_SUBMISSION_BUCKET?.trim() || 'submissions'
}

export const courseResourceBucketIds = ['lesson-resources', 'course-materials'] as const
