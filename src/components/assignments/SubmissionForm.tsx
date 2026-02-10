'use client';

import { useState, useCallback } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import {
  Send,
  Save,
  Upload,
  X,
  FileIcon,
  CheckCircle2,
  Sparkles,
  AlertCircle,
} from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '@/components/ui/Button';
import { Textarea } from '@/components/ui/Textarea';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/Dialog';
import { FILE_UPLOAD_LIMITS } from '@/config/constants';
import type { MockAssignment, SubmissionType } from '@/lib/mock-data';
import type { DashboardVariant } from '@/hooks/useGradeLevel';

interface SubmissionFormProps {
  assignment: MockAssignment;
  variant: DashboardVariant;
  className?: string;
}

type FormState = 'editing' | 'confirming' | 'submitting' | 'success';

export function SubmissionForm({ assignment, variant, className }: SubmissionFormProps) {
  const isK5 = variant === 'k5';
  const [formState, setFormState] = useState<FormState>('editing');
  const [submissionText, setSubmissionText] = useState('');
  const [files, setFiles] = useState<File[]>([]);
  const [noteToTeacher, setNoteToTeacher] = useState('');
  const [isDragActive, setIsDragActive] = useState(false);
  const [draftSaved, setDraftSaved] = useState(false);

  const fileInputId = `file-upload-${assignment.id}`;

  // File handling
  const handleDrag = useCallback((e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  }, []);

  const handleDrop = useCallback(
    (e: React.DragEvent) => {
      e.preventDefault();
      e.stopPropagation();
      setIsDragActive(false);
      const droppedFiles = Array.from(e.dataTransfer.files).filter(
        (f) => f.size <= FILE_UPLOAD_LIMITS.max_file_size_mb * 1024 * 1024
      );
      setFiles((prev) => [...prev, ...droppedFiles]);
    },
    []
  );

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const selected = Array.from(e.target.files || []).filter(
      (f) => f.size <= FILE_UPLOAD_LIMITS.max_file_size_mb * 1024 * 1024
    );
    setFiles((prev) => [...prev, ...selected]);
    e.target.value = '';
  }, []);

  const removeFile = useCallback((index: number) => {
    setFiles((prev) => prev.filter((_, i) => i !== index));
  }, []);

  // Actions
  const handleSaveDraft = () => {
    setDraftSaved(true);
    setTimeout(() => setDraftSaved(false), 3000);
  };

  const handleSubmitClick = () => {
    setFormState('confirming');
  };

  const handleConfirmSubmit = async () => {
    setFormState('submitting');
    // Simulate submission delay
    await new Promise((resolve) => setTimeout(resolve, 1800));
    setFormState('success');
  };

  const handleCancelConfirm = () => {
    setFormState('editing');
  };

  const canSubmit =
    (assignment.submissionType === 'text' && submissionText.trim().length > 0) ||
    (assignment.submissionType === 'file' && files.length > 0) ||
    (assignment.submissionType === 'link' && submissionText.trim().length > 0) ||
    (assignment.submissionType === 'discussion' && submissionText.trim().length > 0);

  // Success state
  if (formState === 'success') {
    return (
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        transition={{ duration: 0.5, ease: 'easeOut' }}
        className={cn(
          'rounded-2xl border-2 border-emerald-300 dark:border-emerald-700 bg-gradient-to-br from-emerald-50 to-green-50 dark:from-emerald-950/40 dark:to-green-950/40 p-8 text-center',
          className
        )}
      >
        <motion.div
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.2, type: 'spring', stiffness: 200, damping: 12 }}
          className="mb-4"
        >
          <div className="inline-flex items-center justify-center w-20 h-20 rounded-full bg-emerald-100 dark:bg-emerald-900/50 mb-4">
            <CheckCircle2 className="h-10 w-10 text-emerald-600 dark:text-emerald-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 10 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ delay: 0.4 }}
        >
          <h3 className={cn(
            'font-bold text-emerald-800 dark:text-emerald-200 mb-2',
            isK5 ? 'text-2xl' : 'text-xl'
          )}>
            {isK5 ? 'Great Job! You Did It!' : 'Assignment Submitted Successfully!'}
          </h3>
          <p className="text-sm text-emerald-600 dark:text-emerald-400 mb-4">
            {isK5
              ? 'Your teacher will look at your work soon. Keep being awesome!'
              : `Your submission for "${assignment.title}" has been received. Your teacher will review it shortly.`}
          </p>
        </motion.div>

        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          transition={{ delay: 0.6 }}
          className="flex items-center justify-center gap-2 text-sm font-medium text-amber-600 dark:text-amber-400"
        >
          <Sparkles className="h-4 w-4" />
          +{assignment.xpReward} XP earned!
        </motion.div>
      </motion.div>
    );
  }

  return (
    <div className={cn('space-y-6', className)}>
      <div className="rounded-2xl border border-white/30 dark:border-slate-700/30 bg-white/50 dark:bg-slate-800/30 backdrop-blur-md p-6">
        <h3
          className={cn(
            'font-bold text-slate-900 dark:text-white mb-4',
            isK5 ? 'text-xl' : 'text-lg'
          )}
        >
          {isK5 ? 'Turn In Your Work' : 'Submit Your Work'}
        </h3>

        {/* Text submission */}
        {(assignment.submissionType === 'text' || assignment.submissionType === 'discussion') && (
          <div className="mb-4">
            <Textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder={
                isK5
                  ? 'Type your answer here...'
                  : 'Enter your response...'
              }
              rows={isK5 ? 6 : 10}
              className={cn(isK5 ? 'text-base' : 'text-sm')}
            />
            <p className="mt-1 text-xs text-slate-400 text-right">
              {submissionText.length} characters
            </p>
          </div>
        )}

        {/* Link submission */}
        {assignment.submissionType === 'link' && (
          <div className="mb-4">
            <Textarea
              value={submissionText}
              onChange={(e) => setSubmissionText(e.target.value)}
              placeholder="Paste your URL here..."
              rows={2}
              className="text-sm"
            />
          </div>
        )}

        {/* File upload */}
        {assignment.submissionType === 'file' && (
          <div className="mb-4">
            <div
              onDragEnter={handleDrag}
              onDragLeave={handleDrag}
              onDragOver={handleDrag}
              onDrop={handleDrop}
              className={cn(
                'relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
                isDragActive
                  ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-50/50 dark:bg-indigo-900/20'
                  : 'border-slate-300 dark:border-slate-600 bg-slate-50/50 dark:bg-slate-900/30'
              )}
            >
              <input
                id={fileInputId}
                type="file"
                onChange={handleFileInput}
                multiple
                className="hidden"
              />
              <div className="mb-3 flex justify-center">
                <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 p-3">
                  <Upload className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
                </div>
              </div>
              <h4 className={cn(
                'font-semibold text-slate-900 dark:text-white mb-1',
                isK5 ? 'text-base' : 'text-sm'
              )}>
                {isK5 ? 'Drop your file here!' : 'Drag and drop files here'}
              </h4>
              <p className="text-xs text-slate-500 dark:text-slate-400 mb-3">
                or{' '}
                <label
                  htmlFor={fileInputId}
                  className="font-medium text-indigo-600 dark:text-indigo-400 underline cursor-pointer"
                >
                  click to browse
                </label>
              </p>
              <p className="text-xs text-slate-400">
                Max file size: {FILE_UPLOAD_LIMITS.max_file_size_mb}MB
              </p>
            </div>

            {/* File list */}
            <AnimatePresence>
              {files.length > 0 && (
                <motion.div
                  initial={{ opacity: 0, height: 0 }}
                  animate={{ opacity: 1, height: 'auto' }}
                  exit={{ opacity: 0, height: 0 }}
                  className="space-y-2 mt-3"
                >
                  {files.map((file, index) => (
                    <motion.div
                      key={`${file.name}-${index}`}
                      initial={{ opacity: 0, x: -20 }}
                      animate={{ opacity: 1, x: 0 }}
                      exit={{ opacity: 0, x: 20 }}
                      transition={{ duration: 0.2 }}
                      className="flex items-center gap-3 rounded-xl bg-white/70 dark:bg-slate-800/50 border border-white/40 dark:border-slate-700/40 p-3"
                    >
                      <FileIcon className="h-5 w-5 flex-shrink-0 text-indigo-500" />
                      <div className="flex-1 min-w-0">
                        <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                          {file.name}
                        </p>
                        <p className="text-xs text-slate-500">
                          {(file.size / 1024 / 1024).toFixed(2)} MB
                        </p>
                      </div>
                      <button
                        onClick={() => removeFile(index)}
                        className="rounded-full p-1 hover:bg-red-100 dark:hover:bg-red-900/30 transition-colors"
                      >
                        <X className="h-4 w-4 text-red-500" />
                      </button>
                    </motion.div>
                  ))}
                </motion.div>
              )}
            </AnimatePresence>
          </div>
        )}

        {/* Note to teacher */}
        <div className="mb-6">
          <label className="block text-sm font-medium text-slate-600 dark:text-slate-400 mb-2">
            {isK5 ? 'Message for your teacher (optional)' : 'Notes to teacher (optional)'}
          </label>
          <Textarea
            value={noteToTeacher}
            onChange={(e) => setNoteToTeacher(e.target.value)}
            placeholder={
              isK5 ? 'Want to tell your teacher something?' : 'Add any notes or comments...'
            }
            rows={3}
            className="text-sm"
          />
        </div>

        {/* Action buttons */}
        <div className="flex flex-col sm:flex-row items-stretch sm:items-center gap-3">
          <Button
            variant="outline"
            onClick={handleSaveDraft}
            className="flex items-center gap-2"
          >
            <Save className="h-4 w-4" />
            {draftSaved ? 'Draft Saved!' : 'Save Draft'}
          </Button>

          <div className="flex-1" />

          <Button
            variant="fun"
            onClick={handleSubmitClick}
            disabled={!canSubmit || formState !== 'editing'}
            className={cn(
              'flex items-center gap-2',
              isK5 ? 'text-base px-8 h-12' : ''
            )}
          >
            <Send className="h-4 w-4" />
            {isK5 ? 'Turn It In!' : 'Submit Assignment'}
          </Button>
        </div>

        {/* Validation message */}
        {!canSubmit && formState === 'editing' && (
          <p className="mt-3 text-xs text-amber-600 dark:text-amber-400 flex items-center gap-1.5">
            <AlertCircle className="h-3.5 w-3.5" />
            {assignment.submissionType === 'file'
              ? 'Please upload at least one file to submit.'
              : 'Please enter your response to submit.'}
          </p>
        )}
      </div>

      {/* Confirmation Dialog */}
      <Dialog open={formState === 'confirming'} onOpenChange={(open) => !open && handleCancelConfirm()}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>
              {isK5 ? 'Ready to turn in your work?' : 'Submit Assignment?'}
            </DialogTitle>
            <DialogDescription>
              {isK5
                ? `You are about to turn in "${assignment.title}". Make sure you are happy with your work!`
                : `You are about to submit "${assignment.title}" for ${assignment.courseName}. This action will record your submission.`}
            </DialogDescription>
          </DialogHeader>

          {assignment.submissionType === 'file' && files.length > 0 && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3 space-y-1">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400">Files to submit:</p>
              {files.map((f, i) => (
                <p key={i} className="text-sm text-slate-700 dark:text-slate-300 flex items-center gap-2">
                  <FileIcon className="h-3.5 w-3.5 text-slate-400" />
                  {f.name}
                </p>
              ))}
            </div>
          )}

          {assignment.submissionType !== 'file' && submissionText && (
            <div className="rounded-lg bg-slate-50 dark:bg-slate-800/50 p-3">
              <p className="text-xs font-medium text-slate-500 dark:text-slate-400 mb-1">Your response:</p>
              <p className="text-sm text-slate-700 dark:text-slate-300 line-clamp-3">
                {submissionText}
              </p>
            </div>
          )}

          <DialogFooter className="gap-2 sm:gap-0">
            <Button variant="outline" onClick={handleCancelConfirm}>
              {isK5 ? 'Wait, go back!' : 'Cancel'}
            </Button>
            <Button
              variant="fun"
              onClick={handleConfirmSubmit}
              isLoading={formState === 'submitting'}
              className="flex items-center gap-2"
            >
              <Send className="h-4 w-4" />
              {isK5 ? 'Yes, Turn It In!' : 'Confirm Submit'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

      {/* Submitting overlay dialog */}
      <Dialog open={formState === 'submitting'} onOpenChange={() => {}}>
        <DialogContent className="text-center">
          <div className="py-8">
            <motion.div
              animate={{ rotate: 360 }}
              transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
              className="inline-block mb-4"
            >
              <Sparkles className="h-10 w-10 text-indigo-500" />
            </motion.div>
            <DialogTitle className="mb-2">
              {isK5 ? 'Sending your work...' : 'Submitting...'}
            </DialogTitle>
            <DialogDescription>
              {isK5 ? 'Almost there! Hold on tight!' : 'Please wait while we process your submission.'}
            </DialogDescription>
          </div>
        </DialogContent>
      </Dialog>
    </div>
  );
}
