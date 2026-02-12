'use client'

import { useEffect, useState } from 'react'
import { useOfflineStore } from '@/lib/offline/store'
import { useNetworkStatus } from '@/lib/offline/hooks'
import { WifiOff, Download, CheckCircle, AlertTriangle } from 'lucide-react'

// ---------------------------------------------------------------------------
// OfflineStatusBar — slim status indicator shown below TopBar
// ---------------------------------------------------------------------------

type StatusMode = 'hidden' | 'offline-active' | 'downloading' | 'synced' | 'network-lost' | 'error'

export function OfflineStatusBar() {
  const isOnline = useNetworkStatus()
  const isOffline = useOfflineStore((s) => s.isOffline)
  const isDownloading = useOfflineStore((s) => s.isDownloading)
  const downloadProgress = useOfflineStore((s) => s.downloadProgress)
  const downloadPhase = useOfflineStore((s) => s.downloadPhase)
  const error = useOfflineStore((s) => s.error)
  const toggleOffline = useOfflineStore((s) => s.toggleOffline)

  // Track "synced" flash state — shows briefly when download completes
  const [showSynced, setShowSynced] = useState(false)

  useEffect(() => {
    if (downloadPhase === 'complete' && !isDownloading) {
      setShowSynced(true)
      const timer = setTimeout(() => setShowSynced(false), 3000)
      return () => clearTimeout(timer)
    }
  }, [downloadPhase, isDownloading])

  // Determine which mode to display
  const mode: StatusMode = (() => {
    if (error) return 'error'
    if (isDownloading) return 'downloading'
    if (showSynced) return 'synced'
    if (!isOnline && !isOffline) return 'network-lost'
    if (isOffline) return 'offline-active'
    return 'hidden'
  })()

  // Don't render when hidden
  if (mode === 'hidden') return null

  // Style maps for each mode
  const styles: Record<Exclude<StatusMode, 'hidden'>, string> = {
    'offline-active':
      'bg-[#33FF33]/10 border border-[#33FF33]/20 text-[#33FF33]',
    downloading:
      'bg-[#00BFFF]/10 border border-[#00BFFF]/20 text-[#00BFFF]',
    synced:
      'bg-[#33FF33]/10 border border-[#33FF33]/30 text-[#33FF33] animate-[syncFlash_0.6s_ease-out]',
    'network-lost':
      'bg-amber-500/10 border border-amber-500/20 text-amber-400',
    error:
      'bg-red-500/10 border border-red-500/20 text-red-400',
  }

  // Format the download phase for display
  function formatPhase(phase: string): string {
    if (phase === 'idle' || phase === 'complete' || phase === 'error') return ''
    // Capitalize first letter
    return phase.charAt(0).toUpperCase() + phase.slice(1)
  }

  return (
    <div className="px-4 pt-2">
      <div
        className={[
          'relative flex h-8 w-full items-center gap-2 overflow-hidden rounded-lg px-3 text-xs font-medium',
          'transition-all duration-300 ease-out',
          styles[mode],
        ].join(' ')}
        role="status"
        aria-live="polite"
      >
        {/* Icon */}
        {mode === 'offline-active' && <WifiOff className="h-3.5 w-3.5 shrink-0" />}
        {mode === 'downloading' && <Download className="h-3.5 w-3.5 shrink-0 animate-bounce" />}
        {mode === 'synced' && <CheckCircle className="h-3.5 w-3.5 shrink-0" />}
        {mode === 'network-lost' && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}
        {mode === 'error' && <AlertTriangle className="h-3.5 w-3.5 shrink-0" />}

        {/* Text */}
        {mode === 'offline-active' && <span>Offline Mode Active</span>}
        {mode === 'downloading' && (
          <span>
            Downloading...{' '}
            {formatPhase(downloadPhase) && (
              <span className="opacity-80">{formatPhase(downloadPhase)}</span>
            )}{' '}
            <span className="tabular-nums">({Math.round(downloadProgress)}%)</span>
          </span>
        )}
        {mode === 'synced' && <span>All data synced</span>}
        {mode === 'network-lost' && <span>No internet connection</span>}
        {mode === 'error' && (
          <span className="flex flex-1 items-center justify-between">
            <span className="truncate">{error}</span>
            <button
              type="button"
              onClick={() => {
                // Retry by toggling off then on
                toggleOffline()
                setTimeout(() => toggleOffline(), 100)
              }}
              className="ml-2 shrink-0 rounded bg-red-500/20 px-2 py-0.5 text-[10px] font-semibold uppercase tracking-wide text-red-300 transition-colors hover:bg-red-500/30 hover:text-red-200"
            >
              Retry
            </button>
          </span>
        )}

        {/* Progress bar (downloading mode only) */}
        {mode === 'downloading' && (
          <div className="absolute bottom-0 left-0 h-[2px] w-full bg-[#00BFFF]/10">
            <div
              className="h-full bg-[#00BFFF]/60 transition-all duration-300 ease-out"
              style={{ width: `${downloadProgress}%` }}
            />
          </div>
        )}
      </div>

      {/* Keyframe for sync flash animation */}
      <style jsx>{`
        @keyframes syncFlash {
          0% {
            background-color: rgba(51, 255, 51, 0.25);
          }
          100% {
            background-color: rgba(51, 255, 51, 0.1);
          }
        }
      `}</style>
    </div>
  )
}
