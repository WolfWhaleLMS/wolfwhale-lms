'use client'

import { useOfflineStore } from '@/lib/offline/store'

// ---------------------------------------------------------------------------
// Props
// ---------------------------------------------------------------------------

interface OfflineToggleProps {
  isOffline: boolean
  isDownloading: boolean
  progress: number // 0-100
  onToggle: () => void
}

// ---------------------------------------------------------------------------
// Physical Chrome Toggle Switch
// ---------------------------------------------------------------------------

export function OfflineToggle({
  isOffline,
  isDownloading,
  progress,
  onToggle,
}: OfflineToggleProps) {
  return (
    <div className="flex items-center gap-1.5">
      {/* Label */}
      <span className="select-none text-xs font-medium text-muted-foreground">
        Offline
      </span>

      {/* Toggle switch */}
      <button
        type="button"
        role="switch"
        aria-checked={isOffline}
        aria-label={isOffline ? 'Disable offline mode' : 'Enable offline mode'}
        onClick={onToggle}
        className="offline-toggle-track group relative"
        data-state={isOffline ? 'on' : 'off'}
        data-downloading={isDownloading ? 'true' : undefined}
      >
        {/* Track */}
        <div
          className={[
            'relative h-[24px] w-[44px] rounded-full transition-all duration-300 ease-out',
            // Inset track depth
            'shadow-[inset_0_2px_4px_rgba(0,0,0,0.4),inset_0_-1px_2px_rgba(255,255,255,0.1)]',
            // State-dependent colors
            isOffline
              ? 'bg-gradient-to-b from-[#1a3a1a] to-[#0d1f0d] border border-[#33FF33]/40'
              : 'bg-gradient-to-b from-[#3a3a3a] to-[#1a1a1a] border border-white/10',
          ].join(' ')}
        >
          {/* Active glow underlay (visible when ON) */}
          <div
            className={[
              'absolute inset-0 rounded-full transition-opacity duration-300',
              isOffline ? 'opacity-100' : 'opacity-0',
              'bg-[#33FF33]/10',
              isDownloading ? 'animate-pulse' : '',
            ].join(' ')}
          />

          {/* Download progress fill */}
          {isDownloading && (
            <div
              className="absolute left-0 top-0 h-full rounded-full bg-[#33FF33]/15 transition-all duration-200 ease-out"
              style={{ width: `${progress}%` }}
            />
          )}

          {/* Knob */}
          <div
            className={[
              // Positioning and size
              'absolute top-[2px] h-[20px] w-[20px] rounded-full',
              // Spring / bounce animation
              'transition-all duration-300',
              isOffline
                ? 'left-[22px] animate-[toggle-on_0.3s_cubic-bezier(0.34,1.56,0.64,1)]'
                : 'left-[2px] animate-[toggle-off_0.3s_cubic-bezier(0.34,1.56,0.64,1)]',
              // Chrome metallic knob gradient
              'bg-gradient-to-b from-[#f0f0f0] via-[#c8c8c8] to-[#909090]',
              // Specular highlights and depth
              'shadow-[0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.2)]',
              // Active state glow
              isOffline
                ? 'shadow-[0_0_6px_rgba(51,255,51,0.6),0_1px_3px_rgba(0,0,0,0.5),inset_0_1px_1px_rgba(255,255,255,0.8),inset_0_-1px_1px_rgba(0,0,0,0.2)]'
                : '',
              // Downloading pulse
              isDownloading ? 'animate-pulse' : '',
            ].join(' ')}
          >
            {/* Specular dot highlight on knob */}
            <div className="absolute left-[5px] top-[3px] h-[4px] w-[8px] rounded-full bg-white/60" />

            {/* Center grip line */}
            <div
              className={[
                'absolute left-1/2 top-1/2 h-[8px] w-[2px] -translate-x-1/2 -translate-y-1/2 rounded-full transition-colors duration-300',
                isOffline ? 'bg-[#33FF33]/60' : 'bg-black/15',
              ].join(' ')}
            />
          </div>
        </div>

        {/* Inline keyframe styles */}
        <style jsx>{`
          @keyframes toggle-on {
            0% {
              left: 2px;
              width: 20px;
            }
            30% {
              width: 24px;
            }
            60% {
              left: 22px;
              width: 22px;
            }
            80% {
              width: 18px;
            }
            100% {
              left: 22px;
              width: 20px;
            }
          }
          @keyframes toggle-off {
            0% {
              left: 22px;
              width: 20px;
            }
            30% {
              width: 24px;
            }
            60% {
              left: 2px;
              width: 22px;
            }
            80% {
              width: 18px;
            }
            100% {
              left: 2px;
              width: 20px;
            }
          }
        `}</style>
      </button>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Connected wrapper — reads from Zustand store
// ---------------------------------------------------------------------------

export function OfflineToggleConnected() {
  const isOffline = useOfflineStore((s) => s.isOffline)
  const isDownloading = useOfflineStore((s) => s.isDownloading)
  const progress = useOfflineStore((s) => s.downloadProgress)
  const toggleOffline = useOfflineStore((s) => s.toggleOffline)

  return (
    <OfflineToggle
      isOffline={isOffline}
      isDownloading={isDownloading}
      progress={progress}
      onToggle={toggleOffline}
    />
  )
}
