'use client'

import { useEffect, useLayoutEffect } from 'react'
import { useTheme } from 'next-themes'

/**
 * Tiny client-only component that forces dark mode on the auth layout.
 * Extracted so the auth layout itself can remain a server component.
 */
export function AuthDarkModeScript() {
  const { setTheme } = useTheme()

  // Force dark mode immediately before paint
  useLayoutEffect(() => {
    document.documentElement.classList.remove('light')
    document.documentElement.classList.add('dark')
    document.documentElement.style.colorScheme = 'dark'
  }, [])

  // Keep next-themes state in sync
  useEffect(() => {
    setTheme('dark')
  }, [setTheme])

  return null
}
