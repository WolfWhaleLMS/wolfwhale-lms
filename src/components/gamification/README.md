# Gamification Components

Complete gamification system for Wolf Whale LMS with pets, XP, achievements, leaderboards, and study music.

## Quick Navigation

### Pet System
- **[PetDisplay](./pet/PetDisplay.tsx)** - Main pet visualization
- **[PetStats](./pet/PetStats.tsx)** - Happiness/Energy/Knowledge/Health bars
- **[PetEvolution](./pet/PetEvolution.tsx)** - Evolution stage tracker
- **[PetInteraction](./pet/PetInteraction.tsx)** - Feed/Play/Study/Rest actions
- **[PetShop](./pet/PetShop.tsx)** - Cosmetic store
- **[ClassPetDisplay](./pet/ClassPetDisplay.tsx)** - Class-wide pet tracking

### XP System
- **[XPBar](./xp/XPBar.tsx)** - Level progress display
- **[XPPopup](./xp/XPPopup.tsx)** - Floating XP notifications
- **[LevelUpModal](./xp/LevelUpModal.tsx)** - Level celebration overlay
- **[XPHistory](./xp/XPHistory.tsx)** - XP transaction history

### Achievement System
- **[AchievementBadge](./achievements/AchievementBadge.tsx)** - Individual achievement
- **[AchievementGrid](./achievements/AchievementGrid.tsx)** - Achievement gallery
- **[AchievementUnlockModal](./achievements/AchievementUnlockModal.tsx)** - Unlock celebration
- **[AchievementShowcase](./achievements/AchievementShowcase.tsx)** - Profile display

### Leaderboards
- **[Leaderboard](./leaderboard/Leaderboard.tsx)** - Class/Grade/School rankings

### Study Music
- **[MusicPlayer](./study-music/MusicPlayer.tsx)** - Floating music player
- **[MusicVisualizer](./study-music/MusicVisualizer.tsx)** - Audio visualizer

## Component Tree

```
gamification/
├── pet/
│   ├── PetDisplay          🐺 Main visual representation
│   ├── PetStats            📊 Four stat bars
│   ├── PetEvolution        ⬆️ Stage progression
│   ├── PetInteraction      🎮 Action buttons
│   ├── PetShop             🛍️ Cosmetic store
│   └── ClassPetDisplay     👥 Class pet tracking
├── xp/
│   ├── XPBar               ⭐ Level progress
│   ├── XPPopup             ✨ Floating notification
│   ├── LevelUpModal        🎉 Celebration overlay
│   └── XPHistory           📜 Transaction history
├── achievements/
│   ├── AchievementBadge    🏆 Single achievement
│   ├── AchievementGrid     🎯 Achievement gallery
│   ├── AchievementUnlockModal 🎊 Unlock celebration
│   └── AchievementShowcase 👤 Profile display
├── leaderboard/
│   └── Leaderboard         🏅 Rankings display
├── study-music/
│   ├── MusicPlayer         🎵 Floating player
│   └── MusicVisualizer     📻 Visualizer bars
└── index.ts                📦 Re-exports all
```

## Basic Usage

### Import All at Once
```typescript
import {
  PetDisplay,
  PetStats,
  XPBar,
  AchievementGrid,
  Leaderboard,
  MusicPlayer,
} from '@/components/gamification';
```

### Import Individual
```typescript
import { PetDisplay } from '@/components/gamification/pet/PetDisplay';
import { XPBar } from '@/components/gamification/xp/XPBar';
```

## Component Props

### PetDisplay
```typescript
interface PetDisplayProps {
  pet: Pet;
  onClick?: () => void;
  interactive?: boolean;
}
```

### XPBar
```typescript
interface XPBarProps {
  currentXP: number;
  xpNeeded: number;
  level: number;
  tier: string;
  totalXP: number;
  variant?: 'compact' | 'full';
  className?: string;
}
```

### Leaderboard
```typescript
interface LeaderboardProps {
  topThree: LeaderboardEntry[];
  allEntries: LeaderboardEntry[];
  currentUserRank: LeaderboardEntry | null;
  scope: LeaderboardScope;
  timeframe: LeaderboardTimeframe;
  gradeLevel?: string;
  onScopeChange?: (scope: LeaderboardScope) => void;
  onTimeframeChange?: (timeframe: LeaderboardTimeframe) => void;
}
```

## State Management

Components use custom React hooks:
- **useXP()** - XP and leveling
- **usePet()** - Pet interactions
- **useAchievements()** - Achievement tracking
- **useSound()** - Sound effects

```typescript
const { currentLevel, awardXP } = useXP();
const { pet, feedPet } = usePet();
const { achievements, checkAchievement } = useAchievements();
const { play } = useSound();
```

## Styling

All components use:
- Tailwind CSS
- Framer Motion animations
- Glass morphism design
- Dark mode by default
- Responsive layouts

## Animations

Heavy use of Framer Motion for:
- Smooth transitions
- Floating animations
- Particle effects
- Confetti celebrations
- Scale/rotate animations
- Progress bar animations

## Responsive Design

All components are mobile-first:
- Touch-friendly buttons (48px+)
- Readable text on small screens
- Proper spacing on mobile
- Optimized for tablets
- Desktop enhancements

## Accessibility

- ARIA labels on interactive elements
- Semantic HTML
- Keyboard navigation support
- Color contrast (WCAG AA)
- Focus indicators
- Screen reader friendly

## Performance

- Optimized re-renders
- useCallback for stable references
- Lazy loading support
- Memoization where needed
- Smooth 60fps animations

## Browser Support

- Chrome/Edge 90+
- Firefox 88+
- Safari 14+
- Mobile browsers

## Testing

All components accept mock data:
```typescript
const mockPet: Pet = {
  id: 'pet-1',
  name: 'Luna',
  species: 'wolf',
  stage: 'juvenile',
  happiness: 75,
  // ...
};

<PetDisplay pet={mockPet} />
```

## Documentation

- See `/src/hooks/gamification/` for hook details
- See `/src/app/api/gamification/` for API routes
- See `GAMIFICATION_GUIDE.md` for comprehensive guide
- See `GAMIFICATION_QUICK_START.md` for examples

## Integration

```typescript
'use client';

import { PetDisplay, XPBar } from '@/components/gamification';
import { usePet, useXP } from '@/hooks/gamification';

export default function Page() {
  const { pet } = usePet();
  const { currentLevel, currentTier } = useXP();

  return (
    <div>
      {pet && <PetDisplay pet={pet} />}
      <XPBar level={currentLevel} tier={currentTier} />
    </div>
  );
}
```

## Contributing

When adding new components:
1. Use TypeScript for type safety
2. Add proper JSDoc comments
3. Include animation for game-like feel
4. Support mock data for testing
5. Make responsive mobile-first
6. Export from index.ts

## License

Part of Wolf Whale LMS
