/**
 * Collision Detection Utilities for the Virtual Plaza
 *
 * Provides AABB, circle-rect, point-in-rect, and wall-sliding
 * collision logic used by the game loop to keep avatars within
 * walkable areas and prevent overlap with buildings/obstacles.
 */

import type { CollisionRect, WalkableBounds, BuildingDef } from '@/lib/plaza/types'

// ─── AABB Collision ──────────────────────────────────────────────────────────

/** Check if two axis-aligned bounding boxes overlap. */
export function aabbCollision(
  ax: number, ay: number, aw: number, ah: number,
  bx: number, by: number, bw: number, bh: number
): boolean {
  return (
    ax < bx + bw &&
    ax + aw > bx &&
    ay < by + bh &&
    ay + ah > by
  )
}

/** Check if two CollisionRect objects overlap. */
export function rectsOverlap(a: CollisionRect, b: CollisionRect): boolean {
  return aabbCollision(a.x, a.y, a.width, a.height, b.x, b.y, b.width, b.height)
}

// ─── Circle-Rectangle Collision ──────────────────────────────────────────────

/**
 * Check if a circle overlaps with an axis-aligned rectangle.
 * Used for avatar (circle) vs building/obstacle (rect) collision.
 */
export function circleRectCollision(
  cx: number, cy: number, radius: number,
  rx: number, ry: number, rw: number, rh: number
): boolean {
  // Find the closest point on the rectangle to the circle center
  const closestX = Math.max(rx, Math.min(cx, rx + rw))
  const closestY = Math.max(ry, Math.min(cy, ry + rh))

  const distX = cx - closestX
  const distY = cy - closestY
  const distSq = distX * distX + distY * distY

  return distSq < radius * radius
}

// ─── Point-in-Rectangle ─────────────────────────────────────────────────────

/** Check if a point (px, py) is inside a rectangle. */
export function pointInRect(
  px: number, py: number,
  rx: number, ry: number, rw: number, rh: number
): boolean {
  return px >= rx && px <= rx + rw && py >= ry && py <= ry + rh
}

/** Check if a point is inside a CollisionRect. */
export function pointInCollisionRect(px: number, py: number, rect: CollisionRect): boolean {
  return pointInRect(px, py, rect.x, rect.y, rect.width, rect.height)
}

// ─── Walkable Bounds Check ───────────────────────────────────────────────────

/**
 * Check if a circle (avatar) at position (cx, cy) with given radius
 * is fully within the walkable bounds.
 */
export function isWithinBounds(
  cx: number, cy: number, radius: number,
  bounds: WalkableBounds
): boolean {
  return (
    cx - radius >= bounds.x1 &&
    cx + radius <= bounds.x2 &&
    cy - radius >= bounds.y1 &&
    cy + radius <= bounds.y2
  )
}

/**
 * Clamp a circle position to stay within walkable bounds.
 * Returns the clamped (x, y).
 */
export function clampToBounds(
  cx: number, cy: number, radius: number,
  bounds: WalkableBounds
): { x: number; y: number } {
  return {
    x: Math.max(bounds.x1 + radius, Math.min(cx, bounds.x2 - radius)),
    y: Math.max(bounds.y1 + radius, Math.min(cy, bounds.y2 - radius)),
  }
}

// ─── Wall Sliding ────────────────────────────────────────────────────────────

/**
 * Attempt to move an avatar circle from (cx, cy) by (dx, dy).
 * If the full move collides with any obstacle, try sliding along each axis
 * independently so the avatar glides along walls instead of stopping dead.
 *
 * Returns the final (x, y) after collision resolution.
 */
export function moveWithSliding(
  cx: number, cy: number,
  dx: number, dy: number,
  radius: number,
  obstacles: CollisionRect[],
  bounds: WalkableBounds
): { x: number; y: number } {
  // Try full movement first
  let newX = cx + dx
  let newY = cy + dy

  const collidesAt = (testX: number, testY: number): boolean => {
    // Check bounds
    if (!isWithinBounds(testX, testY, radius, bounds)) {
      return true
    }
    // Check obstacles
    for (const obs of obstacles) {
      if (circleRectCollision(testX, testY, radius, obs.x, obs.y, obs.width, obs.height)) {
        return true
      }
    }
    return false
  }

  // If no collision with full movement, return directly
  if (!collidesAt(newX, newY)) {
    return { x: newX, y: newY }
  }

  // Try sliding along X only
  const slideX = !collidesAt(cx + dx, cy)
  // Try sliding along Y only
  const slideY = !collidesAt(cx, cy + dy)

  if (slideX && slideY) {
    // Both axes work individually - pick the one closer to intended direction
    // Prefer the axis with larger movement component
    if (Math.abs(dx) >= Math.abs(dy)) {
      return { x: cx + dx, y: cy }
    }
    return { x: cx, y: cy + dy }
  }

  if (slideX) {
    return { x: cx + dx, y: cy }
  }

  if (slideY) {
    return { x: cx, y: cy + dy }
  }

  // Neither axis works - avatar is stuck (e.g., pushing into a corner)
  // Clamp to bounds as a safety measure
  return clampToBounds(cx, cy, radius, bounds)
}

// ─── Building Door Proximity ─────────────────────────────────────────────────

/** Interaction radius in pixels for building doors. */
const DOOR_INTERACTION_RADIUS = 48

/**
 * Find the nearest building whose door is within interaction range
 * of the avatar at (ax, ay). Returns null if none are close enough.
 */
export function getNearbyBuilding(
  ax: number, ay: number,
  buildings: BuildingDef[],
  interactionRadius: number = DOOR_INTERACTION_RADIUS
): BuildingDef | null {
  let nearest: BuildingDef | null = null
  let nearestDistSq = interactionRadius * interactionRadius

  for (const building of buildings) {
    // Door center
    const doorCX = building.doorX + building.doorWidth / 2
    const doorCY = building.doorY + building.doorHeight / 2

    const distX = ax - doorCX
    const distY = ay - doorCY
    const distSq = distX * distX + distY * distY

    if (distSq < nearestDistSq) {
      nearestDistSq = distSq
      nearest = building
    }
  }

  return nearest
}

/**
 * Build a list of CollisionRect from buildings for use in collision checks.
 * Each building's main body is a collision rect (excluding the door area).
 */
export function buildCollisionRectsFromBuildings(buildings: BuildingDef[]): CollisionRect[] {
  const rects: CollisionRect[] = []

  for (const b of buildings) {
    // Main building body
    rects.push({ x: b.x, y: b.y, width: b.width, height: b.height })
  }

  return rects
}
