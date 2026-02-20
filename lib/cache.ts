import { unstable_cache } from 'next/cache'

export function cachedQuery<T>(
  fn: () => Promise<T>,
  keyParts: string[],
  opts?: { revalidate?: number; tags?: string[] }
): Promise<T> {
  return unstable_cache(fn, keyParts, {
    revalidate: opts?.revalidate ?? 60,
    tags: opts?.tags ?? keyParts,
  })()
}
