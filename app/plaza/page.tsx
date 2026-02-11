import { redirect } from 'next/navigation'
import { headers } from 'next/headers'
import Link from 'next/link'
import { createClient } from '@/lib/supabase/server'
import {
  Map,
  Gamepad2,
  ShoppingBag,
  BookOpen,
  Film,
  Users,
  Palette,
  ArrowLeft,
} from 'lucide-react'

export default async function PlazaPage() {
  const supabase = await createClient()
  const {
    data: { user },
  } = await supabase.auth.getUser()

  if (!user) redirect('/login')

  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')

  // Check if user has an avatar; if not, redirect to avatar creation
  let hasAvatar = false
  let avatarDisplayName = 'Explorer'
  let tokenBalance = 0

  if (tenantId) {
    const { data: avatar } = await supabase
      .from('plaza_avatars')
      .select('id, display_name, token_balance')
      .eq('tenant_id', tenantId)
      .eq('user_id', user.id)
      .single()

    if (!avatar) {
      redirect('/plaza/avatar')
    }

    hasAvatar = true
    avatarDisplayName = avatar.display_name
    tokenBalance = avatar.token_balance ?? 0
  }

  // Room data - the buildings/locations in the plaza
  const rooms = [
    {
      name: 'Game House',
      description: 'Play educational mini games and earn tokens',
      href: '/plaza/games',
      icon: Gamepad2,
      gradient: 'from-violet-500 to-purple-600',
      bg: 'bg-violet-50 dark:bg-violet-950/30',
    },
    {
      name: 'Avatar Store',
      description: 'Buy hats, outfits, and accessories for your avatar',
      href: '/plaza/store',
      icon: ShoppingBag,
      gradient: 'from-amber-400 to-orange-500',
      bg: 'bg-amber-50 dark:bg-amber-950/30',
    },
    {
      name: 'Study Hall',
      description: 'Join study sessions with classmates',
      href: '/plaza/study',
      icon: BookOpen,
      gradient: 'from-emerald-500 to-teal-500',
      bg: 'bg-emerald-50 dark:bg-emerald-950/30',
    },
    {
      name: 'Ocean Theater',
      description: 'Watch educational documentaries together',
      href: '/plaza/theater',
      icon: Film,
      gradient: 'from-blue-500 to-cyan-500',
      bg: 'bg-blue-50 dark:bg-blue-950/30',
    },
    {
      name: 'Customize Avatar',
      description: 'Change your look, colors, and style',
      href: '/plaza/avatar',
      icon: Palette,
      gradient: 'from-pink-500 to-rose-500',
      bg: 'bg-pink-50 dark:bg-pink-950/30',
    },
  ]

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8">
      {/* Back link */}
      <Link
        href="/student/dashboard"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Dashboard
      </Link>

      {/* Hero banner */}
      <div className="relative mb-8 overflow-hidden rounded-3xl bg-gradient-to-br from-indigo-600 via-purple-500 to-cyan-500 p-8 text-white shadow-2xl sm:p-10">
        <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />
        <div className="pointer-events-none absolute right-1/4 top-1/3 h-20 w-20 rounded-full bg-white/5" />

        <div className="relative z-10 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-3 mb-2">
              <Map className="h-8 w-8 text-cyan-200" />
              <p className="text-lg font-medium text-white/80">Welcome to the Plaza</p>
            </div>
            <h1 className="text-4xl font-extrabold tracking-tight sm:text-5xl">
              Hey {avatarDisplayName}!
            </h1>
            <p className="mt-2 text-lg text-white/90">
              Explore the town, play games, and hang out with friends.
            </p>
          </div>

          {/* Online count placeholder */}
          <div className="hidden sm:flex items-center gap-2 rounded-full bg-white/20 px-4 py-2 text-sm font-semibold backdrop-blur-sm">
            <Users className="h-4 w-4" />
            <span>Plaza</span>
          </div>
        </div>
      </div>

      {/* Room grid */}
      <div className="grid grid-cols-1 gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {rooms.map((room) => {
          const Icon = room.icon
          return (
            <Link
              key={room.name}
              href={room.href}
              className="group relative overflow-hidden rounded-2xl shadow-md transition-all duration-300 hover:-translate-y-1 hover:shadow-xl"
            >
              {/* Colored top band */}
              <div
                className={`flex h-32 items-end bg-gradient-to-br ${room.gradient} p-5 transition-all duration-300 group-hover:h-36`}
              >
                <div className="relative z-10">
                  <Icon className="h-8 w-8 text-white/80 mb-2" />
                  <h3 className="text-xl font-bold text-white drop-shadow-sm">
                    {room.name}
                  </h3>
                </div>
                <div className="pointer-events-none absolute -right-4 -top-4 h-24 w-24 rounded-full bg-white/10" />
              </div>

              {/* Description */}
              <div className="rounded-b-2xl bg-card p-5">
                <p className="text-sm text-muted-foreground">
                  {room.description}
                </p>
              </div>
            </Link>
          )
        })}
      </div>

      {/* Info note */}
      <div className="mt-8 rounded-2xl border border-border bg-card p-6 text-center">
        <p className="text-sm text-muted-foreground">
          The full interactive plaza world with real-time avatars is coming soon.
          For now, explore each building by clicking the cards above!
        </p>
      </div>
    </div>
  )
}
