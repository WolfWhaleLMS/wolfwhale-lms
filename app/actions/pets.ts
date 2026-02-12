'use server'

import { revalidatePath } from 'next/cache'
import { createAdminClient } from '@/lib/supabase/admin'
import { rateLimitAction } from '@/lib/rate-limit-action'
import { getActionContext } from '@/lib/actions/context'

// ---------------------------------------------------------------------------
// Constants
// ---------------------------------------------------------------------------

/** Max number of hatched pixel pets a student can own */
const MAX_PETS = 7

/** Creature type names (index 0 unused; 1-7 map to creature types) */
export const CREATURE_NAMES = [
  '',        // 0 — unused
  'Rex',     // 1
  'Spike',   // 2
  'Blaze',   // 3
  'Bubbles', // 4
  'Finn',    // 5
  'Luna',    // 6
  'Storm',   // 7
] as const

export type EggSource = 'xp_milestone' | 'achievement' | 'login_streak'

// ---------------------------------------------------------------------------
// Read — Eggs
// ---------------------------------------------------------------------------

/** Get all pending (unhatched) eggs for the current student */
export async function getMyEggs() {
  const { supabase, user, tenantId } = await getActionContext()

  const { data, error } = await supabase
    .from('pixel_eggs')
    .select('*')
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('hatched', false)
    .order('hatches_at', { ascending: true })

  if (error) {
    console.error('[pets] getMyEggs:', error)
    return []
  }

  return data ?? []
}

// ---------------------------------------------------------------------------
// Read — Pets
// ---------------------------------------------------------------------------

/** Get all hatched pixel pets for the current student (max 7) */
export async function getMyPets() {
  const { supabase, user, tenantId } = await getActionContext()

  const { data, error } = await supabase
    .from('pixel_pets')
    .select('*')
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)
    .order('hatched_at', { ascending: true })
    .limit(MAX_PETS)

  if (error) {
    console.error('[pets] getMyPets:', error)
    return []
  }

  return data ?? []
}

// ---------------------------------------------------------------------------
// Hatch
// ---------------------------------------------------------------------------

/** Hatch an egg that has completed its 24-hour timer */
export async function hatchEgg(eggId: string) {
  const rl = await rateLimitAction('hatchEgg')
  if (!rl.success) return { success: false, error: rl.error }

  const { supabase, user, tenantId } = await getActionContext()

  // Fetch the egg — must belong to this user, be unhatched, and exist
  const { data: egg, error: eggError } = await supabase
    .from('pixel_eggs')
    .select('*')
    .eq('id', eggId)
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)
    .eq('hatched', false)
    .single()

  if (eggError || !egg) {
    return { success: false, error: 'Egg not found or already hatched.' }
  }

  // Ensure the 24-hour timer has elapsed
  if (new Date(egg.hatches_at) > new Date()) {
    return { success: false, error: 'This egg is not ready to hatch yet.' }
  }

  // Enforce the 7-pet cap
  const { count } = await supabase
    .from('pixel_pets')
    .select('*', { count: 'exact', head: true })
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)

  if ((count ?? 0) >= MAX_PETS) {
    return { success: false, error: `You can have at most ${MAX_PETS} pixel pets.` }
  }

  // Create the pet with a randomised walk speed (12-28 seconds per screen crossing)
  const walkSpeed = Math.round((12 + Math.random() * 16) * 10) / 10

  const admin = createAdminClient()

  const { error: petError } = await admin
    .from('pixel_pets')
    .insert({
      tenant_id: tenantId,
      student_id: user.id,
      creature_type: egg.creature_type,
      name: CREATURE_NAMES[egg.creature_type as number] ?? null,
      walk_speed: walkSpeed,
      hatched_from: eggId,
    })

  if (petError) {
    console.error('[pets] hatchEgg insert pet:', petError)
    return { success: false, error: 'Failed to hatch egg. Please try again.' }
  }

  // Mark the egg as hatched
  const { error: updateError } = await admin
    .from('pixel_eggs')
    .update({ hatched: true })
    .eq('id', eggId)

  if (updateError) {
    console.error('[pets] hatchEgg update egg:', updateError)
    // Pet was already created — non-critical; egg just won't disappear from the list
  }

  revalidatePath('/student/dashboard')
  return { success: true, creatureType: egg.creature_type }
}

// ---------------------------------------------------------------------------
// Grant Egg (called from XP / achievement / streak systems)
// ---------------------------------------------------------------------------

/**
 * Grant a random egg to a student. This is called server-side from other
 * systems (XP milestones, achievement unlocks, login streak rewards) and
 * uses the admin client to bypass RLS.
 */
export async function grantEgg(
  userId: string,
  tenantId: string,
  source: EggSource,
) {
  const admin = createAdminClient()

  // Pick a random creature type 1-7
  const creatureType = Math.floor(Math.random() * 7) + 1

  const { error } = await admin
    .from('pixel_eggs')
    .insert({
      tenant_id: tenantId,
      student_id: userId,
      creature_type: creatureType,
      source,
      hatches_at: new Date(Date.now() + 24 * 60 * 60 * 1000).toISOString(),
    })

  if (error) {
    console.error('[pets] grantEgg:', error)
    return { success: false, error: error.message }
  }

  return { success: true, creatureType }
}

// ---------------------------------------------------------------------------
// Rename
// ---------------------------------------------------------------------------

/** Rename a hatched pixel pet (max 20 characters) */
export async function renamePet(petId: string, name: string) {
  const rl = await rateLimitAction('renamePet')
  if (!rl.success) return { success: false, error: rl.error }

  const { supabase, user, tenantId } = await getActionContext()

  const safeName = name.trim().slice(0, 20)
  if (!safeName) {
    return { success: false, error: 'Name cannot be empty.' }
  }

  const { error } = await supabase
    .from('pixel_pets')
    .update({ name: safeName })
    .eq('id', petId)
    .eq('student_id', user.id)
    .eq('tenant_id', tenantId)

  if (error) {
    console.error('[pets] renamePet:', error)
    return { success: false, error: 'Failed to rename pet.' }
  }

  revalidatePath('/student/dashboard')
  return { success: true }
}
