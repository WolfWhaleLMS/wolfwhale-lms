'use client';

import { FileDown, Paperclip } from 'lucide-react';
import { cn } from '@/lib/utils';
import type { MockAssignment } from '@/lib/mock-data';
import type { DashboardVariant } from '@/hooks/useGradeLevel';

interface AssignmentContentProps {
  assignment: MockAssignment;
  variant: DashboardVariant;
  className?: string;
}

function renderMarkdownToHTML(md: string): string {
  let html = md
    // Bold
    .replace(/\*\*(.*?)\*\*/g, '<strong>$1</strong>')
    // Italic
    .replace(/\*(.*?)\*/g, '<em>$1</em>')
    // H3
    .replace(/^### (.*?)$/gm, '<h3 class="text-base font-bold mt-4 mb-2 text-slate-800 dark:text-slate-200">$1</h3>')
    // H2
    .replace(/^## (.*?)$/gm, '<h2 class="text-lg font-bold mt-5 mb-2 text-slate-800 dark:text-slate-200">$1</h2>')
    // H1
    .replace(/^# (.*?)$/gm, '<h1 class="text-xl font-bold mt-6 mb-3 text-slate-800 dark:text-slate-200">$1</h1>')
    // Unordered lists
    .replace(/^\* (.*?)$/gm, '<li class="ml-5 list-disc text-slate-600 dark:text-slate-400 my-1">$1</li>')
    // Ordered lists
    .replace(/^\d+\. (.*?)$/gm, '<li class="ml-5 list-decimal text-slate-600 dark:text-slate-400 my-1">$1</li>')
    // Line breaks
    .replace(/\n\n/g, '</p><p class="my-2 text-slate-600 dark:text-slate-400">')
    .replace(/\n/g, '<br/>');

  return html;
}

export function AssignmentContent({ assignment, variant, className }: AssignmentContentProps) {
  const isK5 = variant === 'k5';

  return (
    <div className={cn('space-y-6', className)}>
      {/* Instructions */}
      <div
        className={cn(
          'rounded-2xl border border-white/30 dark:border-slate-700/30 bg-white/50 dark:bg-slate-800/30 backdrop-blur-md p-6',
          isK5 && 'text-base leading-relaxed'
        )}
      >
        <h3 className={cn(
          'font-bold text-slate-900 dark:text-white mb-4',
          isK5 ? 'text-xl' : 'text-lg'
        )}>
          Instructions
        </h3>
        <div
          className={cn(
            'prose dark:prose-invert max-w-none',
            isK5 ? 'prose-lg' : 'prose-sm'
          )}
          dangerouslySetInnerHTML={{
            __html: renderMarkdownToHTML(assignment.instructions),
          }}
        />
      </div>

      {/* Attachments */}
      {assignment.attachments && assignment.attachments.length > 0 && (
        <div className="rounded-2xl border border-white/30 dark:border-slate-700/30 bg-white/50 dark:bg-slate-800/30 backdrop-blur-md p-6">
          <h3 className={cn(
            'font-bold text-slate-900 dark:text-white mb-4 flex items-center gap-2',
            isK5 ? 'text-xl' : 'text-lg'
          )}>
            <Paperclip className="h-5 w-5 text-slate-400" />
            Attachments
          </h3>
          <div className="space-y-2">
            {assignment.attachments.map((file, idx) => (
              <button
                key={idx}
                className="flex items-center gap-3 w-full rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200 dark:border-slate-700 p-3 hover:bg-slate-100 dark:hover:bg-slate-700/50 transition-colors text-left"
              >
                <FileDown className="h-5 w-5 text-indigo-500 flex-shrink-0" />
                <div className="flex-1 min-w-0">
                  <p className="text-sm font-medium text-slate-900 dark:text-white truncate">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400">{file.size}</p>
                </div>
              </button>
            ))}
          </div>
        </div>
      )}

      {/* Rubric */}
      {assignment.rubric && assignment.rubric.length > 0 && (
        <div className="rounded-2xl border border-white/30 dark:border-slate-700/30 bg-white/50 dark:bg-slate-800/30 backdrop-blur-md p-6">
          <h3 className={cn(
            'font-bold text-slate-900 dark:text-white mb-4',
            isK5 ? 'text-xl' : 'text-lg'
          )}>
            Grading Rubric
          </h3>
          <div className="space-y-3">
            {assignment.rubric.map((item, idx) => (
              <div
                key={idx}
                className="flex items-start justify-between gap-4 rounded-xl bg-slate-50 dark:bg-slate-800/50 border border-slate-200/50 dark:border-slate-700/50 p-4"
              >
                <div className="flex-1">
                  <p className="text-sm font-semibold text-slate-900 dark:text-white">
                    {item.criterion}
                  </p>
                  <p className="text-xs text-slate-500 dark:text-slate-400 mt-1">
                    {item.description}
                  </p>
                </div>
                <span className="text-sm font-bold text-indigo-600 dark:text-indigo-400 whitespace-nowrap">
                  {item.maxPoints} pts
                </span>
              </div>
            ))}
            <div className="flex justify-end pt-2 border-t border-slate-200 dark:border-slate-700">
              <span className="text-sm font-bold text-slate-900 dark:text-white">
                Total: {assignment.rubric.reduce((sum, r) => sum + r.maxPoints, 0)} points
              </span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
