'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import {
  createDirectMessage,
  createGroupConversation,
} from '@/app/actions/messages'
import { ArrowLeft, Plus, Users, MessageSquare, X, Search } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'

type ConversationType = 'direct' | 'group' | 'class_discussion'

export default function NewConversationPage() {
  const router = useRouter()
  const [type, setType] = useState<ConversationType>('direct')
  const [title, setTitle] = useState('')
  const [memberInput, setMemberInput] = useState('')
  const [memberIds, setMemberIds] = useState<string[]>([])
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  function addMember() {
    const id = memberInput.trim()
    if (!id) return
    if (memberIds.includes(id)) {
      setError('This user ID is already added.')
      return
    }
    setMemberIds((prev) => [...prev, id])
    setMemberInput('')
    setError(null)
  }

  function removeMember(id: string) {
    setMemberIds((prev) => prev.filter((m) => m !== id))
  }

  function handleMemberKeyDown(e: React.KeyboardEvent) {
    if (e.key === 'Enter') {
      e.preventDefault()
      addMember()
    }
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (type === 'direct') {
      if (memberIds.length !== 1) {
        setError('Direct messages require exactly one recipient.')
        return
      }
    } else {
      if (!title.trim()) {
        setError('Please provide a title for the conversation.')
        return
      }
      if (memberIds.length === 0) {
        setError('Please add at least one member.')
        return
      }
    }

    setSubmitting(true)

    try {
      let conversationId: string

      if (type === 'direct') {
        conversationId = await createDirectMessage(memberIds[0])
      } else {
        conversationId = await createGroupConversation(title.trim(), memberIds)
      }

      router.push(`/messaging/${conversationId}`)
    } catch (err) {
      console.error('Failed to create conversation:', err)
      setError(
        err instanceof Error
          ? err.message
          : 'Failed to create conversation. Please try again.'
      )
      setSubmitting(false)
    }
  }

  return (
    <div className="mx-auto max-w-2xl space-y-6 p-4 sm:p-6">
      {/* Header */}
      <div className="flex items-center gap-4">
        <Link
          href="/messaging"
          className="flex size-9 items-center justify-center rounded-xl text-muted-foreground transition-colors hover:bg-muted hover:text-foreground"
        >
          <ArrowLeft className="size-5" />
        </Link>
        <div>
          <h1 className="text-3xl font-bold tracking-tight text-foreground">
            New Conversation
          </h1>
          <p className="mt-1 text-muted-foreground">
            Start a direct message, group chat, or class discussion.
          </p>
        </div>
      </div>

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Conversation Type */}
        <div className="ocean-card rounded-2xl p-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            Conversation Type
          </label>
          <Select
            value={type}
            onValueChange={(value) => {
              setType(value as ConversationType)
              setError(null)
              // Reset members when switching to DM if more than 1
              if (value === 'direct' && memberIds.length > 1) {
                setMemberIds([])
              }
            }}
          >
            <SelectTrigger className="w-full rounded-xl">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="direct">
                <div className="flex items-center gap-2">
                  <MessageSquare className="size-4 text-primary" />
                  Direct Message
                </div>
              </SelectItem>
              <SelectItem value="group">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  Group Chat
                </div>
              </SelectItem>
              <SelectItem value="class_discussion">
                <div className="flex items-center gap-2">
                  <Users className="size-4 text-primary" />
                  Class Discussion
                </div>
              </SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Title (for group/class_discussion) */}
        {type !== 'direct' && (
          <div className="ocean-card rounded-2xl p-6">
            <label
              htmlFor="conv-title"
              className="mb-2 block text-sm font-medium text-foreground"
            >
              Conversation Title
            </label>
            <Input
              id="conv-title"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder={
                type === 'group'
                  ? 'e.g. Study Group - Math 101'
                  : 'e.g. Biology Period 3 Discussion'
              }
              className="rounded-xl"
            />
          </div>
        )}

        {/* Members */}
        <div className="ocean-card rounded-2xl p-6">
          <label className="mb-2 block text-sm font-medium text-foreground">
            {type === 'direct' ? 'Recipient' : 'Members'}
          </label>
          <p className="mb-3 text-xs text-muted-foreground">
            {type === 'direct'
              ? 'Enter the user ID of the person you want to message.'
              : 'Add members by entering their user IDs.'}
          </p>

          {/* Member input */}
          <div className="flex gap-2">
            <div className="relative flex-1">
              <Search className="absolute left-3 top-1/2 size-4 -translate-y-1/2 text-muted-foreground" />
              <Input
                value={memberInput}
                onChange={(e) => setMemberInput(e.target.value)}
                onKeyDown={handleMemberKeyDown}
                placeholder="Enter user ID..."
                className="rounded-xl pl-9"
                disabled={type === 'direct' && memberIds.length >= 1}
              />
            </div>
            <Button
              type="button"
              onClick={addMember}
              disabled={
                !memberInput.trim() ||
                (type === 'direct' && memberIds.length >= 1)
              }
              variant="outline"
              className="rounded-xl"
            >
              <Plus className="size-4" />
              Add
            </Button>
          </div>

          {/* Member list */}
          {memberIds.length > 0 && (
            <div className="mt-3 space-y-2">
              {memberIds.map((id) => (
                <div
                  key={id}
                  className="flex items-center justify-between rounded-xl bg-muted/50 px-4 py-2.5"
                >
                  <div className="flex items-center gap-2 min-w-0">
                    <div className="flex size-7 items-center justify-center rounded-full bg-primary/10">
                      <Users className="size-3.5 text-primary" />
                    </div>
                    <span className="truncate text-sm text-foreground">
                      {id}
                    </span>
                  </div>
                  <button
                    type="button"
                    onClick={() => removeMember(id)}
                    className="ml-2 flex size-7 shrink-0 items-center justify-center rounded-lg text-muted-foreground transition-colors hover:bg-destructive/10 hover:text-destructive"
                  >
                    <X className="size-4" />
                  </button>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Error */}
        {error && (
          <div className="rounded-xl border border-destructive/20 bg-destructive/5 px-4 py-3 text-sm text-destructive">
            {error}
          </div>
        )}

        {/* Submit */}
        <Button
          type="submit"
          disabled={submitting}
          className="whale-gradient w-full rounded-xl py-3 text-white shadow-lg shadow-primary/25 transition-all duration-200 hover:shadow-xl hover:-translate-y-0.5 disabled:opacity-50"
          size="lg"
        >
          {submitting ? (
            <>
              <div className="size-4 animate-spin rounded-full border-2 border-white/30 border-t-white" />
              Creating...
            </>
          ) : (
            <>
              <MessageSquare className="size-4" />
              {type === 'direct'
                ? 'Start Direct Message'
                : 'Create Conversation'}
            </>
          )}
        </Button>
      </form>
    </div>
  )
}
