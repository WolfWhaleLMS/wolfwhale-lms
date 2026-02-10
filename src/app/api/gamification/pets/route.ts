import { NextRequest, NextResponse } from 'next/server';
import type { Pet, PetInteractionResult } from '@/types/gamification.types';

// Mock pet data
const mockPet: Pet = {
  id: 'pet-1',
  studentId: 'student-1',
  name: 'Luna',
  species: 'wolf',
  stage: 'juvenile',
  happiness: 75,
  energy: 60,
  knowledge: 50,
  health: 85,
  totalXP: 500,
  equippedItems: ['crown'],
  unlockedCosmetics: ['crown', 'scarf'],
  createdAt: new Date().toISOString(),
  updatedAt: new Date().toISOString(),
  lastFedAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  lastPlayedAt: new Date(Date.now() - 4 * 60 * 60 * 1000).toISOString(),
  lastStudiedAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  lastRestedAt: new Date(Date.now() - 24 * 60 * 60 * 1000).toISOString(),
};

const STAT_CHANGES: Record<string, { happiness: number; energy: number; knowledge: number; health: number; coins: number }> = {
  feed: { happiness: 15, energy: 0, knowledge: 0, health: 10, coins: -5 },
  play: { happiness: 20, energy: 10, knowledge: 0, health: 0, coins: -3 },
  study: { happiness: 5, energy: 5, knowledge: 5, health: 0, coins: 0 },
  rest: { happiness: 0, energy: 10, knowledge: 0, health: 10, coins: 0 },
};

function clampStat(value: number): number {
  return Math.max(0, Math.min(100, value));
}

export async function GET(request: NextRequest) {
  try {
    // In production: get actual student ID from session
    const studentId = 'student-1';

    // Mock: fetch from database
    // const pet = await db.pet.findUnique({ where: { studentId } });

    return NextResponse.json(
      {
        success: true,
        data: mockPet,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching pet:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch pet data',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { petId, actionType } = body;

    // Validation
    if (!actionType || !['feed', 'play', 'study', 'rest'].includes(actionType)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: 'Invalid pet action type',
          },
        },
        { status: 400 }
      );
    }

    const statChanges = STAT_CHANGES[actionType];
    if (!statChanges) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'UNKNOWN_ACTION',
            message: 'Unknown pet action',
          },
        },
        { status: 400 }
      );
    }

    // Apply stat changes
    const updatedPet: Pet = {
      ...mockPet,
      happiness: clampStat(mockPet.happiness + statChanges.happiness),
      energy: clampStat(mockPet.energy + statChanges.energy),
      knowledge: clampStat(mockPet.knowledge + statChanges.knowledge),
      health: clampStat(mockPet.health + statChanges.health),
      updatedAt: new Date().toISOString(),
    };

    // Update last interaction time
    const now = new Date().toISOString();
    if (actionType === 'feed') {
      updatedPet.lastFedAt = now;
    } else if (actionType === 'play') {
      updatedPet.lastPlayedAt = now;
    } else if (actionType === 'study') {
      updatedPet.lastStudiedAt = now;
    } else if (actionType === 'rest') {
      updatedPet.lastRestedAt = now;
    }

    // In production: update database
    // await db.pet.update({
    //   where: { id: petId },
    //   data: {
    //     happiness: updatedPet.happiness,
    //     energy: updatedPet.energy,
    //     knowledge: updatedPet.knowledge,
    //     health: updatedPet.health,
    //     updatedAt: now,
    //   },
    // });

    const result: PetInteractionResult = {
      pet: updatedPet,
      statChanges: {
        happiness: statChanges.happiness,
        energy: statChanges.energy,
        knowledge: statChanges.knowledge,
        health: statChanges.health,
      },
      coinChange: statChanges.coins,
      message: `${updatedPet.name} is happy!`,
    };

    return NextResponse.json(
      {
        success: true,
        data: result,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error interacting with pet:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'INTERACTION_ERROR',
          message: 'Failed to interact with pet',
        },
      },
      { status: 500 }
    );
  }
}

export async function PATCH(request: NextRequest) {
  try {
    const body = await request.json();
    const { petId, action, itemId } = body;

    if (!action || !['equipItem', 'unequipItem'].includes(action)) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'INVALID_ACTION',
            message: 'Invalid action',
          },
        },
        { status: 400 }
      );
    }

    if (!itemId) {
      return NextResponse.json(
        {
          success: false,
          error: {
            code: 'MISSING_ITEM',
            message: 'Item ID is required',
          },
        },
        { status: 400 }
      );
    }

    const updatedPet = { ...mockPet };

    if (action === 'equipItem') {
      if (!updatedPet.equippedItems.includes(itemId)) {
        updatedPet.equippedItems.push(itemId);
      }
      if (!updatedPet.unlockedCosmetics.includes(itemId)) {
        updatedPet.unlockedCosmetics.push(itemId);
      }
    } else if (action === 'unequipItem') {
      updatedPet.equippedItems = updatedPet.equippedItems.filter((id) => id !== itemId);
    }

    updatedPet.updatedAt = new Date().toISOString();

    // In production: update database
    // await db.pet.update({
    //   where: { id: petId },
    //   data: {
    //     equippedItems: updatedPet.equippedItems,
    //     unlockedCosmetics: updatedPet.unlockedCosmetics,
    //   },
    // });

    return NextResponse.json(
      {
        success: true,
        data: updatedPet,
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error updating pet:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'UPDATE_ERROR',
          message: 'Failed to update pet',
        },
      },
      { status: 500 }
    );
  }
}
