import type { LmsMembershipRole } from '@/lib/lms/types'

const rosterRoles: readonly LmsMembershipRole[] = ['student', 'teacher', 'parent', 'admin', 'super_admin']

export interface RosterImportRow {
  email: string
  firstName: string
  lastName: string
  role: LmsMembershipRole
  gradeLevel: string
}

export interface RosterImportResult {
  rows: RosterImportRow[]
  errors: string[]
}

export interface ScaleBudgetInput {
  activeStudents: number
  activeTeachers: number
  activeCourses: number
  activeEnrollments: number
}

function parseCsvLine(line: string) {
  const values: string[] = []
  let current = ''
  let quoted = false

  for (let index = 0; index < line.length; index += 1) {
    const char = line[index]
    const next = line[index + 1]

    if (char === '"' && quoted && next === '"') {
      current += '"'
      index += 1
      continue
    }
    if (char === '"') {
      quoted = !quoted
      continue
    }
    if (char === ',' && !quoted) {
      values.push(current.trim())
      current = ''
      continue
    }

    current += char
  }

  values.push(current.trim())
  return values
}

function emailAddress(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

function role(value: string): LmsMembershipRole | null {
  return rosterRoles.includes(value as LmsMembershipRole) ? (value as LmsMembershipRole) : null
}

export function parseRosterCsv(csv: string): RosterImportResult {
  const lines = csv
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0)

  if (lines.length === 0) {
    return { rows: [], errors: ['Roster CSV is empty.'] }
  }

  const headers = parseCsvLine(lines[0]).map((header) => header.toLowerCase())
  const indexes = {
    email: headers.indexOf('email'),
    firstName: headers.indexOf('first_name'),
    lastName: headers.indexOf('last_name'),
    role: headers.indexOf('role'),
    gradeLevel: headers.indexOf('grade_level'),
  }
  const missingHeaders = [
    ['email', indexes.email],
    ['first_name', indexes.firstName],
    ['last_name', indexes.lastName],
    ['role', indexes.role],
  ]
    .filter(([, index]) => index === -1)
    .map(([name]) => String(name))

  if (missingHeaders.length > 0) {
    return { rows: [], errors: [`Roster CSV is missing required columns: ${missingHeaders.join(', ')}.`] }
  }

  const rows: RosterImportRow[] = []
  const errors: string[] = []
  const emails = new Set<string>()

  for (let index = 1; index < lines.length; index += 1) {
    const values = parseCsvLine(lines[index])
    const rowNumber = index + 1
    const email = values[indexes.email]?.toLowerCase() ?? ''
    const firstName = values[indexes.firstName] ?? ''
    const lastName = values[indexes.lastName] ?? ''
    const parsedRole = role(values[indexes.role] ?? '')
    const gradeLevel = indexes.gradeLevel === -1 ? '' : values[indexes.gradeLevel] ?? ''

    if (!emailAddress(email)) {
      errors.push(`Row ${rowNumber}: email must be a valid address.`)
    }
    if (email && emails.has(email)) {
      errors.push(`Row ${rowNumber}: email is duplicated in this roster file.`)
    }
    if (!firstName) {
      errors.push(`Row ${rowNumber}: first_name is required.`)
    }
    if (!lastName) {
      errors.push(`Row ${rowNumber}: last_name is required.`)
    }
    if (!parsedRole) {
      errors.push(`Row ${rowNumber}: role must be student, teacher, parent, admin, or super_admin.`)
    }

    emails.add(email)

    if (parsedRole) {
      rows.push({ email, firstName, lastName, role: parsedRole, gradeLevel })
    }
  }

  return { rows: errors.length > 0 ? [] : rows, errors }
}

export function validateScaleBudget(input: ScaleBudgetInput) {
  const warnings: string[] = []

  if (input.activeStudents > 5000) {
    warnings.push('Active students exceed the current verified single-school budget of 5000.')
  }
  if (input.activeTeachers > 500) {
    warnings.push('Active teachers exceed the current verified single-school budget of 500.')
  }
  if (input.activeCourses > 1000) {
    warnings.push('Active courses exceed the current verified single-school budget of 1000.')
  }
  if (input.activeEnrollments > 50000) {
    warnings.push('Active enrollments exceed the current verified single-school budget of 50000.')
  }

  return {
    ok: warnings.length === 0,
    warnings,
  }
}
