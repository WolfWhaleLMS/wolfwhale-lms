import { LogoSpinner } from '@/components/ui/logo-spinner'

export default function RootLoading() {
  return (
    <div className="flex min-h-screen items-center justify-center bg-gradient-to-b from-blue-50 to-cyan-50 dark:from-gray-900 dark:to-gray-800">
      <LogoSpinner size={96} />
    </div>
  )
}
