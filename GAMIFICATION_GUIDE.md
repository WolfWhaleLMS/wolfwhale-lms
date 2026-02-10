# Wolf Whale LMS Gamification System

A comprehensive, game-like gamification system for K-12 learning. This system makes learning fun and rewarding through pets, XP, achievements, leaderboards, and study music.

## Architecture Overview

### Core Components

#### Pet System (`src/components/gamification/pet/`)
- **PetDisplay.tsx** - Main pet visualization with animations and interactions
  - Stage-based sizing and animations
  - Happiness/Energy indicators
  - Click interactions with particle effects
  - Species-specific color themes

- **PetStats.tsx** - Four-stat display (Happiness, Energy, Knowledge, Health)
  - Animated progress bars
  - Low-stat warnings with pulse animations
  - Color-coded by stat type

- **PetEvolution.tsx** - Evolution timeline tracker
  - 4-stage progression: Hatchling → Juvenile → Adolescent → Majestic
  - XP-based progression to next stage
  - Milestone celebrations

- **PetInteraction.tsx** - Action buttons for pet interactions
  - Feed (5 coins) → +15 happiness, +10 health
  - Play (3 coins) → +20 happiness, +10 energy
  - Study Together (free) → +5 knowledge, +5 energy
  - Rest (free) → +10 health, +10 energy
  - 30-minute cooldowns (except Study)

- **PetShop.tsx** - Cosmetic store
  - 6+ cosmetic items with rarity tiers (common to legendary)
  - Category filtering (hats, body, back, auras)
  - Purchase with coins, equip on pet
  - Rarity-based pricing and visual effects

- **ClassPetDisplay.tsx** - Class-wide pet tracking
  - Shared class pet progress
  - Top contributor leaderboard
  - Team goal tracker

#### XP System (`src/components/gamification/xp/`)
- **XPBar.tsx** - Level progress display
  - Current level with animated glow
  - Tier name and icon
  - XP progress bar with shimmer effect
  - Compact and full variants

- **XPPopup.tsx** - Floating XP notification
  - "+X XP" floating text
  - Coin amount if earned
  - Particle effects (sparkles)
  - Auto-dismisses after 2 seconds

- **LevelUpModal.tsx** - Level celebration overlay
  - Full-screen confetti animation
  - Level up animation counter
  - Tier change celebration
  - Rewards display
  - Pet reaction animation

- **XPHistory.tsx** - XP transaction history
  - Recent XP earnings with source
  - Color-coded by source type
  - Date/time stamps
  - Scrollable list in glass card

#### Achievement System (`src/components/gamification/achievements/`)
- **AchievementBadge.tsx** - Individual achievement display
  - Rarity-based border colors and glows
  - Locked/Earned states
  - Hover tooltips with details
  - Size variants (sm, lg)

- **AchievementGrid.tsx** - Achievement gallery
  - Category tabs (Academic, Consistency, Participation, etc.)
  - Search/filter functionality
  - Earned achievements first
  - Progress statistics

- **AchievementUnlockModal.tsx** - Unlock celebration
  - Achievement icon with animation
  - Rarity badge
  - Rewards earned (XP + coins)
  - Share option

- **AchievementShowcase.tsx** - Profile display
  - Select 5 favorite achievements
  - Featured on student profile
  - Customization mode

#### Leaderboard (`src/components/gamification/leaderboard/`)
- **Leaderboard.tsx** - Full leaderboard component
  - Scope: Class | Grade | School
  - Timeframe: Week | Month | All Time
  - Top 3 podium display with medals
  - Full ranked list
  - Privacy toggle for 6-12 grade
  - K-5 special "Everyone is a star!" mode
  - Current user highlighting

#### Study Music (`src/components/gamification/study-music/`)
- **MusicPlayer.tsx** - Floating music player
  - 6 track categories (Lo-fi, Ocean, Forest, Classical, Ambient)
  - Compact and expanded modes
  - Play/pause, skip, volume controls
  - Visual track selector
  - Persistent across navigation

- **MusicVisualizer.tsx** - Audio visualizer animation
  - 5-7 animated bars
  - CSS-based animation (no audio analysis)
  - Responds to play/pause state

## Hooks (`src/hooks/gamification/`)

### useSound()
```typescript
const { play, stop, toggleSound, setVolume, isEnabled } = useSound();

play('xpEarn', 0.8);  // Play with custom volume
toggleSound();         // Toggle sound on/off
setVolume(0.5);        // Set master volume (0-1)
```

### useXP()
```typescript
const {
  studentXP,
  currentLevel,
  currentTier,
  coins,
  xpToNextLevel,
  isLevelingUp,
  awardXP,
} = useXP({
  onLevelUp: (data) => console.log('Leveled up!'),
  onXPEarned: (amount) => console.log(`+${amount} XP`),
});

await awardXP(100, 'assignment', 'assign-123', 'Completed Math Assignment');
```

### usePet()
```typescript
const {
  pet,
  loading,
  feedPet,
  playWithPet,
  studyWithPet,
  restPet,
  equipItem,
  unequipItem,
  isOnCooldown,
  getCooldownRemaining,
} = usePet({
  onInteraction: (result) => console.log(result),
});

await feedPet();  // Returns PetInteractionResult
await equipItem('crown-item-id');
```

### useAchievements()
```typescript
const {
  achievements,
  earnedAchievements,
  isEarned,
  checkAchievement,
  getByCategory,
  getEarned,
  getLocked,
} = useAchievements({
  onUnlock: (data) => console.log('Achievement unlocked!'),
});

const unlocked = await checkAchievement('lessonsCompleted', 10);
const academic = getByCategory('Academic');
```

## API Routes (`src/app/api/gamification/`)

### POST `/api/gamification/xp`
Award XP to student.
```json
{
  "amount": 100,
  "sourceType": "assignment",
  "sourceId": "assign-123",
  "description": "Completed Math Quiz"
}
```
Returns: `StudentXP` with level up data if applicable

### GET/POST `/api/gamification/pets`
GET: Fetch student's pet
POST: Pet interaction (feed, play, study, rest)
```json
{
  "petId": "pet-1",
  "actionType": "feed"
}
```

### PATCH `/api/gamification/pets`
Equip/unequip cosmetics
```json
{
  "petId": "pet-1",
  "action": "equipItem",
  "itemId": "crown"
}
```

### GET/POST `/api/gamification/achievements`
GET: Fetch all achievements with earned status
POST: Check and unlock achievement

### GET `/api/gamification/leaderboard`
Query params:
- `scope`: class | grade | school
- `timeframe`: week | month | all
- `classId`: optional class filter

### GET/POST `/api/gamification/coins`
GET: Fetch coin balance and transaction history
POST: Spend coins on cosmetics

## Types (`src/types/gamification.types.ts`)

Key types:
- `Pet` - Student's companion
- `PetCosmetic` - Cosmetic items
- `Achievement` - Achievement definition
- `StudentAchievement` - Earned achievement
- `XPTier` - Leveling tier
- `LeaderboardEntry` - Leaderboard ranking

## Integration Guide

### Adding to a Page

```typescript
'use client';

import { PetDisplay } from '@/components/gamification/pet/PetDisplay';
import { XPBar } from '@/components/gamification/xp/XPBar';
import { usePet } from '@/hooks/gamification/usePet';
import { useXP } from '@/hooks/gamification/useXP';

export default function StudentProfile() {
  const { pet, feedPet } = usePet();
  const { currentLevel, currentTier, totalXP, xpToNextLevel } = useXP();

  return (
    <div className="space-y-6">
      {pet && <PetDisplay pet={pet} />}
      <XPBar
        currentXP={totalXP % 1000}
        xpNeeded={1000}
        level={currentLevel}
        tier={currentTier}
        totalXP={totalXP}
      />
    </div>
  );
}
```

### Awarding XP

```typescript
import { useXP } from '@/hooks/gamification/useXP';

function AssignmentSubmit() {
  const { awardXP } = useXP();

  const handleSubmit = async () => {
    await awardXP(100, 'assignment', 'assign-123', 'Math Assignment');
    // Shows XP popup, checks for level up, etc.
  };

  return <button onClick={handleSubmit}>Submit</button>;
}
```

### Adding Music Player to Layout

```typescript
import { MusicPlayer } from '@/components/gamification/study-music/MusicPlayer';

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

## Customization

### Adjust XP Thresholds
Edit `/src/app/api/gamification/xp/route.ts`:
```typescript
const XP_THRESHOLDS: Record<number, number> = {
  1: 0,
  2: 100,
  3: 250,
  // ...
};
```

### Add New Achievements
Edit `/src/app/api/gamification/achievements/route.ts` and add to `MOCK_ACHIEVEMENTS`

### Customize Pet Species Colors
Edit `PetDisplay.tsx` `SPECIES_COLORS` constant

### Adjust Interaction Costs
Edit `PetInteraction.tsx` `INTERACTIONS` array

### Add New Study Music Tracks
Edit `MusicPlayer.tsx` `TRACKS` array

## Sound Management

The system uses Howler.js for audio with a singleton SoundManager pattern.

Sounds available:
- `click` - UI click sound
- `hover` - Hover effect
- `success` - Positive action
- `error` - Error/failure
- `achievement` - Achievement unlock
- `levelUp` - Level up celebration
- `petHappy` - Pet positive reaction
- `petSad` - Pet negative reaction
- `xpEarn` - XP earned
- `coinEarn` - Coins earned
- `submit` - Form submission
- `navigation` - Page navigation

MVP: Sounds are mocked with commented URLs. Replace URLs in `/src/lib/sounds/index.ts` for production.

## Performance Optimizations

1. **Animations**: Using Framer Motion with optimized transitions
2. **Lazy Loading**: Components support React.lazy()
3. **Memoization**: All hooks use useCallback for stability
4. **Debouncing**: Sound plays are debounced
5. **Mock Data**: Uses mock data for MVP - replace with API calls

## Accessibility Features

- ARIA labels on progress bars
- Color contrast meeting WCAG standards
- Keyboard navigation support
- Touch-friendly interaction sizes
- Screen reader friendly stat displays

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers (iOS Safari, Chrome Mobile)

## Future Enhancements

1. **Real Audio Playback** - Implement actual audio for music player
2. **Multiplayer Pet Features** - Battle/trade pets
3. **Seasonal Events** - Limited-time achievements and cosmetics
4. **Analytics Dashboard** - Teacher view of student engagement
5. **Customization** - Student-created pet names, settings
6. **Social Features** - Achievement sharing, pet trading
7. **Mobile App** - Native mobile experience
8. **WebGL Pets** - 3D pet models instead of emoji

## Testing

Mock data is provided for all components. To use real data:

1. Replace API route implementations with database queries
2. Update hooks to use actual API endpoints
3. Implement authentication checks
4. Add error handling and validation

## Support

For issues or questions, refer to the component JSDoc comments or check individual hook implementations.
