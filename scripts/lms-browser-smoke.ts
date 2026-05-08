import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium, type Browser, type Page } from '@playwright/test'

const baseUrl = process.env.LMS_SMOKE_BASE_URL ?? 'http://localhost:3000'
const outputDir = path.resolve(process.cwd(), 'test-results/lms-smoke')
const roles = ['student', 'teacher', 'admin', 'guardian'] as const
const runMutatingWorkflowChecks = process.env.LMS_SMOKE_MUTATE === '1'
type LmsRole = (typeof roles)[number]

const credentials: Record<LmsRole, { email: string; password: string }> = {
  student: {
    email: process.env.LMS_SMOKE_STUDENT_EMAIL ?? 'student@wolfwhale.ca',
    password: process.env.LMS_SMOKE_STUDENT_PASSWORD ?? 'WolfWhale-Student-2026',
  },
  teacher: {
    email: process.env.LMS_SMOKE_TEACHER_EMAIL ?? 'teacher@wolfwhale.ca',
    password: process.env.LMS_SMOKE_TEACHER_PASSWORD ?? 'WolfWhale-Teacher-2026',
  },
  admin: {
    email: process.env.LMS_SMOKE_ADMIN_EMAIL ?? 'admin@wolfwhale.ca',
    password: process.env.LMS_SMOKE_ADMIN_PASSWORD ?? 'WolfWhale-Admin-2026',
  },
  guardian: {
    email: process.env.LMS_SMOKE_GUARDIAN_EMAIL ?? 'parent@wolfwhale.ca',
    password: process.env.LMS_SMOKE_GUARDIAN_PASSWORD ?? 'WolfWhale-Parent-2026',
  },
}

function roleHeading(role: LmsRole) {
  return `${role[0].toUpperCase()}${role.slice(1)} dashboard`
}

const requiredDashboardTools: Record<LmsRole, string[]> = {
  student: ['Courses', 'Assignments', 'Submit work', 'Grades and feedback', 'Gradebook', 'Attendance', 'Calendar', 'Resources', 'Messages', 'Notifications', 'Companion world', 'Settings'],
  teacher: ['Courses', 'Roster', 'Assignments', 'Create assignment', 'Gradebook', 'Attendance', 'Rubrics', 'Grading queue', 'Calendar', 'Resources', 'Messages'],
  admin: ['School', 'Audit trail', 'Metrics', 'Risk', 'Attendance', 'Calendar', 'Resources', 'Messages', 'Create course', 'Enroll student', 'Roster import'],
  guardian: ['Linked students', 'Attendance', 'Calendar', 'Resources', 'Messages'],
}

function linkName(label: string) {
  return new RegExp(`^${label.replace(/[.*+?^${}()|[\]\\]/g, '\\$&')}\\b`)
}

async function assertNoFrameworkError(page: Page) {
  const bodyText = await page.locator('body').innerText()
  const forbidden = ['Unhandled Runtime Error', 'Application error', 'This page could not be found']

  for (const phrase of forbidden) {
    if (bodyText.includes(phrase)) {
      throw new Error(`Framework error found on ${page.url()}: ${phrase}`)
    }
  }
}

async function assertAccessibilitySmoke(page: Page) {
  const h1Count = await page.locator('h1').count()
  if (h1Count < 1) {
    throw new Error(`Accessibility smoke failed on ${page.url()}: no h1 found.`)
  }

  const missingAltCount = await page.locator('img:not([alt])').count()
  if (missingAltCount > 0) {
    throw new Error(`Accessibility smoke failed on ${page.url()}: ${missingAltCount} image(s) missing alt text.`)
  }

  const unlabeledControls = await page.locator('input:not([type="hidden"]), textarea, select').evaluateAll((controls) =>
    controls
      .filter((element) => {
        const control = element as HTMLInputElement | HTMLTextAreaElement | HTMLSelectElement

        return (
          !control.labels?.length &&
          !control.getAttribute('aria-label') &&
          !control.getAttribute('aria-labelledby')
        )
      })
      .map((element) => element.outerHTML.slice(0, 120))
  )
  if (unlabeledControls.length > 0) {
    throw new Error(
      `Accessibility smoke failed on ${page.url()}: unlabeled controls found: ${unlabeledControls.join(' | ')}`
    )
  }

  const emptyButtons = await page.locator('button').evaluateAll((buttons) =>
    buttons
      .filter((button) => !button.textContent?.trim() && !button.getAttribute('aria-label') && !button.getAttribute('title'))
      .map((button) => button.outerHTML.slice(0, 120))
  )
  if (emptyButtons.length > 0) {
    throw new Error(`Accessibility smoke failed on ${page.url()}: unnamed buttons found: ${emptyButtons.join(' | ')}`)
  }
}

async function assertRoleSurface(page: Page, role: LmsRole) {
  if (role === 'teacher') {
    await page.getByRole('heading', { name: 'Gradebook' }).waitFor()
    await page.getByRole('heading', { name: 'Attendance' }).waitFor()
    await page.getByRole('heading', { name: 'Rubrics' }).waitFor()
    await page.getByRole('button', { name: 'Save attendance' }).waitFor()
    await page.getByRole('button', { name: 'Save rubric' }).waitFor()
  }

  if (role === 'admin') {
    await page.getByRole('heading', { name: 'Risk summary' }).waitFor()
    await page.getByRole('heading', { name: 'Roster import' }).waitFor()
    await page.getByRole('button', { name: 'Import roster' }).waitFor()
  }

  if (role === 'student') {
    await page.getByRole('heading', { name: 'Tool hub' }).waitFor()
    await page.getByRole('heading', { name: 'Learning cockpit' }).waitFor()
    await page.getByRole('heading', { name: 'Study companion' }).waitFor()
  }

  if (role === 'guardian') {
    await page.getByRole('heading', { name: 'Gradebook' }).waitFor()
    await page.getByRole('heading', { name: 'Attendance' }).waitFor()
  }
}

async function assertApiLinks(page: Page) {
  const origin = new URL(page.url()).origin
  const hrefs = await page
    .locator('a[href^="/api/lms/exports"], a[href^="/api/lms/resources"]')
    .evaluateAll((links) => [...new Set(links.map((link) => (link as HTMLAnchorElement).getAttribute('href')).filter(Boolean))])

  for (const href of hrefs) {
    const response = await page.request.get(new URL(href!, origin).toString())
    if (!response.ok()) {
      throw new Error(`Expected LMS API link ${href} on ${page.url()} to be reachable, got ${response.status()}.`)
    }
  }
}

async function assertDashboardTools(page: Page, role: LmsRole) {
  const nav = page.getByRole('navigation', { name: 'Dashboard tools' })
  await nav.waitFor()
  const dashboardUrl = page.url().replace(/#.*$/, '')
  const dashboardPath = new URL(dashboardUrl).pathname

  for (const label of requiredDashboardTools[role]) {
    const link = nav.getByRole('link', { name: linkName(label) })
    await link.waitFor()

    const href = await link.evaluate((element) => (element as HTMLAnchorElement).href)
    const target = new URL(href)

    if (target.pathname === dashboardPath) {
      if (!target.hash) {
        throw new Error(`Dashboard tool "${label}" on ${page.url()} does not target a section or workspace.`)
      }

      await link.click()
      await page.waitForFunction((expectedHash) => window.location.hash === expectedHash, target.hash)
      await page.locator(target.hash).waitFor()
    } else {
      await link.click()
      await page.waitForURL((url) => url.pathname === target.pathname && (!target.hash || url.hash === target.hash))
      await assertNoFrameworkError(page)
      await assertAccessibilitySmoke(page)
      if (target.hash) {
        await page.locator(target.hash).waitFor()
      } else {
        await page.locator('main').waitFor()
      }

      await page.goto(dashboardUrl, { waitUntil: 'domcontentloaded' })
      await page.getByRole('heading', { name: roleHeading(role) }).waitFor()
      await nav.waitFor()
    }
  }

  const dashboardHome = page.getByRole('link', { name: 'Dashboard home' })
  if ((await dashboardHome.count()) > 0) {
    await dashboardHome.click()
    await page.waitForFunction(() => window.location.hash === '#dashboard-top')
    await page.locator('#dashboard-top').waitFor()
  } else {
    await page.locator('#dashboard-top').waitFor()
  }
}

async function waitForSaved(page: Page, role: LmsRole, saved: string) {
  await page.waitForURL((url) => url.pathname === `/${role}` && url.searchParams.get('saved') === saved)
  await page.getByRole('heading', { name: roleHeading(role) }).waitFor()
  await assertNoFrameworkError(page)
}

async function exerciseStudentWorkflows(page: Page) {
  const assignmentsUrl = new URL('/student/assignments#submit-work', page.url()).toString()

  await page.goto(assignmentsUrl, { waitUntil: 'domcontentloaded' })
  await page.locator('#submit-work').waitFor()

  const submissionForms = page.locator('#submit-work form[action="/api/lms/submissions"]')
  const formCount = await submissionForms.count()
  if (formCount === 0) {
    throw new Error('Student assignments workspace has no assignment submission forms.')
  }

  for (let index = 0; index < formCount; index += 1) {
    if (index > 0) {
      await page.goto(assignmentsUrl, { waitUntil: 'domcontentloaded' })
      await page.locator('#submit-work').waitFor()
    }

    const form = page.locator('#submit-work form[action="/api/lms/submissions"]').nth(index)
    await page.locator('#submit-work').scrollIntoViewIfNeeded()
    await form.locator('textarea[name="content"]').fill(`Workflow audit submission ${index + 1} ${Date.now()}`)
    await form.getByRole('button', { name: /^Submit / }).click()
    await waitForSaved(page, 'student', 'submission')
  }
}

async function exerciseTeacherWorkflows(page: Page) {
  const stamp = Date.now().toString(36)

  await page.locator('#create-assignment').scrollIntoViewIfNeeded()
  await page.locator('#create-assignment input[name="title"]').fill(`Workflow audit assignment ${stamp}`)
  await page.locator('#create-assignment input[name="dueDate"]').fill('2026-12-15T09:00')
  await page.locator('#create-assignment textarea[name="instructions"]').fill('Workflow audit instructions.')
  await page.locator('#create-assignment').getByRole('button', { name: 'Create' }).click()
  await waitForSaved(page, 'teacher', 'assignment')

  await page.locator('#resources').scrollIntoViewIfNeeded()
  await page.locator('#resources input[name="displayName"]').fill(`Workflow audit resource ${stamp}`)
  await page.locator('#resources input[name="file"]').setInputFiles({
    name: `workflow-audit-${stamp}.txt`,
    mimeType: 'text/plain',
    buffer: Buffer.from(`Workflow audit resource ${stamp}`),
  })
  await page.locator('#resources').getByRole('button', { name: 'Upload resource' }).click()
  await waitForSaved(page, 'teacher', 'resource')

  await page.locator('#attendance').scrollIntoViewIfNeeded()
  await page.locator('#attendance input[name="attendanceDate"]').fill('2026-05-07')
  await page.locator('#attendance input[name="notes"]').fill(`Workflow audit attendance ${stamp}`)
  await page.locator('#attendance').getByRole('button', { name: 'Save attendance' }).click()
  await waitForSaved(page, 'teacher', 'attendance')

  await page.locator('#rubrics').scrollIntoViewIfNeeded()
  await page.locator('#rubrics input[name="name"]').fill(`Workflow audit rubric ${stamp}`)
  await page.locator('#rubrics').getByRole('button', { name: 'Save rubric' }).click()
  await waitForSaved(page, 'teacher', 'rubric')

  const gradeForms = page.locator('#grading-queue form[action="/api/lms/grades"]')
  if ((await gradeForms.count()) > 0) {
    const form = gradeForms.first()
    await page.locator('#grading-queue').scrollIntoViewIfNeeded()
    await form.locator('input[name="pointsEarned"]').fill('1')
    await form.locator('input[name="feedback"]').fill(`Workflow audit feedback ${stamp}`)
    await form.getByRole('button', { name: 'Post grade' }).click()
    await waitForSaved(page, 'teacher', 'grade')
  }
}

async function exerciseAdminWorkflows(page: Page) {
  const stamp = Date.now().toString(36)

  await page.locator('#create-course').scrollIntoViewIfNeeded()
  await page.locator('#create-course input[name="name"]').fill(`Workflow audit course ${stamp}`)
  await page.locator('#create-course input[name="subject"]').fill('Operations')
  await page.locator('#create-course input[name="gradeLevel"]').fill('8')
  await page.locator('#create-course textarea[name="description"]').fill('Workflow audit course creation.')
  await page.locator('#create-course').getByRole('button', { name: 'Create course' }).click()
  await waitForSaved(page, 'admin', 'course')

  await page.locator('#enroll-student').scrollIntoViewIfNeeded()
  await page.locator('#enroll-student input[name="notifyStudent"]').check()
  await page.locator('#enroll-student').getByRole('button', { name: 'Enroll student' }).click()
  await waitForSaved(page, 'admin', 'enrollment')

  await page.locator('#roster-import').scrollIntoViewIfNeeded()
  await page
    .locator('#roster-import textarea[name="rosterCsv"]')
    .fill(`email,first_name,last_name,role,grade_level\nworkflow-${stamp}@example.edu,Workflow,Student,student,8`)
  await page.locator('#roster-import').getByRole('button', { name: 'Import roster' }).click()
  await waitForSaved(page, 'admin', 'roster')
}

async function exerciseMutatingWorkflows(page: Page, role: LmsRole) {
  if (role === 'student') {
    await exerciseStudentWorkflows(page)
  }

  if (role === 'teacher') {
    await exerciseTeacherWorkflows(page)
  }

  if (role === 'admin') {
    await exerciseAdminWorkflows(page)
  }
}

async function loginAs(browser: Browser, role: LmsRole, viewport: { width: number; height: number }) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const account = credentials[role]

  await page.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' })
  await page.getByLabel('School email').fill(account.email)
  await page.getByLabel('Password').fill(account.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL(`**/${role}`)
  await page.getByRole('heading', { name: roleHeading(role) }).waitFor()
  if (role === 'student') {
    await page.getByRole('navigation', { name: 'Dashboard tools' }).waitFor()
  } else {
    await page.getByRole('heading', { name: 'Calendar' }).waitFor()
    await page.getByRole('heading', { name: 'Resources' }).waitFor()
    await page.getByRole('heading', { name: 'Messages' }).waitFor()
  }
  await assertRoleSurface(page, role)
  await assertDashboardTools(page, role)
  await assertApiLinks(page)
  await assertNoFrameworkError(page)
  await assertAccessibilitySmoke(page)

  return { context, page }
}

async function main() {
  await mkdir(outputDir, { recursive: true })

  const browser = await chromium.launch()

  try {
    const unauthenticated = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await unauthenticated.goto(`${baseUrl}/student`, { waitUntil: 'domcontentloaded' })
    if (!unauthenticated.url().includes('/login?next=%2Fstudent')) {
      throw new Error(`Expected unauthenticated /student to redirect to login, got ${unauthenticated.url()}`)
    }
    await unauthenticated.getByRole('link', { name: 'Account help' }).click()
    await unauthenticated.waitForURL('**/help')
    await unauthenticated.goto(`${baseUrl}/login`, { waitUntil: 'domcontentloaded' })
    await unauthenticated.screenshot({ path: path.join(outputDir, 'login-desktop.png'), fullPage: true })
    await unauthenticated.close()

    for (const role of roles) {
      const viewport = role === 'student' ? { width: 1440, height: 900 } : { width: 390, height: 844 }
      const session = await loginAs(browser, role, viewport)
      if (runMutatingWorkflowChecks) {
        await exerciseMutatingWorkflows(session.page, role)
      }
      await session.page.screenshot({ path: path.join(outputDir, `${role}.png`), fullPage: true })
      await session.page.getByRole('button', { name: 'Sign out' }).click()
      await session.page.waitForURL('**/login?loggedOut=1')
      await session.context.close()
    }
  } finally {
    await browser.close()
  }

  console.log(`LMS browser smoke checks passed. Screenshots: ${outputDir}`)
}

main().catch((error: unknown) => {
  console.error(error)
  process.exit(1)
})
