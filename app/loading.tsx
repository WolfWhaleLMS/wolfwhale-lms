import { LogoSpinner } from '@/components/ui/logo-spinner'

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-br from-[#E8F8FF] via-[#D0F0FF] to-[#B0E8FF] dark:from-[#041428] dark:via-[#0A2040] dark:to-[#041428]">
      <LogoSpinner size={96} />
    </div>
  )
}
