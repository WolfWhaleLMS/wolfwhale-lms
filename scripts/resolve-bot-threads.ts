/**
 * WolfWhale LMS — Resolve Stale Bot-Only Review Threads
 *
 * Called by the PR Agent Loop workflow's "resolve-stale-threads" job.
 * Fetches all review threads on a pull request and resolves any thread
 * where every comment was authored by a bot. Threads that contain even
 * one human comment are left untouched.
 *
 * Usage (CI):
 *   npx tsx scripts/resolve-bot-threads.ts
 *
 * Required env vars:
 *   GITHUB_TOKEN         — PAT or Actions GITHUB_TOKEN
 *   PR_NUMBER            — Pull request number (integer)
 *   HEAD_SHA             — Full SHA of the PR head commit (logged for traceability)
 *   GITHUB_REPOSITORY    — owner/repo (e.g. WolfWhaleLMS/wolfwhale-lms)
 */

import { graphql } from '@octokit/graphql'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Logins that are always treated as bots regardless of the `[bot]` suffix. */
const KNOWN_BOTS = new Set([
  'coderabbitai',
  'greptile',
  'github-actions',
  'dependabot',
  'renovate',
])

// ---------------------------------------------------------------------------
// Types
// ---------------------------------------------------------------------------

interface ReviewThreadComment {
  author: {
    login: string
  } | null
}

interface ReviewThread {
  id: string
  isResolved: boolean
  comments: {
    nodes: ReviewThreadComment[]
  }
}

interface ListThreadsResponse {
  repository: {
    pullRequest: {
      reviewThreads: {
        nodes: ReviewThread[]
      }
    }
  }
}

interface ResolveThreadResponse {
  resolveReviewThread: {
    thread: {
      isResolved: boolean
    }
  }
}

// ---------------------------------------------------------------------------
// GraphQL documents
// ---------------------------------------------------------------------------

const LIST_REVIEW_THREADS_QUERY = `
  query($owner: String!, $repo: String!, $pr: Int!) {
    repository(owner: $owner, name: $repo) {
      pullRequest(number: $pr) {
        reviewThreads(first: 100) {
          nodes {
            id
            isResolved
            comments(first: 50) {
              nodes {
                author {
                  login
                }
              }
            }
          }
        }
      }
    }
  }
`

const RESOLVE_THREAD_MUTATION = `
  mutation($threadId: ID!) {
    resolveReviewThread(input: { threadId: $threadId }) {
      thread { isResolved }
    }
  }
`

// ---------------------------------------------------------------------------
// Logging helpers
// ---------------------------------------------------------------------------

function log(message: string): void {
  console.log(`[resolve-threads] ${message}`)
}

function logError(message: string): void {
  console.error(`[resolve-threads] ERROR: ${message}`)
}

// ---------------------------------------------------------------------------
// Bot detection
// ---------------------------------------------------------------------------

/**
 * Returns true when the given login belongs to a bot account.
 * Detection rules (either condition is sufficient):
 *   1. The login ends with `[bot]` (GitHub's convention for app bots).
 *   2. The login is present in the KNOWN_BOTS set.
 */
function isBot(login: string): boolean {
  return login.endsWith('[bot]') || KNOWN_BOTS.has(login.toLowerCase())
}

/**
 * Returns true when every comment in the thread was authored by a bot.
 * A comment with a null author (e.g. deleted account) is treated as a bot
 * to avoid blocking resolution on ghost comments.
 */
function isAllBotThread(thread: ReviewThread): boolean {
  const comments = thread.comments.nodes
  if (comments.length === 0) {
    return true
  }
  return comments.every((comment) => {
    if (comment.author === null) {
      return true
    }
    return isBot(comment.author.login)
  })
}

// ---------------------------------------------------------------------------
// Utility: parse owner/repo from GITHUB_REPOSITORY
// ---------------------------------------------------------------------------

function parseRepository(githubRepository: string): { owner: string; repo: string } {
  const [owner, repo] = githubRepository.split('/')
  if (!owner || !repo) {
    throw new Error(
      `Invalid GITHUB_REPOSITORY format: "${githubRepository}". Expected "owner/repo".`
    )
  }
  return { owner, repo }
}

// ---------------------------------------------------------------------------
// main — Orchestrator
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('[resolve-threads] ================================================')
  console.log('[resolve-threads] WolfWhale LMS — Resolve Bot-Only Review Threads')
  console.log('[resolve-threads] ================================================')

  // -------------------------------------------------------------------------
  // Step 1: Read required environment variables
  // -------------------------------------------------------------------------
  const GITHUB_TOKEN = process.env.GITHUB_TOKEN
  const PR_NUMBER_STR = process.env.PR_NUMBER
  const HEAD_SHA = process.env.HEAD_SHA
  const GITHUB_REPOSITORY = process.env.GITHUB_REPOSITORY

  const missing: string[] = []
  if (!GITHUB_TOKEN) missing.push('GITHUB_TOKEN')
  if (!PR_NUMBER_STR) missing.push('PR_NUMBER')
  if (!HEAD_SHA) missing.push('HEAD_SHA')
  if (!GITHUB_REPOSITORY) missing.push('GITHUB_REPOSITORY')

  if (missing.length > 0) {
    logError(`Missing required environment variables: ${missing.join(', ')}`)
    process.exit(1)
  }

  const prNumber = parseInt(PR_NUMBER_STR!, 10)
  if (isNaN(prNumber) || prNumber <= 0) {
    logError(`PR_NUMBER must be a positive integer. Got: "${PR_NUMBER_STR}"`)
    process.exit(1)
  }

  const headSha = HEAD_SHA!
  const { owner, repo } = parseRepository(GITHUB_REPOSITORY!)

  log(`Repository: ${GITHUB_REPOSITORY}`)
  log(`PR number:  #${prNumber}`)
  log(`Head SHA:   ${headSha}`)

  // -------------------------------------------------------------------------
  // Step 2: Build authenticated GraphQL client
  // -------------------------------------------------------------------------
  const gql = graphql.defaults({
    headers: {
      authorization: `token ${GITHUB_TOKEN}`,
    },
  })

  // -------------------------------------------------------------------------
  // Step 3: Fetch all review threads on the PR
  // -------------------------------------------------------------------------
  log(`Fetching review threads for PR #${prNumber}...`)

  let threads: ReviewThread[]
  try {
    const response = await gql<ListThreadsResponse>(LIST_REVIEW_THREADS_QUERY, {
      owner,
      repo,
      pr: prNumber,
    })
    threads = response.repository.pullRequest.reviewThreads.nodes
    log(`Fetched ${threads.length} review thread(s)`)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    logError(`Failed to fetch review threads: ${message}`)
    process.exit(1)
  }

  // -------------------------------------------------------------------------
  // Step 4: Classify and resolve threads
  // -------------------------------------------------------------------------
  let resolvedCount = 0
  let skippedCount = 0

  for (const thread of threads) {
    if (thread.isResolved) {
      log(`Thread ${thread.id} — already resolved, skipping`)
      continue
    }

    if (!isAllBotThread(thread)) {
      const humanLogins = thread.comments.nodes
        .filter((c) => c.author !== null && !isBot(c.author.login))
        .map((c) => c.author!.login)
      log(
        `Thread ${thread.id} — skipped (contains human comment(s) from: ${humanLogins.join(', ')})`
      )
      skippedCount++
      continue
    }

    // All comments are from bots — resolve the thread
    try {
      const result = await gql<ResolveThreadResponse>(RESOLVE_THREAD_MUTATION, {
        threadId: thread.id,
      })
      const nowResolved = result.resolveReviewThread.thread.isResolved
      log(
        `Thread ${thread.id} — resolved (isResolved: ${nowResolved})`
      )
      resolvedCount++
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      logError(`Failed to resolve thread ${thread.id}: ${message}`)
      // Non-fatal: log and continue to attempt remaining threads
    }
  }

  // -------------------------------------------------------------------------
  // Step 5: Summary
  // -------------------------------------------------------------------------
  console.log('[resolve-threads] ================================================')
  log(`Done. Resolved: ${resolvedCount} thread(s), skipped: ${skippedCount} thread(s) (human comments present)`)
  console.log('[resolve-threads] ================================================')

  process.exit(0)
}

// ---------------------------------------------------------------------------
// Entrypoint
// ---------------------------------------------------------------------------

main().catch((err: unknown) => {
  const message = err instanceof Error ? err.message : String(err)
  logError(`Unhandled fatal error: ${message}`)
  if (err instanceof Error && err.stack) {
    console.error(err.stack)
  }
  process.exit(1)
})
