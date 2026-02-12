import Link from 'next/link'
import { getStudentSkillTrees } from '@/app/actions/skill-tree'
import {
  TreePine,
  Calculator,
  FlaskConical,
  BookText,
  Globe,
  Landmark,
  Code2,
  Palette,
  Music,
  Languages,
  Dumbbell,
  Sparkles,
  ArrowRight,
  Trophy,
} from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

export const metadata = {
  title: 'Skill Trees | Wolf Whale LMS',
}

const SUBJECT_ICON_MAP: Record<string, LucideIcon> = {
  Mathematics: Calculator,
  Math: Calculator,
  Science: FlaskConical,
  'English Language Arts': BookText,
  English: BookText,
  ELA: BookText,
  'Social Studies': Globe,
  History: Landmark,
  'Computer Science': Code2,
  Art: Palette,
  Music: Music,
  French: Languages,
  Spanish: Languages,
  'Physical Education': Dumbbell,
}

function getSubjectIcon(subject: string): LucideIcon {
  return SUBJECT_ICON_MAP[subject] ?? Sparkles
}

export default async function SkillTreePage() {
  let trees: Awaited<ReturnType<typeof getStudentSkillTrees>> = []
  let error: string | null = null

  try {
    trees = await getStudentSkillTrees()
  } catch (e) {
    error = e instanceof Error ? e.message : 'Failed to load skill trees'
  }

  const totalNodes = trees.reduce((sum, t) => sum + (t.totalNodes ?? 0), 0)
  const totalCompleted = trees.reduce((sum, t) => sum + (t.completedCount ?? 0), 0)
  const overallPct = totalNodes > 0 ? Math.round((totalCompleted / totalNodes) * 100) : 0

  return (
    <div className="space-y-8">
      {/* Header Banner */}
      <div
        className="relative overflow-hidden rounded-2xl p-8 text-white shadow-lg"
        style={{
          background: 'linear-gradient(135deg, #0A2540 0%, #00BFFF 50%, #0A2540 100%)',
        }}
      >
        {/* Decorative gradient overlay for neon student accent */}
        <div className="absolute inset-0 bg-gradient-to-r from-[#00BFFF]/20 via-[#33FF33]/10 to-[#00FFFF]/20" />
        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <TreePine className="h-8 w-8" />
            <h1 className="text-3xl font-bold tracking-tight">Skill Trees</h1>
          </div>
          <p className="text-white/90 max-w-2xl">
            Master skills across your subjects. Each tree maps out the knowledge
            you need -- complete nodes to unlock new abilities and track your growth.
          </p>
          {trees.length > 0 && (
            <div className="mt-5 flex flex-wrap items-center gap-4">
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <span className="text-2xl">{trees.length}</span>
                <span>Skill Tree{trees.length !== 1 ? 's' : ''}</span>
              </div>
              <div className="inline-flex items-center gap-2 rounded-full bg-white/15 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
                <Trophy className="h-4 w-4" />
                <span>{overallPct}% Overall Progress</span>
              </div>
            </div>
          )}
        </div>
      </div>

      {/* Error state */}
      {error && (
        <div className="ocean-card rounded-2xl p-6 text-center text-red-500">
          {error}
        </div>
      )}

      {/* Empty state */}
      {trees.length === 0 && !error && (
        <div className="ocean-card relative overflow-hidden rounded-2xl py-20 text-center">
          <div className="blob-ocean absolute left-1/4 top-0 h-64 w-64 opacity-30" />
          <div className="blob-teal absolute bottom-0 right-1/4 h-64 w-64 opacity-30" />
          <div className="relative z-10 flex flex-col items-center justify-center">
            <TreePine className="mb-4 h-16 w-16 text-primary/40" />
            <h3 className="text-xl font-bold text-foreground">
              No Skill Trees Yet
            </h3>
            <p className="mt-2 max-w-sm text-sm text-muted-foreground">
              Your teachers haven&apos;t published any skill trees yet. Check back
              soon -- new learning paths are on the way!
            </p>
          </div>
        </div>
      )}

      {/* Skill Tree Grid */}
      {trees.length > 0 && (
        <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 xl:grid-cols-3">
          {trees.map((tree) => {
            const Icon = getSubjectIcon(tree.subject)
            const total = tree.totalNodes ?? 0
            const completed = tree.completedCount ?? 0
            const pct = total > 0 ? Math.round((completed / total) * 100) : 0
            const isComplete = pct === 100 && total > 0

            const progressColor = isComplete
              ? 'from-[#33FF33] to-[#00FFFF]'
              : pct >= 70
                ? 'from-[#00BFFF] to-[#33FF33]'
                : pct >= 40
                  ? 'from-[#00BFFF] to-[#00FFFF]'
                  : 'from-[#00BFFF] to-[#00FFFF]'

            return (
              <div
                key={tree.id}
                className="ocean-card group relative overflow-hidden rounded-2xl p-6 transition-all hover:scale-[1.02] hover:shadow-xl"
              >
                {/* Progress indicator on top edge */}
                <div className="absolute left-0 right-0 top-0 h-1.5 bg-muted">
                  <div
                    className={`h-full bg-gradient-to-r transition-all duration-500 ${progressColor}`}
                    style={{ width: `${pct}%` }}
                  />
                </div>

                {/* Icon and subject badge */}
                <div className="mb-4 flex items-start justify-between">
                  <div
                    className="flex h-12 w-12 items-center justify-center rounded-xl"
                    style={{
                      background:
                        'linear-gradient(135deg, rgba(0,191,255,0.15), rgba(51,255,51,0.15))',
                    }}
                  >
                    <Icon className="h-6 w-6 text-[#00BFFF] dark:text-[#00BFFF]" />
                  </div>
                  {isComplete && (
                    <div className="flex h-8 w-8 items-center justify-center rounded-full bg-[#33FF33]/10 dark:bg-[#33FF33]/15">
                      <Trophy className="h-4 w-4 text-[#059669] dark:text-[#059669]" />
                    </div>
                  )}
                </div>

                {/* Subject pill */}
                <div className="mb-3">
                  <span className="inline-block rounded-full bg-gradient-to-r from-[#00BFFF]/15 to-[#33FF33]/15 px-3 py-1 text-xs font-medium text-[#00BFFF] dark:text-[#00BFFF]">
                    {tree.subject}
                  </span>
                </div>

                {/* Tree name and description */}
                <h3 className="text-lg font-semibold text-foreground group-hover:text-[#00BFFF] dark:group-hover:text-[#00BFFF] transition-colors line-clamp-1">
                  {tree.name}
                </h3>
                {tree.description && (
                  <p className="mt-1 text-sm text-muted-foreground line-clamp-2">
                    {tree.description}
                  </p>
                )}

                {/* Progress section */}
                <div className="mt-5 space-y-3 border-t border-border pt-4">
                  <div className="flex items-center justify-between text-sm">
                    <span className="text-muted-foreground">
                      {completed} / {total} skills
                    </span>
                    <span
                      className={`font-bold ${
                        isComplete
                          ? 'text-[#059669] dark:text-[#059669]'
                          : pct >= 70
                            ? 'text-[#00BFFF] dark:text-[#00BFFF]'
                            : pct >= 40
                              ? 'text-[#00BFFF] dark:text-[#00BFFF]'
                              : 'text-[#00BFFF] dark:text-[#00BFFF]'
                      }`}
                    >
                      {pct}%
                    </span>
                  </div>
                  <div className="relative h-3 overflow-hidden rounded-full bg-muted">
                    <div
                      className={`h-full rounded-full bg-gradient-to-r transition-all duration-500 shadow-md ${progressColor}`}
                      style={{ width: `${pct}%` }}
                    />
                  </div>
                </div>

                {/* View Tree link */}
                <Link
                  href={`/student/skill-tree/${tree.id}`}
                  className="mt-4 inline-flex items-center gap-1.5 text-sm font-medium text-[#00BFFF] transition-colors hover:text-[#00BFFF]/80 dark:text-[#00BFFF] dark:hover:text-[#00BFFF]/80"
                >
                  View Tree
                  <ArrowRight className="h-4 w-4 transition-transform group-hover:translate-x-0.5" />
                </Link>
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}
