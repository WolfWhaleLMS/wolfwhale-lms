// Wolf Whale LMS - Virtual Plaza Zustand Store
// Client-side state management for the plaza system

import { create } from 'zustand'
import type {
  PlazaStore,
  PlazaUIFlags,
  AvatarState,
  RemoteAvatarState,
  RoomData,
  ChatBubble,
} from '@/lib/plaza/types'
import { ROOM_SLUGS } from '@/lib/plaza/constants'
import { PLAZA_CONFIG } from '@/lib/plaza/constants'

// ---------------------------------------------------------------------------
// Initial state values
// ---------------------------------------------------------------------------

const initialUIState: PlazaUIFlags = {
  isStoreOpen: false,
  isGameLobbyOpen: false,
  isChatOpen: false,
  isInventoryOpen: false,
}

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const usePlazaStore = create<PlazaStore>((set, get) => ({
  // ---- Avatar ----
  localAvatar: null,
  setLocalAvatar: (avatar: AvatarState) => set({ localAvatar: avatar }),

  // ---- Remote players ----
  remoteAvatars: new Map<string, RemoteAvatarState>(),
  setRemoteAvatar: (userId: string, state: RemoteAvatarState) =>
    set((prev) => {
      const next = new Map(prev.remoteAvatars)
      next.set(userId, state)
      return { remoteAvatars: next }
    }),
  removeRemoteAvatar: (userId: string) =>
    set((prev) => {
      const next = new Map(prev.remoteAvatars)
      next.delete(userId)
      return { remoteAvatars: next }
    }),
  clearRemoteAvatars: () => set({ remoteAvatars: new Map() }),

  // ---- Room ----
  currentRoom: ROOM_SLUGS.PLAZA_MAIN,
  setCurrentRoom: (room: string) => set({ currentRoom: room }),
  roomData: null,
  setRoomData: (data: RoomData) => set({ roomData: data }),

  // ---- Chat bubbles ----
  activeBubbles: new Map<string, ChatBubble>(),
  addBubble: (userId: string, phrase: string) =>
    set((prev) => {
      const next = new Map(prev.activeBubbles)
      next.set(userId, {
        userId,
        phrase,
        startedAt: Date.now(),
        duration: PLAZA_CONFIG.chatBubbleDurationMs,
      })
      return { activeBubbles: next }
    }),
  removeBubble: (userId: string) =>
    set((prev) => {
      const next = new Map(prev.activeBubbles)
      next.delete(userId)
      return { activeBubbles: next }
    }),

  // ---- Tokens ----
  tokenBalance: 0,
  setTokenBalance: (balance: number) => set({ tokenBalance: balance }),
  addTokens: (amount: number) =>
    set((prev) => ({ tokenBalance: prev.tokenBalance + amount })),

  // ---- UI state ----
  ...initialUIState,
  selectedBuilding: null,
  setUIState: (key: keyof PlazaUIFlags, value: boolean) =>
    set({ [key]: value }),
  setSelectedBuilding: (building: string | null) =>
    set({ selectedBuilding: building }),

  // ---- Connection ----
  isConnected: false,
  setIsConnected: (connected: boolean) => set({ isConnected: connected }),

  // ---- Reset ----
  reset: () =>
    set({
      localAvatar: null,
      remoteAvatars: new Map(),
      currentRoom: ROOM_SLUGS.PLAZA_MAIN,
      roomData: null,
      activeBubbles: new Map(),
      tokenBalance: 0,
      ...initialUIState,
      selectedBuilding: null,
      isConnected: false,
    }),
}))
