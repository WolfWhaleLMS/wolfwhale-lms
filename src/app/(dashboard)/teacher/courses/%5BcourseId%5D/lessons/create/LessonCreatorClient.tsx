'use client';

import React, { useState } from 'react';
import { useRouter } from 'next/navigation';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/Card';
import { Button } from '@/components/ui/Button';
import { Badge } from '@/components/ui/Badge';
import { Input } from '@/components/ui/Input';
import { Textarea } from '@/components/ui/Textarea';
import { Plus, X, Eye, Save } from 'lucide-react';
import { cn } from '@/lib/utils';

interface ContentBlock {
  id: string;
  type: 'text' | 'video' | 'image' | 'file' | 'quiz' | 'discussion' | 'link' | 'code';
  content: any;
}

const blockTypeConfig = {
  text: { label: 'Text', icon: '\uD83D\uDCDD', color: 'bg-blue-500/20' },
  video: { label: 'Video', icon: '\uD83C\uDFA5', color: 'bg-red-500/20' },
  image: { label: 'Image', icon: '\uD83D\uDDBC\uFE0F', color: 'bg-purple-500/20' },
  file: { label: 'File', icon: '\uD83D\uDCCE', color: 'bg-green-500/20' },
  quiz: { label: 'Quiz', icon: '\u2753', color: 'bg-yellow-500/20' },
  discussion: { label: 'Discussion', icon: '\uD83D\uDCAC', color: 'bg-pink-500/20' },
  link: { label: 'Link', icon: '\uD83D\uDD17', color: 'bg-indigo-500/20' },
  code: { label: 'Code', icon: '</>', color: 'bg-slate-500/20' },
};

interface LessonCreatorClientProps {
  courseId: string;
  courseName: string;
  tenantId: string;
  teacherId: string;
  nextOrderIndex: number;
}

export function LessonCreatorClient({
  courseId,
  courseName,
  tenantId,
  teacherId,
  nextOrderIndex,
}: LessonCreatorClientProps) {
  const router = useRouter();
  const [lessonTitle, setLessonTitle] = useState('');
  const [lessonDescription, setLessonDescription] = useState('');
  const [isPublished, setIsPublished] = useState(false);
  const [blocks, setBlocks] = useState<ContentBlock[]>([]);
  const [showAddBlock, setShowAddBlock] = useState(false);
  const [isSaving, setIsSaving] = useState(false);
  const [saveError, setSaveError] = useState<string | null>(null);

  const addBlock = (type: ContentBlock['type']) => {
    const newBlock: ContentBlock = {
      id: Date.now().toString(),
      type,
      content: {},
    };
    setBlocks([...blocks, newBlock]);
    setShowAddBlock(false);
  };

  const removeBlock = (id: string) => {
    setBlocks(blocks.filter((b) => b.id !== id));
  };

  const updateBlock = (id: string, content: any) => {
    setBlocks(
      blocks.map((b) => (b.id === id ? { ...b, content } : b))
    );
  };

  const reorderBlock = (id: string, direction: 'up' | 'down') => {
    const idx = blocks.findIndex((b) => b.id === id);
    if ((direction === 'up' && idx === 0) || (direction === 'down' && idx === blocks.length - 1)) {
      return;
    }
    const newBlocks = [...blocks];
    const swapIdx = direction === 'up' ? idx - 1 : idx + 1;
    [newBlocks[idx], newBlocks[swapIdx]] = [newBlocks[swapIdx], newBlocks[idx]];
    setBlocks(newBlocks);
  };

  // Compile block content into a single content string
  const compileContent = (): string => {
    return blocks.map((block) => {
      switch (block.type) {
        case 'text':
          return block.content.text || '';
        case 'video':
          return `[Video: ${block.content.url || ''}]`;
        case 'link':
          return `[Link: ${block.content.title || ''} - ${block.content.url || ''}]\n${block.content.description || ''}`;
        case 'code':
          return `\`\`\`${block.content.language || 'text'}\n${block.content.code || ''}\n\`\`\``;
        case 'quiz':
          return `[Quiz: ${block.content.question || ''}]`;
        case 'discussion':
          return `[Discussion: ${block.content.prompt || ''}]`;
        default:
          return '';
      }
    }).filter(Boolean).join('\n\n');
  };

  const handleSave = async (publish: boolean) => {
    if (!lessonTitle.trim()) {
      setSaveError('Lesson title is required');
      return;
    }

    setIsSaving(true);
    setSaveError(null);

    try {
      const res = await fetch('/api/courses', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          action: 'create_lesson',
          courseId,
          tenantId,
          title: lessonTitle.trim(),
          description: lessonDescription.trim(),
          content: compileContent(),
          orderIndex: nextOrderIndex,
          status: publish ? 'published' : 'draft',
          publishedAt: publish ? new Date().toISOString() : null,
          createdBy: teacherId,
        }),
      });

      if (res.ok) {
        router.push(`/teacher/courses/${courseId}`);
        router.refresh();
      } else {
        // If the generic API endpoint doesn't support lessons, insert directly
        const directRes = await fetch('/api/courses', {
          method: 'PATCH',
          headers: { 'Content-Type': 'application/json' },
          body: JSON.stringify({
            action: 'create_lesson',
            courseId,
            tenantId,
            title: lessonTitle.trim(),
            description: lessonDescription.trim(),
            content: compileContent(),
            orderIndex: nextOrderIndex,
            status: publish ? 'published' : 'draft',
          }),
        });

        if (directRes.ok) {
          router.push(`/teacher/courses/${courseId}`);
          router.refresh();
        } else {
          setSaveError('Failed to save lesson. Please try again.');
        }
      }
    } catch (error) {
      console.error('Error saving lesson:', error);
      setSaveError('An error occurred while saving.');
    } finally {
      setIsSaving(false);
    }
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-slate-50 via-blue-50 to-indigo-50 dark:from-slate-950 dark:via-blue-950 dark:to-indigo-950 p-4 md:p-8">
      <div className="max-w-4xl mx-auto space-y-8">
        {/* Header */}
        <div className="flex justify-between items-center">
          <div>
            <h1 className="text-4xl font-bold text-slate-900 dark:text-white">Create Lesson</h1>
            <p className="text-sm text-slate-600 dark:text-slate-400 mt-1">
              Course: {courseName}
            </p>
          </div>
          <div className="flex gap-3">
            <Button variant="outline">
              <Eye className="w-4 h-4 mr-2" />
              Preview
            </Button>
            <Button
              className="bg-blue-600 hover:bg-blue-700 text-white"
              onClick={() => handleSave(false)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              {isSaving ? 'Saving...' : 'Save Draft'}
            </Button>
            <Button
              className="bg-green-600 hover:bg-green-700 text-white"
              onClick={() => handleSave(true)}
              disabled={isSaving}
            >
              <Save className="w-4 h-4 mr-2" />
              Publish
            </Button>
          </div>
        </div>

        {saveError && (
          <div className="bg-red-50 dark:bg-red-900/20 border border-red-200 dark:border-red-800 text-red-700 dark:text-red-300 px-4 py-3 rounded-lg">
            {saveError}
          </div>
        )}

        {/* Lesson Details */}
        <Card>
          <CardHeader>
            <CardTitle>Lesson Details</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Lesson Title *
              </label>
              <Input
                placeholder="Enter lesson title"
                value={lessonTitle}
                onChange={(e) => setLessonTitle(e.target.value)}
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-slate-900 dark:text-white mb-2">
                Description
              </label>
              <Textarea
                placeholder="Optional lesson description"
                value={lessonDescription}
                onChange={(e) => setLessonDescription(e.target.value)}
                rows={3}
              />
            </div>
          </CardContent>
        </Card>

        {/* Content Blocks */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center justify-between">
              <span>Content Blocks</span>
              <Badge variant="secondary">{blocks.length} blocks</Badge>
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {blocks.length === 0 && (
              <p className="text-slate-600 dark:text-slate-400 text-center py-8">
                No content blocks yet. Click "Add Block" to get started.
              </p>
            )}

            {blocks.map((block, idx) => (
              <div
                key={block.id}
                className="border-2 border-slate-200 dark:border-slate-700 rounded-lg p-4 space-y-3"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="text-2xl">
                      {blockTypeConfig[block.type].icon}
                    </span>
                    <h4 className="font-semibold text-slate-900 dark:text-white">
                      {blockTypeConfig[block.type].label}
                    </h4>
                  </div>
                  <div className="flex gap-2">
                    {idx > 0 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reorderBlock(block.id, 'up')}
                      >
                        Up
                      </Button>
                    )}
                    {idx < blocks.length - 1 && (
                      <Button
                        variant="outline"
                        size="sm"
                        onClick={() => reorderBlock(block.id, 'down')}
                      >
                        Down
                      </Button>
                    )}
                    <Button
                      variant="outline"
                      size="sm"
                      onClick={() => removeBlock(block.id)}
                      className="text-red-600 hover:text-red-700"
                    >
                      <X className="w-4 h-4" />
                    </Button>
                  </div>
                </div>

                {/* Block Content Editors */}
                {block.type === 'text' && (
                  <Textarea
                    placeholder="Enter your text content (Markdown supported)"
                    value={block.content.text || ''}
                    onChange={(e) => updateBlock(block.id, { text: e.target.value })}
                    rows={4}
                  />
                )}

                {block.type === 'video' && (
                  <Input
                    placeholder="YouTube or Vimeo URL"
                    value={block.content.url || ''}
                    onChange={(e) => updateBlock(block.id, { url: e.target.value })}
                  />
                )}

                {block.type === 'image' && (
                  <div className="space-y-2">
                    <Input
                      type="file"
                      accept="image/*"
                      onChange={(e) =>
                        updateBlock(block.id, { file: e.target.files?.[0] })
                      }
                    />
                    <Input
                      placeholder="Alt text"
                      value={block.content.altText || ''}
                      onChange={(e) =>
                        updateBlock(block.id, { altText: e.target.value })
                      }
                    />
                  </div>
                )}

                {block.type === 'file' && (
                  <Input
                    type="file"
                    onChange={(e) =>
                      updateBlock(block.id, { file: e.target.files?.[0] })
                    }
                  />
                )}

                {block.type === 'quiz' && (
                  <div className="space-y-3">
                    <Input
                      placeholder="Question text"
                      value={block.content.question || ''}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, question: e.target.value })
                      }
                    />
                    {['A', 'B', 'C', 'D'].map((letter) => (
                      <div key={letter} className="flex gap-2 items-center">
                        <span className="font-medium text-sm">{letter}.</span>
                        <Input
                          placeholder={`Option ${letter}`}
                          value={block.content[`option${letter}`] || ''}
                          onChange={(e) =>
                            updateBlock(block.id, {
                              ...block.content,
                              [`option${letter}`]: e.target.value,
                            })
                          }
                        />
                      </div>
                    ))}
                  </div>
                )}

                {block.type === 'discussion' && (
                  <Textarea
                    placeholder="Discussion prompt"
                    value={block.content.prompt || ''}
                    onChange={(e) => updateBlock(block.id, { prompt: e.target.value })}
                    rows={3}
                  />
                )}

                {block.type === 'link' && (
                  <div className="space-y-2">
                    <Input
                      placeholder="URL"
                      value={block.content.url || ''}
                      onChange={(e) => updateBlock(block.id, { ...block.content, url: e.target.value })}
                    />
                    <Input
                      placeholder="Link title"
                      value={block.content.title || ''}
                      onChange={(e) => updateBlock(block.id, { ...block.content, title: e.target.value })}
                    />
                    <Textarea
                      placeholder="Description (optional)"
                      value={block.content.description || ''}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, description: e.target.value })
                      }
                      rows={2}
                    />
                  </div>
                )}

                {block.type === 'code' && (
                  <div className="space-y-2">
                    <select
                      value={block.content.language || 'javascript'}
                      onChange={(e) =>
                        updateBlock(block.id, { ...block.content, language: e.target.value })
                      }
                      className="w-full rounded-md border border-slate-200 dark:border-slate-700 bg-white dark:bg-slate-800 px-3 py-2 text-sm"
                    >
                      <option value="javascript">JavaScript</option>
                      <option value="python">Python</option>
                      <option value="html">HTML</option>
                      <option value="css">CSS</option>
                      <option value="java">Java</option>
                    </select>
                    <Textarea
                      placeholder="Code content"
                      value={block.content.code || ''}
                      onChange={(e) => updateBlock(block.id, { ...block.content, code: e.target.value })}
                      rows={4}
                      className="font-mono text-sm"
                    />
                  </div>
                )}
              </div>
            ))}

            {/* Add Block Section */}
            {!showAddBlock ? (
              <Button
                variant="outline"
                className="w-full"
                onClick={() => setShowAddBlock(true)}
              >
                <Plus className="w-4 h-4 mr-2" />
                Add Content Block
              </Button>
            ) : (
              <div className="border-2 border-dashed border-blue-400 rounded-lg p-4">
                <p className="font-semibold text-slate-900 dark:text-white mb-3">
                  Select Block Type
                </p>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
                  {(Object.keys(blockTypeConfig) as Array<keyof typeof blockTypeConfig>).map(
                    (type) => (
                      <button
                        key={type}
                        onClick={() => addBlock(type)}
                        className={cn(
                          'p-3 rounded-lg border-2 border-slate-200 dark:border-slate-700 text-center hover:border-blue-400 transition-colors',
                          blockTypeConfig[type].color
                        )}
                      >
                        <span className="text-2xl block mb-1">
                          {blockTypeConfig[type].icon}
                        </span>
                        <p className="text-xs font-medium">
                          {blockTypeConfig[type].label}
                        </p>
                      </button>
                    )
                  )}
                </div>
                <Button
                  variant="outline"
                  className="w-full mt-3"
                  onClick={() => setShowAddBlock(false)}
                >
                  Cancel
                </Button>
              </div>
            )}
          </CardContent>
        </Card>

        {/* Publish Settings */}
        <Card>
          <CardHeader>
            <CardTitle>Publish Settings</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-3">
              <input
                type="checkbox"
                id="publish"
                checked={isPublished}
                onChange={(e) => setIsPublished(e.target.checked)}
                className="w-4 h-4 rounded"
              />
              <label htmlFor="publish" className="font-medium text-slate-900 dark:text-white">
                Publish to students immediately
              </label>
            </div>
            {!isPublished && (
              <p className="text-sm text-slate-600 dark:text-slate-400">
                Save as draft to review before publishing
              </p>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
