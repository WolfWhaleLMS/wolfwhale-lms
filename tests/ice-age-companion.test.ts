import { describe, expect, it } from 'vitest'
import {
  awardCompanionXp,
  completeWorldActivity,
  createStarterCompanion,
  getHatchStageForXp,
  getLevelForXp,
  STARTER_SPECIES,
} from '@/lib/companion/ice-age-companion'
import { COMPANION_SPRITE_ASSETS, SPRITE_ATLAS_CONTRACT, companionAnimationForMood } from '@/lib/companion/sprite-assets'

describe('WolfWhale Ice Age Companion logic', () => {
  it('creates a safe starter egg profile from student choices', () => {
    const profile = createStarterCompanion({
      species: 'woolly-mammoth',
      petName: 'Tundra',
      now: '2026-05-07T19:00:00.000Z',
    })

    expect(profile).toMatchObject({
      species: 'woolly-mammoth',
      petName: 'Tundra',
      hatchStage: 'egg',
      xp: 0,
      level: 1,
      mood: 'egg',
      behaviorMode: 'stationary',
      unlockedCosmetics: ['starter-snow'],
      selectedCosmetics: {
        habitat: 'starter-snow',
      },
    })
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

  it('hatches at 100 XP, records positive activity, and unlocks cosmetics by level', () => {
    const starter = createStarterCompanion({
      species: 'woolly-rhino',
      petName: 'Pebble',
      now: '2026-05-07T19:00:00.000Z',
    })

    const profile = awardCompanionXp(starter, {
      amount: 220,
      source: 'quiz_completed',
      label: 'Quiz Cave practice',
      occurredAt: '2026-05-07T19:10:00.000Z',
    })

    expect(profile.hatchStage).toBe('hatched')
    expect(profile.level).toBe(2)
    expect(profile.mood).toBe('celebrating')
    expect(profile.recentXpEvents[0]).toMatchObject({
      amount: 220,
      source: 'quiz_completed',
      label: 'Quiz Cave practice',
    })
    expect(profile.unlockedCosmetics).toEqual(expect.arrayContaining(['starter-snow', 'acorn-satchel']))
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
      species: 'giant-elk',
      petName: 'Moss',
      now: '2026-05-07T19:00:00.000Z',
    })

    const first = completeWorldActivity(starter, 'mammoth-library-notes', '2026-05-07T19:15:00.000Z')
    const second = completeWorldActivity(first, 'mammoth-library-notes', '2026-05-07T19:20:00.000Z')

    expect(first.xp).toBe(20)
    expect(second.xp).toBe(20)
    expect(second.worldRewards).toHaveLength(1)
    expect(second.recentXpEvents).toHaveLength(1)
  })

  it('keeps the approved six-species sprite roster and Codex atlas contract aligned', () => {
    expect(STARTER_SPECIES.map((species) => species.id)).toEqual([
      'woolly-mammoth',
      'saber-tooth-cat',
      'giant-ground-sloth',
      'woolly-rhino',
      'giant-elk',
      'glyptodont',
    ])
    expect(Object.keys(COMPANION_SPRITE_ASSETS)).toEqual(STARTER_SPECIES.map((species) => species.id))
    expect(SPRITE_ATLAS_CONTRACT).toMatchObject({
      columns: 8,
      rows: 9,
      cellWidth: 192,
      cellHeight: 208,
      width: 1536,
      height: 1872,
    })
  })

  it('chooses sprite animation rows from pet movement and mood', () => {
    expect(companionAnimationForMood({ hatchStage: 'hatched', mood: 'celebrating' })).toBe('celebrating')
    expect(companionAnimationForMood({ hatchStage: 'hatched', mood: 'studying' })).toBe('review')
    expect(companionAnimationForMood({ hatchStage: 'hatched', mood: 'idle', moving: true, direction: 'left' })).toBe('running-left')
    expect(companionAnimationForMood({ hatchStage: 'crack-stage-2', mood: 'hatching' })).toBe('celebrating')
  })
})
