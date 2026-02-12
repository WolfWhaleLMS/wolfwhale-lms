'use client'

import { useState, useRef, useEffect, useCallback } from 'react'
import { createPortal } from 'react-dom'
import { Music, Play, Pause, SkipForward, Volume2 } from 'lucide-react'
import { useRadio, RADIO_TRACKS } from '@/hooks/useRadio'
import { cn } from '@/lib/utils'

export function RadioDropdown() {
  const { isPlaying, currentTrack, trackIndex, toggle, skip, playTrack, volume, setVolume } =
    useRadio()
  const [open, setOpen] = useState(false)
  const btnRef = useRef<HTMLButtonElement>(null)
  const panelRef = useRef<HTMLDivElement>(null)
  const [pos, setPos] = useState({ top: 0, right: 0 })

  // Position the panel below the button
  const updatePos = useCallback(() => {
    if (!btnRef.current) return
    const rect = btnRef.current.getBoundingClientRect()
    setPos({
      top: rect.bottom + 8,
      right: window.innerWidth - rect.right,
    })
  }, [])

  // Recalculate on open and on scroll/resize
  useEffect(() => {
    if (!open) return
    updatePos()
    window.addEventListener('scroll', updatePos, true)
    window.addEventListener('resize', updatePos)
    return () => {
      window.removeEventListener('scroll', updatePos, true)
      window.removeEventListener('resize', updatePos)
    }
  }, [open, updatePos])

  // Close on outside click
  useEffect(() => {
    if (!open) return
    function handleClick(e: MouseEvent) {
      const target = e.target as Node
      if (
        btnRef.current?.contains(target) ||
        panelRef.current?.contains(target)
      ) return
      setOpen(false)
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    if (!open) return
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    window.addEventListener('keydown', handleKey)
    return () => window.removeEventListener('keydown', handleKey)
  }, [open])

  const panel = open ? createPortal(
    <div
      ref={panelRef}
      className="fixed w-72 rounded-2xl border border-[#00BFFF]/25 bg-white dark:bg-[hsl(210,40%,10%)] backdrop-blur-xl p-4 shadow-2xl animate-glass-pop-in"
      style={{ top: pos.top, right: pos.right, zIndex: 99999 }}
    >
      {/* Header + controls */}
      <div className="flex items-center justify-between mb-3">
        <h3 className="text-sm font-bold text-foreground">WolfWhale Radio</h3>
        <div className="flex items-center gap-1">
          <button
            onClick={toggle}
            className="rounded-full p-2 bg-[#00BFFF]/15 hover:bg-[#00BFFF]/25 transition-colors"
            aria-label={isPlaying ? 'Pause' : 'Play'}
          >
            {isPlaying ? (
              <Pause className="h-4 w-4 text-[#00BFFF]" />
            ) : (
              <Play className="h-4 w-4 text-[#00BFFF]" />
            )}
          </button>
          <button
            onClick={skip}
            className="rounded-full p-2 bg-[#00BFFF]/15 hover:bg-[#00BFFF]/25 transition-colors"
            aria-label="Skip to next track"
          >
            <SkipForward className="h-4 w-4 text-[#00BFFF]" />
          </button>
        </div>
      </div>

      {/* Track list */}
      <div className="space-y-1">
        {RADIO_TRACKS.map((track, i) => (
          <button
            key={track.src}
            onClick={() => playTrack(i)}
            className={cn(
              'w-full flex items-center gap-3 rounded-xl px-3 py-2.5 text-left transition-all duration-200',
              i === trackIndex
                ? 'bg-[#00BFFF]/15 border border-[#00BFFF]/30'
                : 'hover:bg-foreground/5 border border-transparent',
            )}
          >
            <span className="text-lg">{track.icon}</span>
            <span
              className={cn(
                'text-sm font-medium',
                i === trackIndex ? 'text-[#00BFFF]' : 'text-foreground/70',
              )}
            >
              {track.name}
            </span>
            {i === trackIndex && isPlaying && (
              <span className="ml-auto text-[#33FF33] text-xs animate-pulse">Playing</span>
            )}
          </button>
        ))}
      </div>

      {/* Volume slider */}
      <div className="mt-3 flex items-center gap-2 px-1">
        <Volume2 className="h-3.5 w-3.5 text-foreground/40 flex-shrink-0" />
        <input
          type="range"
          min={0}
          max={100}
          value={Math.round(volume * 100)}
          onChange={(e) => setVolume(Number(e.target.value) / 100)}
          className="w-full h-1.5 rounded-full appearance-none bg-[#00BFFF]/20 accent-[#00BFFF] cursor-pointer"
          aria-label="Volume"
        />
      </div>
    </div>,
    document.body,
  ) : null

  return (
    <div data-no-sound>
      {/* Toggle button */}
      <button
        ref={btnRef}
        onClick={() => setOpen(!open)}
        className={cn(
          'relative flex items-center gap-2 rounded-xl px-3 py-2 text-sm font-medium transition-all duration-200',
          isPlaying
            ? 'bg-[#33FF33]/15 text-[#33FF33] border border-[#33FF33]/30'
            : 'text-foreground/60 hover:text-foreground hover:bg-foreground/5 border border-transparent',
        )}
        aria-label="Radio player"
      >
        <Music className={cn('h-4 w-4', isPlaying && 'animate-pulse')} />
        {isPlaying && (
          <span className="hidden sm:inline truncate max-w-[100px] text-xs">
            {currentTrack.name}
          </span>
        )}
      </button>

      {panel}
    </div>
  )
}
