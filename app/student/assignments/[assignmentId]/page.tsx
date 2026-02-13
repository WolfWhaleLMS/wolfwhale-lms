'use client'

import { useEffect, useState, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import { getAssignment } from '@/app/actions/assignments'
import { getMySubmission, submitWork } from '@/app/actions/submissions'
import { ASSIGNMENT_TYPES, SUBMISSION_TYPES } from '@/lib/config/constants'
import {
  FileText,
  Download,
  ExternalLink,
  Link2,
  Upload,
  X,
  Loader2,
  File,
  FileImage,
  FileSpreadsheet,
  FileArchive,
  Paperclip,
  ArrowLeft,
  CheckCircle2,
  AlertTriangle,
  RotateCcw,
  Clock,
  Award,
  Send,
} from 'lucide-react'
import Link from 'next/link'
import { createBrowserClient } from '@supabase/ssr'
import { toast } from 'sonner'

type TeacherAttachment = {
  url: string
  type: 'file' | 'link'
  fileName?: string
  fileSize?: number
  fileType?: string
  title?: string
}

type UploadedFile = {
  url: string
  fileName: string
  fileSize: number
  fileType: string
}

const STUDENT_ACCEPTED_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'application/zip',
  'application/x-zip-compressed',
  'text/plain',
]

const STUDENT_ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx,.ppt,.pptx,.png,.jpg,.jpeg,.gif,.webp,.zip,.txt'

const MAX_SUBMISSION_SIZE = 50 * 1024 * 1024 // 50MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(fileType: string) {
  if (fileType?.includes('pdf')) return FileText
  if (fileType?.includes('image')) return FileImage
  if (fileType?.includes('sheet') || fileType?.includes('excel')) return FileSpreadsheet
  if (fileType?.includes('zip')) return FileArchive
  return File
}

interface AssignmentData {
  id: string
  title: string
  description: string | null
  type: string
  due_date: string | null
  max_points: number
  submission_type: string
  allow_late_submission: boolean
  status: string
  attachments?: string | TeacherAttachment[] | null
  courses: {
    id: string
    name: string
  }
}

interface SubmissionData {
  id: string
  submission_text: string | null
  file_path: string[] | null
  submitted_at: string
  status: string
  is_late: boolean
  return_feedback?: string | null
}

interface GradeData {
  id: string
  points_earned: number
  percentage: number
  letter_grade: string
  feedback: string | null
  rubric_scores: Record<string, number> | null
  graded_at: string
}

function formatDate(dateStr: string | null) {
  if (!dateStr) return 'No due date'
  return new Date(dateStr).toLocaleDateString('en-US', {
    weekday: 'long',
    month: 'long',
    day: 'numeric',
    year: 'numeric',
    hour: 'numeric',
    minute: '2-digit',
  })
}

function isPastDue(dateStr: string | null) {
  if (!dateStr) return false
  return new Date(dateStr) < new Date()
}

function timeUntilDue(dateStr: string | null) {
  if (!dateStr) return null
  const due = new Date(dateStr)
  const now = new Date()
  const diffMs = due.getTime() - now.getTime()
  if (diffMs < 0) return 'Past due'
  const hours = Math.floor(diffMs / (1000 * 60 * 60))
  const days = Math.floor(hours / 24)
  if (days > 0) return `${days} day${days !== 1 ? 's' : ''} remaining`
  if (hours > 0) return `${hours} hour${hours !== 1 ? 's' : ''} remaining`
  const minutes = Math.floor(diffMs / (1000 * 60))
  return `${minutes} minute${minutes !== 1 ? 's' : ''} remaining`
}

export default function StudentAssignmentDetailPage() {
  const params = useParams()
  const router = useRouter()
  const assignmentId = params.assignmentId as string

  const [assignment, setAssignment] = useState<AssignmentData | null>(null)
  const [submission, setSubmission] = useState<SubmissionData | null>(null)
  const [grade, setGrade] = useState<GradeData | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // Submission form state
  const [content, setContent] = useState('')
  const [linkUrl, setLinkUrl] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [submitError, setSubmitError] = useState<string | null>(null)
  const [submitSuccess, setSubmitSuccess] = useState(false)

  // File upload state
  const [uploadedFiles, setUploadedFiles] = useState<UploadedFile[]>([])
  const [fileUploading, setFileUploading] = useState(false)
  const [dragOver, setDragOver] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)

  useEffect(() => {
    loadData()
  }, [assignmentId])

  async function loadData() {
    setLoading(true)
    const [assignmentResult, submissionResult] = await Promise.all([
      getAssignment(assignmentId),
      getMySubmission(assignmentId),
    ])

    if (assignmentResult.error) {
      setError(assignmentResult.error)
    } else {
      setAssignment(assignmentResult.data as AssignmentData)
    }

    if (submissionResult.data) {
      setSubmission(submissionResult.data as SubmissionData)
      if (submissionResult.data.submission_text) {
        setContent(submissionResult.data.submission_text)
      }
    }
    if (submissionResult.grade) {
      setGrade(submissionResult.grade as GradeData)
    }

    setLoading(false)
  }

  // Parse teacher attachments
  const parseAttachments = useCallback((): TeacherAttachment[] => {
    if (!assignment?.attachments) return []
    try {
      if (typeof assignment.attachments === 'string') {
        return JSON.parse(assignment.attachments)
      }
      if (Array.isArray(assignment.attachments)) {
        return assignment.attachments
      }
    } catch {
      // Ignore parse errors
    }
    return []
  }, [assignment])

  const teacherAttachments = parseAttachments()
  const teacherFiles = teacherAttachments.filter((a) => a.type === 'file')
  const teacherLinks = teacherAttachments.filter((a) => a.type === 'link')

  // Student file upload handler
  async function handleStudentFileUpload(files: FileList | null) {
    if (!files || files.length === 0) return

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    // We need a user ID for the path - get it from the session
    const { data: { user } } = await supabase.auth.getUser()
    if (!user) {
      toast.error('Not authenticated')
      return
    }

    setFileUploading(true)

    for (const file of Array.from(files)) {
      if (file.size > MAX_SUBMISSION_SIZE) {
        toast.error(`${file.name} exceeds the 50MB limit`)
        continue
      }

      if (!STUDENT_ACCEPTED_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not an accepted file type`)
        continue
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `${assignmentId}/${user.id}/${Date.now()}_${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('submissions')
        .upload(path, file)

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}: ${uploadError.message}`)
        continue
      }

      const { data: urlData } = supabase.storage
        .from('submissions')
        .getPublicUrl(path)

      setUploadedFiles((prev) => [
        ...prev,
        {
          url: urlData.publicUrl,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        },
      ])

      toast.success(`${file.name} uploaded`)
    }

    setFileUploading(false)
  }

  function removeUploadedFile(index: number) {
    setUploadedFiles((prev) => prev.filter((_, i) => i !== index))
  }

  function handleDragOver(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(true)
  }

  function handleDragLeave(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
  }

  function handleDrop(e: React.DragEvent) {
    e.preventDefault()
    setDragOver(false)
    handleStudentFileUpload(e.dataTransfer.files)
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setSubmitError(null)
    setSubmitSuccess(false)

    if (!content.trim() && !linkUrl.trim() && uploadedFiles.length === 0) {
      setSubmitError('Please enter your submission content or upload a file')
      return
    }

    setSubmitting(true)

    // For link submissions, wrap the URL in the content
    const submissionContent = assignment?.submission_type === 'link'
      ? linkUrl.trim()
      : content.trim()

    const fileUrls = uploadedFiles.map((f) => f.url)

    const result = await submitWork(assignmentId, {
      content: submissionContent || undefined,
      fileUrls: fileUrls.length > 0 ? fileUrls : undefined,
    })

    if (result.error) {
      setSubmitError(result.error)
    } else {
      setSubmitSuccess(true)
      setSubmission(result.data as SubmissionData)
    }

    setSubmitting(false)
  }

  if (loading) {
    return (
      <div className="mx-auto max-w-3xl space-y-8 animate-in fade-in duration-300">
        {/* Back button skeleton */}
        <div className="h-5 w-36 rounded bg-muted animate-pulse" />

        {/* Assignment header skeleton */}
        <div className="ocean-card rounded-2xl p-6 space-y-4">
          <div className="flex items-start justify-between">
            <div className="flex-1 space-y-2">
              <div className="h-7 w-3/4 rounded bg-muted animate-pulse" />
              <div className="h-4 w-40 rounded bg-muted animate-pulse" />
            </div>
            <div className="h-8 w-20 rounded-full bg-muted animate-pulse" />
          </div>
          <div className="flex items-center gap-3">
            <div className="h-6 w-20 rounded-full bg-muted animate-pulse" />
            <div className="h-6 w-24 rounded-full bg-muted animate-pulse" />
          </div>
          {/* Due date skeleton */}
          <div className="h-16 w-full rounded-xl bg-muted animate-pulse" />
          {/* Description skeleton */}
          <div className="space-y-2 pt-2">
            <div className="h-4 w-20 rounded bg-muted animate-pulse" />
            <div className="h-24 w-full rounded-xl bg-muted animate-pulse" />
          </div>
        </div>

        {/* Submission area skeleton */}
        <div className="ocean-card rounded-2xl p-6 space-y-4">
          <div className="h-6 w-40 rounded bg-muted animate-pulse" />
          <div className="h-40 w-full rounded-xl bg-muted animate-pulse" />
          <div className="flex justify-end pt-2">
            <div className="h-10 w-28 rounded-xl bg-muted animate-pulse" />
          </div>
        </div>
      </div>
    )
  }

  if (error || !assignment) {
    return (
      <div className="mx-auto max-w-3xl space-y-8">
        <Link
          href="/student/assignments"
          className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assignments
        </Link>
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error || 'Assignment not found'}
        </div>
      </div>
    )
  }

  const typeLabel = ASSIGNMENT_TYPES.find((t) => t.value === assignment.type)?.label || assignment.type
  const submissionTypeLabel = SUBMISSION_TYPES.find((t) => t.value === assignment.submission_type)?.label || assignment.submission_type
  const pastDue = isPastDue(assignment.due_date)
  const isReturned = submission?.status === 'returned'
  const isGraded = submission?.status === 'graded' && !!grade
  const canSubmit = ((!pastDue || assignment.allow_late_submission === true) && (!isGraded || isReturned))
  const timeLeft = timeUntilDue(assignment.due_date)

  return (
    <div className="mx-auto max-w-3xl space-y-8">
      {/* Back Button */}
      <Link
        href="/student/assignments"
        className="inline-flex items-center gap-1.5 text-sm text-muted-foreground transition-colors hover:text-foreground"
      >
        <ArrowLeft className="h-4 w-4" />
        Back to Assignments
      </Link>

      {/* Assignment Details */}
      <div className="ocean-card rounded-2xl p-6">
        <div className="flex items-start justify-between">
          <div>
            <h1 className="text-2xl font-bold text-foreground">{assignment.title}</h1>
            <p className="mt-1 text-sm text-muted-foreground">
              {(assignment.courses as unknown as { name: string })?.name}
            </p>
          </div>
          <span className="inline-flex items-center gap-1.5 rounded-full bg-primary/10 px-3 py-1 text-sm font-medium text-primary">
            <Award className="h-3.5 w-3.5" />
            {assignment.max_points} pts
          </span>
        </div>

        {/* Meta Info */}
        <div className="mt-4 flex flex-wrap items-center gap-3">
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {typeLabel}
          </span>
          <span className="inline-flex items-center rounded-full bg-muted px-2.5 py-0.5 text-xs font-medium text-muted-foreground">
            {submissionTypeLabel}
          </span>
          {assignment.allow_late_submission === true && (
            <span className="inline-flex items-center rounded-full bg-amber-100 px-2.5 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
              Late submissions accepted
            </span>
          )}
        </div>

        {/* Due Date */}
        <div className={`mt-4 rounded-xl border p-3 ${
          pastDue
            ? 'border-red-200 bg-red-50 dark:border-red-800 dark:bg-red-950/20'
            : 'border-border bg-muted/30'
        }`}>
          <div className="flex items-center justify-between">
            <div>
              <p className="text-sm font-medium text-foreground">
                Due: {formatDate(assignment.due_date)}
              </p>
              {timeLeft && (
                <p className={`mt-0.5 text-xs ${pastDue ? 'text-red-600 dark:text-red-400' : 'text-muted-foreground'}`}>
                  {timeLeft}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* Description */}
        {assignment.description && (
          <div className="mt-6">
            <h3 className="text-sm font-medium text-foreground">Instructions</h3>
            <div className="mt-2 whitespace-pre-wrap rounded-xl border border-border bg-muted/20 p-4 text-sm text-foreground">
              {assignment.description}
            </div>
          </div>
        )}

        {/* Teacher Attachments */}
        {teacherAttachments.length > 0 && (
          <div className="mt-6">
            <h3 className="flex items-center gap-2 text-sm font-medium text-foreground">
              <Paperclip className="h-4 w-4" />
              Attachments & Resources
            </h3>
            <div className="mt-3 space-y-2">
              {/* Files */}
              {teacherFiles.map((att, index) => {
                const IconComponent = getFileIcon(att.fileType || '')
                return (
                  <div
                    key={`file-${index}`}
                    className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                  >
                    <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                      <IconComponent className="h-5 w-5 text-primary" />
                    </div>
                    <div className="flex-1 min-w-0">
                      <p className="truncate text-sm font-medium text-foreground">
                        {att.fileName || 'File'}
                      </p>
                      {att.fileSize && (
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(att.fileSize)}
                        </p>
                      )}
                    </div>
                    <a
                      href={att.url}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted shrink-0"
                    >
                      <Download className="h-4 w-4" />
                      Download
                    </a>
                  </div>
                )
              })}

              {/* Links */}
              {teacherLinks.map((att, index) => (
                <a
                  key={`link-${index}`}
                  href={att.url}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="flex items-center gap-3 rounded-xl border border-border bg-background p-3 transition-colors hover:bg-muted/50"
                >
                  <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-blue-500/10">
                    <Link2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
                  </div>
                  <div className="flex-1 min-w-0">
                    <p className="truncate text-sm font-medium text-foreground">
                      {att.title || att.url}
                    </p>
                    <p className="truncate text-xs text-muted-foreground">
                      {att.url}
                    </p>
                  </div>
                  <ExternalLink className="h-4 w-4 shrink-0 text-muted-foreground" />
                </a>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Returned for Revision Notice */}
      {isReturned && submission?.return_feedback && (
        <div className="rounded-2xl border-2 border-orange-200 bg-orange-50/50 p-6 dark:border-orange-800 dark:bg-orange-950/20">
          <div className="flex items-start gap-3">
            <RotateCcw className="mt-0.5 h-5 w-5 flex-shrink-0 text-orange-600 dark:text-orange-400" />
            <div>
              <h2 className="text-lg font-semibold text-orange-700 dark:text-orange-300">
                Returned for Revision
              </h2>
              <p className="mt-1 text-sm text-orange-600 dark:text-orange-400">
                Your teacher has returned this submission and is asking you to revise it.
              </p>
              <div className="mt-3 rounded-xl border border-orange-200 bg-white p-4 dark:border-orange-800 dark:bg-background">
                <p className="text-sm font-medium text-foreground">Teacher Feedback:</p>
                <p className="mt-1 whitespace-pre-wrap text-sm text-foreground">
                  {submission.return_feedback}
                </p>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Grade Display (if graded) */}
      {grade && (
        <div className="ocean-card rounded-2xl border-2 border-green-200 p-6 dark:border-green-800">
          <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
            <CheckCircle2 className="h-5 w-5 text-green-600 dark:text-green-400" />
            Grade
          </h2>
          <div className="mt-4 flex items-center gap-6">
            <div className="text-center">
              <p className="text-4xl font-bold text-primary">
                {grade.points_earned}/{grade.percentage}
              </p>
              <p className="mt-1 text-sm text-muted-foreground">
                {Math.round((grade.points_earned / grade.percentage) * 100)}%
              </p>
            </div>
            <div className="flex h-16 w-16 items-center justify-center rounded-full bg-primary/10">
              <span className="text-2xl font-bold text-primary">{grade.letter_grade}</span>
            </div>
          </div>
          {grade.feedback && (
            <div className="mt-4">
              <h3 className="text-sm font-medium text-foreground">Feedback from teacher</h3>
              <div className="mt-2 rounded-xl border border-border bg-muted/20 p-4 text-sm text-foreground">
                {grade.feedback}
              </div>
            </div>
          )}
          <p className="mt-3 text-xs text-muted-foreground">
            Graded on {new Date(grade.graded_at).toLocaleDateString('en-US', {
              month: 'long',
              day: 'numeric',
              year: 'numeric',
            })}
          </p>
        </div>
      )}

      {/* Submission Area */}
      <div className="ocean-card rounded-2xl p-6">
        <h2 className="flex items-center gap-2 text-lg font-semibold text-foreground">
          {submission && !isReturned ? (
            <>
              <CheckCircle2 className="h-5 w-5 text-blue-600 dark:text-blue-400" />
              Your Submission
            </>
          ) : isReturned ? (
            <>
              <RotateCcw className="h-5 w-5 text-orange-600 dark:text-orange-400" />
              Revise Your Submission
            </>
          ) : (
            <>
              <Send className="h-5 w-5 text-primary" />
              Submit Your Work
            </>
          )}
        </h2>

        {submission && !isReturned && (
          <div className="mt-3 flex items-center gap-2 text-sm text-muted-foreground">
            <Clock className="h-3.5 w-3.5" />
            <span>
              Submitted on{' '}
              {new Date(submission.submitted_at).toLocaleDateString('en-US', {
                month: 'short',
                day: 'numeric',
                hour: 'numeric',
                minute: '2-digit',
              })}
            </span>
            {submission.is_late && (
              <span className="inline-flex items-center gap-1 rounded-full bg-amber-100 px-2 py-0.5 text-xs font-medium text-amber-700 dark:bg-amber-950/40 dark:text-amber-300">
                <AlertTriangle className="h-3 w-3" />
                Late
              </span>
            )}
          </div>
        )}

        {submitSuccess && (
          <div className="mt-4 rounded-xl border border-green-200 bg-green-50 p-4 text-sm text-green-700 dark:border-green-800 dark:bg-green-950/30 dark:text-green-300">
            Your work has been submitted successfully!
          </div>
        )}

        {submitError && (
          <div className="mt-4 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
            {submitError}
          </div>
        )}

        <form onSubmit={handleSubmit} className="mt-4 space-y-4">
          {/* Text Entry */}
          {(assignment.submission_type === 'text' || assignment.submission_type === 'multi') && (
            <div>
              <label htmlFor="content" className="block text-sm font-medium text-foreground">
                Text Submission
              </label>
              <textarea
                id="content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Write your response here..."
                rows={8}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {/* URL Link */}
          {(assignment.submission_type === 'link' || assignment.submission_type === 'multi') && (
            <div>
              <label htmlFor="linkUrl" className="block text-sm font-medium text-foreground">
                URL Link
              </label>
              <input
                id="linkUrl"
                type="url"
                value={linkUrl}
                onChange={(e) => setLinkUrl(e.target.value)}
                placeholder="https://..."
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {/* File Upload */}
          {(assignment.submission_type === 'file' || assignment.submission_type === 'multi') && (
            <div>
              <label className="block text-sm font-medium text-foreground">File Upload</label>

              {/* Drag & Drop Zone */}
              <div
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
                onClick={() => fileInputRef.current?.click()}
                className={`mt-1.5 flex cursor-pointer items-center justify-center rounded-xl border-2 border-dashed p-8 transition-colors ${
                  dragOver
                    ? 'border-primary bg-primary/5'
                    : 'border-border hover:border-primary/50 hover:bg-muted/30'
                }`}
              >
                <input
                  ref={fileInputRef}
                  type="file"
                  multiple
                  accept={STUDENT_ACCEPTED_EXTENSIONS}
                  onChange={(e) => handleStudentFileUpload(e.target.files)}
                  className="hidden"
                  disabled={fileUploading}
                />
                <div className="text-center">
                  {fileUploading ? (
                    <>
                      <Loader2 className="mx-auto h-10 w-10 animate-spin text-primary" />
                      <p className="mt-2 text-sm font-medium text-foreground">Uploading...</p>
                    </>
                  ) : (
                    <>
                      <Upload className="mx-auto h-10 w-10 text-muted-foreground" />
                      <p className="mt-2 text-sm text-muted-foreground">
                        Drag and drop files here, or click to browse
                      </p>
                      <p className="mt-1 text-xs text-muted-foreground">
                        PDF, DOCX, PPTX, images, ZIP, TXT (max 50MB)
                      </p>
                    </>
                  )}
                </div>
              </div>

              {/* Uploaded Files List */}
              {uploadedFiles.length > 0 && (
                <div className="mt-3 space-y-2">
                  {uploadedFiles.map((file, index) => {
                    const IconComponent = getFileIcon(file.fileType)
                    return (
                      <div
                        key={`${file.fileName}-${index}`}
                        className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                      >
                        <div className="flex h-9 w-9 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                          <IconComponent className="h-4 w-4 text-primary" />
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="truncate text-sm font-medium text-foreground">
                            {file.fileName}
                          </p>
                          <p className="text-xs text-muted-foreground">
                            {formatFileSize(file.fileSize)}
                          </p>
                        </div>
                        <button
                          type="button"
                          onClick={() => removeUploadedFile(index)}
                          className="shrink-0 rounded p-1 text-red-500 hover:bg-red-50 hover:text-red-600 dark:hover:bg-red-950/30"
                        >
                          <X className="h-4 w-4" />
                        </button>
                      </div>
                    )
                  })}
                </div>
              )}
            </div>
          )}

          {/* Discussion placeholder */}
          {assignment.submission_type === 'discussion' && (
            <div>
              <label htmlFor="discussion-content" className="block text-sm font-medium text-foreground">
                Discussion Post
              </label>
              <textarea
                id="discussion-content"
                value={content}
                onChange={(e) => setContent(e.target.value)}
                placeholder="Share your thoughts on the discussion topic..."
                rows={6}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-3 text-sm text-foreground placeholder:text-muted-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              />
            </div>
          )}

          {/* Submit Button */}
          {canSubmit && (
            <div className="flex items-center justify-end gap-3 border-t border-border pt-4">
              {pastDue && (
                <p className="text-xs text-amber-600 dark:text-amber-400">
                  This will be marked as a late submission.
                </p>
              )}
              <button
                type="submit"
                disabled={submitting}
                className="inline-flex items-center gap-2 rounded-xl bg-primary px-6 py-2.5 text-sm font-medium text-primary-foreground shadow-sm transition-colors hover:bg-primary/90 disabled:opacity-50"
              >
                {submitting ? (
                  <>
                    <svg className="h-4 w-4 animate-spin" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                      <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                      <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                    </svg>
                    Submitting...
                  </>
                ) : submission ? (
                  'Resubmit'
                ) : (
                  'Submit'
                )}
              </button>
            </div>
          )}

          {!canSubmit && pastDue && !isGraded && (
            <div className="flex items-center gap-2 rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
              <AlertTriangle className="h-4 w-4 flex-shrink-0" />
              This assignment is past due and does not accept late submissions.
            </div>
          )}

          {isGraded && !isReturned && (
            <p className="mt-4 text-sm text-muted-foreground">
              This submission has been graded. No further changes are allowed unless your teacher returns it for revision.
            </p>
          )}
        </form>
      </div>
    </div>
  )
}
