"use client"

import { useState } from "react"
import * as Tabs from "@radix-ui/react-tabs"
import { CheckCircle2 } from "lucide-react"

interface SystemToggleProps {
  lms: {
    title: string
    description: string
    items: string[]
  }
  sis: {
    title: string
    description: string
    items: string[]
  }
}

const PURPLE = "#8B5CF6"
const CYAN = "#0891B2"

function FeatureCard({
  title,
  description,
  items,
  accent,
}: {
  title: string
  description: string
  items: string[]
  accent: string
}) {
  return (
    <div className="bg-gray-50 dark:bg-white/5 backdrop-blur-xl border border-gray-200 dark:border-white/10 rounded-2xl p-6 sm:p-8 space-y-4 text-left">
      <span
        className="inline-flex px-3 py-1 rounded-full text-xs font-semibold"
        style={{
          backgroundColor: `${accent}1A`,
          borderWidth: 1,
          borderColor: `${accent}33`,
          color: accent,
        }}
      >
        {title}
      </span>
      <h3
        className="text-xl sm:text-2xl font-bold text-gray-900 dark:text-white"
        style={{ fontFamily: "'Times New Roman', Times, Georgia, serif" }}
      >
        {description}
      </h3>
      <ul className="space-y-2.5">
        {items.map((item) => (
          <li key={item} className="flex items-start gap-2.5 text-sm text-gray-600 dark:text-white/70">
            <span
              className="mt-1.5 h-2 w-2 shrink-0 rounded-full"
              style={{ backgroundColor: accent }}
              aria-hidden="true"
            />
            {item}
          </li>
        ))}
      </ul>
    </div>
  )
}

export function SystemToggle({ lms, sis }: SystemToggleProps) {
  const [activeTab, setActiveTab] = useState("both")

  return (
    <Tabs.Root
      value={activeTab}
      onValueChange={setActiveTab}
      className="w-full space-y-8"
    >
      {/* Centered tab triggers */}
      <div className="flex justify-center">
        <Tabs.List className="inline-flex p-1 rounded-xl bg-gray-100 dark:bg-white/5 border border-gray-200 dark:border-white/10">
          <Tabs.Trigger
            value="lms"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:dark:bg-white/10 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:dark:text-white/50 data-[state=inactive]:hover:text-gray-700"
            style={{
              color: activeTab === "lms" ? PURPLE : undefined,
            }}
          >
            LMS
          </Tabs.Trigger>
          <Tabs.Trigger
            value="both"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:dark:bg-white/10 data-[state=active]:text-gray-900 data-[state=active]:dark:text-white data-[state=active]:shadow-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:dark:text-white/50 data-[state=inactive]:hover:text-gray-700"
          >
            Both
          </Tabs.Trigger>
          <Tabs.Trigger
            value="sis"
            className="px-4 py-2 rounded-lg text-sm font-medium transition-all duration-200 data-[state=active]:bg-white data-[state=active]:dark:bg-white/10 data-[state=active]:shadow-sm data-[state=inactive]:text-gray-500 data-[state=inactive]:dark:text-white/50 data-[state=inactive]:hover:text-gray-700"
            style={{
              color: activeTab === "sis" ? CYAN : undefined,
            }}
          >
            SIS
          </Tabs.Trigger>
        </Tabs.List>
      </div>

      {/* Tab content with fade transition */}
      <Tabs.Content
        value="lms"
        className="animate-fade-in data-[state=inactive]:animate-fade-out"
      >
        <div className="max-w-xl mx-auto">
          <FeatureCard
            title={lms.title}
            description={lms.description}
            items={lms.items}
            accent={PURPLE}
          />
        </div>
      </Tabs.Content>

      <Tabs.Content
        value="sis"
        className="animate-fade-in data-[state=inactive]:animate-fade-out"
      >
        <div className="max-w-xl mx-auto">
          <FeatureCard
            title={sis.title}
            description={sis.description}
            items={sis.items}
            accent={CYAN}
          />
        </div>
      </Tabs.Content>

      <Tabs.Content
        value="both"
        className="animate-fade-in data-[state=inactive]:animate-fade-out"
      >
        <div className="grid grid-cols-1 sm:grid-cols-2 gap-5">
          <FeatureCard
            title={lms.title}
            description={lms.description}
            items={lms.items}
            accent={PURPLE}
          />
          <FeatureCard
            title={sis.title}
            description={sis.description}
            items={sis.items}
            accent={CYAN}
          />
        </div>
      </Tabs.Content>

      {/* Inline keyframes for fade animation */}
      <style>{`
        @keyframes fadeIn {
          from { opacity: 0; transform: translateY(4px); }
          to   { opacity: 1; transform: translateY(0); }
        }
        @keyframes fadeOut {
          from { opacity: 1; transform: translateY(0); }
          to   { opacity: 0; transform: translateY(4px); }
        }
        .animate-fade-in {
          animation: fadeIn 200ms ease-out forwards;
        }
        .animate-fade-out {
          animation: fadeOut 150ms ease-in forwards;
        }
      `}</style>
    </Tabs.Root>
  )
}
