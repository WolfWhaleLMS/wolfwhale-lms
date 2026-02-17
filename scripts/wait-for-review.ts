/**
 * WolfWhale LMS — Wait-for-Review
 *
 * Called by the PR Agent Loop workflow's "wait-for-review" job.
 * Polls the GitHub Checks API for the review agent's check run on HEAD_SHA
 * and sets the `review_clean` output once the run completes (or times out).
 *
 * Usage (CI):
 *   npx tsx scripts/wait-for-review.ts
 *
 * Required env vars:
 *   GITHUB_TOKEN         — PAT or Actions GITHUB_TOKEN
 *   PR_NUMBER            — Pull request number (integer)
 *   HEAD_SHA             — Full SHA of the PR head commit
 *   GITHUB_REPOSITORY    — owner/repo (e.g. WolfWhaleLMS/wolfwhale-lms)
 *   GITHUB_OUTPUT        — Path to GitHub Actions output file (set automatically in CI)
 */

import * as fs from 'fs'
import * as path from 'path'
import { Octokit } from '@octokit/rest'

// ---------------------------------------------------------------------------
// Types mirroring the reviewAgent section of .pr-policy.json
// ---------------------------------------------------------------------------

interface ReviewAgent {
  provider: string
  checkRunName: string
  timeoutMinutes: number
  rerunMarker: string
  rerunCommand: string
}

interface PRPolicy {
  version: string
  reviewAgent: ReviewAgent
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const POLICY_PATH = path.resolve(__dirname, '../.pr-policy.json')
const POLL_INTERVAL_MS = 15_000 // 15 seconds between polls
const DEFAULT_TIMEOUT_MINUTES = 20

// ---------------------------------------------------------------------------
// Logging helpers
// ---------------------------------------------------------------------------

function log(message: string): void {
  console.log(`[wait-for-review] ${message}`)
}

function logSection(title: string): void {
  console.log(`[wait-for-review] ---- ${title} ----`)
}

function logError(message: string): void {
  console.error(`[wait-for-review] ERROR: ${message}`)
}

// ---------------------------------------------------------------------------
// GitHub Actions output helper
// ---------------------------------------------------------------------------

function setOutput(key: string, value: string): void {
  const githubOutput = process.env.GITHUB_OUTPUT
  if (githubOutput) {
    fs.appendFileSync(githubOutput, `${key}=${value}\n`, 'utf-8')
    log(`Output set: ${key}=${value}`)
  } else {
    // Fallback for local testing / non-Actions environments
    log(`[local] Output: ${key}=${value}`)
  }
}

// ---------------------------------------------------------------------------
// Utility: sleep
// ---------------------------------------------------------------------------

function sleep(ms: number): Promise<void> {
  return new Promise((resolve) => setTimeout(resolve, ms))
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
// Core: pollForCheckRunConclusion
// ---------------------------------------------------------------------------

/**
 * Polls GitHub check runs for the specified headSha until the review agent's
 * check run (identified by checkRunName) reaches a completed status, or until
 * timeoutMinutes elapses.
 *
 * Returns an object with the final conclusion and the details/html URL, or
 * null on timeout.
 */
async function pollForCheckRunConclusion(
  octokit: Octokit,
  owner: string,
  repo: string,
  headSha: string,
  checkRunName: string,
  timeoutMinutes: number
): Promise<{ conclusion: string; findingsUrl: string } | null> {
  logSection('Polling for Review Agent Check Run')
  log(`Check run name: "${checkRunName}"`)
  log(`Head SHA:       ${headSha}`)
  log(`Timeout:        ${timeoutMinutes} minutes`)
  log(`Poll interval:  ${POLL_INTERVAL_MS / 1000} seconds`)

  const timeoutMs = timeoutMinutes * 60 * 1_000
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const remainingSecs = Math.max(0, Math.round((deadline - Date.now()) / 1_000))
    log(`Querying check runs... (${remainingSecs}s remaining before timeout)`)

    const { data } = await octokit.checks.listForRef({
      owner,
      repo,
      ref: headSha,
      check_name: checkRunName,
      per_page: 10,
    })

    const runs = data.check_runs ?? []

    if (runs.length === 0) {
      log(
        `No check run named "${checkRunName}" found yet — waiting ${POLL_INTERVAL_MS / 1000}s...`
      )
    } else {
      // Select the most recently started run to handle reruns correctly.
      const latestRun = runs.reduce((a, b) =>
        new Date(a.started_at ?? 0) > new Date(b.started_at ?? 0) ? a : b
      )

      log(
        `Check run id=${latestRun.id} status="${latestRun.status}" ` +
          `conclusion="${latestRun.conclusion ?? 'pending'}"`
      )

      if (latestRun.status === 'completed') {
        const conclusion = latestRun.conclusion ?? 'unknown'
        const findingsUrl = latestRun.details_url ?? latestRun.html_url ?? ''
        log(`Check run completed — conclusion: ${conclusion}`)
        log(`Findings URL: ${findingsUrl}`)
        return { conclusion, findingsUrl }
      }

      log(`Status is "${latestRun.status}" — waiting ${POLL_INTERVAL_MS / 1000}s...`)
    }

    await sleep(POLL_INTERVAL_MS)
  }

  log(`Timed out after ${timeoutMinutes} minutes waiting for "${checkRunName}"`)
  return null
}

// ---------------------------------------------------------------------------
// main — Orchestrator
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('[wait-for-review] ================================================')
  console.log('[wait-for-review] WolfWhale LMS — Wait-for-Review')
  console.log('[wait-for-review] ================================================')

  // -------------------------------------------------------------------------
  // Step 1: Read required environment variables
  // -------------------------------------------------------------------------
  logSection('Reading Environment')

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
    logError('Set these variables before running wait-for-review.')
    setOutput('review_clean', 'false')
    process.exit(1)
  }

  const prNumber = parseInt(PR_NUMBER_STR!, 10)
  if (isNaN(prNumber) || prNumber <= 0) {
    logError(`PR_NUMBER must be a positive integer. Got: "${PR_NUMBER_STR}"`)
    setOutput('review_clean', 'false')
    process.exit(1)
  }

  const headSha = HEAD_SHA!
  const { owner, repo } = parseRepository(GITHUB_REPOSITORY!)

  log(`Repository: ${GITHUB_REPOSITORY}`)
  log(`PR number:  #${prNumber}`)
  log(`Head SHA:   ${headSha}`)

  // -------------------------------------------------------------------------
  // Step 2: Load .pr-policy.json and extract reviewAgent config
  // -------------------------------------------------------------------------
  logSection('Loading Policy Contract')

  if (!fs.existsSync(POLICY_PATH)) {
    logError(`Policy file not found: ${POLICY_PATH}`)
    logError('Create .pr-policy.json at the repository root.')
    setOutput('review_clean', 'false')
    process.exit(1)
  }

  let policy: PRPolicy
  try {
    const raw = fs.readFileSync(POLICY_PATH, 'utf-8')
    policy = JSON.parse(raw) as PRPolicy
    log(`Loaded .pr-policy.json (version: ${policy.version})`)
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    logError(`Failed to parse .pr-policy.json: ${message}`)
    setOutput('review_clean', 'false')
    process.exit(1)
  }

  const reviewAgent = policy.reviewAgent
  if (!reviewAgent) {
    logError('.pr-policy.json is missing the "reviewAgent" section.')
    setOutput('review_clean', 'false')
    process.exit(1)
  }

  const { checkRunName, rerunMarker, rerunCommand } = reviewAgent
  const timeoutMinutes = reviewAgent.timeoutMinutes ?? DEFAULT_TIMEOUT_MINUTES

  log(`Review agent provider:  ${reviewAgent.provider}`)
  log(`Check run name:         "${checkRunName}"`)
  log(`Timeout:                ${timeoutMinutes} minutes`)
  log(`Rerun marker:           "${rerunMarker}"`)
  log(`Rerun command:          "${rerunCommand}"`)

  // -------------------------------------------------------------------------
  // Step 3: Initialize Octokit
  // -------------------------------------------------------------------------
  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  // -------------------------------------------------------------------------
  // Step 4: Poll for the review agent check run
  // -------------------------------------------------------------------------
  let result: { conclusion: string; findingsUrl: string } | null

  try {
    result = await pollForCheckRunConclusion(
      octokit,
      owner,
      repo,
      headSha,
      checkRunName,
      timeoutMinutes
    )
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    logError(`GitHub API error while polling check runs: ${message}`)
    setOutput('review_clean', 'false')
    process.exit(1)
  }

  // -------------------------------------------------------------------------
  // Step 5: Evaluate the result and set outputs
  // -------------------------------------------------------------------------
  logSection('Evaluating Result')

  if (result === null) {
    logError(
      `Timed out after ${timeoutMinutes} minutes — ` +
        `check run "${checkRunName}" never completed for SHA ${headSha}.`
    )
    setOutput('review_clean', 'false')
    process.exit(1)
  }

  const { conclusion, findingsUrl } = result

  if (conclusion === 'success') {
    log(`Review agent concluded with "success" — no actionable findings.`)
    setOutput('review_clean', 'true')

    console.log('[wait-for-review] ================================================')
    log('REVIEW CLEAN: true')
    log(`Check run:  "${checkRunName}"`)
    log(`Conclusion: success`)
    console.log('[wait-for-review] ================================================')

    process.exit(0)
  } else {
    logError(
      `Review agent concluded with "${conclusion}" — actionable findings are present.`
    )
    logError(`Findings URL: ${findingsUrl}`)
    logError(
      `Resolve all findings for SHA ${headSha}, then re-trigger the review ` +
        `(rerun command: "${rerunCommand}").`
    )

    setOutput('review_clean', 'false')

    console.log('[wait-for-review] ================================================')
    log('REVIEW CLEAN: false')
    log(`Check run:  "${checkRunName}"`)
    log(`Conclusion: ${conclusion}`)
    log(`Details:    ${findingsUrl}`)
    console.log('[wait-for-review] ================================================')

    process.exit(1)
  }
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
  setOutput('review_clean', 'false')
  process.exit(1)
})
