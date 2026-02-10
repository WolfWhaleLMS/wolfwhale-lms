'use client'

import { useRouter, useSearchParams } from 'next/navigation'
import { useCallback, useState } from 'react'
import { Search, Filter, RotateCcw, Download } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

const ACTION_TYPES = [
  { value: 'all', label: 'All Actions' },
  { value: 'user.login', label: 'User Login' },
  { value: 'user.logout', label: 'User Logout' },
  { value: 'user.create', label: 'User Create' },
  { value: 'user.update', label: 'User Update' },
  { value: 'user.delete', label: 'User Delete' },
  { value: 'grade.create', label: 'Grade Create' },
  { value: 'grade.update', label: 'Grade Update' },
  { value: 'grade.delete', label: 'Grade Delete' },
  { value: 'grade.view', label: 'Grade View' },
  { value: 'attendance.record', label: 'Attendance Record' },
  { value: 'attendance.update', label: 'Attendance Update' },
  { value: 'course.create', label: 'Course Create' },
  { value: 'course.update', label: 'Course Update' },
  { value: 'course.delete', label: 'Course Delete' },
  { value: 'submission.grade', label: 'Submission Grade' },
  { value: 'submission.view', label: 'Submission View' },
  { value: 'message.send', label: 'Message Send' },
  { value: 'message.delete', label: 'Message Delete' },
  { value: 'settings.update', label: 'Settings Update' },
  { value: 'data.export', label: 'Data Export' },
  { value: 'data.access', label: 'Data Access' },
  { value: 'admin.action', label: 'Admin Action' },
] as const

interface AuditFiltersProps {
  onExport: () => void
}

export function AuditFilters({ onExport }: AuditFiltersProps) {
  const router = useRouter()
  const searchParams = useSearchParams()

  const [userSearch, setUserSearch] = useState(
    searchParams.get('user') ?? ''
  )
  const [action, setAction] = useState(
    searchParams.get('action') ?? 'all'
  )
  const [startDate, setStartDate] = useState(
    searchParams.get('startDate') ?? ''
  )
  const [endDate, setEndDate] = useState(
    searchParams.get('endDate') ?? ''
  )

  const applyFilters = useCallback(() => {
    const params = new URLSearchParams()
    if (userSearch.trim()) params.set('user', userSearch.trim())
    if (action && action !== 'all') params.set('action', action)
    if (startDate) params.set('startDate', startDate)
    if (endDate) params.set('endDate', endDate)
    const qs = params.toString()
    router.push(`/admin/audit-logs${qs ? `?${qs}` : ''}`)
  }, [router, userSearch, action, startDate, endDate])

  const resetFilters = useCallback(() => {
    setUserSearch('')
    setAction('all')
    setStartDate('')
    setEndDate('')
    router.push('/admin/audit-logs')
  }, [router])

  return (
    <div className="ocean-card rounded-2xl p-5">
      <div className="flex items-center gap-2 mb-4">
        <Filter className="size-4 text-muted-foreground" />
        <h3 className="text-sm font-semibold text-foreground">Filters</h3>
      </div>

      <div className="grid grid-cols-1 gap-3 sm:grid-cols-2 lg:grid-cols-5">
        {/* User search */}
        <div className="relative">
          <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Search by user..."
            value={userSearch}
            onChange={(e) => setUserSearch(e.target.value)}
            className="rounded-xl pl-9"
            onKeyDown={(e) => {
              if (e.key === 'Enter') applyFilters()
            }}
          />
        </div>

        {/* Action type select */}
        <Select value={action} onValueChange={setAction}>
          <SelectTrigger className="w-full rounded-xl">
            <SelectValue placeholder="Action type" />
          </SelectTrigger>
          <SelectContent>
            {ACTION_TYPES.map((type) => (
              <SelectItem key={type.value} value={type.value}>
                {type.label}
              </SelectItem>
            ))}
          </SelectContent>
        </Select>

        {/* Start date */}
        <Input
          type="date"
          placeholder="Start date"
          value={startDate}
          onChange={(e) => setStartDate(e.target.value)}
          className="rounded-xl"
        />

        {/* End date */}
        <Input
          type="date"
          placeholder="End date"
          value={endDate}
          onChange={(e) => setEndDate(e.target.value)}
          className="rounded-xl"
        />

        {/* Action buttons */}
        <div className="flex items-center gap-2">
          <Button
            onClick={applyFilters}
            size="sm"
            className="flex-1"
          >
            Apply
          </Button>
          <Button
            onClick={resetFilters}
            variant="outline"
            size="icon"
            title="Reset filters"
          >
            <RotateCcw className="size-4" />
          </Button>
        </div>
      </div>

      {/* Export row */}
      <div className="mt-3 flex justify-end">
        <Button onClick={onExport} variant="outline" size="sm">
          <Download className="size-4" />
          Export CSV
        </Button>
      </div>
    </div>
  )
}
