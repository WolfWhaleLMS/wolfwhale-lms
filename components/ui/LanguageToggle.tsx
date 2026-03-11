'use client'

import { useState, useRef, useEffect } from 'react'
import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Globe, ChevronDown } from 'lucide-react'

type Lang = 'en' | 'fr' | 'es' | 'de' | 'it' | 'fr_fr' | 'ca' | 'cr_th' | 'cr_y'

const langOptions: { code: Lang; flag: string; label: string; native: string }[] = [
  { code: 'en', flag: '🇬🇧', label: 'English', native: 'English' },
  { code: 'fr', flag: '🇨🇦', label: 'French (Canada)', native: 'Français (Canada)' },
  { code: 'fr_fr', flag: '🇫🇷', label: 'French (France)', native: 'Français (France)' },
  { code: 'es', flag: '🇪🇸', label: 'Spanish', native: 'Español' },
  { code: 'de', flag: '🇩🇪', label: 'German', native: 'Deutsch' },
  { code: 'it', flag: '🇮🇹', label: 'Italian', native: 'Italiano' },
  { code: 'ca', flag: '🏴', label: 'Catalan', native: 'Català' },
  { code: 'cr_y', flag: '🪶', label: 'Plains Cree (Y-dialect)', native: 'nêhiyawêwin' },
  { code: 'cr_th', flag: '🪶', label: 'Woods Cree (Th-dialect)', native: 'nîhithawîwin' },
]

export function LanguageToggle({ lang }: { lang: Lang }) {
  const [open, setOpen] = useState(false)
  const ref = useRef<HTMLDivElement>(null)
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  const current = langOptions.find((l) => l.code === lang) || langOptions[0]

  function switchLang(newLang: Lang) {
    if (newLang === lang) return
    const params = new URLSearchParams(searchParams.toString())
    if (newLang === 'en') {
      params.delete('lang')
    } else {
      params.set('lang', newLang)
    }
    const qs = params.toString()
    router.push(qs ? `${pathname}?${qs}` : pathname, { scroll: false })
    setOpen(false)
  }

  // Close on outside click
  useEffect(() => {
    function handleClick(e: MouseEvent) {
      if (ref.current && !ref.current.contains(e.target as Node)) {
        setOpen(false)
      }
    }
    if (open) document.addEventListener('mousedown', handleClick)
    return () => document.removeEventListener('mousedown', handleClick)
  }, [open])

  // Close on Escape
  useEffect(() => {
    function handleKey(e: KeyboardEvent) {
      if (e.key === 'Escape') setOpen(false)
    }
    if (open) document.addEventListener('keydown', handleKey)
    return () => document.removeEventListener('keydown', handleKey)
  }, [open])

  return (
    <div className="relative" ref={ref}>
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-1.5 h-9 px-2.5 sm:px-3 rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black text-xs sm:text-sm font-medium text-gray-700 dark:text-white/80 cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40"
        aria-expanded={open}
        aria-haspopup="listbox"
      >
        <span className="text-base leading-none">{current.flag}</span>
        <span className="hidden sm:inline">{current.native}</span>
        <span className="sm:hidden">{current.code.toUpperCase()}</span>
        <ChevronDown className={`h-3 w-3 transition-transform duration-150 ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <div
          className="absolute right-0 top-full mt-2 w-72 max-h-[70vh] overflow-y-auto rounded-xl border border-gray-200 dark:border-white/15 bg-white dark:bg-gray-950 shadow-xl shadow-black/15 dark:shadow-black/40 z-[100] py-1.5 animate-fade-in-up"
          role="listbox"
          aria-label="Select language"
        >
          {langOptions.map(({ code, flag, label, native }) => {
            const isActive = code === lang
            return (
              <button
                key={code}
                onClick={() => switchLang(code)}
                role="option"
                aria-selected={isActive}
                className={`w-full flex items-center gap-3 px-4 py-2.5 text-left transition-colors duration-75 ${
                  isActive
                    ? 'bg-gray-100 dark:bg-white/10'
                    : 'hover:bg-gray-50 dark:hover:bg-white/5'
                }`}
              >
                <span className="text-xl leading-none shrink-0">{flag}</span>
                <div className="flex-1 min-w-0">
                  <p className={`text-sm font-medium ${isActive ? 'text-gray-900 dark:text-white' : 'text-gray-700 dark:text-white/80'}`}>
                    {native}
                  </p>
                  <p className="text-xs text-gray-400 dark:text-white/40">{label}</p>
                </div>
                {isActive && (
                  <div className="h-2 w-2 rounded-full bg-[#00BFFF] shrink-0" />
                )}
              </button>
            )
          })}
        </div>
      )}
    </div>
  )
}
