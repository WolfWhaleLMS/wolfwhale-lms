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
    <div className="border border-[#0A2540]/10 rounded-xl overflow-hidden transition-all">
      <button
        onClick={onToggle}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left hover:bg-[#0A2540]/[0.03] transition-colors"
      >
        <span className="font-semibold text-[#0A2540] text-sm sm:text-base">{item.q}</span>
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
        <div className="px-5 pb-4 text-sm sm:text-base text-[#0A2540]/70 leading-relaxed">
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
    <div className="space-y-10 sm:space-y-12">
      {sections.map((section) => (
        <section key={section.id} id={section.id} className="scroll-mt-24">
          <h2 className="text-xl sm:text-2xl font-bold text-[#0A2540] mb-4 sm:mb-5 border-b border-[#0A2540]/10 pb-3">
            {section.heading}
          </h2>
          <div className="space-y-3">
            {section.items.map((item, idx) => {
              const key = `${section.id}-${idx}`
              return (
                <div key={key} className="liquid-glass rounded-xl">
                  <AccordionItem
                    item={item}
                    isOpen={!!openItems[key]}
                    onToggle={() => toggleItem(key)}
                  />
                </div>
              )
            })}
          </div>
        </section>
      ))}
    </div>
  )
}
