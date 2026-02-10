import { NextRequest } from 'next/server';
import { createClient } from '@/lib/supabase/server';
import { withAuth, apiResponse, apiError } from '@/lib/api';
import type { Pet, PetInteractionResult } from '@/types/gamification.types';

// Stat changes for pet interactions
const STAT_CHANGES: Record<string, { happiness: number; energy: number; knowledge: number; health: number; coins: number }> = {
  feed: { happiness: 15, energy: 0, knowledge: 0, health: 10, coins: -5 },
  play: { happiness: 20, energy: 10, knowledge: 0, health: 0, coins: -3 },
  study: { happiness: 5, energy: 5, knowledge: 5, health: 0, coins: 0 },
  rest: { happiness: 0, energy: 10, knowledge: 0, health: 10, coins: 0 },
};

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

/**
 * Map a DB row from student_pets to the Pet type expected by the frontend
 */
function mapDbRowToPet(row: any): Pet {
  return {
    id: row.id,
    studentId: row.student_id,
    name: row.name,
    species: row.species,
    stage: row.stage,
    happiness: row.happiness,
    energy: row.energy,
    knowledge: row.knowledge,
    health: row.health,
    totalXP: row.total_xp,
    equippedItems: row.equipped_items || [],
    unlockedCosmetics: row.unlocked_cosmetics || [],
    createdAt: row.created_at,
    updatedAt: row.updated_at,
    lastFedAt: row.last_fed_at,
    lastPlayedAt: row.last_played_at,
    lastStudiedAt: row.last_studied_at,
    lastRestedAt: row.last_rested_at,
  };
}

/**
 * GET /api/gamification/pets
 * Fetch the current student's pet
 */
export const GET = withAuth(async (req, opts) => {
  try {
    const supabase = await createClient();

    const { data: petRow, error } = await supabase
      .from('student_pets')
      .select('*')
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .single();

    if (error && error.code !== 'PGRST116') {
      throw error;
    }

    // If no pet exists, create a default one
    if (!petRow) {
      const { data: newPet, error: createError } = await supabase
        .from('student_pets')
        .insert({
          tenant_id: opts.tenantId,
          student_id: opts.userId,
          name: 'Buddy',
          species: 'wolf',
          stage: 'hatchling',
          happiness: 50,
          energy: 50,
          knowledge: 0,
          health: 100,
          total_xp: 0,
          equipped_items: [],
          unlocked_cosmetics: [],
        })
        .select('*')
        .single();

      if (createError) {
        throw createError;
      }

      return apiResponse(mapDbRowToPet(newPet));
    }

    return apiResponse(mapDbRowToPet(petRow));
  } catch (error) {
    console.error('Error fetching pet:', error);
    return apiError('Failed to fetch pet data', 500, 'FETCH_ERROR');
  }
});

/**
 * POST /api/gamification/pets
 * Interact with the student's pet (feed, play, study, rest)
 * Body: { petId?: string, actionType: 'feed' | 'play' | 'study' | 'rest' }
 */
export const POST = withAuth(async (req, opts) => {
  try {
    const body = await req.json();
    const { actionType } = body;

    // Validation
    if (!actionType || !['feed', 'play', 'study', 'rest'].includes(actionType)) {
      return apiError('Invalid pet action type', 400, 'INVALID_ACTION');
    }

    const statChanges = STAT_CHANGES[actionType];
    if (!statChanges) {
      return apiError('Unknown pet action', 400, 'UNKNOWN_ACTION');
    }

    const supabase = await createClient();

    // Fetch the current pet
    const { data: petRow, error: fetchError } = await supabase
      .from('student_pets')
      .select('*')
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!petRow) {
      return apiError('Pet not found. Create a pet first.', 404, 'PET_NOT_FOUND');
    }

    // Calculate new stats
    const newHappiness = clampStat(petRow.happiness + statChanges.happiness);
    const newEnergy = clampStat(petRow.energy + statChanges.energy);
    const newKnowledge = clampStat(petRow.knowledge + statChanges.knowledge);
    const newHealth = clampStat(petRow.health + statChanges.health);
    const now = new Date().toISOString();

    // Build update object
    const updateData: Record<string, any> = {
      happiness: newHappiness,
      energy: newEnergy,
      knowledge: newKnowledge,
      health: newHealth,
      updated_at: now,
    };

    // Update the appropriate last interaction timestamp
    if (actionType === 'feed') updateData.last_fed_at = now;
    else if (actionType === 'play') updateData.last_played_at = now;
    else if (actionType === 'study') updateData.last_studied_at = now;
    else if (actionType === 'rest') updateData.last_rested_at = now;

    // Update the pet in the database
    const { data: updatedRow, error: updateError } = await supabase
      .from('student_pets')
      .update(updateData)
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    // Handle coin cost for the interaction
    const coinChange = statChanges.coins;
    if (coinChange !== 0) {
      // Update student_xp coins balance
      const { data: xpRow } = await supabase
        .from('student_xp')
        .select('coins, total_coins_spent')
        .eq('tenant_id', opts.tenantId)
        .eq('student_id', opts.userId)
        .single();

      if (xpRow) {
        const newCoins = Math.max(0, xpRow.coins + coinChange); // coinChange is negative for spending
        const spentAmount = Math.abs(coinChange);

        await supabase
          .from('student_xp')
          .update({
            coins: newCoins,
            total_coins_spent: xpRow.total_coins_spent + spentAmount,
            updated_at: now,
          })
          .eq('tenant_id', opts.tenantId)
          .eq('student_id', opts.userId);

        // Create coin transaction record
        await supabase.from('coin_transactions').insert({
          tenant_id: opts.tenantId,
          student_id: opts.userId,
          amount: spentAmount,
          transaction_type: 'spend',
          source_type: 'pet_interaction',
          description: `Pet interaction: ${actionType} (${spentAmount} coins)`,
        });
      }
    }

    const updatedPet = mapDbRowToPet(updatedRow);

    const result: PetInteractionResult = {
      pet: updatedPet,
      statChanges: {
        happiness: statChanges.happiness,
        energy: statChanges.energy,
        knowledge: statChanges.knowledge,
        health: statChanges.health,
      },
      coinChange,
      message: `${updatedPet.name} is happy!`,
    };

    return apiResponse(result);
  } catch (error) {
    console.error('Error interacting with pet:', error);
    return apiError('Failed to interact with pet', 500, 'INTERACTION_ERROR');
  }
});

/**
 * PATCH /api/gamification/pets
 * Equip or unequip cosmetic items on the pet
 * Body: { action: 'equipItem' | 'unequipItem', itemId: string }
 */
export const PATCH = withAuth(async (req, opts) => {
  try {
    const body = await req.json();
    const { action, itemId } = body;

    if (!action || !['equipItem', 'unequipItem'].includes(action)) {
      return apiError('Invalid action', 400, 'INVALID_ACTION');
    }

    if (!itemId) {
      return apiError('Item ID is required', 400, 'MISSING_ITEM');
    }

    const supabase = await createClient();

    // Fetch current pet
    const { data: petRow, error: fetchError } = await supabase
      .from('student_pets')
      .select('*')
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .single();

    if (fetchError) {
      throw fetchError;
    }

    if (!petRow) {
      return apiError('Pet not found', 404, 'PET_NOT_FOUND');
    }

    const equippedItems: string[] = petRow.equipped_items || [];
    const unlockedCosmetics: string[] = petRow.unlocked_cosmetics || [];

    if (action === 'equipItem') {
      if (!equippedItems.includes(itemId)) {
        equippedItems.push(itemId);
      }
      if (!unlockedCosmetics.includes(itemId)) {
        unlockedCosmetics.push(itemId);
      }
    } else if (action === 'unequipItem') {
      const idx = equippedItems.indexOf(itemId);
      if (idx !== -1) {
        equippedItems.splice(idx, 1);
      }
    }

    const now = new Date().toISOString();

    const { data: updatedRow, error: updateError } = await supabase
      .from('student_pets')
      .update({
        equipped_items: equippedItems,
        unlocked_cosmetics: unlockedCosmetics,
        updated_at: now,
      })
      .eq('tenant_id', opts.tenantId)
      .eq('student_id', opts.userId)
      .select('*')
      .single();

    if (updateError) {
      throw updateError;
    }

    return apiResponse(mapDbRowToPet(updatedRow));
  } catch (error) {
    console.error('Error updating pet:', error);
    return apiError('Failed to update pet', 500, 'UPDATE_ERROR');
  }
});
