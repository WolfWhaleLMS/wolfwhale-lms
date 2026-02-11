import { LogoSpinner } from '@/components/ui/logo-spinner'

export default function LandingPageLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LogoSpinner />
    </div>
  )
}
