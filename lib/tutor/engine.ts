'use client'

// WolfWhale LMS - AI Tutor Engine (Zustand Store)
// Wraps the WebLLM MLCEngine lifecycle for local Llama 3.2 3B inference.
// Singleton engine shared between the chat widget and full tutor panel.

import { create } from 'zustand'
import type {
  TutorMessage,
  TutorConversation,
  EngineStatus,
  DownloadProgress,
  TutorRole,
  AgeVariant,
} from './types'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const MODEL_ID = 'Llama-3.2-3B-Instruct-q4f16_1-MLC'

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function createId(): string {
  return crypto.randomUUID()
}

function createConversation(
  courseId: string | null = null,
  lessonId: string | null = null,
): TutorConversation {
  const now = new Date()
  return {
    id: createId(),
    title: 'New Conversation',
    courseId,
    lessonId,
    messages: [],
    createdAt: now,
    updatedAt: now,
  }
}

// ---------------------------------------------------------------------------
// Store types
// ---------------------------------------------------------------------------

interface TutorEngineState {
  // Engine lifecycle
  status: EngineStatus
  progress: DownloadProgress | null
  error: string | null

  // Chat state
  activeConversation: TutorConversation | null
  conversations: TutorConversation[]

  // UI state
  isWidgetOpen: boolean
  isPanelExpanded: boolean

  // Configuration
  role: TutorRole
  ageVariant: AgeVariant
  systemPrompt: string
}

interface TutorEngineActions {
  // Engine lifecycle
  initEngine: () => Promise<void>
  resetEngine: () => void

  // Chat
  sendMessage: (content: string) => Promise<void>
  startNewConversation: (courseId?: string, lessonId?: string) => void
  loadConversation: (conversationId: string) => void

  // UI
  setWidgetOpen: (open: boolean) => void
  setPanelExpanded: (expanded: boolean) => void

  // Configuration
  setSystemPrompt: (prompt: string) => void
  setRole: (role: TutorRole) => void
  setAgeVariant: (variant: AgeVariant) => void
}

type TutorStore = TutorEngineState & TutorEngineActions

// ---------------------------------------------------------------------------
// Module-level engine reference (singleton, never serialized into Zustand)
// ---------------------------------------------------------------------------

// eslint-disable-next-line @typescript-eslint/no-explicit-any
let engineInstance: any = null

// ---------------------------------------------------------------------------
// Store
// ---------------------------------------------------------------------------

export const useTutorStore = create<TutorStore>((set, get) => ({
  // ---- Engine state ----
  status: 'idle',
  progress: null,
  error: null,

  // ---- Chat state ----
  activeConversation: null,
  conversations: [],

  // ---- UI state ----
  isWidgetOpen: false,
  isPanelExpanded: false,

  // ---- Configuration ----
  role: 'student',
  ageVariant: '68',
  systemPrompt: '',

  // =========================================================================
  // Actions
  // =========================================================================

  initEngine: async () => {
    const { status } = get()

    // Don't re-initialize if already loading or ready
    if (status === 'downloading' || status === 'loading' || status === 'ready') {
      return
    }

    // Guard: WebGPU support check
    // navigator.gpu is not yet in all TS lib DOM typings — use 'in' check
    if (typeof navigator === 'undefined' || !('gpu' in navigator)) {
      set({
        status: 'unsupported',
        error: 'WebGPU is not supported in this browser. Please use Chrome 113+ or Edge 113+.',
      })
      return
    }

    set({ status: 'checking', progress: { percent: 0, text: 'Checking model cache...', stage: 'checking' }, error: null })

    try {
      // Dynamic import — web-llm only works in the browser
      const { CreateMLCEngine } = await import('@mlc-ai/web-llm')

      set({ status: 'downloading', progress: { percent: 0, text: 'Downloading model weights...', stage: 'downloading' } })

      engineInstance = await CreateMLCEngine(MODEL_ID, {
        initProgressCallback: (report) => {
          const progressPercent = Math.round(report.progress * 100)
          const isLoading = report.text.toLowerCase().includes('loading')

          set({
            status: isLoading ? 'loading' : 'downloading',
            progress: {
              percent: progressPercent,
              text: report.text,
              stage: isLoading ? 'loading' : 'downloading',
            },
          })
        },
      })

      set({
        status: 'ready',
        progress: { percent: 100, text: 'Model ready', stage: 'ready' },
        error: null,
      })
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : String(err)
      console.error('[TutorEngine] Init failed:', rawMessage)

      // Map raw WebLLM errors to user-friendly messages
      let userMessage: string
      const lower = rawMessage.toLowerCase()

      if (lower.includes('webgpu') || lower.includes('gpu adapter') || lower.includes('requestadapter')) {
        userMessage = 'Your browser or device does not support WebGPU. Please try Chrome 113+ or Edge 113+ on a device with a compatible GPU.'
      } else if (lower.includes('out of memory') || lower.includes('oom') || lower.includes('allocation')) {
        userMessage = 'Not enough GPU memory to load the AI model. Please close other tabs or applications and try again.'
      } else if (lower.includes('network') || lower.includes('fetch') || lower.includes('failed to load') || lower.includes('typeerror')) {
        userMessage = 'Failed to download the AI model. Please check your internet connection and try again.'
      } else if (lower.includes('aborted') || lower.includes('abort')) {
        userMessage = 'Model download was interrupted. Please try again.'
      } else {
        userMessage = `Failed to load the AI model: ${rawMessage.length > 150 ? rawMessage.slice(0, 150) + '...' : rawMessage}`
      }

      engineInstance = null
      set({
        status: 'error',
        error: userMessage,
        progress: null,
      })
    }
  },

  resetEngine: () => {
    if (engineInstance) {
      try {
        engineInstance.unload()
      } catch {
        // Swallow — engine may already be disposed
      }
      engineInstance = null
    }

    set({
      status: 'idle',
      progress: null,
      error: null,
    })
  },

  // -----------------------------------------------------------------------
  // sendMessage — streaming inference
  // -----------------------------------------------------------------------

  sendMessage: async (content: string) => {
    const { status, activeConversation, systemPrompt } = get()

    if (status !== 'ready' || !engineInstance) {
      console.warn('[TutorEngine] Cannot send message — engine not ready')
      return
    }

    // Ensure there's an active conversation
    let conversation = activeConversation
    if (!conversation) {
      conversation = createConversation()
      set({ activeConversation: conversation })
    }

    // Append user message
    const userMessage: TutorMessage = {
      id: createId(),
      role: 'user',
      content,
      createdAt: new Date(),
    }

    const updatedMessages = [...conversation.messages, userMessage]

    // Create placeholder assistant message for streaming
    const assistantMessage: TutorMessage = {
      id: createId(),
      role: 'assistant',
      content: '',
      createdAt: new Date(),
    }

    const messagesWithAssistant = [...updatedMessages, assistantMessage]

    // Update the conversation title from first user message
    const title = conversation.messages.length === 0
      ? content.slice(0, 60) + (content.length > 60 ? '...' : '')
      : conversation.title

    set({
      status: 'generating',
      activeConversation: {
        ...conversation,
        title,
        messages: messagesWithAssistant,
        updatedAt: new Date(),
      },
    })

    try {
      // Build the messages array for the LLM
      const llmMessages: Array<{ role: 'system' | 'user' | 'assistant'; content: string }> = []

      // System prompt always goes first
      if (systemPrompt) {
        llmMessages.push({ role: 'system', content: systemPrompt })
      }

      // Add conversation history (skip system messages from our own storage)
      for (const msg of updatedMessages) {
        if (msg.role === 'user' || msg.role === 'assistant') {
          llmMessages.push({ role: msg.role, content: msg.content })
        }
      }

      // Stream the response
      const chunks = await engineInstance.chat.completions.create({
        messages: llmMessages,
        stream: true,
        temperature: 0.7,
        max_tokens: 512,
      })

      let accumulated = ''

      for await (const chunk of chunks) {
        const delta = chunk.choices[0]?.delta?.content || ''
        accumulated += delta

        // Update the assistant message content in real-time
        const current = get().activeConversation
        if (current) {
          const msgs = [...current.messages]
          const lastIdx = msgs.length - 1
          if (lastIdx >= 0 && msgs[lastIdx].role === 'assistant') {
            msgs[lastIdx] = { ...msgs[lastIdx], content: accumulated }
          }
          set({
            activeConversation: {
              ...current,
              messages: msgs,
              updatedAt: new Date(),
            },
          })
        }
      }

      // Finalize
      set((state) => {
        const conv = state.activeConversation
        if (!conv) return { status: 'ready' as const }

        // Update the conversation in the conversations list
        const existingIdx = state.conversations.findIndex((c) => c.id === conv.id)
        const updatedConversations = [...state.conversations]
        if (existingIdx >= 0) {
          updatedConversations[existingIdx] = conv
        } else {
          updatedConversations.unshift(conv)
        }

        return {
          status: 'ready' as const,
          conversations: updatedConversations,
        }
      })
    } catch (err) {
      const rawMessage = err instanceof Error ? err.message : String(err)
      console.error('[TutorEngine] Generation error:', rawMessage)

      // Provide a user-friendly error message
      const lower = rawMessage.toLowerCase()
      let userMessage: string
      if (lower.includes('memory') || lower.includes('oom')) {
        userMessage = 'The AI ran out of memory. Try starting a new conversation or refreshing the page.'
      } else if (lower.includes('context') || lower.includes('token')) {
        userMessage = 'The conversation is too long. Please start a new conversation to continue.'
      } else {
        userMessage = 'Failed to generate a response. Please try again.'
      }

      set({
        status: 'ready',
        error: userMessage,
      })
    }
  },

  // -----------------------------------------------------------------------
  // Conversation management
  // -----------------------------------------------------------------------

  startNewConversation: (courseId?: string, lessonId?: string) => {
    const conversation = createConversation(courseId ?? null, lessonId ?? null)
    set({ activeConversation: conversation })
  },

  loadConversation: (conversationId: string) => {
    const { conversations } = get()
    const conversation = conversations.find((c) => c.id === conversationId)
    if (conversation) {
      set({ activeConversation: conversation })
    }
  },

  // -----------------------------------------------------------------------
  // UI
  // -----------------------------------------------------------------------

  setWidgetOpen: (open: boolean) => set({ isWidgetOpen: open }),
  setPanelExpanded: (expanded: boolean) => set({ isPanelExpanded: expanded }),

  // -----------------------------------------------------------------------
  // Configuration
  // -----------------------------------------------------------------------

  setSystemPrompt: (prompt: string) => set({ systemPrompt: prompt }),

  setRole: (role: TutorRole) => set({ role }),

  setAgeVariant: (variant: AgeVariant) => set({ ageVariant: variant }),
}))
