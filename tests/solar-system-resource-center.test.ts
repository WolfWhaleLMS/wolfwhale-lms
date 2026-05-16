import { describe, expect, it } from 'vitest'

import { solarBodies } from '@/components/lms/resource-center/solar-system'

describe('solar system resource metadata', () => {
  it('maps every rendered solar body to one HD generated texture atlas tile', () => {
    const atlasCells = new Set(solarBodies.map((body) => `${body.textureAtlas.column}:${body.textureAtlas.row}`))

    expect(solarBodies).toHaveLength(9)
    expect(solarBodies.every((body) => body.textureAtlas.url === '/solar-system/textures/planet-texture-atlas-v001.png')).toBe(true)
    expect(atlasCells.size).toBe(solarBodies.length)
  })
})
