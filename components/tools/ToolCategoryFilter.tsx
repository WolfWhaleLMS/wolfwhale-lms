'use client'

import { TOOL_CATEGORIES, type ToolCategory } from '@/lib/tools/registry'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface ToolCategoryFilterProps {
  activeCategory: ToolCategory | 'all'
  onCategoryChange: (category: ToolCategory | 'all') => void
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function ToolCategoryFilter({
  activeCategory,
  onCategoryChange,
}: ToolCategoryFilterProps) {
  return (
    <div className="flex flex-wrap gap-2">
      {TOOL_CATEGORIES.map((cat) => (
        <button
          key={cat.value}
          onClick={() => onCategoryChange(cat.value)}
          className={`rounded-full px-4 py-1.5 text-sm font-medium transition-all ${
            activeCategory === cat.value
              ? 'bg-[#00BFFF] text-white shadow-md'
              : 'bg-muted text-muted-foreground hover:bg-muted/80'
          }`}
        >
          {cat.label}
        </button>
      ))}
    </div>
  )
}
