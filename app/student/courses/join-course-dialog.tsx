'use client'

import { useState } from 'react'
import { useRouter } from 'next/navigation'
import { enrollWithCode } from '@/app/actions/courses'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
  DialogDescription,
} from '@/components/ui/dialog'
import { Loader2, KeyRound } from 'lucide-react'

export function JoinCourseDialog() {
  const router = useRouter()
  const [open, setOpen] = useState(false)
  const [code, setCode] = useState('')
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [success, setSuccess] = useState(false)

  async function handleJoin(e: React.FormEvent) {
    e.preventDefault()
    setError(null)
    setSuccess(false)

    if (!code.trim()) {
      setError('Please enter a class code.')
      return
    }

    setIsSubmitting(true)

    try {
      const result = await enrollWithCode(code.trim())

      if (result.error) {
        setError(result.error)
        setIsSubmitting(false)
        return
      }

      setSuccess(true)
      setIsSubmitting(false)

      // Close and navigate after a brief delay
      setTimeout(() => {
        setOpen(false)
        setCode('')
        setSuccess(false)
        if (result.courseId) {
          router.push(`/student/courses/${result.courseId}`)
        } else {
          router.refresh()
        }
      }, 1500)
    } catch {
      setError('An unexpected error occurred. Please try again.')
      setIsSubmitting(false)
    }
  }

  return (
    <Dialog
      open={open}
      onOpenChange={(isOpen) => {
        setOpen(isOpen)
        if (!isOpen) {
          setCode('')
          setError(null)
          setSuccess(false)
        }
      }}
    >
      <DialogTrigger asChild>
        <Button className="whale-gradient text-white">
          <KeyRound className="mr-2 h-4 w-4" />
          Join Course
        </Button>
      </DialogTrigger>
      <DialogContent>
        <DialogHeader>
          <DialogTitle>Join a Course</DialogTitle>
          <DialogDescription>
            Enter the class code your teacher gave you to join the course.
          </DialogDescription>
        </DialogHeader>
        <form onSubmit={handleJoin} className="space-y-4">
          {error && (
            <div className="rounded-lg border border-red-200 bg-red-50 px-4 py-3 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/50 dark:text-red-400">
              {error}
            </div>
          )}

          {success && (
            <div className="rounded-lg border border-green-200 bg-green-50 px-4 py-3 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/50 dark:text-green-400">
              Successfully enrolled! Redirecting to your course...
            </div>
          )}

          <div className="space-y-2">
            <Label htmlFor="class-code">Class Code</Label>
            <Input
              id="class-code"
              placeholder="e.g., ABC123"
              value={code}
              onChange={(e) => setCode(e.target.value.toUpperCase())}
              maxLength={10}
              className="text-center text-lg font-mono tracking-widest"
              disabled={isSubmitting || success}
              autoComplete="off"
            />
            <p className="text-xs text-muted-foreground">
              The code is usually 6 characters. Ask your teacher if you do not
              have one.
            </p>
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => setOpen(false)}
              disabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              type="submit"
              className="whale-gradient text-white"
              disabled={isSubmitting || success || !code.trim()}
            >
              {isSubmitting ? (
                <>
                  <Loader2 className="mr-2 h-4 w-4 animate-spin" />
                  Joining...
                </>
              ) : (
                'Join Course'
              )}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
