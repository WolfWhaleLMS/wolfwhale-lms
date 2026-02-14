'use client'

import { useRouter } from 'next/navigation'
import {
  BookOpen,
  ClipboardList,
  GraduationCap,
  CalendarCheck,
  MessageCircle,
  LogOut,
  Users,
  BarChart3,
  MessageSquare,
} from 'lucide-react'
import { HubButton } from './HubButton'
import { HubToggle } from './HubToggle'
import { createClient } from '@/lib/supabase/client'

interface HubScreenProps {
  role: 'student' | 'parent'
  userName: string
  greeting: string
  childCount?: number
}

export function HubScreen({ role, userName, greeting, childCount }: HubScreenProps) {
  const router = useRouter()

  const handleSignOut = async () => {
    const supabase = createClient()
    await supabase.auth.signOut()
    router.push('/login')
    router.refresh()
  }

  return (
    <div className="space-y-8 sm:space-y-12 pb-8 sm:pb-16">
      {/* Greeting */}
      <div className="text-center pt-4 sm:pt-8">
        <p className="text-lg sm:text-2xl text-muted-foreground">{greeting}</p>
        <h1 className="mt-1 text-3xl sm:text-5xl font-extrabold tracking-tight">
          <span className="bg-gradient-to-r from-[#00BFFF] via-[#00FFFF] to-[#33FF33] bg-clip-text text-transparent">
            Hey {userName}!
          </span>
        </h1>
      </div>

      {/* Hub Grid */}
      <div className="max-w-[700px] mx-auto">
        {role === 'student' ? (
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            <HubButton
              icon={<BookOpen className="h-10 w-10 sm:h-12 sm:w-12" />}
              label="My Classes"
              href="/student/courses"
              gradient="bg-gradient-to-br from-[#00BFFF] to-[#00FFFF]"
              glowColor="rgba(0, 191, 255, 0.40)"
            />
            <HubButton
              icon={<ClipboardList className="h-10 w-10 sm:h-12 sm:w-12" />}
              label="Homework"
              href="/student/assignments"
              gradient="bg-gradient-to-br from-[#33FF33] to-[#00FFFF]"
              glowColor="rgba(51, 255, 51, 0.40)"
            />
            <HubButton
              icon={<GraduationCap className="h-10 w-10 sm:h-12 sm:w-12" />}
              label="My Grades"
              href="/student/grades"
              gradient="bg-gradient-to-br from-[#FFD700] to-[#FFAA00]"
              glowColor="rgba(255, 215, 0, 0.40)"
            />
            <HubButton
              icon={<CalendarCheck className="h-10 w-10 sm:h-12 sm:w-12" />}
              label="Attendance"
              href="/student/attendance"
              gradient="bg-gradient-to-br from-[#00FFFF] to-[#00BFFF]"
              glowColor="rgba(0, 255, 255, 0.40)"
            />
            <HubButton
              icon={<MessageCircle className="h-10 w-10 sm:h-12 sm:w-12" />}
              label="Messages"
              href="/messaging"
              gradient="bg-gradient-to-br from-[#00BFFF] to-[#33FF33]"
              glowColor="rgba(0, 191, 255, 0.40)"
            />
            <HubButton
              icon={<LogOut className="h-10 w-10 sm:h-12 sm:w-12" />}
              label="Sign Out"
              onClick={handleSignOut}
              gradient="bg-gradient-to-br from-[#FF3366] to-[#FF6688]"
              glowColor="rgba(255, 51, 102, 0.40)"
            />
          </div>
        ) : (
          /* Parent buttons */
          <div className="grid grid-cols-2 sm:grid-cols-3 gap-6 sm:gap-8 justify-items-center">
            <HubButton
              icon={<Users className="h-10 w-10 sm:h-12 sm:w-12" />}
              label="My Kids"
              href="/parent/children"
              gradient="bg-gradient-to-br from-[#00FFFF] to-[#00BFFF]"
              glowColor="rgba(0, 255, 255, 0.40)"
              badge={childCount}
            />
            <HubButton
              icon={<BarChart3 className="h-10 w-10 sm:h-12 sm:w-12" />}
              label="Progress"
              href="/parent/progress"
              gradient="bg-gradient-to-br from-[#33FF33] to-[#00FFFF]"
              glowColor="rgba(51, 255, 51, 0.40)"
            />
            <HubButton
              icon={<MessageSquare className="h-10 w-10 sm:h-12 sm:w-12" />}
              label="Messages"
              href="/messaging"
              gradient="bg-gradient-to-br from-[#00BFFF] to-[#33FF33]"
              glowColor="rgba(0, 191, 255, 0.40)"
            />
            <HubToggle />
            <HubButton
              icon={<LogOut className="h-10 w-10 sm:h-12 sm:w-12" />}
              label="Sign Out"
              onClick={handleSignOut}
              gradient="bg-gradient-to-br from-[#FF3366] to-[#FF6688]"
              glowColor="rgba(255, 51, 102, 0.40)"
            />
          </div>
        )}
      </div>
    </div>
  )
}
