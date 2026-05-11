import type { LmsResourceSummary } from '@/lib/lms/types'

const defaultTenantQuotaBytes = 10 * 1024 * 1024 * 1024
const reviewStatuses = new Set(['blocked', 'error', 'pending', 'unreviewed'])
const statusPriority = new Map([
  ['blocked', 0],
  ['error', 1],
  ['pending', 2],
  ['unreviewed', 3],
])

export function buildResourceReviewSummary(
  resources: LmsResourceSummary[],
  options: { tenantQuotaBytes?: number } = {}
) {
  const tenantQuotaBytes = options.tenantQuotaBytes && options.tenantQuotaBytes > 0 ? options.tenantQuotaBytes : defaultTenantQuotaBytes
  const usedBytes = resources.reduce((total, resource) => total + Math.max(0, resource.fileSize || 0), 0)
  const queue = resources
    .filter((resource) => reviewStatuses.has(resource.scanStatus))
    .sort((left, right) => {
      const priorityDelta = (statusPriority.get(left.scanStatus) ?? 99) - (statusPriority.get(right.scanStatus) ?? 99)
      if (priorityDelta !== 0) return priorityDelta

      return left.title.localeCompare(right.title)
    })

  return {
    totalResources: resources.length,
    needsReview: queue.length,
    quarantined: resources.filter((resource) => resource.scanStatus === 'blocked').length,
    legalHolds: resources.filter((resource) => resource.legalHold).length,
    usedBytes,
    tenantQuotaBytes,
    quotaPercent: tenantQuotaBytes > 0 ? Math.min(100, Math.round((usedBytes / tenantQuotaBytes) * 100)) : 0,
    queue,
  }
}

export function formatResourceBytes(value: number) {
  const safeValue = Number.isFinite(value) ? Math.max(0, value) : 0
  if (safeValue >= 1024 * 1024 * 1024) return `${(safeValue / 1024 / 1024 / 1024).toFixed(2)} GB`
  if (safeValue >= 1024 * 1024) return `${(safeValue / 1024 / 1024).toFixed(2)} MB`
  if (safeValue >= 1024) return `${(safeValue / 1024).toFixed(2)} KB`

  return `${safeValue} B`
}
