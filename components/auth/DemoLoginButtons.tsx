'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { Loader2, GraduationCap, BookOpen, Users, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { getDemoCredentials } from '@/app/actions/demo-auth'

const demoAccounts = [
  { username: 'student', label: 'Student', icon: GraduationCap, chromeBtn: 'btn-chrome-3d-blue' },
  { username: 'teacher', label: 'Teacher', icon: BookOpen, chromeBtn: 'btn-chrome-3d-green' },
  { username: 'parent', label: 'Parent', icon: Users, chromeBtn: 'btn-chrome-3d-silver' },
  { username: 'admin', label: 'Admin', icon: Shield, chromeBtn: 'btn-chrome-3d-red' },
]

interface DemoLoginButtonsProps {
  /** Called after successful login, before navigation */
  onSuccess?: () => void
  /** Where to redirect after login (default: /dashboard) */
  redirectTo?: string
}

export function DemoLoginButtons({ onSuccess, redirectTo = '/dashboard' }: DemoLoginButtonsProps = {}) {
  const router = useRouter()
  const [loading, setLoading] = useState<string | null>(null)
  const [error, setError] = useState<string | null>(null)

  async function handleDemoLogin(username: string) {
    if (loading) return
    setLoading(username)
    setError(null)
    try {
      // Step 1: Get credentials from server (rate-limited, password stays server-side)
      const creds = await getDemoCredentials(username)
      if (creds.error || !creds.email || !creds.password) {
        setError(creds.error || 'Demo login failed.')
        return
      }

      // Step 2: Sign in client-side so browser cookies are set properly
      const supabase = createClient()
      const { error: authError } = await supabase.auth.signInWithPassword({
        email: creds.email,
        password: creds.password,
      })

      if (authError) {
        setError(authError.message)
        return
      }

      // Step 3: Navigate to dashboard
      onSuccess?.()
      router.push(redirectTo)
      router.refresh()
    } catch {
      setError('Demo login failed. Please try again.')
    } finally {
      setLoading(null)
    }
  }

  return (
    <div className="space-y-4">
      <div className="text-center space-y-1.5">
        <h3 className="text-lg font-bold text-[#0A2540]">
          Try It Now — No Sign-Up Required
        </h3>
        <p className="text-sm text-[#0A2540]/60 leading-relaxed">
          Tap any role below to instantly explore WolfWhale as a student, teacher, parent, or admin.
        </p>
      </div>
      <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 max-w-xl mx-auto">
        {demoAccounts.map((account) => {
          const Icon = account.icon
          const isLoading = loading === account.username
          return (
            <button
              key={account.username}
              type="button"
              onClick={() => handleDemoLogin(account.username)}
              disabled={loading !== null}
              className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl ${account.chromeBtn} text-white font-bold transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
            >
              {isLoading ? (
                <Loader2 className="h-6 w-6 animate-spin" />
              ) : (
                <Icon className="h-6 w-6" />
              )}
              <span className="text-sm">{isLoading ? 'Signing in...' : account.label}</span>
            </button>
          )
        })}
      </div>
      {error && (
        <p className="text-sm text-red-600 text-center">{error}</p>
      )}
    </div>
  )
}
