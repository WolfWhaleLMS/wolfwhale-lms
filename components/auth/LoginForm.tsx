'use client'

import { useState, useCallback } from 'react'
import { useRouter, useSearchParams } from 'next/navigation'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { Loader2, AlertCircle, User, Lock } from 'lucide-react'
import { loginUser } from '@/app/actions/auth'
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
import { DemoLoginButtons } from '@/components/auth/DemoLoginButtons'
import { usePianoMusic } from '@/hooks/usePianoMusic'

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
  const [turnstileToken, setTurnstileToken] = useState<string | null>(null)
  const { destroy: destroyPianoMusic } = usePianoMusic()

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

    const email = data.email.includes('@') ? data.email : `${data.email}@wolfwhale.ca`
    const result = await loginUser({
      email,
      password: data.password,
      turnstileToken: turnstileToken ?? undefined,
    })

    if (result.error) {
      setError(result.error)
      setIsLoading(false)
      return
    }

    // Stop piano music before navigating to the dashboard so it doesn't
    // overlap with the dashboard's study-music radio.
    destroyPianoMusic()
    router.push(redirectTo)
    router.refresh()
  }

  return (
    <div className="space-y-6">
      {/* Demo Quick-Login Buttons */}
      <DemoLoginButtons />

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
