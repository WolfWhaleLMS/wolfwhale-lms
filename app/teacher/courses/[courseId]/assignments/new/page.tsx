'use client'

import { useState } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { createAssignment } from '@/app/actions/assignments'
import { ASSIGNMENT_TYPES, SUBMISSION_TYPES } from '@/lib/config/constants'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Checkbox } from '@/components/ui/checkbox'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Plus,
  Trash2,
  ChevronUp,
  ChevronDown,
  GripVertical,
  Check,
  X,
  HelpCircle,
  FileText,
  ArrowLeft,
  Paperclip,
  Upload,
  Link2,
  Loader2,
  File,
  FileImage,
  FileSpreadsheet,
  FileArchive,
} from 'lucide-react'
import { toast } from 'sonner'
import { createBrowserClient } from '@supabase/ssr'

type QuestionType = 'multiple_choice' | 'multiple_select' | 'true_false' | 'short_answer' | 'essay'

type QuestionOption = {
  id: string
  text: string
}

type QuestionData = {
  options?: QuestionOption[]
  correctOptionIds?: string[]
  correctAnswer?: boolean
  acceptedAnswers?: string[]
  caseSensitive?: boolean
  rubricGuidelines?: string
  minWords?: number
  maxWords?: number
}

type Question = {
  id: string
  type: QuestionType
  text: string
  points: number
  data: QuestionData
  explanation?: string
  order: number
}

type AttachmentFile = {
  url: string
  fileName: string
  fileSize: number
  fileType: string
}

type LinkItem = {
  id: string
  url: string
  title: string
}

const ACCEPTED_FILE_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-powerpoint',
  'application/vnd.openxmlformats-officedocument.presentationml.presentation',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
  'image/png',
  'image/jpeg',
  'image/gif',
  'image/webp',
  'application/zip',
  'application/x-zip-compressed',
]

const ACCEPTED_EXTENSIONS = '.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.png,.jpg,.jpeg,.gif,.webp,.zip'

const MAX_FILE_SIZE = 100 * 1024 * 1024 // 100MB

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(fileType: string) {
  if (fileType.includes('pdf')) return FileText
  if (fileType.includes('image')) return FileImage
  if (fileType.includes('sheet') || fileType.includes('excel')) return FileSpreadsheet
  if (fileType.includes('zip')) return FileArchive
  return File
}

const QUESTION_TYPES: { value: QuestionType; label: string; icon: typeof FileText }[] = [
  { value: 'multiple_choice', label: 'Multiple Choice', icon: FileText },
  { value: 'multiple_select', label: 'Multiple Select', icon: FileText },
  { value: 'true_false', label: 'True/False', icon: FileText },
  { value: 'short_answer', label: 'Short Answer', icon: FileText },
  { value: 'essay', label: 'Essay', icon: FileText },
]

export default function CreateAssignmentPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string

  // Basic assignment fields
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [type, setType] = useState('homework')
  const [dueDate, setDueDate] = useState('')
  const [pointsPossible, setPointsPossible] = useState(100)
  const [submissionType, setSubmissionType] = useState('text')
  const [latePolicy, setLatePolicy] = useState(true)
  const [submitting, setSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Attachments state
  const [attachments, setAttachments] = useState<AttachmentFile[]>([])
  const [links, setLinks] = useState<LinkItem[]>([])
  const [uploading, setUploading] = useState(false)

  // Question builder state
  const [questions, setQuestions] = useState<Question[]>([])
  const [showQuestionBuilder, setShowQuestionBuilder] = useState(false)
  const [expandedQuestions, setExpandedQuestions] = useState<Set<string>>(new Set())

  // Update showQuestionBuilder when type changes
  const handleTypeChange = (newType: string) => {
    setType(newType)
    setShowQuestionBuilder(newType === 'quiz' || newType === 'exam')
  }

  // Attachment management functions
  const handleFileUpload = async (files: FileList | null) => {
    if (!files || files.length === 0) return

    const supabase = createBrowserClient(
      process.env.NEXT_PUBLIC_SUPABASE_URL!,
      process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
    )

    setUploading(true)

    for (const file of Array.from(files)) {
      if (file.size > MAX_FILE_SIZE) {
        toast.error(`${file.name} exceeds the 100MB limit`)
        continue
      }

      if (!ACCEPTED_FILE_TYPES.includes(file.type)) {
        toast.error(`${file.name} is not an accepted file type`)
        continue
      }

      const safeName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const path = `assignments/${courseId}/${Date.now()}_${safeName}`

      const { error: uploadError } = await supabase.storage
        .from('course-materials')
        .upload(path, file)

      if (uploadError) {
        toast.error(`Failed to upload ${file.name}: ${uploadError.message}`)
        continue
      }

      const { data: urlData } = supabase.storage
        .from('course-materials')
        .getPublicUrl(path)

      setAttachments((prev) => [
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

    setUploading(false)
  }

  const removeAttachment = (index: number) => {
    setAttachments((prev) => prev.filter((_, i) => i !== index))
  }

  const addLink = () => {
    setLinks((prev) => [
      ...prev,
      { id: crypto.randomUUID(), url: '', title: '' },
    ])
  }

  const updateLink = (id: string, field: 'url' | 'title', value: string) => {
    setLinks((prev) =>
      prev.map((l) => (l.id === id ? { ...l, [field]: value } : l))
    )
  }

  const removeLink = (id: string) => {
    setLinks((prev) => prev.filter((l) => l.id !== id))
  }

  // Question management functions
  const addQuestion = (questionType: QuestionType) => {
    const newQuestion: Question = {
      id: crypto.randomUUID(),
      type: questionType,
      text: '',
      points: 10,
      data: {},
      explanation: '',
      order: questions.length,
    }

    // Initialize data based on question type
    if (questionType === 'multiple_choice' || questionType === 'multiple_select') {
      newQuestion.data = {
        options: [
          { id: crypto.randomUUID(), text: '' },
          { id: crypto.randomUUID(), text: '' },
        ],
        correctOptionIds: [],
      }
    } else if (questionType === 'true_false') {
      newQuestion.data = { correctAnswer: true }
    } else if (questionType === 'short_answer') {
      newQuestion.data = { acceptedAnswers: [''], caseSensitive: false }
    } else if (questionType === 'essay') {
      newQuestion.data = { rubricGuidelines: '', minWords: 0, maxWords: 0 }
    }

    setQuestions([...questions, newQuestion])
    setExpandedQuestions(new Set([...expandedQuestions, newQuestion.id]))
  }

  const deleteQuestion = (id: string) => {
    setQuestions(questions.filter((q) => q.id !== id))
    const newExpanded = new Set(expandedQuestions)
    newExpanded.delete(id)
    setExpandedQuestions(newExpanded)
  }

  const moveQuestion = (id: string, direction: 'up' | 'down') => {
    const index = questions.findIndex((q) => q.id === id)
    if (
      (direction === 'up' && index === 0) ||
      (direction === 'down' && index === questions.length - 1)
    ) {
      return
    }

    const newQuestions = [...questions]
    const targetIndex = direction === 'up' ? index - 1 : index + 1
    ;[newQuestions[index], newQuestions[targetIndex]] = [
      newQuestions[targetIndex],
      newQuestions[index],
    ]

    // Update order numbers
    newQuestions.forEach((q, i) => {
      q.order = i
    })

    setQuestions(newQuestions)
  }

  const updateQuestion = (id: string, updates: Partial<Question>) => {
    setQuestions(questions.map((q) => (q.id === id ? { ...q, ...updates } : q)))
  }

  const toggleQuestionExpanded = (id: string) => {
    const newExpanded = new Set(expandedQuestions)
    if (newExpanded.has(id)) {
      newExpanded.delete(id)
    } else {
      newExpanded.add(id)
    }
    setExpandedQuestions(newExpanded)
  }

  // Option management for MC/MS questions
  const addOption = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question || !question.data.options) return

    const newOption: QuestionOption = {
      id: crypto.randomUUID(),
      text: '',
    }

    updateQuestion(questionId, {
      data: {
        ...question.data,
        options: [...question.data.options, newOption],
      },
    })
  }

  const deleteOption = (questionId: string, optionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question || !question.data.options) return

    const newOptions = question.data.options.filter((o) => o.id !== optionId)
    const newCorrectIds = (question.data.correctOptionIds || []).filter((id) => id !== optionId)

    updateQuestion(questionId, {
      data: {
        ...question.data,
        options: newOptions,
        correctOptionIds: newCorrectIds,
      },
    })
  }

  const updateOption = (questionId: string, optionId: string, text: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question || !question.data.options) return

    updateQuestion(questionId, {
      data: {
        ...question.data,
        options: question.data.options.map((o) => (o.id === optionId ? { ...o, text } : o)),
      },
    })
  }

  const toggleCorrectOption = (questionId: string, optionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question) return

    if (question.type === 'multiple_choice') {
      // Single selection
      updateQuestion(questionId, {
        data: {
          ...question.data,
          correctOptionIds: [optionId],
        },
      })
    } else if (question.type === 'multiple_select') {
      // Multiple selection
      const currentIds = question.data.correctOptionIds || []
      const newIds = currentIds.includes(optionId)
        ? currentIds.filter((id) => id !== optionId)
        : [...currentIds, optionId]

      updateQuestion(questionId, {
        data: {
          ...question.data,
          correctOptionIds: newIds,
        },
      })
    }
  }

  // Short answer management
  const addAcceptedAnswer = (questionId: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question || !question.data.acceptedAnswers) return

    updateQuestion(questionId, {
      data: {
        ...question.data,
        acceptedAnswers: [...question.data.acceptedAnswers, ''],
      },
    })
  }

  const updateAcceptedAnswer = (questionId: string, index: number, value: string) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question || !question.data.acceptedAnswers) return

    const newAnswers = [...question.data.acceptedAnswers]
    newAnswers[index] = value

    updateQuestion(questionId, {
      data: {
        ...question.data,
        acceptedAnswers: newAnswers,
      },
    })
  }

  const deleteAcceptedAnswer = (questionId: string, index: number) => {
    const question = questions.find((q) => q.id === questionId)
    if (!question || !question.data.acceptedAnswers) return

    updateQuestion(questionId, {
      data: {
        ...question.data,
        acceptedAnswers: question.data.acceptedAnswers.filter((_, i) => i !== index),
      },
    })
  }

  // Calculate total points from questions
  const totalQuestionPoints = questions.reduce((sum, q) => sum + q.points, 0)

  // Validation
  const validateQuestions = (): string | null => {
    for (let i = 0; i < questions.length; i++) {
      const q = questions[i]

      if (!q.text.trim()) {
        return `Question ${i + 1}: Question text is required`
      }

      if (q.points <= 0) {
        return `Question ${i + 1}: Points must be greater than 0`
      }

      if (q.type === 'multiple_choice' || q.type === 'multiple_select') {
        if (!q.data.options || q.data.options.length < 2) {
          return `Question ${i + 1}: At least 2 options are required`
        }

        if (q.data.options.some((o) => !o.text.trim())) {
          return `Question ${i + 1}: All options must have text`
        }

        if (!q.data.correctOptionIds || q.data.correctOptionIds.length === 0) {
          return `Question ${i + 1}: At least one correct answer must be selected`
        }

        if (q.data.options.length > 6) {
          return `Question ${i + 1}: Maximum 6 options allowed`
        }
      }

      if (q.type === 'short_answer') {
        if (!q.data.acceptedAnswers || q.data.acceptedAnswers.every((a) => !a.trim())) {
          return `Question ${i + 1}: At least one accepted answer is required`
        }
      }
    }

    return null
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault()
    setError(null)

    if (!title.trim()) {
      setError('Title is required')
      return
    }

    if (pointsPossible < 0) {
      setError('Points must be a positive number')
      return
    }

    // Validate questions for quiz/exam types
    if (showQuestionBuilder && questions.length > 0) {
      const questionError = validateQuestions()
      if (questionError) {
        setError(questionError)
        toast.error(questionError)
        return
      }
    }

    // Warn if quiz/exam but no questions
    if (showQuestionBuilder && questions.length === 0) {
      if (!confirm('This quiz/exam has no questions. Are you sure you want to continue?')) {
        return
      }
    }

    setSubmitting(true)

    // Filter out links with empty URLs
    const validLinks = links
      .filter((l) => l.url.trim())
      .map((l) => ({ url: l.url.trim(), title: l.title.trim() || l.url.trim() }))

    const result = await createAssignment({
      courseId,
      title: title.trim(),
      description: description.trim() || undefined,
      type,
      dueDate: dueDate || undefined,
      pointsPossible,
      submissionType,
      latePolicy,
      questions: showQuestionBuilder ? questions : undefined,
      attachments: attachments.length > 0 ? attachments : undefined,
      links: validLinks.length > 0 ? validLinks : undefined,
    })

    if (result.error) {
      setError(result.error)
      toast.error(result.error)
      setSubmitting(false)
    } else {
      toast.success('Assignment created successfully!')
      router.push(`/teacher/courses/${courseId}/assignments`)
    }
  }

  return (
    <div className="mx-auto max-w-4xl space-y-8">
      {/* Header */}
      <div>
        <Link
          href={`/teacher/courses/${courseId}/assignments`}
          className="mb-4 inline-flex items-center gap-1.5 text-sm text-muted-foreground hover:text-foreground transition-colors"
        >
          <ArrowLeft className="h-4 w-4" />
          Back to Assignments
        </Link>
        <h1 className="text-3xl font-bold tracking-tight text-foreground">Create Assignment</h1>
        <p className="mt-1 text-muted-foreground">
          Add a new assignment for your students.
        </p>
      </div>

      {error && (
        <div className="rounded-xl border border-red-200 bg-red-50 p-4 text-sm text-red-700 dark:border-red-800 dark:bg-red-950/30 dark:text-red-300">
          {error}
        </div>
      )}

      {/* Form */}
      <form onSubmit={handleSubmit} className="space-y-6">
        {/* Basic Assignment Info */}
        <div className="ocean-card space-y-6 rounded-2xl p-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-semibold text-foreground">Basic Information</h2>
          </div>

          {/* Title */}
          <div>
            <Label htmlFor="title">
              Title <span className="text-red-500">*</span>
            </Label>
            <Input
              id="title"
              type="text"
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="Enter assignment title"
              required
              className="mt-1.5"
            />
          </div>

          {/* Description */}
          <div>
            <Label htmlFor="description">Description</Label>
            <Textarea
              id="description"
              value={description}
              onChange={(e) => setDescription(e.target.value)}
              placeholder="Describe the assignment, instructions, and expectations..."
              rows={5}
              className="mt-1.5"
            />
          </div>

          {/* Type & Submission Type */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="type">Assignment Type</Label>
              <select
                id="type"
                value={type}
                onChange={(e) => handleTypeChange(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {ASSIGNMENT_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>

            <div>
              <Label htmlFor="submissionType">Submission Type</Label>
              <select
                id="submissionType"
                value={submissionType}
                onChange={(e) => setSubmissionType(e.target.value)}
                className="mt-1.5 w-full rounded-xl border border-border bg-background px-4 py-2.5 text-sm text-foreground focus:border-primary focus:outline-none focus:ring-1 focus:ring-primary"
              >
                {SUBMISSION_TYPES.map((t) => (
                  <option key={t.value} value={t.value}>
                    {t.label}
                  </option>
                ))}
              </select>
            </div>
          </div>

          {/* Due Date & Points */}
          <div className="grid grid-cols-1 gap-6 sm:grid-cols-2">
            <div>
              <Label htmlFor="dueDate">Due Date</Label>
              <Input
                id="dueDate"
                type="datetime-local"
                value={dueDate}
                onChange={(e) => setDueDate(e.target.value)}
                className="mt-1.5"
              />
            </div>

            <div>
              <Label htmlFor="points">Points Possible</Label>
              <Input
                id="points"
                type="number"
                min="0"
                step="1"
                value={pointsPossible}
                onChange={(e) => setPointsPossible(parseInt(e.target.value) || 0)}
                className="mt-1.5"
              />
            </div>
          </div>

          {/* Late Policy */}
          <div className="flex items-center gap-3">
            <button
              type="button"
              role="switch"
              aria-checked={latePolicy}
              onClick={() => setLatePolicy(!latePolicy)}
              className={`relative inline-flex h-6 w-11 shrink-0 cursor-pointer rounded-full border-2 border-transparent transition-colors duration-200 ${
                latePolicy ? 'bg-primary' : 'bg-muted'
              }`}
            >
              <span
                className={`pointer-events-none inline-block h-5 w-5 rounded-full bg-white shadow-lg ring-0 transition-transform duration-200 ${
                  latePolicy ? 'translate-x-5' : 'translate-x-0'
                }`}
              />
            </button>
            <Label className="cursor-pointer" onClick={() => setLatePolicy(!latePolicy)}>
              Accept late submissions
            </Label>
          </div>
        </div>

        {/* Attachments & Resources */}
        <div className="ocean-card space-y-6 rounded-2xl p-6">
          <div className="border-b border-border pb-3">
            <h2 className="text-lg font-semibold text-foreground flex items-center gap-2">
              <Paperclip className="h-5 w-5" />
              Attachments & Resources
            </h2>
            <p className="mt-1 text-sm text-muted-foreground">
              Attach files or reference links for students
            </p>
          </div>

          {/* File Upload Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Files</label>
              <label className="cursor-pointer">
                <input
                  type="file"
                  multiple
                  accept={ACCEPTED_EXTENSIONS}
                  onChange={(e) => handleFileUpload(e.target.files)}
                  className="hidden"
                  disabled={uploading}
                />
                <span className="inline-flex items-center gap-1.5 rounded-lg border border-border bg-background px-3 py-1.5 text-sm font-medium text-foreground transition-colors hover:bg-muted">
                  {uploading ? (
                    <>
                      <Loader2 className="h-4 w-4 animate-spin" />
                      Uploading...
                    </>
                  ) : (
                    <>
                      <Upload className="h-4 w-4" />
                      Add Attachment
                    </>
                  )}
                </span>
              </label>
            </div>

            {attachments.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-border bg-muted/20 p-6 text-center">
                <Upload className="mx-auto h-8 w-8 text-muted-foreground/50" />
                <p className="mt-2 text-sm text-muted-foreground">
                  PDF, DOCX, PPTX, XLSX, images, ZIP (max 100MB each)
                </p>
              </div>
            ) : (
              <div className="space-y-2">
                {attachments.map((att, index) => {
                  const IconComponent = getFileIcon(att.fileType)
                  return (
                    <div
                      key={`${att.fileName}-${index}`}
                      className="flex items-center gap-3 rounded-xl border border-border bg-background p-3"
                    >
                      <div className="flex h-10 w-10 shrink-0 items-center justify-center rounded-lg bg-primary/10">
                        <IconComponent className="h-5 w-5 text-primary" />
                      </div>
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-foreground">
                          {att.fileName}
                        </p>
                        <p className="text-xs text-muted-foreground">
                          {formatFileSize(att.fileSize)}
                        </p>
                      </div>
                      <Button
                        type="button"
                        variant="ghost"
                        size="sm"
                        onClick={() => removeAttachment(index)}
                        className="text-red-600 hover:text-red-700 shrink-0"
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    </div>
                  )
                })}
              </div>
            )}
          </div>

          {/* Links Section */}
          <div>
            <div className="mb-3 flex items-center justify-between">
              <label className="text-sm font-medium text-foreground">Reference Links</label>
              <Button
                type="button"
                variant="outline"
                size="sm"
                onClick={addLink}
                className="gap-1.5"
              >
                <Link2 className="h-4 w-4" />
                Add Link
              </Button>
            </div>

            {links.length === 0 ? (
              <p className="text-sm text-muted-foreground">
                No links added. Click &quot;Add Link&quot; to attach reference URLs.
              </p>
            ) : (
              <div className="space-y-3">
                {links.map((link) => (
                  <div
                    key={link.id}
                    className="flex items-start gap-2 rounded-xl border border-border bg-background p-3"
                  >
                    <Link2 className="mt-2 h-4 w-4 shrink-0 text-muted-foreground" />
                    <div className="flex-1 space-y-2">
                      <Input
                        type="url"
                        value={link.url}
                        onChange={(e) => updateLink(link.id, 'url', e.target.value)}
                        placeholder="https://example.com/resource"
                        className="text-sm"
                      />
                      <Input
                        type="text"
                        value={link.title}
                        onChange={(e) => updateLink(link.id, 'title', e.target.value)}
                        placeholder="Link title (optional)"
                        className="text-sm"
                      />
                    </div>
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLink(link.id)}
                      className="text-red-600 hover:text-red-700 shrink-0 mt-1"
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Question Builder - Only shown for quiz/exam */}
        {showQuestionBuilder && (
          <div className="ocean-card space-y-6 rounded-2xl p-6">
            <div className="border-b border-border pb-3">
              <div className="flex items-center justify-between">
                <div>
                  <h2 className="text-lg font-semibold text-foreground">Question Builder</h2>
                  <p className="mt-1 text-sm text-muted-foreground">
                    Create questions for this {type}
                  </p>
                </div>
                {questions.length > 0 && (
                  <div className="text-right">
                    <div className="text-sm text-muted-foreground">{questions.length} questions</div>
                    <div className="text-lg font-semibold text-foreground">{totalQuestionPoints} points</div>
                  </div>
                )}
              </div>
            </div>

            {/* Add Question Dropdown */}
            <div className="flex flex-wrap gap-2">
              {QUESTION_TYPES.map((qt) => (
                <Button
                  key={qt.value}
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={() => addQuestion(qt.value)}
                  className="gap-2"
                >
                  <Plus className="h-4 w-4" />
                  {qt.label}
                </Button>
              ))}
            </div>

            {/* Questions List */}
            {questions.length === 0 ? (
              <div className="rounded-xl border-2 border-dashed border-border bg-muted/30 p-12 text-center">
                <HelpCircle className="mx-auto h-12 w-12 text-muted-foreground" />
                <h3 className="mt-4 text-lg font-semibold text-foreground">No questions yet</h3>
                <p className="mt-2 text-sm text-muted-foreground">
                  Add questions using the buttons above to build your {type}
                </p>
              </div>
            ) : (
              <div className="space-y-4">
                {questions.map((question, index) => {
                  const isExpanded = expandedQuestions.has(question.id)
                  const questionTypeLabel = QUESTION_TYPES.find((t) => t.value === question.type)?.label || question.type

                  return (
                    <div key={question.id} className="rounded-xl border border-border bg-background">
                      {/* Question Header */}
                      <div className="flex items-center gap-3 p-4">
                        <div className="flex items-center gap-2">
                          <GripVertical className="h-5 w-5 text-muted-foreground" />
                          <span className="text-sm font-medium text-muted-foreground">Q{index + 1}</span>
                        </div>

                        <Badge variant="secondary" className="text-xs">
                          {questionTypeLabel}
                        </Badge>

                        <div className="flex-1 truncate text-sm text-foreground">
                          {question.text || <span className="text-muted-foreground italic">No question text</span>}
                        </div>

                        <div className="flex items-center gap-1">
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveQuestion(question.id, 'up')}
                            disabled={index === 0}
                          >
                            <ChevronUp className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => moveQuestion(question.id, 'down')}
                            disabled={index === questions.length - 1}
                          >
                            <ChevronDown className="h-4 w-4" />
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => toggleQuestionExpanded(question.id)}
                          >
                            {isExpanded ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                          </Button>
                          <Button
                            type="button"
                            variant="ghost"
                            size="sm"
                            onClick={() => deleteQuestion(question.id)}
                            className="text-red-600 hover:text-red-700"
                          >
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </div>
                      </div>

                      {/* Question Body (Expanded) */}
                      {isExpanded && (
                        <div className="space-y-4 border-t border-border p-4">
                          {/* Question Text */}
                          <div>
                            <Label htmlFor={`question-text-${question.id}`}>Question Text *</Label>
                            <Textarea
                              id={`question-text-${question.id}`}
                              value={question.text}
                              onChange={(e) => updateQuestion(question.id, { text: e.target.value })}
                              placeholder="Enter your question here..."
                              rows={3}
                              className="mt-1.5"
                            />
                          </div>

                          {/* Points */}
                          <div>
                            <Label htmlFor={`question-points-${question.id}`}>Points *</Label>
                            <Input
                              id={`question-points-${question.id}`}
                              type="number"
                              min="1"
                              value={question.points}
                              onChange={(e) => updateQuestion(question.id, { points: parseInt(e.target.value) || 1 })}
                              className="mt-1.5 w-32"
                            />
                          </div>

                          {/* Type-specific fields */}
                          {(question.type === 'multiple_choice' || question.type === 'multiple_select') && (
                            <div>
                              <div className="mb-2 flex items-center justify-between">
                                <Label>
                                  Options * {question.type === 'multiple_select' && '(Check all correct answers)'}
                                </Label>
                                <Button
                                  type="button"
                                  variant="outline"
                                  size="sm"
                                  onClick={() => addOption(question.id)}
                                  disabled={(question.data.options?.length || 0) >= 6}
                                >
                                  <Plus className="h-4 w-4 mr-1" />
                                  Add Option
                                </Button>
                              </div>
                              <div className="space-y-2">
                                {question.data.options?.map((option, optIndex) => (
                                  <div key={option.id} className="flex items-center gap-2">
                                    {question.type === 'multiple_choice' ? (
                                      <input
                                        type="radio"
                                        name={`correct-${question.id}`}
                                        checked={question.data.correctOptionIds?.includes(option.id)}
                                        onChange={() => toggleCorrectOption(question.id, option.id)}
                                        className="h-4 w-4"
                                      />
                                    ) : (
                                      <Checkbox
                                        checked={question.data.correctOptionIds?.includes(option.id)}
                                        onCheckedChange={() => toggleCorrectOption(question.id, option.id)}
                                      />
                                    )}
                                    <Input
                                      value={option.text}
                                      onChange={(e) => updateOption(question.id, option.id, e.target.value)}
                                      placeholder={`Option ${optIndex + 1}`}
                                      className="flex-1"
                                    />
                                    {(question.data.options?.length || 0) > 2 && (
                                      <Button
                                        type="button"
                                        variant="ghost"
                                        size="sm"
                                        onClick={() => deleteOption(question.id, option.id)}
                                      >
                                        <X className="h-4 w-4" />
                                      </Button>
                                    )}
                                  </div>
                                ))}
                              </div>
                            </div>
                          )}

                          {question.type === 'true_false' && (
                            <div>
                              <Label>Correct Answer *</Label>
                              <div className="mt-2 flex gap-4">
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`tf-${question.id}`}
                                    checked={question.data.correctAnswer === true}
                                    onChange={() => updateQuestion(question.id, { data: { ...question.data, correctAnswer: true } })}
                                    className="h-4 w-4"
                                  />
                                  <span className="text-sm">True</span>
                                </label>
                                <label className="flex items-center gap-2">
                                  <input
                                    type="radio"
                                    name={`tf-${question.id}`}
                                    checked={question.data.correctAnswer === false}
                                    onChange={() => updateQuestion(question.id, { data: { ...question.data, correctAnswer: false } })}
                                    className="h-4 w-4"
                                  />
                                  <span className="text-sm">False</span>
                                </label>
                              </div>
                            </div>
                          )}

                          {question.type === 'short_answer' && (
                            <div className="space-y-4">
                              <div>
                                <div className="mb-2 flex items-center justify-between">
                                  <Label>Accepted Answers *</Label>
                                  <Button
                                    type="button"
                                    variant="outline"
                                    size="sm"
                                    onClick={() => addAcceptedAnswer(question.id)}
                                  >
                                    <Plus className="h-4 w-4 mr-1" />
                                    Add Answer
                                  </Button>
                                </div>
                                <div className="space-y-2">
                                  {question.data.acceptedAnswers?.map((answer, answerIndex) => (
                                    <div key={answerIndex} className="flex items-center gap-2">
                                      <Input
                                        value={answer}
                                        onChange={(e) => updateAcceptedAnswer(question.id, answerIndex, e.target.value)}
                                        placeholder={`Answer ${answerIndex + 1}`}
                                        className="flex-1"
                                      />
                                      {(question.data.acceptedAnswers?.length || 0) > 1 && (
                                        <Button
                                          type="button"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => deleteAcceptedAnswer(question.id, answerIndex)}
                                        >
                                          <X className="h-4 w-4" />
                                        </Button>
                                      )}
                                    </div>
                                  ))}
                                </div>
                              </div>
                              <div className="flex items-center gap-2">
                                <Checkbox
                                  id={`case-sensitive-${question.id}`}
                                  checked={question.data.caseSensitive}
                                  onCheckedChange={(checked) =>
                                    updateQuestion(question.id, {
                                      data: { ...question.data, caseSensitive: checked === true },
                                    })
                                  }
                                />
                                <Label htmlFor={`case-sensitive-${question.id}`}>Case sensitive</Label>
                              </div>
                            </div>
                          )}

                          {question.type === 'essay' && (
                            <div className="space-y-4">
                              <div>
                                <Label htmlFor={`rubric-${question.id}`}>Rubric Guidelines (Optional)</Label>
                                <Textarea
                                  id={`rubric-${question.id}`}
                                  value={question.data.rubricGuidelines || ''}
                                  onChange={(e) =>
                                    updateQuestion(question.id, {
                                      data: { ...question.data, rubricGuidelines: e.target.value },
                                    })
                                  }
                                  placeholder="Enter grading rubric or guidelines..."
                                  rows={3}
                                  className="mt-1.5"
                                />
                              </div>
                              <div className="grid grid-cols-2 gap-4">
                                <div>
                                  <Label htmlFor={`min-words-${question.id}`}>Min Words</Label>
                                  <Input
                                    id={`min-words-${question.id}`}
                                    type="number"
                                    min="0"
                                    value={question.data.minWords || 0}
                                    onChange={(e) =>
                                      updateQuestion(question.id, {
                                        data: { ...question.data, minWords: parseInt(e.target.value) || 0 },
                                      })
                                    }
                                    className="mt-1.5"
                                  />
                                </div>
                                <div>
                                  <Label htmlFor={`max-words-${question.id}`}>Max Words</Label>
                                  <Input
                                    id={`max-words-${question.id}`}
                                    type="number"
                                    min="0"
                                    value={question.data.maxWords || 0}
                                    onChange={(e) =>
                                      updateQuestion(question.id, {
                                        data: { ...question.data, maxWords: parseInt(e.target.value) || 0 },
                                      })
                                    }
                                    className="mt-1.5"
                                  />
                                </div>
                              </div>
                            </div>
                          )}

                          {/* Explanation (Optional) */}
                          <div>
                            <Label htmlFor={`explanation-${question.id}`}>Explanation (Optional)</Label>
                            <Textarea
                              id={`explanation-${question.id}`}
                              value={question.explanation || ''}
                              onChange={(e) => updateQuestion(question.id, { explanation: e.target.value })}
                              placeholder="Shown to students after answering..."
                              rows={2}
                              className="mt-1.5"
                            />
                          </div>
                        </div>
                      )}
                    </div>
                  )
                })}
              </div>
            )}

            {/* Summary */}
            {questions.length > 0 && (
              <div className="rounded-xl bg-muted/50 p-4">
                <div className="flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Total Questions:</span>
                  <span className="text-foreground">{questions.length}</span>
                </div>
                <div className="mt-2 flex items-center justify-between text-sm">
                  <span className="font-medium text-foreground">Total Points:</span>
                  <span className="text-lg font-bold text-foreground">{totalQuestionPoints}</span>
                </div>
              </div>
            )}
          </div>
        )}

        {/* Actions */}
        <div className="ocean-card flex items-center justify-end gap-3 rounded-2xl p-6">
          <Button
            type="button"
            variant="outline"
            onClick={() => router.back()}
            disabled={submitting}
          >
            Cancel
          </Button>
          <Button
            type="submit"
            disabled={submitting}
            className="whale-gradient"
          >
            {submitting ? (
              <>
                <svg className="h-4 w-4 animate-spin mr-2" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                  <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
                  <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z" />
                </svg>
                Creating...
              </>
            ) : (
              'Create Assignment'
            )}
          </Button>
        </div>
      </form>
    </div>
  )
}
