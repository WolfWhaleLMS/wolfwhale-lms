/**
 * Avatar Rendering Utilities for Canvas2D
 *
 * Draws placeholder geometric avatars directly on a CanvasRenderingContext2D.
 * Each avatar is a colored circle body with eyes, direction indicator,
 * optional cosmetic slots, and a nameplate above.
 *
 * These are pure functions - no React component. The game loop calls
 * drawAvatar() during the render phase.
 */

import type { AvatarConfig, FacingDirection } from '@/lib/plaza/types'

// ─── Constants ───────────────────────────────────────────────────────────────

const BODY_RADIUS = 12 // 24px diameter circle body
const BOUNDING_BOX = 32 // 32x32 bounding box
const EYE_RADIUS = 2.5
const PUPIL_RADIUS = 1.2
const DIRECTION_TRIANGLE_SIZE = 5
const NAME_FONT_SIZE = 10
const NAME_OFFSET_Y = -24 // Above the avatar
const BOB_AMPLITUDE = 2 // Walking bob up/down
const BOB_SPEED = 8 // Bob cycles per second

// ─── Direction Offsets ───────────────────────────────────────────────────────

/** Eye offset from center based on facing direction. */
const EYE_OFFSETS: Record<FacingDirection, { lx: number; ly: number; rx: number; ry: number }> = {
  down:  { lx: -4, ly: -2, rx: 4, ry: -2 },
  up:    { lx: -4, ly: -4, rx: 4, ry: -4 },
  left:  { lx: -5, ly: -3, rx: -1, ry: -3 },
  right: { lx: 1,  ly: -3, rx: 5,  ry: -3 },
}

/** Direction triangle offset from center and rotation angle. */
const DIRECTION_INDICATORS: Record<FacingDirection, { ox: number; oy: number; angle: number }> = {
  down:  { ox: 0,  oy: BODY_RADIUS + 3,  angle: Math.PI },
  up:    { ox: 0,  oy: -BODY_RADIUS - 3, angle: 0 },
  left:  { ox: -BODY_RADIUS - 3, oy: 0,  angle: -Math.PI / 2 },
  right: { ox: BODY_RADIUS + 3,  oy: 0,  angle: Math.PI / 2 },
}

// ─── Main Draw Function ──────────────────────────────────────────────────────

/**
 * Draw a full avatar at the given world position.
 *
 * @param ctx - The Canvas2D rendering context
 * @param config - Avatar appearance configuration
 * @param x - World X center position
 * @param y - World Y center position
 * @param facing - Current facing direction
 * @param isMoving - Whether the avatar is currently walking
 * @param displayName - Name to render above the avatar
 * @param scale - Render scale (default 1.0)
 * @param time - Current timestamp for animation (performance.now())
 * @param opacity - Overall opacity (default 1.0, used for disconnect fade)
 */
export function drawAvatar(
  ctx: CanvasRenderingContext2D,
  config: AvatarConfig,
  x: number,
  y: number,
  facing: FacingDirection,
  isMoving: boolean,
  displayName: string,
  scale: number = 1.0,
  time: number = 0,
  opacity: number = 1.0
): void {
  ctx.save()
  ctx.globalAlpha = opacity

  // Walking bob animation
  let bobOffset = 0
  if (isMoving) {
    bobOffset = Math.sin(time / 1000 * BOB_SPEED * Math.PI * 2) * BOB_AMPLITUDE
  }

  const drawX = x
  const drawY = y + bobOffset

  ctx.translate(drawX, drawY)
  ctx.scale(scale, scale)

  // 1. Draw shadow
  drawShadow(ctx)

  // 2. Draw body circle
  drawBody(ctx, config.body_color)

  // 3. Draw eyes
  drawEyes(ctx, facing, config.eye_style)

  // 4. Draw direction indicator
  drawDirectionIndicator(ctx, facing, config.body_color)

  // 5. Draw hat slot
  if (config.hat) {
    drawHat(ctx, config.hat)
  }

  // 6. Draw accessory slot
  if (config.accessory) {
    drawAccessory(ctx, config.accessory)
  }

  // Reset transform for nameplate (no bob, positioned relative to avatar)
  ctx.scale(1 / scale, 1 / scale)
  ctx.translate(-drawX, -drawY)

  // 7. Draw nameplate
  drawNameplate(ctx, displayName, x, y + NAME_OFFSET_Y)

  ctx.restore()
}

// ─── Sub-Drawing Functions ───────────────────────────────────────────────────

function drawShadow(ctx: CanvasRenderingContext2D): void {
  ctx.save()
  ctx.fillStyle = 'rgba(0, 0, 0, 0.2)'
  ctx.beginPath()
  ctx.ellipse(0, BODY_RADIUS - 2, BODY_RADIUS * 0.8, 4, 0, 0, Math.PI * 2)
  ctx.fill()
  ctx.restore()
}

function drawBody(ctx: CanvasRenderingContext2D, bodyColor: string): void {
  // Main body circle
  ctx.fillStyle = bodyColor
  ctx.beginPath()
  ctx.arc(0, 0, BODY_RADIUS, 0, Math.PI * 2)
  ctx.fill()

  // Subtle outline
  ctx.strokeStyle = darkenColor(bodyColor, 0.3)
  ctx.lineWidth = 1.5
  ctx.stroke()

  // Highlight (top-left shine)
  ctx.fillStyle = 'rgba(255, 255, 255, 0.2)'
  ctx.beginPath()
  ctx.arc(-3, -4, BODY_RADIUS * 0.4, 0, Math.PI * 2)
  ctx.fill()
}

function drawEyes(
  ctx: CanvasRenderingContext2D,
  facing: FacingDirection,
  eyeStyle: string
): void {
  // Don't draw eyes when facing up (back of head)
  if (facing === 'up') return

  const offsets = EYE_OFFSETS[facing]

  // White of eyes
  ctx.fillStyle = '#FFFFFF'
  ctx.beginPath()
  ctx.arc(offsets.lx, offsets.ly, EYE_RADIUS, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(offsets.rx, offsets.ry, EYE_RADIUS, 0, Math.PI * 2)
  ctx.fill()

  // Pupils
  let pupilOffsetX = 0
  let pupilOffsetY = 0
  if (facing === 'left') pupilOffsetX = -0.5
  if (facing === 'right') pupilOffsetX = 0.5
  if (facing === 'down') pupilOffsetY = 0.5

  ctx.fillStyle = '#1a1a2e'
  ctx.beginPath()
  ctx.arc(offsets.lx + pupilOffsetX, offsets.ly + pupilOffsetY, PUPIL_RADIUS, 0, Math.PI * 2)
  ctx.fill()
  ctx.beginPath()
  ctx.arc(offsets.rx + pupilOffsetX, offsets.ry + pupilOffsetY, PUPIL_RADIUS, 0, Math.PI * 2)
  ctx.fill()

  // Eye style variations
  if (eyeStyle === 'happy') {
    // Small curved line under each eye
    ctx.strokeStyle = '#1a1a2e'
    ctx.lineWidth = 1
    ctx.beginPath()
    ctx.arc(offsets.lx, offsets.ly + 1, EYE_RADIUS * 0.6, 0, Math.PI)
    ctx.stroke()
    ctx.beginPath()
    ctx.arc(offsets.rx, offsets.ry + 1, EYE_RADIUS * 0.6, 0, Math.PI)
    ctx.stroke()
  } else if (eyeStyle === 'cool') {
    // Sunglasses bar
    ctx.fillStyle = '#1a1a2e'
    ctx.fillRect(offsets.lx - 3, offsets.ly - 1.5, offsets.rx - offsets.lx + 6, 3)
  }
}

function drawDirectionIndicator(
  ctx: CanvasRenderingContext2D,
  facing: FacingDirection,
  bodyColor: string
): void {
  const indicator = DIRECTION_INDICATORS[facing]

  ctx.save()
  ctx.translate(indicator.ox, indicator.oy)
  ctx.rotate(indicator.angle)

  ctx.fillStyle = darkenColor(bodyColor, 0.2)
  ctx.beginPath()
  ctx.moveTo(0, -DIRECTION_TRIANGLE_SIZE)
  ctx.lineTo(-DIRECTION_TRIANGLE_SIZE * 0.6, DIRECTION_TRIANGLE_SIZE * 0.4)
  ctx.lineTo(DIRECTION_TRIANGLE_SIZE * 0.6, DIRECTION_TRIANGLE_SIZE * 0.4)
  ctx.closePath()
  ctx.fill()

  ctx.restore()
}

function drawHat(ctx: CanvasRenderingContext2D, hatType: string): void {
  ctx.save()

  switch (hatType) {
    case 'top_hat':
      ctx.fillStyle = '#2d3748'
      ctx.fillRect(-6, -BODY_RADIUS - 12, 12, 10)
      ctx.fillRect(-8, -BODY_RADIUS - 3, 16, 3)
      break
    case 'party_hat':
      ctx.fillStyle = '#ef4444'
      ctx.beginPath()
      ctx.moveTo(0, -BODY_RADIUS - 14)
      ctx.lineTo(-7, -BODY_RADIUS - 2)
      ctx.lineTo(7, -BODY_RADIUS - 2)
      ctx.closePath()
      ctx.fill()
      // Pom pom
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(0, -BODY_RADIUS - 14, 2.5, 0, Math.PI * 2)
      ctx.fill()
      break
    case 'crown':
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.moveTo(-7, -BODY_RADIUS - 2)
      ctx.lineTo(-7, -BODY_RADIUS - 9)
      ctx.lineTo(-4, -BODY_RADIUS - 5)
      ctx.lineTo(0, -BODY_RADIUS - 11)
      ctx.lineTo(4, -BODY_RADIUS - 5)
      ctx.lineTo(7, -BODY_RADIUS - 9)
      ctx.lineTo(7, -BODY_RADIUS - 2)
      ctx.closePath()
      ctx.fill()
      break
    case 'cap':
    default:
      ctx.fillStyle = '#3b82f6'
      ctx.beginPath()
      ctx.arc(0, -BODY_RADIUS - 1, 9, Math.PI, 0)
      ctx.fill()
      // Brim
      ctx.fillRect(-10, -BODY_RADIUS - 1, 20, 3)
      break
  }

  ctx.restore()
}

function drawAccessory(ctx: CanvasRenderingContext2D, accessoryType: string): void {
  ctx.save()

  switch (accessoryType) {
    case 'scarf':
      ctx.fillStyle = '#ef4444'
      ctx.fillRect(-8, BODY_RADIUS - 4, 16, 5)
      ctx.fillRect(6, BODY_RADIUS - 2, 4, 8)
      break
    case 'bow_tie':
      ctx.fillStyle = '#8b5cf6'
      ctx.beginPath()
      ctx.moveTo(0, BODY_RADIUS - 2)
      ctx.lineTo(-5, BODY_RADIUS - 5)
      ctx.lineTo(-5, BODY_RADIUS + 1)
      ctx.closePath()
      ctx.fill()
      ctx.beginPath()
      ctx.moveTo(0, BODY_RADIUS - 2)
      ctx.lineTo(5, BODY_RADIUS - 5)
      ctx.lineTo(5, BODY_RADIUS + 1)
      ctx.closePath()
      ctx.fill()
      break
    case 'necklace':
      ctx.strokeStyle = '#fbbf24'
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(0, BODY_RADIUS - 3, 7, 0.2, Math.PI - 0.2)
      ctx.stroke()
      // Pendant
      ctx.fillStyle = '#fbbf24'
      ctx.beginPath()
      ctx.arc(0, BODY_RADIUS + 3, 2, 0, Math.PI * 2)
      ctx.fill()
      break
  }

  ctx.restore()
}

function drawNameplate(
  ctx: CanvasRenderingContext2D,
  name: string,
  x: number,
  y: number
): void {
  ctx.save()

  ctx.font = `bold ${NAME_FONT_SIZE}px sans-serif`
  ctx.textAlign = 'center'
  ctx.textBaseline = 'bottom'

  // Measure text for background
  const metrics = ctx.measureText(name)
  const textWidth = metrics.width
  const padding = 4

  // Background pill
  ctx.fillStyle = 'rgba(0, 0, 0, 0.5)'
  const bgX = x - textWidth / 2 - padding
  const bgY = y - NAME_FONT_SIZE - 2
  const bgW = textWidth + padding * 2
  const bgH = NAME_FONT_SIZE + 4
  const bgR = 3

  ctx.beginPath()
  ctx.moveTo(bgX + bgR, bgY)
  ctx.lineTo(bgX + bgW - bgR, bgY)
  ctx.arcTo(bgX + bgW, bgY, bgX + bgW, bgY + bgR, bgR)
  ctx.lineTo(bgX + bgW, bgY + bgH - bgR)
  ctx.arcTo(bgX + bgW, bgY + bgH, bgX + bgW - bgR, bgY + bgH, bgR)
  ctx.lineTo(bgX + bgR, bgY + bgH)
  ctx.arcTo(bgX, bgY + bgH, bgX, bgY + bgH - bgR, bgR)
  ctx.lineTo(bgX, bgY + bgR)
  ctx.arcTo(bgX, bgY, bgX + bgR, bgY, bgR)
  ctx.closePath()
  ctx.fill()

  // Text with shadow
  ctx.fillStyle = '#FFFFFF'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
  ctx.shadowBlur = 2
  ctx.shadowOffsetX = 1
  ctx.shadowOffsetY = 1
  ctx.fillText(name, x, y)

  ctx.restore()
}

// ─── Chat Bubble Drawing ─────────────────────────────────────────────────────

/**
 * Draw a chat bubble above an avatar at the given world position.
 */
export function drawChatBubble(
  ctx: CanvasRenderingContext2D,
  phrase: string,
  x: number,
  y: number,
  opacity: number = 1.0,
  scale: number = 1.0
): void {
  ctx.save()
  ctx.globalAlpha = opacity

  const maxWidth = 180
  const padding = 8
  const fontSize = 12
  const lineHeight = 16
  const borderRadius = 8
  const pointerSize = 6

  ctx.font = `${fontSize}px sans-serif`

  // Word-wrap text
  const lines = wrapText(ctx, phrase, maxWidth - padding * 2)

  const textWidth = Math.min(
    maxWidth - padding * 2,
    Math.max(...lines.map(line => ctx.measureText(line).width))
  )
  const bubbleWidth = textWidth + padding * 2
  const bubbleHeight = lines.length * lineHeight + padding * 2

  // Position bubble above avatar
  const bubbleX = x - bubbleWidth / 2
  const bubbleY = y - BOUNDING_BOX - bubbleHeight - pointerSize - 8

  ctx.translate(x, y - BOUNDING_BOX - pointerSize - 8)
  ctx.scale(scale, scale)
  ctx.translate(-x, -(y - BOUNDING_BOX - pointerSize - 8))

  // Draw bubble background
  ctx.fillStyle = 'rgba(255, 255, 255, 0.95)'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.15)'
  ctx.shadowBlur = 4
  ctx.shadowOffsetY = 2

  // Rounded rectangle
  ctx.beginPath()
  ctx.moveTo(bubbleX + borderRadius, bubbleY)
  ctx.lineTo(bubbleX + bubbleWidth - borderRadius, bubbleY)
  ctx.arcTo(bubbleX + bubbleWidth, bubbleY, bubbleX + bubbleWidth, bubbleY + borderRadius, borderRadius)
  ctx.lineTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight - borderRadius)
  ctx.arcTo(bubbleX + bubbleWidth, bubbleY + bubbleHeight, bubbleX + bubbleWidth - borderRadius, bubbleY + bubbleHeight, borderRadius)
  ctx.lineTo(bubbleX + borderRadius, bubbleY + bubbleHeight)
  ctx.arcTo(bubbleX, bubbleY + bubbleHeight, bubbleX, bubbleY + bubbleHeight - borderRadius, borderRadius)
  ctx.lineTo(bubbleX, bubbleY + borderRadius)
  ctx.arcTo(bubbleX, bubbleY, bubbleX + borderRadius, bubbleY, borderRadius)
  ctx.closePath()
  ctx.fill()

  // Draw pointer triangle
  ctx.shadowBlur = 0
  ctx.shadowOffsetY = 0
  ctx.beginPath()
  ctx.moveTo(x - pointerSize, bubbleY + bubbleHeight)
  ctx.lineTo(x, bubbleY + bubbleHeight + pointerSize)
  ctx.lineTo(x + pointerSize, bubbleY + bubbleHeight)
  ctx.closePath()
  ctx.fill()

  // Draw text
  ctx.fillStyle = '#1a1a2e'
  ctx.textAlign = 'center'
  ctx.textBaseline = 'top'
  ctx.shadowColor = 'rgba(0, 0, 0, 0.1)'
  ctx.shadowBlur = 0
  ctx.shadowOffsetX = 0
  ctx.shadowOffsetY = 0

  for (let i = 0; i < lines.length; i++) {
    ctx.fillText(lines[i], x, bubbleY + padding + i * lineHeight)
  }

  ctx.restore()
}

// ─── Helpers ─────────────────────────────────────────────────────────────────

/**
 * Word-wrap text to fit within maxWidth pixels.
 */
function wrapText(ctx: CanvasRenderingContext2D, text: string, maxWidth: number): string[] {
  const words = text.split(' ')
  const lines: string[] = []
  let currentLine = ''

  for (const word of words) {
    const testLine = currentLine ? `${currentLine} ${word}` : word
    const metrics = ctx.measureText(testLine)

    if (metrics.width > maxWidth && currentLine) {
      lines.push(currentLine)
      currentLine = word
    } else {
      currentLine = testLine
    }
  }

  if (currentLine) {
    lines.push(currentLine)
  }

  return lines.length > 0 ? lines : ['']
}

/**
 * Darken a hex color by a given amount (0 to 1).
 */
function darkenColor(hex: string, amount: number): string {
  // Parse hex
  const cleaned = hex.replace('#', '')
  const r = parseInt(cleaned.substring(0, 2), 16)
  const g = parseInt(cleaned.substring(2, 4), 16)
  const b = parseInt(cleaned.substring(4, 6), 16)

  const factor = 1 - amount
  const dr = Math.round(r * factor)
  const dg = Math.round(g * factor)
  const db = Math.round(b * factor)

  return `rgb(${dr}, ${dg}, ${db})`
}

// ─── Sprite Cache ────────────────────────────────────────────────────────────

/**
 * Cache for pre-rendered avatar sprites.
 * Key: JSON hash of avatar config, Value: offscreen canvas.
 */
const spriteCache = new Map<string, OffscreenCanvas>()

/**
 * Get a config hash for sprite caching.
 */
export function getConfigHash(config: AvatarConfig): string {
  return JSON.stringify({
    c: config.body_color,
    s: config.body_shape,
    e: config.eye_style,
    h: config.hat,
    o: config.outfit,
    a: config.accessory,
  })
}

/**
 * Get or create a cached sprite for the given avatar config at a specific facing direction.
 * Returns an OffscreenCanvas that can be drawImage'd onto the main canvas.
 */
export function getCachedSprite(
  config: AvatarConfig,
  facing: FacingDirection
): OffscreenCanvas | null {
  // Only use OffscreenCanvas if available
  if (typeof OffscreenCanvas === 'undefined') return null

  const key = `${getConfigHash(config)}_${facing}`

  if (spriteCache.has(key)) {
    return spriteCache.get(key)!
  }

  const size = BOUNDING_BOX + 20 // Extra space for hat/accessories
  const canvas = new OffscreenCanvas(size, size)
  const offCtx = canvas.getContext('2d')
  if (!offCtx) return null

  // Cast to CanvasRenderingContext2D - the drawing APIs are identical
  const ctx = offCtx as unknown as CanvasRenderingContext2D

  // Draw avatar centered in the offscreen canvas
  ctx.translate(size / 2, size / 2 + 4)
  drawBody(ctx, config.body_color)
  drawEyes(ctx, facing, config.eye_style)
  drawDirectionIndicator(ctx, facing, config.body_color)
  if (config.hat) drawHat(ctx, config.hat)
  if (config.accessory) drawAccessory(ctx, config.accessory)

  spriteCache.set(key, canvas)
  return canvas
}

/**
 * Clear the sprite cache (e.g., when avatar config changes).
 */
export function clearSpriteCache(): void {
  spriteCache.clear()
}
