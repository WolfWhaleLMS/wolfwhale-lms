/**
 * Remote Avatar Interpolation Utilities
 *
 * Remote avatars receive position updates at ~10Hz over the network.
 * These utilities smooth the visual position between known updates
 * using linear interpolation, and detect timeouts for idle/disconnect states.
 */

import type { RemoteAvatarState } from '@/lib/plaza/types'

// ─── Constants ───────────────────────────────────────────────────────────────

/** How long (ms) to interpolate between two positions. Matches broadcast rate. */
const INTERPOLATION_DURATION_MS = 100

/** If no update for this long, assume the remote avatar has stopped moving. */
const IDLE_TIMEOUT_MS = 500

/** If no update for this long, consider the avatar disconnected (gray out). */
const DISCONNECT_TIMEOUT_MS = 10_000

// ─── Linear Interpolation ────────────────────────────────────────────────────

/** Simple scalar lerp. */
export function lerp(a: number, b: number, t: number): number {
  return a + (b - a) * t
}

/** Clamp a value between min and max. */
export function clamp(value: number, min: number, max: number): number {
  return Math.max(min, Math.min(max, value))
}

// ─── Remote Avatar Update ────────────────────────────────────────────────────

/**
 * Called when a new position broadcast is received for a remote avatar.
 * Sets up the interpolation between the current visual position and the new target.
 */
export function applyRemoteUpdate(
  avatar: RemoteAvatarState,
  newX: number,
  newY: number,
  newFacing: RemoteAvatarState['facing'],
  now: number = performance.now()
): RemoteAvatarState {
  return {
    ...avatar,
    prevX: avatar.x,
    prevY: avatar.y,
    targetX: newX,
    targetY: newY,
    facing: newFacing,
    isMoving: true,
    lastUpdateTime: now,
    interpolationProgress: 0,
  }
}

/**
 * Advance interpolation for a remote avatar by delta time.
 * Returns the updated avatar state with new visual (x, y) position.
 */
export function interpolateRemoteAvatar(
  avatar: RemoteAvatarState,
  dt: number,
  now: number = performance.now()
): RemoteAvatarState {
  const timeSinceUpdate = now - avatar.lastUpdateTime

  // Check for disconnect
  if (timeSinceUpdate > DISCONNECT_TIMEOUT_MS) {
    return {
      ...avatar,
      isMoving: false,
    }
  }

  // Check for idle
  if (timeSinceUpdate > IDLE_TIMEOUT_MS) {
    return {
      ...avatar,
      x: avatar.targetX,
      y: avatar.targetY,
      isMoving: false,
      interpolationProgress: 1,
    }
  }

  // Advance interpolation progress
  const progressDelta = (dt * 1000) / INTERPOLATION_DURATION_MS
  const newProgress = clamp(avatar.interpolationProgress + progressDelta, 0, 1)

  // Smoothstep for slightly nicer motion
  const t = smoothstep(newProgress)

  return {
    ...avatar,
    x: lerp(avatar.prevX, avatar.targetX, t),
    y: lerp(avatar.prevY, avatar.targetY, t),
    interpolationProgress: newProgress,
  }
}

// ─── Status Checks ───────────────────────────────────────────────────────────

/**
 * Check if a remote avatar should be considered idle (stopped moving but still connected).
 */
export function isRemoteIdle(avatar: RemoteAvatarState, now: number = performance.now()): boolean {
  const elapsed = now - avatar.lastUpdateTime
  return elapsed > IDLE_TIMEOUT_MS && elapsed <= DISCONNECT_TIMEOUT_MS
}

/**
 * Check if a remote avatar should be considered disconnected (grayed out or removed).
 */
export function isRemoteDisconnected(
  avatar: RemoteAvatarState,
  now: number = performance.now()
): boolean {
  return now - avatar.lastUpdateTime > DISCONNECT_TIMEOUT_MS
}

// ─── Smoothstep ──────────────────────────────────────────────────────────────

/** Hermite smoothstep for smoother interpolation. */
function smoothstep(t: number): number {
  return t * t * (3 - 2 * t)
}

// ─── Factory ─────────────────────────────────────────────────────────────────

/**
 * Create a new RemoteAvatarState from initial presence data.
 */
export function createRemoteAvatar(
  userId: string,
  displayName: string,
  avatarConfig: RemoteAvatarState['avatarConfig'],
  x: number,
  y: number,
  facing: RemoteAvatarState['facing']
): RemoteAvatarState {
  return {
    userId,
    displayName,
    avatarConfig,
    x,
    y,
    prevX: x,
    prevY: y,
    targetX: x,
    targetY: y,
    facing,
    isMoving: false,
    lastUpdateTime: performance.now(),
    interpolationProgress: 1,
    chatBubble: null,
  }
}
