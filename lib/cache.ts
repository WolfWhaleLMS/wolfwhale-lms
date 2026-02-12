import { unstable_cache } from 'next/cache'

/**
 * Cache wrapper for expensive database queries.
 * Uses Next.js unstable_cache for request deduplication and time-based revalidation.
 */
export function cachedQuery<T>(
  fn: (...args: string[]) => Promise<T>,
  keyParts: string[],
  options: { revalidate?: number; tags?: string[] } = {}
): (...args: string[]) => Promise<T> {
  return unstable_cache(fn, keyParts, {
    revalidate: options.revalidate ?? 60,
    tags: options.tags,
  })
}

/**
 * Cache durations for different data types
 */
export const CACHE_TTL = {
  /** Static data that rarely changes (plaza rooms, achievements, game definitions) */
  STATIC: 300,
  /** Dashboard stats, aggregated data */
  STATS: 60,
  /** User-specific frequently accessed data */
  USER_DATA: 30,
  /** Short-lived cache for rapidly changing data */
  REALTIME: 10,
} as const
