'use client'

import { useEffect, useState } from 'react'

export const STUDENT_PREFERENCES_STORAGE_KEY = 'wolfwhale.student.preferences.v1'

export const STUDENT_BACKGROUND_THEMES = [
  {
    id: 'reef-lagoon',
    label: 'Reef Lagoon',
    description: 'Blue lagoon light, bubble glass, coral highlights, and fish-friendly controls.',
  },
  {
    id: 'fisher-price-toybox',
    label: 'Fisher Price Toybox',
    description: 'Large friendly controls, bright learning blocks, and playful classroom energy.',
  },
  {
    id: 'ancient-monolith',
    label: 'Ancient Monolith',
    description: 'Stone tablets, carved progress marks, amber highlights, and calm focus surfaces.',
  },
] as const

export type StudentBackgroundTheme = (typeof STUDENT_BACKGROUND_THEMES)[number]['id']

interface StudentPreferences {
  backgroundTheme: StudentBackgroundTheme
}

const defaultPreferences: StudentPreferences = {
  backgroundTheme: 'reef-lagoon',
}

function isBackgroundTheme(value: unknown): value is StudentBackgroundTheme {
  return STUDENT_BACKGROUND_THEMES.some((theme) => theme.id === value)
}

function readPreferences(): StudentPreferences {
  if (typeof window === 'undefined') return defaultPreferences

  try {
    const parsed = JSON.parse(window.localStorage.getItem(STUDENT_PREFERENCES_STORAGE_KEY) ?? '{}') as Partial<StudentPreferences>

    return {
      backgroundTheme: isBackgroundTheme(parsed.backgroundTheme) ? parsed.backgroundTheme : defaultPreferences.backgroundTheme,
    }
  } catch {
    return defaultPreferences
  }
}

function applyPreferences(preferences: StudentPreferences) {
  if (typeof document === 'undefined') return

  document.documentElement.dataset.studentTheme = preferences.backgroundTheme
}

function savePreferences(preferences: StudentPreferences) {
  if (typeof window === 'undefined') return

  window.localStorage.setItem(STUDENT_PREFERENCES_STORAGE_KEY, JSON.stringify(preferences))
  applyPreferences(preferences)
}

export function StudentPreferenceBridge() {
  useEffect(() => {
    applyPreferences(readPreferences())
  }, [])

  return null
}

export function StudentThemeSettings() {
  const [preferences, setPreferences] = useState<StudentPreferences>(defaultPreferences)

  useEffect(() => {
    const stored = readPreferences()
    setPreferences(stored)
    applyPreferences(stored)
  }, [])

  return (
    <section className="student-workspace-panel rounded-lg border border-white/75 bg-white/84 p-4 shadow-[0_18px_50px_rgba(5,44,38,0.18)] backdrop-blur-md">
      <h2 className="text-lg font-black text-[#17352c]">Background themes</h2>
      <p className="mt-1 text-sm font-semibold leading-6 text-[#48675e]">
        Pick the student dashboard background. It updates immediately on this device.
      </p>
      <div className="mt-4 grid gap-3 md:grid-cols-3">
        {STUDENT_BACKGROUND_THEMES.map((theme) => {
          const selected = preferences.backgroundTheme === theme.id

          return (
            <button
              key={theme.id}
              type="button"
              aria-pressed={selected}
              onClick={() => {
                const nextPreferences = { backgroundTheme: theme.id }
                setPreferences(nextPreferences)
                savePreferences(nextPreferences)
              }}
              className={`min-h-28 rounded-lg border p-4 text-left shadow-[inset_0_1px_0_rgba(255,255,255,0.9)] transition hover:translate-y-[-1px] focus:outline-none focus:ring-2 focus:ring-emerald-700 focus:ring-offset-2 ${
                selected
                  ? 'border-emerald-600 bg-emerald-50 text-[#17352c]'
                  : 'border-emerald-100 bg-white/72 text-[#17352c]'
              }`}
            >
              <span className="block text-base font-black">{theme.label}</span>
              <span className="mt-2 block text-sm font-semibold leading-6 text-[#48675e]">{theme.description}</span>
            </button>
          )
        })}
      </div>
    </section>
  )
}
