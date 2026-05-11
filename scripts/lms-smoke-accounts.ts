export const lmsSmokeRoles = ['student', 'teacher', 'admin', 'guardian'] as const

export type LmsSmokeRole = (typeof lmsSmokeRoles)[number]

type EnvMap = Record<string, string | undefined>

const defaultCredentials: Record<LmsSmokeRole, { email: string; password: string }> = {
  student: {
    email: 'student@wolfwhale.ca',
    password: 'WolfWhale-Student-2026',
  },
  teacher: {
    email: 'teacher@wolfwhale.ca',
    password: 'WolfWhale-Teacher-2026',
  },
  admin: {
    email: 'admin@wolfwhale.ca',
    password: 'WolfWhale-Admin-2026',
  },
  guardian: {
    email: 'parent@wolfwhale.ca',
    password: 'WolfWhale-Parent-2026',
  },
}

const envKeys: Record<LmsSmokeRole, { email: string; password: string }> = {
  student: {
    email: 'LMS_SMOKE_STUDENT_EMAIL',
    password: 'LMS_SMOKE_STUDENT_PASSWORD',
  },
  teacher: {
    email: 'LMS_SMOKE_TEACHER_EMAIL',
    password: 'LMS_SMOKE_TEACHER_PASSWORD',
  },
  admin: {
    email: 'LMS_SMOKE_ADMIN_EMAIL',
    password: 'LMS_SMOKE_ADMIN_PASSWORD',
  },
  guardian: {
    email: 'LMS_SMOKE_GUARDIAN_EMAIL',
    password: 'LMS_SMOKE_GUARDIAN_PASSWORD',
  },
}

export function credentialsForSmokeRole(role: LmsSmokeRole, env: EnvMap = process.env) {
  const keys = envKeys[role]

  return {
    email: env[keys.email]?.trim() || defaultCredentials[role].email,
    password: env[keys.password] || defaultCredentials[role].password,
  }
}
