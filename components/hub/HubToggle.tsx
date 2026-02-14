'use client'

import { Sun, Moon } from 'lucide-react'
import { useTheme } from 'next-themes'

export function HubToggle() {
  const { theme, setTheme } = useTheme()
  const isDark = theme === 'dark'

  return (
    <div className="hub-button-ring">
      <div className="hub-button-outer">
        <div className="hub-button-face bg-gradient-to-br from-[#C0D8E8] via-[#E0ECF4] to-[#A8C0D4] dark:from-[#1A3A5C] dark:via-[#0F2A45] dark:to-[#1A3A5C]">
          <div className="hub-button-highlight" />
          <div className="relative z-2 flex flex-col items-center gap-1">
            {isDark ? (
              <Moon className="h-8 w-8 sm:h-10 sm:w-10 text-[#FFD700] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            ) : (
              <Sun className="h-8 w-8 sm:h-10 sm:w-10 text-[#FFAA00] drop-shadow-[0_2px_4px_rgba(0,0,0,0.3)]" />
            )}
          </div>
        </div>
      </div>
      {/* Toggle underneath */}
      <button
        type="button"
        className="hub-toggle"
        data-active={isDark ? 'true' : 'false'}
        onClick={() => setTheme(isDark ? 'light' : 'dark')}
        aria-label={isDark ? 'Switch to light mode' : 'Switch to dark mode'}
      >
        <div className="hub-toggle-knob" />
      </button>
      <span className="hub-button-label">{isDark ? 'Dark' : 'Light'}</span>
    </div>
  )
}
