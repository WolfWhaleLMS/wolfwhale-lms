'use server'

import { z } from 'zod'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { getActionContext } from '@/lib/actions/context'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

export interface SkillTree {
  id: string
  subject: string
  name: string
  description: string | null
  icon: string | null
  status: string
  nodeCount?: number
  completedCount?: number
  totalNodes?: number
}

export interface SkillNode {
  id: string
  name: string
  description: string | null
  icon: string | null
  node_type: string
  xp_reward: number
  position_x: number
  position_y: number
  tier: number
  order_index: number
  status: string
  progress_pct: number
  completed_at: string | null
}

export interface SkillConnection {
  id: string
  from_node_id: string
  to_node_id: string
}

// ---------------------------------------------------------------------------
// Get all skill trees for the current student
// ---------------------------------------------------------------------------

export async function getStudentSkillTrees(): Promise<SkillTree[]> {
  const { supabase, user, tenantId } = await getActionContext()

  // Get all published skill trees for this tenant
  const { data: trees, error } = await supabase
    .from('skill_trees')
    .select('id, subject, name, description, icon, status')
    .eq('tenant_id', tenantId)
    .eq('status', 'published')
    .order('subject')

  if (error) throw error
  if (!trees || trees.length === 0) return []

  // Batch fetch all node counts and progress in two queries instead of N+1
  const treeIds = trees.map((t) => t.id)

  const [nodesResult, progressResult] = await Promise.all([
    supabase
      .from('skill_nodes')
      .select('skill_tree_id, id')
      .in('skill_tree_id', treeIds),
    supabase
      .from('student_skill_progress')
      .select('skill_tree_id, id')
      .eq('student_id', user.id)
      .eq('status', 'completed')
      .in('skill_tree_id', treeIds),
  ])

  // Build count maps
  const nodeCountMap = new Map<string, number>()
  for (const n of nodesResult.data ?? []) {
    nodeCountMap.set(n.skill_tree_id, (nodeCountMap.get(n.skill_tree_id) ?? 0) + 1)
  }

  const progressCountMap = new Map<string, number>()
  for (const p of progressResult.data ?? []) {
    progressCountMap.set(p.skill_tree_id, (progressCountMap.get(p.skill_tree_id) ?? 0) + 1)
  }

  return trees.map((tree) => ({
    ...tree,
    totalNodes: nodeCountMap.get(tree.id) ?? 0,
    completedCount: progressCountMap.get(tree.id) ?? 0,
  }))
}

// ---------------------------------------------------------------------------
// Get a single skill tree with all nodes, connections, and student progress
// ---------------------------------------------------------------------------

export async function getSkillTreeDetail(treeId: string) {
  const parsed = z.object({ treeId: z.string().uuid() }).safeParse({ treeId })
  if (!parsed.success) throw new Error('Invalid input')

  const { supabase, user, tenantId } = await getActionContext()

  // Fetch tree, nodes, connections, and progress in parallel
  const [treeResult, nodesResult, connectionsResult, progressResult] = await Promise.all([
    supabase
      .from('skill_trees')
      .select('*')
      .eq('id', treeId)
      .eq('tenant_id', tenantId)
      .single(),
    supabase
      .from('skill_nodes')
      .select('*')
      .eq('skill_tree_id', treeId)
      .eq('tenant_id', tenantId)
      .order('tier')
      .order('order_index'),
    supabase
      .from('skill_connections')
      .select('*')
      .eq('skill_tree_id', treeId)
      .eq('tenant_id', tenantId),
    supabase
      .from('student_skill_progress')
      .select('*')
      .eq('skill_tree_id', treeId)
      .eq('student_id', user.id)
      .eq('tenant_id', tenantId),
  ])

  if (treeResult.error) throw treeResult.error

  // Merge progress into nodes
  const progressMap = new Map(
    (progressResult.data ?? []).map((p) => [p.node_id, p])
  )

  const nodes: SkillNode[] = (nodesResult.data ?? []).map((node) => {
    const progress = progressMap.get(node.id)
    return {
      id: node.id,
      name: node.name,
      description: node.description,
      icon: node.icon,
      node_type: node.node_type,
      xp_reward: node.xp_reward,
      position_x: node.position_x,
      position_y: node.position_y,
      tier: node.tier,
      order_index: node.order_index,
      status: progress?.status ?? 'locked',
      progress_pct: progress?.progress_pct ?? 0,
      completed_at: progress?.completed_at ?? null,
    }
  })

  const connections: SkillConnection[] = (connectionsResult.data ?? []).map((c) => ({
    id: c.id,
    from_node_id: c.from_node_id,
    to_node_id: c.to_node_id,
  }))

  return {
    tree: treeResult.data,
    nodes,
    connections,
  }
}
