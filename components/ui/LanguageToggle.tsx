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
      <Globe className="h-4 w-4 text-[#0A2540]/50 hidden sm:block" />
      <div className="flex rounded-lg border border-[#0A2540]/20 overflow-hidden">
        <button
          onClick={() => switchLang('en')}
          className={`px-3 py-1.5 text-sm font-medium transition-all ${
            lang === 'en'
              ? 'bg-gradient-to-r from-[#0A2540] to-[#00BFFF] text-white'
              : 'text-[#0A2540]/60 hover:text-[#0A2540] hover:bg-[#0A2540]/5'
          }`}
        >
          EN
        </button>
        <button
          onClick={() => switchLang('fr')}
          className={`px-3 py-1.5 text-sm font-medium transition-all ${
            lang === 'fr'
              ? 'bg-gradient-to-r from-[#0A2540] to-[#00BFFF] text-white'
              : 'text-[#0A2540]/60 hover:text-[#0A2540] hover:bg-[#0A2540]/5'
          }`}
        >
          FR
        </button>
      </div>
    </div>
  )
}
