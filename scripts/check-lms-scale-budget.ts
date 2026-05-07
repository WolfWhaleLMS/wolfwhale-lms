import { validateScaleBudget } from '@/lib/lms/roster'

function integerEnv(name: string, fallback: number) {
  const raw = process.env[name]
  if (!raw) return fallback

  const parsed = Number(raw)
  if (!Number.isInteger(parsed) || parsed < 0) {
    throw new Error(`${name} must be a non-negative integer.`)
  }

  return parsed
}

const budget = validateScaleBudget({
  activeStudents: integerEnv('LMS_SCALE_ACTIVE_STUDENTS', 1200),
  activeTeachers: integerEnv('LMS_SCALE_ACTIVE_TEACHERS', 85),
  activeCourses: integerEnv('LMS_SCALE_ACTIVE_COURSES', 180),
  activeEnrollments: integerEnv('LMS_SCALE_ACTIVE_ENROLLMENTS', 6400),
})

if (!budget.ok) {
  console.error('LMS scale budget check failed:')
  for (const warning of budget.warnings) {
    console.error(`- ${warning}`)
  }
  process.exit(1)
}

console.log('LMS scale budget check passed for the verified single-school operating envelope.')
