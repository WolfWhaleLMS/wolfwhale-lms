'use client'

import { useState } from 'react'
import { ChevronDown } from 'lucide-react'

interface FAQItem {
  q: string
  a: string
}

interface FAQSection {
  id: string
  heading: string
  items: FAQItem[]
}

function AccordionItem({ item, isOpen, onToggle }: { item: FAQItem; isOpen: boolean; onToggle: () => void }) {
  return (
    <div className="border border-gray-200 dark:border-white/10 rounded-xl overflow-hidden transition-all">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-gray-50 dark:hover:bg-white/[0.03] transition-colors"
      >
        <span className="font-semibold text-gray-900 dark:text-white text-sm sm:text-base">{item.q}</span>
        <ChevronDown
          className={`h-5 w-5 text-[#00BFFF] flex-shrink-0 transition-transform duration-300 ${
            isOpen ? 'rotate-180' : ''
          }`}
        />
      </button>
      <div
        className={`overflow-hidden transition-all duration-300 ease-in-out ${
          isOpen ? 'max-h-96 opacity-100' : 'max-h-0 opacity-0'
        }`}
      >
        <div className="px-5 pb-4 text-sm sm:text-base text-gray-600 dark:text-white/65 leading-relaxed">
          {item.a}
        </div>
      </div>
    </div>
  )
}

export function FAQAccordion({ sections }: { sections: FAQSection[] }) {
  const [openItems, setOpenItems] = useState<Record<string, boolean>>({})

  const toggleItem = (key: string) => {
    setOpenItems((prev) => ({ ...prev, [key]: !prev[key] }))
  }

  return (
    <div className="space-y-8 sm:space-y-10">
      {sections.map((section) => (
        <div key={section.id}>
          <h3 className="text-base sm:text-lg font-semibold text-gray-800 dark:text-white/90 mb-4 border-b border-gray-200 dark:border-white/10 pb-3">
            {section.heading}
          </h3>
          <div className="space-y-3">
            {section.items.map((item, idx) => {
              const key = `${section.id}-${idx}`
              return (
                <div key={key} className="bg-gray-50 dark:bg-white/[0.03] rounded-xl">
                  <AccordionItem
                    item={item}
                    isOpen={!!openItems[key]}
                    onToggle={() => toggleItem(key)}
                  />
                </div>
              )
            })}
          </div>
        </div>
      ))}
    </div>
  )
}
