'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

type Lang = 'en' | 'fr'

export function LanguageToggle({ lang }: { lang: Lang }) {
  const router = useRouter()
  const pathname = usePathname()
  const searchParams = useSearchParams()

  function switchLang(newLang: Lang) {
    if (newLang === lang) return
    const params = new URLSearchParams(searchParams.toString())
    params.set('lang', newLang)
    router.push(`${pathname}?${params.toString()}`, { scroll: false })
  }

  return (
    <div className="flex items-center gap-2 sm:gap-3">
      <Globe className="h-4 w-4 text-gray-400 dark:text-white/40 hidden sm:block" />
      <div className="flex rounded-lg border border-gray-300 dark:border-white/20 overflow-hidden">
        <button
          onClick={() => switchLang('en')}
          className={`px-3 py-1.5 text-sm font-medium transition-all ${
            lang === 'en'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
              : 'text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => switchLang('fr')}
          className={`px-3 py-1.5 text-sm font-medium transition-all ${
            lang === 'fr'
              ? 'bg-gray-900 dark:bg-white text-white dark:text-black'
              : 'text-gray-500 dark:text-white/50 hover:text-gray-900 dark:hover:text-white hover:bg-gray-100 dark:hover:bg-white/10'
          }`}
        >
          FR
        </button>
      </div>
    </div>
  )
}
