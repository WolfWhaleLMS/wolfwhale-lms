import Link from 'next/link'
import { BookOpen, GraduationCap, Layers } from 'lucide-react'
import { Progress } from '@/components/ui/progress'
import { Badge } from '@/components/ui/badge'
import type { Textbook } from '@/lib/types/textbook'

interface TextbookCardProps {
  textbook: Textbook
  progressPercentage?: number
  chaptersCompleted?: number
  isAssigned?: boolean
}

const subjectGradients: Record<string, string> = {
  math: 'from-blue-500 to-indigo-600',
  science: 'from-emerald-500 to-teal-600',
  physics: 'from-violet-500 to-purple-600',
  chemistry: 'from-amber-500 to-orange-600',
  biology: 'from-green-500 to-lime-600',
  ela: 'from-rose-500 to-pink-600',
}

const subjectLabels: Record<string, string> = {
  math: 'Math',
  science: 'Science',
  physics: 'Physics',
  chemistry: 'Chemistry',
  biology: 'Biology',
  ela: 'ELA',
}

export function TextbookCard({
  textbook,
  progressPercentage = 0,
  chaptersCompleted = 0,
  isAssigned = false,
}: TextbookCardProps) {
  const gradient = subjectGradients[textbook.subject] || 'from-slate-500 to-slate-600'

  return (
    <Link
      href={`/student/textbooks/${textbook.id}`}
      className="ocean-card group relative overflow-hidden rounded-2xl transition-all hover:scale-[1.02] hover:shadow-xl"
    >
      {/* Progress indicator on top edge */}
      {progressPercentage > 0 && (
        <div className="absolute left-0 right-0 top-0 h-1.5 bg-muted">
          <div
            className={`h-full bg-gradient-to-r ${gradient} transition-all duration-500`}
            style={{ width: `${progressPercentage}%` }}
          />
        </div>
      )}

      {/* Cover / Gradient Header */}
      {textbook.cover_image_url ? (
        <div className="relative h-36 overflow-hidden">
          <img
            src={textbook.cover_image_url}
            alt={textbook.title}
            className="h-full w-full object-cover transition-transform duration-300 group-hover:scale-105"
          />
          <div className="absolute inset-0 bg-gradient-to-t from-black/60 to-transparent" />
          {isAssigned && (
            <Badge className="absolute right-3 top-3" variant="default">
              Assigned to you
            </Badge>
          )}
        </div>
      ) : (
        <div
          className={`relative flex h-36 items-center justify-center bg-gradient-to-br ${gradient} transition-all duration-300 group-hover:brightness-110`}
        >
          <BookOpen className="h-12 w-12 text-white/40" />
          {isAssigned && (
            <Badge className="absolute right-3 top-3 bg-white/20 text-white border-white/30">
              Assigned to you
            </Badge>
          )}
          {/* Decorative circle */}
          <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
        </div>
      )}

      {/* Content */}
      <div className="p-5">
        <h3 className="text-lg font-semibold text-foreground group-hover:text-primary transition-colors line-clamp-2">
          {textbook.title}
        </h3>

        {textbook.description && (
          <p className="mt-1.5 text-sm text-muted-foreground line-clamp-2">
            {textbook.description}
          </p>
        )}

        {/* Meta tags */}
        <div className="mt-3 flex flex-wrap items-center gap-2 text-xs">
          <span className={`inline-flex items-center gap-1 rounded-full bg-gradient-to-r ${gradient} bg-clip-text px-0`}>
            <span
              className={`rounded-full bg-gradient-to-r ${gradient} px-3 py-1 font-medium text-white`}
            >
              {subjectLabels[textbook.subject] || textbook.subject}
            </span>
          </span>
          {textbook.grade_level && (
            <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">
              <GraduationCap className="h-3 w-3" />
              Grade {textbook.grade_level}
            </span>
          )}
          <span className="inline-flex items-center gap-1 rounded-full bg-muted px-3 py-1 font-medium text-muted-foreground">
            <Layers className="h-3 w-3" />
            {textbook.chapter_count} ch.
          </span>
        </div>

        {/* Progress Section (only if started) */}
        {progressPercentage > 0 && (
          <div className="mt-4 space-y-2 border-t border-border pt-3">
            <div className="flex items-center justify-between text-sm">
              <span className="text-muted-foreground">
                {chaptersCompleted} / {textbook.chapter_count} chapters
              </span>
              <span
                className={`font-bold ${
                  progressPercentage === 100
                    ? 'text-green-600 dark:text-green-400'
                    : progressPercentage >= 50
                      ? 'text-blue-600 dark:text-blue-400'
                      : 'text-purple-600 dark:text-purple-400'
                }`}
              >
                {progressPercentage}%
              </span>
            </div>
            <Progress value={progressPercentage} className="h-2" />
          </div>
        )}
      </div>
    </Link>
  )
}
