'use client'

/**
 * PlazaHUD - Heads-up display overlay
 *
 * Displays room name, online count, token balance, and toggle buttons
 * for mini-map and player list. Positioned as a floating overlay
 * on top of the canvas.
 */

import { useState } from 'react'

interface PlazaHUDProps {
  roomName: string
  onlineCount: number
  tokenBalance: number
  onToggleMiniMap?: () => void
  onTogglePlayerList?: () => void
}

export function PlazaHUD({
  roomName,
  onlineCount,
  tokenBalance,
  onToggleMiniMap,
  onTogglePlayerList,
}: PlazaHUDProps) {
  const [showMiniMap, setShowMiniMap] = useState(false)
  const [showPlayerList, setShowPlayerList] = useState(false)

  return (
    <div className="pointer-events-none absolute inset-0 z-40">
      {/* Top bar */}
      <div className="flex items-start justify-between px-4 pt-3">
        {/* Left spacer */}
        <div className="w-24" />

        {/* Room name (top center) */}
        <div
          className="pointer-events-auto rounded-full px-4 py-1.5 text-sm font-semibold text-white"
          style={{
            backgroundColor: 'rgba(26, 26, 46, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.1)',
          }}
        >
          {roomName}
        </div>

        {/* Right side: online count + tokens */}
        <div className="pointer-events-auto flex flex-col items-end gap-1.5">
          {/* Online count */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
            style={{
              backgroundColor: 'rgba(26, 26, 46, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span
              className="inline-block h-2 w-2 rounded-full"
              style={{ backgroundColor: '#10b981' }}
            />
            <span>{onlineCount} online</span>
          </div>

          {/* Token balance */}
          <div
            className="flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-medium text-white"
            style={{
              backgroundColor: 'rgba(26, 26, 46, 0.85)',
              backdropFilter: 'blur(8px)',
              WebkitBackdropFilter: 'blur(8px)',
              border: '1px solid rgba(255, 255, 255, 0.1)',
            }}
          >
            <span style={{ color: '#fbbf24' }}>&#x1FA99;</span>
            <span>{tokenBalance.toLocaleString()}</span>
          </div>
        </div>
      </div>

      {/* Bottom right: toggle buttons (desktop only) */}
      <div className="absolute bottom-4 right-4 hidden md:flex flex-col gap-2">
        {/* Mini-map toggle */}
        <button
          type="button"
          onClick={() => {
            setShowMiniMap(!showMiniMap)
            onToggleMiniMap?.()
          }}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/20"
          style={{
            backgroundColor: showMiniMap
              ? 'rgba(99, 102, 241, 0.8)'
              : 'rgba(26, 26, 46, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
          title="Toggle Mini Map"
          aria-label="Toggle mini map"
        >
          <MapIcon />
        </button>

        {/* Player list toggle */}
        <button
          type="button"
          onClick={() => {
            setShowPlayerList(!showPlayerList)
            onTogglePlayerList?.()
          }}
          className="pointer-events-auto flex h-10 w-10 items-center justify-center rounded-lg text-white transition-colors hover:bg-white/20"
          style={{
            backgroundColor: showPlayerList
              ? 'rgba(99, 102, 241, 0.8)'
              : 'rgba(26, 26, 46, 0.85)',
            backdropFilter: 'blur(8px)',
            WebkitBackdropFilter: 'blur(8px)',
            border: '1px solid rgba(255, 255, 255, 0.15)',
          }}
          title="Toggle Player List"
          aria-label="Toggle player list"
        >
          <PeopleIcon />
        </button>
      </div>

      {/* Keyboard hints (desktop only) */}
      <div className="absolute bottom-4 left-4 hidden md:block">
        <div
          className="rounded-lg px-3 py-2 text-[10px] text-white/60"
          style={{
            backgroundColor: 'rgba(26, 26, 46, 0.6)',
          }}
        >
          <div>WASD / Arrows - Move</div>
          <div>Shift - Sprint</div>
          <div>E / Space - Interact</div>
          <div>C - Chat</div>
        </div>
      </div>
    </div>
  )
}

// ─── Inline SVG Icons ──────────────────────────────────────────────────────

function MapIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <polygon points="1 6 1 22 8 18 16 22 23 18 23 2 16 6 8 2 1 6" />
      <line x1="8" y1="2" x2="8" y2="18" />
      <line x1="16" y1="6" x2="16" y2="22" />
    </svg>
  )
}

function PeopleIcon() {
  return (
    <svg
      width="18"
      height="18"
      viewBox="0 0 24 24"
      fill="none"
      stroke="currentColor"
      strokeWidth="2"
      strokeLinecap="round"
      strokeLinejoin="round"
    >
      <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2" />
      <circle cx="9" cy="7" r="4" />
      <path d="M23 21v-2a4 4 0 0 0-3-3.87" />
      <path d="M16 3.13a4 4 0 0 1 0 7.75" />
    </svg>
  )
}
