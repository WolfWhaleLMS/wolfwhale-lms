'use client'

import { create } from 'zustand'
import { downloadAllUserData, clearOfflineData } from '@/lib/offline/sync'

// ---------------------------------------------------------------------------
// Offline mode store — manages download state, offline preference, sync status
// ---------------------------------------------------------------------------

const OFFLINE_STORAGE_KEY = 'wolfwhale-offline-enabled'

interface OfflineState {
  // State
  isOffline: boolean
  isDownloading: boolean
  downloadProgress: number // 0-100
  downloadPhase: string // 'idle' | 'courses' | 'lessons' | 'assignments' | 'grades' | 'complete' | 'error'
  lastSyncedAt: Date | null
  error: string | null

  // Actions
  toggleOffline: () => void
  setDownloading: (downloading: boolean) => void
  setProgress: (progress: number, phase: string) => void
  setError: (error: string | null) => void
  setSynced: () => void
}

// ---------------------------------------------------------------------------
// Download orchestrator — called when offline mode is toggled ON
// ---------------------------------------------------------------------------

async function startDownload() {
  const { setProgress, setDownloading, setError, setSynced } =
    useOfflineStore.getState()

  try {
    setDownloading(true)
    setError(null)
    setProgress(0, 'courses')

    await downloadAllUserData((progress: number, phase: string) => {
      setProgress(progress, phase)
    })

    setProgress(100, 'complete')
    setSynced()
  } catch (err) {
    const message =
      err instanceof Error ? err.message : 'Failed to download offline data'
    setError(message)
    setProgress(0, 'error')
  } finally {
    setDownloading(false)
  }
}

// ---------------------------------------------------------------------------
// Read persisted preference from localStorage (safe for SSR)
// ---------------------------------------------------------------------------

function getPersistedOffline(): boolean {
  if (typeof window === 'undefined') return false
  try {
    return localStorage.getItem(OFFLINE_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function persistOffline(value: boolean) {
  if (typeof window === 'undefined') return
  try {
    localStorage.setItem(OFFLINE_STORAGE_KEY, String(value))
  } catch {
    // localStorage unavailable — silent fail
  }
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useOfflineStore = create<OfflineState>((set, get) => ({
  isOffline: getPersistedOffline(),
  isDownloading: false,
  downloadProgress: 0,
  downloadPhase: 'idle',
  lastSyncedAt: null,
  error: null,

  toggleOffline: () => {
    const current = get().isOffline
    if (!current) {
      // Turning ON — persist preference and kick off download
      set({
        isOffline: true,
        isDownloading: false,
        downloadProgress: 0,
        downloadPhase: 'idle',
        error: null,
      })
      persistOffline(true)
      startDownload()
    } else {
      // Turning OFF — clear local data and reset state
      set({
        isOffline: false,
        isDownloading: false,
        downloadProgress: 0,
        downloadPhase: 'idle',
        lastSyncedAt: null,
        error: null,
      })
      persistOffline(false)
      clearOfflineData().catch(() => {
        // Best-effort cleanup — don't block the UI
      })
    }
  },

  setDownloading: (downloading: boolean) => set({ isDownloading: downloading }),

  setProgress: (progress: number, phase: string) =>
    set({ downloadProgress: progress, downloadPhase: phase }),

  setError: (error: string | null) => set({ error }),

  setSynced: () => set({ lastSyncedAt: new Date() }),
}))
