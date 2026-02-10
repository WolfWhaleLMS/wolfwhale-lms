'use client'

import * as React from 'react'
import {
  Upload,
  X,
  FileText,
  FileImage,
  FileVideo,
  FileAudio,
  File as FileIcon,
  FileArchive,
  Loader2,
  AlertCircle,
  CheckCircle2,
} from 'lucide-react'
import { toast } from 'sonner'
import { cn } from '@/lib/utils'
import { createClient } from '@/lib/supabase/client'
import {
  type UploadedFile,
  validateFile,
  formatFileSize,
  generateFilePath,
  getFileExtension,
  MAX_FILE_SIZES,
  DEFAULT_MAX_FILE_SIZE,
} from '@/lib/supabase/storage'

// ============================================
// Types
// ============================================

export interface FileUploadProps {
  /** Storage bucket name */
  bucket: string
  /** Optional base path prefix for uploads */
  path?: string
  /** Accepted file types (MIME types or extensions, e.g. "image/*,.pdf") */
  accept?: string
  /** Max file size in bytes (overrides bucket default) */
  maxSize?: number
  /** Callback when a file is uploaded */
  onUpload?: (file: UploadedFile) => void
  /** Callback when a file is removed */
  onRemove?: (path: string) => void
  /** Allow multiple file uploads */
  multiple?: boolean
  /** Pre-populated files */
  value?: UploadedFile[]
  /** Additional CSS classes */
  className?: string
  /** Disabled state */
  disabled?: boolean
}

interface UploadingFile {
  id: string
  file: File
  progress: number
  status: 'uploading' | 'done' | 'error'
  error?: string
  result?: UploadedFile
}

// ============================================
// File type icon helper
// ============================================

function getFileIcon(fileType: string, fileName: string) {
  const ext = getFileExtension(fileName)

  if (fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif'].includes(ext)) {
    return <FileImage className="h-5 w-5 text-teal" />
  }
  if (fileType.startsWith('video/') || ext === 'mp4') {
    return <FileVideo className="h-5 w-5 text-purple" />
  }
  if (fileType.startsWith('audio/') || ext === 'mp3') {
    return <FileAudio className="h-5 w-5 text-gold" />
  }
  if (fileType === 'application/pdf' || ext === 'pdf') {
    return <FileText className="h-5 w-5 text-error" />
  }
  if (fileType === 'application/zip' || ext === 'zip') {
    return <FileArchive className="h-5 w-5 text-warning" />
  }
  if (['doc', 'docx'].includes(ext)) {
    return <FileText className="h-5 w-5 text-deep-ocean" />
  }
  if (['pptx'].includes(ext)) {
    return <FileText className="h-5 w-5 text-warning" />
  }
  if (['xlsx'].includes(ext)) {
    return <FileText className="h-5 w-5 text-success" />
  }

  return <FileIcon className="h-5 w-5 text-muted-foreground" />
}

// ============================================
// Image thumbnail helper
// ============================================

function isImageFile(fileType: string, fileName: string): boolean {
  const ext = getFileExtension(fileName)
  return fileType.startsWith('image/') || ['jpg', 'jpeg', 'png', 'gif'].includes(ext)
}

// ============================================
// FileUpload Component
// ============================================

export function FileUpload({
  bucket,
  path: basePath,
  accept,
  maxSize,
  onUpload,
  onRemove,
  multiple = false,
  value = [],
  className,
  disabled = false,
}: FileUploadProps) {
  const [isDragging, setIsDragging] = React.useState(false)
  const [uploading, setUploading] = React.useState<UploadingFile[]>([])
  const [uploadedFiles, setUploadedFiles] = React.useState<UploadedFile[]>(value)
  const fileInputRef = React.useRef<HTMLInputElement>(null)
  const dragCountRef = React.useRef(0)

  // Sync external value
  React.useEffect(() => {
    setUploadedFiles(value)
  }, [value])

  const effectiveMaxSize = maxSize ?? MAX_FILE_SIZES[bucket] ?? DEFAULT_MAX_FILE_SIZE

  // ---- Upload a single file ----
  const uploadSingleFile = React.useCallback(
    async (file: File) => {
      const uploadId = `${Date.now()}-${Math.random().toString(36).substring(2, 6)}`

      // Validate
      const validation = validateFile(file, bucket)
      if (!validation.valid) {
        toast.error(validation.error)
        return
      }

      // Check custom maxSize
      if (maxSize && file.size > maxSize) {
        toast.error(`File size exceeds ${formatFileSize(maxSize)} limit`)
        return
      }

      // Add to uploading state
      const uploadingFile: UploadingFile = {
        id: uploadId,
        file,
        progress: 0,
        status: 'uploading',
      }

      setUploading((prev) => [...prev, uploadingFile])

      try {
        const supabase = createClient()

        // Get current user for scoped path
        const { data: { user } } = await supabase.auth.getUser()
        if (!user) {
          throw new Error('Not authenticated')
        }

        // Generate path
        const filePath = basePath
          ? `${basePath}/${file.name}`
          : generateFilePath(user.id, file.name)

        // Simulate progress (Supabase JS SDK doesn't expose upload progress natively)
        const progressInterval = setInterval(() => {
          setUploading((prev) =>
            prev.map((u) =>
              u.id === uploadId && u.progress < 90
                ? { ...u, progress: Math.min(u.progress + 15, 90) }
                : u
            )
          )
        }, 200)

        // Upload
        const { data, error } = await supabase.storage
          .from(bucket)
          .upload(filePath, file, {
            cacheControl: '3600',
            upsert: false,
          })

        clearInterval(progressInterval)

        if (error) {
          throw new Error(error.message)
        }

        // Get URL
        let url: string
        if (bucket === 'submissions') {
          const { data: signedData, error: signedError } = await supabase.storage
            .from(bucket)
            .createSignedUrl(data.path, 3600)
          if (signedError) {
            url = data.path
          } else {
            url = signedData.signedUrl
          }
        } else {
          const { data: urlData } = supabase.storage
            .from(bucket)
            .getPublicUrl(data.path)
          url = urlData.publicUrl
        }

        const result: UploadedFile = {
          url,
          path: data.path,
          fileName: file.name,
          fileSize: file.size,
          fileType: file.type,
        }

        // Update state
        setUploading((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? { ...u, progress: 100, status: 'done' as const, result }
              : u
          )
        )

        setUploadedFiles((prev) => [...prev, result])
        onUpload?.(result)
        toast.success(`${file.name} uploaded successfully`)

        // Remove from uploading list after animation
        setTimeout(() => {
          setUploading((prev) => prev.filter((u) => u.id !== uploadId))
        }, 1500)
      } catch (err) {
        const message = err instanceof Error ? err.message : 'Upload failed'
        setUploading((prev) =>
          prev.map((u) =>
            u.id === uploadId
              ? { ...u, status: 'error' as const, error: message, progress: 0 }
              : u
          )
        )
        toast.error(`Failed to upload ${file.name}: ${message}`)

        // Remove error state after delay
        setTimeout(() => {
          setUploading((prev) => prev.filter((u) => u.id !== uploadId))
        }, 4000)
      }
    },
    [bucket, basePath, maxSize, onUpload]
  )

  // ---- Handle files selected ----
  const handleFiles = React.useCallback(
    (files: FileList | File[]) => {
      const fileArray = Array.from(files)
      const filesToUpload = multiple ? fileArray : [fileArray[0]]

      for (const file of filesToUpload) {
        if (file) {
          uploadSingleFile(file)
        }
      }
    },
    [multiple, uploadSingleFile]
  )

  // ---- Remove a file ----
  const handleRemove = React.useCallback(
    async (filePath: string) => {
      try {
        const supabase = createClient()
        await supabase.storage.from(bucket).remove([filePath])

        setUploadedFiles((prev) => prev.filter((f) => f.path !== filePath))
        onRemove?.(filePath)
        toast.success('File removed')
      } catch {
        toast.error('Failed to remove file')
      }
    },
    [bucket, onRemove]
  )

  // ---- Drag & Drop handlers ----
  const handleDragEnter = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCountRef.current += 1
    if (dragCountRef.current === 1) {
      setIsDragging(true)
    }
  }, [])

  const handleDragLeave = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
    dragCountRef.current -= 1
    if (dragCountRef.current === 0) {
      setIsDragging(false)
    }
  }, [])

  const handleDragOver = React.useCallback((e: React.DragEvent) => {
    e.preventDefault()
    e.stopPropagation()
  }, [])

  const handleDrop = React.useCallback(
    (e: React.DragEvent) => {
      e.preventDefault()
      e.stopPropagation()
      dragCountRef.current = 0
      setIsDragging(false)

      if (disabled) return

      const { files } = e.dataTransfer
      if (files?.length) {
        handleFiles(files)
      }
    },
    [disabled, handleFiles]
  )

  // ---- Click to select ----
  const handleClick = React.useCallback(() => {
    if (!disabled) {
      fileInputRef.current?.click()
    }
  }, [disabled])

  const handleInputChange = React.useCallback(
    (e: React.ChangeEvent<HTMLInputElement>) => {
      const { files } = e.target
      if (files?.length) {
        handleFiles(files)
      }
      // Reset so same file can be selected again
      e.target.value = ''
    },
    [handleFiles]
  )

  const isUploading = uploading.some((u) => u.status === 'uploading')
  const maxSizeLabel = formatFileSize(effectiveMaxSize)

  return (
    <div className={cn('w-full space-y-3', className)}>
      {/* Hidden file input */}
      <input
        ref={fileInputRef}
        type="file"
        className="hidden"
        accept={accept}
        multiple={multiple}
        onChange={handleInputChange}
        disabled={disabled}
      />

      {/* Drop zone */}
      <div
        role="button"
        tabIndex={0}
        onClick={handleClick}
        onKeyDown={(e) => {
          if (e.key === 'Enter' || e.key === ' ') {
            e.preventDefault()
            handleClick()
          }
        }}
        onDragEnter={handleDragEnter}
        onDragLeave={handleDragLeave}
        onDragOver={handleDragOver}
        onDrop={handleDrop}
        className={cn(
          'relative flex flex-col items-center justify-center rounded-xl border-2 border-dashed p-8 transition-all duration-200 cursor-pointer',
          'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-primary focus-visible:ring-offset-2',
          isDragging
            ? 'border-teal bg-ocean-foam/50 dark:bg-teal/10 scale-[1.02] glow-border-teal'
            : 'border-border hover:border-teal/50 hover:bg-accent/50',
          disabled && 'opacity-50 cursor-not-allowed',
          isUploading && 'pointer-events-none opacity-70'
        )}
      >
        <div
          className={cn(
            'flex h-12 w-12 items-center justify-center rounded-full transition-colors duration-200',
            isDragging
              ? 'bg-teal/20 text-teal'
              : 'bg-muted text-muted-foreground'
          )}
        >
          {isUploading ? (
            <Loader2 className="h-6 w-6 animate-spin" />
          ) : (
            <Upload className="h-6 w-6" />
          )}
        </div>

        <div className="mt-3 text-center">
          <p className="text-sm font-medium text-foreground">
            {isDragging
              ? 'Drop files here'
              : isUploading
                ? 'Uploading...'
                : 'Click to upload or drag and drop'}
          </p>
          <p className="mt-1 text-xs text-muted-foreground">
            {accept
              ? `Accepted: ${accept}`
              : 'PDF, DOC, DOCX, PPTX, XLSX, TXT, JPG, PNG, GIF, MP4, MP3, ZIP'}
          </p>
          <p className="mt-0.5 text-xs text-muted-foreground">
            Max size: {maxSizeLabel}
          </p>
        </div>
      </div>

      {/* Uploading files */}
      {uploading.length > 0 && (
        <div className="space-y-2">
          {uploading.map((item) => (
            <div
              key={item.id}
              className={cn(
                'flex items-center gap-3 rounded-lg border p-3 animate-fade-in-up',
                item.status === 'error'
                  ? 'border-error/30 bg-error/5'
                  : item.status === 'done'
                    ? 'border-success/30 bg-success/5'
                    : 'border-border bg-card'
              )}
            >
              {/* Icon */}
              <div className="shrink-0">
                {item.status === 'uploading' ? (
                  <Loader2 className="h-5 w-5 animate-spin text-teal" />
                ) : item.status === 'done' ? (
                  <CheckCircle2 className="h-5 w-5 text-success" />
                ) : (
                  <AlertCircle className="h-5 w-5 text-error" />
                )}
              </div>

              {/* File info */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {item.file.name}
                </p>
                <p className="text-xs text-muted-foreground">
                  {item.status === 'error'
                    ? item.error
                    : `${formatFileSize(item.file.size)}${item.status === 'uploading' ? ` - ${item.progress}%` : ''}`}
                </p>

                {/* Progress bar */}
                {item.status === 'uploading' && (
                  <div className="mt-1.5 h-1.5 w-full overflow-hidden rounded-full bg-muted">
                    <div
                      className="h-full rounded-full bg-gradient-to-r from-deep-ocean to-teal transition-all duration-300"
                      style={{ width: `${item.progress}%` }}
                    />
                  </div>
                )}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Uploaded files */}
      {uploadedFiles.length > 0 && (
        <div className="space-y-2">
          {uploadedFiles.map((file) => (
            <div
              key={file.path}
              className="group flex items-center gap-3 rounded-lg border border-border bg-card p-3 transition-colors hover:bg-accent/30"
            >
              {/* Thumbnail or icon */}
              <div className="shrink-0">
                {isImageFile(file.fileType, file.fileName) ? (
                  <div className="h-10 w-10 overflow-hidden rounded-md border border-border">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={file.url}
                      alt={file.fileName}
                      className="h-full w-full object-cover"
                    />
                  </div>
                ) : (
                  <div className="flex h-10 w-10 items-center justify-center rounded-md bg-muted">
                    {getFileIcon(file.fileType, file.fileName)}
                  </div>
                )}
              </div>

              {/* File details */}
              <div className="min-w-0 flex-1">
                <p className="truncate text-sm font-medium text-foreground">
                  {file.fileName}
                </p>
                <p className="text-xs text-muted-foreground">
                  {formatFileSize(file.fileSize)}
                </p>
              </div>

              {/* Remove button */}
              {!disabled && (
                <button
                  type="button"
                  onClick={(e) => {
                    e.stopPropagation()
                    handleRemove(file.path)
                  }}
                  className={cn(
                    'shrink-0 rounded-md p-1.5 text-muted-foreground transition-colors',
                    'hover:bg-error/10 hover:text-error',
                    'focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-error',
                    'opacity-0 group-hover:opacity-100'
                  )}
                  aria-label={`Remove ${file.fileName}`}
                >
                  <X className="h-4 w-4" />
                </button>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
