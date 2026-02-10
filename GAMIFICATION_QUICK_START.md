# Gamification System - Quick Start Guide

## Installation (Already Done!)

All files have been created. Just start using them!

## Quick Integration Examples

### 1. Add Pet to Student Dashboard

```typescript
'use client';

import { PetDisplay, PetStats, PetInteraction } from '@/components/gamification';
import { usePet } from '@/hooks/gamification';

export default function PetSection() {
  const { pet, loading } = usePet();

  if (loading) return <div>Loading pet...</div>;
  if (!pet) return <div>No pet found</div>;

  return (
    <div className="space-y-6">
      <PetDisplay pet={pet} interactive />
      <PetStats pet={pet} />
      <PetInteraction pet={pet} />
    </div>
  );
}
```

### 2. Display XP Progress Bar

```typescript
'use client';

import { XPBar } from '@/components/gamification';
import { useXP } from '@/hooks/gamification';

export default function XPProgress() {
  const { currentLevel, currentTier, totalXP, xpToNextLevel } = useXP();

  return (
    <XPBar
      level={currentLevel}
      tier={currentTier}
      currentXP={totalXP % 1000}
      xpNeeded={1000}
      totalXP={totalXP}
      variant="full"
    />
  );
}
```

### 3. Show Achievements

```typescript
'use client';

import { AchievementGrid } from '@/components/gamification';
import { useAchievements } from '@/hooks/gamification';

export default function AchievementsPage() {
  const { achievements, earnedAchievements } = useAchievements();

  const earnedIds = new Set(
    Array.from(earnedAchievements.values()).map((a) => a.achievementId)
  );

  return (
    <AchievementGrid
      achievements={achievements}
      earnedAchievementIds={earnedIds}
    />
  );
}
```

### 4. Award XP to Student

```typescript
'use client';

import { useXP } from '@/hooks/gamification';

export default function AssignmentSubmit() {
  const { awardXP } = useXP({
    onLevelUp: (data) => {
      console.log(`Leveled up to ${data.newLevel}!`);
    },
  });

  const handleSubmit = async () => {
    try {
      const result = await awardXP(
        50, // XP amount
        'assignment', // source type
        'assign-123', // source ID
        'Completed Math Quiz' // description
      );

      if (result?.leveledUp) {
        // Level up modal will be shown automatically
        console.log('Level up!', result.levelUpData);
      }
    } catch (error) {
      console.error('Failed to award XP:', error);
    }
  };

  return (
    <button onClick={handleSubmit} className="bg-blue-500 text-white px-4 py-2">
      Submit Assignment
    </button>
  );
}
```

### 5. Leaderboard on Class Page

```typescript
'use client';

import { Leaderboard } from '@/components/gamification';
import { useState, useEffect } from 'react';

export default function ClassLeaderboard() {
  const [leaderboard, setLeaderboard] = useState(null);
  const [scope, setScope] = useState<'class' | 'grade' | 'school'>('class');
  const [timeframe, setTimeframe] = useState<'week' | 'month' | 'all'>('month');

  useEffect(() => {
    // Fetch leaderboard data
    fetch(
      `/api/gamification/leaderboard?scope=${scope}&timeframe=${timeframe}`
    )
      .then((r) => r.json())
      .then((data) => setLeaderboard(data.data));
  }, [scope, timeframe]);

  if (!leaderboard) return <div>Loading...</div>;

  return (
    <Leaderboard
      {...leaderboard}
      scope={scope}
      timeframe={timeframe}
      onScopeChange={setScope}
      onTimeframeChange={setTimeframe}
      gradeLevel="6"
    />
  );
}
```

### 6. Pet Shop

```typescript
'use client';

import { PetShop } from '@/components/gamification';
import { useXP } from '@/hooks/gamification';

export default function CosmticsStore() {
  const { coins } = useXP();
  const [unlockedCosmetics, setUnlockedCosmetics] = useState<string[]>([
    'crown',
  ]);
  const [equippedItems, setEquippedItems] = useState<string[]>(['crown']);

  const handlePurchase = (item: any) => {
    setUnlockedCosmetics((prev) => [...prev, item.id]);
  };

  return (
    <PetShop
      coins={coins}
      unlockedCosmetics={unlockedCosmetics}
      equippedItems={equippedItems}
      onPurchase={handlePurchase}
      onEquip={(itemId) => setEquippedItems([itemId])}
    />
  );
}
```

### 7. Add Music Player to Layout

```typescript
// app/layout.tsx
'use client';

import { MusicPlayer } from '@/components/gamification';

export default function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return (
    <html>
      <body>
        {children}
        <MusicPlayer />
      </body>
    </html>
  );
}
```

## Full Page Example

```typescript
// app/(dashboard)/student/profile/page.tsx
'use client';

import {
  PetDisplay,
  PetStats,
  PetEvolution,
  XPBar,
  AchievementShowcase,
  Leaderboard,
} from '@/components/gamification';
import { usePet, useXP, useAchievements } from '@/hooks/gamification';
import { useState, useEffect } from 'react';

export default function StudentProfilePage() {
  const { pet } = usePet();
  const { currentLevel, currentTier, totalXP, xpToNextLevel, coins } = useXP();
  const { achievements, earnedAchievements } = useAchievements();
  const [leaderboard, setLeaderboard] = useState(null);

  useEffect(() => {
    fetch('/api/gamification/leaderboard?scope=class')
      .then((r) => r.json())
      .then((data) => setLeaderboard(data.data));
  }, []);

  const earnedIds = new Set(
    Array.from(earnedAchievements.values()).map((a) => a.achievementId)
  );

  return (
    <div className="space-y-8 p-6">
      {/* Header */}
      <div>
        <h1 className="text-4xl font-bold">Student Profile</h1>
        <p className="text-gray-600 mt-2">
          Level {currentLevel} {currentTier}
        </p>
      </div>

      {/* XP Progress */}
      <section className="bg-white rounded-lg p-6 shadow">
        <h2 className="text-2xl font-bold mb-4">Progress</h2>
        <XPBar
          level={currentLevel}
          tier={currentTier}
          currentXP={totalXP % 1000}
          xpNeeded={1000}
          totalXP={totalXP}
          variant="full"
        />
      </section>

      {/* Pet */}
      {pet && (
        <section className="space-y-6">
          <h2 className="text-2xl font-bold">My Pet</h2>
          <div className="grid md:grid-cols-2 gap-6">
            <div className="bg-gradient-to-b from-slate-900 to-slate-800 rounded-lg p-6">
              <PetDisplay pet={pet} />
            </div>
            <div className="space-y-6">
              <PetStats pet={pet} />
              <PetEvolution pet={pet} />
            </div>
          </div>
        </section>
      )}

      {/* Achievements */}
      <section>
        <h2 className="text-2xl font-bold mb-4">Featured Achievements</h2>
        <AchievementShowcase
          achievements={achievements}
          earnedAchievementIds={earnedIds}
          displayedIds={Array.from(earnedIds).slice(0, 5)}
        />
      </section>

      {/* Leaderboard */}
      {leaderboard && (
        <section>
          <h2 className="text-2xl font-bold mb-4">Class Rankings</h2>
          <Leaderboard {...leaderboard} gradeLevel="7" />
        </section>
      )}

      {/* Coins Balance */}
      <section className="bg-amber-50 border-2 border-amber-200 rounded-lg p-6">
        <p className="text-gray-600">Coins Balance</p>
        <p className="text-3xl font-bold text-amber-600">{coins} 🪙</p>
      </section>
    </div>
  );
}
```

## Common Tasks

### Award XP on Assignment Submission

```typescript
const { awardXP } = useXP();

const handleAssignmentSubmit = async (assignmentId: string) => {
  await awardXP(100, 'assignment', assignmentId, 'Assignment Completed');
};
```

### Check Achievement on Lesson Completion

```typescript
const { checkAchievement } = useAchievements({
  onUnlock: (data) => {
    showAchievementUnlockModal(data);
  },
});

const handleLessonComplete = async () => {
  await checkAchievement('lessonsCompleted', lessonsCompleted + 1);
};
```

### Play Sound Effect

```typescript
const { play } = useSound();

// Play built-in sound
play('success');

// Play with custom volume
play('click', 0.5);

// Toggle sound
const { toggleSound } = useSound();
toggleSound();
```

### Get Pet Stats

```typescript
const { pet } = usePet();

console.log(pet?.happiness); // 0-100
console.log(pet?.energy); // 0-100
console.log(pet?.knowledge); // 0-100
console.log(pet?.health); // 0-100
```

### Interact with Pet

```typescript
const { feedPet, playWithPet, studyWithPet, restPet } = usePet({
  onInteraction: (result) => {
    console.log(`${result.pet.name}'s happiness: ${result.pet.happiness}`);
  },
});

// Feed costs 5 coins, increases happiness
await feedPet();

// Play costs 3 coins, increases happiness and energy
await playWithPet();

// Study is free, increases knowledge
await studyWithPet();

// Rest is free, once per day, increases health and energy
await restPet();
```

## API Endpoints Reference

```
POST /api/gamification/xp
  Award XP to student
  Body: { amount, sourceType, sourceId, description }
  Returns: StudentXP with levelUpData if applicable

GET /api/gamification/pets
  Get student's pet data
  Returns: Pet object

POST /api/gamification/pets
  Pet interaction
  Body: { petId, actionType }
  Returns: PetInteractionResult

PATCH /api/gamification/pets
  Equip/unequip cosmetics
  Body: { petId, action, itemId }
  Returns: Updated Pet

GET /api/gamification/achievements
  Get all achievements with earned status
  Returns: { achievements, earned }

POST /api/gamification/achievements
  Check and unlock achievement
  Body: { achievementType, value }
  Returns: AchievementUnlockData or 204 No Content

GET /api/gamification/leaderboard
  Get leaderboard data
  Query: scope, timeframe, classId
  Returns: LeaderboardData

GET /api/gamification/coins
  Get coin balance and history
  Returns: { balance, totalEarned, totalSpent, transactions }

POST /api/gamification/coins
  Spend coins on cosmetics
  Body: { action, itemId, cost }
  Returns: { balance, transactionId }
```

## Customization

### Change Pet Colors

Edit `src/components/gamification/pet/PetDisplay.tsx`:

```typescript
const SPECIES_COLORS: Record<string, { bg: string; glow: string }> = {
  wolf: {
    bg: 'bg-gradient-to-b from-slate-900 via-slate-700 to-slate-900',
    glow: 'shadow-xl shadow-slate-500/50',
  },
  // ...
};
```

### Add New Cosmetics

Edit `src/components/gamification/pet/PetShop.tsx`:

```typescript
const MOCK_COSMETICS: PetCosmetic[] = [
  {
    id: 'your-new-item',
    name: 'Item Name',
    category: 'hats',
    rarity: 'epic',
    cost: 300,
    iconUrl: '✨',
    description: 'Item description',
  },
  // ...
];
```

### Adjust XP Thresholds

Edit `src/app/api/gamification/xp/route.ts`:

```typescript
const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100, // Change this value
  3: 250,
  // ...
};
```

## Styling

All components use Tailwind CSS with:
- Glass morphism (`backdrop-blur-sm`, `bg-white/10`)
- Gradients for premium feel
- Smooth animations via Framer Motion
- Dark mode by default
- Responsive design

## Production Checklist

- [ ] Replace mock data with real database calls
- [ ] Add actual audio files to `/public/sounds/`
- [ ] Add music tracks to `/public/music/`
- [ ] Implement proper authentication checks
- [ ] Add error logging and monitoring
- [ ] Test all animations on target devices
- [ ] Add sound file compression
- [ ] Set up database migrations
- [ ] Configure CDN for audio/images
- [ ] Test accessibility features
- [ ] Load test leaderboard queries

## Next Steps

1. Start using components in your pages
2. Replace mock API responses with real database
3. Add actual sound/music files
4. Implement database models
5. Test across different browsers
6. Gather student feedback
7. Iterate based on engagement metrics

Enjoy the gamification system! 🎮✨
