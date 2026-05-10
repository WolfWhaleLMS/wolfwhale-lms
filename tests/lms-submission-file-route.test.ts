import { NextRequest } from 'next/server'
import { beforeEach, describe, expect, it, vi } from 'vitest'

const mocks = vi.hoisted(() => ({
  createAdminClient: vi.fn(),
  createClient: vi.fn(),
  hasSupabaseAdminEnv: vi.fn(),
}))

vi.mock('@/lib/supabase/admin', () => ({
  createAdminClient: mocks.createAdminClient,
  hasSupabaseAdminEnv: mocks.hasSupabaseAdminEnv,
}))

vi.mock('@/lib/supabase/server', () => ({
  createClient: mocks.createClient,
}))

import { GET } from '@/app/api/lms/submissions/[submissionId]/file/route'

type SubmissionLookupResult = {
  data: Record<string, unknown> | null
  error: { message: string } | null
}

function routeContext(submissionId = 'submission-1') {
  return { params: Promise.resolve({ submissionId }) }
}

function request() {
  return new NextRequest('https://wolfwhale.test/api/lms/submissions/submission-1/file')
}

function createSubmissionQuery(result: SubmissionLookupResult) {
  const single = vi.fn().mockResolvedValue(result)
  const eq = vi.fn().mockReturnValue({ single })
  const select = vi.fn().mockReturnValue({ eq })
  const from = vi.fn().mockReturnValue({ select })

  return { from, select, eq, single }
}

function createStorageClient(result: { data: { signedUrl: string } | null; error: { message: string } | null }) {
  const createSignedUrl = vi.fn().mockResolvedValue(result)
  const from = vi.fn().mockReturnValue({ createSignedUrl })

  return { storage: { from }, from, createSignedUrl }
}

function createSupabaseClient(input: {
  user?: { id: string } | null
  userError?: { message: string } | null
  submission?: Record<string, unknown> | null
  submissionError?: { message: string } | null
}) {
  const query = createSubmissionQuery({
    data: input.submission ?? null,
    error: input.submissionError ?? null,
  })

  return {
    auth: {
      getUser: vi.fn().mockResolvedValue({
        data: { user: 'user' in input ? input.user : { id: 'teacher-1' } },
        error: input.userError ?? null,
      }),
    },
    from: query.from,
    query,
  }
}

describe('submission file route', () => {
  beforeEach(() => {
    vi.clearAllMocks()
    mocks.hasSupabaseAdminEnv.mockReturnValue(false)
  })

  it('requires an authenticated user before looking up a submission file', async () => {
    const supabase = createSupabaseClient({ user: null })
    mocks.createClient.mockResolvedValue(supabase)

    const response = await GET(request(), routeContext())

    expect(response.status).toBe(401)
    await expect(response.json()).resolves.toEqual({ error: 'auth_required' })
    expect(supabase.from).not.toHaveBeenCalled()
  })

  it('fails closed when Supabase RLS does not expose the submission row', async () => {
    const supabase = createSupabaseClient({
      submissionError: { message: 'No rows found' },
    })
    mocks.createClient.mockResolvedValue(supabase)

    const response = await GET(request(), routeContext('private-submission'))

    expect(response.status).toBe(404)
    await expect(response.json()).resolves.toEqual({ error: 'submission_file_not_found' })
    expect(supabase.from).toHaveBeenCalledWith('submissions')
  })

  it('creates a short signed URL only after the scoped submission row is readable', async () => {
    const supabase = createSupabaseClient({
      submission: {
        id: 'submission-1',
        file_path: 'tenant-1/student-1/course-1/assignment-1/work.pdf',
        file_name: 'work.pdf',
      },
    })
    const adminStorage = createStorageClient({
      data: { signedUrl: 'https://storage.wolfwhale.test/signed-work.pdf' },
      error: null,
    })
    mocks.createClient.mockResolvedValue(supabase)
    mocks.hasSupabaseAdminEnv.mockReturnValue(true)
    mocks.createAdminClient.mockReturnValue(adminStorage)

    const response = await GET(request(), routeContext())

    expect(response.status).toBe(302)
    expect(response.headers.get('location')).toBe('https://storage.wolfwhale.test/signed-work.pdf')
    expect(adminStorage.from).toHaveBeenCalledWith('submissions')
    expect(adminStorage.createSignedUrl).toHaveBeenCalledWith(
      'tenant-1/student-1/course-1/assignment-1/work.pdf',
      300,
      { download: 'work.pdf' }
    )
  })

  it('returns a gateway error when storage signing fails', async () => {
    const supabase = createSupabaseClient({
      submission: {
        id: 'submission-1',
        file_path: 'tenant-1/student-1/course-1/assignment-1/work.pdf',
        file_name: 'work.pdf',
      },
    })
    const storage = createStorageClient({
      data: null,
      error: { message: 'signing failed' },
    })
    mocks.createClient.mockResolvedValue({ ...supabase, storage: storage.storage })

    const response = await GET(request(), routeContext())

    expect(response.status).toBe(502)
    await expect(response.json()).resolves.toEqual({ error: 'submission_file_signing_failed' })
  })
})
