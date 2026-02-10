import { createClient as createServerClient } from '@/lib/supabase/server';
import { ValidationError, ApiError } from '@/lib/api/errors';

export const BUCKET_NAMES = {
  AVATARS: 'avatars',
  ASSIGNMENTS: 'assignments',
  CONTENT: 'content',
  MEDIA: 'media',
} as const;

export type BucketName = (typeof BUCKET_NAMES)[keyof typeof BUCKET_NAMES];

const ALLOWED_IMAGE_TYPES = ['image/jpeg', 'image/png', 'image/webp', 'image/gif'];
const ALLOWED_DOCUMENT_TYPES = [
  'application/pdf',
  'application/msword',
  'application/vnd.openxmlformats-officedocument.wordprocessingml.document',
  'application/vnd.ms-excel',
  'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
];
const ALLOWED_VIDEO_TYPES = ['video/mp4', 'video/webm', 'video/mpeg'];

const MAX_FILE_SIZES = {
  [BUCKET_NAMES.AVATARS]: 5, // 5 MB
  [BUCKET_NAMES.ASSIGNMENTS]: 50, // 50 MB
  [BUCKET_NAMES.CONTENT]: 100, // 100 MB
  [BUCKET_NAMES.MEDIA]: 200, // 200 MB
};

/**
 * Validate file before upload
 */
export async function validateFile(
  file: File,
  bucket: BucketName,
  allowedTypes?: string[]
): Promise<void> {
  if (!file) {
    throw new ValidationError('File is required');
  }

  // Check file size
  const maxSizeMB = MAX_FILE_SIZES[bucket];
  const fileSizeMB = file.size / (1024 * 1024);

  if (fileSizeMB > maxSizeMB) {
    throw new ValidationError(`File size must not exceed ${maxSizeMB}MB`);
  }

  // Check file type
  const types = allowedTypes || getDefaultAllowedTypes(bucket);
  if (types && !types.includes(file.type)) {
    throw new ValidationError(`File type ${file.type} is not allowed for ${bucket}`);
  }

  // Check file extension for security
  const allowedExtensions = ['jpg', 'jpeg', 'png', 'gif', 'webp', 'pdf', 'doc', 'docx', 'xls', 'xlsx', 'mp4', 'webm', 'txt'];
  const fileExtension = file.name.split('.').pop()?.toLowerCase();

  if (!fileExtension || !allowedExtensions.includes(fileExtension)) {
    throw new ValidationError('File extension is not allowed');
  }
}

/**
 * Get default allowed file types for bucket
 */
function getDefaultAllowedTypes(bucket: BucketName): string[] {
  switch (bucket) {
    case BUCKET_NAMES.AVATARS:
      return ALLOWED_IMAGE_TYPES;
    case BUCKET_NAMES.ASSIGNMENTS:
      return [...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_IMAGE_TYPES];
    case BUCKET_NAMES.CONTENT:
      return [...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
    case BUCKET_NAMES.MEDIA:
      return [...ALLOWED_DOCUMENT_TYPES, ...ALLOWED_IMAGE_TYPES, ...ALLOWED_VIDEO_TYPES];
    default:
      return [];
  }
}

/**
 * Generate a secure file path
 */
function generateFilePath(tenantId: string, bucket: BucketName, fileName: string): string {
  const timestamp = Date.now();
  const randomString = Math.random().toString(36).substring(2, 8);
  const safeFileName = fileName
    .toLowerCase()
    .replace(/[^a-z0-9.-]/g, '-')
    .replace(/-+/g, '-');

  return `${tenantId}/${bucket}/${new Date().toISOString().split('T')[0]}/${timestamp}-${randomString}-${safeFileName}`;
}

/**
 * Upload a file to Supabase Storage
 */
export async function uploadFile(
  tenantId: string,
  bucket: BucketName,
  file: File,
  customPath?: string
): Promise<string> {
  await validateFile(file, bucket);

  const supabase = await createServerClient();
  const path = customPath || generateFilePath(tenantId, bucket, file.name);

  const { data, error } = await supabase.storage.from(bucket).upload(path, file, {
    cacheControl: '3600',
    upsert: false,
  });

  if (error) {
    console.error('Upload error:', error);
    throw new ApiError('Failed to upload file', 500, 'UPLOAD_ERROR');
  }

  if (!data) {
    throw new ApiError('Upload failed with no response', 500, 'UPLOAD_ERROR');
  }

  return getFileUrl(tenantId, bucket, data.path);
}

/**
 * Get a file URL (public or signed)
 */
export async function getFileUrl(
  tenantId: string,
  bucket: BucketName,
  path: string,
  expiresIn: number = 3600
): Promise<string> {
  const supabase = await createServerClient();

  // For public buckets, return direct URL
  const { data: publicData } = supabase.storage.from(bucket).getPublicUrl(path);

  if (publicData) {
    return publicData.publicUrl;
  }

  // For private buckets, get signed URL
  const { data, error } = await supabase.storage
    .from(bucket)
    .createSignedUrl(path, expiresIn);

  if (error) {
    console.error('Error getting file URL:', error);
    throw new ApiError('Failed to get file URL', 500, 'GET_URL_ERROR');
  }

  return data?.signedUrl || '';
}

/**
 * Delete a file from Supabase Storage
 */
export async function deleteFile(tenantId: string, bucket: BucketName, path: string): Promise<void> {
  const supabase = await createServerClient();

  const { error } = await supabase.storage.from(bucket).remove([path]);

  if (error) {
    console.error('Delete error:', error);
    throw new ApiError('Failed to delete file', 500, 'DELETE_ERROR');
  }
}

/**
 * List files in a bucket with optional prefix
 */
export async function listFiles(
  tenantId: string,
  bucket: BucketName,
  prefix?: string
): Promise<{ name: string; id: string; updated_at: string }[]> {
  const supabase = await createServerClient();

  const searchPath = prefix || `${tenantId}/`;

  const { data, error } = await supabase.storage.from(bucket).list(searchPath, {
    limit: 100,
    offset: 0,
    sortBy: { column: 'updated_at', order: 'desc' },
  });

  if (error) {
    console.error('List error:', error);
    throw new ApiError('Failed to list files', 500, 'LIST_ERROR');
  }

  return data || [];
}

/**
 * Copy a file within or between buckets
 */
export async function copyFile(
  sourceBucket: BucketName,
  sourcePath: string,
  destinationBucket: BucketName,
  destinationPath: string
): Promise<void> {
  const supabase = await createServerClient();

  // Get the file from source
  const { data: fileData, error: getError } = await supabase.storage
    .from(sourceBucket)
    .download(sourcePath);

  if (getError || !fileData) {
    throw new ApiError('Failed to copy file: source not found', 404, 'COPY_ERROR');
  }

  // Upload to destination
  const { error: uploadError } = await supabase.storage
    .from(destinationBucket)
    .upload(destinationPath, fileData);

  if (uploadError) {
    throw new ApiError('Failed to copy file to destination', 500, 'COPY_ERROR');
  }
}

/**
 * Get file metadata
 */
export async function getFileMetadata(
  bucket: BucketName,
  path: string
): Promise<{ size: number; mimetype: string }> {
  const supabase = await createServerClient();

  // Supabase storage doesn't have a direct info() method without arguments
  // Use list to check if file exists and get basic info
  const { data, error } = await supabase.storage.from(bucket).list(
    path.split('/').slice(0, -1).join('/'),
    { search: path.split('/').pop() }
  );

  if (error) {
    throw new ApiError('Failed to get file metadata', 500, 'METADATA_ERROR');
  }

  const file = data?.[0];
  return {
    size: file?.metadata?.size || 0,
    mimetype: file?.metadata?.mimetype || 'application/octet-stream',
  };
}

/**
 * Create a signed upload URL (for direct browser uploads)
 */
export async function createSignedUploadUrl(
  tenantId: string,
  bucket: BucketName,
  fileName: string,
  expiresIn: number = 3600
): Promise<{ url: string; path: string }> {
  const supabase = await createServerClient();
  const path = generateFilePath(tenantId, bucket, fileName);

  // Note: Supabase doesn't have a native signed upload URL
  // This would need to be implemented using a policy-based approach
  // For now, return the path and client should upload with auth
  return { url: '', path };
}
