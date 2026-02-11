'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle, User, Lock, GraduationCap, BookOpen, Users, Shield } from 'lucide-react'
import { createClient } from '@/lib/supabase/client'
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

  const redirectTo = searchParams.get('redirectTo') || '/dashboard'

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
    { username: 'student', label: 'Student', icon: GraduationCap, color: 'from-purple-500 to-purple-600', hoverGlow: 'hover:shadow-purple-500/30' },
    { username: 'teacher', label: 'Teacher', icon: BookOpen, color: 'from-amber-500 to-amber-600', hoverGlow: 'hover:shadow-amber-500/30' },
    { username: 'parent', label: 'Parent', icon: Users, color: 'from-emerald-500 to-emerald-600', hoverGlow: 'hover:shadow-emerald-500/30' },
    { username: 'admin', label: 'Admin', icon: Shield, color: 'from-slate-500 to-slate-700', hoverGlow: 'hover:shadow-slate-500/30' },
  ]

  async function handleDemoLogin(username: string) {
    setDemoLoading(username)
    setError(null)

    const supabase = createClient()
    const { error } = await supabase.auth.signInWithPassword({
      email: `${username}@wolfwhale.ca`,
      password: 'demo123',
    })

    if (error) {
      setError(error.message)
      setDemoLoading(null)
      return
    }

    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Demo Quick-Login Buttons */}
      <div className="space-y-3">
        <p className="text-xs text-center text-[#1a2a4e]/50 font-medium uppercase tracking-wider">
          Quick Demo Access
        </p>
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
        <div className="flex-1 h-px bg-[#1a2a4e]/10" />
        <span className="text-xs text-[#1a2a4e]/30 font-medium">or sign in with credentials</span>
        <div className="flex-1 h-px bg-[#1a2a4e]/10" />
      </div>

      <Form {...form}>
        <form onSubmit={form.handleSubmit(onSubmit)} className="space-y-4">
          <FormField
            control={form.control}
            name="email"
            render={({ field }) => (
              <FormItem>
                <FormLabel className="text-[#1a2a4e]/70">Username</FormLabel>
                <FormControl>
                  <div className="relative">
                    <User className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1a2a4e]/30" />
                    <Input
                      type="text"
                      placeholder="student"
                      autoComplete="username"
                      autoFocus
                      disabled={isLoading}
                      className="pl-10 bg-white/80 border-[#1a2a4e]/15 text-[#1a2a4e] placeholder:text-[#1a2a4e]/30 focus:border-[#0a4d68]/50 focus:ring-[#0a4d68]/20"
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
                  <FormLabel className="text-[#1a2a4e]/70">Password</FormLabel>
                  <a
                    href="/forgot-password"
                    className="text-sm text-[#0a4d68]/70 hover:text-[#0a4d68] transition-colors"
                  >
                    Forgot password?
                  </a>
                </div>
                <FormControl>
                  <div className="relative">
                    <Lock className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-[#1a2a4e]/30" />
                    <Input
                      type="password"
                      placeholder="••••••••"
                      autoComplete="current-password"
                      disabled={isLoading}
                      className="pl-10 bg-white/80 border-[#1a2a4e]/15 text-[#1a2a4e] placeholder:text-[#1a2a4e]/30 focus:border-[#0a4d68]/50 focus:ring-[#0a4d68]/20"
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
            className="w-full bg-gradient-to-r from-[#1a2a4e] to-[#0a4d68] text-white font-medium h-11 hover:opacity-90 transition-opacity"
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

      <p className="text-xs text-center text-[#1a2a4e]/40">
        Your administrator will provide your login credentials
      </p>
    </div>
  )
}
