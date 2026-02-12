'use server'

import {
  ALL_ALLOWED_TYPES,
  ALLOWED_EXTENSIONS,
  MAX_FILE_SIZES,
  DEFAULT_MAX_FILE_SIZE,
  generateFilePath,
  formatFileSize,
} from '@/lib/supabase/storage'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { getActionContext } from '@/lib/actions/context'

// ============================================
// Types
// ============================================

export interface FileUploadResult {
  url: string
  path: string
  fileName: string
  fileSize: number
  fileType: string
}

// ============================================
// Server Action: Upload File
// ============================================

export async function uploadFileAction(
  formData: FormData
): Promise<{ data?: FileUploadResult; error?: string }> {
  const rl = await rateLimitAction('uploadFileAction')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  const { supabase, user, tenantId } = await getActionContext()

  // Allowed storage buckets
  const ALLOWED_BUCKETS = ['course-materials', 'submissions', 'avatars']

  // Extract form data
  const file = formData.get('file') as File | null
  const bucket = formData.get('bucket') as string | null

  if (!file || !bucket) {
    return { error: 'File and bucket are required' }
  }

  if (!ALLOWED_BUCKETS.includes(bucket)) {
    return { error: 'Invalid storage bucket' }
  }

  // Validate file size
  const maxSize = MAX_FILE_SIZES[bucket] ?? DEFAULT_MAX_FILE_SIZE
  if (file.size > maxSize) {
    const maxMB = Math.round(maxSize / (1024 * 1024))
    return { error: `File size (${formatFileSize(file.size)}) exceeds the ${maxMB}MB limit` }
  }

  if (file.size === 0) {
    return { error: 'File is empty' }
  }

  // Validate file type
  const ext = file.name.split('.').pop()?.toLowerCase()
  const allowedExt = ALLOWED_EXTENSIONS.map(e => e.replace('.', ''))

  if (!ALL_ALLOWED_TYPES.includes(file.type) && (!ext || !allowedExt.includes(ext))) {
    return { error: `File type "${file.type || ext}" is not allowed. Supported types: ${ALLOWED_EXTENSIONS.join(', ')}` }
  }

  // Generate scoped path — always server-generated, never user-supplied
  const filePath = generateFilePath(user.id, file.name, tenantId)

  // Upload to Supabase Storage
  const { data, error } = await supabase.storage
    .from(bucket)
    .upload(filePath, file, {
      cacheControl: '3600',
      upsert: false,
    })

  if (error) {
    console.error('Storage upload error:', error)
    return { error: `Upload failed: ${error.message}` }
  }

  // Get URL (public or signed depending on bucket)
  let url: string

  if (bucket === 'submissions') {
    // Private bucket: generate signed URL
    const { data: signedData, error: signedError } = await supabase.storage
      .from(bucket)
      .createSignedUrl(data.path, 3600)

    if (signedError) {
      console.error('Signed URL error:', signedError)
      url = data.path // fallback to path
    } else {
      url = signedData.signedUrl
    }
  } else {
    // Public bucket
    const { data: urlData } = supabase.storage
      .from(bucket)
      .getPublicUrl(data.path)
    url = urlData.publicUrl
  }

  return {
    data: {
      url,
      path: data.path,
      fileName: file.name,
      fileSize: file.size,
      fileType: file.type,
    },
  }
}

// ============================================
// Server Action: Delete File
// ============================================

export async function deleteFileAction(
  bucket: string,
  path: string
): Promise<{ success?: boolean; error?: string }> {
  const rl = await rateLimitAction('deleteFileAction')
  if (!rl.success) return { error: rl.error ?? 'Too many requests' }

  // Allowed storage buckets
  const ALLOWED_BUCKETS = ['course-materials', 'submissions', 'avatars']

  if (!ALLOWED_BUCKETS.includes(bucket)) {
    return { error: 'Invalid storage bucket' }
  }

  const { supabase, user, tenantId } = await getActionContext()

  if (path.includes('..') || path.startsWith('/') || path.includes('\0')) {
    return { error: 'Invalid file path' }
  }

  const pathParts = path.split('/')
  if (pathParts.length < 3) {
    return { error: 'Invalid file path' }
  }

  const pathTenantId = pathParts[0]
  if (pathTenantId !== tenantId) {
    return { error: 'Not authorized to delete files from another tenant' }
  }

  const pathUserId = pathParts[1]
  if (pathUserId !== user.id) {
    // Only admins/super_admins can delete other users' files
    const { data: membership } = await supabase
      .from('tenant_memberships')
      .select('role')
      .eq('user_id', user.id)
      .eq('tenant_id', tenantId)
      .eq('status', 'active')
      .single()

    if (!membership || !['admin', 'super_admin'].includes(membership.role)) {
      return { error: 'Not authorized to delete this file' }
    }
  }

  const { error } = await supabase.storage
    .from(bucket)
    .remove([path])

  if (error) {
    console.error('Storage delete error:', error)
    return { error: `Delete failed: ${error.message}` }
  }

  return { success: true }
}
