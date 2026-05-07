import { NextRequest, NextResponse } from 'next/server'
import { LmsMutationError } from '@/lib/lms/mutations'

export function lmsRedirect(request: NextRequest, pathname: string, params: Record<string, string>) {
  const destination = new URL(pathname, request.url)

  for (const [key, value] of Object.entries(params)) {
    destination.searchParams.set(key, value)
  }

  return NextResponse.redirect(destination, { status: 303 })
}

export function lmsMutationErrorCode(error: unknown) {
  if (error instanceof LmsMutationError) {
    return error.code
  }

  return 'lms_mutation_failed'
}
