'use client'

import { AlertTriangle, ExternalLink } from 'lucide-react'

export default function TutorUnsupported() {
  return (
    <div className="ocean-card p-6 sm:p-8 max-w-md mx-auto animate-fade-in-up">
      <div className="relative z-2 flex flex-col items-center text-center gap-4">
        {/* Warning icon with amber glow */}
        <div className="flex h-16 w-16 items-center justify-center rounded-full bg-[#FFAA00]/10 neon-glow-amber">
          <AlertTriangle className="h-8 w-8 text-[#FFAA00]" aria-hidden="true" />
        </div>

        <h2 className="font-display text-lg text-foreground">
          AI Tutor Requires WebGPU
        </h2>

        <p className="text-muted-foreground leading-relaxed">
          Your browser does not support WebGPU, which is needed to run the AI
          tutor locally on your device. Please try one of the following browsers:
        </p>

        <ul className="text-sm text-muted-foreground space-y-1" role="list">
          <li>Chrome 113 or later</li>
          <li>Edge 113 or later</li>
          <li>Safari 18 or later</li>
        </ul>

        <a
          href="https://developer.mozilla.org/en-US/docs/Web/API/WebGPU_API#browser_compatibility"
          target="_blank"
          rel="noopener noreferrer"
          className="btn-chrome-3d-silver inline-flex items-center gap-2 rounded-2xl px-5 py-2.5 text-sm font-medium text-[#0A2540] transition-all focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-[#00BFFF] focus-visible:ring-offset-2"
          aria-label="View WebGPU browser compatibility (opens in new tab)"
        >
          <ExternalLink className="h-4 w-4" aria-hidden="true" />
          Browser Compatibility
        </a>
      </div>
    </div>
  )
}
