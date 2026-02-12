'use client'

import { Bot, Check, Loader2, Download } from 'lucide-react'
import { useTutorStore } from '@/lib/tutor/engine'
import TutorUnsupported from './TutorUnsupported'

export default function TutorModelManager() {
  const status = useTutorStore((s) => s.status)
  const progress = useTutorStore((s) => s.progress)
  const error = useTutorStore((s) => s.error)
  const initEngine = useTutorStore((s) => s.initEngine)
  const resetEngine = useTutorStore((s) => s.resetEngine)

  const downloadProgress = progress?.percent ?? 0
  const progressText = progress?.text ?? ''
  const errorMessage = error

  // ------ Unsupported ------ //
  if (status === 'unsupported') {
    return <TutorUnsupported />
  }

  return (
    <div className="flex h-full w-full items-center justify-center p-4">
      <div className="ocean-card w-full max-w-sm p-6 sm:p-8 animate-fade-in-up">
        <div className="relative z-2 flex flex-col items-center text-center gap-5">

          {/* ---- Idle ---- */}
          {status === 'idle' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00BFFF]/10 neon-glow-blue">
                <Bot className="h-8 w-8 text-[#00BFFF]" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-lg text-foreground">
                  Wally AI Tutor
                </h2>
                <p className="text-sm text-muted-foreground leading-relaxed">
                  Wally AI runs locally on your device. Approximately 1.6 GB
                  download on first use.
                </p>
              </div>
              <button
                type="button"
                onClick={() => initEngine()}
                className="btn-chrome-3d-blue flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 active:scale-[0.98]"
                aria-label="Load the AI Tutor model"
              >
                <Download className="h-4 w-4" aria-hidden="true" />
                Load AI Tutor
              </button>
            </>
          )}

          {/* ---- Checking ---- */}
          {status === 'checking' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00BFFF]/10 neon-pulse-blue">
                <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-foreground" role="status" aria-live="polite">
                Checking device compatibility...
              </p>
            </>
          )}

          {/* ---- Downloading ---- */}
          {status === 'downloading' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00BFFF]/10 neon-pulse-blue">
                <Download className="h-8 w-8 text-[#00BFFF]" aria-hidden="true" />
              </div>
              <div className="w-full space-y-3">
                <p className="text-sm font-medium text-foreground" role="status" aria-live="polite">
                  Downloading AI model...
                </p>

                {/* Progress bar */}
                <div className="relative h-3 w-full overflow-hidden rounded-full bg-[#0A2540]/10 dark:bg-[#E8F8FF]/10">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-[#00BFFF] to-[#33FF33] transition-[width] duration-300 ease-out"
                    style={{ width: `${Math.min(downloadProgress, 100)}%` }}
                    role="progressbar"
                    aria-valuenow={Math.round(downloadProgress)}
                    aria-valuemin={0}
                    aria-valuemax={100}
                    aria-label="Download progress"
                  >
                    {/* Animated shimmer overlay */}
                    <div className="absolute inset-0 animate-shimmer bg-[linear-gradient(90deg,transparent_0%,rgba(255,255,255,0.35)_50%,transparent_100%)] bg-[length:200%_100%]" />
                  </div>
                </div>

                <div className="flex items-center justify-between text-xs text-muted-foreground">
                  <span>{progressText || 'Preparing...'}</span>
                  <span className="font-data tabular-nums">
                    {Math.round(downloadProgress)}%
                  </span>
                </div>
              </div>
            </>
          )}

          {/* ---- Loading ---- */}
          {status === 'loading' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#00BFFF]/10 neon-pulse-blue">
                <Loader2 className="h-8 w-8 animate-spin text-[#00BFFF]" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-foreground" role="status" aria-live="polite">
                Loading AI model into GPU...
              </p>
              <p className="text-xs text-muted-foreground">
                This may take a moment
              </p>
            </>
          )}

          {/* ---- Ready (brief flash before auto-transition to chat) ---- */}
          {status === 'ready' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#33FF33]/15 neon-glow-green">
                <Check className="h-8 w-8 text-[#33FF33]" aria-hidden="true" />
              </div>
              <p className="text-sm font-medium text-foreground" role="status" aria-live="polite">
                Ready!
              </p>
            </>
          )}

          {/* ---- Error ---- */}
          {status === 'error' && (
            <>
              <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FF3366]/10">
                <Bot className="h-8 w-8 text-[#FF3366]" aria-hidden="true" />
              </div>
              <div className="space-y-2">
                <h2 className="font-display text-lg text-foreground">
                  Something Went Wrong
                </h2>
                <p className="text-sm text-[#FF3366] leading-relaxed" role="alert">
                  {errorMessage || 'An unexpected error occurred while loading the AI model.'}
                </p>
              </div>
              <button
                type="button"
                onClick={() => {
                  resetEngine()
                  initEngine()
                }}
                className="btn-chrome-3d-blue flex items-center gap-2 rounded-2xl px-6 py-2.5 text-sm font-bold text-white transition-all hover:scale-[1.02] focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2 active:scale-[0.98]"
                aria-label="Retry loading the AI model"
              >
                Try Again
              </button>
            </>
          )}
        </div>
      </div>
    </div>
  )
}
