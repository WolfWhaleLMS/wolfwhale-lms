import { existsSync, readFileSync, readdirSync, statSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'

const repoRoot = path.resolve(__dirname, '..')
const appRoot = path.join(repoRoot, 'app')
const sourceRoots = ['app', 'components', 'lib'].map((root) => path.join(repoRoot, root))

function walkFiles(dir: string, extensions: string[], files: string[] = []) {
  for (const entry of readdirSync(dir)) {
    const fullPath = path.join(dir, entry)
    const stat = statSync(fullPath)

    if (stat.isDirectory()) {
      walkFiles(fullPath, extensions, files)
      continue
    }

    if (extensions.some((extension) => fullPath.endsWith(extension))) {
      files.push(fullPath)
    }
  }

  return files
}

function routeExists(routePath: string) {
  const segments = routePath.split('/').filter(Boolean)
  const exactDir = path.join(appRoot, ...segments)

  if (existsSync(path.join(exactDir, 'page.tsx')) || existsSync(path.join(exactDir, 'route.ts'))) {
    return true
  }

  if (segments.length === 0) {
    return existsSync(path.join(appRoot, 'page.tsx'))
  }

  let candidates = [appRoot]
  for (const segment of segments) {
    candidates = candidates.flatMap((candidate) => {
      if (!existsSync(candidate)) return []

      return readdirSync(candidate)
        .filter((entry) => entry === segment || (entry.startsWith('[') && entry.endsWith(']')))
        .map((entry) => path.join(candidate, entry))
        .filter((entryPath) => statSync(entryPath).isDirectory())
    })
  }

  return candidates.some(
    (candidate) => existsSync(path.join(candidate, 'page.tsx')) || existsSync(path.join(candidate, 'route.ts'))
  )
}

function getStaticInternalLinks() {
  const hrefPattern = /href=(?:\{)?["'`]([^"'`{#?:][^"'`]*)["'`](?:\})?/g
  const links = new Set<string>()

  for (const filePath of sourceRoots.flatMap((root) => walkFiles(root, ['.ts', '.tsx']))) {
    const source = readFileSync(filePath, 'utf8')
    let match: RegExpExecArray | null

    while ((match = hrefPattern.exec(source))) {
      const href = match[1]
      if (!href.startsWith('/') || href.includes('${')) continue

      links.add(href.split('#')[0].split('?')[0])
    }
  }

  return [...links].sort()
}

function getConfiguredCronPaths() {
  const vercelConfigPath = path.join(repoRoot, 'vercel.json')
  if (!existsSync(vercelConfigPath)) return []

  const vercelConfig = JSON.parse(readFileSync(vercelConfigPath, 'utf8')) as {
    crons?: Array<{ path?: string }>
  }

  return (vercelConfig.crons ?? []).map((cron) => cron.path).filter((cronPath): cronPath is string => !!cronPath)
}

describe('launch routing', () => {
  it('keeps public internal links pointed at implemented routes', () => {
    const missingRoutes = getStaticInternalLinks().filter((link) => !routeExists(link))

    expect(missingRoutes).toEqual([])
  })

  it('keeps configured Vercel cron paths pointed at implemented route handlers', () => {
    const missingCronRoutes = getConfiguredCronPaths().filter((cronPath) => !routeExists(cronPath))

    expect(missingCronRoutes).toEqual([])
  })

  it('keeps legacy auth and dashboard URLs collapsed into canonical LMS routes', () => {
    const authAlias = readFileSync(path.join(appRoot, 'auth/route.ts'), 'utf8')
    const dashboardAlias = readFileSync(path.join(appRoot, 'dashboard/route.ts'), 'utf8')

    expect(authAlias).toContain("new URL('/login'")
    expect(dashboardAlias).toContain("new URL('/student'")
  })

  it('keeps the root domain on the public landing page with an explicit LMS entry point', () => {
    const rootPage = readFileSync(path.join(appRoot, 'page.tsx'), 'utf8')
    const proxySource = readFileSync(path.join(repoRoot, 'proxy.ts'), 'utf8')

    expect(rootPage).toContain('ww-landing')
    expect(rootPage).not.toContain("new URL('/student'")
    expect(rootPage).not.toContain("redirect('/student'")
    expect(rootPage).toContain('Enter LMS')
    expect(rootPage).toContain('href="/login"')
    expect(rootPage).toContain('What is WolfWhale?')
    expect(rootPage).toContain('Who uses it?')
    expect(rootPage).toContain('What does it do?')
    expect(rootPage).toContain('/cell-architecture/reference/image-gen-hd-cell-model-reference.png')
    expect(proxySource).toContain("matcher: ['/student/:path*', '/teacher/:path*', '/admin/:path*', '/guardian/:path*']")
  })

  it('does not point app navigation at the student dashboard alias', () => {
    expect(getStaticInternalLinks()).not.toContain('/student/dashboard')
  })
})
