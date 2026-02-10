'use client';

import * as React from 'react';
import { Upload, X, FileIcon } from 'lucide-react';
import { cn } from '@/lib/utils';
import { Button } from '../ui/Button';
import { Progress } from '../ui/Progress';
import { FILE_UPLOAD_LIMITS } from '@/config/constants';

export interface FileUploadProps {
  onFilesSelected?: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSizeBytes?: number;
}

export function FileUpload({
  onFilesSelected,
  accept,
  multiple = false,
  maxSizeBytes = FILE_UPLOAD_LIMITS.max_file_size_mb * 1024 * 1024,
}: FileUploadProps) {
  const [files, setFiles] = React.useState<File[]>([]);
  const [isDragActive, setIsDragActive] = React.useState(false);
  const [uploadProgress, setUploadProgress] = React.useState<Record<string, number>>({});
  const inputRef = React.useRef<HTMLInputElement>(null);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(e.type === 'dragenter' || e.type === 'dragover');
  };

  const validateFiles = (filesToValidate: File[]): File[] => {
    return filesToValidate.filter((file) => {
      if (file.size > maxSizeBytes) {
        console.warn(`File ${file.name} exceeds size limit`);
        return false;
      }
      return true;
    });
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragActive(false);

    const droppedFiles = Array.from(e.dataTransfer.files);
    const validatedFiles = validateFiles(droppedFiles);

    if (validatedFiles.length > 0) {
      const newFiles = multiple ? [...files, ...validatedFiles] : validatedFiles;
      setFiles(newFiles);
      onFilesSelected?.(newFiles);
    }
  };

  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const selectedFiles = Array.from(e.target.files || []);
    const validatedFiles = validateFiles(selectedFiles);

    if (validatedFiles.length > 0) {
      const newFiles = multiple ? [...files, ...validatedFiles] : validatedFiles;
      setFiles(newFiles);
      onFilesSelected?.(newFiles);
    }

    if (inputRef.current) {
      inputRef.current.value = '';
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    setFiles(newFiles);
    onFilesSelected?.(newFiles);
  };

  return (
    <div className="space-y-4">
      <div
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        className={cn(
          'relative rounded-2xl border-2 border-dashed p-8 text-center transition-all duration-200',
          'glass backdrop-blur-lg bg-gradient-to-br from-indigo-50/50 to-purple-50/50 dark:from-indigo-900/20 dark:to-purple-900/20',
          isDragActive
            ? 'border-indigo-400 dark:border-indigo-500 bg-indigo-100/20 dark:bg-indigo-900/40'
            : 'border-slate-300 dark:border-slate-600'
        )}
      >
        <input
          ref={inputRef}
          type="file"
          onChange={handleInputChange}
          accept={accept}
          multiple={multiple}
          className="hidden"
        />
        <div className="mb-4 flex justify-center">
          <div className="rounded-full bg-gradient-to-br from-indigo-100 to-purple-100 dark:from-indigo-900/40 dark:to-purple-900/40 p-3">
            <Upload className="h-6 w-6 text-indigo-600 dark:text-indigo-400" />
          </div>
        </div>
        <h3 className="mb-2 text-sm font-semibold text-slate-900 dark:text-white">
          Drag and drop files here
        </h3>
        <p className="mb-4 text-xs text-slate-600 dark:text-slate-400">
          or{' '}
          <button
            onClick={() => inputRef.current?.click()}
            className="font-medium text-indigo-600 underline dark:text-indigo-400"
          >
            click to browse
          </button>
        </p>
        <p className="text-xs text-slate-500 dark:text-slate-500">
          Max file size: {FILE_UPLOAD_LIMITS.max_file_size_mb}MB
        </p>
      </div>

      {files.length > 0 && (
        <div className="space-y-2">
          {files.map((file, index) => (
            <div
              key={`${file.name}-${index}`}
              className="flex items-center gap-3 rounded-lg glass backdrop-blur-md bg-white/50 dark:bg-slate-800/30 border border-white/30 dark:border-slate-700/30 p-3"
            >
              <FileIcon className="h-5 w-5 flex-shrink-0 text-slate-400" />
              <div className="flex-1 min-w-0">
                <p className="truncate text-sm font-medium text-slate-900 dark:text-white">
                  {file.name}
                </p>
                <p className="text-xs text-slate-600 dark:text-slate-400">
                  {(file.size / 1024 / 1024).toFixed(2)} MB
                </p>
                {uploadProgress[file.name] !== undefined && (
                  <Progress value={uploadProgress[file.name]} className="mt-1 h-1" />
                )}
              </div>
              <Button
                variant="ghost"
                size="icon"
                onClick={() => removeFile(index)}
                className="h-8 w-8 flex-shrink-0"
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
