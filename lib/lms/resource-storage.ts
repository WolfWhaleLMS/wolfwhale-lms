export function getCourseResourceBucket() {
  return process.env.SUPABASE_COURSE_RESOURCE_BUCKET?.trim() || 'lesson-resources'
}

export const courseResourceBucketIds = ['lesson-resources', 'course-materials'] as const
