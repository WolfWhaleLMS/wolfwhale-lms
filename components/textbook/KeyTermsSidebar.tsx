'use client'

import { useState } from 'react'
import { BookOpen, ChevronDown, ChevronUp, X } from 'lucide-react'
import type { KeyTerm } from '@/lib/types/textbook'

interface KeyTermsSidebarProps {
  keyTerms: KeyTerm[]
}

export function KeyTermsSidebar({ keyTerms }: KeyTermsSidebarProps) {
  const [isOpen, setIsOpen] = useState(false)
  const [expandedTerm, setExpandedTerm] = useState<string | null>(null)

  if (!keyTerms || keyTerms.length === 0) return null

  return (
    <>
      {/* Mobile toggle button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        className="fixed bottom-6 right-6 z-40 flex h-14 w-14 items-center justify-center rounded-full bg-primary text-primary-foreground shadow-lg transition-transform hover:scale-105 lg:hidden"
        aria-label="Toggle key terms"
      >
        <BookOpen className="h-6 w-6" />
        <span className="absolute -right-1 -top-1 flex h-5 w-5 items-center justify-center rounded-full bg-amber-500 text-xs font-bold text-white">
          {keyTerms.length}
        </span>
      </button>

      {/* Mobile overlay */}
      {isOpen && (
        <div
          className="fixed inset-0 z-40 bg-black/50 lg:hidden"
          onClick={() => setIsOpen(false)}
        />
      )}

      {/* Sidebar */}
      <aside
        className={`
          fixed bottom-0 right-0 top-0 z-50 w-80 transform overflow-y-auto
          border-l border-border bg-background p-5 shadow-xl transition-transform duration-300
          lg:sticky lg:top-20 lg:z-0 lg:block lg:h-fit lg:max-h-[calc(100vh-6rem)]
          lg:w-72 lg:translate-x-0 lg:rounded-2xl lg:border lg:shadow-none
          ${isOpen ? 'translate-x-0' : 'translate-x-full lg:translate-x-0'}
        `}
      >
        {/* Header */}
        <div className="mb-4 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <BookOpen className="h-5 w-5 text-primary" />
            <h3 className="text-base font-bold text-foreground">Key Terms</h3>
          </div>
          <button
            onClick={() => setIsOpen(false)}
            className="rounded-lg p-1 text-muted-foreground hover:bg-muted lg:hidden"
          >
            <X className="h-5 w-5" />
          </button>
        </div>

        <p className="mb-4 text-xs text-muted-foreground">
          {keyTerms.length} term{keyTerms.length !== 1 ? 's' : ''} in this chapter
        </p>

        {/* Terms list */}
        <div className="space-y-2">
          {keyTerms.map((kt) => {
            const isExpanded = expandedTerm === kt.term
            return (
              <button
                key={kt.term}
                onClick={() =>
                  setExpandedTerm(isExpanded ? null : kt.term)
                }
                className="w-full rounded-xl border border-border p-3 text-left transition-colors hover:bg-muted/50"
              >
                <div className="flex items-center justify-between gap-2">
                  <span className="text-sm font-semibold text-foreground">
                    {kt.term}
                  </span>
                  {isExpanded ? (
                    <ChevronUp className="h-4 w-4 shrink-0 text-muted-foreground" />
                  ) : (
                    <ChevronDown className="h-4 w-4 shrink-0 text-muted-foreground" />
                  )}
                </div>
                {isExpanded && (
                  <p className="mt-2 text-sm leading-relaxed text-muted-foreground">
                    {kt.definition}
                  </p>
                )}
              </button>
            )
          })}
        </div>
      </aside>
    </>
  )
}
