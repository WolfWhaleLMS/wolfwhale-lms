'use client'

import { useState, useMemo } from 'react'
import Link from 'next/link'
import { ArrowLeft, Search, Gamepad2 } from 'lucide-react'
import { TOOLS_REGISTRY, type ToolCategory } from '@/lib/tools/registry'
import { ToolCard } from '@/components/tools/ToolCard'
import { ToolCategoryFilter } from '@/components/tools/ToolCategoryFilter'

export default function TeacherToolsPage() {
  const [query, setQuery] = useState('')
  const [category, setCategory] = useState<ToolCategory | 'all'>('all')

  const filtered = useMemo(() => {
    let tools = TOOLS_REGISTRY
    if (category !== 'all') {
      tools = tools.filter((t) => t.category === category)
    }
    if (query.trim()) {
      const q = query.toLowerCase()
      tools = tools.filter(
        (t) =>
          t.name.toLowerCase().includes(q) ||
          t.description.toLowerCase().includes(q) ||
          t.subjectTags.some((tag) => tag.toLowerCase().includes(q))
      )
    }
    return tools
  }, [query, category])

  const available = filtered.filter((t) => t.status === 'available')
  const comingSoon = filtered.filter((t) => t.status === 'coming_soon')

  return (
    <div className="space-y-4 sm:space-y-8 overflow-x-hidden max-w-full">
      <Link
        href="/teacher/dashboard"
        className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Gradient Header Banner */}
      <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-[#00BFFF]/20 via-[#33FF33]/10 to-[#00BFFF]/5 p-4 sm:p-8">
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <div className="flex h-10 w-10 sm:h-12 sm:w-12 shrink-0 items-center justify-center rounded-2xl bg-[#00BFFF]/15">
              <Gamepad2 className="h-5 w-5 sm:h-6 sm:w-6 text-[#00BFFF]" />
            </div>
            <div className="min-w-0">
              <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Tools Library</h1>
              <p className="text-sm sm:text-base text-muted-foreground">Browse educational tools to embed in your lessons</p>
            </div>
          </div>
        </div>
      </div>

      {/* Search + Filter */}
      <div className="space-y-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <input
            type="text"
            placeholder="Search tools by name, subject, or description..."
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            className="w-full rounded-xl border border-border bg-background py-2.5 pl-10 pr-4 text-sm placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-[#00BFFF]/50"
          />
        </div>
        <ToolCategoryFilter activeCategory={category} onCategoryChange={setCategory} />
      </div>

      {/* Available Tools Grid */}
      {available.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-foreground">Available</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {available.map((tool) => (
              <ToolCard key={tool.id} tool={tool} variant="library" />
            ))}
          </div>
        </div>
      )}

      {/* Coming Soon Grid */}
      {comingSoon.length > 0 && (
        <div>
          <h2 className="mb-4 text-lg font-semibold text-muted-foreground">Coming Soon</h2>
          <div className="grid grid-cols-1 gap-4 sm:grid-cols-2 lg:grid-cols-3">
            {comingSoon.map((tool) => (
              <ToolCard key={tool.id} tool={tool} variant="library" />
            ))}
          </div>
        </div>
      )}

      {/* Empty State */}
      {filtered.length === 0 && (
        <div className="py-12 text-center">
          <Gamepad2 className="mx-auto mb-3 h-10 w-10 text-muted-foreground/40" />
          <p className="text-muted-foreground">No tools found matching your search.</p>
        </div>
      )}
    </div>
  )
}
