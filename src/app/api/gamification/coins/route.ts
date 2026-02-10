import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, apiResponse, apiError } from '@/lib/api';
import type { CoinTransaction } from '@/types/gamification.types';

/**
 * GET /api/gamification/coins
 * Fetch the current student's coin balance and recent transactions
 */
export const GET = withAuth(async (req, opts) => {
  try {
    const supabase = await createClient();

    // Fetch coin balance from student_xp
    const { data: xpRow, error: xpError } = await supabase
      .from('student_xp')
      .select('coins, total_coins_earned, total_coins_spent')
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .single();

    if (xpError && xpError.code !== 'PGRST116') {
      throw xpError;
    }

    // Fetch recent coin transactions
    const { data: txnRows, error: txnError } = await supabase
      .from('coin_transactions')
      .select('id, student_id, amount, transaction_type, source_type, source_id, description, created_at')
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .order('created_at', { ascending: false })
      .limit(50);

    if (txnError) {
      throw txnError;
    }

    // Map DB rows to CoinTransaction type
    const transactions: CoinTransaction[] = (txnRows || []).map((row) => ({
      id: row.id,
      studentId: row.student_id,
      amount: row.amount,
      transactionType: row.transaction_type,
      sourceType: row.source_type,
      sourceId: row.source_id || undefined,
      sourceDescription: row.description || '',
      createdAt: row.created_at,
    }));

    return apiResponse({
      balance: xpRow?.coins || 0,
      totalEarned: xpRow?.total_coins_earned || 0,
      totalSpent: xpRow?.total_coins_spent || 0,
      transactions,
    });
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return apiError('Failed to fetch coin data', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/gamification/coins
 * Spend coins (e.g., purchasing a cosmetic item)
 * Body: { action: 'spend', itemId: string, cost: number }
 */
export const POST = withAuth(async (req, opts) => {
  try {
    const body = await req.json();
    const { action, itemId, cost } = body;

    if (action === 'spend') {
      if (!itemId || !cost) {
        return apiError('Item ID and cost are required', 400, 'MISSING_PARAMS');
      }

      if (cost <= 0) {
        return apiError('Cost must be greater than 0', 400, 'INVALID_COST');
      }

      const supabase = await createClient();

      // Fetch current coin balance
      const { data: xpRow, error: xpError } = await supabase
        .from('student_xp')
        .select('coins, total_coins_spent')
        .eq('tenant_id', opts.tenantId)
        .eq('student_id', opts.userId)
        .single();

      if (xpError) {
        throw xpError;
      }

      if (!xpRow) {
        return apiError('No coin balance found', 404, 'NO_BALANCE');
      }

      // Check if student has enough coins
      if (xpRow.coins < cost) {
        return apiError('Not enough coins for this purchase', 400, 'INSUFFICIENT_COINS');
      }

      // Deduct coins
      const newBalance = xpRow.coins - cost;
      const newTotalSpent = xpRow.total_coins_spent + cost;

      const { error: updateError } = await supabase
        .from('student_xp')
        .update({
          coins: newBalance,
          total_coins_spent: newTotalSpent,
          updated_at: new Date().toISOString(),
        })
        .eq('tenant_id', opts.tenantId)
        .eq('student_id', opts.userId);

      if (updateError) {
        throw updateError;
      }

      // Create coin transaction record
      const { data: txn, error: txnError } = await supabase
        .from('coin_transactions')
        .insert({
          tenant_id: opts.tenantId,
          student_id: opts.userId,
          amount: cost,
          transaction_type: 'spend',
          source_type: 'cosmetic',
          source_id: itemId,
          description: `Purchased cosmetic item: ${itemId}`,
        })
        .select('id')
        .single();

      if (txnError) {
        throw txnError;
      }

      return apiResponse({
        balance: newBalance,
        transactionId: txn?.id,
        itemId,
      });
    }

    return apiError('Invalid action', 400, 'INVALID_ACTION');
  } catch (error) {
    console.error('Error processing coin transaction:', error);
    return apiError('Failed to process coin transaction', 500, 'TRANSACTION_ERROR');
  }
});
