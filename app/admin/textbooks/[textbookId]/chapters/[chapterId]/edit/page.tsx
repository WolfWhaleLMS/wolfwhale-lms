'use client'

import { useState, useEffect, useRef, useCallback, use } from 'react'
import { useRouter } from 'next/navigation'
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
  Code2,
  List,
  Table2,
  Globe,
  Loader2,
  X,
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
import {
  getChapter,
  updateChapter,
  getAdminChapterFlashcards,
  addFlashcard,
  deleteFlashcard,
  getChapterOutcomes,
  getCurriculumOutcomes,
  linkChapterOutcome,
  unlinkChapterOutcome,
  getTextbook,
} from '@/app/actions/textbooks'
import type {
  TextbookChapter,
  TextbookFlashcard,
  KeyTerm,
  CurriculumOutcome,
} from '@/lib/types/textbook'
import { createClient } from '@/lib/supabase/client'

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

type ContentBlock = {
  id: string
  type:
    | 'heading'
    | 'text'
    | 'image'
    | 'video'
    | 'callout'
    | 'quiz'
    | 'code'
    | 'divider'
    | 'list'
    | 'table'
    | 'embed'
  data: Record<string, any>
}

// ---------------------------------------------------------------------------
// Supabase Upload Hook
// ---------------------------------------------------------------------------

function useSupabaseUpload(chapterId: string) {
  const [uploading, setUploading] = useState(false)
  const [progress, setProgress] = useState(0)

  const uploadFile = useCallback(
    async (file: File, subfolder: string = ''): Promise<string | null> => {
      setUploading(true)
      setProgress(0)

      try {
        const supabase = createClient()
        const sanitizedName = file.name.replace(/[^a-zA-Z0-9._-]/g, '_')
        const timestamp = Date.now()
        const path = subfolder
          ? `textbooks/chapters/${chapterId}/${subfolder}/${timestamp}_${sanitizedName}`
          : `textbooks/chapters/${chapterId}/${timestamp}_${sanitizedName}`

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
    },
    [chapterId]
  )

  return { uploadFile, uploading, progress }
}

// ---------------------------------------------------------------------------
// Upload Button Component
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
      {uploading && <Progress value={progress} className="h-2" />}
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
  { type: 'callout', icon: AlertCircle, label: 'Callout' },
  { type: 'quiz', icon: HelpCircle, label: 'Quiz' },
  { type: 'code', icon: Code2, label: 'Code' },
  { type: 'divider', icon: Minus, label: 'Divider' },
  { type: 'list', icon: List, label: 'List' },
  { type: 'table', icon: Table2, label: 'Table' },
  { type: 'embed', icon: Globe, label: 'Embed' },
] as const

// ---------------------------------------------------------------------------
// Block Editor Components
// ---------------------------------------------------------------------------

function HeadingBlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock
  onChange: (data: any) => void
}) {
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
            onValueChange={(value) =>
              onChange({ ...block.data, level: Number(value) })
            }
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

function TextBlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock
  onChange: (data: any) => void
}) {
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
  chapterId,
}: {
  block: ContentBlock
  onChange: (data: any) => void
  chapterId: string
}) {
  const { uploadFile, uploading, progress } = useSupabaseUpload(chapterId)

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
          <img
            src={block.data.url}
            alt={block.data.alt || ''}
            className="max-h-48 mx-auto"
          />
        </div>
      )}
    </div>
  )
}

function VideoBlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock
  onChange: (data: any) => void
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Video URL (YouTube or direct)</Label>
        <Input
          value={block.data.url || ''}
          onChange={(e) => onChange({ ...block.data, url: e.target.value })}
          placeholder="https://youtube.com/watch?v=... or https://example.com/video.mp4"
          className="mt-1"
        />
      </div>
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

function DividerBlockEditor() {
  return (
    <div className="py-4">
      <div className="border-t-2 border-border" />
      <p className="mt-2 text-xs text-muted-foreground text-center">
        Horizontal divider
      </p>
    </div>
  )
}

function CalloutBlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock
  onChange: (data: any) => void
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Callout Type</Label>
        <Select
          value={block.data.variant || 'info'}
          onValueChange={(value) =>
            onChange({ ...block.data, variant: value })
          }
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
        <div
          className={`mt-3 rounded-lg p-4 ${
            block.data.variant === 'warning'
              ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-100'
              : block.data.variant === 'tip'
                ? 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100'
                : block.data.variant === 'success'
                  ? 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-100'
                  : 'bg-slate-50 border-slate-200 text-slate-900 dark:bg-slate-950/30 dark:border-slate-800 dark:text-slate-100'
          } border`}
        >
          <div className="flex gap-2">
            <AlertCircle className="h-5 w-5 shrink-0 mt-0.5" />
            <p className="text-sm">{block.data.text}</p>
          </div>
        </div>
      )}
    </div>
  )
}

function QuizBlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock
  onChange: (data: any) => void
}) {
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
      correctIndex:
        correctIndex === index
          ? 0
          : correctIndex > index
            ? correctIndex - 1
            : correctIndex,
    })
  }

  return (
    <div className="space-y-4">
      <div>
        <Label>Question</Label>
        <Input
          value={block.data.question || ''}
          onChange={(e) =>
            onChange({ ...block.data, question: e.target.value })
          }
          placeholder="Enter quiz question..."
          className="mt-1"
        />
      </div>

      <div>
        <Label>Answer Options</Label>
        <div className="mt-2 space-y-2">
          {options.map((option: string, index: number) => (
            <div key={index} className="flex gap-2 items-center">
              <div className="flex-1 flex gap-2 items-center">
                <Button
                  type="button"
                  variant={
                    block.data.correctIndex === index ? 'default' : 'outline'
                  }
                  size="sm"
                  onClick={() =>
                    onChange({ ...block.data, correctIndex: index })
                  }
                  className="shrink-0"
                >
                  {block.data.correctIndex === index ? (
                    <Check className="h-4 w-4" />
                  ) : (
                    String.fromCharCode(65 + index)
                  )}
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
          onChange={(e) =>
            onChange({ ...block.data, explanation: e.target.value })
          }
          placeholder="Explain the correct answer..."
          className="mt-1"
        />
      </div>
    </div>
  )
}

function CodeBlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock
  onChange: (data: any) => void
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Language</Label>
        <Input
          value={block.data.language || ''}
          onChange={(e) =>
            onChange({ ...block.data, language: e.target.value })
          }
          placeholder="e.g. javascript, python, html"
          className="mt-1"
        />
      </div>
      <div>
        <Label>Code</Label>
        <Textarea
          value={block.data.code || ''}
          onChange={(e) => onChange({ ...block.data, code: e.target.value })}
          placeholder="Enter your code here..."
          className="mt-1 min-h-[120px] font-mono text-sm"
        />
      </div>
      <div>
        <Label>Caption (optional)</Label>
        <Input
          value={block.data.caption || ''}
          onChange={(e) =>
            onChange({ ...block.data, caption: e.target.value })
          }
          placeholder="Code snippet description..."
          className="mt-1"
        />
      </div>
    </div>
  )
}

function ListBlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock
  onChange: (data: any) => void
}) {
  const items: string[] = block.data.items || ['']

  const updateItem = (index: number, value: string) => {
    const newItems = [...items]
    newItems[index] = value
    onChange({ ...block.data, items: newItems })
  }

  const addItem = () => {
    onChange({ ...block.data, items: [...items, ''] })
  }

  const removeItem = (index: number) => {
    if (items.length <= 1) return
    onChange({
      ...block.data,
      items: items.filter((_, i) => i !== index),
    })
  }

  return (
    <div className="space-y-3">
      <div>
        <Label>List Style</Label>
        <Select
          value={block.data.style || 'unordered'}
          onValueChange={(value) =>
            onChange({ ...block.data, style: value })
          }
        >
          <SelectTrigger className="mt-1 w-48">
            <SelectValue />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="unordered">Bullet List</SelectItem>
            <SelectItem value="ordered">Numbered List</SelectItem>
          </SelectContent>
        </Select>
      </div>
      <div>
        <Label>Items</Label>
        <div className="mt-2 space-y-2">
          {items.map((item, index) => (
            <div key={index} className="flex gap-2 items-center">
              <span className="text-xs text-muted-foreground w-6 text-right">
                {block.data.style === 'ordered' ? `${index + 1}.` : '-'}
              </span>
              <Input
                value={item}
                onChange={(e) => updateItem(index, e.target.value)}
                placeholder={`Item ${index + 1}`}
                className="flex-1"
              />
              {items.length > 1 && (
                <Button
                  type="button"
                  variant="ghost"
                  size="sm"
                  onClick={() => removeItem(index)}
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
          onClick={addItem}
          className="mt-2 w-full"
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Item
        </Button>
      </div>
    </div>
  )
}

function TableBlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock
  onChange: (data: any) => void
}) {
  const headers: string[] = block.data.headers || ['Column 1', 'Column 2']
  const rows: string[][] = block.data.rows || [['', '']]

  const updateHeader = (index: number, value: string) => {
    const newHeaders = [...headers]
    newHeaders[index] = value
    onChange({ ...block.data, headers: newHeaders })
  }

  const updateCell = (rowIndex: number, colIndex: number, value: string) => {
    const newRows = rows.map((row) => [...row])
    newRows[rowIndex][colIndex] = value
    onChange({ ...block.data, rows: newRows })
  }

  const addColumn = () => {
    const newHeaders = [...headers, `Column ${headers.length + 1}`]
    const newRows = rows.map((row) => [...row, ''])
    onChange({ ...block.data, headers: newHeaders, rows: newRows })
  }

  const addRow = () => {
    const newRow = headers.map(() => '')
    onChange({ ...block.data, rows: [...rows, newRow] })
  }

  const removeRow = (index: number) => {
    if (rows.length <= 1) return
    onChange({
      ...block.data,
      rows: rows.filter((_, i) => i !== index),
    })
  }

  const removeColumn = (index: number) => {
    if (headers.length <= 1) return
    const newHeaders = headers.filter((_, i) => i !== index)
    const newRows = rows.map((row) => row.filter((_, i) => i !== index))
    onChange({ ...block.data, headers: newHeaders, rows: newRows })
  }

  return (
    <div className="space-y-3">
      <Label>Table</Label>
      <div className="overflow-x-auto rounded-lg border border-border">
        <table className="w-full text-sm">
          <thead>
            <tr className="bg-muted/50">
              {headers.map((header, i) => (
                <th key={i} className="px-3 py-2">
                  <div className="flex items-center gap-1">
                    <Input
                      value={header}
                      onChange={(e) => updateHeader(i, e.target.value)}
                      className="h-7 text-xs font-medium"
                    />
                    {headers.length > 1 && (
                      <Button
                        variant="ghost"
                        size="sm"
                        onClick={() => removeColumn(i)}
                        className="h-6 w-6 p-0 shrink-0"
                      >
                        <X className="h-3 w-3" />
                      </Button>
                    )}
                  </div>
                </th>
              ))}
              <th className="w-10" />
            </tr>
          </thead>
          <tbody>
            {rows.map((row, ri) => (
              <tr key={ri} className="border-t border-border">
                {row.map((cell, ci) => (
                  <td key={ci} className="px-3 py-1.5">
                    <Input
                      value={cell}
                      onChange={(e) => updateCell(ri, ci, e.target.value)}
                      className="h-7 text-xs"
                    />
                  </td>
                ))}
                <td className="px-1">
                  {rows.length > 1 && (
                    <Button
                      variant="ghost"
                      size="sm"
                      onClick={() => removeRow(ri)}
                      className="h-6 w-6 p-0"
                    >
                      <Trash2 className="h-3 w-3" />
                    </Button>
                  )}
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
      <div className="flex gap-2">
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addRow}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Row
        </Button>
        <Button
          type="button"
          variant="outline"
          size="sm"
          onClick={addColumn}
          className="flex-1"
        >
          <Plus className="h-4 w-4 mr-1" />
          Add Column
        </Button>
      </div>
    </div>
  )
}

function EmbedBlockEditor({
  block,
  onChange,
}: {
  block: ContentBlock
  onChange: (data: any) => void
}) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Embed URL</Label>
        <Input
          value={block.data.url || ''}
          onChange={(e) => onChange({ ...block.data, url: e.target.value })}
          placeholder="https://example.com/embed"
          className="mt-1"
        />
      </div>
      <div>
        <Label>Title (optional)</Label>
        <Input
          value={block.data.title || ''}
          onChange={(e) => onChange({ ...block.data, title: e.target.value })}
          placeholder="Embed title..."
          className="mt-1"
        />
      </div>
      <div className="grid grid-cols-2 gap-3">
        <div>
          <Label>Width</Label>
          <Input
            value={block.data.width || '100%'}
            onChange={(e) => onChange({ ...block.data, width: e.target.value })}
            placeholder="100%"
            className="mt-1"
          />
        </div>
        <div>
          <Label>Height</Label>
          <Input
            value={block.data.height || '400px'}
            onChange={(e) =>
              onChange({ ...block.data, height: e.target.value })
            }
            placeholder="400px"
            className="mt-1"
          />
        </div>
      </div>
      {block.data.url && (
        <div className="mt-3 rounded-lg border border-border overflow-hidden">
          <iframe
            src={block.data.url}
            title={block.data.title || 'Embed'}
            className="w-full bg-white"
            style={{ height: block.data.height || '400px' }}
          />
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
  chapterId,
}: {
  block: ContentBlock
  onUpdate: (data: any) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
  chapterId: string
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
          {block.type === 'heading' && (
            <HeadingBlockEditor block={block} onChange={onUpdate} />
          )}
          {block.type === 'text' && (
            <TextBlockEditor block={block} onChange={onUpdate} />
          )}
          {block.type === 'image' && (
            <ImageBlockEditor
              block={block}
              onChange={onUpdate}
              chapterId={chapterId}
            />
          )}
          {block.type === 'video' && (
            <VideoBlockEditor block={block} onChange={onUpdate} />
          )}
          {block.type === 'divider' && <DividerBlockEditor />}
          {block.type === 'callout' && (
            <CalloutBlockEditor block={block} onChange={onUpdate} />
          )}
          {block.type === 'quiz' && (
            <QuizBlockEditor block={block} onChange={onUpdate} />
          )}
          {block.type === 'code' && (
            <CodeBlockEditor block={block} onChange={onUpdate} />
          )}
          {block.type === 'list' && (
            <ListBlockEditor block={block} onChange={onUpdate} />
          )}
          {block.type === 'table' && (
            <TableBlockEditor block={block} onChange={onUpdate} />
          )}
          {block.type === 'embed' && (
            <EmbedBlockEditor block={block} onChange={onUpdate} />
          )}
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
// Key Terms Manager
// ---------------------------------------------------------------------------

function KeyTermsManager({
  keyTerms,
  onChange,
}: {
  keyTerms: KeyTerm[]
  onChange: (terms: KeyTerm[]) => void
}) {
  const addTerm = () => {
    onChange([...keyTerms, { term: '', definition: '' }])
  }

  const updateTerm = (
    index: number,
    field: keyof KeyTerm,
    value: string
  ) => {
    const updated = [...keyTerms]
    updated[index] = { ...updated[index], [field]: value }
    onChange(updated)
  }

  const removeTerm = (index: number) => {
    onChange(keyTerms.filter((_, i) => i !== index))
  }

  return (
    <div className="ocean-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Key Terms</h2>
          {keyTerms.length > 0 && (
            <Badge variant="secondary">{keyTerms.length}</Badge>
          )}
        </div>
        <Button variant="outline" size="sm" onClick={addTerm} className="gap-2">
          <Plus className="h-4 w-4" />
          Add Term
        </Button>
      </div>

      {keyTerms.length === 0 ? (
        <div className="py-6 text-center">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No key terms yet. Add vocabulary terms for this chapter.
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {keyTerms.map((kt, index) => (
            <div
              key={index}
              className="flex gap-3 items-start rounded-lg border border-border p-3"
            >
              <div className="flex-1 grid grid-cols-1 md:grid-cols-2 gap-3">
                <div>
                  <Label className="text-xs">Term</Label>
                  <Input
                    value={kt.term}
                    onChange={(e) => updateTerm(index, 'term', e.target.value)}
                    placeholder="Vocabulary term..."
                    className="mt-1"
                  />
                </div>
                <div>
                  <Label className="text-xs">Definition</Label>
                  <Input
                    value={kt.definition}
                    onChange={(e) =>
                      updateTerm(index, 'definition', e.target.value)
                    }
                    placeholder="Definition..."
                    className="mt-1"
                  />
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => removeTerm(index)}
                className="shrink-0 mt-5 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Flashcard Manager
// ---------------------------------------------------------------------------

function FlashcardManager({ chapterId }: { chapterId: string }) {
  const [flashcards, setFlashcards] = useState<TextbookFlashcard[]>([])
  const [loadingCards, setLoadingCards] = useState(true)
  const [showAdd, setShowAdd] = useState(false)
  const [frontText, setFrontText] = useState('')
  const [backText, setBackText] = useState('')
  const [difficulty, setDifficulty] = useState(1)
  const [addingCard, setAddingCard] = useState(false)

  const loadFlashcards = async () => {
    try {
      const data = await getAdminChapterFlashcards(chapterId)
      setFlashcards(data as TextbookFlashcard[])
    } catch (err) {
      console.error('Error loading flashcards:', err)
    } finally {
      setLoadingCards(false)
    }
  }

  useEffect(() => {
    loadFlashcards()
  }, [chapterId])

  const handleAddFlashcard = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!frontText.trim() || !backText.trim()) return
    setAddingCard(true)
    try {
      await addFlashcard(chapterId, {
        front_text: frontText,
        back_text: backText,
        difficulty,
      })
      toast.success('Flashcard added!')
      setFrontText('')
      setBackText('')
      setDifficulty(1)
      setShowAdd(false)
      await loadFlashcards()
    } catch (err: any) {
      toast.error(err.message || 'Failed to add flashcard')
    } finally {
      setAddingCard(false)
    }
  }

  const handleDeleteFlashcard = async (flashcardId: string) => {
    if (!confirm('Delete this flashcard?')) return
    try {
      await deleteFlashcard(flashcardId)
      toast.success('Flashcard deleted')
      await loadFlashcards()
    } catch (err) {
      toast.error('Failed to delete flashcard')
    }
  }

  return (
    <div className="ocean-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Flashcards</h2>
          {flashcards.length > 0 && (
            <Badge variant="secondary">{flashcards.length}</Badge>
          )}
        </div>
        <Button
          variant="outline"
          size="sm"
          onClick={() => setShowAdd(!showAdd)}
          className="gap-2"
        >
          <Plus className="h-4 w-4" />
          Add Flashcard
        </Button>
      </div>

      {/* Add Form */}
      {showAdd && (
        <form
          onSubmit={handleAddFlashcard}
          className="rounded-lg border border-border p-4 space-y-3 bg-muted/20"
        >
          <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
            <div>
              <Label className="text-xs">Front (Question)</Label>
              <Textarea
                value={frontText}
                onChange={(e) => setFrontText(e.target.value)}
                placeholder="What is photosynthesis?"
                className="mt-1"
                rows={3}
                required
              />
            </div>
            <div>
              <Label className="text-xs">Back (Answer)</Label>
              <Textarea
                value={backText}
                onChange={(e) => setBackText(e.target.value)}
                placeholder="The process by which plants convert sunlight..."
                className="mt-1"
                rows={3}
                required
              />
            </div>
          </div>
          <div className="w-32">
            <Label className="text-xs">Difficulty (1-5)</Label>
            <Select
              value={String(difficulty)}
              onValueChange={(v) => setDifficulty(Number(v))}
            >
              <SelectTrigger className="mt-1">
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                {[1, 2, 3, 4, 5].map((d) => (
                  <SelectItem key={d} value={String(d)}>
                    {d}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
          </div>
          <div className="flex gap-2">
            <Button type="submit" size="sm" disabled={addingCard}>
              {addingCard ? 'Adding...' : 'Add Flashcard'}
            </Button>
            <Button
              type="button"
              variant="outline"
              size="sm"
              onClick={() => setShowAdd(false)}
            >
              Cancel
            </Button>
          </div>
        </form>
      )}

      {/* Flashcard List */}
      {loadingCards ? (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Loading flashcards...
        </div>
      ) : flashcards.length === 0 ? (
        <div className="py-6 text-center">
          <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
          <p className="text-sm text-muted-foreground">
            No flashcards yet. Add study cards for this chapter.
          </p>
        </div>
      ) : (
        <div className="space-y-2">
          {flashcards.map((card, idx) => (
            <div
              key={card.id}
              className="flex items-start justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
            >
              <div className="flex-1 min-w-0">
                <div className="flex items-center gap-2 mb-1">
                  <span className="text-xs text-muted-foreground">
                    #{idx + 1}
                  </span>
                  <Badge variant="secondary" className="text-[10px]">
                    Difficulty: {card.difficulty}
                  </Badge>
                </div>
                <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Front
                    </p>
                    <p className="text-sm text-foreground">{card.front_text}</p>
                  </div>
                  <div>
                    <p className="text-xs text-muted-foreground mb-0.5">
                      Back
                    </p>
                    <p className="text-sm text-foreground">{card.back_text}</p>
                  </div>
                </div>
              </div>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleDeleteFlashcard(card.id)}
                className="shrink-0 ml-2 text-destructive hover:text-destructive"
              >
                <Trash2 className="h-3.5 w-3.5" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Curriculum Outcomes Manager
// ---------------------------------------------------------------------------

function OutcomesManager({
  chapterId,
  province,
  framework,
  subject,
  gradeLevel,
}: {
  chapterId: string
  province: string
  framework: string
  subject: string
  gradeLevel: string
}) {
  const [linkedOutcomes, setLinkedOutcomes] = useState<CurriculumOutcome[]>([])
  const [availableOutcomes, setAvailableOutcomes] = useState<
    CurriculumOutcome[]
  >([])
  const [loadingOutcomes, setLoadingOutcomes] = useState(true)
  const [showAvailable, setShowAvailable] = useState(false)

  const loadOutcomes = async () => {
    try {
      const [linked, available] = await Promise.all([
        getChapterOutcomes(chapterId),
        getCurriculumOutcomes(province, framework, subject, gradeLevel),
      ])
      setLinkedOutcomes(linked as CurriculumOutcome[])
      setAvailableOutcomes(available as CurriculumOutcome[])
    } catch (err) {
      console.error('Error loading outcomes:', err)
    } finally {
      setLoadingOutcomes(false)
    }
  }

  useEffect(() => {
    if (province && framework && subject && gradeLevel) {
      loadOutcomes()
    } else {
      setLoadingOutcomes(false)
    }
  }, [chapterId, province, framework, subject, gradeLevel])

  const handleLink = async (outcomeId: string) => {
    try {
      await linkChapterOutcome(chapterId, outcomeId)
      toast.success('Outcome linked')
      await loadOutcomes()
    } catch (err) {
      toast.error('Failed to link outcome')
    }
  }

  const handleUnlink = async (outcomeId: string) => {
    try {
      await unlinkChapterOutcome(chapterId, outcomeId)
      toast.success('Outcome unlinked')
      await loadOutcomes()
    } catch (err) {
      toast.error('Failed to unlink outcome')
    }
  }

  const linkedIds = new Set(linkedOutcomes.map((o) => o.id))
  const unlinkable = availableOutcomes.filter((o) => !linkedIds.has(o.id))

  return (
    <div className="ocean-card rounded-xl p-6 space-y-4">
      <div className="flex items-center justify-between">
        <div className="flex items-center gap-2">
          <BookOpen className="h-5 w-5 text-primary" />
          <h2 className="text-lg font-semibold">Curriculum Outcomes</h2>
          {linkedOutcomes.length > 0 && (
            <Badge variant="secondary">{linkedOutcomes.length}</Badge>
          )}
        </div>
        {availableOutcomes.length > 0 && (
          <Button
            variant="outline"
            size="sm"
            onClick={() => setShowAvailable(!showAvailable)}
            className="gap-2"
          >
            {showAvailable ? (
              <EyeOff className="h-4 w-4" />
            ) : (
              <Eye className="h-4 w-4" />
            )}
            {showAvailable ? 'Hide Available' : 'Link Outcomes'}
          </Button>
        )}
      </div>

      {loadingOutcomes ? (
        <div className="py-4 text-center text-sm text-muted-foreground">
          Loading outcomes...
        </div>
      ) : (
        <>
          {/* Linked Outcomes */}
          {linkedOutcomes.length === 0 ? (
            <div className="py-6 text-center">
              <BookOpen className="h-8 w-8 mx-auto mb-2 text-muted-foreground/40" />
              <p className="text-sm text-muted-foreground">
                No curriculum outcomes linked to this chapter.
              </p>
            </div>
          ) : (
            <div className="space-y-2">
              {linkedOutcomes.map((outcome) => (
                <div
                  key={outcome.id}
                  className="flex items-start justify-between rounded-lg border border-primary/20 bg-primary/5 p-3"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="default" className="text-[10px]">
                        {outcome.outcome_code}
                      </Badge>
                      {outcome.strand && (
                        <span className="text-xs text-muted-foreground">
                          {outcome.strand}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground">
                      {outcome.description}
                    </p>
                  </div>
                  <Button
                    variant="ghost"
                    size="sm"
                    onClick={() => handleUnlink(outcome.id)}
                    className="shrink-0 ml-2"
                  >
                    <X className="h-3.5 w-3.5" />
                  </Button>
                </div>
              ))}
            </div>
          )}

          {/* Available Outcomes */}
          {showAvailable && unlinkable.length > 0 && (
            <div className="space-y-2 border-t border-border pt-4">
              <p className="text-sm font-medium text-muted-foreground mb-2">
                Available Outcomes ({unlinkable.length})
              </p>
              {unlinkable.map((outcome) => (
                <div
                  key={outcome.id}
                  className="flex items-start justify-between rounded-lg border border-border p-3 hover:bg-muted/30 transition-colors"
                >
                  <div className="flex-1 min-w-0">
                    <div className="flex items-center gap-2 mb-1">
                      <Badge variant="secondary" className="text-[10px]">
                        {outcome.outcome_code}
                      </Badge>
                      {outcome.strand && (
                        <span className="text-xs text-muted-foreground">
                          {outcome.strand}
                        </span>
                      )}
                    </div>
                    <p className="text-sm text-foreground">
                      {outcome.description}
                    </p>
                  </div>
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={() => handleLink(outcome.id)}
                    className="shrink-0 ml-2 gap-1"
                  >
                    <Plus className="h-3.5 w-3.5" />
                    Link
                  </Button>
                </div>
              ))}
            </div>
          )}

          {showAvailable && unlinkable.length === 0 && (
            <p className="text-sm text-muted-foreground text-center py-4 border-t border-border">
              All available outcomes are already linked.
            </p>
          )}
        </>
      )}
    </div>
  )
}

// ---------------------------------------------------------------------------
// Main Page Component
// ---------------------------------------------------------------------------

export default function ChapterEditorPage({
  params,
}: {
  params: Promise<{ textbookId: string; chapterId: string }>
}) {
  const { textbookId, chapterId } = use(params)
  const router = useRouter()

  const [chapter, setChapter] = useState<TextbookChapter | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)

  // Chapter metadata state
  const [title, setTitle] = useState('')
  const [description, setDescription] = useState('')
  const [estimatedMinutes, setEstimatedMinutes] = useState<number | null>(null)
  const [indigenousConnection, setIndigenousConnection] = useState('')
  const [showMetadata, setShowMetadata] = useState(true)

  // Content blocks state
  const [blocks, setBlocks] = useState<ContentBlock[]>([])

  // Key terms state
  const [keyTerms, setKeyTerms] = useState<KeyTerm[]>([])

  // Textbook info for outcomes
  const [textbookInfo, setTextbookInfo] = useState<{
    province: string
    curriculum_framework: string
    subject: string
    grade_level: string
  } | null>(null)

  // Load chapter and textbook data
  useEffect(() => {
    async function loadData() {
      try {
        const [chapterData, textbookData] = await Promise.all([
          getChapter(chapterId),
          getTextbook(textbookId),
        ])

        if (chapterData) {
          setChapter(chapterData as TextbookChapter)
          setTitle(chapterData.title)
          setDescription(chapterData.description || '')
          setBlocks((chapterData.content as ContentBlock[]) || [])
          setKeyTerms((chapterData.key_terms as KeyTerm[]) || [])
          setEstimatedMinutes(chapterData.estimated_minutes)
          setIndigenousConnection(chapterData.indigenous_connection || '')
        }

        if (textbookData) {
          setTextbookInfo({
            province: textbookData.province,
            curriculum_framework: textbookData.curriculum_framework,
            subject: textbookData.subject,
            grade_level: textbookData.grade_level,
          })
        }
      } catch (error) {
        console.error('Error loading chapter:', error)
        toast.error('Failed to load chapter')
      } finally {
        setLoading(false)
      }
    }
    loadData()
  }, [chapterId, textbookId])

  // Add a new block
  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: crypto.randomUUID(),
      type,
      data:
        type === 'quiz'
          ? {
              question: '',
              options: ['', '', '', ''],
              correctIndex: 0,
              explanation: '',
            }
          : type === 'table'
            ? {
                headers: ['Column 1', 'Column 2'],
                rows: [['', '']],
              }
            : type === 'list'
              ? { style: 'unordered', items: [''] }
              : {},
    }
    setBlocks([...blocks, newBlock])
  }

  // Update block data
  const updateBlock = (id: string, data: any) => {
    setBlocks(
      blocks.map((block) => (block.id === id ? { ...block, data } : block))
    )
  }

  // Delete a block
  const deleteBlock = (id: string) => {
    setBlocks(blocks.filter((block) => block.id !== id))
  }

  // Move block up
  const moveBlockUp = (index: number) => {
    if (index === 0) return
    const newBlocks = [...blocks]
    ;[newBlocks[index - 1], newBlocks[index]] = [
      newBlocks[index],
      newBlocks[index - 1],
    ]
    setBlocks(newBlocks)
  }

  // Move block down
  const moveBlockDown = (index: number) => {
    if (index === blocks.length - 1) return
    const newBlocks = [...blocks]
    ;[newBlocks[index], newBlocks[index + 1]] = [
      newBlocks[index + 1],
      newBlocks[index],
    ]
    setBlocks(newBlocks)
  }

  // Save chapter
  const saveChapter = async (publish: boolean = false) => {
    if (!title.trim()) {
      toast.error('Chapter title is required')
      return
    }

    setSaving(true)
    try {
      await updateChapter(chapterId, {
        title,
        slug: title
          .toLowerCase()
          .replace(/[^a-z0-9]+/g, '-')
          .replace(/(^-|-$)/g, ''),
        description: description || null,
        content: blocks,
        key_terms: keyTerms.filter((kt) => kt.term.trim()),
        estimated_minutes: estimatedMinutes,
        indigenous_connection: indigenousConnection || null,
        is_published: publish ? true : chapter?.is_published ?? false,
      })
      toast.success(
        publish ? 'Chapter published!' : 'Chapter saved!'
      )
      if (publish && !chapter?.is_published) {
        // Refresh chapter state after publishing
        const updated = await getChapter(chapterId)
        if (updated) setChapter(updated as TextbookChapter)
      }
    } catch (error: any) {
      console.error('Error saving chapter:', error)
      toast.error(error.message || 'Failed to save chapter')
    } finally {
      setSaving(false)
    }
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary mx-auto mb-4" />
          <p className="text-muted-foreground">Loading chapter editor...</p>
        </div>
      </div>
    )
  }

  if (!chapter) {
    return (
      <div className="flex items-center justify-center min-h-screen">
        <div className="text-center">
          <h1 className="text-2xl font-bold mb-2">Chapter not found</h1>
          <p className="text-muted-foreground mb-4">
            The chapter you are looking for does not exist.
          </p>
          <Link href={`/admin/textbooks/${textbookId}`}>
            <Button>Back to Textbook</Button>
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
              <Link href={`/admin/textbooks/${textbookId}`}>
                <Button variant="ghost" size="sm">
                  <ArrowLeft className="h-4 w-4 mr-2" />
                  Back
                </Button>
              </Link>
              <div className="h-6 w-px bg-border" />
              <Input
                value={title}
                onChange={(e) => setTitle(e.target.value)}
                placeholder="Chapter title..."
                className="font-semibold text-lg border-none shadow-none focus-visible:ring-0 px-2"
              />
              <Badge
                variant={
                  chapter.is_published ? 'default' : 'secondary'
                }
              >
                {chapter.is_published ? 'published' : 'draft'}
              </Badge>
            </div>
            <div className="flex items-center gap-2 shrink-0">
              <Button
                variant="outline"
                size="sm"
                onClick={() => setShowMetadata(!showMetadata)}
              >
                {showMetadata ? (
                  <EyeOff className="h-4 w-4" />
                ) : (
                  <Eye className="h-4 w-4" />
                )}
              </Button>
              <Button
                onClick={() => saveChapter(false)}
                disabled={saving}
                variant="outline"
                size="sm"
              >
                <Save className="h-4 w-4 mr-2" />
                {saving ? 'Saving...' : 'Save'}
              </Button>
              <Button
                onClick={() => saveChapter(true)}
                disabled={saving}
                className="whale-gradient"
                size="sm"
              >
                {chapter.is_published ? 'Update' : 'Publish'}
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
            <h2 className="text-lg font-semibold">Chapter Details</h2>

            <div className="grid gap-4 sm:grid-cols-2">
              <div>
                <Label>Description</Label>
                <Textarea
                  value={description}
                  onChange={(e) => setDescription(e.target.value)}
                  placeholder="Brief description of the chapter..."
                  className="mt-1"
                />
              </div>
              <div>
                <Label>Estimated Minutes</Label>
                <Input
                  type="number"
                  value={estimatedMinutes || ''}
                  onChange={(e) =>
                    setEstimatedMinutes(
                      e.target.value ? Number(e.target.value) : null
                    )
                  }
                  placeholder="30"
                  className="mt-1"
                />
              </div>
            </div>

            <div>
              <Label>Indigenous Connection (optional)</Label>
              <Textarea
                value={indigenousConnection}
                onChange={(e) => setIndigenousConnection(e.target.value)}
                placeholder="Describe how this chapter connects to Indigenous knowledge, perspectives, or ways of knowing..."
                className="mt-1"
                rows={3}
              />
            </div>
          </div>
        )}

        {/* Content Blocks */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h2 className="text-lg font-semibold">Content Blocks</h2>
            <span className="text-sm text-muted-foreground">
              {blocks.length} blocks
            </span>
          </div>

          {blocks.length === 0 ? (
            <div className="ocean-card rounded-xl p-12 text-center">
              <BookOpen className="h-12 w-12 mx-auto mb-3 text-muted-foreground/40" />
              <h3 className="text-lg font-semibold mb-2">
                No content blocks yet
              </h3>
              <p className="text-sm text-muted-foreground mb-4">
                Start building your chapter by adding content blocks below.
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
                  chapterId={chapterId}
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

        {/* Key Terms */}
        <KeyTermsManager keyTerms={keyTerms} onChange={setKeyTerms} />

        {/* Flashcards */}
        <FlashcardManager chapterId={chapterId} />

        {/* Curriculum Outcomes */}
        {textbookInfo && (
          <OutcomesManager
            chapterId={chapterId}
            province={textbookInfo.province}
            framework={textbookInfo.curriculum_framework}
            subject={textbookInfo.subject}
            gradeLevel={textbookInfo.grade_level}
          />
        )}
      </div>
    </div>
  )
}
