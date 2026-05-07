'use client'

import { useEffect, useRef, useState, useCallback } from 'react'
import { trackReadingProgress } from '@/app/actions/textbooks'

interface ReadingProgressBarProps {
  chapterId: string
  initialScrollPosition?: number
}

export function ReadingProgressBar({
  chapterId,
  initialScrollPosition = 0,
}: ReadingProgressBarProps) {
  const [progress, setProgress] = useState(0)
  const startTimeRef = useRef<number>(Date.now())
  const lastSaveRef = useRef<number>(Date.now())
  const maxProgressRef = useRef<number>(initialScrollPosition)

  const calculateProgress = useCallback(() => {
    const scrollTop = window.scrollY
    const docHeight = document.documentElement.scrollHeight - window.innerHeight
    if (docHeight <= 0) return 0
    return Math.min(Math.round((scrollTop / docHeight) * 100), 100)
  }, [])

  // Save progress to server
  const saveProgress = useCallback(
    async (scrollPct: number, isCompleted?: boolean) => {
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)
      if (timeSpent < 3 && !isCompleted) return // Don't save if less than 3 seconds

      const status = isCompleted || scrollPct >= 95 ? 'completed' : 'in_progress'

      try {
        await trackReadingProgress(chapterId, status, timeSpent, scrollPct)
        // Reset timer after successful save
        startTimeRef.current = Date.now()
        lastSaveRef.current = Date.now()
      } catch {
        // Silently fail -- we will retry on next save interval
      }
    },
    [chapterId]
  )

  useEffect(() => {
    // Mark as in_progress on mount
    trackReadingProgress(chapterId, 'in_progress').catch(() => {})

    const handleScroll = () => {
      const pct = calculateProgress()
      setProgress(pct)
      if (pct > maxProgressRef.current) {
        maxProgressRef.current = pct
      }
    }

    // Auto-save every 30 seconds
    const saveInterval = setInterval(() => {
      const timeSinceLastSave = Date.now() - lastSaveRef.current
      if (timeSinceLastSave >= 30000) {
        saveProgress(maxProgressRef.current)
      }
    }, 30000)

    window.addEventListener('scroll', handleScroll, { passive: true })
    handleScroll() // Initial calculation

    return () => {
      window.removeEventListener('scroll', handleScroll)
      clearInterval(saveInterval)
      // Save on unmount
      const timeSpent = Math.floor((Date.now() - startTimeRef.current) / 1000)
      if (timeSpent > 3) {
        trackReadingProgress(
          chapterId,
          maxProgressRef.current >= 95 ? 'completed' : 'in_progress',
          timeSpent,
          maxProgressRef.current
        ).catch(() => {})
      }
    }
  }, [chapterId, calculateProgress, saveProgress])

  return (
    <div className="fixed left-0 right-0 top-0 z-50 h-1">
      <div
        className="h-full bg-gradient-to-r from-primary to-blue-500 transition-all duration-150 ease-out"
        style={{ width: `${progress}%` }}
      />
    </div>
  )
}
