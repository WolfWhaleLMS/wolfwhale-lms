import { createClient } from './client'

// ============================================
// File Upload Types
// ============================================

export interface UploadedFile {
  url: string
  path: string
  fileName: string
  fileSize: number
  fileType: string
}

export interface UploadProgress {
  loaded: number
  total: number
  percent: number
}

// ============================================
// Allowed file types and size limits
// ============================================

export const ALLOWED_FILE_TYPES: Record<string, string[]> = {
  documents: [
    'application/pdf',
    'application/msword',
    'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
    'application/vnd.openxmlformats-officedocument.presentationml.presentation',
    'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
    'text/plain',
  ],
  images: [
    'image/jpeg',
    'image/png',
    'image/gif',
  ],
  media: [
    'video/mp4',
    'audio/mpeg',
  ],
  archives: [
    'application/zip',
  ],
}

export const ALL_ALLOWED_TYPES = [
  ...ALLOWED_FILE_TYPES.documents,
  ...ALLOWED_FILE_TYPES.images,
  ...ALLOWED_FILE_TYPES.media,
  ...ALLOWED_FILE_TYPES.archives,
]

export const ALLOWED_EXTENSIONS = [
  '.pdf', '.doc', '.docx', '.pptx', '.xlsx', '.txt',
  '.jpg', '.jpeg', '.png', '.gif',
  '.mp4', '.mp3',
  '.zip',
]

/** Max file sizes in bytes per bucket */
export const MAX_FILE_SIZES: Record<string, number> = {
  'course-materials': 100 * 1024 * 1024, // 100MB
  'submissions': 50 * 1024 * 1024,       // 50MB
  'avatars': 5 * 1024 * 1024,            // 5MB
}

/** Default max file size: 100MB */
export const DEFAULT_MAX_FILE_SIZE = 100 * 1024 * 1024

// ============================================
// Helper: generate unique scoped file path
// ============================================

/**
 * Generates a unique file path scoped to tenant and user.
 *
 * Format: `{tenantId}/{userId}/{timestamp}-{random}-{sanitizedFileName}`
 *
 * If no tenantId is provided, 'default' is used.
 */
export function generateFilePath(
  userId: string,
  fileName: string,
  tenantId?: string | null
): string {
  const tenant = tenantId || 'default'
  const timestamp = Date.now()
  const random = Math.random().toString(36).substring(2, 8)
  const sanitized = sanitizeFileName(fileName)
  return `${tenant}/${userId}/${timestamp}-${random}-${sanitized}`
}

/**
 * Sanitize a file name: remove special characters, keep extension.
 */
function sanitizeFileName(fileName: string): string {
  const parts = fileName.split('.')
  const ext = parts.length > 1 ? `.${parts.pop()}` : ''
  const name = parts.join('.')
  const sanitized = name
    .replace(/[^a-zA-Z0-9_-]/g, '_')
    .replace(/_+/g, '_')
    .substring(0, 100)
  return `${sanitized}${ext.toLowerCase()}`
}

// ============================================
// Validate file
// ============================================

export function validateFile(
  file: File,
  bucket: string,
  allowedTypes?: string[]
): { valid: boolean; error?: string } {
  // Check file size
  const maxSize = MAX_FILE_SIZES[bucket] ?? DEFAULT_MAX_FILE_SIZE
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024))
    return { valid: false, error: `File size exceeds ${maxMB}MB limit` }
  }

  if (file.size === 0) {
    return { valid: false, error: 'File is empty' }
  }

  // Check file type
  const typesToCheck = allowedTypes ?? ALL_ALLOWED_TYPES
  if (!typesToCheck.includes(file.type)) {
    const ext = file.name.split('.').pop()?.toLowerCase()
    const allowedExt = ALLOWED_EXTENSIONS.map(e => e.replace('.', ''))
    if (!ext || !allowedExt.includes(ext)) {
      return { valid: false, error: `File type "${file.type || ext}" is not allowed` }
    }
  }

  return { valid: true }
}

// ============================================
// Format file size for display
// ============================================

export function formatFileSize(bytes: number): string {
  if (bytes === 0) return '0 B'
  const units = ['B', 'KB', 'MB', 'GB']
  const i = Math.floor(Math.log(bytes) / Math.log(1024))
  const size = bytes / Math.pow(1024, i)
  return `${size.toFixed(i === 0 ? 0 : 1)} ${units[i]}`
}

// ============================================
// Get file extension from name or MIME type
// ============================================

export function getFileExtension(fileName: string): string {
  return (fileName.split('.').pop() || '').toLowerCase()
}

// ============================================
// Upload file to Supabase Storage (browser)
// ============================================

export async function uploadFile(
  bucket: string,
  path: string,
  file: File
): Promise<{ data: { path: string } | null; error: Error | null }> {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(path, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    return { data: null, error: new Error(error.message) }
  }

  return { data: { path: data.path }, error: null }
}

// ============================================
// Delete file from Supabase Storage (browser)
// ============================================

export async function deleteFile(
  bucket: string,
  path: string
): Promise<{ error: Error | null }> {
  const supabase = createClient()

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    return { error: new Error(error.message) }
  }

  return { error: null }
}

// ============================================
// Get public URL for a file
// ============================================

export function getPublicUrl(
  bucket: string,
  path: string
): string {
  const supabase = createClient()

  const { data } = supabase.storage
    .from(bucket)
    .getPublicUrl(path)

  return data.publicUrl
}

// ============================================
// Get signed URL for private files
// ============================================

export async function getSignedUrl(
  bucket: string,
  path: string,
  expiresIn: number = 3600
): Promise<{ url: string | null; error: Error | null }> {
  const supabase = createClient()

  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn)

  if (error) {
    return { url: null, error: new Error(error.message) }
  }

  return { url: data.signedUrl, error: null }
}
