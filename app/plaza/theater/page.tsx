import Link from 'next/link'
import { ArrowLeft, Film, PlayCircle, Calendar, Sparkles } from 'lucide-react'

export default function PlazaTheaterPage() {
  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8">
      {/* Back link */}
      <Link
        href="/plaza"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Plaza
      </Link>

      {/* Coming Soon Content */}
      <div className="mx-auto max-w-2xl">
        <div className="relative overflow-hidden rounded-3xl bg-gradient-to-br from-blue-600 via-indigo-500 to-purple-600 p-10 text-center text-white shadow-2xl">
          <div className="pointer-events-none absolute -right-10 -top-10 h-48 w-48 rounded-full bg-white/10" />
          <div className="pointer-events-none absolute -bottom-8 -left-8 h-36 w-36 rounded-full bg-white/10" />

          <div className="relative z-10">
            <div className="mx-auto mb-6 flex h-20 w-20 items-center justify-center rounded-3xl bg-white/20 backdrop-blur-sm">
              <Film className="h-10 w-10 text-white" />
            </div>

            <div className="mb-3 inline-flex items-center gap-2 rounded-full bg-white/20 px-4 py-1.5 text-sm font-semibold backdrop-blur-sm">
              <Sparkles className="h-4 w-4" />
              Coming Soon
            </div>

            <h1 className="text-4xl font-extrabold tracking-tight">
              Ocean Theater
            </h1>
            <p className="mt-4 text-lg text-white/90 leading-relaxed">
              Watch educational documentaries and videos together with your
              classmates! Synchronized playback, shared viewing experiences, and
              bonus XP for watching to the end.
            </p>
          </div>
        </div>

        {/* Feature preview cards */}
        <div className="mt-8 grid grid-cols-1 gap-4 sm:grid-cols-3">
          {[
            {
              icon: PlayCircle,
              title: 'Synced Playback',
              desc: 'Everyone watches the same thing at the same time',
            },
            {
              icon: Calendar,
              title: 'Scheduled Shows',
              desc: 'Teachers schedule documentary viewings for the class',
            },
            {
              icon: Sparkles,
              title: 'Watch Rewards',
              desc: 'Earn XP and tokens for watching 80%+ of each video',
            },
          ].map((feature) => {
            const Icon = feature.icon
            return (
              <div
                key={feature.title}
                className="ocean-card rounded-2xl p-5 text-center"
              >
                <Icon className="mx-auto mb-3 h-8 w-8 text-blue-500" />
                <h3 className="text-sm font-semibold text-foreground">
                  {feature.title}
                </h3>
                <p className="mt-1 text-xs text-muted-foreground">
                  {feature.desc}
                </p>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}
