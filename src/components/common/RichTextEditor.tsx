'use client';

import * as React from 'react';
import { Bold, Italic, Heading2, List, Link, Image } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Textarea } from '../ui/Textarea';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '../ui/Tabs';

export interface RichTextEditorProps extends Omit<React.TextareaHTMLAttributes<HTMLTextAreaElement>, 'onChange'> {
  label?: string;
  error?: string;
  value?: string;
  onChange?: (value: string) => void;
}

export const RichTextEditor = React.forwardRef<HTMLTextAreaElement, RichTextEditorProps>(
  ({ className, label, error, value, onChange, ...props }, ref) => {
    const [markdown, setMarkdown] = React.useState(value || '');
    const textareaRef = React.useRef<HTMLTextAreaElement>(null);

    const insertMarkdown = (before: string, after: string = '') => {
      const textarea = textareaRef.current;
      if (!textarea) return;

      const start = textarea.selectionStart;
      const end = textarea.selectionEnd;
      const selected = markdown.substring(start, end);
      const newMarkdown = markdown.substring(0, start) + before + selected + after + markdown.substring(end);

      setMarkdown(newMarkdown);
      onChange?.(newMarkdown);

      setTimeout(() => {
        textarea.selectionStart = start + before.length;
        textarea.selectionEnd = start + before.length + selected.length;
        textarea.focus();
      }, 0);
    };

    const renderMarkdown = (md: string): string => {
      let html = md
        // Bold
        .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
        // Italic
        .replace(/\*(.*?)\*/g, '<em>$1</em>')
        // Headings
        .replace(/^### (.*?)$/gm, '<h3 style="font-size: 1.1em; font-weight: 700;">$1</h3>')
        .replace(/^## (.*?)$/gm, '<h2 style="font-size: 1.3em; font-weight: 700;">$1</h2>')
        .replace(/^# (.*?)$/gm, '<h1 style="font-size: 1.5em; font-weight: 700;">$1</h1>')
        // Lists
        .replace(/^\* (.*?)$/gm, '<li style="margin-left: 1.25em;">$1</li>')
        // Line breaks
        .replace(/\n/g, '<br/>')
        // Links
        .replace(/\[(.*?)\]\((.*?)\)/g, '<a href="$2" style="color: #4f46e5; text-decoration: underline;">$1</a>')
        // Paragraphs
        .replace(/<br\/><br\/>/g, '</p><p>')
        .replace(/^(.+)/gm, (match) => {
          if (match.startsWith('<') || match.startsWith('</')) return match;
          return `<p>${match}</p>`;
        });

      return html;
    };

    return (
      <div className="w-full">
        {label && (
          <label className="block text-sm font-medium text-slate-700 dark:text-slate-300 mb-2">
            {label}
          </label>
        )}
        <Tabs defaultValue="write" className="w-full">
          <TabsList className="mb-2">
            <TabsTrigger value="write">Write</TabsTrigger>
            <TabsTrigger value="preview">Preview</TabsTrigger>
          </TabsList>

          <TabsContent value="write" className="space-y-2">
            <div className="flex flex-wrap gap-1 rounded-t-xl glass backdrop-blur-md bg-white/50 dark:bg-slate-800/30 border border-white/40 dark:border-slate-700/40 border-b-0 p-2">
              <Button
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown('**', '**')}
                title="Bold"
                className="h-8 w-8"
              >
                <Bold className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown('*', '*')}
                title="Italic"
                className="h-8 w-8"
              >
                <Italic className="h-4 w-4" />
              </Button>
              <div className="mx-1 h-6 border-l border-slate-300 dark:border-slate-600" />
              <Button
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown('## ', '')}
                title="Heading"
                className="h-8 w-8"
              >
                <Heading2 className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown('* ', '')}
                title="List"
                className="h-8 w-8"
              >
                <List className="h-4 w-4" />
              </Button>
              <Button
                size="icon"
                variant="ghost"
                onClick={() => insertMarkdown('[Link](', ')')}
                title="Link"
                className="h-8 w-8"
              >
                <Link className="h-4 w-4" />
              </Button>
            </div>
            <Textarea
              ref={textareaRef}
              value={markdown}
              onChange={(e) => {
                setMarkdown(e.target.value);
                onChange?.(e.target.value);
              }}
              error={error}
              className="rounded-t-none"
              {...props}
            />
            {error && <p className="text-sm text-red-500">{error}</p>}
          </TabsContent>

          <TabsContent value="preview">
            <div
              className={cn(
                'min-h-24 rounded-xl glass backdrop-blur-md bg-white/50 dark:bg-slate-800/30 border border-white/40 dark:border-slate-700/40 p-4 prose prose-sm dark:prose-invert max-w-none',
                'text-slate-900 dark:text-slate-100'
              )}
              dangerouslySetInnerHTML={{ __html: renderMarkdown(markdown) }}
            />
          </TabsContent>
        </Tabs>
      </div>
    );
  }
);
RichTextEditor.displayName = 'RichTextEditor';
