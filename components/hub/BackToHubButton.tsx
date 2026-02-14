import Link from 'next/link'
import { Home } from 'lucide-react'

interface BackToHubButtonProps {
  role: 'student' | 'parent'
}

export function BackToHubButton({ role }: BackToHubButtonProps) {
  const href = role === 'student' ? '/student/dashboard' : '/parent/dashboard'

  return (
    <div className="flex justify-center mb-6">
      <Link href={href} className="hub-back-button">
        <Home className="h-6 w-6 sm:h-7 sm:w-7" />
        <span>Home</span>
      </Link>
    </div>
  )
}
