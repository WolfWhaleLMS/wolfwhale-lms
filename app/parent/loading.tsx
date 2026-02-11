import { LogoSpinner } from '@/components/ui/logo-spinner'

export default function ParentLoading() {
  return (
    <div className="flex min-h-[60vh] items-center justify-center">
      <LogoSpinner />
    </div>
  )
}
