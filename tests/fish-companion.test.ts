import { existsSync, readFileSync } from 'node:fs'
import path from 'node:path'
import { describe, expect, it } from 'vitest'
import {
  STARTER_SPECIES,
  awardCompanionXp,
  completeWorldActivity,
  createStarterCompanion,
  getHatchStageForXp,
  getLevelForXp,
} from '@/lib/companion/fish-companion'
import {
  COMPANION_ANIMATION_STATES,
  COMPANION_SPRITE_ASSETS,
  SPRITE_ATLAS_CONTRACT,
  companionAnimationForMood,
} from '@/lib/companion/sprite-assets'

const repoRoot = path.resolve(__dirname, '..')
const nonFishLegacyPattern = new RegExp(
  [
    'ice\\s*age',
    ['ice', 'age'].join('-'),
    ['mam', 'moth'].join(''),
    ['sa', 'ber'].join(''),
    ['sl', 'oth'].join(''),
    ['rh', 'ino'].join(''),
    ['giant', 'elk'].join('-'),
    ['glypto', 'dont'].join(''),
    ['gla', 'cier'].join(''),
  ].join('|'),
  'i'
)

describe('WolfWhale fish companion logic', () => {
  it('creates a safe starter fish profile from student choices', () => {
    const profile = createStarterCompanion({
      species: 'clownfish',
      petName: 'Bubbles',
      now: '2026-05-07T19:00:00.000Z',
    })

    expect(profile).toMatchObject({
      species: 'clownfish',
      petName: 'Bubbles',
      hatchStage: 'egg',
      xp: 0,
      level: 1,
      mood: 'egg',
      behaviorMode: 'stationary',
      unlockedCosmetics: ['starter-reef'],
      selectedCosmetics: {
        habitat: 'starter-reef',
      },
    })
  })

  it('uses only fish as starter species', () => {
    expect(STARTER_SPECIES.map((species) => species.id)).toEqual(['clownfish', 'pufferfish'])
    expect(Object.keys(COMPANION_SPRITE_ASSETS)).toEqual(STARTER_SPECIES.map((species) => species.id))
  })

  it('maps learning XP to non-punitive hatch stages', () => {
    expect(getHatchStageForXp(0)).toBe('egg')
    expect(getHatchStageForXp(24)).toBe('egg')
    expect(getHatchStageForXp(25)).toBe('crack-stage-1')
    expect(getHatchStageForXp(50)).toBe('crack-stage-2')
    expect(getHatchStageForXp(75)).toBe('almost-hatching')
    expect(getHatchStageForXp(100)).toBe('hatched')
    expect(getHatchStageForXp(300)).toBe('hatched')
  })

  it('hatches at 100 XP, records positive activity, and unlocks reef cosmetics by level', () => {
    const starter = createStarterCompanion({
      species: 'pufferfish',
      petName: 'Pebble',
      now: '2026-05-07T19:00:00.000Z',
    })

    const profile = awardCompanionXp(starter, {
      amount: 220,
      source: 'quiz_completed',
      label: 'Tidepool quiz practice',
      occurredAt: '2026-05-07T19:10:00.000Z',
    })

    expect(profile.hatchStage).toBe('hatched')
    expect(profile.level).toBe(2)
    expect(profile.mood).toBe('celebrating')
    expect(profile.recentXpEvents[0]).toMatchObject({
      amount: 220,
      source: 'quiz_completed',
      label: 'Tidepool quiz practice',
    })
    expect(profile.unlockedCosmetics).toEqual(expect.arrayContaining(['starter-reef', 'kelp-satchel']))
  })

  it('keeps post-hatch level progression deterministic', () => {
    expect(getLevelForXp(0)).toBe(1)
    expect(getLevelForXp(99)).toBe(1)
    expect(getLevelForXp(100)).toBe(1)
    expect(getLevelForXp(199)).toBe(1)
    expect(getLevelForXp(200)).toBe(2)
    expect(getLevelForXp(300)).toBe(3)
  })

  it('awards a world activity once so room rewards cannot be farmed by reloads', () => {
    const starter = createStarterCompanion({
      species: 'clownfish',
      petName: 'Ripple',
      now: '2026-05-07T19:00:00.000Z',
    })

    const first = completeWorldActivity(starter, 'reef-library-notes', '2026-05-07T19:15:00.000Z')
    const second = completeWorldActivity(first, 'reef-library-notes', '2026-05-07T19:20:00.000Z')

    expect(first.xp).toBe(20)
    expect(second.xp).toBe(20)
    expect(second.worldRewards).toHaveLength(1)
    expect(second.recentXpEvents).toHaveLength(1)
  })

  it('keeps the fish sprite contract aligned', () => {
    expect(SPRITE_ATLAS_CONTRACT).toMatchObject({
      columns: 8,
      rows: 9,
      cellWidth: 192,
      cellHeight: 208,
      width: 1536,
      height: 1872,
    })

    for (const species of STARTER_SPECIES) {
      const asset = COMPANION_SPRITE_ASSETS[species.id]

      expect(asset.sparkleAnchor, `${species.label} needs a sparkle anchor`).toMatch(/\S/)
      expect(asset.emoticonCue, `${species.label} needs a cute face cue`).toMatch(/eye|blush|smile|bubble/i)
      expect(asset.anatomyLock, `${species.label} needs an anatomy lock`).toMatch(/\S/)
    }
  })

  it('uses available fish art previews until final atlases are ready', () => {
    expect(COMPANION_SPRITE_ASSETS.clownfish.basePreviewPath).toBe('/clownfish.svg')
    expect(COMPANION_SPRITE_ASSETS.pufferfish.basePreviewPath).toBe('/images/sea-companion/concepts/puffer-fish-design-bible.png')
  })

  it('chooses sprite animation rows from pet movement and mood', () => {
    expect(companionAnimationForMood({ hatchStage: 'hatched', mood: 'celebrating' })).toBe('celebrating')
    expect(companionAnimationForMood({ hatchStage: 'hatched', mood: 'studying' })).toBe('review')
    expect(companionAnimationForMood({ hatchStage: 'hatched', mood: 'idle', moving: true, direction: 'left' })).toBe('running-left')
    expect(companionAnimationForMood({ hatchStage: 'crack-stage-2', mood: 'hatching' })).toBe('celebrating')
  })

  it('keeps product-facing companion files fish-only', () => {
    const checkedFiles = [
      'app/student/companion-world/page.tsx',
      'components/companion/SeaCompanionClient.tsx',
      'components/companion/SeaWorldClient.tsx',
      'components/lms/StudentCompanionWidget.tsx',
      'lib/companion/fish-companion.ts',
      'lib/companion/sprite-assets.ts',
      'docs/sea-companion-pixel-pet-handoff.md',
    ]

    for (const relativePath of checkedFiles) {
      const absolutePath = path.join(repoRoot, relativePath)
      expect(existsSync(absolutePath), `${relativePath} should exist`).toBe(true)
      const source = readFileSync(absolutePath, 'utf8')

      expect(source, `${relativePath} should stay fish-only`).not.toMatch(nonFishLegacyPattern)
    }
  })

  it('keeps the Supabase species constraint fish-only', () => {
    const migration = readFileSync(path.join(repoRoot, 'supabase/migrations/20260510220050_fish_companion_species.sql'), 'utf8')

    expect(migration).toContain("'clownfish'")
    expect(migration).toContain("'pufferfish'")
    expect(migration).not.toMatch(nonFishLegacyPattern)
  })

  it('requires sparkle-flash and cute emoticon cues for every fish sprite state', () => {
    for (const [stateName, state] of Object.entries(COMPANION_ANIMATION_STATES)) {
      expect(state.requiredCue, `${stateName} needs a visible emotion cue`).toMatch(/\S/)
      expect(state.effectRule, `${stateName} needs an effect cleanup rule`).toMatch(/\S/)
    }

    expect(COMPANION_ANIMATION_STATES.celebrating.requiredCue.toLowerCase()).toContain('sparkle')
    expect(COMPANION_ANIMATION_STATES.greeting.requiredCue.toLowerCase()).toMatch(/bubble|sparkle|heart/)
    expect(COMPANION_ANIMATION_STATES.sad.requiredCue.toLowerCase()).toMatch(/tear|droopy/)
  })
})
