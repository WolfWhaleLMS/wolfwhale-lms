import type { LmsGradeTrend } from '@/lib/lms/types'

export function gradeTrendLabel(trend: LmsGradeTrend) {
  switch (trend) {
    case 'improving':
      return 'Improving'
    case 'declining':
      return 'Declining'
    case 'steady':
      return 'Steady'
    default:
      return 'Needs more grades'
  }
}
