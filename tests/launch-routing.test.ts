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
})
