'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search } from 'lucide-react'
import { Input } from '@/components/ui/input'

export function UserSearchBar({ defaultValue = '' }: { defaultValue?: string }) {
  const router = useRouter()
  const [value, setValue] = useState(defaultValue)

  const handleSearch = useCallback(
    (query: string) => {
      const trimmed = query.trim()
      if (trimmed) {
        router.push(`/admin/users?q=${encodeURIComponent(trimmed)}`)
      } else {
        router.push('/admin/users')
      }
    },
    [router]
  )

  return (
    <div className="relative max-w-md">
      <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
      <Input
        placeholder="Search by name or email..."
        value={value}
        onChange={(e) => setValue(e.target.value)}
        onKeyDown={(e) => {
          if (e.key === 'Enter') handleSearch(value)
        }}
        className="rounded-xl pl-9"
      />
    </div>
  )
}
