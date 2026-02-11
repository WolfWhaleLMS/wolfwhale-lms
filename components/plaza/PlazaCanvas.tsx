'use client'

/**
 * PlazaCanvas - React component wrapping the Canvas2D game engine
 *
 * Full-size canvas element with proper DPI handling. Initializes
 * PlazaGameLoop, handles window resize, passes keyboard/touch events
 * to the game loop, and provides an overlay div for HTML UI elements.
 */

import { useEffect, useRef, useState, useCallback } from 'react'
import { PlazaGameLoop } from '@/lib/plaza/game-loop'
import { usePlazaCanvas } from './hooks/usePlazaCanvas'
import { usePlazaMovement } from './hooks/usePlazaMovement'
import { VirtualJoystick } from './VirtualJoystick'
import { ActionButton } from './ActionButton'
import { PlazaHUD } from './PlazaHUD'
import { ChatPhraseSelector } from './ChatPhraseSelector'
import { PlazaLoading } from './PlazaLoading'

import type {
  AvatarState,
  RoomData,
  FacingDirection,
  BuildingDef,
  ChatPhrase,
} from '@/lib/plaza/types'

interface PlazaCanvasProps {
  /** Room data defining the current map. */
  roomData: RoomData
  /** Initial local avatar state. */
  initialAvatar: AvatarState
  /** Room display name for the HUD. */
  roomName: string
  /** Number of users currently online in this room. */
  onlineCount?: number
  /** Current token balance. */
  tokenBalance?: number
  /** Called when the local avatar position changes (for broadcasting). */
  onPositionChange?: (x: number, y: number, facing: FacingDirection) => void
  /** Called when the player interacts with a building door. */
  onBuildingInteract?: (building: BuildingDef) => void
  /** Called when a chat phrase is selected. */
  onChatPhrase?: (phrase: ChatPhrase) => void
  /** Available chat phrases. */
  chatPhrases?: ChatPhrase[]
  /** Whether the engine is still loading initial data. */
  isLoading?: boolean
}

export function PlazaCanvas({
  roomData,
  initialAvatar,
  roomName,
  onlineCount = 1,
  tokenBalance = 0,
  onPositionChange,
  onBuildingInteract,
  onChatPhrase,
  chatPhrases,
  isLoading = false,
}: PlazaCanvasProps) {
  const { canvasRef, containerRef, dimensions } = usePlazaCanvas()
  const [gameLoop, setGameLoop] = useState<PlazaGameLoop | null>(null)
  const [isChatOpen, setIsChatOpen] = useState(false)
  const [showLoading, setShowLoading] = useState(isLoading)
  const gameLoopRef = useRef<PlazaGameLoop | null>(null)

  // ─── Initialize Game Loop ─────────────────────────────────────────

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas || dimensions.width === 0 || dimensions.height === 0) return

    // Create the game loop
    const loop = new PlazaGameLoop(canvas, roomData, initialAvatar, {
      onPositionChange: (x, y, facing) => {
        onPositionChange?.(x, y, facing)
      },
      onBuildingInteract: (building) => {
        onBuildingInteract?.(building)
      },
      onRequestChat: () => {
        setIsChatOpen(true)
      },
    })

    loop.resize(dimensions.width, dimensions.height)
    loop.start()

    gameLoopRef.current = loop
    setGameLoop(loop)

    return () => {
      loop.stop()
      gameLoopRef.current = null
      setGameLoop(null)
    }
    // Only recreate the game loop when room changes, not on every render
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [roomData.slug, dimensions.width, dimensions.height])

  // ─── Handle resize ────────────────────────────────────────────────

  useEffect(() => {
    if (gameLoopRef.current && dimensions.width > 0 && dimensions.height > 0) {
      gameLoopRef.current.resize(dimensions.width, dimensions.height)
    }
  }, [dimensions.width, dimensions.height])

  // ─── Keyboard and Click-to-Move ───────────────────────────────────

  usePlazaMovement({
    gameLoop,
    enabled: !isChatOpen && !showLoading,
  })

  // ─── Chat Handlers ────────────────────────────────────────────────

  const handleChatSelect = useCallback(
    (phrase: ChatPhrase) => {
      if (gameLoopRef.current) {
        gameLoopRef.current.showChatBubble(initialAvatar.userId, phrase.phrase)
      }
      onChatPhrase?.(phrase)
      setIsChatOpen(false)
    },
    [initialAvatar.userId, onChatPhrase]
  )

  const handleChatClose = useCallback(() => {
    setIsChatOpen(false)
  }, [])

  // ─── Mobile Action Handlers ───────────────────────────────────────

  const handleMobileInteract = useCallback(() => {
    if (gameLoopRef.current) {
      gameLoopRef.current.interact()
    }
  }, [])

  const handleMobileChat = useCallback(() => {
    setIsChatOpen(true)
  }, [])

  // ─── Loading State ────────────────────────────────────────────────

  useEffect(() => {
    setShowLoading(isLoading)
  }, [isLoading])

  const handleLoadingFadeComplete = useCallback(() => {
    setShowLoading(false)
  }, [])

  return (
    <div className="relative h-full w-full overflow-hidden" ref={containerRef}>
      {/* Canvas */}
      <canvas
        ref={canvasRef}
        data-plaza-canvas
        className="absolute inset-0 block"
        style={{
          touchAction: 'none', // Prevent browser gestures on canvas
          imageRendering: 'pixelated',
        }}
      />

      {/* HTML UI Overlay */}
      <div className="absolute inset-0 pointer-events-none">
        {/* HUD */}
        <PlazaHUD
          roomName={roomName}
          onlineCount={onlineCount + (gameLoop?.getRemoteCount() ?? 0)}
          tokenBalance={tokenBalance}
        />

        {/* Mobile controls */}
        <VirtualJoystick gameLoop={gameLoop} />
        <ActionButton
          gameLoop={gameLoop}
          onInteract={handleMobileInteract}
          onChat={handleMobileChat}
        />
      </div>

      {/* Chat Phrase Selector (needs pointer events) */}
      <ChatPhraseSelector
        isOpen={isChatOpen}
        onSelect={handleChatSelect}
        onClose={handleChatClose}
        phrases={chatPhrases}
      />

      {/* Loading/Transition screen */}
      {showLoading && (
        <PlazaLoading
          roomName={roomName}
          isTransition={false}
          onFadeComplete={handleLoadingFadeComplete}
        />
      )}
    </div>
  )
}
