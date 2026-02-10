'use client'

import { useState, useEffect } from 'react'
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
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Textarea } from '@/components/ui/textarea'
import { Badge } from '@/components/ui/badge'
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
import { getLesson, updateLesson } from '@/app/actions/lessons'

// ---------------------------------------------------------------------------
// Type Definitions
// ---------------------------------------------------------------------------

type ContentBlock = {
  id: string
  type: 'heading' | 'text' | 'image' | 'video' | 'file' | 'divider' | 'callout' | 'quiz'
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

// ---------------------------------------------------------------------------
// Block Type Icons and Labels
// ---------------------------------------------------------------------------

const blockTypes = [
  { type: 'heading', icon: Heading2, label: 'Heading' },
  { type: 'text', icon: Type, label: 'Text' },
  { type: 'image', icon: ImageIcon, label: 'Image' },
  { type: 'video', icon: Video, label: 'Video' },
  { type: 'file', icon: FileText, label: 'File' },
  { type: 'divider', icon: Minus, label: 'Divider' },
  { type: 'callout', icon: AlertCircle, label: 'Callout' },
  { type: 'quiz', icon: HelpCircle, label: 'Quiz' },
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

function ImageBlockEditor({ block, onChange }: { block: ContentBlock; onChange: (data: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Image URL</Label>
        <Input
          value={block.data.url || ''}
          onChange={(e) => onChange({ ...block.data, url: e.target.value })}
          placeholder="https://example.com/image.jpg"
          className="mt-1"
        />
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

function VideoBlockEditor({ block, onChange }: { block: ContentBlock; onChange: (data: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label>Video URL</Label>
        <Input
          value={block.data.url || ''}
          onChange={(e) => onChange({ ...block.data, url: e.target.value })}
          placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
          className="mt-1"
        />
        <p className="mt-1 text-xs text-muted-foreground">Supports YouTube and Vimeo</p>
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

function FileBlockEditor({ block, onChange }: { block: ContentBlock; onChange: (data: any) => void }) {
  return (
    <div className="space-y-3">
      <div>
        <Label>File URL</Label>
        <Input
          value={block.data.url || ''}
          onChange={(e) => onChange({ ...block.data, url: e.target.value })}
          placeholder="https://example.com/document.pdf"
          className="mt-1"
        />
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
          block.data.variant === 'warning' ? 'bg-amber-50 border-amber-200 text-amber-900 dark:bg-amber-950/30 dark:border-amber-800 dark:text-amber-100' :
          block.data.variant === 'tip' ? 'bg-blue-50 border-blue-200 text-blue-900 dark:bg-blue-950/30 dark:border-blue-800 dark:text-blue-100' :
          block.data.variant === 'success' ? 'bg-green-50 border-green-200 text-green-900 dark:bg-green-950/30 dark:border-green-800 dark:text-green-100' :
          'bg-slate-50 border-slate-200 text-slate-900 dark:bg-slate-950/30 dark:border-slate-800 dark:text-slate-100'
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
            <div key={index} className="flex gap-2 items-center">
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
}: {
  block: ContentBlock
  onUpdate: (data: any) => void
  onDelete: () => void
  onMoveUp: () => void
  onMoveDown: () => void
  canMoveUp: boolean
  canMoveDown: boolean
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
          {block.type === 'image' && <ImageBlockEditor block={block} onChange={onUpdate} />}
          {block.type === 'video' && <VideoBlockEditor block={block} onChange={onUpdate} />}
          {block.type === 'file' && <FileBlockEditor block={block} onChange={onUpdate} />}
          {block.type === 'divider' && <DividerBlockEditor />}
          {block.type === 'callout' && <CalloutBlockEditor block={block} onChange={onUpdate} />}
          {block.type === 'quiz' && <QuizBlockEditor block={block} onChange={onUpdate} />}
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
          <p className="text-muted-foreground mb-4">The lesson you're looking for doesn't exist.</p>
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
                  <div key={index} className="flex gap-2">
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
      </div>
    </div>
  )
}
