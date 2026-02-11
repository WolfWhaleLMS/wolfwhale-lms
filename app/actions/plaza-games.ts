'use server'

import { headers } from 'next/headers'
import { createClient } from '@/lib/supabase/server'
import { createAdminClient } from '@/lib/supabase/admin'
import { revalidatePath } from 'next/cache'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { TOKEN_DAILY_CAP } from '@/lib/plaza/constants'
import type {
  MiniGame,
  GameSession,
  GameScoreResult,
  PersonalBest,
  GameDifficulty,
  GameMode,
} from '@/lib/plaza/types'

// ---------------------------------------------------------------------------
// Context helper
// ---------------------------------------------------------------------------

async function getContext() {
  const supabase = await createClient()
  const { data: { user } } = await supabase.auth.getUser()
  if (!user) throw new Error('Unauthorized')
  const headersList = await headers()
  const tenantId = headersList.get('x-tenant-id')
  if (!tenantId) throw new Error('No tenant context')
  const admin = createAdminClient()
  return { admin, user, tenantId }
}

// ---------------------------------------------------------------------------
// Helper: check daily token cap
// ---------------------------------------------------------------------------

async function getTokenCapRemaining(
  admin: any,
  tenantId: string,
  userId: string
): Promise<number> {
  const today = new Date().toISOString().split('T')[0]
  const { data: todayTransactions } = await admin
    .from('plaza_token_transactions')
    .select('amount')
    .eq('tenant_id', tenantId)
    .eq('user_id', userId)
    .gt('amount', 0)
    .gte('created_at', `${today}T00:00:00`)
    .lte('created_at', `${today}T23:59:59`)

  const earnedToday = todayTransactions?.reduce(
    (sum: number, t: { amount: number }) => sum + t.amount,
    0
  ) ?? 0

  return Math.max(0, TOKEN_DAILY_CAP - earnedToday)
}

// ---------------------------------------------------------------------------
// Mini Games List
// ---------------------------------------------------------------------------

/** Get all available mini games */
export async function getMiniGames(): Promise<MiniGame[]> {
  const { admin, tenantId } = await getContext()

  const { data, error } = await admin
    .from('plaza_mini_games')
    .select('*')
    .or(`is_global.eq.true,tenant_id.eq.${tenantId}`)
    .eq('is_active', true)
    .order('sort_order', { ascending: true })

  if (error) {
    console.error('[plaza-games] getMiniGames:', error)
    throw new Error('Failed to get mini games')
  }

  return (data ?? []) as MiniGame[]
}

// ---------------------------------------------------------------------------
// Game Sessions
// ---------------------------------------------------------------------------

/** Create a game session (solo or multiplayer lobby) */
export async function createGameSession(
  gameSlug: string,
  mode: GameMode = 'solo',
  difficulty: GameDifficulty = 'medium'
): Promise<GameSession> {
  const rl = await rateLimitAction('createGameSession')
  if (!rl.success) throw new Error(rl.error)

  const { admin, user, tenantId } = await getContext()

  // Look up the game by slug
  const { data: game, error: gameError } = await admin
    .from('plaza_mini_games')
    .select('id, duration_seconds, config')
    .or(`is_global.eq.true,tenant_id.eq.${tenantId}`)
    .eq('slug', gameSlug)
    .eq('is_active', true)
    .single()

  if (gameError || !game) throw new Error(`Game not found: ${gameSlug}`)

  const { data: session, error } = await admin
    .from('plaza_game_sessions')
    .insert({
      tenant_id: tenantId,
      game_id: game.id,
      host_user_id: user.id,
      status: mode === 'solo' ? 'in_progress' : 'waiting',
      mode,
      difficulty,
      round_count: 1,
      current_round: 0,
      game_state: {},
      max_duration_seconds: game.duration_seconds,
      started_at: mode === 'solo' ? new Date().toISOString() : null,
    })
    .select('*')
    .single()

  if (error) {
    console.error('[plaza-games] createGameSession:', error)
    throw new Error('Failed to create game session')
  }

  // For solo mode, also create a score placeholder
  if (mode === 'solo') {
    // No score row yet - will be created on submitGameScore
  }

  return session as GameSession
}

/** Join an existing multiplayer game session */
export async function joinGameSession(sessionId: string): Promise<GameSession> {
  const { admin, user, tenantId } = await getContext()

  // Get the session
  const { data: session, error: fetchError } = await admin
    .from('plaza_game_sessions')
    .select('*, plaza_mini_games:game_id(max_players)')
    .eq('id', sessionId)
    .eq('tenant_id', tenantId)
    .single()

  if (fetchError || !session) throw new Error('Game session not found.')
  if (session.status !== 'waiting') throw new Error('Game session is no longer accepting players.')

  // Check if user already has a score entry (already joined)
  const { data: existingScore } = await admin
    .from('plaza_game_scores')
    .select('id')
    .eq('session_id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (existingScore) {
    // Already joined - just return the session
    return session as GameSession
  }

  // Check player count
  const { count } = await admin
    .from('plaza_game_scores')
    .select('id', { count: 'exact', head: true })
    .eq('session_id', sessionId)

  const maxPlayers = session.plaza_mini_games?.max_players ?? 8
  if ((count ?? 0) >= maxPlayers) {
    throw new Error('Game session is full.')
  }

  // Create a score entry to mark this user as a participant
  await admin.from('plaza_game_scores').insert({
    tenant_id: tenantId,
    session_id: sessionId,
    game_id: session.game_id,
    user_id: user.id,
    score: 0,
  })

  return session as GameSession
}

/** Start a game session (host only, transitions waiting -> in_progress) */
export async function startGameSession(sessionId: string): Promise<void> {
  const { admin, user, tenantId } = await getContext()

  // Verify ownership
  const { data: session, error: fetchError } = await admin
    .from('plaza_game_sessions')
    .select('id, host_user_id, status')
    .eq('id', sessionId)
    .eq('tenant_id', tenantId)
    .single()

  if (fetchError || !session) throw new Error('Game session not found.')
  if (session.host_user_id !== user.id) throw new Error('Only the host can start the game.')
  if (session.status !== 'waiting') throw new Error('Game can only be started from waiting state.')

  const { error } = await admin
    .from('plaza_game_sessions')
    .update({
      status: 'in_progress',
      started_at: new Date().toISOString(),
      current_round: 1,
    })
    .eq('id', sessionId)

  if (error) {
    console.error('[plaza-games] startGameSession:', error)
    throw new Error('Failed to start game session')
  }
}

// ---------------------------------------------------------------------------
// Game Scores
// ---------------------------------------------------------------------------

/** Submit game score at end of game */
export async function submitGameScore(
  sessionId: string,
  score: number,
  accuracy: number,
  timeTaken: number,
  correctAnswers: number,
  totalQuestions: number
): Promise<GameScoreResult> {
  const rl = await rateLimitAction('submitGameScore')
  if (!rl.success) throw new Error(rl.error)

  // Validate input bounds
  score = Math.max(0, Math.min(Math.floor(score), 1000000))
  accuracy = Math.max(0, Math.min(accuracy, 100))
  timeTaken = Math.max(0, Math.min(timeTaken, 7200))
  correctAnswers = Math.max(0, Math.floor(correctAnswers))
  totalQuestions = Math.max(0, Math.floor(totalQuestions))
  if (correctAnswers > totalQuestions) correctAnswers = totalQuestions

  const { admin, user, tenantId } = await getContext()

  // Validate session exists and is in progress
  const { data: session, error: sessionError } = await admin
    .from('plaza_game_sessions')
    .select('id, game_id, status, mode, started_at, max_duration_seconds')
    .eq('id', sessionId)
    .eq('tenant_id', tenantId)
    .single()

  if (sessionError || !session) throw new Error('Game session not found.')
  if (session.status !== 'in_progress') throw new Error('Game session is not in progress.')

  // Check if user already submitted a completed score for this session
  const { data: existingScore } = await admin
    .from('plaza_game_scores')
    .select('id, completed_at')
    .eq('session_id', sessionId)
    .eq('user_id', user.id)
    .single()

  if (existingScore?.completed_at) throw new Error('Score already submitted for this session.')

  // Anti-cheat: validate minimum duration
  if (session.started_at) {
    const startedAt = new Date(session.started_at).getTime()
    const elapsed = (Date.now() - startedAt) / 1000
    // Must have played for at least 5 seconds
    if (elapsed < 5) throw new Error('Invalid game duration.')
  }

  // Get game details for rewards
  const { data: game } = await admin
    .from('plaza_mini_games')
    .select('token_reward_base, token_reward_win, token_reward_perfect, xp_reward, slug, name')
    .eq('id', session.game_id)
    .single()

  if (!game) throw new Error('Game definition not found.')

  // Check for personal best
  const { data: prevBest } = await admin
    .from('plaza_game_scores')
    .select('score')
    .eq('game_id', session.game_id)
    .eq('user_id', user.id)
    .order('score', { ascending: false })
    .limit(1)
    .single()

  const isPersonalBest = !prevBest || score > prevBest.score

  // Check if this is the high score across all players for this game
  const { data: globalBest } = await admin
    .from('plaza_game_scores')
    .select('score')
    .eq('game_id', session.game_id)
    .eq('tenant_id', tenantId)
    .order('score', { ascending: false })
    .limit(1)
    .single()

  const isHighScore = !globalBest || score > globalBest.score

  // Calculate tokens
  let tokensEarned = game.token_reward_base // Participation
  if (accuracy >= 100) tokensEarned = game.token_reward_perfect // Perfect
  if (isPersonalBest) tokensEarned += 10 // Personal best bonus

  // Check daily cap
  const capRemaining = await getTokenCapRemaining(admin, tenantId, user.id)
  tokensEarned = Math.min(tokensEarned, capRemaining)

  const xpEarned = game.xp_reward

  // Upsert score (insert or update if user already has a row for this session)
  const { data: scoreRow, error: scoreError } = await admin
    .from('plaza_game_scores')
    .upsert(
      {
        tenant_id: tenantId,
        session_id: sessionId,
        game_id: session.game_id,
        user_id: user.id,
        score,
        accuracy_percent: accuracy,
        time_taken_seconds: timeTaken,
        correct_answers: correctAnswers,
        total_questions: totalQuestions,
        tokens_earned: tokensEarned,
        xp_earned: xpEarned,
        is_high_score: isHighScore,
        is_personal_best: isPersonalBest,
        completed_at: new Date().toISOString(),
      },
      { onConflict: 'session_id,user_id' }
    )
    .select('id')
    .single()

  if (scoreError) {
    console.error('[plaza-games] submitGameScore:', scoreError)
    throw new Error('Failed to submit score')
  }

  // Award tokens
  let newTokenBalance = 0
  if (tokensEarned > 0) {
    const { data: avatar } = await admin
      .from('plaza_avatars')
      .select('id, token_balance, tokens_earned_total, games_played, games_won')
      .eq('tenant_id', tenantId)
      .eq('user_id', user.id)
      .single()

    if (avatar) {
      newTokenBalance = avatar.token_balance + tokensEarned

      const { data: updateResult } = await admin
        .from('plaza_avatars')
        .update({
          token_balance: newTokenBalance,
          tokens_earned_total: avatar.tokens_earned_total + tokensEarned,
          games_played: avatar.games_played + 1,
        })
        .eq('id', avatar.id)
        .eq('token_balance', avatar.token_balance)
        .select('token_balance')

      if (!updateResult || updateResult.length === 0) {
        // Concurrent modification - re-read and retry once
        const { data: freshAvatar } = await admin
          .from('plaza_avatars')
          .select('id, token_balance, tokens_earned_total, games_played')
          .eq('id', avatar.id)
          .single()
        if (freshAvatar) {
          newTokenBalance = freshAvatar.token_balance + tokensEarned
          await admin
            .from('plaza_avatars')
            .update({
              token_balance: newTokenBalance,
              tokens_earned_total: freshAvatar.tokens_earned_total + tokensEarned,
              games_played: freshAvatar.games_played + 1,
            })
            .eq('id', freshAvatar.id)
        }
      }

      // Record token transaction
      await admin.from('plaza_token_transactions').insert({
        tenant_id: tenantId,
        user_id: user.id,
        amount: tokensEarned,
        balance_after: newTokenBalance,
        transaction_type: isHighScore ? 'earn_high_score' : 'earn_game',
        source_type: 'mini_game',
        source_id: sessionId,
        description: `${game.name}: score ${score}${isPersonalBest ? ' (PB!)' : ''}`,
      })
    }
  }

  // If solo mode, mark session as finished
  if (session.mode === 'solo') {
    await admin
      .from('plaza_game_sessions')
      .update({
        status: 'finished',
        ended_at: new Date().toISOString(),
      })
      .eq('id', sessionId)
  }

  // Calculate rank in session
  const { data: sessionScores } = await admin
    .from('plaza_game_scores')
    .select('user_id, score')
    .eq('session_id', sessionId)
    .order('score', { ascending: false })

  let rankInSession: number | null = null
  if (sessionScores) {
    rankInSession = sessionScores.findIndex((s) => s.user_id === user.id) + 1
  }

  revalidatePath('/student/plaza')
  return {
    score_id: scoreRow.id,
    score,
    accuracy_percent: accuracy,
    rank_in_session: rankInSession,
    tokens_earned: tokensEarned,
    xp_earned: xpEarned,
    is_high_score: isHighScore,
    is_personal_best: isPersonalBest,
    new_token_balance: newTokenBalance,
  }
}

// ---------------------------------------------------------------------------
// High Scores & Personal Bests
// ---------------------------------------------------------------------------

/** Get high scores for a game */
export async function getGameHighScores(
  gameSlug: string,
  limit: number = 25
): Promise<Array<{
  user_id: string
  display_name: string
  score: number
  accuracy_percent: number | null
  completed_at: string
  rank: number
}>> {
  const safeLimit = Math.min(Math.max(1, limit), 100)
  const { admin, tenantId } = await getContext()

  // Get game ID from slug
  const { data: game } = await admin
    .from('plaza_mini_games')
    .select('id')
    .eq('slug', gameSlug)
    .single()

  if (!game) throw new Error(`Game not found: ${gameSlug}`)

  const { data: scores, error } = await admin
    .from('plaza_game_scores')
    .select(`
      user_id,
      score,
      accuracy_percent,
      completed_at,
      plaza_avatars:user_id(display_name)
    `)
    .eq('game_id', game.id)
    .eq('tenant_id', tenantId)
    .order('score', { ascending: false })
    .limit(safeLimit)

  if (error) {
    console.error('[plaza-games] getGameHighScores:', error)
    throw new Error('Failed to get high scores')
  }

  return (scores ?? []).map((row: any, index: number) => ({
    user_id: row.user_id,
    display_name: row.plaza_avatars?.display_name ?? 'Unknown',
    score: row.score,
    accuracy_percent: row.accuracy_percent,
    completed_at: row.completed_at,
    rank: index + 1,
  }))
}

/** Get user's personal bests across all games */
export async function getPersonalBests(): Promise<PersonalBest[]> {
  const { admin, user, tenantId } = await getContext()

  // Get all games
  const { data: games } = await admin
    .from('plaza_mini_games')
    .select('id, slug, name')
    .or(`is_global.eq.true,tenant_id.eq.${tenantId}`)
    .eq('is_active', true)

  if (!games || games.length === 0) return []

  // Get all scores for this user
  const { data: scores } = await admin
    .from('plaza_game_scores')
    .select('game_id, score, accuracy_percent, time_taken_seconds, completed_at')
    .eq('user_id', user.id)
    .eq('tenant_id', tenantId)
    .order('score', { ascending: false })

  if (!scores || scores.length === 0) return []

  // Aggregate per game
  const gameMap = new Map<string, {
    bestScore: number
    bestAccuracy: number | null
    bestTime: number | null
    achievedAt: string
    totalPlays: number
  }>()

  for (const s of scores) {
    const existing = gameMap.get(s.game_id)
    if (!existing) {
      gameMap.set(s.game_id, {
        bestScore: s.score,
        bestAccuracy: s.accuracy_percent,
        bestTime: s.time_taken_seconds,
        achievedAt: s.completed_at,
        totalPlays: 1,
      })
    } else {
      existing.totalPlays++
      if (s.score > existing.bestScore) {
        existing.bestScore = s.score
        existing.bestAccuracy = s.accuracy_percent
        existing.bestTime = s.time_taken_seconds
        existing.achievedAt = s.completed_at
      }
    }
  }

  const gameIdMap = new Map(games.map((g) => [g.id, g]))

  return Array.from(gameMap.entries())
    .filter(([gameId]) => gameIdMap.has(gameId))
    .map(([gameId, stats]) => {
      const game = gameIdMap.get(gameId)!
      return {
        game_id: gameId,
        game_slug: game.slug,
        game_name: game.name,
        best_score: stats.bestScore,
        best_accuracy: stats.bestAccuracy,
        best_time: stats.bestTime,
        achieved_at: stats.achievedAt,
        total_plays: stats.totalPlays,
      }
    })
}
