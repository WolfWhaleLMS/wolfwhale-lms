'use client'

import dynamic from 'next/dynamic'

const SkillTreeRenderer = dynamic(
  () => import('./skill-tree-renderer').then((mod) => mod.SkillTreeRenderer),
  {
    ssr: false,
    loading: () => (
      <div className="flex items-center justify-center min-h-[60vh]">
        <div className="h-10 w-10 animate-spin rounded-full border-4 border-primary/30 border-t-primary" />
      </div>
    ),
  }
)

export function SkillTreeClient(props: {
  treeName: string
  nodes: any[]
  connections: any[]
}) {
  return <SkillTreeRenderer {...props} />
}
