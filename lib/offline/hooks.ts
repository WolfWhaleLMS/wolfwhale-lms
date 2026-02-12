'use client'

import { useState, useEffect, useRef } from 'react'
import { useOfflineStore } from '@/lib/offline/store'
import { offlineDB } from '@/lib/offline/db'

// ---------------------------------------------------------------------------
// useNetworkStatus — detects browser online/offline state
// ---------------------------------------------------------------------------

export function useNetworkStatus() {
  const [isOnline, setIsOnline] = useState(true)

  useEffect(() => {
    setIsOnline(navigator.onLine)

    const handleOnline = () => setIsOnline(true)
    const handleOffline = () => setIsOnline(false)

    window.addEventListener('online', handleOnline)
    window.addEventListener('offline', handleOffline)

    return () => {
      window.removeEventListener('online', handleOnline)
      window.removeEventListener('offline', handleOffline)
    }
  }, [])

  return isOnline
}

// ---------------------------------------------------------------------------
// useOfflineData — reads from Supabase when online, IndexedDB when offline
// ---------------------------------------------------------------------------

export function useOfflineData<T>(
  key: string,
  onlineFetcher: () => Promise<T>,
  offlineFetcher: () => Promise<T>,
): { data: T | null; loading: boolean; error: string | null; isOffline: boolean } {
  const isOffline = useOfflineStore((s) => s.isOffline)
  const isOnline = useNetworkStatus()
  const [data, setData] = useState<T | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Track whether the component is still mounted to avoid state updates after unmount
  const mountedRef = useRef(true)
  useEffect(() => {
    mountedRef.current = true
    return () => {
      mountedRef.current = false
    }
  }, [])

  useEffect(() => {
    let cancelled = false

    async function fetchData() {
      setLoading(true)
      setError(null)

      try {
        // Use offline fetcher when offline mode is enabled OR when network is unavailable
        const shouldUseOffline = isOffline || !isOnline
        const fetcher = shouldUseOffline ? offlineFetcher : onlineFetcher
        const result = await fetcher()

        if (!cancelled && mountedRef.current) {
          setData(result)
        }
      } catch (err) {
        if (!cancelled && mountedRef.current) {
          const message =
            err instanceof Error ? err.message : 'Failed to fetch data'
          setError(message)
        }
      } finally {
        if (!cancelled && mountedRef.current) {
          setLoading(false)
        }
      }
    }

    fetchData()

    return () => {
      cancelled = true
    }
  }, [key, isOffline, isOnline, onlineFetcher, offlineFetcher])

  return { data, loading, error, isOffline: isOffline || !isOnline }
}

// ---------------------------------------------------------------------------
// syncPendingActions — replays queued offline actions when back online
// ---------------------------------------------------------------------------

async function syncPendingActions() {
  try {
    const pending = await offlineDB.pendingActions.toArray()

    if (pending.length === 0) return

    // Process each pending action
    for (const action of pending) {
      try {
        const payload = JSON.parse(action.payload)

        // POST to the sync API endpoint
        const response = await fetch('/api/offline/sync', {
          method: 'POST',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({ type: action.type, payload }),
        })

        if (response.ok) {
          // Remove successfully synced action
          if (action.id !== undefined) {
            await offlineDB.pendingActions.delete(action.id)
          }
        }
      } catch {
        // Individual action failed — leave in queue for next sync attempt
        console.warn(`[OfflineSync] Failed to sync action: ${action.type}`)
      }
    }
  } catch (err) {
    console.error('[OfflineSync] Failed to process pending actions:', err)
  }
}

// ---------------------------------------------------------------------------
// useAutoSync — auto-syncs pending actions when connectivity returns
// ---------------------------------------------------------------------------

export function useAutoSync() {
  const isOnline = useNetworkStatus()
  const isOffline = useOfflineStore((s) => s.isOffline)
  const prevOnlineRef = useRef(isOnline)

  useEffect(() => {
    const wasOffline = !prevOnlineRef.current
    prevOnlineRef.current = isOnline

    if (isOnline && (wasOffline || isOffline)) {
      // Came back online while in offline mode — sync pending actions
      syncPendingActions()
    }
  }, [isOnline, isOffline])
}
