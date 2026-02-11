import Link from 'next/link'
import { notFound } from 'next/navigation'
import { getSkillTreeDetail } from '@/app/actions/skill-tree'
import { SkillTreeRenderer } from './skill-tree-renderer'
import { ArrowLeft, GitBranch, CheckCircle2, Target } from 'lucide-react'

export default async function SkillTreeDetailPage({
  params,
}: {
  params: Promise<{ treeId: string }>
}) {
  const { treeId } = await params

  let data
  try {
    data = await getSkillTreeDetail(treeId)
  } catch {
    return notFound()
  }

  if (!data?.tree) return notFound()

  const { tree, nodes, connections } = data

  const totalNodes = nodes.length
  const completedNodes = nodes.filter((n) => n.status === 'completed').length
  const completionPct = totalNodes > 0 ? Math.round((completedNodes / totalNodes) * 100) : 0

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex items-center gap-3">
          <Link
            href="/student/skill-tree"
            className="flex items-center gap-1.5 text-sm font-medium text-muted-foreground transition-colors hover:text-foreground"
          >
            <ArrowLeft className="size-4" />
            Back to Skill Trees
          </Link>
        </div>
      </div>

      <div className="whale-gradient rounded-2xl p-8 text-white shadow-lg">
        <div className="flex items-center gap-3 mb-2">
          <GitBranch className="h-8 w-8" />
          <h1 className="text-3xl font-bold tracking-tight">{tree.name}</h1>
        </div>
        {tree.description && (
          <p className="text-white/90 max-w-2xl">{tree.description}</p>
        )}
      </div>

      {/* Stats */}
      <div className="grid grid-cols-1 gap-4 sm:grid-cols-3">
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-xl ring-2 ring-primary/30">
          <div className="mb-2 flex items-center justify-center">
            <GitBranch className="size-8 text-primary group-hover:animate-pulse" />
          </div>
          <p className="text-4xl font-bold text-foreground">{totalNodes}</p>
          <p className="text-sm font-medium text-muted-foreground">Total Nodes</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-xl ring-2 ring-yellow-500/30">
          <div className="mb-2 flex items-center justify-center">
            <CheckCircle2 className="size-8 text-yellow-500 group-hover:animate-float" />
          </div>
          <p className="text-4xl font-bold text-yellow-600 dark:text-yellow-400">
            {completedNodes}
          </p>
          <p className="text-sm font-medium text-muted-foreground">Completed</p>
        </div>
        <div className="ocean-card group rounded-2xl p-5 text-center transition-all hover:scale-105 hover:shadow-xl ring-2 ring-emerald-500/30">
          <div className="mb-2 flex items-center justify-center">
            <Target className="size-8 text-emerald-500 group-hover:rotate-12 transition-transform" />
          </div>
          <p className="text-4xl font-bold text-emerald-600 dark:text-emerald-400">
            {completionPct}%
          </p>
          <p className="text-sm font-medium text-muted-foreground">Progress</p>
        </div>
      </div>

      {/* Skill Tree Visualization */}
      <SkillTreeRenderer
        treeName={tree.name}
        nodes={nodes}
        connections={connections}
      />
    </div>
  )
}
