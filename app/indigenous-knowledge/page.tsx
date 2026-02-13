import Link from 'next/link'
import { ArrowLeft, Feather } from 'lucide-react'
import { PortalTabs } from '@/components/indigenous-knowledge/PortalTabs'

export default function IndigenousKnowledgePage() {
  return (
    <div className="space-y-6 pb-8 overflow-x-hidden max-w-full">
      {/* Back button */}
      <Link
        href="/dashboard"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Hero banner with earth tones */}
      <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-[#D97706] via-[#C2410C] to-[#78350F] p-8 text-white text-white-outlined shadow-2xl sm:p-10">
        {/* Decorative circles */}
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative z-10">
          <div className="flex items-center gap-3 mb-2">
            <Feather className="h-8 w-8 text-[#FEF3C7]" />
            <p className="text-lg font-medium text-white/90 text-white-outlined">
              Truth and Reconciliation
            </p>
          </div>
          <h1 className="text-4xl font-extrabold tracking-tight text-white-outlined sm:text-5xl">
            Indigenous Knowledge Portal
          </h1>
          <p className="mt-2 text-lg text-white/90 text-white-outlined">
            Supporting Truth and Reconciliation Calls to Action 6-12
          </p>
        </div>
      </div>

      {/* Tabs */}
      <PortalTabs />
    </div>
  )
}
