'use server'

import { z } from 'zod'
import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'

async function getContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  return { supabase, user, tenantId }
}

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
  const { supabase, user, tenantId } = await getContext()

  // Get all published skill trees for this tenant
  const { data: trees, error } = await supabase
    .from('skill_trees')
    .select('id, subject, name, description, icon, status')
    .eq('tenant_id', tenantId)
    .eq('status', 'published')
    .order('subject')

  if (error) throw error
  if (!trees || trees.length === 0) return []

  // Get node counts and student progress for each tree
  const treesWithProgress = await Promise.all(
    trees.map(async (tree) => {
      const [nodesResult, progressResult] = await Promise.all([
        supabase
          .from('skill_nodes')
          .select('id', { count: 'exact' })
          .eq('skill_tree_id', tree.id),
        supabase
          .from('student_skill_progress')
          .select('id', { count: 'exact' })
          .eq('skill_tree_id', tree.id)
          .eq('student_id', user.id)
          .eq('status', 'completed'),
      ])

      return {
        ...tree,
        totalNodes: nodesResult.count ?? 0,
        completedCount: progressResult.count ?? 0,
      }
    })
  )

  return treesWithProgress
}

// ---------------------------------------------------------------------------
// Get a single skill tree with all nodes, connections, and student progress
// ---------------------------------------------------------------------------

export async function getSkillTreeDetail(treeId: string) {
  const parsed = z.object({ treeId: z.string().uuid() }).safeParse({ treeId })
  if (!parsed.success) throw new Error('Invalid input')

  const { supabase, user, tenantId } = await getContext()

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
