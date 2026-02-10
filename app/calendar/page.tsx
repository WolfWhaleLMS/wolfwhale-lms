import { getCalendarEvents } from '@/app/actions/calendar'
import { startOfMonth, endOfMonth, addMonths, subMonths, format } from 'date-fns'
import CalendarClient from './CalendarClient'

export default async function CalendarPage({
  searchParams,
}: {
  searchParams: Promise<{ month?: string }>
}) {
  const params = await searchParams
  const monthParam = params.month
  const currentMonth = monthParam ? new Date(monthParam + '-01') : new Date()

  // Fetch 3 months of data (prev, current, next) so client can navigate smoothly
  const prevMonth = subMonths(currentMonth, 1)
  const nextMonth = addMonths(currentMonth, 1)
  const startDate = format(startOfMonth(prevMonth), 'yyyy-MM-dd')
  const endDate = format(endOfMonth(nextMonth), 'yyyy-MM-dd')

  let events: Awaited<ReturnType<typeof getCalendarEvents>> = []
  try {
    events = await getCalendarEvents(startDate, endDate)
  } catch {
    // User may not be authenticated or no tenant
  }

  return (
    <CalendarClient
      initialEvents={events}
      initialMonth={format(currentMonth, 'yyyy-MM')}
    />
  )
}
