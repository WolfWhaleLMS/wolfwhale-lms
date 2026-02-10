import { NextRequest } from 'next/server';
import { withAuth } from '@/lib/api';
import { apiResponse, apiError } from '@/lib/api';
import { uploadFile, BUCKET_NAMES, type BucketName } from '@/lib/storage';

/**
 * POST /api/upload
 * Handle file upload to Supabase Storage
 */
export const POST = withAuth(async (req, opts) => {
  try {
    const formData = await req.formData();
    const file = formData.get('file') as File;
    const bucket = formData.get('bucket') as BucketName;
    const customPath = formData.get('path') as string | null;

    // Validate inputs
    if (!file) {
      return apiError('File is required', 400, 'VALIDATION_ERROR');
    }

    if (!bucket || !Object.values(BUCKET_NAMES).includes(bucket)) {
      return apiError('Invalid bucket', 400, 'VALIDATION_ERROR');
    }

    // Upload file
    const fileUrl = await uploadFile(opts.tenantId, bucket, file, customPath || undefined);

    return apiResponse({
      url: fileUrl,
      fileName: file.name,
      size: file.size,
      type: file.type,
      bucket,
    });
  } catch (error: any) {
    console.error('Upload error:', error);

    if (error.code === 'VALIDATION_ERROR') {
      return apiError(error.message, 400, error.code);
    }

    return apiError('Failed to upload file', 500, 'UPLOAD_ERROR');
  }
});
