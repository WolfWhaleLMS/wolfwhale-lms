'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle, User, Lock, GraduationCap, BookOpen, Users, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
import { demoLogin } from '@/app/actions/demo-auth'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
  FormMessage,
} from '@/components/ui/form'
import { TurnstileWidget } from '@/components/auth/TurnstileWidget'

const loginSchema = z.object({
  email: z.string().min(1, 'Please enter your username'),
  password: z.string().min(1, 'Please enter your password'),
})

type LoginFormValues = z.infer<typeof loginSchema>

export function LoginForm() {
  const router = useRouter()
  const searchParams = useSearchParams()
  const [error, setError] = useState<string | null>(null)
  const [isLoading, setIsLoading] = useState(false)
  const [demoLoading, setDemoLoading] = useState<string | null>(null)
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)

  const turnstileEnabled = !!process.env.NEXT_PUBLIC_TURNSTILE_SITE_KEY

  const handleTurnstileVerify = useCallback((token: string) => {
    setTurnstileToken(token)
  }, [])

  const handleTurnstileExpire = useCallback(() => {
    setTurnstileToken(null)
  }, [])

  const rawRedirect = searchParams.get('redirectTo') || '/dashboard'
  const redirectTo = (() => {
    if (!rawRedirect.startsWith('/') || rawRedirect.startsWith('//') || rawRedirect.includes('\\')) return '/dashboard'
    try {
      const url = new URL(rawRedirect, 'https://wolfwhale.ca')
      if (url.hostname !== 'wolfwhale.ca') return '/dashboard'
      return rawRedirect
    } catch {
      return '/dashboard'
    }
  })()

  const form = useForm<LoginFormValues>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  })

  async function onSubmit(data: LoginFormValues) {
    setIsLoading(true)
    setError(null)

    if (turnstileEnabled && !turnstileToken) {
      setError('Please complete the CAPTCHA verification.')
      setIsLoading(false)
      return
    }

    const supabase = createClient()
    const email = data.email.includes('@') ? data.email : `${data.email}@wolfwhale.ca`
    const { error } = await supabase.auth.signInWithPassword({
      email,
      password: data.password,
    })

    if (error) {
      setError(error.message)
      setIsLoading(false)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  const demoAccounts = [
    { username: 'student', label: 'Student', icon: GraduationCap, color: 'from-[#00BFFF] to-[#00BFFF]/80', hoverGlow: 'hover:shadow-[0_0_20px_rgba(0,191,255,0.3)]' },
    { username: 'teacher', label: 'Teacher', icon: BookOpen, color: 'from-[#059669] to-[#059669]/80', hoverGlow: 'hover:shadow-[0_0_20px_rgba(5,150,105,0.3)]' },
    { username: 'parent', label: 'Parent', icon: Users, color: 'from-[#00FFFF] to-[#00FFFF]/80', hoverGlow: 'hover:shadow-[0_0_20px_rgba(0,255,255,0.3)]' },
    { username: 'admin', label: 'Admin', icon: Shield, color: 'from-[#D97706] to-[#D97706]/80', hoverGlow: 'hover:shadow-[0_0_20px_rgba(217,119,6,0.3)]' },
  ]

  async function handleDemoLogin(username: string) {
    if (isLoading) return
    setDemoLoading(username)
    setIsLoading(true)
    setError(null)
    try {
      const result = await demoLogin(username)
      if (result.error) {
        setError(result.error)
        return
      }
      router.push(redirectTo)
    } catch {
      setError('Demo login failed. Please try again.')
    } finally {
      setIsLoading(false)
      setDemoLoading(null)
    }
  }

  return (
    <div className="space-y-6">
      {/* Demo Quick-Login Buttons */}
      <div className="space-y-4">
        <div className="text-center space-y-1.5">
          <h3 className="text-lg font-bold text-[#0A2540]">
            Try It Now — No Sign-Up Required
          </h3>
          <p className="text-sm text-muted-foreground leading-relaxed">
            Tap any role below to instantly explore WolfWhale as a student, teacher, parent, or admin.
          </p>
        </div>
        <div className="grid grid-cols-2 gap-3">
          {demoAccounts.map((account) => {
            const Icon = account.icon
            const loading = demoLoading === account.username
            return (
              <button
                key={account.username}
                type="button"
                onClick={() => handleDemoLogin(account.username)}
                disabled={isLoading || demoLoading !== null}
                className={`flex flex-col items-center justify-center gap-2 p-4 rounded-xl bg-gradient-to-br ${account.color} text-white font-semibold shadow-md ${account.hoverGlow} hover:shadow-lg hover:scale-[1.03] active:scale-[0.98] transition-all disabled:opacity-50 disabled:cursor-not-allowed`}
              >
                {loading ? (
                  <Loader2 className="h-6 w-6 animate-spin" />
                ) : (
                  <Icon className="h-6 w-6" />
                )}
                <span className="text-sm">{loading ? 'Signing in...' : account.label}</span>
              </button>
            )
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="flex items-center gap-3">
        <div className="flex-1 h-px bg-[#00BFFF]/15" />
        <span className="text-xs text-muted-foreground font-medium">or sign in with credentials</span>
        <div className="flex-1 h-px bg-[#00BFFF]/15" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#0A2540]/70">Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00BFFF]/40" />
                    <Input
                      type="text"
                      placeholder="student"
                      autoComplete="username"
                      autoFocus
                      disabled={isLoading}
                      className="pl-10 bg-white/80 border-[#00BFFF]/20 text-[#0A2540] placeholder:text-[#0A2540]/30 focus:border-[#00BFFF] focus:ring-[#00BFFF]/30"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          <FormField
            control={form.control}
            name="password"
            render={({ field }) => (
              <FormItem>
                <div className="flex items-center justify-between">
                  <FormLabel className="text-[#0A2540]/70">Password</FormLabel>
                  <a
                    href="/forgot-password"
                    className="text-sm text-[#00BFFF]/70 hover:text-[#00BFFF] transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#00BFFF]/40" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="pl-10 bg-white/80 border-[#00BFFF]/20 text-[#0A2540] placeholder:text-[#0A2540]/30 focus:border-[#00BFFF] focus:ring-[#00BFFF]/30"
                      {...field}
                    />
                  </div>
                </FormControl>
                <FormMessage className="text-red-500" />
              </FormItem>
            )}
          />

          {error && (
            <div className="flex items-center gap-2 text-sm text-red-600 bg-red-50 border border-red-200 p-3 rounded-lg">
              <AlertCircle className="h-4 w-4 shrink-0" />
              <span>{error}</span>
            </div>
          )}

          <TurnstileWidget
            onVerify={handleTurnstileVerify}
            onExpire={handleTurnstileExpire}
          />

          <Button
            type="submit"
            className="w-full bg-[#00BFFF] text-white font-medium h-11 hover:shadow-[0_0_25px_rgba(0,191,255,0.4)] hover:bg-[#00BFFF]/90 transition-all"
            disabled={isLoading}
          >
            {isLoading ? (
              <>
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
                Signing in...
              </>
            ) : (
              'Sign in'
            )}
          </Button>
        </form>
      </Form>

      <p className="text-xs text-center text-muted-foreground">
        Your administrator will provide your login credentials
      </p>
    </div>
  )
}
