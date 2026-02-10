'use client'

import { useState } from 'react'
import { ChevronRight, ChevronDown, FolderOpen, BookOpen } from 'lucide-react'

interface Lesson {
  id: string
  title: string
  description: string | null
  order_index: number
  status: string
  duration_minutes: number | null
  module_id: string | null
}

interface Module {
  id: string
  title: string
  description: string | null
  order_index: number
  status: string
}

interface ModuleListProps {
  modules: Module[]
  lessons: Lesson[]
}

export function ModuleList({ modules, lessons }: ModuleListProps) {
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map((m) => m.id))
  )

  const toggleModule = (moduleId: string) => {
    setExpandedModules((prev) => {
      const next = new Set(prev)
      if (next.has(moduleId)) {
        next.delete(moduleId)
      } else {
        next.add(moduleId)
      }
      return next
    })
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-blue-100 text-blue-700 dark:bg-blue-900/30 dark:text-blue-400'
      case 'draft':
        return 'bg-amber-100 text-amber-700 dark:bg-amber-900/30 dark:text-amber-400'
      case 'archived':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  // Group lessons by module
  const uncategorizedLessons = lessons.filter((l) => !l.module_id)

  return (
    <div className="space-y-3">
      {/* Modules with lessons */}
      {modules.map((module, moduleIndex) => {
        const moduleLessons = lessons.filter((l) => l.module_id === module.id)
        const isExpanded = expandedModules.has(module.id)

        return (
          <div
            key={module.id}
            className="ocean-card rounded-xl overflow-hidden border border-border"
          >
            {/* Module Header */}
            <button
              onClick={() => toggleModule(module.id)}
              className="w-full flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors text-left"
            >
              <div className="flex items-center gap-2 flex-1 min-w-0">
                {isExpanded ? (
                  <ChevronDown className="h-5 w-5 text-muted-foreground shrink-0" />
                ) : (
                  <ChevronRight className="h-5 w-5 text-muted-foreground shrink-0" />
                )}
                <FolderOpen className="h-5 w-5 text-primary shrink-0" />
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h3 className="font-semibold text-foreground truncate">
                      {module.title}
                    </h3>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor(module.status)}`}
                    >
                      {module.status}
                    </span>
                  </div>
                  {module.description && (
                    <p className="text-sm text-muted-foreground mt-0.5 truncate">
                      {module.description}
                    </p>
                  )}
                </div>
              </div>
              <div className="flex items-center gap-3 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {moduleLessons.length} lesson{moduleLessons.length !== 1 ? 's' : ''}
                </span>
              </div>
            </button>

            {/* Module Lessons */}
            {isExpanded && moduleLessons.length > 0 && (
              <div className="border-t border-border bg-muted/20">
                {moduleLessons.map((lesson, lessonIndex) => (
                  <div
                    key={lesson.id}
                    className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
                  >
                    <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                      {lessonIndex + 1}
                    </div>
                    <div className="flex-1 min-w-0">
                      <div className="flex items-center gap-2">
                        <h4 className="font-medium text-foreground text-sm truncate">
                          {lesson.title}
                        </h4>
                        <span
                          className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor(lesson.status)}`}
                        >
                          {lesson.status}
                        </span>
                      </div>
                      {lesson.description && (
                        <p className="mt-0.5 text-xs text-muted-foreground truncate">
                          {lesson.description}
                        </p>
                      )}
                    </div>
                    {lesson.duration_minutes && (
                      <span className="shrink-0 text-xs text-muted-foreground">
                        {lesson.duration_minutes} min
                      </span>
                    )}
                  </div>
                ))}
              </div>
            )}

            {/* Empty state for module with no lessons */}
            {isExpanded && moduleLessons.length === 0 && (
              <div className="border-t border-border bg-muted/20 p-8 text-center">
                <BookOpen className="mx-auto h-8 w-8 text-muted-foreground/40 mb-2" />
                <p className="text-sm text-muted-foreground">
                  No lessons in this module yet
                </p>
              </div>
            )}
          </div>
        )
      })}

      {/* Uncategorized Lessons */}
      {uncategorizedLessons.length > 0 && (
        <div className="ocean-card rounded-xl overflow-hidden border border-border border-dashed">
          <div className="p-4 bg-muted/10">
            <div className="flex items-center gap-2">
              <BookOpen className="h-5 w-5 text-muted-foreground" />
              <h3 className="font-semibold text-foreground">
                Uncategorized Lessons
              </h3>
              <span className="text-xs text-muted-foreground">
                ({uncategorizedLessons.length})
              </span>
            </div>
            <p className="text-xs text-muted-foreground mt-1">
              Lessons not assigned to any module
            </p>
          </div>
          <div className="border-t border-border">
            {uncategorizedLessons.map((lesson, index) => (
              <div
                key={lesson.id}
                className="flex items-center gap-4 p-4 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors"
              >
                <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
                  {index + 1}
                </div>
                <div className="flex-1 min-w-0">
                  <div className="flex items-center gap-2">
                    <h4 className="font-medium text-foreground text-sm truncate">
                      {lesson.title}
                    </h4>
                    <span
                      className={`inline-flex shrink-0 items-center rounded-full px-2 py-0.5 text-[10px] font-medium ${statusColor(lesson.status)}`}
                    >
                      {lesson.status}
                    </span>
                  </div>
                  {lesson.description && (
                    <p className="mt-0.5 text-xs text-muted-foreground truncate">
                      {lesson.description}
                    </p>
                  )}
                </div>
                {lesson.duration_minutes && (
                  <span className="shrink-0 text-xs text-muted-foreground">
                    {lesson.duration_minutes} min
                  </span>
                )}
              </div>
            ))}
          </div>
        </div>
      )}

      {/* Empty state - no modules and no lessons */}
      {modules.length === 0 && lessons.length === 0 && (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <FolderOpen className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-foreground">
            No modules or lessons yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Start organizing your course by creating modules and adding lessons.
          </p>
        </div>
      )}
    </div>
  )
}
