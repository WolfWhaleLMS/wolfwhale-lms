import { NextRequest, NextResponse } from 'next/server';
import type { CoinTransaction } from '@/types/gamification.types';

// Mock coin data
const mockCoins = {
  balance: 250,
  totalEarned: 1500,
  totalSpent: 1250,
};

// Mock coin transactions
const mockTransactions: CoinTransaction[] = [
  {
    id: 'txn-1',
    studentId: 'student-1',
    amount: 50,
    transactionType: 'earn',
    sourceType: 'xp',
    sourceDescription: 'XP Conversion (500 XP)',
    createdAt: new Date(Date.now() - 1 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-2',
    studentId: 'student-1',
    amount: 25,
    transactionType: 'spend',
    sourceType: 'cosmetic',
    sourceId: 'crown',
    sourceDescription: 'Purchased Golden Crown',
    createdAt: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-3',
    studentId: 'student-1',
    amount: 100,
    transactionType: 'earn',
    sourceType: 'achievement',
    sourceDescription: 'Achievement: Consistency Champion',
    createdAt: new Date(Date.now() - 5 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-4',
    studentId: 'student-1',
    amount: 15,
    transactionType: 'spend',
    sourceType: 'pet_interaction',
    sourceDescription: 'Fed pet (5 coins)',
    createdAt: new Date(Date.now() - 8 * 60 * 60 * 1000).toISOString(),
  },
  {
    id: 'txn-5',
    studentId: 'student-1',
    amount: 75,
    transactionType: 'earn',
    sourceType: 'daily_bonus',
    sourceDescription: 'Daily Login Bonus',
    createdAt: new Date(Date.now() - 1 * 24 * 60 * 60 * 1000).toISOString(),
  },
];

export async function GET(request: NextRequest) {
  try {
    // In production: get actual student ID from session
    const studentId = 'student-1';

    // Mock: fetch from database
    // const balance = await db.studentCoins.findUnique({
    //   where: { studentId },
    // });
    // const transactions = await db.coinTransaction.findMany({
    //   where: { studentId },
    //   orderBy: { createdAt: 'desc' },
    //   take: 50,
    // });

    return NextResponse.json(
      {
        success: true,
        data: {
          balance: mockCoins.balance,
          totalEarned: mockCoins.totalEarned,
          totalSpent: mockCoins.totalSpent,
          transactions: mockTransactions,
        },
      },
      { status: 200 }
    );
  } catch (error) {
    console.error('Error fetching coin data:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'FETCH_ERROR',
          message: 'Failed to fetch coin data',
        },
      },
      { status: 500 }
    );
  }
}

export async function POST(request: NextRequest) {
  try {
    const body = await request.json();
    const { action, itemId, cost } = body;

    // In production: get actual student ID from session
    const studentId = 'student-1';

    if (action === 'spend') {
      if (!itemId || !cost) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'MISSING_PARAMS',
              message: 'Item ID and cost are required',
            },
          },
          { status: 400 }
        );
      }

      // Check if student has enough coins
      if (mockCoins.balance < cost) {
        return NextResponse.json(
          {
            success: false,
            error: {
              code: 'INSUFFICIENT_COINS',
              message: 'Not enough coins for this purchase',
            },
          },
          { status: 400 }
        );
      }

      // In production: process transaction
      // await db.coinTransaction.create({
      //   data: {
      //     studentId,
      //     amount: cost,
      //     transactionType: 'spend',
      //     sourceType: 'cosmetic',
      //     sourceId: itemId,
      //     sourceDescription: `Purchased cosmetic item: ${itemId}`,
      //   },
      // });
      // await db.studentCoins.update({
      //   where: { studentId },
      //   data: {
      //     balance: { decrement: cost },
      //     totalSpent: { increment: cost },
      //   },
      // });
      // await db.petCosmetic.create({
      //   data: {
      //     studentId,
      //     cosmeticId: itemId,
      //     unlockedAt: new Date(),
      //   },
      // });

      return NextResponse.json(
        {
          success: true,
          data: {
            balance: mockCoins.balance - cost,
            transactionId: `txn-${Date.now()}`,
            itemId,
          },
        },
        { status: 200 }
      );
    }

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
  } catch (error) {
    console.error('Error processing coin transaction:', error);
    return NextResponse.json(
      {
        success: false,
        error: {
          code: 'TRANSACTION_ERROR',
          message: 'Failed to process coin transaction',
        },
      },
      { status: 500 }
    );
  }
}
