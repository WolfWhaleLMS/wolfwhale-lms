/**
 * WolfWhale LMS — Deterministic PR Policy Gate
 *
 * Reads the machine-readable contract from .pr-policy.json and enforces:
 *   1. Risk tier classification based on changed files
 *   2. Required checks per tier
 *   3. Docs drift rules (code-to-docs coupling)
 *   4. Code review agent completion (for critical/high tiers)
 *   5. No actionable findings from the review agent on the current head SHA
 *
 * Usage (CI):
 *   npx tsx scripts/pr-policy-gate.ts
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
import { minimatch } from 'minimatch'

// ---------------------------------------------------------------------------
// Types mirroring .pr-policy.json
// ---------------------------------------------------------------------------

type RiskTier = 'critical' | 'high' | 'medium' | 'low'

interface MergePolicyEntry {
  requiredChecks: string[]
  requiredHumanReviewers: number
  evidenceRequired: string[]
  autoMerge: boolean
}

interface DocsDriftRule {
  trigger: string[]
  requireUpdated: string[]
  message: string
}

interface ReviewAgent {
  provider: string
  checkRunName: string
  timeoutMinutes: number
  rerunMarker: string
  rerunCommand: string
}

interface ShaPolicy {
  requireCurrentHead: boolean
  staleAfterPushEvents: string[]
  maxRerunsPerSha: number
}

interface PRPolicy {
  version: string
  description: string
  riskTierRules: Record<RiskTier, string[]>
  mergePolicy: Record<RiskTier, MergePolicyEntry>
  docsDriftRules: DocsDriftRule[]
  reviewAgent: ReviewAgent
  shaPolicy: ShaPolicy
}

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

const TIER_PRIORITY: Record<RiskTier, number> = {
  critical: 4,
  high: 3,
  medium: 2,
  low: 1,
}

const TIERS_REQUIRING_CODE_REVIEW: RiskTier[] = ['critical', 'high', 'medium']

const POLICY_PATH = path.resolve(__dirname, '../.pr-policy.json')
const POLL_INTERVAL_MS = 15_000 // 15 seconds between polls

// ---------------------------------------------------------------------------
// Logging helpers
// ---------------------------------------------------------------------------

function log(message: string): void {
  console.log(`[policy-gate] ${message}`)
}

function logSection(title: string): void {
  console.log(`[policy-gate] ---- ${title} ----`)
}

function logError(message: string): void {
  console.error(`[policy-gate] ERROR: ${message}`)
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
// 1. classifyRiskTier
// ---------------------------------------------------------------------------

/**
 * Matches each changed file against riskTierRules using minimatch.
 * Returns the highest priority tier found across all files and all patterns.
 * Tier priority order: critical > high > medium > low
 */
function classifyRiskTier(
  changedFiles: string[],
  riskTierRules: Record<RiskTier, string[]>
): RiskTier {
  let highestTier: RiskTier = 'low'
  let highestPriority = TIER_PRIORITY['low']

  const tiers = Object.keys(riskTierRules) as RiskTier[]

  for (const file of changedFiles) {
    for (const tier of tiers) {
      const patterns = riskTierRules[tier]
      const matched = patterns.some((pattern) =>
        minimatch(file, pattern, { matchBase: false, dot: true })
      )
      if (matched && TIER_PRIORITY[tier] > highestPriority) {
        highestPriority = TIER_PRIORITY[tier]
        highestTier = tier
        // Short-circuit: nothing can beat 'critical'
        if (highestTier === 'critical') {
          return highestTier
        }
      }
    }
  }

  return highestTier
}

// ---------------------------------------------------------------------------
// 2. computeRequiredChecks
// ---------------------------------------------------------------------------

/**
 * Returns the list of required CI check names for the given risk tier,
 * read directly from the policy contract.
 */
function computeRequiredChecks(
  riskTier: RiskTier,
  mergePolicy: Record<RiskTier, MergePolicyEntry>
): string[] {
  return mergePolicy[riskTier].requiredChecks
}

// ---------------------------------------------------------------------------
// 3. assertDocsDriftRules
// ---------------------------------------------------------------------------

/**
 * For each docsDriftRule, if any trigger pattern matches a changed file,
 * at least one of the requireUpdated paths must also appear in changedFiles.
 * Throws an Error with the rule's message when the constraint is violated.
 */
function assertDocsDriftRules(
  changedFiles: string[],
  docsDriftRules: DocsDriftRule[]
): void {
  logSection('Docs Drift Enforcement')

  for (const rule of docsDriftRules) {
    const triggered = rule.trigger.some((pattern) =>
      changedFiles.some((file) =>
        minimatch(file, pattern, { matchBase: false, dot: true })
      )
    )

    if (!triggered) {
      log(`Docs drift rule not triggered (no matching trigger files): "${rule.message}"`)
      continue
    }

    log(`Docs drift rule TRIGGERED for: "${rule.message}"`)
    log(`  Trigger patterns: ${rule.trigger.join(', ')}`)
    log(`  Required updated: ${rule.requireUpdated.join(', ')}`)

    const satisfied = rule.requireUpdated.some((requiredFile) =>
      changedFiles.some((file) =>
        minimatch(file, requiredFile, { matchBase: false, dot: true })
      )
    )

    if (!satisfied) {
      throw new Error(
        `Docs drift violation: ${rule.message}\n` +
          `  At least one of these files must be updated: ${rule.requireUpdated.join(', ')}\n` +
          `  Changed files in this PR: ${changedFiles.join(', ')}`
      )
    }

    log(`Docs drift rule satisfied — required file found in changeset.`)
  }
}

// ---------------------------------------------------------------------------
// 4. waitForCodeReviewCompletion
// ---------------------------------------------------------------------------

/**
 * Polls GitHub check runs for the specified headSha until the review agent's
 * check run (identified by reviewAgent.checkRunName) reaches a completed status,
 * or until timeoutMinutes elapses.
 *
 * Returns the final conclusion of the check run, or null on timeout.
 */
async function waitForCodeReviewCompletion(
  octokit: Octokit,
  owner: string,
  repo: string,
  headSha: string,
  checkRunName: string,
  timeoutMinutes: number
): Promise<string | null> {
  logSection('Waiting for Code Review Agent')
  log(`Check run name: "${checkRunName}"`)
  log(`Head SHA: ${headSha}`)
  log(`Timeout: ${timeoutMinutes} minutes`)

  const timeoutMs = timeoutMinutes * 60 * 1_000
  const deadline = Date.now() + timeoutMs

  while (Date.now() < deadline) {
    const { data } = await octokit.checks.listForRef({
      owner,
      repo,
      ref: headSha,
      check_name: checkRunName,
      per_page: 10,
    })

    const runs = data.check_runs ?? []

    if (runs.length === 0) {
      log(`No check run named "${checkRunName}" found yet — waiting ${POLL_INTERVAL_MS / 1000}s...`)
    } else {
      // Use the most recently created run (last in list tends to be newest)
      const latestRun = runs.reduce((a, b) =>
        new Date(a.started_at ?? 0) > new Date(b.started_at ?? 0) ? a : b
      )

      log(
        `Check run status: ${latestRun.status} / conclusion: ${latestRun.conclusion ?? 'pending'} (id: ${latestRun.id})`
      )

      if (latestRun.status === 'completed') {
        log(`Code review agent completed with conclusion: ${latestRun.conclusion}`)
        return latestRun.conclusion ?? null
      }

      log(`Still in progress — waiting ${POLL_INTERVAL_MS / 1000}s...`)
    }

    await sleep(POLL_INTERVAL_MS)
  }

  log(`Timed out after ${timeoutMinutes} minutes waiting for "${checkRunName}"`)
  return null
}

// ---------------------------------------------------------------------------
// 5. assertNoActionableFindingsForHead
// ---------------------------------------------------------------------------

/**
 * Verifies that the review agent's check run on headSha concluded with 'success'.
 * Any other conclusion (failure, neutral, cancelled, timed_out, action_required)
 * is treated as "actionable findings present" and causes a gate failure.
 *
 * Throws an Error describing the failure if the gate does not pass.
 */
async function assertNoActionableFindingsForHead(
  octokit: Octokit,
  owner: string,
  repo: string,
  headSha: string,
  checkRunName: string
): Promise<void> {
  logSection('Asserting No Actionable Findings')
  log(`Checking "${checkRunName}" conclusion for SHA ${headSha}`)

  const { data } = await octokit.checks.listForRef({
    owner,
    repo,
    ref: headSha,
    check_name: checkRunName,
    per_page: 10,
  })

  const runs = data.check_runs ?? []

  if (runs.length === 0) {
    throw new Error(
      `No check run named "${checkRunName}" found for SHA ${headSha}. ` +
        `The review agent may not have run yet, or the check name may be misconfigured in .pr-policy.json.`
    )
  }

  const latestRun = runs.reduce((a, b) =>
    new Date(a.started_at ?? 0) > new Date(b.started_at ?? 0) ? a : b
  )

  if (latestRun.status !== 'completed') {
    throw new Error(
      `Review agent check run "${checkRunName}" is not yet completed (status: ${latestRun.status}). ` +
        `Run waitForCodeReviewCompletion before asserting findings.`
    )
  }

  const conclusion = latestRun.conclusion
  if (conclusion !== 'success') {
    throw new Error(
      `Code review agent reported actionable findings for SHA ${headSha}.\n` +
        `  Check run: "${checkRunName}"\n` +
        `  Conclusion: ${conclusion}\n` +
        `  Details URL: ${latestRun.details_url ?? latestRun.html_url}\n` +
        `Resolve all findings before merging, then re-trigger the review.`
    )
  }

  log(`Review agent check run passed with conclusion: success`)
}

// ---------------------------------------------------------------------------
// 6. postDeduplicatedRerunComment
// ---------------------------------------------------------------------------

/**
 * Posts a rerun comment on the PR, but only if no existing comment already
 * contains both the rerunMarker AND "sha:<headSha>" (deduplicated per SHA).
 *
 * Comment format:
 *   <!-- pr-agent-loop-rerun -->
 *   @coderabbitai review
 *   sha:<headSha>
 */
async function postDeduplicatedRerunComment(
  octokit: Octokit,
  owner: string,
  repo: string,
  headSha: string,
  prNumber: number,
  rerunMarker: string,
  rerunCommand: string
): Promise<void> {
  logSection('Deduplication Check for Rerun Comment')
  log(`PR #${prNumber} — SHA ${headSha}`)

  const shaTag = `sha:${headSha}`

  // Fetch existing issue comments (PR comments live on the issue endpoint)
  const existingComments = await octokit.paginate(
    octokit.issues.listComments,
    {
      owner,
      repo,
      issue_number: prNumber,
      per_page: 100,
    }
  )

  const alreadyPosted = existingComments.some((comment) => {
    const body = comment.body ?? ''
    return body.includes(rerunMarker) && body.includes(shaTag)
  })

  if (alreadyPosted) {
    log(
      `Rerun comment for SHA ${headSha} already exists — skipping duplicate post.`
    )
    return
  }

  const commentBody = [
    rerunMarker,
    rerunCommand,
    shaTag,
  ].join('\n')

  await octokit.issues.createComment({
    owner,
    repo,
    issue_number: prNumber,
    body: commentBody,
  })

  log(`Rerun comment posted for SHA ${headSha}`)
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
// 7. main — Orchestrator
// ---------------------------------------------------------------------------

async function main(): Promise<void> {
  console.log('[policy-gate] ================================================')
  console.log('[policy-gate] WolfWhale LMS — PR Policy Gate')
  console.log('[policy-gate] ================================================')

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
    logError('Set these variables before running the policy gate.')
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
  // Step 2: Load .pr-policy.json
  // -------------------------------------------------------------------------
  logSection('Loading Policy Contract')

  if (!fs.existsSync(POLICY_PATH)) {
    logError(`Policy file not found: ${POLICY_PATH}`)
    logError('Create .pr-policy.json at the repository root to use the policy gate.')
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
    process.exit(1)
  }

  // -------------------------------------------------------------------------
  // Step 3: Initialize Octokit
  // -------------------------------------------------------------------------
  const octokit = new Octokit({ auth: GITHUB_TOKEN })

  // -------------------------------------------------------------------------
  // Step 4: Get changed files from GitHub API
  // -------------------------------------------------------------------------
  logSection('Fetching Changed Files')

  let changedFiles: string[]
  try {
    const files = await octokit.paginate(octokit.pulls.listFiles, {
      owner,
      repo,
      pull_number: prNumber,
      per_page: 100,
    })
    changedFiles = files.map((f) => f.filename)
    log(`Found ${changedFiles.length} changed file(s)`)
    for (const file of changedFiles) {
      log(`  ${file}`)
    }
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    logError(`Failed to fetch changed files from GitHub API: ${message}`)
    setOutput('gate_passed', 'false')
    process.exit(1)
  }

  // -------------------------------------------------------------------------
  // Step 5: Classify risk tier
  // -------------------------------------------------------------------------
  logSection('Risk Tier Classification')

  const riskTier = classifyRiskTier(changedFiles, policy.riskTierRules)
  log(`Risk tier determined: ${riskTier.toUpperCase()}`)

  // -------------------------------------------------------------------------
  // Step 6: Compute required checks
  // -------------------------------------------------------------------------
  const requiredChecks = computeRequiredChecks(riskTier, policy.mergePolicy)
  log(`Required checks for "${riskTier}" tier: ${requiredChecks.join(', ')}`)

  // -------------------------------------------------------------------------
  // Step 7: Write GitHub Actions outputs for risk tier and required checks
  // -------------------------------------------------------------------------
  const needsCodeReview = TIERS_REQUIRING_CODE_REVIEW.includes(riskTier)

  setOutput('risk_tier', riskTier)
  setOutput('required_checks', requiredChecks.join(','))
  setOutput('needs_review_agent', needsCodeReview ? 'true' : 'false')

  // -------------------------------------------------------------------------
  // Step 8: Enforce docs drift rules
  // -------------------------------------------------------------------------
  try {
    assertDocsDriftRules(changedFiles, policy.docsDriftRules)
    log('All docs drift rules satisfied.')
  } catch (err: unknown) {
    const message = err instanceof Error ? err.message : String(err)
    logError(message)
    setOutput('gate_passed', 'false')
    process.exit(1)
  }

  // -------------------------------------------------------------------------
  // Step 9: Code review agent gate (only for tiers that require it)
  // -------------------------------------------------------------------------
  if (!needsCodeReview) {
    log(
      `Risk tier "${riskTier}" does not require code review agent — skipping review gate.`
    )
  } else {
    logSection('Code Review Agent Gate')
    log(
      `Risk tier "${riskTier}" requires code review agent (provider: ${policy.reviewAgent.provider})`
    )

    // Post a rerun comment to trigger the review agent for this head SHA
    try {
      await postDeduplicatedRerunComment(
        octokit,
        owner,
        repo,
        headSha,
        prNumber,
        policy.reviewAgent.rerunMarker,
        policy.reviewAgent.rerunCommand
      )
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      // Non-fatal: log and continue — the review agent may have been triggered
      // by other means (e.g. webhook on push)
      log(`Warning: could not post rerun comment: ${message}`)
    }

    // Wait for the review agent's check run to complete
    const conclusion = await waitForCodeReviewCompletion(
      octokit,
      owner,
      repo,
      headSha,
      policy.reviewAgent.checkRunName,
      policy.reviewAgent.timeoutMinutes
    )

    if (conclusion === null) {
      logError(
        `Code review agent timed out after ${policy.reviewAgent.timeoutMinutes} minutes. ` +
          `Check run "${policy.reviewAgent.checkRunName}" never completed for SHA ${headSha}.`
      )
      setOutput('gate_passed', 'false')
      process.exit(1)
    }

    // Assert that the review completed with no actionable findings
    try {
      await assertNoActionableFindingsForHead(
        octokit,
        owner,
        repo,
        headSha,
        policy.reviewAgent.checkRunName
      )
    } catch (err: unknown) {
      const message = err instanceof Error ? err.message : String(err)
      logError(message)
      setOutput('gate_passed', 'false')
      process.exit(1)
    }
  }

  // -------------------------------------------------------------------------
  // Step 10: All gates passed
  // -------------------------------------------------------------------------
  console.log('[policy-gate] ================================================')
  log(`GATE PASSED`)
  log(`  Risk tier:       ${riskTier}`)
  log(`  Required checks: ${requiredChecks.join(', ')}`)
  log(`  Docs drift:      OK`)
  log(`  Review agent:    ${needsCodeReview ? 'OK' : 'not required'}`)
  console.log('[policy-gate] ================================================')

  setOutput('gate_passed', 'true')
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
