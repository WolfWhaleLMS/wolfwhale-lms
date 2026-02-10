'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { cn } from '@/lib/utils'

const CATEGORY_LABELS: Record<string, string> = {
  all: 'All',
  academic: 'Academic',
  consistency: 'Consistency',
  participation: 'Participation',
  challenge: 'Challenge',
  social: 'Social',
  wellness: 'Wellness',
}

const CATEGORY_ICONS: Record<string, string> = {
  all: '\u{1F3C6}',
  academic: '\u{1F4DA}',
  consistency: '\u{1F525}',
  participation: '\u{1F4AC}',
  challenge: '\u{26A1}',
  social: '\u{1F91D}',
  wellness: '\u{1F9D8}',
}

interface AchievementFiltersProps {
  categories: string[]
  activeCategory: string
}

export function AchievementFilters({
  categories,
  activeCategory,
}: AchievementFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  function handleSelect(category: string) {
    const params = new URLSearchParams(searchParams.toString())
    if (category === 'all') {
      params.delete('category')
    } else {
      params.set('category', category)
    }
    router.push(`/student/achievements?${params.toString()}`)
  }

  const allCategories = ['all', ...categories]

  return (
    <div className="flex flex-wrap gap-2">
      {allCategories.map((category) => (
        <button
          key={category}
          onClick={() => handleSelect(category)}
          className={cn(
            'inline-flex items-center gap-1.5 rounded-xl px-4 py-2 text-sm font-medium transition-all duration-200',
            activeCategory === category
              ? 'bg-primary text-primary-foreground shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80 hover:text-foreground'
          )}
        >
          <span>{CATEGORY_ICONS[category] ?? ''}</span>
          {CATEGORY_LABELS[category] ?? category}
        </button>
      ))}
    </div>
  )
}
