/**
 * PlazaGameLoop - Core Canvas2D Rendering Engine
 *
 * Manages the requestAnimationFrame loop, processing input, moving avatars
 * with collision detection, interpolating remote players, following the
 * camera, and drawing everything to the canvas in Y-sorted depth order.
 *
 * The game loop is decoupled from React - it runs on raw canvas/RAF
 * and communicates via callbacks. The React wrapper (PlazaCanvas) sets
 * up the loop and passes event handlers.
 */

import type {
  AvatarState,
  AvatarConfig,
  RemoteAvatarState,
  RoomData,
  CameraState,
  ChatBubbleState,
  FacingDirection,
  InputState,
  BuildingDef,
  DecorationDef,
  GameLoopCallbacks,
} from './types'

import { drawAvatar, drawChatBubble } from '@/components/plaza/AvatarSprite'
import { moveWithSliding, getNearbyBuilding, clampToBounds } from '@/components/plaza/utils/collision'
import { interpolateRemoteAvatar, isRemoteDisconnected } from '@/components/plaza/utils/interpolation'

// ─── Constants ───────────────────────────────────────────────────────────────

const WALK_SPEED = 120   // pixels per second
const SPRINT_SPEED = 180 // pixels per second
const AVATAR_RADIUS = 8  // collision circle radius
const BROADCAST_INTERVAL_MS = 100 // 10Hz position broadcast
const CHAT_BUBBLE_DURATION = 5000 // ms
const CHAT_BUBBLE_FADE_TIME = 500 // ms
const CHAT_BUBBLE_POP_DURATION = 200 // ms

// ─── Color Palette ───────────────────────────────────────────────────────────

const COLORS = {
  ground: '#2d3748',
  grass: '#1a4731',
  paths: '#4a5568',
  water: '#2563eb',
  walls: '#374151',
  doorGlow: 'rgba(251, 191, 36, 0.4)',
  interactionPrompt: '#fbbf24',
} as const

// ─── Building Roof Colors ────────────────────────────────────────────────────

const ROOF_COLORS: Record<string, string> = {
  game_house: '#ef4444',
  store: '#8b5cf6',
  study_hall: '#3b82f6',
  theater: '#02C2AD',
}

// ─── Game Loop Class ─────────────────────────────────────────────────────────

export class PlazaGameLoop {
  private canvas: HTMLCanvasElement
  private ctx: CanvasRenderingContext2D
  private lastTime: number = 0
  private running: boolean = false
  private rafId: number = 0

  // State
  private localAvatar: AvatarState
  private remoteAvatars: Map<string, RemoteAvatarState> = new Map()
  private room: RoomData
  private camera: CameraState
  private chatBubbles: Map<string, ChatBubbleState> = new Map()

  // Input
  private input: InputState = {
    up: false,
    down: false,
    left: false,
    right: false,
    sprint: false,
    interact: false,
    chat: false,
  }
  private clickTarget: { x: number; y: number } | null = null

  // Broadcast throttle
  private lastBroadcastTime: number = 0
  private lastBroadcastX: number = 0
  private lastBroadcastY: number = 0

  // Offscreen canvas for static background
  private bgCanvas: OffscreenCanvas | HTMLCanvasElement | null = null
  private bgDirty: boolean = true

  // Callbacks
  private callbacks: GameLoopCallbacks

  // Nearby building (for interaction prompts)
  private nearbyBuilding: BuildingDef | null = null

  // Animation time
  private animTime: number = 0

  constructor(
    canvas: HTMLCanvasElement,
    room: RoomData,
    avatarState: AvatarState,
    callbacks: GameLoopCallbacks = {}
  ) {
    this.canvas = canvas
    const ctx = canvas.getContext('2d')
    if (!ctx) throw new Error('Failed to get Canvas2D context')
    this.ctx = ctx

    this.room = room
    this.localAvatar = avatarState
    this.callbacks = callbacks

    this.camera = {
      x: 0,
      y: 0,
      zoom: 1,
      viewWidth: canvas.width,
      viewHeight: canvas.height,
    }

    // Immediately center camera on the avatar
    this.snapCamera()
  }

  // ─── Public API ──────────────────────────────────────────────────────────

  start(): void {
    if (this.running) return
    this.running = true
    this.lastTime = performance.now()
    this.rafId = requestAnimationFrame(this.tick)
  }

  stop(): void {
    this.running = false
    if (this.rafId) {
      cancelAnimationFrame(this.rafId)
      this.rafId = 0
    }
  }

  /** Update canvas dimensions (call after resize). */
  resize(width: number, height: number): void {
    this.camera.viewWidth = width
    this.camera.viewHeight = height
    this.bgDirty = true
  }

  /** Set a key in the input state. */
  setInput(key: keyof InputState, value: boolean): void {
    this.input[key] = value
  }

  /** Set a click-to-move target in world coordinates. */
  setClickTarget(worldX: number, worldY: number): void {
    this.clickTarget = { x: worldX, y: worldY }
  }

  /** Convert screen coordinates to world coordinates. */
  screenToWorld(screenX: number, screenY: number): { x: number; y: number } {
    return {
      x: screenX / this.camera.zoom + this.camera.x,
      y: screenY / this.camera.zoom + this.camera.y,
    }
  }

  /** Set movement from a joystick (dx, dy are -1 to 1). */
  setJoystickInput(dx: number, dy: number): void {
    // Map joystick to input state
    const deadzone = 0.15
    this.input.left = dx < -deadzone
    this.input.right = dx > deadzone
    this.input.up = dy < -deadzone
    this.input.down = dy > deadzone
    // Speed proportional to joystick distance
    const distance = Math.sqrt(dx * dx + dy * dy)
    this.input.sprint = distance > 0.75
  }

  /** Clear joystick input. */
  clearJoystickInput(): void {
    this.input.left = false
    this.input.right = false
    this.input.up = false
    this.input.down = false
    this.input.sprint = false
  }

  /** Update a remote avatar's position from a broadcast. */
  updateRemoteAvatar(
    userId: string,
    x: number,
    y: number,
    facing: FacingDirection
  ): void {
    const existing = this.remoteAvatars.get(userId)
    if (existing) {
      existing.prevX = existing.x
      existing.prevY = existing.y
      existing.targetX = x
      existing.targetY = y
      existing.facing = facing
      existing.isMoving = true
      existing.lastUpdateTime = performance.now()
      existing.interpolationProgress = 0
    }
  }

  /** Add a remote avatar to the scene. */
  addRemoteAvatar(avatar: RemoteAvatarState): void {
    this.remoteAvatars.set(avatar.userId, avatar)
  }

  /** Remove a remote avatar from the scene. */
  removeRemoteAvatar(userId: string): void {
    this.remoteAvatars.delete(userId)
    this.chatBubbles.delete(userId)
  }

  /** Show a chat bubble above an avatar. */
  showChatBubble(userId: string, phrase: string): void {
    this.chatBubbles.set(userId, {
      userId,
      phrase,
      startTime: performance.now(),
      duration: CHAT_BUBBLE_DURATION,
      fadeStartTime: CHAT_BUBBLE_FADE_TIME,
      opacity: 1,
      scale: 0.5, // Start small for pop-in animation
    })
  }

  /** Update room data (e.g., after room transition). */
  setRoom(room: RoomData): void {
    this.room = room
    this.bgDirty = true
    this.remoteAvatars.clear()
    this.chatBubbles.clear()
  }

  /** Update local avatar config (e.g., after equipping items). */
  setAvatarConfig(config: AvatarConfig): void {
    this.localAvatar.avatarConfig = config
  }

  /** Get current local avatar position. */
  getLocalPosition(): { x: number; y: number; facing: FacingDirection } {
    return {
      x: this.localAvatar.x,
      y: this.localAvatar.y,
      facing: this.localAvatar.facing,
    }
  }

  /** Get the currently nearby building (for UI). */
  getNearbyBuilding(): BuildingDef | null {
    return this.nearbyBuilding
  }

  /** Get the number of remote avatars currently rendered. */
  getRemoteCount(): number {
    return this.remoteAvatars.size
  }

  /** Trigger interaction with nearby building. */
  interact(): void {
    if (this.nearbyBuilding) {
      this.callbacks.onBuildingInteract?.(this.nearbyBuilding)
    }
  }

  // ─── Main Loop ───────────────────────────────────────────────────────────

  private tick = (now: number): void => {
    if (!this.running) return

    // Cap delta time to prevent huge jumps (e.g., tab was hidden)
    const dt = Math.min((now - this.lastTime) / 1000, 0.1)
    this.lastTime = now
    this.animTime = now

    // Pause when tab is hidden
    if (typeof document !== 'undefined' && document.hidden) {
      this.rafId = requestAnimationFrame(this.tick)
      return
    }

    this.update(dt, now)
    this.render(now)
    this.rafId = requestAnimationFrame(this.tick)
  }

  // ─── Update Phase ────────────────────────────────────────────────────────

  private update(dt: number, now: number): void {
    // 1. Process input and move local avatar
    this.processMovement(dt)

    // 2. Handle click-to-move
    this.processClickToMove(dt)

    // 3. Check nearby buildings
    this.nearbyBuilding = getNearbyBuilding(
      this.localAvatar.x,
      this.localAvatar.y,
      this.room.buildings
    )

    // 4. Interpolate remote avatars
    this.remoteAvatars.forEach((avatar, userId) => {
      const updated = interpolateRemoteAvatar(avatar, dt, now)
      this.remoteAvatars.set(userId, updated)
    })

    // 5. Update camera
    this.updateCamera(dt)

    // 6. Update chat bubbles
    this.updateChatBubbles(now)

    // 7. Broadcast position if changed (throttled)
    this.maybeBroadcast(now)

    // 8. Handle interact input
    if (this.input.interact) {
      this.input.interact = false
      this.interact()
    }

    // 9. Handle chat input
    if (this.input.chat) {
      this.input.chat = false
      this.callbacks.onRequestChat?.()
    }
  }

  private processMovement(dt: number): void {
    let dx = 0
    let dy = 0

    if (this.input.left) dx -= 1
    if (this.input.right) dx += 1
    if (this.input.up) dy -= 1
    if (this.input.down) dy += 1

    // If keyboard is active, cancel click-to-move
    if (dx !== 0 || dy !== 0) {
      this.clickTarget = null
    }

    // Normalize diagonal
    if (dx !== 0 && dy !== 0) {
      const invSqrt2 = 1 / Math.SQRT2
      dx *= invSqrt2
      dy *= invSqrt2
    }

    const speed = this.input.sprint ? SPRINT_SPEED : WALK_SPEED
    const moveX = dx * speed * dt
    const moveY = dy * speed * dt

    if (moveX !== 0 || moveY !== 0) {
      const result = moveWithSliding(
        this.localAvatar.x,
        this.localAvatar.y,
        moveX,
        moveY,
        AVATAR_RADIUS,
        this.room.collisionRects,
        this.room.walkableBounds
      )

      this.localAvatar.x = result.x
      this.localAvatar.y = result.y
      this.localAvatar.isMoving = true
      this.localAvatar.speed = speed

      // Determine facing direction from dominant movement axis
      if (Math.abs(dx) > Math.abs(dy)) {
        this.localAvatar.facing = dx > 0 ? 'right' : 'left'
      } else {
        this.localAvatar.facing = dy > 0 ? 'down' : 'up'
      }
    } else if (!this.clickTarget) {
      this.localAvatar.isMoving = false
      this.localAvatar.speed = 0
    }
  }

  private processClickToMove(dt: number): void {
    if (!this.clickTarget) return

    const targetX = this.clickTarget.x
    const targetY = this.clickTarget.y

    const diffX = targetX - this.localAvatar.x
    const diffY = targetY - this.localAvatar.y
    const distance = Math.sqrt(diffX * diffX + diffY * diffY)

    // Arrived at destination
    if (distance < 4) {
      this.clickTarget = null
      this.localAvatar.isMoving = false
      this.localAvatar.speed = 0
      return
    }

    // Normalize and move
    const speed = WALK_SPEED
    const ndx = diffX / distance
    const ndy = diffY / distance
    const moveX = ndx * speed * dt
    const moveY = ndy * speed * dt

    // Don't overshoot
    const actualMoveX = Math.abs(moveX) > Math.abs(diffX) ? diffX : moveX
    const actualMoveY = Math.abs(moveY) > Math.abs(diffY) ? diffY : moveY

    const result = moveWithSliding(
      this.localAvatar.x,
      this.localAvatar.y,
      actualMoveX,
      actualMoveY,
      AVATAR_RADIUS,
      this.room.collisionRects,
      this.room.walkableBounds
    )

    // If we couldn't move (stuck on collision), cancel click-to-move
    if (
      Math.abs(result.x - this.localAvatar.x) < 0.01 &&
      Math.abs(result.y - this.localAvatar.y) < 0.01
    ) {
      this.clickTarget = null
      this.localAvatar.isMoving = false
      return
    }

    this.localAvatar.x = result.x
    this.localAvatar.y = result.y
    this.localAvatar.isMoving = true
    this.localAvatar.speed = speed

    // Set facing from movement direction
    if (Math.abs(ndx) > Math.abs(ndy)) {
      this.localAvatar.facing = ndx > 0 ? 'right' : 'left'
    } else {
      this.localAvatar.facing = ndy > 0 ? 'down' : 'up'
    }
  }

  private updateCamera(dt: number): void {
    const targetX = this.localAvatar.x - this.camera.viewWidth / (2 * this.camera.zoom)
    const targetY = this.localAvatar.y - this.camera.viewHeight / (2 * this.camera.zoom)

    // Smooth lerp follow
    const lerpFactor = 1 - Math.pow(0.001, dt)
    this.camera.x += (targetX - this.camera.x) * lerpFactor
    this.camera.y += (targetY - this.camera.y) * lerpFactor

    // Clamp to room bounds
    const maxX = this.room.width - this.camera.viewWidth / this.camera.zoom
    const maxY = this.room.height - this.camera.viewHeight / this.camera.zoom
    this.camera.x = Math.max(0, Math.min(this.camera.x, maxX))
    this.camera.y = Math.max(0, Math.min(this.camera.y, maxY))
  }

  private snapCamera(): void {
    this.camera.x = this.localAvatar.x - this.camera.viewWidth / (2 * this.camera.zoom)
    this.camera.y = this.localAvatar.y - this.camera.viewHeight / (2 * this.camera.zoom)

    const maxX = this.room.width - this.camera.viewWidth / this.camera.zoom
    const maxY = this.room.height - this.camera.viewHeight / this.camera.zoom
    this.camera.x = Math.max(0, Math.min(this.camera.x, maxX))
    this.camera.y = Math.max(0, Math.min(this.camera.y, maxY))
  }

  private updateChatBubbles(now: number): void {
    this.chatBubbles.forEach((bubble, userId) => {
      const elapsed = now - bubble.startTime
      const remaining = bubble.duration - elapsed

      // Pop-in animation (scale 0.5 to 1.0 over 200ms)
      if (elapsed < CHAT_BUBBLE_POP_DURATION) {
        bubble.scale = 0.5 + 0.5 * (elapsed / CHAT_BUBBLE_POP_DURATION)
      } else {
        bubble.scale = 1.0
      }

      // Fade out in the last fadeStartTime ms
      if (remaining <= 0) {
        this.chatBubbles.delete(userId)
      } else if (remaining < bubble.fadeStartTime) {
        bubble.opacity = remaining / bubble.fadeStartTime
      } else {
        bubble.opacity = 1.0
      }
    })
  }

  private maybeBroadcast(now: number): void {
    if (now - this.lastBroadcastTime < BROADCAST_INTERVAL_MS) return

    // Only broadcast if position changed
    const dx = this.localAvatar.x - this.lastBroadcastX
    const dy = this.localAvatar.y - this.lastBroadcastY

    if (!this.localAvatar.isMoving && Math.abs(dx) < 1 && Math.abs(dy) < 1) return

    this.lastBroadcastTime = now
    this.lastBroadcastX = this.localAvatar.x
    this.lastBroadcastY = this.localAvatar.y

    this.callbacks.onPositionChange?.(
      Math.round(this.localAvatar.x),
      Math.round(this.localAvatar.y),
      this.localAvatar.facing
    )
  }

  // ─── Render Phase ────────────────────────────────────────────────────────

  private render(now: number): void {
    const ctx = this.ctx
    const w = this.canvas.width
    const h = this.canvas.height

    // Clear
    ctx.clearRect(0, 0, w, h)

    ctx.save()

    // Apply camera transform
    ctx.scale(this.camera.zoom, this.camera.zoom)
    ctx.translate(-this.camera.x, -this.camera.y)

    // 1. Draw background
    this.drawBackground()

    // 2. Draw decorations (below avatars)
    this.drawDecorations(now)

    // 3. Draw buildings
    this.drawBuildings()

    // 4. Draw click-to-move indicator
    this.drawClickIndicator(now)

    // 5. Collect all avatars and sort by Y for depth
    this.drawAllAvatars(now)

    // 6. Draw interaction prompts
    this.drawInteractionPrompts()

    ctx.restore()
  }

  // ─── Draw Sub-Routines ───────────────────────────────────────────────────

  private drawBackground(): void {
    const ctx = this.ctx

    // Ground fill
    ctx.fillStyle = this.room.backgroundColor || COLORS.ground
    ctx.fillRect(0, 0, this.room.width, this.room.height)

    // Draw path areas from decorations
    for (const dec of this.room.decorations) {
      if (dec.type === 'path') {
        ctx.fillStyle = COLORS.paths
        ctx.fillRect(dec.x, dec.y, dec.width, dec.height)
      }
    }
  }

  private drawDecorations(now: number): void {
    const ctx = this.ctx
    const cam = this.camera
    const buffer = 64

    // Culling viewport
    const viewLeft = cam.x - buffer
    const viewRight = cam.x + cam.viewWidth / cam.zoom + buffer
    const viewTop = cam.y - buffer
    const viewBottom = cam.y + cam.viewHeight / cam.zoom + buffer

    for (const dec of this.room.decorations) {
      // Spatial culling
      if (
        dec.x + dec.width < viewLeft ||
        dec.x > viewRight ||
        dec.y + dec.height < viewTop ||
        dec.y > viewBottom
      ) {
        continue
      }

      switch (dec.type) {
        case 'tree':
          this.drawTree(ctx, dec)
          break
        case 'flower':
          this.drawFlower(ctx, dec)
          break
        case 'bench':
          this.drawBench(ctx, dec)
          break
        case 'lamppost':
          this.drawLamppost(ctx, dec)
          break
        case 'fountain':
          this.drawFountain(ctx, dec, now)
          break
        // 'path' is drawn in drawBackground
      }
    }
  }

  private drawTree(ctx: CanvasRenderingContext2D, dec: DecorationDef): void {
    // Trunk
    ctx.fillStyle = '#5D4E37'
    const trunkW = 6
    const trunkH = 12
    ctx.fillRect(
      dec.x + dec.width / 2 - trunkW / 2,
      dec.y + dec.height - trunkH,
      trunkW,
      trunkH
    )

    // Foliage (layered circles)
    ctx.fillStyle = dec.color || '#22543d'
    const cx = dec.x + dec.width / 2
    const baseY = dec.y + dec.height - trunkH
    ctx.beginPath()
    ctx.arc(cx, baseY - 6, 10, 0, Math.PI * 2)
    ctx.fill()
    ctx.fillStyle = '#276749'
    ctx.beginPath()
    ctx.arc(cx - 4, baseY - 3, 7, 0, Math.PI * 2)
    ctx.fill()
    ctx.beginPath()
    ctx.arc(cx + 4, baseY - 3, 7, 0, Math.PI * 2)
    ctx.fill()
  }

  private drawFlower(ctx: CanvasRenderingContext2D, dec: DecorationDef): void {
    const colors = ['#f472b6', '#fb923c', '#fbbf24', '#a78bfa', '#f87171']
    const cx = dec.x + dec.width / 2
    const cy = dec.y + dec.height / 2

    for (let i = 0; i < 5; i++) {
      const angle = (i / 5) * Math.PI * 2
      const fx = cx + Math.cos(angle) * 4
      const fy = cy + Math.sin(angle) * 4
      ctx.fillStyle = colors[i % colors.length]
      ctx.beginPath()
      ctx.arc(fx, fy, 3, 0, Math.PI * 2)
      ctx.fill()
    }
    // Center
    ctx.fillStyle = '#fef08a'
    ctx.beginPath()
    ctx.arc(cx, cy, 2, 0, Math.PI * 2)
    ctx.fill()
  }

  private drawBench(ctx: CanvasRenderingContext2D, dec: DecorationDef): void {
    ctx.fillStyle = '#8B6914'
    ctx.fillRect(dec.x, dec.y, dec.width, dec.height)
    // Slats
    ctx.strokeStyle = '#6B4F12'
    ctx.lineWidth = 1
    for (let i = 0; i < 3; i++) {
      const lineY = dec.y + (dec.height / 4) * (i + 1)
      ctx.beginPath()
      ctx.moveTo(dec.x, lineY)
      ctx.lineTo(dec.x + dec.width, lineY)
      ctx.stroke()
    }
  }

  private drawLamppost(ctx: CanvasRenderingContext2D, dec: DecorationDef): void {
    const cx = dec.x + dec.width / 2
    // Post
    ctx.strokeStyle = '#9CA3AF'
    ctx.lineWidth = 3
    ctx.beginPath()
    ctx.moveTo(cx, dec.y + dec.height)
    ctx.lineTo(cx, dec.y + 6)
    ctx.stroke()

    // Light glow
    ctx.fillStyle = 'rgba(251, 191, 36, 0.3)'
    ctx.beginPath()
    ctx.arc(cx, dec.y + 4, 10, 0, Math.PI * 2)
    ctx.fill()

    // Light bulb
    ctx.fillStyle = '#FBBF24'
    ctx.beginPath()
    ctx.arc(cx, dec.y + 4, 4, 0, Math.PI * 2)
    ctx.fill()
  }

  private drawFountain(ctx: CanvasRenderingContext2D, dec: DecorationDef, now: number): void {
    const cx = dec.x + dec.width / 2
    const cy = dec.y + dec.height / 2

    // Base pool
    ctx.fillStyle = '#1e3a5f'
    ctx.beginPath()
    ctx.ellipse(cx, cy, dec.width / 2, dec.height / 2.5, 0, 0, Math.PI * 2)
    ctx.fill()

    // Water surface
    ctx.fillStyle = COLORS.water
    ctx.beginPath()
    ctx.ellipse(cx, cy, dec.width / 2 - 3, dec.height / 2.5 - 3, 0, 0, Math.PI * 2)
    ctx.fill()

    // Animated ripples
    const ripplePhase = (now / 1000) % 3
    for (let i = 0; i < 3; i++) {
      const rippleT = ((ripplePhase + i) % 3) / 3
      const rippleRadius = 8 + rippleT * 20
      const rippleAlpha = 0.4 * (1 - rippleT)
      ctx.strokeStyle = `rgba(96, 165, 250, ${rippleAlpha})`
      ctx.lineWidth = 1.5
      ctx.beginPath()
      ctx.arc(cx, cy, rippleRadius, 0, Math.PI * 2)
      ctx.stroke()
    }

    // Center spout
    ctx.fillStyle = '#93c5fd'
    ctx.beginPath()
    ctx.arc(cx, cy, 3, 0, Math.PI * 2)
    ctx.fill()
  }

  private drawBuildings(): void {
    const ctx = this.ctx

    for (const building of this.room.buildings) {
      // Wall
      ctx.fillStyle = building.wallColor || COLORS.walls
      ctx.fillRect(building.x, building.y, building.width, building.height)

      // Wall outline
      ctx.strokeStyle = '#1f2937'
      ctx.lineWidth = 2
      ctx.strokeRect(building.x, building.y, building.width, building.height)

      // Roof (trapezoid on top)
      const roofColor = building.roofColor || ROOF_COLORS[building.slug] || '#6b7280'
      ctx.fillStyle = roofColor
      const roofOverhang = 8
      ctx.beginPath()
      ctx.moveTo(building.x - roofOverhang, building.y)
      ctx.lineTo(building.x + building.width / 4, building.y - 20)
      ctx.lineTo(building.x + building.width * 3 / 4, building.y - 20)
      ctx.lineTo(building.x + building.width + roofOverhang, building.y)
      ctx.closePath()
      ctx.fill()
      ctx.strokeStyle = '#1f2937'
      ctx.lineWidth = 1.5
      ctx.stroke()

      // Door
      ctx.fillStyle = '#1f2937'
      ctx.fillRect(
        building.doorX,
        building.doorY,
        building.doorWidth,
        building.doorHeight
      )

      // Door knob
      ctx.fillStyle = '#D4AF37'
      ctx.beginPath()
      ctx.arc(
        building.doorX + building.doorWidth - 4,
        building.doorY + building.doorHeight / 2,
        2,
        0,
        Math.PI * 2
      )
      ctx.fill()

      // Building label
      ctx.save()
      ctx.fillStyle = '#FFFFFF'
      ctx.font = 'bold 11px sans-serif'
      ctx.textAlign = 'center'
      ctx.textBaseline = 'middle'
      ctx.shadowColor = 'rgba(0, 0, 0, 0.6)'
      ctx.shadowBlur = 3
      ctx.fillText(
        building.label || building.name,
        building.x + building.width / 2,
        building.y + building.height / 2 - 8
      )
      ctx.restore()
    }
  }

  private drawClickIndicator(now: number): void {
    if (!this.clickTarget) return

    const ctx = this.ctx
    const pulse = (Math.sin(now / 300) + 1) / 2 // 0 to 1 oscillation
    const radius = 4 + pulse * 3

    ctx.fillStyle = `rgba(251, 191, 36, ${0.3 + pulse * 0.3})`
    ctx.beginPath()
    ctx.arc(this.clickTarget.x, this.clickTarget.y, radius, 0, Math.PI * 2)
    ctx.fill()

    ctx.strokeStyle = `rgba(251, 191, 36, ${0.6 + pulse * 0.4})`
    ctx.lineWidth = 1.5
    ctx.beginPath()
    ctx.arc(this.clickTarget.x, this.clickTarget.y, radius + 2, 0, Math.PI * 2)
    ctx.stroke()
  }

  private drawAllAvatars(now: number): void {
    // Collect all avatars into a sortable array
    type DrawEntry = {
      x: number
      y: number
      draw: () => void
    }

    const entries: DrawEntry[] = []

    // Local avatar
    entries.push({
      x: this.localAvatar.x,
      y: this.localAvatar.y,
      draw: () => {
        drawAvatar(
          this.ctx,
          this.localAvatar.avatarConfig,
          this.localAvatar.x,
          this.localAvatar.y,
          this.localAvatar.facing,
          this.localAvatar.isMoving,
          this.localAvatar.displayName,
          1.0,
          now,
          1.0
        )

        // Chat bubble for local avatar
        const localBubble = this.chatBubbles.get(this.localAvatar.userId)
        if (localBubble) {
          drawChatBubble(
            this.ctx,
            localBubble.phrase,
            this.localAvatar.x,
            this.localAvatar.y,
            localBubble.opacity,
            localBubble.scale
          )
        }
      },
    })

    // Remote avatars
    this.remoteAvatars.forEach((avatar) => {
      // Spatial culling
      if (!this.isInView(avatar.x, avatar.y)) return

      const disconnected = isRemoteDisconnected(avatar)
      entries.push({
        x: avatar.x,
        y: avatar.y,
        draw: () => {
          drawAvatar(
            this.ctx,
            avatar.avatarConfig,
            avatar.x,
            avatar.y,
            avatar.facing,
            avatar.isMoving,
            avatar.displayName,
            1.0,
            now,
            disconnected ? 0.4 : 1.0
          )

          // Chat bubble for remote avatar
          const bubble = this.chatBubbles.get(avatar.userId)
          if (bubble) {
            drawChatBubble(
              this.ctx,
              bubble.phrase,
              avatar.x,
              avatar.y,
              bubble.opacity,
              bubble.scale
            )
          }
        },
      })
    })

    // Y-sort for depth (lower Y = rendered first = behind)
    entries.sort((a, b) => a.y - b.y)

    // Draw in order
    for (const entry of entries) {
      entry.draw()
    }
  }

  private drawInteractionPrompts(): void {
    if (!this.nearbyBuilding) return

    const ctx = this.ctx
    const building = this.nearbyBuilding
    const doorCX = building.doorX + building.doorWidth / 2
    const doorCY = building.doorY - 8

    // Glow around door
    ctx.fillStyle = COLORS.doorGlow
    ctx.beginPath()
    ctx.arc(
      building.doorX + building.doorWidth / 2,
      building.doorY + building.doorHeight / 2,
      24,
      0,
      Math.PI * 2
    )
    ctx.fill()

    // Prompt text
    ctx.save()
    ctx.fillStyle = COLORS.interactionPrompt
    ctx.font = 'bold 10px sans-serif'
    ctx.textAlign = 'center'
    ctx.textBaseline = 'bottom'
    ctx.shadowColor = 'rgba(0, 0, 0, 0.8)'
    ctx.shadowBlur = 3

    const promptText = 'Press E to Enter'
    ctx.fillText(promptText, doorCX, doorCY - 4)
    ctx.restore()
  }

  // ─── Helpers ─────────────────────────────────────────────────────────────

  private isInView(worldX: number, worldY: number, buffer: number = 64): boolean {
    const cam = this.camera
    return (
      worldX > cam.x - buffer &&
      worldX < cam.x + cam.viewWidth / cam.zoom + buffer &&
      worldY > cam.y - buffer &&
      worldY < cam.y + cam.viewHeight / cam.zoom + buffer
    )
  }
}
