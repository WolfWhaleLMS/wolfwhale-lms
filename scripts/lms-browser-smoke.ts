import { mkdir } from 'node:fs/promises'
import path from 'node:path'
import { chromium, type Browser, type Page } from '@playwright/test'

const baseUrl = process.env.LMS_SMOKE_BASE_URL ?? 'http://localhost:3000'
const outputDir = path.resolve(process.cwd(), 'test-results/lms-smoke')
const roles = ['student', 'teacher', 'admin', 'guardian'] as const
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

  if (role === 'student' || role === 'guardian') {
    await page.getByRole('heading', { name: 'Gradebook' }).waitFor()
    await page.getByRole('heading', { name: 'Attendance' }).waitFor()
  }
}

async function loginAs(browser: Browser, role: LmsRole, viewport: { width: number; height: number }) {
  const context = await browser.newContext({ viewport })
  const page = await context.newPage()
  const account = credentials[role]

  await page.goto(`${baseUrl}/login`, { waitUntil: 'networkidle' })
  await page.getByLabel('School email').fill(account.email)
  await page.getByLabel('Password').fill(account.password)
  await page.getByRole('button', { name: 'Sign in' }).click()
  await page.waitForURL(`**/${role}`)
  await page.getByRole('heading', { name: roleHeading(role) }).waitFor()
  await page.getByRole('heading', { name: 'Calendar' }).waitFor()
  await page.getByRole('heading', { name: 'Resources' }).waitFor()
  await page.getByRole('heading', { name: 'Messages' }).waitFor()
  await assertRoleSurface(page, role)
  await assertNoFrameworkError(page)
  await assertAccessibilitySmoke(page)

  return { context, page }
}

async function main() {
  await mkdir(outputDir, { recursive: true })

  const browser = await chromium.launch()

  try {
    const unauthenticated = await browser.newPage({ viewport: { width: 1440, height: 900 } })
    await unauthenticated.goto(`${baseUrl}/student`, { waitUntil: 'networkidle' })
    if (!unauthenticated.url().includes('/login?next=%2Fstudent')) {
      throw new Error(`Expected unauthenticated /student to redirect to login, got ${unauthenticated.url()}`)
    }
    await unauthenticated.screenshot({ path: path.join(outputDir, 'login-desktop.png'), fullPage: true })
    await unauthenticated.close()

    for (const role of roles) {
      const viewport = role === 'student' ? { width: 1440, height: 900 } : { width: 390, height: 844 }
      const session = await loginAs(browser, role, viewport)
      await session.page.screenshot({ path: path.join(outputDir, `${role}.png`), fullPage: true })
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
