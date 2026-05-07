type OneRosterTable = 'orgs' | 'users' | 'courses' | 'classes' | 'enrollments'

export interface OneRosterBundleInput {
  orgs: string
  users: string
  courses: string
  classes: string
  enrollments: string
}

interface OneRosterOrgRow {
  sourcedId: string
  name: string
  type: string
}

interface OneRosterUserRow {
  sourcedId: string
  username: string
  givenName: string
  familyName: string
  role: string
  email: string
  orgSourcedIds: string[]
}

interface OneRosterCourseRow {
  sourcedId: string
  title: string
  courseCode: string
  orgSourcedId: string
}

interface OneRosterClassRow {
  sourcedId: string
  title: string
  courseSourcedId: string
  schoolSourcedId: string
  termSourcedIds: string[]
}

interface OneRosterEnrollmentRow {
  sourcedId: string
  classSourcedId: string
  schoolSourcedId: string
  userSourcedId: string
  role: string
  primary: boolean
}

export interface OneRosterBundleResult {
  rows: {
    orgs: OneRosterOrgRow[]
    users: OneRosterUserRow[]
    courses: OneRosterCourseRow[]
    classes: OneRosterClassRow[]
    enrollments: OneRosterEnrollmentRow[]
  }
  summary: Record<OneRosterTable, number>
  errors: string[]
}

const oneRosterRoles = new Set(['administrator', 'aide', 'guardian', 'parent', 'proctor', 'relative', 'student', 'teacher'])

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

function parseTable(csv: string, requiredHeaders: string[], table: OneRosterTable) {
  const lines = csv
    .replace(/\r\n/g, '\n')
    .replace(/\r/g, '\n')
    .split('\n')
    .filter((line) => line.trim().length > 0)
  const errors: string[] = []

  if (lines.length === 0) {
    return { rows: [] as Record<string, string>[], errors: [`${table}: file is empty.`] }
  }

  const headers = parseCsvLine(lines[0])
  const missingHeaders = requiredHeaders.filter((header) => !headers.includes(header))
  if (missingHeaders.length > 0) {
    return { rows: [], errors: [`${table}: missing required columns ${missingHeaders.join(', ')}.`] }
  }

  const rows = lines.slice(1).map((line) => {
    const values = parseCsvLine(line)
    return Object.fromEntries(headers.map((header, index) => [header, values[index] ?? '']))
  })

  for (const [index, row] of rows.entries()) {
    if (!row.sourcedId) {
      errors.push(`${table} row ${index + 2}: sourcedId is required.`)
    }
  }

  return { rows, errors }
}

function list(value: string) {
  return value
    .split(';')
    .map((item) => item.trim())
    .filter(Boolean)
}

function emailAddress(value: string) {
  return /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(value)
}

export function parseOneRosterBundle(input: OneRosterBundleInput): OneRosterBundleResult {
  const orgTable = parseTable(input.orgs, ['sourcedId', 'name', 'type'], 'orgs')
  const userTable = parseTable(input.users, ['sourcedId', 'username', 'givenName', 'familyName', 'role', 'email', 'orgSourcedIds'], 'users')
  const courseTable = parseTable(input.courses, ['sourcedId', 'title', 'courseCode', 'orgSourcedId'], 'courses')
  const classTable = parseTable(input.classes, ['sourcedId', 'title', 'courseSourcedId', 'schoolSourcedId', 'termSourcedIds'], 'classes')
  const enrollmentTable = parseTable(
    input.enrollments,
    ['sourcedId', 'classSourcedId', 'schoolSourcedId', 'userSourcedId', 'role', 'primary'],
    'enrollments'
  )

  const errors = [
    ...orgTable.errors,
    ...userTable.errors,
    ...courseTable.errors,
    ...classTable.errors,
    ...enrollmentTable.errors,
  ]

  const orgIds = new Set(orgTable.rows.map((row) => row.sourcedId))
  const userIds = new Set(userTable.rows.map((row) => row.sourcedId))
  const courseIds = new Set(courseTable.rows.map((row) => row.sourcedId))
  const classIds = new Set(classTable.rows.map((row) => row.sourcedId))

  const orgs = orgTable.rows.map((row) => ({ sourcedId: row.sourcedId, name: row.name, type: row.type }))
  const users = userTable.rows.map((row, index) => {
    if (!oneRosterRoles.has(row.role)) {
      errors.push(`users row ${index + 2}: role must be administrator, aide, guardian, parent, proctor, relative, student, or teacher.`)
    }
    if (!emailAddress(row.email)) {
      errors.push(`users row ${index + 2}: email must be a valid address.`)
    }

    const orgSourcedIds = list(row.orgSourcedIds)
    for (const orgId of orgSourcedIds) {
      if (!orgIds.has(orgId)) {
        errors.push(`users row ${index + 2}: orgSourcedIds references unknown org ${orgId}.`)
      }
    }

    return {
      sourcedId: row.sourcedId,
      username: row.username,
      givenName: row.givenName,
      familyName: row.familyName,
      role: row.role,
      email: row.email,
      orgSourcedIds,
    }
  })
  const courses = courseTable.rows.map((row, index) => {
    if (!orgIds.has(row.orgSourcedId)) {
      errors.push(`courses row ${index + 2}: orgSourcedId references unknown org ${row.orgSourcedId}.`)
    }

    return {
      sourcedId: row.sourcedId,
      title: row.title,
      courseCode: row.courseCode,
      orgSourcedId: row.orgSourcedId,
    }
  })
  const classes = classTable.rows.map((row, index) => {
    if (!courseIds.has(row.courseSourcedId)) {
      errors.push(`classes row ${index + 2}: courseSourcedId references unknown course ${row.courseSourcedId}.`)
    }
    if (!orgIds.has(row.schoolSourcedId)) {
      errors.push(`classes row ${index + 2}: schoolSourcedId references unknown org ${row.schoolSourcedId}.`)
    }

    return {
      sourcedId: row.sourcedId,
      title: row.title,
      courseSourcedId: row.courseSourcedId,
      schoolSourcedId: row.schoolSourcedId,
      termSourcedIds: list(row.termSourcedIds),
    }
  })
  const enrollments = enrollmentTable.rows.map((row, index) => {
    if (!classIds.has(row.classSourcedId)) {
      errors.push(`enrollments row ${index + 2}: classSourcedId references unknown class ${row.classSourcedId}.`)
    }
    if (!userIds.has(row.userSourcedId)) {
      errors.push(`enrollments row ${index + 2}: userSourcedId references unknown user ${row.userSourcedId}.`)
    }
    if (!orgIds.has(row.schoolSourcedId)) {
      errors.push(`enrollments row ${index + 2}: schoolSourcedId references unknown org ${row.schoolSourcedId}.`)
    }

    return {
      sourcedId: row.sourcedId,
      classSourcedId: row.classSourcedId,
      schoolSourcedId: row.schoolSourcedId,
      userSourcedId: row.userSourcedId,
      role: row.role,
      primary: row.primary === 'true',
    }
  })

  const rows = errors.length > 0 ? { orgs: [], users: [], courses: [], classes: [], enrollments: [] } : { orgs, users, courses, classes, enrollments }

  return {
    rows,
    summary: {
      orgs: orgs.length,
      users: users.length,
      courses: courses.length,
      classes: classes.length,
      enrollments: enrollments.length,
    },
    errors,
  }
}
