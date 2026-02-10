'use client'

import { useState } from 'react'
import { Download, FileText, Table2, ChevronDown } from 'lucide-react'

interface ExportButtonProps {
  pdfUrl: string
  csvUrl: string
  label?: string
}

export function ExportButton({ pdfUrl, csvUrl, label = 'Export' }: ExportButtonProps) {
  const [open, setOpen] = useState(false)
  const [loading, setLoading] = useState<string | null>(null)

  const handleDownload = async (url: string, type: string) => {
    setLoading(type)
    try {
      const res = await fetch(url)
      if (!res.ok) {
        const err = await res.json().catch(() => ({ error: 'Download failed' }))
        alert(err.error || 'Download failed')
        return
      }
      const blob = await res.blob()
      const disposition = res.headers.get('content-disposition')
      const filename = disposition?.match(/filename="(.+)"/)?.[1] || `report.${type}`
      const a = document.createElement('a')
      a.href = URL.createObjectURL(blob)
      a.download = filename
      a.click()
      URL.revokeObjectURL(a.href)
    } finally {
      setLoading(null)
      setOpen(false)
    }
  }

  return (
    <div className="relative inline-block">
      <button
        onClick={() => setOpen(!open)}
        className="inline-flex items-center gap-2 rounded-lg border border-border bg-background px-4 py-2 text-sm font-medium text-foreground shadow-sm hover:bg-muted transition-colors"
      >
        <Download className="h-4 w-4" />
        {label}
        <ChevronDown className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`} />
      </button>

      {open && (
        <>
          <div className="fixed inset-0 z-40" onClick={() => setOpen(false)} />
          <div className="absolute right-0 z-50 mt-1 w-44 rounded-lg border border-border bg-background shadow-lg">
            <button
              onClick={() => handleDownload(pdfUrl, 'pdf')}
              disabled={loading === 'pdf'}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors rounded-t-lg disabled:opacity-50"
            >
              <FileText className="h-4 w-4 text-red-500" />
              {loading === 'pdf' ? 'Generating...' : 'Download PDF'}
            </button>
            <button
              onClick={() => handleDownload(csvUrl, 'csv')}
              disabled={loading === 'csv'}
              className="flex w-full items-center gap-3 px-4 py-2.5 text-sm hover:bg-muted transition-colors rounded-b-lg disabled:opacity-50"
            >
              <Table2 className="h-4 w-4 text-green-500" />
              {loading === 'csv' ? 'Generating...' : 'Download CSV'}
            </button>
          </div>
        </>
      )}
    </div>
  )
}
