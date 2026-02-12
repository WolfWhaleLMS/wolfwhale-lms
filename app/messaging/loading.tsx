import { LogoSpinner } from '@/components/ui/logo-spinner'

export default function MessagingLoading() {
  return (
    <div className="relative flex min-h-[60vh] items-center justify-center overflow-hidden rounded-xl">
      {/* Chrome texture background */}
      <img src="/chrome-bg-2.jpg" alt="" className="absolute inset-0 w-full h-full object-cover" />
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8F8FF]/80 via-[#D0F0FF]/75 to-[#B0E8FF]/80 dark:from-[#041428]/85 dark:via-[#0A2040]/80 dark:to-[#041428]/85" />
      <div className="relative z-10">
        <LogoSpinner size={96} />
      </div>
    </div>
  )
}
