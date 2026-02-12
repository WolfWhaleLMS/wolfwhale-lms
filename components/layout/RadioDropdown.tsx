'use client'

import { useState, useRef, useEffect } from 'react'
import { Music, Play, Pause, SkipForward, Volume2 } from 'lucide-react'
import { useRadio, RADIO_TRACKS } from '@/hooks/useRadio'
import { cn } from '@/lib/utils'

export function RadioDropdown() {
  const { isPlaying, currentTrack, trackIndex, toggle, skip, playTrack, volume, setVolume } =
    useRadio()
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [])

  return (
    <div ref={ref} className="relative" data-no-sound>
      {/* Toggle button */}
      <button
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

      {/* Dropdown */}
      {open && (
        <div className="absolute right-0 top-full mt-2 w-72 rounded-2xl liquid-glass-elevated border border-[#00BFFF]/25 p-4 shadow-xl z-50 animate-glass-pop-in">
          {/* Header + controls */}
          <div className="flex items-center justify-between mb-3">
            <h3 className="text-sm font-bold text-foreground">WolfWhale Radio</h3>
            <div className="flex items-center gap-1">
              <button
                onClick={toggle}
                className="rounded-full p-2 bg-[#00BFFF]/10 hover:bg-[#00BFFF]/20 transition-colors"
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
                className="rounded-full p-2 bg-[#00BFFF]/10 hover:bg-[#00BFFF]/20 transition-colors"
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
                    ? 'bg-[#00BFFF]/10 border border-[#00BFFF]/25'
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
        </div>
      )}
    </div>
  )
}
