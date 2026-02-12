'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { deleteModule } from '@/app/actions/modules'
import { deleteLesson } from '@/app/actions/lessons'
import {
  ChevronRight,
  ChevronDown,
  FolderOpen,
  BookOpen,
  Pencil,
  Trash2,
  Clock,
  GripVertical,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

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
  courseId: string
}

export function ModuleList({ modules, lessons, courseId }: ModuleListProps) {
  const router = useRouter()
  const [expandedModules, setExpandedModules] = useState<Set<string>>(
    new Set(modules.map((m) => m.id))
  )
  const [deletingModule, setDeletingModule] = useState<string | null>(null)
  const [deletingLesson, setDeletingLesson] = useState<string | null>(null)

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

  async function handleDeleteModule(moduleId: string, title: string) {
    if (!confirm(`Delete module "${title}"? Lessons in this module will become uncategorized.`)) return
    setDeletingModule(moduleId)
    const result = await deleteModule(moduleId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Module deleted')
      router.refresh()
    }
    setDeletingModule(null)
  }

  async function handleDeleteLesson(lessonId: string, title: string) {
    if (!confirm(`Delete lesson "${title}"? This cannot be undone.`)) return
    setDeletingLesson(lessonId)
    const result = await deleteLesson(lessonId)
    if (result.error) {
      toast.error(result.error)
    } else {
      toast.success('Lesson deleted')
      router.refresh()
    }
    setDeletingLesson(null)
  }

  const statusColor = (status: string) => {
    switch (status) {
      case 'published':
        return 'bg-[#00BFFF]/10 text-[#00BFFF] dark:bg-[#00BFFF]/10 dark:text-[#00BFFF]'
      case 'draft':
        return 'bg-[#FFAA00]/10 text-[#D97706] dark:bg-[#FFAA00]/10 dark:text-[#D97706]'
      case 'archived':
        return 'bg-gray-100 text-gray-700 dark:bg-gray-900/30 dark:text-gray-400'
      default:
        return 'bg-gray-100 text-gray-700'
    }
  }

  const uncategorizedLessons = lessons.filter((l) => !l.module_id)

  function LessonRow({ lesson, index }: { lesson: Lesson; index: number }) {
    return (
      <div className="flex items-center gap-3 p-3 border-b border-border last:border-b-0 hover:bg-muted/30 transition-colors group">
        <GripVertical className="h-4 w-4 text-muted-foreground/40 shrink-0" />
        <div className="flex h-7 w-7 shrink-0 items-center justify-center rounded-lg bg-primary/10 text-xs font-bold text-primary">
          {index + 1}
        </div>
        <Link
          href={`/teacher/courses/${courseId}/lessons/${lesson.id}/edit`}
          className="flex-1 min-w-0 group/link"
        >
          <div className="flex items-center gap-2">
            <h4 className="font-medium text-foreground text-sm truncate group-hover/link:text-primary transition-colors">
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
        </Link>
        {lesson.duration_minutes && (
          <span className="shrink-0 flex items-center gap-1 text-xs text-muted-foreground">
            <Clock className="h-3 w-3" />
            {lesson.duration_minutes}m
          </span>
        )}
        <div className="flex items-center gap-1 shrink-0 opacity-0 group-hover:opacity-100 transition-opacity">
          <Link href={`/teacher/courses/${courseId}/lessons/${lesson.id}/edit`}>
            <Button variant="ghost" size="sm" className="h-7 w-7 p-0">
              <Pencil className="h-3.5 w-3.5" />
            </Button>
          </Link>
          <Button
            variant="ghost"
            size="sm"
            className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30"
            onClick={() => handleDeleteLesson(lesson.id, lesson.title)}
            disabled={deletingLesson === lesson.id}
          >
            <Trash2 className="h-3.5 w-3.5" />
          </Button>
        </div>
      </div>
    )
  }

  return (
    <div className="space-y-3">
      {modules.map((module) => {
        const moduleLessons = lessons.filter((l) => l.module_id === module.id)
        const isExpanded = expandedModules.has(module.id)

        return (
          <div
            key={module.id}
            className="ocean-card rounded-xl overflow-hidden border border-border"
          >
            {/* Module Header */}
            <div className="flex items-center gap-3 p-4 hover:bg-muted/30 transition-colors group">
              <button
                onClick={() => toggleModule(module.id)}
                className="flex items-center gap-2 flex-1 min-w-0 text-left"
              >
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
              </button>
              <div className="flex items-center gap-2 shrink-0">
                <span className="text-xs text-muted-foreground">
                  {moduleLessons.length} lesson
                  {moduleLessons.length !== 1 ? 's' : ''}
                </span>
                <Button
                  variant="ghost"
                  size="sm"
                  className="h-7 w-7 p-0 text-red-600 hover:text-red-700 hover:bg-red-50 dark:hover:bg-red-950/30 opacity-0 group-hover:opacity-100 transition-opacity"
                  onClick={() => handleDeleteModule(module.id, module.title)}
                  disabled={deletingModule === module.id}
                >
                  <Trash2 className="h-3.5 w-3.5" />
                </Button>
              </div>
            </div>

            {/* Module Lessons */}
            {isExpanded && moduleLessons.length > 0 && (
              <div className="border-t border-border bg-muted/20">
                {moduleLessons.map((lesson, index) => (
                  <LessonRow key={lesson.id} lesson={lesson} index={index} />
                ))}
              </div>
            )}

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
              Lessons not assigned to any module — click to edit
            </p>
          </div>
          <div className="border-t border-border">
            {uncategorizedLessons.map((lesson, index) => (
              <LessonRow key={lesson.id} lesson={lesson} index={index} />
            ))}
          </div>
        </div>
      )}

      {/* Empty state */}
      {modules.length === 0 && lessons.length === 0 && (
        <div className="ocean-card flex flex-col items-center justify-center rounded-2xl py-16 text-center">
          <FolderOpen className="mb-3 h-12 w-12 text-muted-foreground/40" />
          <h3 className="text-lg font-semibold text-foreground">
            No modules or lessons yet
          </h3>
          <p className="mt-1 max-w-sm text-sm text-muted-foreground">
            Start organizing your course by creating modules and adding lessons.
            Use &quot;Create Module&quot; to organize content into sections, then &quot;Add
            Lesson&quot; to create individual lessons.
          </p>
        </div>
      )}
    </div>
  )
}
