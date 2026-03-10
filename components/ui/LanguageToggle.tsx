'use client'

import { useRouter, useSearchParams, usePathname } from 'next/navigation'
import { Globe } from 'lucide-react'

type Lang = 'en' | 'fr' | 'es' | 'de' | 'it' | 'fr_fr' | 'ca' | 'cr_th' | 'cr_y'

const langOptions: { code: Lang; label: string }[] = [
  { code: 'en', label: 'EN' },
  { code: 'fr', label: 'FR' },
  { code: 'es', label: 'ES' },
  { code: 'de', label: 'DE' },
  { code: 'it', label: 'IT' },
  { code: 'fr_fr', label: 'FR-FR' },
  { code: 'ca', label: 'CA' },
  { code: 'cr_th', label: 'TH' },
  { code: 'cr_y', label: 'Y' },
]

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
      <select
        value={lang}
        onChange={(e) => switchLang(e.target.value as Lang)}
        className="rounded-lg border border-gray-300 dark:border-white/20 bg-white dark:bg-black px-2 sm:px-3 py-1.5 text-xs sm:text-sm font-medium text-gray-900 dark:text-white cursor-pointer transition-all hover:bg-gray-100 dark:hover:bg-white/10 focus:outline-none focus:ring-2 focus:ring-gray-900 dark:focus:ring-white/40"
      >
        {langOptions.map(({ code, label }) => (
          <option key={code} value={code}>
            {label}
          </option>
        ))}
      </select>
    </div>
  )
}
