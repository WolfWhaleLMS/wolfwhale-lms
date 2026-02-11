'use client'

import { useState, useEffect } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { ArrowLeft, ArrowRight, Palette, User } from 'lucide-react'
import { AvatarCustomizer } from '@/components/plaza/AvatarCustomizer'
import type { AvatarConfig } from '@/lib/plaza/types'
import { getMyAvatar, createAvatar, updateAvatarConfig } from '@/app/actions/plaza'

export default function AvatarPage() {
  const router = useRouter()
  const [displayName, setDisplayName] = useState('')
  const [isSaving, setIsSaving] = useState(false)
  const [hasSaved, setHasSaved] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [existingAvatar, setExistingAvatar] = useState<{
    id: string
    display_name: string
    avatar_config: AvatarConfig
  } | null>(null)
  const [isLoading, setIsLoading] = useState(true)

  // Load existing avatar data
  useEffect(() => {
    async function loadAvatar() {
      try {
        const avatar = await getMyAvatar()
        if (avatar) {
          setExistingAvatar({
            id: avatar.id,
            display_name: avatar.display_name,
            avatar_config: avatar.avatar_config as AvatarConfig,
          })
          setDisplayName(avatar.display_name)
          setHasSaved(true)
        }
      } catch {
        // No avatar yet, that's fine
      }
      setIsLoading(false)
    }

    loadAvatar()
  }, [])

  const handleSave = async (config: AvatarConfig) => {
    setError(null)

    // Validate display name
    const trimmedName = displayName.trim()
    if (trimmedName.length < 2 || trimmedName.length > 20) {
      setError('Display name must be between 2 and 20 characters.')
      return
    }
    if (!/^[a-zA-Z0-9 ]+$/.test(trimmedName)) {
      setError('Display name can only contain letters, numbers, and spaces.')
      return
    }

    setIsSaving(true)

    try {
      if (existingAvatar) {
        // Update existing avatar via server action
        await updateAvatarConfig(config)
      } else {
        // Create new avatar via server action
        await createAvatar(trimmedName)
        // Then update the config
        await updateAvatarConfig(config)
      }

      setHasSaved(true)
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to save avatar. Please try again.')
    } finally {
      setIsSaving(false)
    }
  }

  if (isLoading) {
    return (
      <div className="flex min-h-full items-center justify-center p-8">
        <div className="text-center">
          <div className="mx-auto mb-4 h-12 w-12 animate-spin rounded-full border-4 border-primary border-t-transparent" />
          <p className="text-muted-foreground">Loading avatar...</p>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-full p-4 md:p-6 lg:p-8">
      {/* Back link */}
      <Link
        href="/plaza"
        className="mb-6 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Plaza
      </Link>

      {/* Header */}
      <div className="mb-8">
        <div className="flex items-center gap-3 mb-2">
          <Palette className="h-7 w-7 text-primary" />
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            {existingAvatar ? 'Customize Your Avatar' : 'Create Your Avatar'}
          </h1>
        </div>
        <p className="text-muted-foreground">
          {existingAvatar
            ? 'Update your look and stand out in the plaza!'
            : 'Design your character to explore the virtual plaza!'}
        </p>
      </div>

      <div className="mx-auto max-w-2xl">
        <div className="ocean-card rounded-2xl p-6 sm:p-8">
          {/* Display Name input */}
          <div className="mb-8">
            <label
              htmlFor="display-name"
              className="mb-2 flex items-center gap-2 text-sm font-semibold text-foreground"
            >
              <User className="h-4 w-4" />
              Display Name
            </label>
            <input
              id="display-name"
              type="text"
              value={displayName}
              onChange={(e) => setDisplayName(e.target.value)}
              placeholder="Enter your plaza name (2-20 characters)"
              maxLength={20}
              className="w-full rounded-xl border border-border bg-background px-4 py-2.5 text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-2 focus:ring-primary/20"
            />
            <p className="mt-1 text-xs text-muted-foreground">
              {displayName.length}/20 characters. Letters, numbers, and spaces only.
            </p>
          </div>

          {/* Avatar Customizer */}
          <AvatarCustomizer
            initialConfig={existingAvatar?.avatar_config}
            onSave={handleSave}
            isSaving={isSaving}
          />

          {/* Error message */}
          {error && (
            <div className="mt-4 rounded-xl bg-red-500/10 p-4 text-sm text-red-600 dark:text-red-400">
              {error}
            </div>
          )}

          {/* Enter Plaza button (shown after saving) */}
          {hasSaved && (
            <div className="mt-6 border-t border-border pt-6">
              <Link
                href="/plaza"
                className="inline-flex w-full items-center justify-center gap-2 rounded-xl bg-gradient-to-r from-indigo-500 to-purple-600 px-6 py-3 text-base font-semibold text-white shadow-lg transition-all hover:shadow-xl hover:scale-[1.02]"
              >
                Enter Plaza
                <ArrowRight className="h-5 w-5" />
              </Link>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
