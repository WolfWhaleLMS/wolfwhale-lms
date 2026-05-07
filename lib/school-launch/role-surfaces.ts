export type SchoolRole = 'student' | 'teacher' | 'admin' | 'guardian'

export interface RoleSurface {
  role: SchoolRole
  title: string
  eyebrow: string
  status: 'controlled-pilot'
  summary: string
  primaryWorkflows: string[]
  requiredBeforeRealData: string[]
}

export const ROLE_SURFACES: RoleSurface[] = [
  {
    role: 'student',
    title: 'Student launch console',
    eyebrow: 'Learner access',
    status: 'controlled-pilot',
    summary:
      'A protected route shell for validating navigation, mobile layout, and access controls before any real learner records are connected.',
    primaryWorkflows: ['Course list', 'Assignment queue', 'Submissions', 'Grades and feedback'],
    requiredBeforeRealData: [
      'Supabase Auth session handling',
      'Student enrollment RLS tests',
      'Submission upload permissions',
      'Grade visibility tests',
    ],
  },
  {
    role: 'teacher',
    title: 'Teacher launch console',
    eyebrow: 'Classroom operations',
    status: 'controlled-pilot',
    summary:
      'A protected route shell for the instructor workflows that must be built and tested before a school pilot can use live classes.',
    primaryWorkflows: ['Class dashboard', 'Assignment creation', 'Submission review', 'Feedback and grading'],
    requiredBeforeRealData: [
      'Teacher course authorization tests',
      'Assignment create/update validation',
      'Rubric and feedback persistence',
      'File access boundaries',
    ],
  },
  {
    role: 'admin',
    title: 'Admin launch console',
    eyebrow: 'School setup',
    status: 'controlled-pilot',
    summary:
      'A protected route shell for tenant setup, staff onboarding, roster checks, and audit controls that must exist before launch.',
    primaryWorkflows: ['School profile', 'User provisioning', 'Sections and enrollments', 'Audit and support review'],
    requiredBeforeRealData: [
      'Admin-only tenant management',
      'Invite and role assignment flow',
      'Backup restore drill evidence',
      'Audit log review workflow',
    ],
  },
  {
    role: 'guardian',
    title: 'Guardian launch console',
    eyebrow: 'Family visibility',
    status: 'controlled-pilot',
    summary:
      'A protected route shell for parent and guardian access boundaries before exposing student progress or messages.',
    primaryWorkflows: ['Linked students', 'Progress summary', 'Attendance notices', 'Teacher messages'],
    requiredBeforeRealData: [
      'Guardian-student consent checks',
      'Student-parent RLS tests',
      'Message access restrictions',
      'Privacy notice acceptance',
    ],
  },
]

export function getRoleSurface(role: SchoolRole) {
  const surface = ROLE_SURFACES.find((candidate) => candidate.role === role)

  if (!surface) {
    throw new Error(`Unknown school role: ${role}`)
  }

  return surface
}
