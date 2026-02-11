'use client'

import { useState, useRef, useEffect } from 'react'
import { RotateCcw, Save } from 'lucide-react'
import { cn } from '@/lib/utils'
import type { AvatarConfig } from '@/lib/plaza/types'

export type { AvatarConfig }

interface AvatarCustomizerProps {
  initialConfig?: AvatarConfig
  onSave: (config: AvatarConfig) => void
  isSaving?: boolean
  className?: string
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const BODY_COLORS = [
  '#4F46E5', '#7C3AED', '#EC4899', '#EF4444', '#F59E0B',
  '#10B981', '#06B6D4', '#3B82F6', '#8B5CF6', '#F97316',
  '#14B8A6', '#6366F1', '#D946EF', '#0EA5E9', '#84CC16',
  '#E11D48', '#0D9488', '#7C2D12', '#1E3A5F', '#4A1D96',
]

const BODY_SHAPES = [
  { id: 'circle', label: 'Circle' },
  { id: 'square', label: 'Square' },
  { id: 'diamond', label: 'Diamond' },
  { id: 'triangle', label: 'Triangle' },
  { id: 'hexagon', label: 'Hexagon' },
]

const EYE_STYLES = [
  { id: 'default', label: 'Default' },
  { id: 'happy', label: 'Happy' },
  { id: 'cool', label: 'Cool' },
  { id: 'sleepy', label: 'Sleepy' },
  { id: 'star', label: 'Star' },
]

const DEFAULT_CONFIG: AvatarConfig = {
  body_color: '#4F46E5',
  body_shape: 'circle',
  eye_style: 'default',
  hat: null,
  outfit: null,
  accessory: null,
  trail_effect: null,
  emote: null,
  background_id: null,
}

// ---------------------------------------------------------------------------
// Shape drawing helpers
// ---------------------------------------------------------------------------

function drawShape(
  ctx: CanvasRenderingContext2D,
  shape: string,
  cx: number,
  cy: number,
  size: number,
  color: string
) {
  ctx.fillStyle = color
  ctx.strokeStyle = 'rgba(255,255,255,0.3)'
  ctx.lineWidth = 3
  ctx.beginPath()

  switch (shape) {
    case 'circle':
      ctx.arc(cx, cy, size, 0, Math.PI * 2)
      break
    case 'square':
      ctx.roundRect(cx - size, cy - size, size * 2, size * 2, size * 0.2)
      break
    case 'diamond':
      ctx.moveTo(cx, cy - size)
      ctx.lineTo(cx + size, cy)
      ctx.lineTo(cx, cy + size)
      ctx.lineTo(cx - size, cy)
      ctx.closePath()
      break
    case 'triangle':
      ctx.moveTo(cx, cy - size)
      ctx.lineTo(cx + size, cy + size * 0.7)
      ctx.lineTo(cx - size, cy + size * 0.7)
      ctx.closePath()
      break
    case 'hexagon': {
      const sides = 6
      for (let i = 0; i < sides; i++) {
        const angle = (Math.PI * 2 * i) / sides - Math.PI / 2
        const x = cx + size * Math.cos(angle)
        const y = cy + size * Math.sin(angle)
        if (i === 0) ctx.moveTo(x, y)
        else ctx.lineTo(x, y)
      }
      ctx.closePath()
      break
    }
    default:
      ctx.arc(cx, cy, size, 0, Math.PI * 2)
  }

  ctx.fill()
  ctx.stroke()
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  style: string,
  cx: number,
  cy: number,
  size: number
) {
  const eyeOffsetX = size * 0.3
  const eyeOffsetY = -size * 0.1
  const eyeSize = size * 0.12

  ctx.fillStyle = '#FFFFFF'

  switch (style) {
    case 'default':
      // Two oval eyes
      ctx.beginPath()
      ctx.ellipse(cx - eyeOffsetX, cy + eyeOffsetY, eyeSize, eyeSize * 1.2, 0, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.ellipse(cx + eyeOffsetX, cy + eyeOffsetY, eyeSize, eyeSize * 1.2, 0, 0, Math.PI * 2)
      ctx.fill()
      // Pupils
      ctx.fillStyle = '#1a1a2e'
      ctx.beginPath()
      ctx.arc(cx - eyeOffsetX, cy + eyeOffsetY, eyeSize * 0.5, 0, Math.PI * 2)
      ctx.fill()
      ctx.beginPath()
      ctx.arc(cx + eyeOffsetX, cy + eyeOffsetY, eyeSize * 0.5, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'happy':
      // U-shape happy eyes
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.arc(cx - eyeOffsetX, cy + eyeOffsetY - 3, eyeSize, 0, Math.PI)
      ctx.stroke()
      ctx.beginPath()
      ctx.arc(cx + eyeOffsetX, cy + eyeOffsetY - 3, eyeSize, 0, Math.PI)
      ctx.stroke()
      break
    case 'cool':
      // Sunglasses shape
      ctx.fillStyle = '#1a1a2e'
      ctx.fillRect(cx - eyeOffsetX - eyeSize * 1.5, cy + eyeOffsetY - eyeSize, eyeSize * 3, eyeSize * 1.6)
      ctx.fillRect(cx + eyeOffsetX - eyeSize * 1.5, cy + eyeOffsetY - eyeSize, eyeSize * 3, eyeSize * 1.6)
      // Bridge
      ctx.strokeStyle = '#1a1a2e'
      ctx.lineWidth = 2
      ctx.beginPath()
      ctx.moveTo(cx - eyeOffsetX + eyeSize * 1.5, cy + eyeOffsetY)
      ctx.lineTo(cx + eyeOffsetX - eyeSize * 1.5, cy + eyeOffsetY)
      ctx.stroke()
      // Reflection
      ctx.fillStyle = 'rgba(255,255,255,0.3)'
      ctx.fillRect(cx - eyeOffsetX - eyeSize, cy + eyeOffsetY - eyeSize * 0.7, eyeSize, eyeSize * 0.5)
      ctx.fillRect(cx + eyeOffsetX - eyeSize, cy + eyeOffsetY - eyeSize * 0.7, eyeSize, eyeSize * 0.5)
      break
    case 'sleepy':
      // Droopy/half-closed eyes
      ctx.strokeStyle = '#FFFFFF'
      ctx.lineWidth = 3
      ctx.lineCap = 'round'
      ctx.beginPath()
      ctx.moveTo(cx - eyeOffsetX - eyeSize, cy + eyeOffsetY)
      ctx.lineTo(cx - eyeOffsetX + eyeSize, cy + eyeOffsetY)
      ctx.stroke()
      ctx.beginPath()
      ctx.moveTo(cx + eyeOffsetX - eyeSize, cy + eyeOffsetY)
      ctx.lineTo(cx + eyeOffsetX + eyeSize, cy + eyeOffsetY)
      ctx.stroke()
      break
    case 'star':
      // Star-shaped eyes
      ctx.fillStyle = '#FFFFFF'
      drawStar(ctx, cx - eyeOffsetX, cy + eyeOffsetY, eyeSize * 1.2, 5)
      drawStar(ctx, cx + eyeOffsetX, cy + eyeOffsetY, eyeSize * 1.2, 5)
      break
    default:
      break
  }
}

function drawStar(
  ctx: CanvasRenderingContext2D,
  cx: number,
  cy: number,
  size: number,
  points: number
) {
  const outerRadius = size
  const innerRadius = size * 0.5
  ctx.beginPath()
  for (let i = 0; i < points * 2; i++) {
    const radius = i % 2 === 0 ? outerRadius : innerRadius
    const angle = (Math.PI * i) / points - Math.PI / 2
    const x = cx + radius * Math.cos(angle)
    const y = cy + radius * Math.sin(angle)
    if (i === 0) ctx.moveTo(x, y)
    else ctx.lineTo(x, y)
  }
  ctx.closePath()
  ctx.fill()
}

// ---------------------------------------------------------------------------
// Component
// ---------------------------------------------------------------------------

export function AvatarCustomizer({
  initialConfig,
  onSave,
  isSaving = false,
  className,
}: AvatarCustomizerProps) {
  const [config, setConfig] = useState<AvatarConfig>(initialConfig ?? DEFAULT_CONFIG)
  const canvasRef = useRef<HTMLCanvasElement>(null)

  // Draw the avatar preview whenever config changes
  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    const dpr = window.devicePixelRatio || 1
    canvas.width = 200 * dpr
    canvas.height = 200 * dpr
    ctx.scale(dpr, dpr)

    // Clear
    ctx.clearRect(0, 0, 200, 200)

    // Background
    ctx.fillStyle = 'rgba(30, 58, 95, 0.3)'
    ctx.beginPath()
    ctx.arc(100, 100, 90, 0, Math.PI * 2)
    ctx.fill()

    // Body
    drawShape(ctx, config.body_shape, 100, 100, 55, config.body_color)

    // Eyes
    drawEyes(ctx, config.eye_style, 100, 100, 55)

    // Mouth (small smile)
    ctx.strokeStyle = 'rgba(255,255,255,0.6)'
    ctx.lineWidth = 2
    ctx.lineCap = 'round'
    ctx.beginPath()
    ctx.arc(100, 112, 12, 0.1 * Math.PI, 0.9 * Math.PI)
    ctx.stroke()
  }, [config])

  const handleReset = () => {
    setConfig(DEFAULT_CONFIG)
  }

  return (
    <div className={cn('space-y-8', className)}>
      {/* Live Preview */}
      <div className="flex flex-col items-center">
        <div className="relative">
          <canvas
            ref={canvasRef}
            className="h-[200px] w-[200px] rounded-3xl border-2 border-border bg-gradient-to-b from-ocean-900/20 to-ocean-800/10"
            style={{ imageRendering: 'auto' }}
          />
          <div className="absolute -bottom-3 left-1/2 -translate-x-1/2 rounded-full bg-card border border-border px-4 py-1 text-sm font-semibold text-foreground shadow">
            Preview
          </div>
        </div>
      </div>

      {/* Body Color */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Body Color</h3>
        <div className="grid grid-cols-10 gap-2">
          {BODY_COLORS.map((color) => (
            <button
              key={color}
              onClick={() => setConfig((c) => ({ ...c, body_color: color }))}
              className={cn(
                'h-8 w-8 rounded-full border-2 transition-all hover:scale-110',
                config.body_color === color
                  ? 'border-white ring-2 ring-primary scale-110'
                  : 'border-transparent'
              )}
              style={{ backgroundColor: color }}
              title={color}
            />
          ))}
        </div>
      </div>

      {/* Body Shape */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Body Shape</h3>
        <div className="flex flex-wrap gap-2">
          {BODY_SHAPES.map((shape) => (
            <button
              key={shape.id}
              onClick={() => setConfig((c) => ({ ...c, body_shape: shape.id }))}
              className={cn(
                'rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all',
                config.body_shape === shape.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {shape.label}
            </button>
          ))}
        </div>
      </div>

      {/* Eye Style */}
      <div>
        <h3 className="mb-3 text-sm font-semibold text-foreground">Eye Style</h3>
        <div className="flex flex-wrap gap-2">
          {EYE_STYLES.map((eye) => (
            <button
              key={eye.id}
              onClick={() => setConfig((c) => ({ ...c, eye_style: eye.id }))}
              className={cn(
                'rounded-xl border-2 px-4 py-2 text-sm font-medium transition-all',
                config.eye_style === eye.id
                  ? 'border-primary bg-primary/10 text-primary'
                  : 'border-border text-muted-foreground hover:border-primary/50 hover:text-foreground'
              )}
            >
              {eye.label}
            </button>
          ))}
        </div>
      </div>

      {/* Action buttons */}
      <div className="flex items-center gap-3 pt-2">
        <button
          onClick={handleReset}
          className="inline-flex items-center gap-2 rounded-xl border border-border px-4 py-2.5 text-sm font-medium text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <RotateCcw className="h-4 w-4" />
          Reset
        </button>
        <button
          onClick={() => onSave(config)}
          disabled={isSaving}
          className="inline-flex flex-1 items-center justify-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-semibold text-primary-foreground transition-colors hover:bg-primary/90 disabled:opacity-50"
        >
          <Save className="h-4 w-4" />
          {isSaving ? 'Saving...' : 'Save Avatar'}
        </button>
      </div>
    </div>
  )
}
