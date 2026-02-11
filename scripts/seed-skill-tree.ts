/**
 * Wolf Whale LMS - Seed Skill Tree Data
 *
 * Populates 3 demo skill trees (Mathematics, Science, English Language Arts)
 * with nodes arranged in a tree/branch layout, connections between parent-child
 * nodes, and student progress data.
 *
 * Prerequisites:
 *   - Run `npx tsx scripts/create-test-accounts.ts` first to ensure demo
 *     accounts and tenant exist.
 *   - Run `npx tsx scripts/seed-demo-data.ts` for full demo environment.
 *   - NEXT_PUBLIC_SUPABASE_URL and SUPABASE_SERVICE_ROLE_KEY in .env.local
 *
 * Usage:
 *   npx tsx scripts/seed-skill-tree.ts
 *
 * Idempotent: deletes existing skill tree data before inserting fresh data.
 */

import { createClient } from '@supabase/supabase-js'
import * as path from 'path'
import * as fs from 'fs'

// ---------------------------------------------------------------------------
// Load environment variables from .env.local
// ---------------------------------------------------------------------------

function loadEnvFile(filePath: string): void {
  if (!fs.existsSync(filePath)) return
  const content = fs.readFileSync(filePath, 'utf-8')
  for (const line of content.split('\n')) {
    const trimmed = line.trim()
    if (!trimmed || trimmed.startsWith('#')) continue
    const eqIndex = trimmed.indexOf('=')
    if (eqIndex === -1) continue
    const key = trimmed.slice(0, eqIndex).trim()
    const value = trimmed.slice(eqIndex + 1).trim()
    if (!process.env[key]) {
      process.env[key] = value
    }
  }
}

loadEnvFile(path.resolve(__dirname, '../.env.local'))

// ---------------------------------------------------------------------------
// Configuration
// ---------------------------------------------------------------------------

const SUPABASE_URL = process.env.NEXT_PUBLIC_SUPABASE_URL
const SUPABASE_SERVICE_KEY = process.env.SUPABASE_SERVICE_ROLE_KEY

if (!SUPABASE_URL) {
  console.error('ERROR: NEXT_PUBLIC_SUPABASE_URL is required.')
  process.exit(1)
}
if (!SUPABASE_SERVICE_KEY) {
  console.error('ERROR: SUPABASE_SERVICE_ROLE_KEY is required.')
  process.exit(1)
}

const supabase = createClient(SUPABASE_URL, SUPABASE_SERVICE_KEY, {
  auth: {
    autoRefreshToken: false,
    persistSession: false,
  },
})

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SkillNodeDef {
  name: string
  description: string
  icon: string
  node_type: 'root' | 'skill' | 'milestone' | 'capstone'
  xp_reward: number
  position_x: number
  position_y: number
  tier: number
  order_index: number
}

interface ConnectionDef {
  from: string  // node name (used as lookup key)
  to: string    // node name (used as lookup key)
}

interface TreeDef {
  subject: string
  name: string
  description: string
  icon: string
  nodes: SkillNodeDef[]
  connections: ConnectionDef[]
}

// ---------------------------------------------------------------------------
// Skill Tree Definitions
// ---------------------------------------------------------------------------

const treeDefs: TreeDef[] = [
  // =========================================================================
  // Tree 1: Mathematics
  // =========================================================================
  {
    subject: 'Mathematics',
    name: 'Mathematics Mastery',
    description: 'Master the foundations of mathematics from arithmetic through algebra and beyond.',
    icon: 'Calculator',
    nodes: [
      // Tier 0 - Root
      { name: 'Mathematics', description: 'The root of all mathematical knowledge', icon: 'Calculator', node_type: 'root', xp_reward: 50, position_x: 400, position_y: 50, tier: 0, order_index: 0 },
      // Tier 1 - Branches
      { name: 'Arithmetic', description: 'Master the four fundamental operations', icon: 'Plus', node_type: 'skill', xp_reward: 30, position_x: 200, position_y: 180, tier: 1, order_index: 0 },
      { name: 'Geometry', description: 'Explore shapes, space, and measurement', icon: 'Triangle', node_type: 'skill', xp_reward: 30, position_x: 400, position_y: 180, tier: 1, order_index: 1 },
      { name: 'Algebra', description: 'Learn to work with variables and equations', icon: 'Variable', node_type: 'skill', xp_reward: 30, position_x: 600, position_y: 180, tier: 1, order_index: 2 },
      // Tier 2 - Sub-branches
      { name: 'Addition & Subtraction', description: 'Adding and subtracting whole numbers, decimals, and fractions', icon: 'Plus', node_type: 'skill', xp_reward: 20, position_x: 100, position_y: 310, tier: 2, order_index: 0 },
      { name: 'Multiplication & Division', description: 'Multiplying and dividing with confidence', icon: 'Grid3X3', node_type: 'skill', xp_reward: 20, position_x: 300, position_y: 310, tier: 2, order_index: 1 },
      { name: 'Shapes & Angles', description: 'Classifying shapes and measuring angles', icon: 'Triangle', node_type: 'skill', xp_reward: 20, position_x: 350, position_y: 310, tier: 2, order_index: 2 },
      { name: 'Area & Perimeter', description: 'Calculating area and perimeter of 2D shapes', icon: 'Ruler', node_type: 'skill', xp_reward: 20, position_x: 450, position_y: 310, tier: 2, order_index: 3 },
      { name: 'Variables', description: 'Understanding and using variables in expressions', icon: 'Variable', node_type: 'skill', xp_reward: 20, position_x: 550, position_y: 310, tier: 2, order_index: 4 },
      { name: 'Equations', description: 'Solving single-variable and multi-step equations', icon: 'FunctionSquare', node_type: 'skill', xp_reward: 20, position_x: 650, position_y: 310, tier: 2, order_index: 5 },
      // Tier 3 - Capstones
      { name: 'Number Theory', description: 'Primes, factors, and the deeper nature of numbers', icon: 'Hash', node_type: 'capstone', xp_reward: 50, position_x: 200, position_y: 440, tier: 3, order_index: 0 },
      { name: 'Trigonometry', description: 'Triangles, sine, cosine, and tangent', icon: 'Pi', node_type: 'capstone', xp_reward: 50, position_x: 400, position_y: 440, tier: 3, order_index: 1 },
      { name: 'Polynomials', description: 'Working with polynomial expressions and factoring', icon: 'FunctionSquare', node_type: 'capstone', xp_reward: 50, position_x: 600, position_y: 440, tier: 3, order_index: 2 },
    ],
    connections: [
      // Root -> Tier 1
      { from: 'Mathematics', to: 'Arithmetic' },
      { from: 'Mathematics', to: 'Geometry' },
      { from: 'Mathematics', to: 'Algebra' },
      // Tier 1 -> Tier 2
      { from: 'Arithmetic', to: 'Addition & Subtraction' },
      { from: 'Arithmetic', to: 'Multiplication & Division' },
      { from: 'Geometry', to: 'Shapes & Angles' },
      { from: 'Geometry', to: 'Area & Perimeter' },
      { from: 'Algebra', to: 'Variables' },
      { from: 'Algebra', to: 'Equations' },
      // Tier 2 -> Tier 3
      { from: 'Addition & Subtraction', to: 'Number Theory' },
      { from: 'Multiplication & Division', to: 'Number Theory' },
      { from: 'Shapes & Angles', to: 'Trigonometry' },
      { from: 'Area & Perimeter', to: 'Trigonometry' },
      { from: 'Variables', to: 'Polynomials' },
      { from: 'Equations', to: 'Polynomials' },
    ],
  },

  // =========================================================================
  // Tree 2: Science
  // =========================================================================
  {
    subject: 'Science',
    name: 'Science Explorer',
    description: 'Explore the natural world through biology, chemistry, and physics.',
    icon: 'FlaskConical',
    nodes: [
      // Tier 0 - Root
      { name: 'Science', description: 'The gateway to understanding the natural world', icon: 'FlaskConical', node_type: 'root', xp_reward: 50, position_x: 400, position_y: 50, tier: 0, order_index: 0 },
      // Tier 1 - Branches
      { name: 'Biology', description: 'The study of living organisms', icon: 'Leaf', node_type: 'skill', xp_reward: 30, position_x: 200, position_y: 180, tier: 1, order_index: 0 },
      { name: 'Chemistry', description: 'The study of matter and its transformations', icon: 'Beaker', node_type: 'skill', xp_reward: 30, position_x: 400, position_y: 180, tier: 1, order_index: 1 },
      { name: 'Physics', description: 'The study of energy, forces, and motion', icon: 'Zap', node_type: 'skill', xp_reward: 30, position_x: 600, position_y: 180, tier: 1, order_index: 2 },
      // Tier 2 - Sub-branches
      { name: 'Cells', description: 'Cell structure, organelles, and cell division', icon: 'Atom', node_type: 'skill', xp_reward: 20, position_x: 100, position_y: 310, tier: 2, order_index: 0 },
      { name: 'Ecosystems', description: 'Food webs, biomes, and ecological relationships', icon: 'Leaf', node_type: 'skill', xp_reward: 20, position_x: 300, position_y: 310, tier: 2, order_index: 1 },
      { name: 'Elements', description: 'The periodic table and element properties', icon: 'Atom', node_type: 'skill', xp_reward: 20, position_x: 350, position_y: 310, tier: 2, order_index: 2 },
      { name: 'Reactions', description: 'Chemical reactions, balancing equations, and reaction types', icon: 'FlaskConical', node_type: 'skill', xp_reward: 20, position_x: 450, position_y: 310, tier: 2, order_index: 3 },
      { name: 'Forces', description: 'Newton\'s laws, gravity, and friction', icon: 'Zap', node_type: 'skill', xp_reward: 20, position_x: 550, position_y: 310, tier: 2, order_index: 4 },
      { name: 'Energy', description: 'Forms of energy, conservation, and transformations', icon: 'Zap', node_type: 'skill', xp_reward: 20, position_x: 650, position_y: 310, tier: 2, order_index: 5 },
      // Tier 3 - Capstones
      { name: 'Genetics', description: 'DNA, heredity, and the blueprint of life', icon: 'Dna', node_type: 'capstone', xp_reward: 50, position_x: 200, position_y: 440, tier: 3, order_index: 0 },
      { name: 'Organic Chemistry', description: 'Carbon compounds and the chemistry of life', icon: 'TestTube', node_type: 'capstone', xp_reward: 50, position_x: 400, position_y: 440, tier: 3, order_index: 1 },
      { name: 'Electromagnetism', description: 'Electricity, magnetism, and electromagnetic waves', icon: 'Magnet', node_type: 'capstone', xp_reward: 50, position_x: 600, position_y: 440, tier: 3, order_index: 2 },
    ],
    connections: [
      // Root -> Tier 1
      { from: 'Science', to: 'Biology' },
      { from: 'Science', to: 'Chemistry' },
      { from: 'Science', to: 'Physics' },
      // Tier 1 -> Tier 2
      { from: 'Biology', to: 'Cells' },
      { from: 'Biology', to: 'Ecosystems' },
      { from: 'Chemistry', to: 'Elements' },
      { from: 'Chemistry', to: 'Reactions' },
      { from: 'Physics', to: 'Forces' },
      { from: 'Physics', to: 'Energy' },
      // Tier 2 -> Tier 3
      { from: 'Cells', to: 'Genetics' },
      { from: 'Ecosystems', to: 'Genetics' },
      { from: 'Elements', to: 'Organic Chemistry' },
      { from: 'Reactions', to: 'Organic Chemistry' },
      { from: 'Forces', to: 'Electromagnetism' },
      { from: 'Energy', to: 'Electromagnetism' },
    ],
  },

  // =========================================================================
  // Tree 3: English Language Arts
  // =========================================================================
  {
    subject: 'English',
    name: 'Language Arts Journey',
    description: 'Develop reading, writing, and grammar skills on the path to mastery.',
    icon: 'BookText',
    nodes: [
      // Tier 0 - Root
      { name: 'English', description: 'The foundation of language arts', icon: 'BookText', node_type: 'root', xp_reward: 50, position_x: 400, position_y: 50, tier: 0, order_index: 0 },
      // Tier 1 - Branches
      { name: 'Reading', description: 'Develop strong reading and comprehension skills', icon: 'BookOpen', node_type: 'skill', xp_reward: 30, position_x: 200, position_y: 180, tier: 1, order_index: 0 },
      { name: 'Writing', description: 'Learn to express ideas clearly through writing', icon: 'PenTool', node_type: 'skill', xp_reward: 30, position_x: 400, position_y: 180, tier: 1, order_index: 1 },
      { name: 'Grammar', description: 'Understand the rules and structure of English', icon: 'Type', node_type: 'skill', xp_reward: 30, position_x: 600, position_y: 180, tier: 1, order_index: 2 },
      // Tier 2 - Sub-branches
      { name: 'Comprehension', description: 'Understanding main ideas, details, and inferences', icon: 'BookOpen', node_type: 'skill', xp_reward: 20, position_x: 100, position_y: 310, tier: 2, order_index: 0 },
      { name: 'Analysis', description: 'Analyzing author\'s purpose, tone, and literary devices', icon: 'FileText', node_type: 'skill', xp_reward: 20, position_x: 300, position_y: 310, tier: 2, order_index: 1 },
      { name: 'Essays', description: 'Structuring and writing persuasive and expository essays', icon: 'FileText', node_type: 'skill', xp_reward: 20, position_x: 350, position_y: 310, tier: 2, order_index: 2 },
      { name: 'Creative Writing', description: 'Short stories, poetry, and imaginative expression', icon: 'Lightbulb', node_type: 'skill', xp_reward: 20, position_x: 450, position_y: 310, tier: 2, order_index: 3 },
      { name: 'Parts of Speech', description: 'Nouns, verbs, adjectives, adverbs, and more', icon: 'AlignLeft', node_type: 'skill', xp_reward: 20, position_x: 550, position_y: 310, tier: 2, order_index: 4 },
      { name: 'Sentence Structure', description: 'Clauses, phrases, and sentence types', icon: 'Quote', node_type: 'skill', xp_reward: 20, position_x: 650, position_y: 310, tier: 2, order_index: 5 },
      // Tier 3 - Capstones
      { name: 'Literary Criticism', description: 'Advanced analysis of literature through critical lenses', icon: 'BookOpen', node_type: 'capstone', xp_reward: 50, position_x: 200, position_y: 440, tier: 3, order_index: 0 },
      { name: 'Research Papers', description: 'Writing well-sourced academic research papers', icon: 'FileText', node_type: 'capstone', xp_reward: 50, position_x: 400, position_y: 440, tier: 3, order_index: 1 },
      { name: 'Advanced Grammar', description: 'Complex syntax, style, and advanced usage', icon: 'Type', node_type: 'capstone', xp_reward: 50, position_x: 600, position_y: 440, tier: 3, order_index: 2 },
    ],
    connections: [
      // Root -> Tier 1
      { from: 'English', to: 'Reading' },
      { from: 'English', to: 'Writing' },
      { from: 'English', to: 'Grammar' },
      // Tier 1 -> Tier 2
      { from: 'Reading', to: 'Comprehension' },
      { from: 'Reading', to: 'Analysis' },
      { from: 'Writing', to: 'Essays' },
      { from: 'Writing', to: 'Creative Writing' },
      { from: 'Grammar', to: 'Parts of Speech' },
      { from: 'Grammar', to: 'Sentence Structure' },
      // Tier 2 -> Tier 3
      { from: 'Comprehension', to: 'Literary Criticism' },
      { from: 'Analysis', to: 'Literary Criticism' },
      { from: 'Essays', to: 'Research Papers' },
      { from: 'Creative Writing', to: 'Research Papers' },
      { from: 'Parts of Speech', to: 'Advanced Grammar' },
      { from: 'Sentence Structure', to: 'Advanced Grammar' },
    ],
  },
]

// ---------------------------------------------------------------------------
// Main
// ---------------------------------------------------------------------------

async function main() {
  console.log('====================================================================')
  console.log('Wolf Whale LMS - Seed Skill Tree Data')
  console.log('====================================================================')
  console.log(`Supabase URL: ${SUPABASE_URL}`)
  console.log('')

  // =========================================================================
  // Step 1: Look up demo users and tenant
  // =========================================================================
  console.log('Step 1: Looking up demo users and tenant...')
  console.log('--------------------------------------------------------------------')

  // Look up tenant
  const { data: tenant, error: tenantError } = await supabase
    .from('tenants')
    .select('id')
    .eq('slug', 'demo')
    .single()

  if (tenantError || !tenant) {
    console.error(`  [ERROR] Could not find tenant with slug 'demo': ${tenantError?.message}`)
    process.exit(1)
  }

  const tenantId = tenant.id
  console.log(`  tenant:  ${tenantId}`)

  // Look up demo users via auth admin
  const { data: usersData, error: usersError } = await supabase.auth.admin.listUsers({ page: 1, perPage: 1000 })
  if (usersError) {
    console.error(`  [ERROR] Failed to list users: ${usersError.message}`)
    process.exit(1)
  }

  const studentUser = usersData.users.find(u => u.email === 'student@wolfwhale.ca')
  const teacherUser = usersData.users.find(u => u.email === 'teacher@wolfwhale.ca')

  if (!studentUser || !teacherUser) {
    console.error('  [ERROR] Could not find demo student/teacher users. Run create-test-accounts.ts first.')
    console.error(`  student: ${studentUser?.id || 'NOT FOUND'}`)
    console.error(`  teacher: ${teacherUser?.id || 'NOT FOUND'}`)
    process.exit(1)
  }

  const studentId = studentUser.id
  const teacherId = teacherUser.id

  console.log(`  student: ${studentId}`)
  console.log(`  teacher: ${teacherId}`)
  console.log('')

  // =========================================================================
  // Step 2: Clean up existing skill tree data
  // =========================================================================
  console.log('Step 2: Cleaning up existing skill tree data...')
  console.log('--------------------------------------------------------------------')

  // Get existing skill trees for this tenant
  const { data: existingTrees } = await supabase
    .from('skill_trees')
    .select('id')
    .eq('tenant_id', tenantId)

  const existingTreeIds = (existingTrees || []).map(t => t.id)

  if (existingTreeIds.length > 0) {
    // Delete in reverse dependency order
    const { error: e1 } = await supabase
      .from('student_skill_progress')
      .delete()
      .in('skill_tree_id', existingTreeIds)
    if (e1) console.warn(`  [WARN] student_skill_progress cleanup: ${e1.message}`)
    else console.log('  [OK] Cleaned up student skill progress')

    const { error: e2 } = await supabase
      .from('skill_connections')
      .delete()
      .in('skill_tree_id', existingTreeIds)
    if (e2) console.warn(`  [WARN] skill_connections cleanup: ${e2.message}`)
    else console.log('  [OK] Cleaned up skill connections')

    const { error: e3 } = await supabase
      .from('skill_nodes')
      .delete()
      .in('skill_tree_id', existingTreeIds)
    if (e3) console.warn(`  [WARN] skill_nodes cleanup: ${e3.message}`)
    else console.log('  [OK] Cleaned up skill nodes')

    const { error: e4 } = await supabase
      .from('skill_trees')
      .delete()
      .in('id', existingTreeIds)
    if (e4) console.warn(`  [WARN] skill_trees cleanup: ${e4.message}`)
    else console.log('  [OK] Cleaned up skill trees')
  } else {
    console.log('  [OK] No existing skill tree data to clean up')
  }

  console.log('')

  // =========================================================================
  // Step 3: Create skill trees, nodes, connections, and progress
  // =========================================================================

  // Counters for summary
  let totalTrees = 0
  let totalNodes = 0
  let totalConnections = 0
  let totalProgress = 0

  for (const treeDef of treeDefs) {
    console.log(`Step 3.${totalTrees + 1}: Creating "${treeDef.name}" skill tree...`)
    console.log('--------------------------------------------------------------------')

    // -----------------------------------------------------------------------
    // 3a. Create the skill tree
    // -----------------------------------------------------------------------
    const { data: tree, error: treeErr } = await supabase
      .from('skill_trees')
      .insert({
        tenant_id: tenantId,
        subject: treeDef.subject,
        name: treeDef.name,
        description: treeDef.description,
        icon: treeDef.icon,
        status: 'published',
        created_by: teacherId,
      })
      .select('id')
      .single()

    if (treeErr || !tree) {
      console.error(`  [ERROR] Failed to create skill tree "${treeDef.name}": ${treeErr?.message}`)
      continue
    }

    const treeId = tree.id
    totalTrees++
    console.log(`  [OK] Created skill tree "${treeDef.name}" => ${treeId}`)

    // -----------------------------------------------------------------------
    // 3b. Create all nodes for this tree
    // -----------------------------------------------------------------------
    const nodeNameToId: Record<string, string> = {}
    const nodeNameToTier: Record<string, number> = {}

    for (const nodeDef of treeDef.nodes) {
      const { data: node, error: nodeErr } = await supabase
        .from('skill_nodes')
        .insert({
          tenant_id: tenantId,
          skill_tree_id: treeId,
          name: nodeDef.name,
          description: nodeDef.description,
          icon: nodeDef.icon,
          node_type: nodeDef.node_type,
          xp_reward: nodeDef.xp_reward,
          position_x: nodeDef.position_x,
          position_y: nodeDef.position_y,
          tier: nodeDef.tier,
          order_index: nodeDef.order_index,
        })
        .select('id')
        .single()

      if (nodeErr || !node) {
        console.error(`  [ERROR] Failed to create node "${nodeDef.name}": ${nodeErr?.message}`)
        continue
      }

      nodeNameToId[nodeDef.name] = node.id
      nodeNameToTier[nodeDef.name] = nodeDef.tier
      totalNodes++
    }

    console.log(`  [OK] Created ${treeDef.nodes.length} nodes`)

    // -----------------------------------------------------------------------
    // 3c. Create connections between nodes
    // -----------------------------------------------------------------------
    let treeConnections = 0

    for (const connDef of treeDef.connections) {
      const fromId = nodeNameToId[connDef.from]
      const toId = nodeNameToId[connDef.to]

      if (!fromId || !toId) {
        console.warn(`  [WARN] Skipping connection "${connDef.from}" -> "${connDef.to}" (node not found)`)
        continue
      }

      const { error: connErr } = await supabase
        .from('skill_connections')
        .insert({
          tenant_id: tenantId,
          skill_tree_id: treeId,
          from_node_id: fromId,
          to_node_id: toId,
        })

      if (connErr) {
        console.error(`  [ERROR] Connection "${connDef.from}" -> "${connDef.to}": ${connErr.message}`)
        continue
      }

      treeConnections++
      totalConnections++
    }

    console.log(`  [OK] Created ${treeConnections} connections`)

    // -----------------------------------------------------------------------
    // 3d. Create student progress
    // -----------------------------------------------------------------------
    //   - Tier 0 (root): completed
    //   - Tier 1: completed
    //   - Tier 2: half completed, half in_progress or available
    //   - Tier 3 (capstones): locked or available
    // -----------------------------------------------------------------------
    let treeProgress = 0
    const now = new Date().toISOString()

    // Separate nodes by tier
    const tier2Nodes = treeDef.nodes.filter(n => n.tier === 2)
    const tier3Nodes = treeDef.nodes.filter(n => n.tier === 3)

    for (const nodeDef of treeDef.nodes) {
      const nodeId = nodeNameToId[nodeDef.name]
      if (!nodeId) continue

      let status: string
      let progressPct: number
      let completedAt: string | null = null

      if (nodeDef.tier === 0) {
        // Root nodes: completed
        status = 'completed'
        progressPct = 100
        completedAt = new Date(Date.now() - 30 * 24 * 60 * 60 * 1000).toISOString()
      } else if (nodeDef.tier === 1) {
        // Tier 1 nodes: completed
        status = 'completed'
        progressPct = 100
        completedAt = new Date(Date.now() - 20 * 24 * 60 * 60 * 1000).toISOString()
      } else if (nodeDef.tier === 2) {
        // Tier 2: first half completed, second half in_progress or available
        const tier2Index = tier2Nodes.indexOf(nodeDef)
        const halfwayPoint = Math.ceil(tier2Nodes.length / 2)
        if (tier2Index < halfwayPoint) {
          status = 'completed'
          progressPct = 100
          completedAt = new Date(Date.now() - 10 * 24 * 60 * 60 * 1000).toISOString()
        } else if (tier2Index % 2 === 0) {
          status = 'in_progress'
          progressPct = 40 + Math.floor(Math.random() * 30) // 40-69%
        } else {
          status = 'available'
          progressPct = 0
        }
      } else {
        // Tier 3 (capstones): locked or available
        const tier3Index = tier3Nodes.indexOf(nodeDef)
        if (tier3Index === 0) {
          // First capstone: available (since its parents in tier 2 are completed)
          status = 'available'
          progressPct = 0
        } else {
          // Other capstones: locked
          status = 'locked'
          progressPct = 0
        }
      }

      const { error: progressErr } = await supabase
        .from('student_skill_progress')
        .insert({
          tenant_id: tenantId,
          student_id: studentId,
          node_id: nodeId,
          skill_tree_id: treeId,
          status,
          progress_pct: progressPct,
          completed_at: completedAt,
        })

      if (progressErr) {
        console.error(`  [ERROR] Progress for "${nodeDef.name}": ${progressErr.message}`)
        continue
      }

      treeProgress++
      totalProgress++
    }

    console.log(`  [OK] Created ${treeProgress} student progress records`)
    console.log('')
  }

  // =========================================================================
  // Summary
  // =========================================================================
  console.log('====================================================================')
  console.log('SKILL TREE SEEDING COMPLETE')
  console.log('====================================================================')
  console.log('')
  console.log('  Data created:')
  console.log(`    - ${totalTrees} skill trees (Mathematics, Science, English)`)
  console.log(`    - ${totalNodes} skill nodes (roots, skills, capstones)`)
  console.log(`    - ${totalConnections} skill connections (parent-child edges)`)
  console.log(`    - ${totalProgress} student progress records`)
  console.log('')
  console.log('  Node layout per tree:')
  console.log('    - Tier 0: 1 root node (top center)')
  console.log('    - Tier 1: 3 branch nodes')
  console.log('    - Tier 2: 6 sub-branch nodes')
  console.log('    - Tier 3: 3 capstone nodes')
  console.log('')
  console.log('  Student progress:')
  console.log('    - Root + Tier 1 nodes: completed (100%)')
  console.log('    - Tier 2 nodes: half completed, half in_progress/available')
  console.log('    - Tier 3 capstones: 1 available, 2 locked per tree')
  console.log('')
  console.log('  Skill trees visible for:')
  console.log('    - student@wolfwhale.ca (progress data)')
  console.log('    - teacher@wolfwhale.ca (creator)')
  console.log('')
  console.log('====================================================================')
  console.log('Done! View skill trees at http://localhost:3000/student/skill-tree')
  console.log('====================================================================')
}

main().catch((err) => {
  console.error('Fatal error:', err)
  process.exit(1)
})
