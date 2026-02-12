'use client'

import { useState, useEffect, useRef, useCallback } from 'react'
import { useParams, useRouter } from 'next/navigation'
import Link from 'next/link'
import { toast } from 'sonner'
import {
  ArrowLeft,
  Save,
  Plus,
  Trash2,
  GripVertical,
  ChevronUp,
  ChevronDown,
  Heading2,
  Type,
  Image as ImageIcon,
  Video,
  FileText,
  Minus,
  AlertCircle,
  HelpCircle,
  Upload,
  Check,
  Eye,
  EyeOff,
  BookOpen,
  Link as LinkIcon,
  FileUp,
  Download,
  ExternalLink,
  File,
  Loader2,
  Paperclip,
  Gamepad2,
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { getLesson, updateLesson, addLessonAttachment, deleteLessonAttachment, getLessonAttachments } from '@/app/actions/lessons'
import { createClient } from '@/lib/supabase/client'
import { TOOLS_REGISTRY, getToolBySlug } from '@/lib/tools/registry'
import { ToolCard } from '@/components/tools/ToolCard'

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

type ContentBlock = {
  id: string
  type: 'heading' | 'text' | 'image' | 'video' | 'file' | 'divider' | 'callout' | 'quiz' | 'link' | 'pdf' | 'document' | 'tool'
  data: Record<string, any>
}

type Lesson = {
  id: string
  title: string
  description: string | null
  content: ContentBlock[]
  learning_objectives: string[]
  duration_minutes: number | null
  status: string
  course_id: string
}

type Attachment = {
  id: string
  file_name: string
  file_path: string
  file_type: string | null
  file_size: number | null
  display_name: string | null
  order_index: number
}

// ---------------------------------------------------------------------------
// Helpers
// ---------------------------------------------------------------------------

function formatFileSize(bytes: number): string {
  if (bytes < 1024) return `${bytes} B`
  if (bytes < 1024 * 1024) return `${(bytes / 1024).toFixed(1)} KB`
  return `${(bytes / (1024 * 1024)).toFixed(1)} MB`
}

function getFileIcon(fileType: string): string {
  if (fileType.includes('pdf')) return '📄'
  if (fileType.includes('word') || fileType.includes('docx')) return '📝'
  if (fileType.includes('presentation') || fileType.includes('pptx')) return '📊'
  if (fileType.includes('spreadsheet') || fileType.includes('xlsx')) return '📈'
  if (fileType.includes('image')) return '🖼️'
  return '📎'
}

// ---------------------------------------------------------------------------
// Supabase Upload Hook
// ---------------------------------------------------------------------------

function useSupabaseUpload(lessonId: string) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = useCallback(async (file: File, subfolder: string = ''): Promise<string | null> => {
    setUploading(true)
    setProgress(0)

    try {
      const supabase = createClient()
      const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
      const timestamp = Date.now()
      const path = subfolder
        ? `lessons/${lessonId}/${subfolder}/${timestamp}_${sanitizedName}`
        : `lessons/${lessonId}/${timestamp}_${sanitizedName}`

      // Simulate progress since Supabase JS client doesn't expose upload progress
      const progressInterval = setInterval(() => {
        setProgress((prev) => Math.min(prev + 15, 90))
      }, 200)

      const { data, error } = await supabase.storage
        .from('course-materials')
        .upload(path, file)

      clearInterval(progressInterval)

      if (error) {
        console.error('Upload error:', error)
        toast.error(`Upload failed: ${error.message}`)
        return null
      }

      setProgress(100)

      const { data: urlData } = supabase.storage
        .from('course-materials')
        .getPublicUrl(path)

      return urlData.publicUrl
    } catch (err) {
      console.error('Upload error:', err)
      toast.error('Upload failed')
      return null
    } finally {
      setTimeout(() => {
        setUploading(false)
        setProgress(0)
      }, 500)
    }
  }, [lessonId])

  return { uploadFile, uploading, progress }
}

// ---------------------------------------------------------------------------
// Upload Button Component (reusable)
// ---------------------------------------------------------------------------

function UploadButton({
  onUpload,
  accept,
  uploading,
  progress,
  label = 'Upload File',
}: {
  onUpload: (file: File) => void
  accept?: string
  uploading: boolean
  progress: number
  label?: string
}) {
  const inputRef = useRef<HTMLInputElement>(null)

  return (
    <div className="space-y-2">
      <input
        ref={inputRef}
        type="file"
        accept={accept}
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0]
          if (file) {
            onUpload(file)
            e.target.value = ''
          }
        }}
      />
      <Button
        type="button"
        variant="outline"
        size="sm"
        onClick={() => inputRef.current?.click()}
        disabled={uploading}
        className="gap-2"
      >
        {uploading ? (
          <Loader2 className="h-4 w-4 animate-spin" />
        ) : (
          <Upload className="h-4 w-4" />
        )}
        {uploading ? 'Uploading...' : label}
      </Button>
      {uploading && (
        <Progress value={progress} className="h-2" />
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Block Type Icons and Labels
// ---------------------------------------------------------------------------

const blockTypes = [
  { type: 'heading', icon: Heading2, label: 'Heading' },
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'video', icon: Video, label: 'Video' },
  { type: 'file', icon: FileText, label: 'File' },
  { type: 'link', icon: LinkIcon, label: 'Link' },
  { type: 'pdf', icon: FileText, label: 'PDF Embed' },
  { type: 'document', icon: FileUp, label: 'Document' },
  { type: 'divider', icon: Minus, label: 'Divider' },
  { type: 'callout', icon: AlertCircle, label: 'Callout' },
  { type: 'quiz', icon: HelpCircle, label: 'Quiz' },
  { type: 'tool', icon: Gamepad2, label: 'Tool / Game' },
] as const

// ---------------------------------------------------------------------------
// Block Editor Components
// ---------------------------------------------------------------------------

function HeadingBlockEditor({ block, onChange }: { block: ContentBlock; onChange: (data: any) => void }) {
  return (
    <div className="space-y-3">
      <div className="flex gap-4">
        <div className="flex-1">
          <Label>Heading Text</Label>
          <Input
            value={block.data.text || ''}
            onChange={(e) => onChange({ ...block.data, text: e.target.value })}
            placeholder="Enter heading text..."
            className="mt-1"
          />
        </div>
        <div className="w-32">
          <Label>Level</Label>
          <Select
            value={String(block.data.level || 2)}
            onValueChange={(value) => onChange({ ...block.data, level: Number(value) })}
          >
            <SelectTrigger className="mt-1">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="2">H2</SelectItem>
              <SelectItem value="3">H3</SelectItem>
              <SelectItem value="4">H4</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>
    </div>
  )
}

function TextBlockEditor({ block, onChange }: { block: ContentBlock; onChange: (data: any) => void }) {
  return (
    <div className="space-y-3">
      <Label>Text Content</Label>
      <Textarea
        value={block.data.text || ''}
        onChange={(e) => onChange({ ...block.data, text: e.target.value })}
        placeholder="Enter your text content here..."
        className="min-h-[120px]"
      />
    </div>
  )
}

function ImageBlockEditor({
  block,
  onChange,
  lessonId,
}: {
  block: ContentBlock
  onChange: (data: any) => void
  lessonId: string
}) {
  const { uploadFile, uploading, progress } = useSupabaseUpload(lessonId)

  const handleUpload = async (file: File) => {
    const url = await uploadFile(file)
    if (url) {
      onChange({ ...block.data, url })
      toast.success('Image uploaded successfully')
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>Image URL</Label>
        <div className="flex gap-2 mt-1">
          <Input
            value={block.data.url || ''}
            onChange={(e) => onChange({ ...block.data, url: e.target.value })}
            placeholder="https://example.com/image.jpg"
            className="flex-1"
          />
          <UploadButton
            onUpload={handleUpload}
            accept="image/*"
            uploading={uploading}
            progress={progress}
            label="Upload"
          />
        </div>
      </div>
      <div>
        <Label>Alt Text</Label>
        <Input
          value={block.data.alt || ''}
          onChange={(e) => onChange({ ...block.data, alt: e.target.value })}
          placeholder="Description of the image"
          className="mt-1"
        />
      </div>
      <div>
        <Label>Caption (optional)</Label>
        <Input
          value={block.data.caption || ''}
          onChange={(e) => onChange({ ...block.data, caption: e.target.value })}
          placeholder="Figure caption..."
          className="mt-1"
        />
      </div>
      {block.data.url && (
        <div className="mt-3 rounded-lg border border-border p-2">
          <img src={block.data.url} alt={block.data.alt || ''} className="max-h-48 mx-auto" />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// YouTube URL helpers
// ---------------------------------------------------------------------------

function extractYouTubeVideoId(url: string): string | null {
  if (!url) return null
  // Match youtube.com/watch?v=ID
  const watchMatch = url.match(/(?:youtube\.com\/watch\?.*v=)([a-zA-Z0-9_-]{11})/)
  if (watchMatch) return watchMatch[1]
  // Match youtu.be/ID
  const shortMatch = url.match(/(?:youtu\.be\/)([a-zA-Z0-9_-]{11})/)
  if (shortMatch) return shortMatch[1]
  // Match youtube.com/embed/ID
  const embedMatch = url.match(/(?:youtube\.com\/embed\/)([a-zA-Z0-9_-]{11})/)
  if (embedMatch) return embedMatch[1]
  // Match youtube.com/v/ID
  const vMatch = url.match(/(?:youtube\.com\/v\/)([a-zA-Z0-9_-]{11})/)
  if (vMatch) return vMatch[1]
  return null
}

function getYouTubeThumbnail(videoId: string): string {
  return `https://img.youtube.com/vi/${videoId}/mqdefault.jpg`
}

// ---------------------------------------------------------------------------
// Video Block Editor (YouTube + direct URL upload)
// ---------------------------------------------------------------------------

function VideoBlockEditor({
  block,
  onChange,
  lessonId,
}: {
  block: ContentBlock
  onChange: (data: any) => void
  lessonId: string
}) {
  const { uploadFile, uploading, progress } = useSupabaseUpload(lessonId)
  const source: 'youtube' | 'url' = block.data.source || 'youtube'
  const videoId = block.data.videoId || null

  const handleSourceChange = (newSource: string) => {
    onChange({ ...block.data, source: newSource, url: '', videoId: undefined })
  }

  const handleYouTubeUrlChange = (url: string) => {
    const extractedId = extractYouTubeVideoId(url)
    onChange({
      ...block.data,
      source: 'youtube',
      url,
      videoId: extractedId || undefined,
    })
  }

  const handleVideoUpload = async (file: File) => {
    const url = await uploadFile(file, 'videos')
    if (url) {
      onChange({ ...block.data, source: 'url', url })
      toast.success('Video uploaded successfully')
    }
  }

  return (
    <div className="space-y-3">
      {/* Source selector */}
      <div>
        <Label>Video Source</Label>
        <Select value={source} onValueChange={handleSourceChange}>
          <SelectTrigger className="mt-1 w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="youtube">YouTube</SelectItem>
            <SelectItem value="url">Video URL / Upload</SelectItem>
          </SelectContent>
        </Select>
      </div>

      {source === 'youtube' ? (
        <>
          <div>
            <Label>YouTube URL</Label>
            <Input
              value={block.data.url || ''}
              onChange={(e) => handleYouTubeUrlChange(e.target.value)}
              placeholder="https://youtube.com/watch?v=... or https://youtu.be/..."
              className="mt-1"
            />
            {block.data.url && !videoId && (
              <p className="mt-1 text-xs text-destructive">
                Could not extract a YouTube video ID from this URL. Please check the link.
              </p>
            )}
            {videoId && (
              <p className="mt-1 text-xs text-muted-foreground">
                Video ID: {videoId}
              </p>
            )}
          </div>

          {/* YouTube preview thumbnail */}
          {videoId && (
            <div className="mt-3 rounded-lg border border-border overflow-hidden">
              <div className="relative aspect-video bg-black">
                <img
                  src={getYouTubeThumbnail(videoId)}
                  alt="YouTube video thumbnail"
                  className="w-full h-full object-cover"
                />
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className="rounded-full bg-red-600 p-3">
                    <Video className="h-6 w-6 text-white" />
                  </div>
                </div>
              </div>
            </div>
          )}
        </>
      ) : (
        <>
          <div>
            <Label>Video URL</Label>
            <div className="flex gap-2 mt-1">
              <Input
                value={block.data.url || ''}
                onChange={(e) => onChange({ ...block.data, source: 'url', url: e.target.value })}
                placeholder="https://example.com/video.mp4"
                className="flex-1"
              />
              <UploadButton
                onUpload={handleVideoUpload}
                accept="video/*"
                uploading={uploading}
                progress={progress}
                label="Upload"
              />
            </div>
            <p className="mt-1 text-xs text-muted-foreground">
              Supports MP4, WebM, and other browser-compatible video formats
            </p>
          </div>

          {/* Direct video preview */}
          {block.data.url && (
            <div className="mt-3 rounded-lg border border-border overflow-hidden">
              <video
                src={block.data.url}
                controls
                className="w-full aspect-video bg-black"
                preload="metadata"
              >
                Your browser does not support the video tag.
              </video>
            </div>
          )}
        </>
      )}

      {/* Title field (shared) */}
      <div>
        <Label>Title (optional)</Label>
        <Input
          value={block.data.title || ''}
          onChange={(e) => onChange({ ...block.data, title: e.target.value })}
          placeholder="Video title..."
          className="mt-1"
        />
      </div>
    </div>
  )
}

function FileBlockEditor({
  block,
  onChange,
  lessonId,
}: {
  block: ContentBlock
  onChange: (data: any) => void
  lessonId: string
}) {
  const { uploadFile, uploading, progress } = useSupabaseUpload(lessonId)

  const handleUpload = async (file: File) => {
    const url = await uploadFile(file)
    if (url) {
      onChange({
        ...block.data,
        url,
        filename: file.name,
        size: formatFileSize(file.size),
      })
      toast.success('File uploaded successfully')
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>File URL</Label>
        <div className="flex gap-2 mt-1">
          <Input
            value={block.data.url || ''}
            onChange={(e) => onChange({ ...block.data, url: e.target.value })}
            placeholder="https://example.com/document.pdf"
            className="flex-1"
          />
          <UploadButton
            onUpload={handleUpload}
            uploading={uploading}
            progress={progress}
            label="Upload"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Filename</Label>
          <Input
            value={block.data.filename || ''}
            onChange={(e) => onChange({ ...block.data, filename: e.target.value })}
            placeholder="document.pdf"
            className="mt-1"
          />
        </div>
        <div>
          <Label>Size (optional)</Label>
          <Input
            value={block.data.size || ''}
            onChange={(e) => onChange({ ...block.data, size: e.target.value })}
            placeholder="2.4 MB"
            className="mt-1"
          />
        </div>
      </div>
    </div>
  )
}

function DividerBlockEditor() {
  return (
    <div className="py-4">
      <div className="border-t-2 border-border" />
      <p className="mt-2 text-xs text-muted-foreground text-center">Horizontal divider</p>
    </div>
  )
}

function CalloutBlockEditor({ block, onChange }: { block: ContentBlock; onChange: (data: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Callout Type</Label>
        <Select
          value={block.data.variant || 'info'}
          onValueChange={(value) => onChange({ ...block.data, variant: value })}
        >
          <SelectTrigger className="mt-1">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="info">Info</SelectItem>
            <SelectItem value="warning">Warning</SelectItem>
            <SelectItem value="tip">Tip</SelectItem>
            <SelectItem value="success">Success</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Text</Label>
        <Textarea
          value={block.data.text || ''}
          onChange={(e) => onChange({ ...block.data, text: e.target.value })}
          placeholder="Enter callout text..."
          className="mt-1 min-h-[80px]"
        />
      </div>
      {block.data.text && (
        <div className={`mt-3 rounded-lg p-4 ${
          block.data.variant === 'warning' ? 'bg-[#FFAA00]/5 border-[#FFAA00]/20 text-[#D97706] dark:bg-[#FFAA00]/10 dark:border-[#FFAA00]/20 dark:text-[#D97706]' :
          block.data.variant === 'tip' ? 'bg-[#00BFFF]/5 border-[#00BFFF]/20 text-[#00BFFF] dark:bg-[#00BFFF]/10 dark:border-[#00BFFF]/20 dark:text-[#00BFFF]' :
          block.data.variant === 'success' ? 'bg-[#33FF33]/5 border-[#33FF33]/20 text-[#059669] dark:bg-[#33FF33]/10 dark:border-[#33FF33]/20 dark:text-[#059669]' :
          'bg-[#00BFFF]/5 border-[#00BFFF]/10 text-[#0A2540] dark:bg-[#00BFFF]/5 dark:border-[#00BFFF]/10 dark:text-[#E8F8FF]'
        } border`}>
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm">{block.data.text}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function QuizBlockEditor({ block, onChange }: { block: ContentBlock; onChange: (data: any) => void }) {
  const options = block.data.options || ['', '', '', '']

  const updateOption = (index: number, value: string) => {
    const newOptions = [...options]
    newOptions[index] = value
    onChange({ ...block.data, options: newOptions })
  }

  const addOption = () => {
    onChange({ ...block.data, options: [...options, ''] })
  }

  const removeOption = (index: number) => {
    if (options.length <= 2) {
      toast.error('Quiz must have at least 2 options')
      return
    }
    const newOptions = options.filter((_: any, i: number) => i !== index)
    const correctIndex = block.data.correctIndex
    onChange({
      ...block.data,
      options: newOptions,
      correctIndex: correctIndex === index ? 0 : correctIndex > index ? correctIndex - 1 : correctIndex,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Question</Label>
        <Input
          value={block.data.question || ''}
          onChange={(e) => onChange({ ...block.data, question: e.target.value })}
          placeholder="Enter quiz question..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Answer Options</Label>
        <div className="mt-2 space-y-2">
          {options.map((option: string, index: number) => (
            <div key={`${block.id}-opt-${index}`} className="flex gap-2 items-center">
              <div className="flex-1 flex gap-2 items-center">
                <Button
                  type="button"
                  variant={block.data.correctIndex === index ? 'default' : 'outline'}
                  size="sm"
                  onClick={() => onChange({ ...block.data, correctIndex: index })}
                  className="shrink-0"
                >
                  {block.data.correctIndex === index ? <Check className="h-4 w-4" /> : String.fromCharCode(65 + index)}
                </Button>
                <Input
                  value={option}
                  onChange={(e) => updateOption(index, e.target.value)}
                  placeholder={`Option ${String.fromCharCode(65 + index)}`}
                />
              </div>
              {options.length > 2 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeOption(index)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              )}
            </div>
          ))}
        </div>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addOption}
          className="mt-2 w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Option
        </Button>
      </div>

      <div>
        <Label>Explanation (optional)</Label>
        <Textarea
          value={block.data.explanation || ''}
          onChange={(e) => onChange({ ...block.data, explanation: e.target.value })}
          placeholder="Explain the correct answer..."
          className="mt-1"
        />
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// NEW Block Editors: Link, PDF, Document
// ---------------------------------------------------------------------------

function LinkBlockEditor({ block, onChange }: { block: ContentBlock; onChange: (data: any) => void }) {
  const [urlError, setUrlError] = useState('')

  const validateUrl = (url: string) => {
    if (!url) {
      setUrlError('')
      return
    }
    try {
      new URL(url)
      setUrlError('')
    } catch {
      setUrlError('Please enter a valid URL (e.g., https://example.com)')
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>URL</Label>
        <Input
          value={block.data.url || ''}
          onChange={(e) => {
            onChange({ ...block.data, url: e.target.value })
            validateUrl(e.target.value)
          }}
          placeholder="https://example.com/resource"
          className="mt-1"
        />
        {urlError && (
          <p className="mt-1 text-xs text-destructive">{urlError}</p>
        )}
      </div>
      <div>
        <Label>Title</Label>
        <Input
          value={block.data.title || ''}
          onChange={(e) => onChange({ ...block.data, title: e.target.value })}
          placeholder="Link title..."
          className="mt-1"
        />
      </div>
      <div>
        <Label>Description (optional)</Label>
        <Input
          value={block.data.description || ''}
          onChange={(e) => onChange({ ...block.data, description: e.target.value })}
          placeholder="Brief description of the linked resource..."
          className="mt-1"
        />
      </div>
      {/* Preview */}
      {block.data.url && block.data.title && (
        <div className="mt-3 rounded-lg border border-border p-4 hover:bg-muted/50 transition-colors">
          <div className="flex items-start gap-3">
            <div className="shrink-0 rounded-lg bg-primary/10 p-2">
              <ExternalLink className="h-5 w-5 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{block.data.title}</p>
              {block.data.description && (
                <p className="text-xs text-muted-foreground mt-1 line-clamp-2">{block.data.description}</p>
              )}
              <p className="text-xs text-primary/70 mt-1 truncate">{block.data.url}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}

function PdfBlockEditor({
  block,
  onChange,
  lessonId,
}: {
  block: ContentBlock
  onChange: (data: any) => void
  lessonId: string
}) {
  const { uploadFile, uploading, progress } = useSupabaseUpload(lessonId)

  const handleUpload = async (file: File) => {
    if (file.type !== 'application/pdf') {
      toast.error('Please select a PDF file')
      return
    }
    const url = await uploadFile(file)
    if (url) {
      onChange({
        ...block.data,
        url,
        title: block.data.title || file.name.replace(/\.pdf$/i, ''),
      })
      toast.success('PDF uploaded successfully')
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>PDF URL</Label>
        <div className="flex gap-2 mt-1">
          <Input
            value={block.data.url || ''}
            onChange={(e) => onChange({ ...block.data, url: e.target.value })}
            placeholder="https://example.com/document.pdf"
            className="flex-1"
          />
          <UploadButton
            onUpload={handleUpload}
            accept="application/pdf"
            uploading={uploading}
            progress={progress}
            label="Upload PDF"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Title</Label>
          <Input
            value={block.data.title || ''}
            onChange={(e) => onChange({ ...block.data, title: e.target.value })}
            placeholder="Document title..."
            className="mt-1"
          />
        </div>
        <div>
          <Label>Page Count (optional)</Label>
          <Input
            type="number"
            value={block.data.pageCount || ''}
            onChange={(e) => onChange({ ...block.data, pageCount: e.target.value ? Number(e.target.value) : undefined })}
            placeholder="e.g., 12"
            className="mt-1"
          />
        </div>
      </div>
      {/* Preview */}
      {block.data.url && (
        <div className="mt-3 rounded-lg border border-border overflow-hidden">
          <div className="bg-muted/50 px-4 py-2 flex items-center justify-between border-b border-border">
            <div className="flex items-center gap-2">
              <FileText className="h-4 w-4 text-primary" />
              <span className="text-sm font-medium">{block.data.title || 'PDF Document'}</span>
              {block.data.pageCount && (
                <span className="text-xs text-muted-foreground">({block.data.pageCount} pages)</span>
              )}
            </div>
            <a
              href={block.data.url}
              target="_blank"
              rel="noopener noreferrer"
              className="text-xs text-primary hover:underline"
            >
              Open in new tab
            </a>
          </div>
          <iframe
            src={block.data.url}
            className="w-full h-64 bg-white"
            title={block.data.title || 'PDF Preview'}
          />
        </div>
      )}
    </div>
  )
}

function DocumentBlockEditor({
  block,
  onChange,
  lessonId,
}: {
  block: ContentBlock
  onChange: (data: any) => void
  lessonId: string
}) {
  const { uploadFile, uploading, progress } = useSupabaseUpload(lessonId)

  const handleUpload = async (file: File) => {
    const url = await uploadFile(file)
    if (url) {
      onChange({
        ...block.data,
        url,
        fileName: file.name,
        fileSize: file.size,
        fileType: file.type,
      })
      toast.success('Document uploaded successfully')
    }
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>Document File</Label>
        <div className="flex gap-2 mt-1">
          <Input
            value={block.data.url || ''}
            onChange={(e) => onChange({ ...block.data, url: e.target.value })}
            placeholder="https://example.com/document.docx"
            className="flex-1"
          />
          <UploadButton
            onUpload={handleUpload}
            accept=".pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx,.txt,.rtf,.odt,.odp,.ods"
            uploading={uploading}
            progress={progress}
            label="Upload"
          />
        </div>
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>File Name</Label>
          <Input
            value={block.data.fileName || ''}
            onChange={(e) => onChange({ ...block.data, fileName: e.target.value })}
            placeholder="document.docx"
            className="mt-1"
          />
        </div>
        <div>
          <Label>File Type</Label>
          <Input
            value={block.data.fileType || ''}
            onChange={(e) => onChange({ ...block.data, fileType: e.target.value })}
            placeholder="application/pdf"
            className="mt-1"
          />
        </div>
      </div>
      {block.data.fileSize && (
        <p className="text-xs text-muted-foreground">
          Size: {formatFileSize(block.data.fileSize)}
        </p>
      )}
      {/* Preview Card */}
      {block.data.url && block.data.fileName && (
        <div className="mt-3 rounded-lg border border-border p-4">
          <div className="flex items-center gap-3">
            <div className="shrink-0 rounded-lg bg-primary/10 p-3">
              <File className="h-6 w-6 text-primary" />
            </div>
            <div className="flex-1 min-w-0">
              <p className="font-medium text-sm text-foreground truncate">{block.data.fileName}</p>
              <div className="flex items-center gap-2 mt-1">
                {block.data.fileType && (
                  <span className="text-xs text-muted-foreground">{block.data.fileType.split('/').pop()?.toUpperCase()}</span>
                )}
                {block.data.fileSize && (
                  <span className="text-xs text-muted-foreground">{formatFileSize(block.data.fileSize)}</span>
                )}
              </div>
            </div>
            <Download className="h-4 w-4 text-muted-foreground" />
          </div>
        </div>
      )}
    </div>
  )
}

function ToolBlockEditor({ block, onChange }: { block: ContentBlock; onChange: (data: any) => void }) {
  const availableTools = TOOLS_REGISTRY.filter((t) => t.status === 'available')
  const selectedTool = block.data.toolSlug ? getToolBySlug(block.data.toolSlug) : null

  return (
    <div className="space-y-3">
      <div>
        <Label>Select Tool</Label>
        <select
          value={block.data.toolSlug || ''}
          onChange={(e) => onChange({ ...block.data, toolSlug: e.target.value })}
          className="mt-1 w-full rounded-md border border-border bg-background px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-ring"
        >
          <option value="">Choose a tool...</option>
          {availableTools.map((tool) => (
            <option key={tool.slug} value={tool.slug}>
              {tool.name} — {tool.description}
            </option>
          ))}
        </select>
      </div>
      {selectedTool && (
        <div className="mt-3">
          <ToolCard tool={selectedTool} variant="editor-preview" />
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Block Renderer Component
// ---------------------------------------------------------------------------

function BlockEditor({
  block,
  onUpdate,
  onDelete,
  onMoveUp,
  onMoveDown,
  canMoveUp,
  canMoveDown,
  lessonId,
}: {
  block: ContentBlock
  onUpdate: (data: any) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  lessonId: string
}) {
  const blockType = blockTypes.find((t) => t.type === block.type)
  const Icon = blockType?.icon || Type

  return (
    <div className="ocean-card rounded-xl p-4 group">
      <div className="flex items-start gap-3">
        {/* Drag Handle */}
        <div className="shrink-0 pt-2 cursor-move text-muted-foreground hover:text-foreground">
          <GripVertical className="h-5 w-5" />
        </div>

        {/* Block Content */}
        <div className="flex-1 min-w-0">
          <div className="flex items-center gap-2 mb-3">
            <Icon className="h-4 w-4 text-primary" />
            <span className="text-sm font-medium text-muted-foreground">
              {blockType?.label || block.type}
            </span>
          </div>

          {/* Block-specific editor */}
          {block.type === 'heading' && <HeadingBlockEditor block={block} onChange={onUpdate} />}
          {block.type === 'text' && <TextBlockEditor block={block} onChange={onUpdate} />}
          {block.type === 'image' && <ImageBlockEditor block={block} onChange={onUpdate} lessonId={lessonId} />}
          {block.type === 'video' && <VideoBlockEditor block={block} onChange={onUpdate} lessonId={lessonId} />}
          {block.type === 'file' && <FileBlockEditor block={block} onChange={onUpdate} lessonId={lessonId} />}
          {block.type === 'divider' && <DividerBlockEditor />}
          {block.type === 'callout' && <CalloutBlockEditor block={block} onChange={onUpdate} />}
          {block.type === 'quiz' && <QuizBlockEditor block={block} onChange={onUpdate} />}
          {block.type === 'link' && <LinkBlockEditor block={block} onChange={onUpdate} />}
          {block.type === 'pdf' && <PdfBlockEditor block={block} onChange={onUpdate} lessonId={lessonId} />}
          {block.type === 'document' && <DocumentBlockEditor block={block} onChange={onUpdate} lessonId={lessonId} />}
          {block.type === 'tool' && <ToolBlockEditor block={block} onChange={onUpdate} />}
        </div>

        {/* Actions */}
        <div className="shrink-0 flex flex-col gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveUp}
            disabled={!canMoveUp}
            className="h-8 w-8 p-0"
          >
            <ChevronUp className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onMoveDown}
            disabled={!canMoveDown}
            className="h-8 w-8 p-0"
          >
            <ChevronDown className="h-4 w-4" />
          </Button>
          <Button
            variant="ghost"
            size="sm"
            onClick={onDelete}
            className="h-8 w-8 p-0 text-destructive hover:text-destructive"
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    </div>
  )
}

// ---------------------------------------------------------------------------
// Attachment Manager Component
// ---------------------------------------------------------------------------

function AttachmentManager({ lessonId }: { lessonId: string }) {
  const [attachments, setAttachments] = useState<Attachment[]>([])
  const [loadingAttachments, setLoadingAttachments] = useState(true)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const { uploadFile, uploading, progress } = useSupabaseUpload(lessonId)
  const fileInputRef = useRef<HTMLInputElement>(null)

  // Load attachments
  useEffect(() => {
    async function load() {
      try {
        const data = await getLessonAttachments(lessonId)
        setAttachments(data as Attachment[])
      } catch (err) {
        console.error('Error loading attachments:', err)
      } finally {
        setLoadingAttachments(false)
      }
    }
    load()
  }, [lessonId])

  const handleUploadAttachment = async (file: File) => {
    const url = await uploadFile(file, 'attachments')
    if (url) {
      const result = await addLessonAttachment(lessonId, {
        fileName: file.name,
        filePath: url,
        fileType: file.type,
        fileSize: file.size,
        displayName: file.name,
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Attachment uploaded successfully')
        // Reload attachments
        const data = await getLessonAttachments(lessonId)
        setAttachments(data as Attachment[])
      }
    }
  }

  const handleDeleteAttachment = async (attachmentId: string) => {
    setDeletingId(attachmentId)
    try {
      const result = await deleteLessonAttachment(attachmentId)
      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success('Attachment deleted')
        setAttachments((prev) => prev.filter((a) => a.id !== attachmentId))
      }
    } catch (err) {
      console.error('Error deleting attachment:', err)
      toast.error('Failed to delete attachment')
    } finally {
      setDeletingId(null)
    }
  }

  return (
    <div className="ocean-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <Paperclip className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Lesson Attachments</h2>
          {attachments.length > 0 && (
            <Badge variant="secondary">{attachments.length}</Badge>
          )}
        </div>
        <div>
          <input
            ref={fileInputRef}
            type="file"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0]
              if (file) {
                handleUploadAttachment(file)
                e.target.value = ''
              }
            }}
          />
          <Button
            variant="outline"
            size="sm"
            onClick={() => fileInputRef.current?.click()}
            disabled={uploading}
            className="gap-2"
          >
            {uploading ? (
              <Loader2 className="h-4 w-4 animate-spin" />
            ) : (
              <Upload className="h-4 w-4" />
            )}
            {uploading ? 'Uploading...' : 'Upload Attachment'}
          </Button>
        </div>
      </div>

      {uploading && (
        <Progress value={progress} className="h-2" />
      )}

      {loadingAttachments ? (
        <div className="py-4 text-center text-muted-foreground text-sm">
          Loading attachments...
        </div>
      ) : attachments.length === 0 ? (
        <div className="py-6 text-center">
          <Paperclip className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No attachments yet. Upload files for students to download alongside this lesson.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {attachments.map((attachment) => (
            <div
              key={attachment.id}
              className="flex items-center gap-3 rounded-lg border border-border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="shrink-0 rounded-lg bg-primary/10 p-2">
                <FileText className="h-4 w-4 text-primary" />
              </div>
              <div className="flex-1 min-w-0">
                <p className="text-sm font-medium text-foreground truncate">
                  {attachment.display_name || attachment.file_name}
                </p>
                <div className="flex items-center gap-2 text-xs text-muted-foreground">
                  {attachment.file_type && <span>{attachment.file_type.split('/').pop()?.toUpperCase()}</span>}
                  {attachment.file_size && <span>{formatFileSize(attachment.file_size)}</span>}
                </div>
              </div>
              <div className="shrink-0 flex items-center gap-1">
                <a
                  href={attachment.file_path}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <Download className="h-4 w-4" />
                  </Button>
                </a>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => handleDeleteAttachment(attachment.id)}
                  disabled={deletingId === attachment.id}
                  className="h-8 w-8 p-0 text-destructive hover:text-destructive"
                >
                  {deletingId === attachment.id ? (
                    <Loader2 className="h-4 w-4 animate-spin" />
                  ) : (
                    <Trash2 className="h-4 w-4" />
                  )}
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function LessonEditorPage() {
  const params = useParams()
  const router = useRouter()
  const courseId = params.courseId as string
  const lessonId = params.lessonId as string

  const [lesson, setLesson] = useState<Lesson | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [blocks, setBlocks] = useState<ContentBlock[]>([])
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [durationMinutes, setDurationMinutes] = useState<number | null>(null)
  const [learningObjectives, setLearningObjectives] = useState<string[]>([])
  const [showMetadata, setShowMetadata] = useState(true)

  // Load lesson data
  useEffect(() => {
    async function loadLesson() {
      try {
        const data = await getLesson(lessonId)
        if (data) {
          setLesson(data as Lesson)
          setTitle(data.title)
          setDescription(data.description || '')
          setBlocks(data.content || [])
          setDurationMinutes(data.duration_minutes)
          setLearningObjectives(data.learning_objectives || [])
        }
      } catch (error) {
        console.error('Error loading lesson:', error)
        toast.error('Failed to load lesson')
      } finally {
        setLoading(false)
      }
    }
    loadLesson()
  }, [lessonId])

  // Add a new block
  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      data: type === 'quiz' ? { question: '', options: ['', '', '', ''], correctIndex: 0, explanation: '' } : {},
    }
    setBlocks([...blocks, newBlock])
  }

  // Update block data
  const updateBlock = (id: string, data: any) => {
    setBlocks(blocks.map((block) => (block.id === id ? { ...block, data } : block)))
  }

  // Delete a block
  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id))
  }

  // Move block up
  const moveBlockUp = (index: number) => {
    if (index === 0) return
    const newBlocks = [...blocks]
    ;[newBlocks[index - 1], newBlocks[index]] = [newBlocks[index], newBlocks[index - 1]]
    setBlocks(newBlocks)
  }

  // Move block down
  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return
    const newBlocks = [...blocks]
    ;[newBlocks[index], newBlocks[index + 1]] = [newBlocks[index + 1], newBlocks[index]]
    setBlocks(newBlocks)
  }

  // Save lesson
  const saveLesson = async (publish: boolean = false) => {
    if (!title.trim()) {
      toast.error('Lesson title is required')
      return
    }

    setSaving(true)
    try {
      const result = await updateLesson(lessonId, {
        title,
        description: description || undefined,
        content: blocks,
        duration_minutes: durationMinutes ?? undefined,
        learning_objectives: learningObjectives.filter((obj) => obj.trim()),
        status: publish ? 'published' : lesson?.status || 'draft',
      })

      if (result.error) {
        toast.error(result.error)
      } else {
        toast.success(publish ? 'Lesson published successfully!' : 'Lesson saved successfully!')
        if (publish) {
          router.push(`/teacher/courses/${courseId}`)
        }
      }
    } catch (error) {
      console.error('Error saving lesson:', error)
      toast.error('Failed to save lesson')
    } finally {
      setSaving(false)
    }
  }

  // Add/remove learning objectives
  const addLearningObjective = () => {
    setLearningObjectives([...learningObjectives, ''])
  }

  const updateLearningObjective = (index: number, value: string) => {
    const newObjectives = [...learningObjectives]
    newObjectives[index] = value
    setLearningObjectives(newObjectives)
  }

  const removeLearningObjective = (index: number) => {
    setLearningObjectives(learningObjectives.filter((_, i) => i !== index))
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading lesson editor...</p>
        </div>
      </div>
    )
  }

  if (!lesson) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Lesson not found</h1>
          <p className="text-muted-foreground mb-4">The lesson you&apos;re looking for doesn&apos;t exist.</p>
          <Link href={`/teacher/courses/${courseId}`}>
            <Button>Back to Course</Button>
          </Link>
        </div>
      </div>
    )
  }

  return (
    <div className="min-h-screen pb-20">
      {/* Header */}
      <div className="sticky top-0 z-50 border-b border-border bg-background/95 backdrop-blur supports-[backdrop-filter]:bg-background/60">
        <div className="container max-w-5xl mx-auto px-4 py-4">
          <div className="flex items-center justify-between gap-4">
            <div className="flex items-center gap-3 flex-1 min-w-0">
              <Link href={`/teacher/courses/${courseId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Lesson title..."
                className="font-semibold text-lg border-none shadow-none focus-visible:ring-0 px-2"
              />
              <Badge variant={lesson.status === 'published' ? 'default' : 'secondary'}>
                {lesson.status}
              </Badge>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetadata(!showMetadata)}
              >
                {showMetadata ? <EyeOff className="h-4 w-4" /> : <Eye className="h-4 w-4" />}
              </Button>
              <Button
                onClick={() => saveLesson(false)}
                disabled={saving}
                variant="outline"
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={() => saveLesson(true)}
                disabled={saving}
                className="whale-gradient"
                size="sm"
              >
                {lesson.status === 'published' ? 'Update' : 'Publish'}
              </Button>
            </div>
          </div>
        </div>
      </div>

      {/* Main Content */}
      <div className="container max-w-5xl mx-auto px-4 py-8 space-y-6">
        {/* Metadata Section */}
        {showMetadata && (
          <div className="ocean-card rounded-xl p-6 space-y-4">
            <h2 className="text-lg font-semibold">Lesson Details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the lesson..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Duration (minutes)</Label>
                <Input
                  type="number"
                  value={durationMinutes || ''}
                  onChange={(e) => setDurationMinutes(e.target.value ? Number(e.target.value) : null)}
                  placeholder="30"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <div className="flex items-center justify-between mb-2">
                <Label>Learning Objectives</Label>
                <Button
                  type="button"
                  variant="outline"
                  size="sm"
                  onClick={addLearningObjective}
                >
                  <Plus className="h-4 w-4 mr-1" />
                  Add
                </Button>
              </div>
              <div className="space-y-2">
                {learningObjectives.map((objective, index) => (
                  <div key={`lo-${index}`} className="flex gap-2">
                    <Input
                      value={objective}
                      onChange={(e) => updateLearningObjective(index, e.target.value)}
                      placeholder={`Learning objective ${index + 1}...`}
                    />
                    <Button
                      type="button"
                      variant="ghost"
                      size="sm"
                      onClick={() => removeLearningObjective(index)}
                    >
                      <Trash2 className="h-4 w-4" />
                    </Button>
                  </div>
                ))}
                {learningObjectives.length === 0 && (
                  <p className="text-sm text-muted-foreground">No learning objectives yet</p>
                )}
              </div>
            </div>
          </div>
        )}

        {/* Content Blocks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Content Blocks</h2>
            <span className="text-sm text-muted-foreground">{blocks.length} blocks</span>
          </div>

          {blocks.length === 0 ? (
            <div className="ocean-card rounded-xl p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <h3 className="text-lg font-semibold mb-2">No content blocks yet</h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your lesson by adding content blocks below.
              </p>
            </div>
          ) : (
            <div className="space-y-3">
              {blocks.map((block, index) => (
                <BlockEditor
                  key={block.id}
                  block={block}
                  onUpdate={(data) => updateBlock(block.id, data)}
                  onDelete={() => deleteBlock(block.id)}
                  onMoveUp={() => moveBlockUp(index)}
                  onMoveDown={() => moveBlockDown(index)}
                  canMoveUp={index > 0}
                  canMoveDown={index < blocks.length - 1}
                  lessonId={lessonId}
                />
              ))}
            </div>
          )}

          {/* Add Block Dropdown */}
          <DropdownMenu>
            <DropdownMenuTrigger asChild>
              <Button variant="outline" className="w-full" size="lg">
                <Plus className="h-4 w-4 mr-2" />
                Add Content Block
              </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="center" className="w-64">
              {blockTypes.map(({ type, icon: Icon, label }) => (
                <DropdownMenuItem key={type} onClick={() => addBlock(type)}>
                  <Icon className="h-4 w-4 mr-2" />
                  {label}
                </DropdownMenuItem>
              ))}
            </DropdownMenuContent>
          </DropdownMenu>
        </div>

        {/* Attachment Manager */}
        <AttachmentManager lessonId={lessonId} />
      </div>
    </div>
  )
}
