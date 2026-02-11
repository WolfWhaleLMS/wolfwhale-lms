'use client'

import { useState, useRef, useCallback, useEffect, useMemo } from 'react'
import { motion, AnimatePresence } from 'framer-motion'

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface SkillNode {
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

interface SkillConnection {
  id: string
  from_node_id: string
  to_node_id: string
}

interface Props {
  treeName: string
  nodes: SkillNode[]
  connections: SkillConnection[]
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const STATUS_COLORS: Record<string, string> = {
  completed: '#0a4d68',
  in_progress: '#7c3aed',
  available: '#64748b',
  locked: '#334155',
}

const STATUS_LABELS: Record<string, string> = {
  completed: 'Completed',
  in_progress: 'In Progress',
  available: 'Available',
  locked: 'Locked',
}

const NODE_RADIUS: Record<string, number> = {
  root: 40,
  skill: 30,
  milestone: 35,
  capstone: 40,
}

const TIER_VERTICAL_SPACING = 160
const SVG_PADDING = 100

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function getNodeRadius(nodeType: string): number {
  return NODE_RADIUS[nodeType] ?? 30
}

function getNodeInitials(name: string): string {
  return name
    .split(/\s+/)
    .slice(0, 2)
    .map((w) => w[0]?.toUpperCase() ?? '')
    .join('')
}

function getNodeIcon(node: SkillNode): string {
  if (node.icon) return node.icon
  if (node.node_type === 'root') return '\u2605' // star
  if (node.node_type === 'milestone') return '\u2691' // flag
  if (node.node_type === 'capstone') return '\u2666' // diamond
  return getNodeInitials(node.name)
}

/** Compute laid-out positions for nodes, spreading them horizontally per tier. */
function layoutNodes(nodes: SkillNode[]) {
  if (nodes.length === 0) return { positions: new Map<string, { x: number; y: number }>(), width: 0, height: 0 }

  const tiers = new Map<number, SkillNode[]>()
  for (const node of nodes) {
    const list = tiers.get(node.tier) ?? []
    list.push(node)
    tiers.set(node.tier, list)
  }

  // Sort each tier by order_index
  for (const [, list] of tiers) {
    list.sort((a, b) => a.order_index - b.order_index)
  }

  const maxTier = Math.max(...tiers.keys())
  let maxNodesInTier = 0
  for (const [, list] of tiers) {
    if (list.length > maxNodesInTier) maxNodesInTier = list.length
  }

  const horizontalSpacing = 140
  const totalWidth = Math.max(maxNodesInTier * horizontalSpacing, 400)
  const totalHeight = (maxTier + 1) * TIER_VERTICAL_SPACING + SVG_PADDING * 2

  const positions = new Map<string, { x: number; y: number }>()

  for (const [tier, list] of tiers) {
    const tierWidth = list.length * horizontalSpacing
    const startX = (totalWidth - tierWidth) / 2 + horizontalSpacing / 2 + SVG_PADDING

    for (let i = 0; i < list.length; i++) {
      const node = list[i]
      // Use position_x/position_y if they are nonzero, otherwise compute from tier/order
      const x = node.position_x !== 0 ? node.position_x : startX + i * horizontalSpacing
      const y = node.position_y !== 0 ? node.position_y : SVG_PADDING + tier * TIER_VERTICAL_SPACING
      positions.set(node.id, { x, y })
    }
  }

  return {
    positions,
    width: totalWidth + SVG_PADDING * 2,
    height: totalHeight,
  }
}

/** Generate an SVG path for a curved branch between two points. */
function branchPath(x1: number, y1: number, x2: number, y2: number): string {
  const midY = (y1 + y2) / 2
  // Quadratic bezier with control points creating a natural branch curve
  return `M ${x1} ${y1} C ${x1} ${midY}, ${x2} ${midY}, ${x2} ${y2}`
}

// ---------------------------------------------------------------------------
// Sub-components
// ---------------------------------------------------------------------------

function BackgroundPattern({ width, height }: { width: number; height: number }) {
  return (
    <>
      <defs>
        <pattern id="grid" width="40" height="40" patternUnits="userSpaceOnUse">
          <path
            d="M 40 0 L 0 0 0 40"
            fill="none"
            stroke="rgba(148, 163, 184, 0.06)"
            strokeWidth="1"
          />
        </pattern>
        <radialGradient id="bgGradient" cx="50%" cy="0%" r="80%">
          <stop offset="0%" stopColor="#1e293b" />
          <stop offset="100%" stopColor="#0f172a" />
        </radialGradient>
        {/* Glow filter for completed nodes */}
        <filter id="glow-completed" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="6" result="blur" />
          <feFlood floodColor="#0a4d68" floodOpacity="0.6" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
        {/* Pulse filter for in-progress nodes */}
        <filter id="glow-progress" x="-50%" y="-50%" width="200%" height="200%">
          <feGaussianBlur stdDeviation="4" result="blur" />
          <feFlood floodColor="#7c3aed" floodOpacity="0.5" result="color" />
          <feComposite in="color" in2="blur" operator="in" result="shadow" />
          <feMerge>
            <feMergeNode in="shadow" />
            <feMergeNode in="SourceGraphic" />
          </feMerge>
        </filter>
      </defs>
      <rect width={width} height={height} fill="url(#bgGradient)" />
      <rect width={width} height={height} fill="url(#grid)" />
    </>
  )
}

function ConnectionLine({
  x1,
  y1,
  x2,
  y2,
  fromStatus,
  toStatus,
}: {
  x1: number
  y1: number
  x2: number
  y2: number
  fromStatus: string
  toStatus: string
}) {
  const isCompleted = fromStatus === 'completed' && toStatus === 'completed'
  const isActive =
    fromStatus === 'completed' &&
    (toStatus === 'in_progress' || toStatus === 'available')
  const strokeColor = isCompleted
    ? '#0a4d68'
    : isActive
      ? '#64748b'
      : '#1e293b'
  const strokeOpacity = isCompleted ? 0.9 : isActive ? 0.6 : 0.3
  const strokeWidth = isCompleted ? 3 : 2

  return (
    <motion.path
      d={branchPath(x1, y1, x2, y2)}
      stroke={strokeColor}
      strokeWidth={strokeWidth}
      strokeOpacity={strokeOpacity}
      fill="none"
      strokeLinecap="round"
      initial={{ pathLength: 0, opacity: 0 }}
      animate={{ pathLength: 1, opacity: 1 }}
      transition={{ duration: 1, ease: 'easeInOut' }}
    />
  )
}

function TreeNode({
  node,
  x,
  y,
  onHover,
  onLeave,
}: {
  node: SkillNode
  x: number
  y: number
  onHover: (node: SkillNode, x: number, y: number) => void
  onLeave: () => void
}) {
  const radius = getNodeRadius(node.node_type)
  const color = STATUS_COLORS[node.status] ?? STATUS_COLORS.locked
  const isLocked = node.status === 'locked'
  const isCompleted = node.status === 'completed'
  const isInProgress = node.status === 'in_progress'
  const iconText = getNodeIcon(node)
  const filter = isCompleted
    ? 'url(#glow-completed)'
    : isInProgress
      ? 'url(#glow-progress)'
      : undefined

  // Progress ring for in_progress nodes
  const circumference = 2 * Math.PI * (radius + 4)
  const progressOffset = circumference - (circumference * node.progress_pct) / 100

  return (
    <motion.g
      initial={{ scale: 0, opacity: 0 }}
      animate={{ scale: 1, opacity: 1 }}
      transition={{
        type: 'spring',
        stiffness: 200,
        damping: 20,
        delay: node.tier * 0.15 + node.order_index * 0.05,
      }}
      style={{ transformOrigin: `${x}px ${y}px` }}
      onMouseEnter={() => onHover(node, x, y)}
      onMouseLeave={onLeave}
      className="cursor-pointer"
    >
      {/* Progress ring for in-progress nodes */}
      {isInProgress && (
        <circle
          cx={x}
          cy={y}
          r={radius + 4}
          fill="none"
          stroke="#7c3aed"
          strokeWidth="3"
          strokeLinecap="round"
          strokeDasharray={circumference}
          strokeDashoffset={progressOffset}
          opacity={0.8}
          transform={`rotate(-90 ${x} ${y})`}
        >
          <animateTransform
            attributeName="transform"
            type="rotate"
            from={`-90 ${x} ${y}`}
            to={`270 ${x} ${y}`}
            dur="8s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Pulse ring for in-progress */}
      {isInProgress && (
        <circle cx={x} cy={y} r={radius + 8} fill="none" stroke="#7c3aed" strokeWidth="1.5">
          <animate
            attributeName="r"
            values={`${radius + 4};${radius + 16};${radius + 4}`}
            dur="2.5s"
            repeatCount="indefinite"
          />
          <animate
            attributeName="opacity"
            values="0.5;0;0.5"
            dur="2.5s"
            repeatCount="indefinite"
          />
        </circle>
      )}

      {/* Outer ring */}
      <circle
        cx={x}
        cy={y}
        r={radius + 2}
        fill="none"
        stroke={color}
        strokeWidth="2"
        opacity={isLocked ? 0.3 : 0.6}
      />

      {/* Main circle */}
      <circle
        cx={x}
        cy={y}
        r={radius}
        fill={isLocked ? '#1e293b' : color}
        stroke={isLocked ? '#334155' : color}
        strokeWidth="2.5"
        opacity={isLocked ? 0.5 : 1}
        filter={filter}
        className="transition-all duration-300"
      />

      {/* Inner highlight */}
      <circle
        cx={x}
        cy={y - radius * 0.2}
        r={radius * 0.65}
        fill="url(#innerHighlight)"
        opacity={isLocked ? 0.05 : 0.15}
      />

      {/* Completed checkmark or icon/initials */}
      {isCompleted ? (
        <g transform={`translate(${x}, ${y})`}>
          <text
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize={radius * 0.9}
            fontWeight="bold"
          >
            &#10003;
          </text>
        </g>
      ) : (
        <text
          x={x}
          y={y}
          textAnchor="middle"
          dominantBaseline="central"
          fill={isLocked ? '#64748b' : 'white'}
          fontSize={iconText.length > 2 ? radius * 0.55 : radius * 0.7}
          fontWeight="bold"
          fontFamily="system-ui, sans-serif"
          opacity={isLocked ? 0.5 : 1}
        >
          {iconText}
        </text>
      )}

      {/* Node name label below */}
      <text
        x={x}
        y={y + radius + 18}
        textAnchor="middle"
        fill={isLocked ? '#475569' : '#cbd5e1'}
        fontSize="11"
        fontWeight="500"
        fontFamily="system-ui, sans-serif"
      >
        {node.name.length > 18 ? node.name.slice(0, 16) + '...' : node.name}
      </text>

      {/* XP badge for non-locked */}
      {!isLocked && node.xp_reward > 0 && (
        <g>
          <rect
            x={x + radius - 4}
            y={y - radius - 6}
            width={28}
            height={16}
            rx={8}
            fill="#f59e0b"
            opacity={0.9}
          />
          <text
            x={x + radius + 10}
            y={y - radius + 2}
            textAnchor="middle"
            dominantBaseline="central"
            fill="white"
            fontSize="9"
            fontWeight="bold"
            fontFamily="system-ui, sans-serif"
          >
            {node.xp_reward}xp
          </text>
        </g>
      )}
    </motion.g>
  )
}

function Tooltip({
  node,
  x,
  y,
  svgRect,
  transform,
}: {
  node: SkillNode
  x: number
  y: number
  svgRect: DOMRect | null
  transform: { x: number; y: number; scale: number }
}) {
  if (!svgRect) return null

  // Convert SVG coordinates to screen coordinates
  const screenX = svgRect.left + x * transform.scale + transform.x
  const screenY = svgRect.top + y * transform.scale + transform.y

  const radius = getNodeRadius(node.node_type)
  const tooltipTop = screenY - radius * transform.scale - 12

  return (
    <motion.div
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: 8 }}
      transition={{ duration: 0.15 }}
      className="fixed z-50 pointer-events-none"
      style={{
        left: screenX,
        top: tooltipTop,
        transform: 'translate(-50%, -100%)',
      }}
    >
      <div className="rounded-xl bg-slate-800 border border-slate-600/50 px-4 py-3 shadow-2xl max-w-xs">
        <div className="flex items-center gap-2 mb-1.5">
          <div
            className="size-3 rounded-full"
            style={{ backgroundColor: STATUS_COLORS[node.status] ?? STATUS_COLORS.locked }}
          />
          <span className="text-sm font-semibold text-white">{node.name}</span>
        </div>
        {node.description && (
          <p className="text-xs text-slate-300 mb-2 leading-relaxed">{node.description}</p>
        )}
        <div className="flex items-center gap-3 text-xs">
          <span
            className="rounded-full px-2 py-0.5 font-medium"
            style={{
              backgroundColor: STATUS_COLORS[node.status] ?? STATUS_COLORS.locked,
              color: 'white',
            }}
          >
            {STATUS_LABELS[node.status] ?? node.status}
          </span>
          {node.xp_reward > 0 && (
            <span className="text-amber-400 font-semibold">{node.xp_reward} XP</span>
          )}
          {node.status === 'in_progress' && (
            <span className="text-purple-300">{node.progress_pct}%</span>
          )}
        </div>
        {node.completed_at && (
          <p className="text-xs text-slate-400 mt-1.5">
            Completed {new Date(node.completed_at).toLocaleDateString()}
          </p>
        )}
      </div>
    </motion.div>
  )
}

function Legend() {
  const items = [
    { status: 'completed', label: 'Completed' },
    { status: 'in_progress', label: 'In Progress' },
    { status: 'available', label: 'Available' },
    { status: 'locked', label: 'Locked' },
  ]

  return (
    <div className="flex flex-wrap items-center justify-center gap-4 rounded-xl bg-slate-800/80 backdrop-blur-sm border border-slate-700/50 px-4 py-3">
      {items.map(({ status, label }) => (
        <div key={status} className="flex items-center gap-2">
          <div
            className="size-3 rounded-full border border-white/20"
            style={{
              backgroundColor: STATUS_COLORS[status],
              opacity: status === 'locked' ? 0.5 : 1,
            }}
          />
          <span className="text-xs text-slate-300 font-medium">{label}</span>
        </div>
      ))}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main component
// ---------------------------------------------------------------------------

export function SkillTreeRenderer({ treeName, nodes, connections }: Props) {
  const containerRef = useRef<HTMLDivElement>(null)
  const svgRef = useRef<SVGSVGElement>(null)

  const [transform, setTransform] = useState({ x: 0, y: 0, scale: 1 })
  const [isPanning, setIsPanning] = useState(false)
  const [panStart, setPanStart] = useState({ x: 0, y: 0 })
  const [hoveredNode, setHoveredNode] = useState<{
    node: SkillNode
    x: number
    y: number
  } | null>(null)
  const [svgRect, setSvgRect] = useState<DOMRect | null>(null)

  // Layout the tree
  const { positions, width: svgWidth, height: svgHeight } = useMemo(
    () => layoutNodes(nodes),
    [nodes]
  )

  // Build a node map for quick lookups
  const nodeMap = useMemo(() => {
    const map = new Map<string, SkillNode>()
    for (const node of nodes) {
      map.set(node.id, node)
    }
    return map
  }, [nodes])

  // Center the tree on mount
  useEffect(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const scaleX = rect.width / svgWidth
    const scaleY = rect.height / svgHeight
    const initialScale = Math.min(scaleX, scaleY, 1) * 0.9
    const offsetX = (rect.width - svgWidth * initialScale) / 2
    const offsetY = 20

    setTransform({ x: offsetX, y: offsetY, scale: initialScale })
  }, [svgWidth, svgHeight])

  // Track SVG bounding rect for tooltips
  useEffect(() => {
    function updateRect() {
      if (svgRef.current) {
        setSvgRect(svgRef.current.getBoundingClientRect())
      }
    }
    updateRect()
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect)
    return () => {
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect)
    }
  }, [])

  // Zoom handler
  const handleWheel = useCallback(
    (e: React.WheelEvent) => {
      e.preventDefault()
      const scaleFactor = e.deltaY > 0 ? 0.92 : 1.08
      const newScale = Math.max(0.2, Math.min(3, transform.scale * scaleFactor))

      // Zoom toward cursor position
      const rect = containerRef.current?.getBoundingClientRect()
      if (!rect) return
      const mx = e.clientX - rect.left
      const my = e.clientY - rect.top

      const newX = mx - (mx - transform.x) * (newScale / transform.scale)
      const newY = my - (my - transform.y) * (newScale / transform.scale)

      setTransform({ x: newX, y: newY, scale: newScale })
    },
    [transform]
  )

  // Pan handlers
  const handleMouseDown = useCallback(
    (e: React.MouseEvent) => {
      if (e.button !== 0) return
      setIsPanning(true)
      setPanStart({ x: e.clientX - transform.x, y: e.clientY - transform.y })
    },
    [transform]
  )

  const handleMouseMove = useCallback(
    (e: React.MouseEvent) => {
      if (!isPanning) return
      setTransform((prev) => ({
        ...prev,
        x: e.clientX - panStart.x,
        y: e.clientY - panStart.y,
      }))
      // Update rect during panning for tooltip accuracy
      if (svgRef.current) {
        setSvgRect(svgRef.current.getBoundingClientRect())
      }
    },
    [isPanning, panStart]
  )

  const handleMouseUp = useCallback(() => {
    setIsPanning(false)
  }, [])

  const handleNodeHover = useCallback((node: SkillNode, x: number, y: number) => {
    setHoveredNode({ node, x, y })
  }, [])

  const handleNodeLeave = useCallback(() => {
    setHoveredNode(null)
  }, [])

  // Zoom controls
  const zoomIn = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.min(3, prev.scale * 1.2),
    }))
  }, [])

  const zoomOut = useCallback(() => {
    setTransform((prev) => ({
      ...prev,
      scale: Math.max(0.2, prev.scale / 1.2),
    }))
  }, [])

  const resetView = useCallback(() => {
    if (!containerRef.current) return
    const rect = containerRef.current.getBoundingClientRect()
    const scaleX = rect.width / svgWidth
    const scaleY = rect.height / svgHeight
    const initialScale = Math.min(scaleX, scaleY, 1) * 0.9
    const offsetX = (rect.width - svgWidth * initialScale) / 2
    setTransform({ x: offsetX, y: 20, scale: initialScale })
  }, [svgWidth, svgHeight])

  if (nodes.length === 0) {
    return (
      <div className="rounded-2xl bg-slate-900 p-12 text-center">
        <p className="text-lg font-medium text-slate-400">
          No skill nodes have been added to this tree yet.
        </p>
      </div>
    )
  }

  return (
    <div className="space-y-4">
      <div
        ref={containerRef}
        className="relative overflow-hidden rounded-2xl border border-slate-700/50 shadow-2xl"
        style={{ height: '70vh', minHeight: 500 }}
        onWheel={handleWheel}
        onMouseDown={handleMouseDown}
        onMouseMove={handleMouseMove}
        onMouseUp={handleMouseUp}
        onMouseLeave={handleMouseUp}
      >
        <svg
          ref={svgRef}
          width="100%"
          height="100%"
          className="select-none"
          style={{ cursor: isPanning ? 'grabbing' : 'grab' }}
        >
          {/* Background */}
          <BackgroundPattern width={svgWidth * 3} height={svgHeight * 3} />

          {/* Additional gradient defs */}
          <defs>
            <radialGradient id="innerHighlight" cx="50%" cy="30%" r="60%">
              <stop offset="0%" stopColor="white" stopOpacity="0.4" />
              <stop offset="100%" stopColor="white" stopOpacity="0" />
            </radialGradient>
          </defs>

          {/* Transformed group for zoom/pan */}
          <g
            transform={`translate(${transform.x}, ${transform.y}) scale(${transform.scale})`}
          >
            {/* Connections */}
            {connections.map((conn) => {
              const fromPos = positions.get(conn.from_node_id)
              const toPos = positions.get(conn.to_node_id)
              const fromNode = nodeMap.get(conn.from_node_id)
              const toNode = nodeMap.get(conn.to_node_id)

              if (!fromPos || !toPos || !fromNode || !toNode) return null

              return (
                <ConnectionLine
                  key={conn.id}
                  x1={fromPos.x}
                  y1={fromPos.y}
                  x2={toPos.x}
                  y2={toPos.y}
                  fromStatus={fromNode.status}
                  toStatus={toNode.status}
                />
              )
            })}

            {/* Nodes */}
            {nodes.map((node) => {
              const pos = positions.get(node.id)
              if (!pos) return null

              return (
                <TreeNode
                  key={node.id}
                  node={node}
                  x={pos.x}
                  y={pos.y}
                  onHover={handleNodeHover}
                  onLeave={handleNodeLeave}
                />
              )
            })}
          </g>
        </svg>

        {/* Zoom controls overlay */}
        <div className="absolute right-4 top-4 flex flex-col gap-2">
          <button
            onClick={zoomIn}
            className="flex size-9 items-center justify-center rounded-lg bg-slate-800/90 border border-slate-600/50 text-slate-300 backdrop-blur-sm transition-colors hover:bg-slate-700 hover:text-white"
            title="Zoom in"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M8 3v10M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={zoomOut}
            className="flex size-9 items-center justify-center rounded-lg bg-slate-800/90 border border-slate-600/50 text-slate-300 backdrop-blur-sm transition-colors hover:bg-slate-700 hover:text-white"
            title="Zoom out"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path d="M3 8h10" stroke="currentColor" strokeWidth="2" strokeLinecap="round" />
            </svg>
          </button>
          <button
            onClick={resetView}
            className="flex size-9 items-center justify-center rounded-lg bg-slate-800/90 border border-slate-600/50 text-slate-300 backdrop-blur-sm transition-colors hover:bg-slate-700 hover:text-white"
            title="Reset view"
          >
            <svg width="16" height="16" viewBox="0 0 16 16" fill="none">
              <path
                d="M2 8a6 6 0 1 1 1.76 4.24"
                stroke="currentColor"
                strokeWidth="2"
                strokeLinecap="round"
              />
              <path d="M2 12V8h4" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </button>
        </div>

        {/* Interaction hint */}
        <div className="absolute bottom-4 left-4 text-xs text-slate-500 select-none">
          Scroll to zoom &middot; Drag to pan
        </div>

        {/* Tooltip portal */}
        <AnimatePresence>
          {hoveredNode && (
            <Tooltip
              node={hoveredNode.node}
              x={hoveredNode.x}
              y={hoveredNode.y}
              svgRect={svgRect}
              transform={transform}
            />
          )}
        </AnimatePresence>
      </div>

      {/* Legend */}
      <Legend />
    </div>
  )
}
