'use client'

import { useTheme } from 'next-themes'
import { Sun, Moon } from 'lucide-react'
import { useEffect, useState } from 'react'

export function ThemeToggle() {
  const { theme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) {
    // Placeholder to prevent layout shift
    return <div className="h-8 w-8" />
  }

  return (
    <button
      onClick={() => setTheme(theme === 'dark' ? 'light' : 'dark')}
      className="relative h-8 w-8 rounded-lg flex items-center justify-center bg-white/10 dark:bg-white/10 hover:bg-white/20 dark:hover:bg-white/20 border border-white/10 dark:border-white/10 transition-all"
      aria-label={`Switch to ${theme === 'dark' ? 'light' : 'dark'} mode`}
    >
      <Sun className="h-4 w-4 text-yellow-400 rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
      <Moon className="absolute h-4 w-4 text-[#00BFFF] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
    </button>
  )
}
