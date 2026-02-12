import Image from 'next/image'
import { LogoSpinner } from '@/components/ui/logo-spinner'

type Variant = 1 | 2 | 3

const BG_MAP: Record<Variant, string> = {
  1: '/chrome-bg.jpg',
  2: '/chrome-bg-2.jpg',
  3: '/chrome-bg-3.jpg',
}

export function LoadingScreen({
  variant = 1,
  fullScreen = false,
}: {
  variant?: Variant
  fullScreen?: boolean
}) {
  return (
    <div
      className={`relative flex items-center justify-center overflow-hidden ${
        fullScreen ? 'min-h-screen' : 'min-h-[60vh] rounded-xl'
      }`}
    >
      <Image
        src={BG_MAP[variant]}
        alt=""
        fill
        className="object-cover"
        priority
      />
      <div className="absolute inset-0 bg-gradient-to-br from-[#E8F8FF]/80 via-[#D0F0FF]/75 to-[#B0E8FF]/80 dark:from-[#041428]/85 dark:via-[#0A2040]/80 dark:to-[#041428]/85" />
      <div className="relative z-10">
        <LogoSpinner size={96} />
      </div>
    </div>
  )
}
