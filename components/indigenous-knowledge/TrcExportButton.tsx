'use client'

import { Download } from 'lucide-react'
import { toast } from 'sonner'

export function TrcExportButton() {
  return (
    <button
      onClick={() =>
        toast('Coming soon! TRC report export will be available in a future update.')
      }
      className="inline-flex items-center gap-2 rounded-xl bg-[#D97706] px-4 py-2 text-sm font-medium text-white transition-colors hover:bg-[#B45309] shadow-md"
    >
      <Download className="h-4 w-4" />
      Export TRC Report
    </button>
  )
}
